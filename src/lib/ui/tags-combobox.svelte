<script lang="ts">
  import ComboboxState from "$lib/runes/combobox.svelte";
  import FetchState from "$lib/runes/fetch.svelte";
  import { fetchTags } from "$lib/supabase/tags";
  import type { Tables } from "$lib/supabase/types";
  import XIcon from "@lucide/svelte/icons/x";
  import SearchInput from "./search-input.svelte";
  import Debounced from "$lib/runes/debounced.svelte";

  type Tag = Tables<"tags">;

  let {
    selected = $bindable([]),
  }: {
    selected?: Tag[];
  } = $props();

  const id = crypto.randomUUID();
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
    <button class="btn btn-square btn-ghost" onclick={combobox.clear}
      ><XIcon size={16} /></button
    >
    <SearchInput value={search.target} oninput={search.set} />
  </div>
  <div class="max-h-80 grow overflow-auto mt-2">
    {#each combobox.items as tag}
      <button
        onclick={() => combobox.toggle(tag.id)}
        class:badge-soft={!combobox.isSelected(tag.id)}
        class="list-row text-start badge badge-lg m-1"
      >
        {tag.name}
      </button>
    {/each}
  </div>
</div>
