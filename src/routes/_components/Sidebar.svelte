<script lang="ts">
	import { browser } from "$app/env";

	import type { FileEntry } from "$lib/types/core";
	import { globalChannel } from "$lib/vfs";
	import { createEventDispatcher } from "svelte";

	import { fs } from "./../_extern";
	import File from "./FileEntry.svelte";
	const dispatch = createEventDispatcher();

	let files: FileEntry[] = [];
	function setFiles(data) {
		files.push(data);
		files = data;
	}
	async function read() {
		if (!browser) return;
		// /** console.log(e); */
		const test = await fs.readRoot();
		// console.log(test);
		if (Array.isArray(test)) files = test;
		const testSub = await fs.readFile("/subdir");

		// console.log(testSub);
		dispatch("hasSubdir", { testSub });
	}
	globalChannel.on("update:write", async () => await read());
	let showFiles = false;
	// $: /** console.log(files); */
</script>

<aside>
	<button
		on:click={() => {
			showFiles = !showFiles;
		}}>{showFiles ? `Hide` : `Show`} Files</button
	>
	{#if showFiles}
		<ul>
			{#each files as file}
				<File on:click={() => dispatch("active", { file })} {file} />
			{/each}
		</ul>
	{/if}
</aside>

<style lang="scss">
	li,
	ul {
		line-height: 1.2;
		padding: 0;
		margin: 0;
		list-style: none;
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 0em;
		min-height: inherit;
		overflow-y: auto;

		contain: content;
	}
	aside {
		overflow-y: scroll;
		// position: absolute;
		contain: content;
	}
</style>
