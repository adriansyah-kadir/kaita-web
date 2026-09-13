<script lang="ts">
  import FetchState from "$lib/runes/fetch.svelte";
  import SearchParamsState from "$lib/runes/search-param.svelte";
  import { fetchTags } from "$lib/supabase/tags";
  import SearchInput from "$lib/ui/search-input.svelte";
  import Table from "$lib/ui/table.svelte";

  const tags = new FetchState(fetchTags);
  const params = new SearchParamsState({
    name: (v) => v,
  });
  const refetch = () => tags.fetch(params.values.name ?? undefined);

  $effect(() => {
    refetch();
  });
</script>

<div class="p-3 space-y-3">
  <div class="px-3">
    <SearchInput placeholder="Search tag name" debounce={500} onvalue={(name) => params.update({ name })} />
  </div>
  <Table
    Cells={{ created_at: Timestamp }}
    Heads={{ id: "Id", name: "Name", owner_id: "User", created_at: "Created" }}
    columns={["id", "name", "owner_id", "created_at"]}
    key={(row) => row.id}
    values={tags.current ?? []}
  />
</div>

{#snippet Timestamp({ cellValue }: { cellValue: string })}
  {new Date(cellValue).toLocaleString("id")}
{/snippet}
