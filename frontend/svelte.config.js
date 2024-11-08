import adapter from "@sveltejs/adapter-auto";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			'$sv-types': './.svelte-kit/types',
			'$unit-tests': './src/tests',
			'$playwright-tests': './tests',
			'$backend': '../backend',
			'$schemas': './src/schemas',
			'$types': './src/types',
		}
	},
};

export default config;