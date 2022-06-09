<script lang="ts">
	import { browser } from '$app/env';

	import { getFileType } from '$lib/constants';
	import type { FileEntry } from '$lib/types/core';
	import { forEach } from '$lib/utils/array';

	import { sVFS } from '$lib/vfs';
	import Sidebar from './_components/Sidebar.svelte';
	import { fs, store } from './_extern';

	async function start() {
		if (!browser) return;
		timeStart = performance.now();
		const arr = Array(100)
			.fill(false)
			.forEach((_, idx) => {
				fs.writeFile(
					crypto.randomUUID(),
					idx % 2 ? `index: ${idx}` : new Blob([`index: ${idx}`], { type: 'text/plain' })
				);
			});

		timeEnd = performance.now();
		time = timeEnd - timeStart;
	}
	let timeStart = 0;
	let timeEnd = 0;
	let time = 0;
	let readStart = 0;
	let readEnd = 0;
	let read = 0;
	let fetchTotal = 0;
	async function main() {
		if (!browser) return;
		readStart = performance.now();
		console.time('testing');
		console.time('fetch');
		const startFetch = performance.now();
		const res = await fetch('https://api.reddit.com/.json?limit=5', {
			method: 'GET'
		});
		const endFetch = performance.now();
		const cloned = res.clone(),
			cloned2 = cloned.clone(),
			cloned3 = cloned2.clone();
		const json = await cloned3.json();
		const blob = await cloned2.blob();
		const buffer = await cloned.arrayBuffer();
		const text = await res.text();
		console.timeEnd('fetch');
		const jsonF = await fs.writeFile(`/json`, json);
		const blobF = await fs.writeFile('/blob', blob);
		const bufferF = await fs.writeFile('/buffer', buffer);
		const textF = await fs.writeFile('/text', text);
		forEach(['/blob', '/json', '/buffer', '/text'], (name) => {
			console.log(name, fs.mkdir(name));
			console.log(fs.readFile(name));
		});
		readEnd = performance.now();
		read = readEnd - readStart;
		console.timeEnd('testing');
		fetchTotal = endFetch - startFetch;
		// console.log(fs.size, fs, { jsonF, blobF, textF, bufferF });?
	}
	start();
</script>

<button on:click={main}>Fetch data from Reddit</button>
<div
	class="container"
	style="display:flex; flex-direction: column; align-content: space-around; margin-bottom:1em;"
>
	<h4>Initializing 100 Random Files</h4>
	<div class="container" style="display:flex; flex-direction: row; flex-basis:33%">
		<b>TOTAL TIME</b>
	</div>
	<div class="container" style="display:flex; flex-direction: row; flex-basis:33%; ">
		<i>{time}ms</i>
	</div>
</div>
<div
	class="container"
	style="display:flex; flex-direction: column; align-content: space-around; margin-bottom:1em;"
>
	<h4>Reading a file</h4>
	<div class="container" style="display:flex; flex-direction: row; justify-content: space-around;">
		<b>TOTAL TIME</b>
	</div>
	<div class="container" style="display:flex;flex-direction:row;">
		<i>{$store.total}ms</i>
	</div>
</div>

<div
	class="container"
	style="display:flex; flex-direction: column; align-content: space-around; margin-bottom:1em;"
>
	<h4>Fetching From Reddit</h4>
	<div class="container" style="display:flex; flex-direction: row; justify-content: space-around;">
		<b>HTTP Request Time</b><b>FS Read & Write Time</b><b>TOTAL TIME</b>
	</div>
	<div class="container" style="display:flex; flex-direction: row; justify-content: space-around;">
		<i>{fetchTotal}ms</i>
		<i>{read - fetchTotal}ms</i>
		<i>{read}ms</i>
	</div>
</div>

<style global lang="scss">
	h4 {
		margin-top: 0;
	}
	.container > b,
	.container > i {
		display: flex;
		flex: 33%;
		place-content: center;
	}
	button {
		display: inline-block;
		background: rgba(6, 122, 255, 0.719);
		border: none;
		border-radius: 0.2125em;
		color: #fefefe;
		font-size: 0.95em;
		font-weight: 500;
		letter-spacing: -0.02em;
		padding: 0.5em 0.8em;
		margin-bottom: 1em;
	}
	.container {
		display: flex;
		flex-direction: column;
		background: #5050504d;
		padding: 0.5em;
		border-radius: 0.2em;
	}
	html,
	body,
	div > .grid-container {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
		line-height: 1.4;
		font-size: 1em;
		position: fixed;
		inset: 0;
		background-color: #161616;
		color: #fefefe;
		margin: 0;
		overflow: hidden;
	}
</style>
