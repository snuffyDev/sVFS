<script lang="ts">
	import { Backend } from '$lib/vfs';
	const fs = new Backend({ name: 'wow', sep: 'Unix' });
	// const fs = InternalFS.create({ name: 'cooldude', sep: 'Unix' });
	async function main() {
		console.time('testing');
		console.time('fetch');
		const json = await fetch('https://api.reddit.com/.json?limit=5', {
			method: 'GET'
		}).then((res) => res.json());
		console.timeEnd('fetch');
		const file = await fs.writeFileSync('file', json);

		const gotFile = await fs.readFileSync('file');

		console.timeEnd('testing');
		console.log(file, gotFile);
	}
</script>

<button on:click={main}>CLICK ME!!!</button>

<style global lang="scss">
	html,
	body {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}
</style>
