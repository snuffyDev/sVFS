export interface Config {
    name?: string;
    adapter: "InMemory" | "IndexedDB";
    root: string;
}