<!-- 
  Button component
  Universal component format (Svelte 5)
-->

<script>
<!-- Props definition using $props() -->
const props = $props({
  type: /** @type {'button' | 'submit' | 'reset'} */ 'button',
  variant: /** @type {'primary' | 'secondary' | 'outline' | 'danger'} */ 'primary',
  size: /** @type {'sm' | 'md' | 'lg'} */ 'md',
  disabled: /** @type {boolean} */ false,
  fullWidth: /** @type {boolean} */ false,
  loading: /** @type {boolean} */ false,
  class: /** @type {string} */ ''
});

// Computed classes based on variant, size, etc.
const buttonClasses = $derived(() => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus-visible:ring-secondary-500',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500'
  }[props.variant];
  
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 py-3 text-lg'
  }[props.size];
  
  const widthClass = props.fullWidth ? 'w-full' : '';
  
  return `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${props.class}`;
});

</script>

<button 
  type={props.type} 
  class={buttonClasses} 
  disabled={props.disabled || props.loading} 
  {...$$restProps}
>
  {#if props.loading}
    <span class="mr-2">
      <svg class="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
  {/if}
  <slot />
</button>
