import { MemoryFS } from "$lib/adapters/memFS";
import type { Config } from "$lib/types/config";
import type { $File, $FS, FileEntry, FolderEntry } from "$lib/types/core";
import type { FSMethods } from "$lib/types/structs";
import type { Maybe } from "$lib/types/util";
import { IndexedDB } from "./indexedDB/adapter";

export class BaseAdapter implements FSMethods {
    private _name: string | undefined;
    private _fileCount: number;
    private root: MemoryFS | IndexedDB;
    private _hasBeenDisposed = false;
    constructor(private config: Config) {

        switch (config.adapter) {
            case "InMemory":
                this.root = MemoryFS.create(config);
                break;
            case "IndexedDB":
                this.root = IndexedDB.create(config);
                break;
            default:
                this.root = MemoryFS.create(config);
        };


        this._name = config.name;
        this._fileCount = 0;


    }
    readFile(path: string, options?: { encoding?: null | undefined; } | null | undefined): Promise<Maybe<void | FileEntry<$File> | FolderEntry> | ReferenceError> {
        return this.root.readFile(path);
    }
    writeFile(file: string, data: $File, is_dir?: boolean | undefined): Promise<void | Error> {
        return this.root.writeFile(file, data, is_dir);
    }
    readRoot(): Promise<void | FileEntry<$File>[] | FolderEntry[]> {
        return this.root.readRoot();
    }
    mkdir(path: string, contents?: (FileEntry<$File> | FolderEntry)[] | undefined): Promise<void> {
        return this.root.mkdir(path, contents);
    }
    rm(path: string): Promise<void | FileEntry<$File> | FolderEntry | ReferenceError> {
        return this.root.rm(path);
    }
    exists(path: string): Promise<boolean> {
        return this.root.exists(path);
    }

    public dispose() {
        if (this._hasBeenDisposed) return;
        this._hasBeenDisposed = true;
    }
}