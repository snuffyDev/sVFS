import type { Config } from "$lib/types/config";
import type { FileEntry, $File } from "$lib/types/core";
import type { Maybe } from "$lib/types/util";
import { Backend } from "./core";


export class IndexedDB extends Backend {
    constructor(config: Config) {
        super(config);

    }

    override async readFile(path: string, options?: { encoding?: null | undefined; } | null | undefined): Promise<Maybe<FileEntry<$File>>> {
        const hasFile = super.exists(path);
        try {
            if (!hasFile) return undefined;
            const file = await super.readFile(path, options);
            return file;
        } catch (error) {
            console.error(error);
        }
    }
}
