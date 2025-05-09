<script>
  // Svelte 5 runes mode - JavaScript

  // 1. $props takes no arguments
  const props = $props();

  // 2. Destructure with defaults
  const {
    name = '',
    id = '',
    value = '',
    options = [],
    placeholder = 'Select an option',
    required = false,
    disabled = false,
    error = null,
    label = null,
    helperText = null,
    fullWidth = false,
    class: className = ''
  } = props;

  // 3. Internal state
  let selectElement = null;
  let touched = $state(false);

  // 4. Computed classes
  const selectClasses = $derived(() => {
    const baseClasses = 'px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 appearance-none';
    const errorClasses = error ? 'border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500' : 'border-slate-300';
    const widthClass = fullWidth ? 'w-full' : '';
    const disabledClass = disabled ? 'bg-slate-100 cursor-not-allowed' : '';
    return `${baseClasses} ${errorClasses} ${widthClass} ${disabledClass} ${className}`;
  });

  function handleBlur() {
    touched = true;
  }

  // 5. Expose focus method
  export function focus() {
    selectElement?.focus();
  }
</script>

<div class={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
  {#if label}
    <label 
      for={id || name} 
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}
  
  <div class="relative">
    <select
      bind:this={selectElement}
      id={id || name}
      name={name}
      value={value}
      required={required}
      disabled={disabled}
      class={selectClasses}
      onblur={handleBlur}
    >
      <option value="" disabled selected={!value}>{placeholder}</option>
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
    
    <!-- Custom dropdown arrow -->
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </div>
  
  {#if error && touched}
    <p class="mt-1 text-sm text-red-600">{error}</p>
  {/if}
  
  {#if helperText && !error}
    <p class="mt-1 text-sm text-gray-500">{helperText}</p>
  {/if}
</div>
