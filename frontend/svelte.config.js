import adapter from "@sveltejs/adapter-auto";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			'$lib': './src/lib',
			'$src': './src',
			'$sv-types': './.svelte-kit/types',
			'$unit-tests': './src/tests',
			'$playwright-tests': './tests',
			// '$backend': '../backend',
			'$shared': '../backend/shared',
			'$types': '../backend/shared/types',
			'$schemas': '../backend/shared/schemas',

		}
	},
};

export default config;