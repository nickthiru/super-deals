<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { configureAmplify } from '$lib/config/amplify';
	import { browser } from '$app/environment';

	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();

	// Initialize Amplify only in the browser
	$effect(() => {
		if (browser) {
			configureAmplify();
		}
	});
</script>

{@render children?.()}
