import type { $File, FileEntry, FolderEntry, Path } from "./core";
import type { Maybe } from "./util";

export interface FSMethods {
    readFile(
        path: Path,
        options?: {
            encoding?: null | undefined;
        } | null
    ): Promise<Maybe<FileEntry | FolderEntry | void> | ReferenceError>;
    writeFile(file: Path, data: $File, is_dir?: boolean): Promise<void | Error>;
    readRoot(): Promise<FileEntry[] | FolderEntry[] | void>;
    mkdir(path: string, contents?: Array<FileEntry | FolderEntry>): Promise<void>;
    rm(path: string): Promise<FileEntry | FolderEntry | void | ReferenceError>;
    exists(path: Path): Promise<boolean>;
}