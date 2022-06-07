import adapter from "@sveltejs/adapter-auto";
import { resolve } from "path";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		scss: { renderSync: false },
		sass: false,
	}),

	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					$lib: resolve("./src/lib"),
				},
			},
		},
	},
};

export default config;
