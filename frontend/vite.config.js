import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
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
			'$lib': path.resolve(__dirname, './src/lib'),
			'$src': path.resolve(__dirname, './src'),
			'shared': path.resolve(__dirname, '../shared'),
			'$backend': path.resolve(__dirname, '../backend'),
			'$sv-types': path.resolve(__dirname, './.svelte-kit/types'),
			'$types': path.resolve(__dirname, '../shared/types'),
			'$schemas': path.resolve(__dirname, '../shared/schemas'),
			'$unit-tests': path.resolve(__dirname, './src/tests'),
			'$playwright-tests': path.resolve(__dirname, './tests'),
			'$shared-tests': path.resolve(__dirname, '../shared/tests'),
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