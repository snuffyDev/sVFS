import type { Config } from "$lib/types/config";
import type { FileEntry, $File, FolderEntry, Path } from "$lib/types/core";
import { IDBStore } from '$lib/adapters/indexedDB/.internals/index';
import type { FSMethods } from "$lib/types/structs";
import { LRUCache } from "$lib/utils/cache";
import { Mutex } from "$lib/utils/mutex";
import { getFileType } from "$lib/constants";

export class IndexedDB implements FSMethods {
    private db: IDBStore;
    private $lock: Mutex;
    private constructor(config: Config) {
        this.$lock = new Mutex();
        this.db = new IDBStore(`fs_${config.name}` ?? "/", `fs_${config.name}`);
    }
    mkdir(path: string, contents?: (FileEntry<$File> | FolderEntry)[] | undefined): Promise<void> {
        return this.$lock.do(() => {
            try {
                this.db.mkdir(path, contents);
            } catch (error) {
                console.error(error);
                return;
            }
        });
    }

    /** @internal */
    writeFile(name: Path, data: $File, is_dir = false): Promise<void | Error> {
        return this.$lock.do(() => {
            try {
                const entry: FileEntry = { name, data, file_type: getFileType(data), is_dir };
                LRUCache.set(entry);
                this.db.write(name, entry);

            } catch (err) {
                return err as Error;
            }
        });

    }

    /** @internal */
    async readFile(path: string) {
        return await this.$lock.do(async () => {
            try {
                const checkIfCached = LRUCache.get(path);

                if (typeof checkIfCached !== 'undefined') return checkIfCached;
                const file = this.db.read(path);
                if (!file) throw new ReferenceError(`Path \`${path}\` does not exist.`);
                return file;
            } catch (err) {
                console.error(err);
                return err as ReferenceError;
            }
        });
    }

    /** @internal */
    async exists(path: string): Promise<boolean> {
        return await this.$lock.do(async () => {
            const hasFile = await this.db.has(path);
            return (hasFile as boolean);
        });
    }

    /** @internal */
    async rm(path: string) {
        return await this.$lock.do(async () => {
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

        const root = await this.db.transaction<Promise<Array<FileEntry | FolderEntry>>>('readonly', store => {
            return new Promise((resolve, reject) => {

                const req = store.getAll();
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);

            });
        });
        const files = await root;
        return files;
    }

    static create(config: Config) {
        return new IndexedDB(config);
    }

}