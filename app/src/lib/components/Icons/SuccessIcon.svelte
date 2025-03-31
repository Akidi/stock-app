<script lang="ts">
  let { size = "w-5 h-5", className = "" } = $props<{ size?: string; className?: string }>();
</script>

<svg class="{size} {className} fill-current" viewBox="0 0 20 20">
  <path d="M3 10l5 5 9-9" stroke="currentColor" stroke-width="2" fill="none" />
</svg>