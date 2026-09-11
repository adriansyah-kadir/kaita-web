<script lang="ts">
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
  import type PaginationState from "$lib/runes/pagination.svelte";

  const { state }: { state: PaginationState } = $props();
</script>

<div class="flex items-center">
  <p class="w-full">
    Showing {state.start} ~ {state.end}
    {#if state.total}
      of {state.total}
    {/if}
  </p>
  <button
    disabled={!state.hasPrevious}
    onclick={state.previous}
    class="btn btn-square"
  >
    <ChevronLeftIcon size={16} />
  </button>
  <input
    disabled={!state.hasPrevious && !state.hasNext}
    class="btn btn-square"
    type="text"
    bind:value={state.page}
  />
  <button disabled={!state.hasNext} onclick={state.next} class="btn btn-square">
    <ChevronRightIcon size={16} />
  </button>
</div>
