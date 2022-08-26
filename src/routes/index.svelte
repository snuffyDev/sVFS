<script lang="ts">
	import { browser } from '$app/env';

	import { getFileType } from '$lib/constants';
	import type { FileEntry } from '$lib/types/core';
	import { forEach, map } from '$lib/utils/array';
	import { globalChannel } from '$lib/vfs';
	import { setImmediate } from '$lib/utils/setImmediate';
	import { sVFS } from '$lib/vfs';
	import Sidebar from './_components/Sidebar.svelte';
	import { fs, store } from './_extern';
	import { FileEnt } from '$lib/fileEntry';
	import { readP } from '$lib/utils/path2';
	import { nanoid } from '$lib/utils/nanoid';
	import path from '$lib/utils/path';
	import { FSBuffer } from '$lib/utils/buffer';
	function syncd<T>(promise: Promise<T> | T) {
		if (promise instanceof Promise) {
			promise.then(syncd);
			return;
		}
		// console.log(promise);
		function then(value) {
			return value;
		}
		return { then: then.apply(this, [promise]) };
	}
	function start() {
		if (!browser) return;

		timeStart = performance.now();
		const arr = forEach(Array(100).fill(false), (_, idx) => {
			fs.writeFile(
				nanoid(),
				idx % 2 ? `index: ${nanoid()}` : new Blob([`index: ${idx}`], { type: 'text/plain' })
			);
		});

		timeEnd = performance.now();
		time = timeEnd - timeStart;
		main();
	}
	$: timeStart = 0;
	$: timeEnd = 0;
	$: time = 0;
	$: readStart = 0;
	$: readEnd = 0;
	$: read = 0;
	$: fetchTotal = 0;
	async function main() {
		// console.log( fs.('/src/lib/adapters/index.ts'));
		if (!browser) return;
		readStart = performance.now();
		console.time('testing');
		console.time('fetch');
		const startFetch = performance.now();
		const data = await fetch('https://picsum.photos/v2/list?limit=30', {});
		const res = await fetch('https://api.reddit.com/.json?limit=30', {
			method: 'GET'
		});
		const cloned = await data.clone(),
			cloned2 = await cloned.clone(),
			cloned3 = await data.clone();
		const json = await res.clone().json();
		const blob = await cloned2.blob();
		const buffer = await cloned.arrayBuffer();
		const text = await res.text();
		const endFetch = performance.now();
		console.timeEnd('fetch');
		// console.log(cloned, cloned2, cloned3, json, blob);
		const jsonF = fs.writeFile(`/json`, json);
		const jsonR = await fs.readFile(`/json`);

		// setTimeout(() => {}, 200);
		// console.log(json, jsonR);
		const blobF = await fs.writeFile('/blob', blob).then((data) => data);
		const bufferF = await fs.writeFile('/buffer', buffer);
		const textF = await fs.writeFile('/text', text);
		const array = map(Array(50).fill(false), (_, idx) =>
			FileEnt.create(
				idx % 2 ? `Truthy ${idx}` : `Falsey ${idx}`,
				idx % 2 ? `${idx}: I am truthy ${nanoid()}` : `${idx}: I am falsy. ${nanoid()}`
			)
		);
		console.log(await fs.readFile('/blob'), await fs.readFile('/buffer'));
		const length = json['data']['children']['length'] ?? 0;
		let idx = -1;
		while (++idx < length) {
			fs.writeFile(json['data']['children'][idx]['data']['id'], json[idx]);
		}
		forEach(json, (item) => fs.writeFile(item?.url, item, false));
		fs.mkdir('/subdir', { recursive: true }, array);
		setTimeout(() => {
			globalChannel.dispatch('update:write', []);
		}, 80);
		globalChannel.on('tick', () => {
			readEnd = performance.now();
			read = readEnd - readStart;
		});
		// readEnd = performance.now();
		console.timeEnd('testing');
		fetchTotal = endFetch - startFetch;
		const fileeee = await fs.readFile('/text');
		console.log(fileeee);
		// /** console.log(fs.size, fs, { jsonF, blobF, textF, bufferF }); */?
	}
	start();
	// $: console.log(
	// 	fetch('https://api.reddit.com/.json?limit=4').then((res) => res.json())
	// );
</script>

<button on:click={main}>Fetch data from Reddit</button>
<div
	class="container"
	style="display:flex; flex-direction: column; align-content: space-around; margin-bottom:1em;"
>
	<h4>Writing 100 Random Files</h4>
	<div class="container" style="display:flex; flex-direction: row; flex-basis:33%">
		<b>TOTAL TIME</b>
	</div>
	<div class="container" style="display:flex; flex-direction: row; flex-basis:33%; ">
		<i>{time.toFixed(3)}ms</i>
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
		<i>{$store.total.toFixed(3)}ms</i>
	</div>
</div>

<div
	class="container"
	style="display:flex; flex-direction: column; align-content: space-around; margin-bottom:1em;"
>
	<h4>Fetching /r/all From Reddit</h4>
	<div><i>top 30 posts</i></div>
	<div class="container" style="display:flex; flex-direction: row; justify-content: space-around;">
		<b>HTTP Request Time</b><b>FS Read & Write Time</b><b>TOTAL TIME</b>
	</div>
	<div class="container" style="display:flex; flex-direction: row; justify-content: space-around;">
		<i>{fetchTotal.toFixed(3)}ms</i>
		<i>{(read - fetchTotal).toFixed(3)}ms</i>
		<i>{read.toFixed(3)}ms</i>
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
	body > div,
	.grid-container {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
		line-height: 1.4;
		font-size: 1em;
		position: fixed;
		max-width: 100%;
		inset: 0;
		background-color: #161616;
		color: #fefefe;
		margin: 0;
		overflow: hidden;
	}
</style>
