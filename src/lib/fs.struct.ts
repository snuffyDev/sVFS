import type { Config } from "./types/config";
import type { $File, FileEntry, FolderEntry } from "./types/core";
import { BaseAdapter } from "./adapters";
import type { FSMethods } from "./types/structs";
import type { Maybe } from "./types/util";

export class FS implements FSMethods {
    private _adapter: BaseAdapter;
    constructor(private config: Config) {
        this._adapter = new BaseAdapter(config);
    }
    readFile(path: string, options?: { encoding?: null | undefined; } | null | undefined): Promise<Maybe<void | FileEntry<$File> | FolderEntry> | ReferenceError> {
        return this._adapter.readFile(path, options);
    }
    writeFile(file: string, data: $File, is_dir?: boolean | undefined): Promise<void | Error> {
        return this._adapter.writeFile(file, data, is_dir);
    }
    readRoot(): Promise<void | FileEntry<$File>[] | FolderEntry[]> {
        return this._adapter.readRoot();
    }
    mkdir(path: string, contents?: (FileEntry<$File> | FolderEntry)[] | undefined): Promise<void> {
        return this._adapter.mkdir(path, contents);
    }
    rm(path: string): Promise<void | FileEntry<$File> | FolderEntry | ReferenceError> {
        return this._adapter.rm(path);
    }
    exists(path: string): Promise<boolean> {
        return this._adapter.exists(path);
    }
}