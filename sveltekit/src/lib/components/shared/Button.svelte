<script>
  // Destructure props with defaults from $props()
  const { 
    spinner,
    children,
    type = 'button', // 'button' | 'submit' | 'reset'
    variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger'
    size = 'md', // 'sm' | 'md' | 'lg'
    disabled = false,
    fullWidth = false,
    loading = false,
    className = '',
    ...rest
  } = $props();

  // Mappings
  const variantMap = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus-visible:ring-secondary-500',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500'
  };
  const sizeMap = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 py-3 text-lg'
  };

  // Derived classes
  let buttonClasses = $derived.by(() => {
    const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    const variantClass = variantMap[variant] || variantMap.primary;
    const sizeClass = sizeMap[size] || sizeMap.md;
    const width = fullWidth ? 'w-full' : '';
    return [base, variantClass, sizeClass, width, className].filter(Boolean).join(' ');
  });
</script>

<button
  type={type}
  class={buttonClasses}
  disabled={disabled || loading}
  {...rest}
>
  {#if loading}
    <span class="mr-2">
      {#if spinner}{@render spinner()}{:else}
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      {/if}
    </span>
  {/if}
  {@render children?.()}
</button>
