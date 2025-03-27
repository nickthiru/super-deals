<script>
// Input component with validation support
// Universal component format (Svelte 5)

const props = $props({
  type: /** @type {'text' | 'email' | 'password' | 'number' | 'tel' | 'url'} */ 'text',
  name: /** @type {string} */ '',
  id: /** @type {string} */ '',
  value: /** @type {string | number} */ '',
  placeholder: /** @type {string} */ '',
  required: /** @type {boolean} */ false,
  disabled: /** @type {boolean} */ false,
  readonly: /** @type {boolean} */ false,
  error: /** @type {string | null} */ null,
  label: /** @type {string | null} */ null,
  helperText: /** @type {string | null} */ null,
  fullWidth: /** @type {boolean} */ false,
  class: /** @type {string} */ ''
});

// Internal state
let inputElement;
let touched = $state(false);

// Computed classes
const inputClasses = $derived(() => {
  const baseClasses = 'px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500';
  const errorClasses = props.error ? 'border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500' : 'border-slate-300';
  const widthClass = props.fullWidth ? 'w-full' : '';
  const disabledClass = props.disabled ? 'bg-slate-100 cursor-not-allowed' : '';
  
  return `${baseClasses} ${errorClasses} ${widthClass} ${disabledClass} ${props.class}`;
});

// Handle blur event to mark field as touched
function handleBlur() {
  touched = true;
}

// Expose focus method
export function focus() {
  inputElement?.focus();
}
</script>

<div class={`mb-4 ${props.fullWidth ? 'w-full' : ''}`}>
  {#if props.label}
    <label 
      for={props.id || props.name} 
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {props.label}
      {#if props.required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}
  
  <input
    bind:this={inputElement}
    type={props.type}
    id={props.id || props.name}
    name={props.name}
    value={props.value}
    placeholder={props.placeholder}
    required={props.required}
    disabled={props.disabled}
    readonly={props.readonly}
    class={inputClasses}
    on:blur={handleBlur}
    {...$$restProps}
  />
  
  {#if props.error && (touched || props.error)}
    <p class="mt-1 text-sm text-red-600">{props.error}</p>
  {/if}
  
  {#if props.helperText && !props.error}
    <p class="mt-1 text-sm text-gray-500">{props.helperText}</p>
  {/if}
</div>
