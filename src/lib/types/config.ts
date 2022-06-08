export interface Config {
    name?: string;
    backend: "InMemory" | "IndexedDB";
    root: string;
}