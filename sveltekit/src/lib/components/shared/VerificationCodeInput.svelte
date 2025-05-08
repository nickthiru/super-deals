<script lang="ts">
// Verification Code Input component
// Universal component format (Svelte 5)

// Props definition using Svelte 5 runes
const props = $props();
const value = props.value ?? '';
const length = props.length ?? 6;
const disabled = props.disabled ?? false;
const error = props.error ?? null;
const label = props.label ?? 'Verification Code';
const fullWidth = props.fullWidth ?? false;
const className = props.class ?? '';

// Internal state
let digits = $state(Array(length).fill(''));
let refs = $state(Array(length));
let focused = $state(-1);

// Generate a unique base id for this component instance
const baseId = `verification-code-${Math.random().toString(36).substring(2, 10)}`;

// Update digits when value changes
$effect(() => {
  if (value) {
    const valueDigits = value.split('');
    digits = Array(length).fill('').map((_, i) => valueDigits[i] || '');
  }
});

// Create a derived value for the complete code
const code = $derived(() => digits.join(''));

// Dispatch code change event when code changes
$effect(() => {
  if (code !== value) {
    dispatchEvent('change', { code });
  }
});

// Handle input for each digit
function handleInput(index: number, e: Event) {
  const input = e.target as HTMLInputElement;
  const inputValue = input.value;
  
  // Only allow numbers
  if (!/^\d*$/.test(inputValue)) {
    input.value = digits[index] || '';
    return;
  }
  
  // If pasting multiple digits
  if (inputValue.length > 1) {
    const pastedValue = inputValue.split('');
    
    // Fill current and subsequent inputs
    for (let i = 0; i < length; i++) {
      if (i >= index && pastedValue[i - index]) {
        digits[i] = pastedValue[i - index];
      }
    }
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = digits.findIndex(d => !d);
    if (nextEmptyIndex !== -1 && nextEmptyIndex > index) {
      focusDigit(nextEmptyIndex);
    } else {
      focusDigit(length - 1);
    }
  } else {
    // Single digit input
    digits[index] = inputValue;
    
    // Auto-advance to next input
    if (inputValue && index < length - 1) {
      focusDigit(index + 1);
    }
  }
}

// Handle keydown for navigation between inputs
function handleKeyDown(index: number, e: KeyboardEvent) {
  // Handle backspace
  if (e.key === 'Backspace') {
    if (!digits[index] && index > 0) {
      // If current input is empty, go back and clear previous
      digits[index - 1] = '';
      focusDigit(index - 1);
    } else {
      // Clear current digit
      digits[index] = '';
    }
  } 
  // Handle arrow keys for navigation
  else if (e.key === 'ArrowLeft' && index > 0) {
    focusDigit(index - 1);
  } else if (e.key === 'ArrowRight' && index < length - 1) {
    focusDigit(index + 1);
  }
}

// Focus a specific digit input
function focusDigit(index: number) {
  if (index >= 0 && index < length && refs[index]) {
    refs[index].focus();
    focused = index;
  }
}

// Helper to dispatch custom events
function dispatchEvent(name: string, detail: any) {
  const event = new CustomEvent(name, { detail });
  refs[0]?.dispatchEvent(event);
}

// Expose focus method
export function focus() {
  focusDigit(0);
}

// Expose clear method
export function clear() {
  digits = Array(length).fill('');
  focusDigit(0);
}
</script>

<div class={`mb-4 ${fullWidth ? 'w-full' : ''} ${className}`}>
  {#if label}
    <label class="block text-sm font-medium text-gray-700 mb-2" for={baseId + '-0'}>
      {label}
    </label>
  {/if}
  
  <div class="flex gap-2 justify-center">
    {#each Array(length) as _, index}
      <input
        id={baseId + '-' + index}
        type="text"
        inputmode="numeric"
        maxlength="1"
        value={digits[index]}
        disabled={disabled}
        class={`w-12 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          focused === index ? 'border-primary-500' : 'border-gray-300'
        } ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        oninput={(e) => handleInput(index, e)}
        onkeydown={(e) => handleKeyDown(index, e)}
        onfocus={() => focused = index}
        onblur={() => focused = -1}
        bind:this={refs[index]}
      />
    {/each}
  </div>
  
  {#if error}
    <p class="mt-1 text-sm text-red-600">{error}</p>
  {/if}
</div>
