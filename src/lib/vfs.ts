import { IndexedDB } from '$lib/backends';
import { BASE_CONFIG } from './constants';
import type { Config } from './types/config';
let mounted = false;
let fs: IndexedDB;
function configGuard(config: Config): config is Config {
    return (config as Config).backend !== undefined;
}
export function sVFS(config: Config = BASE_CONFIG): IndexedDB {
    if (mounted === true) return fs;
    config = Object.assign({}, BASE_CONFIG, config);
    if (!configGuard(config)) throw new TypeError(`The type of the provided config is invalid.`, { cause: config });
    const type = config.backend;
    switch (type) {
        case "IndexedDB":
            fs = new IndexedDB(config);
            mounted = true;
            return fs;
        default:
            fs = new IndexedDB(config);
            mounted = true;
            return fs;
    }
}