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
  import PaginationState from "$lib/runes/pagination.svelte";

  let searchName = $state("");
  let filterTags = $state<Tables<"tags">[]>([]);
  const persons = new FetchState(personsPaginated);
  const searchDebounced = new Debounced(() => searchName);
  const fetchingDebounced = new Debounced(() => persons.fetching);
  const pagination = new PaginationState();

  $effect(() => {
    pagination.total = persons.current?.count ?? null;
  });

  watch(
    [
      () => pagination.page,
      () => pagination.pageSize,
      () => searchDebounced.current,
      () => filterTags.map((e) => e.name),
    ],
    ([page, pageSize, search, tags], [, , prevSearch, prevTags]) => {
      const filterChanged =
        search !== prevSearch ||
        new Set(tags).symmetricDifference(new Set(prevTags)).size > 0;

      if (filterChanged && page !== 1) {
        pagination.reset();
        // prevent double fetch pagination.reset already retrigger this
        return;
      }

      persons.fetch({
        page,
        pageSize,
        searchName: search,
        containTags: tags,
      });
    },
  );
</script>

<div class="px-3 pb-3">
  <div class="bg-base-200 [&>:not(table)]:p-3 rounded-box">
    {@render Header()}
    <Table persons={persons.current?.data} />
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
    <p class="w-full">
      Showing {pagination.start} ~ {pagination.end}
      of {pagination.total}
    </p>
    {@render PrevBtn()}
    <input
      disabled={!pagination.hasPrevious && !pagination.hasNext}
      class="btn btn-square"
      type="text"
      bind:value={pagination.page}
    />
    {@render NextBtn()}
  </div>
{/snippet}

{#snippet NextBtn()}
  <button
    disabled={!pagination.hasNext}
    onclick={pagination.next}
    class="btn btn-square"
  >
    <ChevronRightIcon size={16} />
  </button>
{/snippet}

{#snippet PrevBtn()}
  <button
    disabled={!pagination.hasPrevious}
    onclick={pagination.previous}
    class="btn btn-square"
  >
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
