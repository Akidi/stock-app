<script lang="ts">
  let { title }: { title: string } = $props();
</script>

<header class="bg-gray-900 text-white py-12 shadow-lg">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h1 class="text-4xl sm:text-5xl font-bold tracking-tight">{title}</h1>
  </div>
</header>