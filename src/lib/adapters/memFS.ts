import type { Config } from "../types/config";
import type { $File, $FS, FileEntry, FolderEntry } from "../types/core";
import { Mutex } from "../utils/mutex";
import { WritableStore } from "../utils/stores";
import { setImmediate } from "../utils/setImmediate";
import { getFileType } from "../constants";
import { LRUCache } from "../utils/cache";
import type { FSMethods, MakeDirectoryOptions } from "$lib/types/structs";
import { forEach } from "$lib/utils/array";
import posix from "$lib/utils/path";

export class MemoryFS implements FSMethods {
	private $config: Config;
	private $lock = new Mutex();
	private $root: $FS;
	private _size: WritableStore<number>;
	private constructor(config: Config) {
		this.$root = new Map() as $FS;
		this.$config = config;
		this._size = new WritableStore(this.$root.size);
	}
	async mkdir(
		path: string,
		options?: MakeDirectoryOptions,
		contents?: Array<FileEntry | FolderEntry>,
	): Promise<string | void> {
		return await this.$lock.do(async () => {
			const folder = new Map() as $FS;
			// if (options.recursive) {
			// 	const pathParts = path.split(/\/|\\\\/g);
			// 	let part;
			// 	for (let idx = 0; ;){
			// 		try {
			// 			await this.readdir(pathParts[idx]);
			// 		} catch (err) {

			// 		}
			// 	}
			// }
			if (contents && contents.length) {
				// eslint-disable-next-line no-inner-declarations
				function setEntry(item: FileEntry | FolderEntry) {
					folder.set(item.name, item);
				}
				forEach(contents, setEntry);
			}
			this.$root.set(path, folder);
		});
	}
	mkdirSync(path: string, options?: MakeDirectoryOptions, contents?: Array<FileEntry | FolderEntry>): string | void {
		throw new Error("Not Implemented.");
		return this.mkdir(path, options, contents);
	}

	readFileSync(path: string): void | FileEntry<$File> | FolderEntry | ReferenceError {
		throw new Error("Not Implemented.");

		return this.readFile(path);
	}
	writeFileSync(path: string, data: $File): void | Error {
		throw new Error("Not Implemented.");

		return this.writeFile(path, data);
	}
	readRootSync(): void | FileEntry<$File>[] | FolderEntry[] {
		throw new Error("Not Implemented.");

		return this.readRoot();
	}
	rmSync(path: string): void | FileEntry<$File> | FolderEntry | ReferenceError {
		throw new Error("Not Implemented.");

		return this.rm(path);
	}
	existsSync(path: string): boolean {
		throw new Error("Not Implemented.");

		return this.exists(path);
	}
	async readdir(path: string): Promise<FolderEntry> {
		const entry = await this.readFile(path);
		if (entry.is_dir) return entry as FolderEntry;
	}
	public get config() {
		return this.$config;
	}
	public get fs() {
		return this.$root;
	}
	public get mutex() {
		return this.$lock;
	}
	public get size() {
		return this._size;
	}
	public static create(config: Config) {
		return new MemoryFS(config);
	}

	async writeFile(path: string, data: $File) {
		return await this.$lock.do(async () => {
			try {
				const entry: FileEntry = { name: path, data, file_type: getFileType(data), is_dir: false };
				LRUCache.set(entry);
				this.$root.set(path, entry);
				setImmediate(() => this._size.set(this.$root.size));
			} catch (err) {
				return Promise.reject(err);
			}
		});
	}
	/** @internal */
	async readFile(path: string): Promise<FileEntry> {
		return await this.$lock.do(async () => {
			try {
				const checkIfCached = LRUCache.get(path);
				if (typeof checkIfCached !== "undefined") return checkIfCached;

				const file = this.$root.get(path);
				if (!file) throw new ReferenceError(`Path \`${path}\` does not exist.`);
				// globalChannel.dispatch('update', [...this.$root]);

				return file as FileEntry;
			} catch (err) {
				console.error(err);
				// return err as ReferenceError;
				throw err;
			}
		});
	}
	async readRoot(): Promise<(FileEntry | FolderEntry)[]> {
		return await this.$lock.do(async () => {
			try {
				const entries = [...this.$root.values()];
				// globalChannel.dispatch('update', [...this.$root]);
				/** console.log('wowowowo'); */
				return entries as FileEntry[];
			} catch (err) {
				console.error(err);
				return [];
			}
		});
	}
	/** @internal */
	async exists(path: string): Promise<boolean> {
		return await this.$lock.do(async () => {
			const hasFile = this.$root.has(path);
			return hasFile;
		});
	}

	/** @internal */
	async rm(path: string): Promise<FileEntry | ReferenceError> {
		return await this.$lock.do(async () => {
			try {
				const file = this.$root.get(path);
				if (!file) throw new ReferenceError(`Path \`${path}\` does not exist.`);
				this.$root.delete(path);
				setImmediate(() => this._size.set(this.$root.size));
				return file as FileEntry;
			} catch (error) {
				console.error(error);
				return error as ReferenceError;
			}
		});
	}
}
