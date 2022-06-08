import type { Config } from "./types/config";
import type { $FS, FileEntry } from "./types/core";
import { Mutex } from "./utils/mutex";
import { WritableStore } from "./utils/stores";
import { setImmediate } from "./utils/setImmediate";
import { getFileType } from "./constants";
import { LRUCache } from "./utils/cache";


export class InternalFS {
    private $config: Config;
    private $lock = new Mutex();
    private $root: $FS;
    private _size: WritableStore<number>;
    private constructor(config: Config) {
        this.$root = new Map() as $FS;
        this.$config = config;
        this._size = new WritableStore(this.$root.size);
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
        return new InternalFS(config);
    }
    /** @internal */
    async add<T extends string | ArrayBuffer | File | Blob>(name: string, data: T) {
        return await this.$lock.do(async () => {
            try {
                const entry: FileEntry = { name, data, file_type: getFileType(data) };
                LRUCache.set(entry);
                this.$root.set(name, entry);
                setImmediate(() => this._size.set(this.$root.size));
                return Promise.resolve({ status: 'OK' });
            } catch (err) {
                return Promise.reject(err);
            }
        });
    }

    /** @internal */
    async get<T extends string | ArrayBuffer | File | Blob = string | ArrayBuffer | File | Blob>(path: string): Promise<FileEntry<T> | ReferenceError> {
        return await this.$lock.do(async () => {
            try {
                const checkIfCached = LRUCache.get(path);
                if (checkIfCached) return checkIfCached;
                const file = this.$root.get(path);
                if (!file) throw new ReferenceError(`Path \`${path}\` does not exist.`);
                return file as FileEntry<T>;
            } catch (err) {
                console.error(err);
                return err as ReferenceError;
            }
        });
    }
    async getAll<T extends string | ArrayBuffer | File | Blob = string | ArrayBuffer | File | Blob>(): Promise<FileEntry<T>[]> {
        return await this.$lock.do(async () => {
            try {
                const entries = [...this.$root.values()];

                return entries as FileEntry<T>[];
            } catch (err) {
                console.error(err);
                return [];
            }
        });
    }
    /** @internal */
    async has(path: string): Promise<boolean> {
        return await this.$lock.do(async () => {
            const hasFile = this.$root.has(path);
            return hasFile;
        });
    }

    /** @internal */
    async delete<T extends string | ArrayBuffer | File | Blob = string | ArrayBuffer | File | Blob>(path: string): Promise<FileEntry<T> | ReferenceError> {
        return await this.$lock.do(async () => {
            try {

                const file = this.$root.get(path);
                if (!file) throw new ReferenceError(`Path \`${path}\` does not exist.`);
                this.$root.delete(path);
                setImmediate(() => this._size.set(this.$root.size));
                return file as FileEntry<T>;
            } catch (error) {
                console.error(error);
                return error as ReferenceError;
            }
        });
    }
}