import type { IndexedDB } from "$lib/adapters";
import type { MemoryFS } from "$lib/adapters/memFS";
import type { AdapterTemplate } from "$lib/adapters/template";

export interface Config {
    name?: string;
    adapter?: InstanceType<AConstructorTypeOf<AdapterTemplate | IndexedDB | MemoryFS>>;
    root: string;
    emitUpdates?: boolean;
}

export type AdapterConfig = Omit<Config, "adapter">;