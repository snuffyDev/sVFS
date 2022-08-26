import { browser } from '$app/env';
import type { IndexedDB } from './adapters';
import type { MemoryFS } from './adapters/memFS';
import type { AdapterTemplate } from './adapters/template';
import { BASE_CONFIG } from './constants';
import { FS } from './fs.struct';
import type { Config } from './types/config';
import type { sVFSGlobalEvents } from './types/events';
import type { Maybe, Nullable } from './types/util';
import { EventEmitter } from './utils/emitter';

let mounted = false;
let fs: FS;
const $$config: Config = {};

function configGuard(config: Config): config is Config {
    return (config as Config).root !== undefined;
}
export const globalChannel = new EventEmitter<sVFSGlobalEvents>(browser ? {} : {});
export function sVFS({ adapter, ...config }: Config): FS {

    if (mounted === true) return fs;
    Object.assign($$config, BASE_CONFIG, config);
    /** console.log(config); */
    if (!configGuard(config)) throw new TypeError(`The type of the provided config is invalid.`, { cause: config });
    globalChannel.dispatch('init', $$config);
    fs = new FS($$config);
    mounted = true;
    return fs;
}

export function getConfig(): Nullable<Config> {
    return $$config ? ($$config as Config) : null;
}