<script>
  export let title = "Test Card";
  export let content = "This is a test card to verify that both Tailwind CSS and nested CSS are working properly.";
</script>

<div class="card bg-white rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
  <div class="card-header mb-2">
    <h2 class="text-lg font-bold text-gray-800">{title}</h2>
  </div>
  <div class="card-body">
    <p class="text-gray-600">{content}</p>
    <button class="mt-4 bg-facebook text-white px-4 py-2 rounded-md hover:bg-facebook-dark transition-colors">
      Action Button
    </button>
  </div>
</div>

<style>
  /* Example of nested CSS that will be processed by postcss-nesting */
  .card {
    /* These styles will be merged with the Tailwind classes */
    
    & .card-header {
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.5rem;
    }
    
    & .card-body {
      padding-top: 0.5rem;
      
      & button {
        font-weight: 500;
      }
    }
  }
</style>
