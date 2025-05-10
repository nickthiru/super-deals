<!-- FormField.svelte: Molecule for label, input/select, error, and helper text. -->
<script>
  const { children, label = '', error = '', helperText = '', required = false, id = '', className = '' } = $props();
</script>

<div class={`mb-4 ${className}`}>
  {#if label}
    <label for={id} class="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}
  {@render children?.()}
  {#if error}
    <p class="mt-1 text-sm text-red-600">{error}</p>
  {:else if helperText}
    <p class="mt-1 text-sm text-gray-500">{helperText}</p>
  {/if}
</div>
