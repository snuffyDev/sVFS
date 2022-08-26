import type { IndexedDB } from "$lib/adapters";
import type { MemoryFS } from "$lib/adapters/memFS";
import type { AdapterTemplate } from "$lib/adapters/template";

export type VFSAdapterNames<T extends AdapterTemplate = AdapterTemplate> = IndexedDB | MemoryFS | T;

export type VFSAdapters<Type extends ,Keys extends keyof VFSAdapterNames<Type>=  keyof VFSAdapterNames<Type>> = VFSAdapterNames<Keys>