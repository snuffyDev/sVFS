import type { Nullable } from "../types/util";

export class Mutex {
    private mutex = Promise.resolve();

    public acquire(): PromiseLike<() => void> {
        let begin: (unlock: () => void) => void = unlock => { };

        this.mutex = this.mutex.then(() => {
            return new Promise(begin);
        });

        return new Promise(res => {
            begin = res;
        });
    }

    public async dispatch<T>(fn: (() => T) | (() => PromiseLike<T>)): Promise<T> {
        const unlock = await this.acquire();
        try {
            return await Promise.resolve(fn());
        } finally {
            unlock();
        }
    }
}

export class IDBMutex {
    private _id: string | number;
    private _db: string;
    private _has: boolean;
    private _release: Nullable<(value?: unknown) => void> = null;
    public constructor(name: string) {
        this._db = name;
        this._id = Math.random();
        this._has = false;

    }
    async has() {
        return this._has;
    }

    async acquire() {
        return new Promise(resolve => {
            navigator.locks.request(this._db + "_lock", { ifAvailable: true }, lock => {
                this._has = !!lock;
                resolve(!!lock);
                return new Promise(resolve => {
                    this._release = resolve;
                });
            });
        });
    }
    async release({ force = false }) {
        this._has = false;
        if (this._release && typeof this._release === 'function') {
            this._release();
        } else if (force) {
            navigator.locks.request(this._db + "_lock", { steal: true }, _ => true);
        }
    }
}