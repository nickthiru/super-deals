import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Enable Svelte 5 runes
	compilerOptions: {
		runes: true
	},
	kit: {
		// Using adapter-static for Amplify Hosting
		adapter: adapter({
			// Use fallback for SPA-style routing
			fallback: 'index.html'
		})
	}
};

export default config;
