import { browser } from "$app/env";
import type { FileEntry, FolderEntry } from "$lib/types/core";

export class IDBStore {
	private $$: Promise<IDBDatabase> | undefined;
	/**
	 * Creates an instance of IDBStore.
	 * @param {string} DB_NAME - Name of the database to be used as a VFS
	 * @param {string} DB_STORE_NAME - Name of the `objectStore` used by IndexedDB
	 * @param {number} [DB_VER=1] - Only change this if you know how IndexedDB versioning works!
	 * @memberof IDBStore
	 */
	constructor(private DB_NAME: string, private DB_STORE_NAME: string, private DB_VER = 1) {
		this.init();
	}

	private init(): void {
		if (!browser) return;
		if (this.$$) {
			return;
		}
		this.$$ = new Promise((resolve, reject) => {
			const request = indexedDB.open(this.DB_NAME, this.DB_VER);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve(request.result);

			request.onupgradeneeded = () => {
				request.result.createObjectStore(this.DB_STORE_NAME);
			};
		});
	}

	public transaction<K = any, T extends (store: IDBObjectStore) => K = (store: IDBObjectStore) => K>(
		type: IDBTransactionMode,
		callback: T,
	): Promise<K | void> {
		if (!browser) {
			return Promise.reject("IndexedDB works only in web browsers.");
		}

		this.init();
		return (this.$$ as Promise<IDBDatabase>).then(
			(db) =>
				new Promise<K | void>((resolve, reject) => {
					const tx = db.transaction(this.DB_STORE_NAME, type);
					tx.oncomplete = () => resolve();
					tx.onabort = tx.onerror = () => reject(tx.error);

					callback(tx.objectStore(this.DB_STORE_NAME));
				}),
		);
	}
	async mkdir<T extends FileEntry | FolderEntry | undefined>(name: string, contents?: Array<T>) {
		const dir = new Map<string, T[]>();
		if (contents) {
			dir.set(name, contents);
		}
		return this.transaction("readwrite", (store) => {
			/** console.log(store); */
			store.put(
				{ name, is_dir: true, file_type: null, $root: dir, num_children: contents?.length } as FolderEntry,
				name,
			);
		});
	}
	async delete(path: string) {
		return this.transaction("readwrite", (store) => {
			store.delete(path);
		});
	}
	async wipe() {
		return this.transaction("readwrite", (store) => {
			store.clear();
		});
	}
	async write(name: string, data: unknown) {
		return this.transaction("readwrite", (store) => {
			store.put(data, name);
		});
	}

	async has(name: string) {
		return this.transaction<boolean>("readonly", (store) => {
			return store.get(name) ? true : false;
		});
	}

	async read(path: string) {
		let req: IDBRequest;
		return this.transaction<void>("readonly", (store) => {
			req = store.get(path);
		}).then(() => req.result);
	}

	async readAll(callback: ((data: any) => void) | undefined = undefined) {
		let request: IDBRequest;
		return this.transaction<void>("readonly", (store) => {
			request = store.getAll();
			return new Promise((resolve, reject) => {
				request.onsuccess = function () {
					resolve(this.result);
				};
				request.onerror = function () {
					reject(this.error);
				};
			});
		}).then(() => request.result as (FileEntry | FolderEntry)[] | undefined);
	}
}
