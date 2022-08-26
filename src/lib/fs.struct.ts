import type { Config } from "./types/config";
import type { $File, FileEntry, FolderEntry, Path } from "./types/core";
import type { BaseAdapter, IndexedDB } from "./adapters";
import type { FSMethods, MakeDirectoryOptions } from "./types/structs";
import type { Maybe } from "./types/util";
import type { AdapterTemplate } from "./adapters/template";
import type { MemoryFS } from "./adapters/memFS";
import * as posix from "./utils/path";

export class FS implements FSMethods {
	private _adapter: AdapterTemplate | IndexedDB | MemoryFS;

	constructor(private config: Config) {
		this._adapter = config.adapter;
	}
	mkdir(path: Path, options: MakeDirectoryOptions, contents?: Array<FileEntry | FolderEntry>): Promise<string | void> {
		return this._adapter.mkdir(path, options, contents);
	}
	mkdirSync(path: string, options: MakeDirectoryOptions, contents?: Array<FileEntry | FolderEntry>): void | string {
		return this._adapter.mkdirSync(path, options, contents);
	}
	readFile(path: string, options?: BufferEncoding): Promise<void | FileEntry<$File> | FolderEntry | ReferenceError>;
	readFile(
		path: string,
		options?: BufferEncoding | { encoding?: null },
	): Promise<void | FileEntry<$File> | FolderEntry | ReferenceError>;
	readFile(
		path: string,
		options?: BufferEncoding | undefined,
	): Promise<void | FileEntry<$File> | FolderEntry | ReferenceError> {
		return this._adapter.readFile(path, options);
	}

	public _pipe(args) {
		return this;
	}

	public exists(path: string): Promise<boolean> {
		return this._adapter.exists(path);
	}

	public existsSync(path: string): boolean {
		return this._adapter.existsSync(path);
	}

	public readFileSync(path: string): void | FileEntry<$File> | FolderEntry | ReferenceError {
		return this._adapter.readFileSync(path);
	}

	public readRoot(): Promise<void | FileEntry<$File>[] | FolderEntry[]> {
		return this._adapter.readRoot();
	}

	public readRootSync(): void | FileEntry<$File>[] | FolderEntry[] {
		return this._adapter.readRootSync();
	}

	public rm(path: string): Promise<void | FileEntry<$File> | FolderEntry | ReferenceError> {
		return this._adapter.rm(path);
	}

	public rmSync(path: string): void | FileEntry<$File> | FolderEntry | ReferenceError {
		return this._adapter.rmSync(path);
	}

	public writeFile(file: string, data: $File, is_dir?: boolean | undefined): Promise<void | Error> {
		return this._adapter.writeFile(file, data, is_dir);
	}

	public writeFileSync(path: string, data: $File): void | Error {
		return this._adapter.writeFileSync(path, data);
	}
	public readdir(path: string): Promise<FolderEntry | Error> {
		return this._adapter.readdir(path);
	}
}
