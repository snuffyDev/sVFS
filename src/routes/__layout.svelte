<script lang="ts">
	import { browser } from '$app/env';
	import type { FileEntry } from '$lib/types/core';

	import Sidebar from './_components/Sidebar.svelte';
	import { fs, store } from './_extern';
	let readStart = 0,
		readEnd = 0,
		read = 0;
	let activeFile: FileEntry;
</script>

<div class="grid-container">
	<Sidebar
		on:active={async ({ detail }) => {
			readStart = performance.now();
			const { file } = detail;
			const _file = await fs.readFile(file.name);
			if (_file) {
				activeFile = _file;
			}
			readEnd = performance.now();
			read = readEnd - readStart;
			store.set({ start: readStart, end: readEnd, total: read });
		}}
	/>
	<main>
		<div class="row">
			<slot />

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
		grid-template-columns: clamp(8em, 18em, 25vw) 16fr;
		gap: 1em;
	}
	pre {
		background: #1212129f;
		padding: 1em;
		border-radius: 0.8em;
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
		display: inline-flex;
		flex-direction: column;
		gap: 1em;
	}
</style>
