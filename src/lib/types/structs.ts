import type { $File, FileEntry, FolderEntry, Path, BufferEncoding } from "./core";
import type { Maybe } from "./util";

export interface MakeDirectoryOptions {
    recursive?: boolean;
}
export interface FSMethods {
    exists(path: Path): Promise<boolean>;
    existsSync(path: Path): boolean;
    mkdir(path: Path, options?: MakeDirectoryOptions | undefined, contents?: Array<FileEntry | FolderEntry>): Promise<void | string>;
    mkdirSync(path: Path, options?: MakeDirectoryOptions | undefined, contents?: Array<FileEntry | FolderEntry>): void | string;
    readFile(
        path: Path,
        options?: BufferEncoding
    ): Promise<Maybe<FileEntry | FolderEntry | void> | ReferenceError>;
    readFileSync(
        path: Path,
        options?: BufferEncoding
    ): Maybe<FileEntry | FolderEntry | void> | ReferenceError;
    readRoot(): Promise<FileEntry[] | FolderEntry[] | void>;
    readRootSync(): FileEntry[] | FolderEntry[] | void;
    rm(path: string): Promise<FileEntry | FolderEntry | void | ReferenceError>;
    rmSync(path: string): FileEntry | FolderEntry | void | ReferenceError;
    writeFile(file: Path, data: $File): Promise<void | Error>;
    writeFileSync(path: Path, data: $File): void | Error;
    readdir(path: Path): Promise<FolderEntry | Error>;
}