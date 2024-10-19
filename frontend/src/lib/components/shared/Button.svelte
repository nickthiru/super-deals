<button class={$$props.class}>
  <slot />
</button>


<style>
  button {
    border-radius: 3px;
    display: inline-block;
    cursor: pointer;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-6);
    padding: 13px 40px;
    border: 0;
    transition: background-color 200ms, color 200ms;
  }

  .outline {
    box-shadow: 1px 1px 7px #c4c4c4;
    padding: 8px 25px;
    border-radius: 10px;
  }
</style>