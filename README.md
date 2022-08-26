# sVFS

**\*S**nuff's **V**irtual **F**ile **S**ystem\*

An easy to use, customizable, and fast Virtual File System for the browser!

> sVFS is still an early work in progress!
> It's barebones and not ready for use!

## Features

- Adapters
  - IndexedDB
  - In-memory (Map based)
  - Allows for custom implementations and integrations with any backend
- Caches files when you read or write them (saves resources!)

## Basic Setup

```ts
import { sVFS, IndexedDB, type Config } from "to-be-decided";

const config: Config = {
	name: "my-files",
	adapter: IndexedDB.create({
		/** options **/
	}),
};

const fs = sVFS(config);
```

## Basic Usage

Both examples will continue assuming the codeblock above exists.

### Async

shows how you might update a copy of a remote data source.

```ts
async function updateJSON(return_old = true) {
	const response = await fetch("https://some-random.url/list.json");
	const json_data = await response.json();

	// get the list currently stored prior to updating
	const old_list = await fs.readFile("list.json");

	const file_was_written = await fs.writeFile("list.json", json_data); /// returns `void` on success, or Error if error

	if (file_was_written !== undefined) throw file_was_written;

	if (return_old === true) return old_list;
	else return await fs.readFile("list.json");
}
```
