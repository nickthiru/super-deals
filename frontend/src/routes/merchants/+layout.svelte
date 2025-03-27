<script>
    import { page } from '$app/stores';
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let { children } = $props();
</script>

<div class="merchant-auth-layout">
    {@render children?.()}
</div>

<style>
    .merchant-auth-layout {
        max-width: var(--max-width-content);
        margin: 2rem auto;
        padding: var(--container-padding);
    }
</style>
