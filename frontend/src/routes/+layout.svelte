<script>
  import "../app.css";
  import Container from "$lib/components/shared/layout/Container.svelte";
  import NavBar from "$lib/components/shared/NavBar.svelte";
  import AppHeading from "$lib/components/shared/AppHeading.svelte";
</script>


<AppHeading />

<Container class="app">
  <slot />
</Container>

<NavBar />

