<script lang="ts">
  import ComboboxState from "$lib/runes/combobox.svelte";
  import FetchState from "$lib/runes/fetch.svelte";
  import { fetchTags } from "$lib/supabase/tags";
  import type { Tables } from "$lib/supabase/types";
  import SearchInput from "./search-input.svelte";
  import Debounced from "$lib/runes/debounced.svelte";
  import onFormReset from "$lib/hooks/on-form-reset";

  type Tag = Tables<"tags">;

  let {
    selected = $bindable([]),
    name
  }: {
    selected?: Tag[];
    name?: string
  } = $props();

  const id = crypto.randomUUID();
  const search = new Debounced(() => "");
  const tags = new FetchState(fetchTags);
  export const combobox = new ComboboxState<Tag>(() => ({
    items: tags.current ?? [],
    key: (tag) => tag.id,
  }));

  $effect(() => {
    tags.fetch(search.value);
  });

  $effect(() => {
    selected = combobox.selected;
  });
</script>

<button
  {@attach onFormReset(combobox.clear)}
  type="button"
  command="toggle-popover"
  commandfor="{id}-popover"
  class="input flex-wrap h-auto cursor-pointer w-full py-2"
>
  {#each combobox.selected as tag}
    <input hidden value={tag.id} {name}/>
    <span class="badge badge-neutral">{tag.name}</span>
  {:else}
    Select tags
  {/each}
</button>

<div
  id="{id}-popover"
  popover
  class="w-[anchor-size(width)] bg-base-200 rounded-box p-2 border border-base-100 shadow-xs"
>
  <div class="flex gap-2">
    <SearchInput value={search.target} onvalue={search.set} />
  </div>
  <div class="max-h-80 grow overflow-auto mt-2">
    {#each combobox.items as tag}
      <button
        type="button"
        onclick={() => combobox.toggle(tag.id)}
        class:badge-soft={!combobox.isSelected(tag.id)}
        class="list-row text-start badge badge-lg m-1"
      >
        {tag.name}
      </button>
    {:else}
      <div class="text-center grow">Empty</div>
    {/each}
  </div>
  <div class="join join-horizontal w-full *:w-1/2 mt-2">
    <button
      disabled={!combobox.hasSelected}
      type="button"
      class="join-item btn btn-sm btn-warning btn-soft"
      onclick={combobox.toggleall.bind(null, false)}>Clear</button
    >
    <button
      disabled={combobox.isSelectedAll}
      type="button"
      class="join-item btn btn-sm btn-info btn-soft"
      onclick={combobox.toggleall.bind(null, true)}>All</button
    >
  </div>
</div>
