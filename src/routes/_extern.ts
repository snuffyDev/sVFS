import { sVFS } from "$lib/vfs";
import { writable } from "svelte/store";

export const fs = sVFS({ backend: 'IndexedDB', root: '/', name: 'cool' });
export const store = writable({ start: 0, end: 0, total: 0 });