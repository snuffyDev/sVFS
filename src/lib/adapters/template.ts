import type { Config } from "$lib/types/config";
import type { FileEntry, $File, FolderEntry } from "$lib/types/core";
import type { FSMethods, MakeDirectoryOptions } from "$lib/types/structs";
import type { Maybe } from "$lib/types/util";

export abstract class AdapterAbstract implements FSMethods {
    protected constructor(protected config: Config) { }
    mkdir(path: string, options: MakeDirectoryOptions = {}): Promise<string | void> {
        throw new Error("Method not implemented.");
    }
    mkdirSync(path: string, options: MakeDirectoryOptions = {}): string | void {
        throw new Error("Method not implemented.");
    }
    exists(path: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    existsSync(path: string): boolean {
        throw new Error("Method not implemented.");
    }

    readFile(path: string, options?: BufferEncoding): Promise<void | FileEntry<$File> | FolderEntry | ReferenceError>;
    readFile(path: string, options?: BufferEncoding | { encoding?: null; }): Promise<void | FileEntry<$File> | FolderEntry | ReferenceError>;
    readFile(path: string, options?: { encoding?: null; }): Promise<void | FileEntry<$File> | FolderEntry | ReferenceError>;
    readFile(path: unknown, options?: unknown): Promise<void | FileEntry<$File> | FolderEntry | ReferenceError> {
        throw new Error("Method not implemented.");
    }
    readFileSync(path: string, options?: BufferEncoding): void | FileEntry<$File> | FolderEntry | ReferenceError;
    readFileSync(path: string, options?: BufferEncoding | { encoding?: null; }): void | FileEntry<$File> | FolderEntry | ReferenceError;
    readFileSync(path: string, options?: { encoding?: null; }): void | FileEntry<$File> | FolderEntry | ReferenceError;
    readFileSync(path: unknown, options?: unknown): void | FileEntry<$File> | FolderEntry | ReferenceError {
        throw new Error("Method not implemented.");
    }
    readRoot(): Promise<void | FileEntry<$File>[] | FolderEntry[]> {
        throw new Error("Method not implemented.");
    }
    readRootSync(): void | FileEntry<$File>[] | FolderEntry[] {
        throw new Error("Method not implemented.");
    }
    rm(path: string): Promise<void | FileEntry<$File> | FolderEntry | ReferenceError> {
        throw new Error("Method not implemented.");
    }
    rmSync(path: string): void | FileEntry<$File> | FolderEntry | ReferenceError {
        throw new Error("Method not implemented.");
    }
    writeFile(file: string, data: $File): Promise<void | Error> {
        throw new Error("Method not implemented.");
    }
    writeFileSync(path: string, data: $File): void | Error {
        throw new Error("Method not implemented.");
    }

}

export class AdapterTemplate extends AdapterAbstract implements FSMethods {
    protected constructor(config: Config) {
        super(config);
    }
    mkdir(path: string, options?: MakeDirectoryOptions): Promise<string | void> {
        throw new Error("Method not implemented.");
    }
    mkdirSync(path: string, options?: MakeDirectoryOptions): string | void {
        throw new Error("Method not implemented.");
    }

    static create(config: Config): AdapterTemplate {
        return new AdapterTemplate(config);
    };

    static get [Symbol.species]() {
        return AdapterTemplate;
    }
}

export class Testing extends AdapterAbstract {
    readFile(path: string, options?: { encoding?: null | undefined; } | null | undefined): Promise<Maybe<void | FileEntry<$File> | FolderEntry> | ReferenceError> {
        throw new Error("Method not implemented.");
    }
    writeFile(file: string, data: $File): Promise<void | Error> {
        throw new Error("Method not implemented.");
    }
    readRoot(): Promise<void | FileEntry<$File>[] | FolderEntry[]> {
        throw new Error("Method not implemented.");
    }
    mkdir(path: string, contents?: (FileEntry<$File> | FolderEntry)[] | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    rm(path: string): Promise<void | FileEntry<$File> | FolderEntry | ReferenceError> {
        throw new Error("Method not implemented.");
    }
    exists(path: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    private constructor(config: Config) {
        super(config);
    }
    static create(config: Config) {
        return new Testing(config);
    }

}
