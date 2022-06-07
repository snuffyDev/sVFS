import type { Nullable } from "./util";
export type $File = string | ArrayBuffer | File | Blob;
export type $FS = Map<string, Nullable<$File>>;

export type Path = string;
export type BufferEncoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex';
