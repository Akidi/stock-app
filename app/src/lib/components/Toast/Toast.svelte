<script lang="ts">
  import { renderTemplate } from "$lib/utils/template";
  import { fly, fade } from "svelte/transition";
  import InfoIcon from "$lib/components/Icons/InfoIcon.svelte";
  import SuccessIcon from "$lib/components/Icons/SuccessIcon.svelte";
  import WarningIcon from "$lib/components/Icons/WarningIcon.svelte";
  import ErrorIcon from "$lib/components/Icons/ErrorIcon.svelte";
	import { ToastPosition, ToastType } from "$lib/components/Toast/Toast.types";
	import { toastStore } from "$lib/stores/toast.store";

  let { position = ToastPosition.N }: {
    position?: ToastPosition
  } = $props();

  const positions: Record<ToastPosition, string> = {
    [ToastPosition.NW]: 'top-5 left-5',
    [ToastPosition.N]: 'top-5 left-1/2 -translate-x-1/2',
    [ToastPosition.NE]: 'top-5 right-5',
    [ToastPosition.E]: 'top-1/2 right-5 -translate-y-1/2',
    [ToastPosition.SE]: 'bottom-5 right-5',
    [ToastPosition.S]: 'bottom-5 left-1/2 -translate-x-1/2',
    [ToastPosition.SW]: 'bottom-5 left-5',
    [ToastPosition.W]: 'top-1/2 left-5 -translate-y-1/2'
  };

  const colors: Record<ToastType, string> = {
    [ToastType.Info]: 'bg-blue-600',
    [ToastType.Success]: 'bg-green-600',
    [ToastType.Warning]: 'bg-yellow-500',
    [ToastType.Error]: 'bg-red-700'
  };
</script>

<div class="fixed z-50 flex flex-col gap-3 {positions[position]}">
  {#each $toastStore.active as toast (toast.id)}
    <div
      in:fly={{ y: -10, duration: 250 }}
      out:fade={{ duration: 250 }}
      class="shadow-xl rounded-xl py-3 px-4 text-sm text-white flex items-start gap-3 backdrop-blur bg-opacity-90 {colors[toast.type]}"
      role="alert"
      aria-live="polite"
    >
      <div class="mt-1">
        {#if toast.type === ToastType.Info}
          <InfoIcon />
        {:else if toast.type === ToastType.Success}
          <SuccessIcon />
        {:else if toast.type === ToastType.Warning}
          <WarningIcon />
        {:else if toast.type === ToastType.Error}
          <ErrorIcon />
        {/if}
      </div>
      <div class="flex-1">{@html renderTemplate(toast.message)}</div>
      <button class="opacity-50 hover:opacity-100" onclick={() => toastStore.remove(toast.id)}>&times;</button>
    </div>
  {/each}
  {#if $toastStore.queue.length > 0}
    <div class="absolute -top-2 -right-2 bg-gray-700 bg-opacity-80 text-white rounded-full px-2 py-1 text-xs flex items-center gap-1">
      <span>⏳</span>
      <span>{$toastStore.queue.length}</span>
    </div>
  {/if}
</div>
