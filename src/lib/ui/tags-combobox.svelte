<script lang="ts">
  import ComboboxState from "$lib/runes/combobox.svelte";
  import FetchState from "$lib/runes/fetch.svelte";
  import { fetchTags, insertTag } from "$lib/supabase/tags";
  import type { Tables } from "$lib/supabase/types";
  import XIcon from "@lucide/svelte/icons/x";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import SearchInput from "./search-input.svelte";
  import Debounced from "$lib/runes/debounced.svelte";

  type Tag = Tables<"tags">;

  let {
    selected = $bindable([]),
  }: {
    selected?: Tag[];
  } = $props();

  const id = crypto.randomUUID();
  const addTag = new FetchState(insertTag);
  const search = new Debounced(() => "");
  const tags = new FetchState(fetchTags);
  const combobox = new ComboboxState<Tag>(() => ({
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
  type="button"
  command="toggle-popover"
  commandfor="{id}-popover"
  class="input flex-wrap min-h-(--size) h-auto cursor-pointer w-auto min-w-xs py-2"
>
  {#each combobox.selected as tag}
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
    <button
      type="button"
      class="btn btn-square btn-ghost"
      onclick={combobox.clear}><XIcon size={16} /></button
    >
    <SearchInput value={search.target} oninput={search.set} />
    <button
      type="button"
      class="btn btn-square btn-ghost"
      disabled={addTag.fetching}
      onclick={() => {
        addTag.fetch(search.target).then(() => tags.fetch(search.target));
      }}><PlusIcon size={16} /></button
    >
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
</div>
