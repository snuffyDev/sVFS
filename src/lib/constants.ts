import { IndexedDB } from "./adapters";
import type { Config } from "./types/config";
import type { $File } from "./types/core";

export enum FileTypes {
    Binary = "binary",
    PlainText = "plaintext",
}

export function getFileType(file: $File) {
    if (typeof file === 'string') return FileTypes.PlainText;
    const ctor = file.constructor;
    if (ctor === ArrayBuffer || ctor === File || ctor === Blob || ctor === Object) return FileTypes.Binary;
    return null;
}

export const BASE_CONFIG: Config = {
    name: "filesys",
    root: '/',
    adapter: IndexedDB.create({ name: 'filesys', root: '/', emitUpdates: false })
};