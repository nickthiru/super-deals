<script>
  import Link from "$lib/components/shared/Link.svelte";
  import Text from "$lib/components/shared/Text.svelte";
</script>


<nav>
  <Link class="nav">
    <Text class="sm">Home</Text>
  </Link>
  <Link class="nav">
    <Text class="sm">Brands</Text>
  </Link>
  <Link class="nav">
    <Text class="sm">Editor's Choice</Text>
  </Link>
</nav>


<style>
  nav {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    border: 1px solid black;
  }
</style>