import type { Config } from "../types/config";
import type { $File, $FS, FileEntry, FolderEntry } from "../types/core";
import { Mutex } from "../utils/mutex";
import { WritableStore } from "../utils/stores";
import { setImmediate } from "../utils/setImmediate";
import { getFileType } from "../constants";
import { LRUCache } from "../utils/cache";
import type { FSMethods } from "$lib/types/structs";
import { forEach } from "$lib/utils/array";


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
    async mkdir(path: string, contents?: (FileEntry<$File> | FolderEntry)[] | undefined): Promise<void> {
        return await this.$lock.do(async () => {
            const folder = (new Map() as $FS);
            if (Array.isArray(contents)) {
                forEach(contents, (item) => {
                    folder.set(item.name, item);
                });
            }
            this.$root.set(path, contents ?? null);
        });
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

    async writeFile(path: string, data: $File, is_dir = false) {
        return await this.$lock.do(async () => {
            try {
                const entry: FileEntry = { name: path, data, file_type: getFileType(data), is_dir };
                LRUCache.set(entry);
                this.$root.set(path, entry);
                setImmediate(() => this._size.set(this.$root.size));

            } catch (err) {
                return Promise.reject(err);
            }
        });
    }
    /** @internal */
    writeFileSync<T extends string | ArrayBuffer | File | Blob>(name: string, data: T, is_dir = false) {
        const result = this.$lock.do(() => {
            try {
                const entry: FileEntry = { name, data, file_type: getFileType(data), is_dir };
                LRUCache.set(entry);
                this.$root.set(name, entry);
                setImmediate(() => this._size.set(this.$root.size));
                return { status: 'OK' };
            } catch (err) {
                return err as Error;
            }
        }).then((value) => value);

    }

    /** @internal */
    async readFile(path: string): Promise<FileEntry | ReferenceError> {
        return await this.$lock.do(async () => {
            try {

                const checkIfCached = LRUCache.get(path);
                if (typeof checkIfCached !== 'undefined') return checkIfCached;

                const file = this.$root.get(path);
                if (!file) throw new ReferenceError(`Path \`${path}\` does not exist.`);

                return file as FileEntry;
            } catch (err) {
                console.error(err);
                return err as ReferenceError;
            }
        });
    }
    async readRoot(): Promise<(FileEntry | FolderEntry)[]> {
        return await this.$lock.do(async () => {
            try {
                const entries = [...this.$root.values()];

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