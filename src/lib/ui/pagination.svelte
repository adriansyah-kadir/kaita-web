<script lang="ts">
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    page = $bindable(1),
    pageSize = $bindable(10),
    total,
    onNext,
    onPrev,
    ...props
  }: {
    onNext?: (page: number, pageSize: number) => void;
    onPrev?: (page: number, pageSize: number) => void;
    total?: number;
    page?: number;
    pageSize?: number;
  } & HTMLAttributes<HTMLDivElement> = $props();

  const start = $derived(total === 0 ? 0 : (page - 1) * pageSize + 1);
  const end = $derived(
    total !== undefined ? Math.min(page * pageSize, total) : page * pageSize,
  );

  const hasPrevious = $derived(page > 1);
  const hasNext = $derived(
    total !== undefined ? page * pageSize < total : true,
  );

  function previous() {
    if (!hasPrevious) return;
    page -= 1;
    onPrev?.(page, pageSize);
  }

  function next() {
    if (!hasNext) return;
    page += 1;
    onNext?.(page, pageSize);
  }

  function onPageInput(e: Event) {
    const value = Number((e.currentTarget as HTMLInputElement).value);
    if (Number.isFinite(value) && value > 0) {
      page = value;
    }
  }
</script>

<div {...props} class="flex items-center {props.class}">
  <p class="w-full">
    Showing {start} ~ {end}
    {#if total !== undefined}
      of {total}
    {/if}
  </p>
  <button disabled={!hasPrevious} onclick={previous} class="btn btn-square">
    <ChevronLeftIcon size={16} />
  </button>
  <input
    disabled={!hasPrevious && !hasNext}
    class="btn btn-square"
    type="text"
    value={page}
    onchange={onPageInput}
  />
  <button disabled={!hasNext} onclick={next} class="btn btn-square">
    <ChevronRightIcon size={16} />
  </button>
</div>
