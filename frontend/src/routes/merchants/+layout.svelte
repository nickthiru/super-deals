<script>
    import { page } from '$app/stores';
</script>

<div class="merchant-auth-layout">
    <slot />
</div>

<style>
    .merchant-auth-layout {
        max-width: var(--max-width-content);
        margin: 2rem auto;
        padding: var(--container-padding);
    }
</style>
