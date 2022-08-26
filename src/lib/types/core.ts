import type { Nullable } from "./util";

export interface FileEntry<T extends $File = $File> {
	data: T;
	name: string;
	file_type: Nullable<string>;
	is_dir: boolean;
	// path: string;
}
export interface FolderWrapper extends $FS {}
export interface FolderEntry extends FileEntry {
	num_children: number;
	$root: Map<string, any>;
}

export type $File = string | ArrayBuffer | File | Blob;
export type $FS = Map<string, Nullable<FileEntry | FolderEntry> | Nullable<(FileEntry | FolderEntry)[] | $FS>>;

export type Path = string;
export type BufferEncoding = "utf-8" | "base64" | "binary" | "utf8";

export type EventType = string;
export type EventCallback<T = unknown> = (...payload: T[]) => void;
export type EventListeners<
	Events extends Record<string, unknown>,
	Name extends keyof Events = keyof Events & string,
> = Map<Name, EventCallback<Events[Name]>[]>;

export interface IEventEmitter {
	on(type: EventType, cb: EventCallback): void;
	dispatch<T>(type: EventType, ...args: T[]): void;
	off(type: EventType, cb: EventCallback): void;
}
