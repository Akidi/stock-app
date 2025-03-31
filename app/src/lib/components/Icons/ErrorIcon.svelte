<script lang="ts">
  let { size = "w-5 h-5",  className = "" } = $props<{ size?: string; className?: string }>();
</script>

<svg class="{size} {className} fill-current" viewBox="0 0 20 20">
  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2" fill="none" />
</svg>