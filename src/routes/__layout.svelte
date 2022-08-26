<script lang="ts">
	import { browser } from "$app/env";
	import type { $FS, FileEntry } from "$lib/types/core";

	import Sidebar from "./_components/Sidebar.svelte";
	import { fs, store } from "./_extern";
	let readStart = 0,
		readEnd = 0,
		read = 0;
	let activeFile: FileEntry;
	let mapped: string;
</script>

<div class="grid-container">
	<Sidebar
		on:hasSubdir={({ detail }) => {
			const dirEntry = detail.testSub;
			console.log(dirEntry);
			mapped = JSON.stringify([...(dirEntry?.$root?.entries() || [])]);
		}}
		on:active={async ({ detail }) => {
			if (!browser) return;
			readStart = window.performance.now();
			const { file } = detail;
			const _file = await fs.readFile(file.name);
			if (_file) {
				activeFile = _file;
			}
			readEnd = window.performance.now();
			read = readEnd - readStart;
			store.set({ start: readStart, end: readEnd, total: read });
		}}
	/>
	<main>
		<div class="row">
			<slot />
			{#if mapped}
				<div class="container">
					<p>Test Subdirectory</p>
					<pre><code>{mapped}</code></pre>
				</div>
			{/if}
			{#if activeFile}
				<div class="container">
					<p>File `{activeFile.name}`</p>
					<!-- <hr /> -->
					<span>Contents</span>
					<pre><code>{activeFile.data}</code></pre>
				</div>
			{/if}
		</div>
	</main>
</div>

<style lang="scss">
	.grid-container {
		display: grid;
		grid-template-columns: clamp(8em, 18em, 25vw) auto;
		gap: 1em;
		min-width: 100%;
		position: absolute;
		inset: 0;
		max-width: 100%;
	}
	pre {
		background: #1212129f;
		padding: 1em;
		border-radius: 0.8em;
		white-space: normal;
		border: #f2f2f23a 0.01em solid;
	}
	h5 {
		margin: 0;
	}
	.container {
		display: flex;
		flex-direction: column;
		background: #5050504d;
		padding: 0.5em;
		border-radius: 0.2em;
	}
	main {
		padding: 0.5em;
		display: flex;

		flex-direction: column;
		gap: 1em;
		overflow-y: auto;
	}
</style>
