<script lang="ts">
	import type { FileEntry } from '$lib/types/core';
	import { createEventDispatcher } from 'svelte';

	import { fs } from './../_extern';
	import File from './FileEntry.svelte';
	const { sizeObservable } = fs;
	let files: FileEntry[] = [];
	async function read() {
		const root = await fs.readRoot();
		files = [...root];
		files = files;
	}
	$: $sizeObservable && read();
	const dispatch = createEventDispatcher();

	console.log($sizeObservable, files);
</script>

<aside>
	<ul>
		{#each files as file}
			<File on:click={() => dispatch('active', { file })} {file} />
		{/each}
	</ul>
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
	}
	aside {
		overflow-y: scroll;
		min-height: 100vh;
	}
</style>
