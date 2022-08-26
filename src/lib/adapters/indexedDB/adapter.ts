import type { AdapterConfig, Config } from "$lib/types/config";
import type { FileEntry, $File, FolderEntry, Path } from "$lib/types/core";
import { IDBStore } from "$lib/adapters/indexedDB/.internals/index";
import type { FSMethods, MakeDirectoryOptions } from "$lib/types/structs";
import { LRUCache } from "$lib/utils/cache";
import { Mutex, NativeMutex } from "$lib/utils/mutex";
import { getFileType } from "$lib/constants";
import { EventEmitter } from "$lib/utils/emitter";
import { globalChannel } from "$lib/vfs";
import { browser } from "$app/env";
import posix from "$lib/utils/path";
import { forEach } from "$lib/utils/array";
export class IndexedDB implements FSMethods {
	private db!: IDBStore;
	private $lock!: NativeMutex;
	private $eventEmitter: EventEmitter<Record<string, unknown>> | undefined;
	private canEmitEvents!: boolean;

	private constructor(config: AdapterConfig, wipe: boolean) {
		if (!browser) return;
		this.$lock = new NativeMutex("idb");
		this.db = new IDBStore(`fs_${config.name}` ?? "/", `fs_${config.name}`);
		if (wipe) {
			this.$lock.do(async () => {
				await this.db.wipe();
			});
		}
		if (config.emitUpdates && config.emitUpdates === true) {
			this.$eventEmitter = new EventEmitter({});
		}
		this.canEmitEvents = config.emitUpdates === true ? true : false;
	}

	async mkdir(
		path: string,
		options: MakeDirectoryOptions = {},
		contents?: Array<FileEntry | FolderEntry>,
	): Promise<string | void> {
		return await this.$lock.do(() => {
			try {
				this.db.mkdir(path, contents);
				if (options.recursive) return Promise.resolve(posix.basename(path));
				else return Promise.resolve();
			} catch (error) {
				console.error(error);
				return;
			}
		});
	}
	mkdirSync(
		path: string,
		options: MakeDirectoryOptions = {},
		contents?: Array<FileEntry | FolderEntry>,
	): string | void {
		throw new Error("Not Implemented.");
	}

	async readFile(
		path: string,
		options?: BufferEncoding,
	): Promise<void | FileEntry<$File> | FolderEntry | ReferenceError> {
		return await this.$lock.do(async () => {
			try {
				const checkIfCached = LRUCache.get(path);

				if (typeof checkIfCached !== "undefined") return checkIfCached;
				const file = this.db.read(path);
				if (!file) throw new ReferenceError(`Path \`${path}\` does not exist.`);
				return file;
			} catch (err) {
				console.error(err);
				return err as ReferenceError;
			}
		});
	}
	async readdir(path: Path): Promise<FolderEntry | Error> {
		return await this.$lock.do(async () => {
			try {
				const subdirs = posix.subdirs(path) ?? [];
				const base_dir = subdirs.shift();
				if (!base_dir) throw new ReferenceError(`Path \`${path}\` does not exist.`);
				const checkIfCached = LRUCache.get(base_dir);
				if (typeof checkIfCached !== "undefined") return checkIfCached as FolderEntry | Error;

				const folder = this.db.read(path);
				if (!folder) throw new ReferenceError(`Path \`${path}\` does not exist.`);
				// if (dir !== '/') {
				// if (subdirs.length) {

				// }
				console.log({ subdirs: Array.from(subdirs), folder });
				// }
				return await folder;
			} catch (err) {
				console.error(err);
				return err as ReferenceError;
			}
		});
	}
	readFileSync(path: string, options?: BufferEncoding): void | FileEntry<$File> | FolderEntry | ReferenceError {
		// const aaa = this.readFile(path, options).then((file) => file);
		// return await aaa;
		throw new Error("Not Implemented.");
	}
	writeFileSync(path: string, data: $File): void | Error {
		throw new Error("Not Implemented.");
	}
	readRootSync(): void | FileEntry<$File>[] | FolderEntry[] {
		throw new Error("Not Implemented.");
	}

	rmSync(path: string): void | FileEntry<$File> | FolderEntry | ReferenceError {
		throw new Error("Not Implemented.");
	}
	existsSync(path: string): boolean {
		throw new Error("Not Implemented.");
	}
	/** @internal */
	async writeFile(name: Path, data: $File, is_dir = false): Promise<void | Error> {
		return this.$lock.do(async () => {
			try {
				const entry: FileEntry = { name, data, file_type: getFileType(data), is_dir };
				LRUCache.set(entry);
				await this.db.write(name, entry);
			} catch (err) {
				return err as Error;
			}
		});
	}

	/** @internal */
	async exists(path: string): Promise<boolean> {
		return await this.$lock.do(async () => {
			const hasFile = await this.db.has(path);
			return hasFile as boolean;
		});
	}

	/** @internal */
	async rm(path: string) {
		return this.$lock.do(async () => {
			try {
				const file = this.db.read(path);
				if (!file) throw new ReferenceError(`Path \`${path}\` does not exist.`);
				this.db.delete(path);

				return file;
			} catch (error) {
				console.error(error);
				return error as ReferenceError;
			}
		});
	}

	async readRoot() {
		return this.$lock
			.do(() => {
				return this.db.readAll();
			})
			.then((e) => {
				globalChannel.dispatch("tick", true);
				return e;
			});

		// globalChannel.dispatch('update', []);
	}

	static create(config: AdapterConfig, wipe = true) {
		return new IndexedDB(config, wipe);
	}
}
