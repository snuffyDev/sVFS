import type { FSBuffer } from '../../../types/buffer';
export class IDBReadOnlyTransaction {
    constructor(protected tx: IDBTransaction, protected objectStore: IDBObjectStore) {

    }

    public get(key: string, cb: (arg1, arg2) => void) {
        try {
            const req: IDBRequest = this.objectStore.get(key);
            let res;
            req.onsuccess = (ev) => {
                res = (ev.target as any).result;

            };
            let handle;
            return function () {
                setTimeout(cb, 500);
                if (!res) handle = setInterval(() => { if (!res) return; else clearInterval(handle); }, 100);
                return cb(null, res);

            };
            return function () {
                setTimeout(cb, 0);
            };
            setTimeout(() => {
                new Promise((resolved) => {
                    cb(null, res);

                });
            });
        } catch (error) {
            console.error(error);
        }
    }
}

export class IDBReadWriteTransaction extends IDBReadOnlyTransaction {
    constructor(tx: IDBTransaction, objectStore: IDBObjectStore) {
        super(tx, objectStore);
    }

    public put(key: string, data: any, cb: (arg1, arg2) => void) {
        try {
            let r: IDBRequest;

            r = this.objectStore.add(data, key);

            r.onsuccess = event => {
                cb(null, true);
            };
        } catch (error) {
            console.error(error);
        }
    }

    public commit(cb: (arg1) => void) {
        setTimeout(cb, 0);
    }
}


export class SyncIndexedDB {
    public static create(DB_NAME: string, DB_STORE_NAME: string, cb: (arg1, arg2) => void) {

        const req: IDBOpenDBRequest = indexedDB.open(DB_NAME, 1);

        req.onupgradeneeded = event => {
            const db: IDBDatabase = (<any>event.target).result;

            if (db.objectStoreNames.contains(DB_STORE_NAME)) {
                db.deleteObjectStore(DB_STORE_NAME);

            }
            db.createObjectStore(DB_STORE_NAME);

        };

        req.onsuccess = event => {
            cb(null, new SyncIndexedDB((<any>event.target).result, DB_STORE_NAME));

        };
        req.onerror = error => console.log(error);
    }

    constructor(protected db: IDBDatabase, private storeName: string) {

    }

    public transaction(type: 'readwrite'): IDBReadWriteTransaction;
    public transaction(type: 'readonly'): IDBReadOnlyTransaction;
    public transaction(type: 'readwrite' | 'readonly' = 'readwrite') {
        const tx = this.db.transaction(this.storeName, type), objectStore = tx.objectStore(this.storeName);

        if (type === 'readwrite') {
            return new IDBReadWriteTransaction(tx, objectStore);
        } else if (type === 'readonly') {
            return new IDBReadOnlyTransaction(tx, objectStore);
        }
    }
    public wipe(cb: (arg) => void) {
        try {
            const tx = this.db.transaction(this.storeName, 'readwrite'), objectStore = tx.objectStore(this.storeName), r: IDBRequest = objectStore.clear
                ();

            r.onsuccess = event => {
                setTimeout(cb, 0);
            };
        } catch (error) {
            console.error(error);
        }
    }
}