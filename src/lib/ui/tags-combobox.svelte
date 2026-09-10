<script lang="ts">
  import ComboboxState from "$lib/runes/combobox.svelte";
  import FetchState from "$lib/runes/fetch.svelte";
  import { fetchTags } from "$lib/supabase/tags";
  import type { Tables } from "$lib/supabase/types";
  import CheckIcon from "@lucide/svelte/icons/check";
  import XIcon from "@lucide/svelte/icons/x";
  import { Debounced } from "runed";

  let {
    selected = $bindable([]),
  }: {
    selected?: Tables<"tags">[];
  } = $props();

  let search = $state("");
  const searchDebounced = new Debounced(() => search);
  const tags = new FetchState(fetchTags);
  const combobox = new ComboboxState(() => ({
    items: tags.current ?? [],
    key: (tag) => tag.id,
  }));

  $effect(() => {
    tags.fetch(searchDebounced.current);
  });

  $effect(() => {
    selected = combobox.selected;
  });
</script>

<div class="dropdown">
  <div class="input w-fit">
    {#if combobox.selected.length > 0}
      <button
        onclick={combobox.clear}
        class="btn btn-xs btn-neutral btn-square"
      >
        <XIcon size={16} />
      </button>
    {/if}
    {#each combobox.selected as tag}
      <span class="badge badge-neutral relative">
        {tag.name}
      </span>
    {/each}
    <input bind:value={search} placeholder="Filter tag name" />
  </div>
  <ul class="dropdown-content menu bg-base-300 rounded-box">
    {#each combobox.items as tag}
      {@const pick = combobox.toggle.bind(null, tag.id)}
      <li>
        <button onclick={pick} class="pr-10">
          <span class:opacity-0={!combobox.isSelected(tag.id)}
            ><CheckIcon size={16} /></span
          >
          {tag.name}
        </button>
      </li>
    {:else}
      <li class="menu-disabled">
        <button>Empty</button>
      </li>
    {/each}
  </ul>
</div>
