<script>
// Select component with validation support
// Universal component format (Svelte 5)

const props = $props({
  name: /** @type {string} */ '',
  id: /** @type {string} */ '',
  value: /** @type {string | number} */ '',
  options: /** @type {Array<{value: string | number, label: string}>} */ [],
  placeholder: /** @type {string} */ 'Select an option',
  required: /** @type {boolean} */ false,
  disabled: /** @type {boolean} */ false,
  error: /** @type {string | null} */ null,
  label: /** @type {string | null} */ null,
  helperText: /** @type {string | null} */ null,
  fullWidth: /** @type {boolean} */ false,
  class: /** @type {string} */ ''
});

// Internal state
let selectElement;
let touched = $state(false);

// Computed classes
const selectClasses = $derived(() => {
  const baseClasses = 'px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 appearance-none';
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
  selectElement?.focus();
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
  
  <div class="relative">
    <select
      bind:this={selectElement}
      id={props.id || props.name}
      name={props.name}
      value={props.value}
      required={props.required}
      disabled={props.disabled}
      class={selectClasses}
      on:blur={handleBlur}
      {...$$restProps}
    >
      <option value="" disabled selected={!props.value}>{props.placeholder}</option>
      {#each props.options as option}
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
  
  {#if props.error && (touched || props.error)}
    <p class="mt-1 text-sm text-red-600">{props.error}</p>
  {/if}
  
  {#if props.helperText && !props.error}
    <p class="mt-1 text-sm text-gray-500">{props.helperText}</p>
  {/if}
</div>
