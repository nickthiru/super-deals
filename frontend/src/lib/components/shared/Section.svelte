<script>
  import SectionTitle from "$lib/components/shared/SectionTitle.svelte";

  import Utils from '$lib/utils/_index.js';

  export let sectionName = "";

  $: capSectionName = Utils.capitalize(sectionName, "-");
</script>

<section 
  aria-labelledby={sectionName} 
  style:grid-area={sectionName}
>
  <SectionTitle id={sectionName}>
    {capSectionName}
  </SectionTitle>

  <slot />
</section>


<style>
  section {
    padding: 15px;
    border: 1px solid black;
    position: relative;
  }
</style>