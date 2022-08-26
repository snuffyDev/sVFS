import { browser } from "$app/env";
import type { Nullable } from "../types/util";
import type { Maybe } from "./array";

interface MutexEntry {
    resolve: (entry: [number, () => void]) => void;
    reject: (error: Error) => void;
}
export class Mutex {
    private _queue: MutexEntry[] = [];
    private _currentEntry: Maybe<() => void>;
    private _value = 1;

    get Locked() {
        return this._value <= 0;
    }
    private acquire(): Promise<[number, () => void]> {
        const locked = this.Locked;
        const entry = new Promise<[number, () => void]>((resolve, reject) => {
            this._queue.push({ resolve, reject });
        });
        if (!locked) this.dispatch();

        return entry;
    }
    private dispatch(): void {
        const entry = this._queue.shift();
        // /** console.log(entry); */
        if (!entry) return;
        let released = false;
        this._currentEntry = () => {
            if (released) return;
            released = true;
            this._value++;
            this.dispatch();
        };
        entry.resolve([this._value--, this._currentEntry]);
    }
    public async do<T>(fn: ((value: number) => T) | ((value: number) => PromiseLike<T>)): Promise<T> {
        const [value, unlock] = await this.acquire();
        // /** console.log(unlock, this, value); */
        try {
            return await fn(value);
        } finally {
            unlock();
        }
    }
}

export class NativeMutex {
    private _id!: string | number;
    private _db!: string;
    private _has!: boolean;
    private _release: Nullable<(value?: unknown) => void> = null;
    public constructor(name: string) {
        if (!browser) return;
        this._db = name;
        this._id = Math.random();
        this._has = false;

    }
    async has() {
        return this._has;
    }

    async acquire() {
        if (!browser) return;

        return new Promise(resolve => {
            navigator.locks.request(this._db + "_lock", { mode: 'exclusive' }, lock => {
                this._has = !!lock;
                resolve(!!lock);
                return new Promise<Nullable<(value?: unknown) => void>>(resolve => {
                    this._release = resolve as Nullable<(value?: unknown) => void>;
                });
            });
        });
    }
    async release({ force = false }) {
        if (!browser) return;

        this._has = false;
        if (this._release && typeof this._release === 'function') {
            this._release();
        } else if (force) {
            navigator.locks.request(this._db + "_lock", { steal: true }, _ => true);
        }
    }
    async do<T = unknown>(cb: (() => T) | (() => Promise<T>)): Promise<T> {

        await this.acquire();
        try {
            return await Promise.resolve(cb());
        } finally {
            this.release({ force: true });
        }
    }
}