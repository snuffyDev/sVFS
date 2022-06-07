import type { $File, Path } from "./core";
import type { Maybe } from "./util";

export interface FSMethods {
    readFileSync(
        path: Path,
        options?: {
            encoding?: null | undefined;
        } | null
    ): Promise<Maybe<$File>>;
    writeFileSync(file: Path, data: $File, options?: { encoding?: BufferEncoding; }): Promise<void>;
}