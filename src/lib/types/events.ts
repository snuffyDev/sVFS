import type { Config } from "./config";

export interface sVFSGlobalEvents {
    'init': Config;
    'tick': void;
}

export interface sVFSEvent<T = unknown> {
    data?: T,
    type?: string,

}
export interface AdapterEvents {
    'update': sVFSEvent;
}
