import { svelteTesting } from '@testing-library/svelte/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		// https: true,
		fs: {
			// Allow serving files from one level up to the project root
			allow: ['..']
		}
	},
	test: {
		workspace: [
			{
				extends: './vite.config.js',
				plugins: [svelteTesting()],

				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: [
						// './tests/**/*.svelte.{test,spec}.{js,ts}',
						'./tests/**/*.{test,spec}.js'
					],
					// exclude: ['src/lib/server/**'],
					setupFiles: [
						'./vitest-setup-client.js',
						'./tests/register-matchers.js',
						'./tests/clean-up-dom.js'
					],
					reporters: ['verbose'],
					restoreMocks: true
				}
			}
			// {
			// 	extends: './vite.config.js',

			// 	test: {
			// 		name: 'server',
			// 		environment: 'node',
			// 		include: ['src/**/*.{test,spec}.{js,ts}'],
			// 		exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
			// 	}
			// }
		]
	}
});
