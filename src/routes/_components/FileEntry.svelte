<script lang="ts">
	import type { FileEntry } from '$lib/types/core';

	export let file: FileEntry;
</script>

<li on:click>
	<div class="file">
		<p>name: {file.name}</p>
		<p>type: <i>{file.file_type}</i></p>
	</div>
</li>

<style lang="scss">
	.file {
		display: flex;
		flex-direction: column;
		// gap: 0.25em;
		padding-inline: 0.8em;
		padding-block: 0.8em;
		gap: 0.4em;
		text-shadow: 0 0 0.01em rgba(0, 0, 0, 0.692);
	}
	li,
	ul {
		line-height: 1.2;
		padding: 0;
		margin: 0;
		list-style: none;
	}
	li {
		background: #0808084d;
		list-style: none;
		border-bottom: 0.01em #c9c9c94f solid;
		transition: background 300ms cubic-bezier(0.23, 1, 0.32, 1);
		cursor: pointer;
		user-select: none;

		contain: content;
		&:hover {
			background: #3a3a3a70;
		}
	}
	p {
		margin: 0;
	}
</style>
