import { InternalFS } from "$lib/fs.struct";
import type { Config } from "$lib/types/config";
import type { $File, $FS } from "$lib/types/core";
import type { FSMethods } from "$lib/types/structs";
import type { Maybe } from "$lib/types/util";
import { setImmediate } from "$lib/utils/setImmediate";

export class Backend implements FSMethods {
    private _name: string | undefined;
    private _fileCount: number;
    private root: InternalFS;
    constructor(private config: Config) {
        this.root = InternalFS.create(config);

        this._name = config.name;
        this._fileCount = this.root.fs.size;
    }
    async readFileSync(path: string, options?: { encoding?: null | undefined; } | null | undefined): Promise<Maybe<$File>> {
        const file = await setImmediate(async () => this.root.get(path).then((value) => value));

        return file as Maybe<$File>;
    }
    async writeFileSync(name: string, data: $File, options?: { encoding?: BufferEncoding | undefined; } | undefined): Promise<void> {
        await this.root.add(name, data).catch(err => console.error(err));
    }


}