import { IndexedDB } from "$lib/adapters";
import type { Config } from "$lib/types/config";
import { sVFS } from "$lib/vfs";
import { writable } from "svelte/store";

const config: Config = { root: "/", name: "filesys", emitUpdates: false };
export const fs = sVFS(config);
export const store = writable({ start: 0, end: 0, total: 0 });
