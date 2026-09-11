<script lang="ts">
  import Table from "./table.svelte";
  import TagsCombobox from "$lib/ui/tags-combobox.svelte";
  import type { Tables } from "$lib/supabase/types";
  import type { Snippet } from "svelte";
  import Pagination from "$lib/ui/pagination.svelte";
  import PersonsListState from "./person-list.svelte";
  import SearchInput from "$lib/ui/search-input.svelte";

  type ActionsProps = {
    filtered?: Tables<"persons_view">[] | null;
    search: string;
    tags: Tables<"tags">[];
  };

  type Props = {
    action?: Snippet<[ActionsProps]>;
  };

  const { action }: Props = $props();

  const persons = new PersonsListState();
</script>

<div class="bg-base-200 [&>:not(table)]:p-3 rounded-box">
  {@render Header()}
  <Table persons={persons.fetch.current?.data} />
  <Pagination state={persons.pagination} />
</div>

{#snippet Header()}
  <h2 class="text-2xl font-bold">Dataset</h2>
  <div class="flex items-end gap-3">
    <SearchInput
      loading={persons.loading.value}
      value={persons.search.target}
      oninput={persons.search.set}
    />
    <TagsCombobox bind:selected={persons.tags} />
    {@render action?.({
      filtered: persons.fetch.current?.data,
      search: persons.search.value,
      tags: persons.tags,
    })}
  </div>
{/snippet}
