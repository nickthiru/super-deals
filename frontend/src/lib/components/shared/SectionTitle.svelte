<script>
  import Heading from "$lib/components/shared/Heading.svelte";
  
  export let id = "";
</script>


<Heading 
  {id} 
  level="h2" 
  class="sm"
  style="
    position: absolute;
    top: -11px;
    left: 7px;
    padding-inline: 5px;
    background-color: var(--blue-0);
  "
>
  <slot />
</Heading>