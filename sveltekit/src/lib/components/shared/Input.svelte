<script>
  // Get all props
  const props = $props();

  // Destructure with defaults
  const {
    type = 'text',
    name = '',
    id = '',
    value = '',
    placeholder = '',
    required = false,
    disabled = false,
    readonly = false,
    error = null,
    label = null,
    helperText = null,
    fullWidth = false,
    class: className = '',
    ...rest
  } = props;

  let inputElement = null;
  let touched = $state(false);

  const inputClasses = $derived(() => {
    const baseClasses = 'px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500';
    const errorClasses = error ? 'border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500' : 'border-slate-300';
    const widthClass = fullWidth ? 'w-full' : '';
    const disabledClass = disabled ? 'bg-slate-100 cursor-not-allowed' : '';
    return `${baseClasses} ${errorClasses} ${widthClass} ${disabledClass} ${className}`;
  });

  function handleBlur() {
    touched = true;
  }

  export function focus() {
    inputElement?.focus();
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

  <input
    bind:this={inputElement}
    type={type}
    id={id || name}
    name={name}
    value={value}
    placeholder={placeholder}
    required={required}
    disabled={disabled}
    readonly={readonly}
    class={inputClasses}
    onblur={handleBlur}
    autocomplete="off"
    {...rest}
  />

  {#if error && touched}
    <p class="mt-1 text-sm text-red-600">{error}</p>
  {/if}

  {#if helperText && !error}
    <p class="mt-1 text-sm text-gray-500">{helperText}</p>
  {/if}
</div>
