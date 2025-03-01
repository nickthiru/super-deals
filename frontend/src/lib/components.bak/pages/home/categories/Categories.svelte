<script>
  import Section from "$lib/components/shared/Section.svelte";
  import CategoriesItems from "./CategoriesItems.svelte";

  let sectionName = "categories";
</script>


<Section {sectionName}>
  <CategoriesItems/>
</Section>