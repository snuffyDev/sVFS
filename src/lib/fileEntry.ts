import { getFileType } from "./constants";
import type { $File, FileEntry, FolderEntry } from "./types/core";
import type { FSMethods, MakeDirectoryOptions } from "./types/structs";

export class FileEnt {
	private constructor(private _data: FileEntry) {}
	get file_type() {
		return this._data.file_type;
	}
	get is_dir() {
		return this._data.is_dir;
	}
	get data() {
		return this._data.data;
	}
	get name() {
		return this._data.name;
	}
	static create(name: string, data: $File): FileEntry {
		return { data, name, file_type: getFileType(data), is_dir: false };
	}
}

export class DirEnt<K = string, V = unknown> {
	private root: Map<string, V>;
	constructor(iterable: Iterable<[string, V]> = []) {
		this.root = new Map<string, V>(iterable);
	}

	public get(path: string) {
		return this.root.get(path);
	}
	public has(path: string) {
		return this.root.has(path);
	}
	public set(path: string, data: V) {
		return this.root.set(path, data);
	}
	public delete(path: string) {
		return this.root.delete(path);
	}
	public clear() {
		return this.root.clear();
	}
}
