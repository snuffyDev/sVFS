import { BASE_CONFIG } from './constants';
import { FS } from './fs.struct';
import type { Config } from './types/config';
import type { Maybe, Nullable } from './types/util';

let mounted = false;
let fs: FS;
let $$config: Maybe<Config>;

function configGuard(config: Config): config is Config {
    return (config as Config).root !== undefined;
}
export function sVFS(config: Config): FS {
    if (mounted === true) return fs;
    $$config = config;
    console.log(config);
    if (!configGuard(config)) throw new TypeError(`The type of the provided config is invalid.`, { cause: config });

    fs = new FS($$config);
    mounted = true;
    return fs;
}

export function getConfig(): Nullable<Config> {
    return $$config ? ($$config as Config) : null;
}