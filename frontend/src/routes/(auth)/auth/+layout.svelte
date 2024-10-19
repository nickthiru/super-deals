<!-- <script>
  import { page } from "$app/stores";

  let url = $page.route.id?.split("/")
  console.log("route: " + url);

  let route = url?.[url?.length - 1];
  console.log("route: " + route);
</script>

<h1>{route?.[0].toUpperCase() + route.slice(1)}</h1> -->

<slot />
