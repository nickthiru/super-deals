import adapter from "@sveltejs/adapter-auto";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			'$lib': './src/lib',
			'$src': './src',
			'shared': '../shared',
			'$backend': '../backend',
			'$sv-types': './.svelte-kit/types',
			'$types': '../shared/types',
			'$schemas': '../shared/schemas',
			'$unit-tests': './src/tests',
			'$playwright-tests': './tests',
			'$shared-tests': '../shared/tests',
		}
	},
};

export default config;