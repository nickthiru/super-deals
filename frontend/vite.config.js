import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		globals: true,
		reporter: 'verbose',
		environment: 'jsdom', // 'node' can also be used depending on your needs
		setupFiles: ['./src/vitest/registerMatchers.js'],
	},
});