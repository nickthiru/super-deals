import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
			// Allow serving files from one level up to the project root
			allow: ['..'],
		},
	},
	test: {
		globals: true,
		reporter: 'verbose',
		environment: 'jsdom',
		restoreMocks: true,
		setupFiles: [
			'./vitest/register-matchers.js',
			'./vitest/clean-up-dom.js'
		],
	},
	resolve: {
		alias: {
			'$sv-types': path.resolve(__dirname, './.svelte-kit/types'),
			'$unit-tests': path.resolve(__dirname, './src/tests'),
			'$playwright-tests': path.resolve(__dirname, './tests'),
			// '$backend': path.resolve(__dirname, '../backend'),
			'$schemas': path.resolve(__dirname, './src/schemas'),
			'$types': path.resolve(__dirname, './src/types'),
		}
	},
	optimizeDeps: {
		include: ['zod', 'zod-form-data', 'zod-to-json-schema']
	},
	build: {
		rollupOptions: {
			external: ['zod', 'zod-form-data', 'zod-to-json-schema']
		}
	},
	ssr: {
		noExternal: ['zod', 'zod-form-data', 'zod-to-json-schema']
	}
});