import { InternalFS } from "$lib/fs.struct";
import type { Config } from "$lib/types/config";
import type { $File, $FS, FileEntry } from "$lib/types/core";
import type { FSMethods } from "$lib/types/structs";
import type { Maybe } from "$lib/types/util";
import { setImmediate } from "$lib/utils/setImmediate";
import { WritableStore } from "$lib/utils/stores";

export class Backend implements FSMethods {
    private _name: string | undefined;
    private _fileCount: number;
    private root: InternalFS;
    private __unsubscriber: () => void;
    private _hasBeenDisposed = false;
    constructor(private config: Config) {
        this.root = InternalFS.create(config);

        this._name = config.name;
        this._fileCount = 0;
        this.__unsubscriber = this.root.size.subscribe((value) => {
            this._fileCount = value;
        });

    }
    public get size() {
        return this._fileCount;
    }
    public get sizeObservable() {
        return this.root.size;
    }
    async exists(path: string): Promise<boolean> {
        return this.root.has(path);
    }
    async readRoot(): Promise<FileEntry[]> {
        return this.root.getAll();
    }
    async readFile(path: string, options?: { encoding?: null | undefined; } | null | undefined): Promise<Maybe<FileEntry<$File>>> {
        const file = await setImmediate(async () => await this.root.get(path).then((value) => value));

        return file as FileEntry<$File>;
    }
    async writeFile(name: string, data: $File, options?: { encoding?: BufferEncoding | undefined; } | undefined): Promise<void> {
        await this.root.add(name, data).catch(err => console.error(err));
    }

    public dispose() {
        if (this._hasBeenDisposed) return;
        this._hasBeenDisposed = true;
        this.__unsubscriber();
    }
}