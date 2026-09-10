<script lang="ts">
  import FetchState from "$lib/runes/fetch.svelte";
  import SearchIcon from "@lucide/svelte/icons/search";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
  import { personsPaginated } from "$lib/supabase/persons";
  import { Debounced, watch } from "runed";
  import Table from "./table.svelte";
  import TagsCombobox from "$lib/ui/tags-combobox.svelte";
  import type { Tables } from "$lib/supabase/types";

  let page = $state(1);
  let pageSize = $state(10);
  let searchName = $state("");
  let filterTags = $state<Tables<"tags">[]>([]);
  const persons = new FetchState(personsPaginated);
  const searchDebounced = new Debounced(() => searchName);
  const fetchingDebounced = new Debounced(() => persons.fetching);
  const personsCount = $derived(persons.current?.length ?? 0);

  const pageStart = $derived((page - 1) * pageSize + 1);
  const pageEnd = $derived(pageStart + personsCount - 1);
  const nextPage = () => page++;
  const prevPage = () => page > 1 && page--;

  watch(
    [
      () => page,
      () => pageSize,
      () => searchDebounced.current,
      () => filterTags.map((e) => e.name),
    ],
    (
      [currentPage, currentPageSize, search, tags],
      [, , prevSearch, prevTags],
    ) => {
      const filterChanged =
        search !== prevSearch ||
        tags.length !== prevTags?.length ||
        tags.some((tag, i) => tag !== prevTags[i]);

      if (filterChanged && currentPage !== 1) {
        page = 1;
        return;
      }

      persons.fetch({
        page: currentPage,
        pageSize: currentPageSize,
        searchName: search,
        containTags: tags,
      });
    },
  );
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
    <TagsCombobox bind:selected={filterTags} />
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
