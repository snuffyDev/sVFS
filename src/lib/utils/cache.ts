import type { FileEntry } from "$lib/types/core";
import type { Maybe } from "./array";

class FileCache {
    private _: Map<string, FileEntry>;
    constructor(private maxEntries = 50) {
        this._ = new Map<string, FileEntry>();

    }

    set(file: FileEntry) {
        if (this._.size >= this.maxEntries) {
            const itemToDelete = this._.keys().next().value;
            this._.delete(itemToDelete);
        }
        this._.set(file.name, file);
    }
    has(file_name: string) {
        return this._.has(file_name);
    }

    get(file_name: string) {
        const hasEntry = this._.has(file_name);
        let entry: Maybe<FileEntry> = undefined;
        if (hasEntry) {
            entry = this._.get(file_name) as FileEntry;
            this._.delete(file_name);
            this._.set(file_name, entry);

        }
        return entry;
    }
}

export const LRUCache = new FileCache(50);