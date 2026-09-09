<script lang="ts">
  import FetchState from "$lib/runes/fetch.svelte";
  import SearchIcon from "@lucide/svelte/icons/search";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
  import { personsPaginated } from "$lib/supabase/persons";
  import { Debounced } from "runed";
  import Table from "./table.svelte";
  import { fetchTags } from "$lib/supabase/tags";

  let page = $state(1);
  let pageSize = $state(10);
  let searchName = $state("");
  let filterTags = $state<string[]>([]);
  const tags = new FetchState(fetchTags);
  const persons = new FetchState(personsPaginated);
  const searchDebounced = new Debounced(() => searchName);
  const fetchingDebounced = new Debounced(() => persons.fetching);
  const personsCount = $derived(persons.current?.length ?? 0);

  const pageStart = $derived((page - 1) * pageSize + 1);
  const pageEnd = $derived(pageStart + personsCount - 1);
  const nextPage = () => page++;
  const prevPage = () => page > 1 && page--;

  $effect(() => {
    persons.fetch({
      page,
      pageSize,
      searchName: searchDebounced.current,
      containTags: filterTags,
    });
  });

  $effect(() => {
    tags.fetch();
  });
</script>

<div class="px-3 pb-3">
  <div class="bg-base-200 [&>:not(table)]:p-3 rounded-box">
    {@render Header()}
    <Table persons={persons.current} />
    {@render Footer()}
  </div>
</div>

{#snippet Header()}
  <h2 class="text-2xl font-bold">Dataset</h2>
  <div class="flex items-end gap-3">
    {@render SearchName()}
    {@render FilterTag()}
  </div>
{/snippet}

{#snippet Footer()}
  <div class="flex items-center">
    <p class="w-full">Showing {pageStart} ~ {pageEnd}</p>
    {@render PrevBtn()}
    <input class="btn btn-square" type="text" bind:value={page} />
    {@render NextBtn()}
  </div>
{/snippet}

{#snippet NextBtn()}
  <button
    disabled={personsCount != pageSize}
    onclick={nextPage}
    class="btn btn-square"
  >
    <ChevronRightIcon size={16} />
  </button>
{/snippet}

{#snippet PrevBtn()}
  <button disabled={page <= 1} onclick={prevPage} class="btn btn-square">
    <ChevronLeftIcon size={16} />
  </button>
{/snippet}

{#snippet SearchName()}
  <label class="input">
    <SearchIcon size={16} />
    <input bind:value={searchName} class="grow" placeholder="Search name" />
    <span
      class:hidden={!fetchingDebounced.current}
      class="loading loading-spinner"
    ></span>
  </label>
{/snippet}

{#snippet FilterTag()}
  <button popovertarget="filter-tag" class="input"
    >{filterTags.length ? filterTags.join(", ") : "Filter tags"}</button
  >
  <div popover id="filter-tag" class="bg-transparent" style="position-area: bottom span-right;">
    <select class="select" bind:value={filterTags} multiple>
      {#each tags.current as tag}
        <option value={tag.name} class="shrink-0">{tag.name}</option>
      {/each}
    </select>
  </div>
{/snippet}
