import type { Config } from "./types/config";
import type { $FS } from "./types/core";
import { Mutex } from "./utils/mutex";

const BASE_CONFIG: Config = {
    name: "filesys",
    sep: "Unix"
};

export class InternalFS {
    private $config: Config;
    private $lock = new Mutex();
    private _: $FS;

    private constructor(config: Config) {
        this._ = new Map() as $FS;
        this.$config = config;
    }

    public get config() {
        return this.$config;
    }
    public get fs() {
        return this._;
    }
    public get mutex() {
        return this.$lock;
    }
    public static create(config = BASE_CONFIG) {
        return new InternalFS(config);
    }
    /** @internal */
    async add<T extends string | ArrayBuffer | File | Blob>(name: string, data: T) {
        return await this.$lock.dispatch(async () => {
            try {
                this._.set(name, data);
                return Promise.resolve({ status: 'OK' });
            } catch (err) {
                return Promise.reject(err);
            } finally {
                Promise.resolve();
            }
        });
    }

    /** @internal */
    async get<T extends string | ArrayBuffer | File | Blob = string | ArrayBuffer | File | Blob>(path: string): Promise<T | ReferenceError> {
        return await this.$lock.dispatch(async () => {
            try {
                const file = this._.get(path);
                if (!file) throw new ReferenceError(`Path \`${path}\` does not exist.`);
                return file as T;
            } catch (err) {
                console.error(err);
                return err as ReferenceError;
            }
        });
    }

    /** @internal */
    async delete<T extends string | ArrayBuffer | File | Blob = string | ArrayBuffer | File | Blob>(path: string): Promise<T | ReferenceError> {
        return await this.$lock.dispatch(async () => {
            try {
                const file = this._.get(path);
                if (!file) throw new ReferenceError(`Path \`${path}\` does not exist.`);
                this._.delete(path);
                return file as T;
            } catch (error) {
                console.error(error);
                return error as ReferenceError;
            }
        });
    }
}