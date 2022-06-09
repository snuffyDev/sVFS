import { promisify } from "./util";

interface OpenCallbacks {
	upgrade(database: IDBDatabase, previous_version: number, new_version: number | null, transaction: IDBTransaction);
}

export function open(name: string, version: number, { upgrade }: OpenCallbacks) {
	const request = indexedDB.open(name, version);
	const opened = promisify(request);

	if (upgrade) {
		request.addEventListener('upgradeneeded', (event) => {
			upgrade(request.result, event.oldVersion, event.newVersion, request.transaction!);
		});
	}
}