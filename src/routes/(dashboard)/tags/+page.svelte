<script lang="ts">
  import Debounced from "$lib/runes/debounced.svelte";
  import { fetchTags } from "$lib/supabase/tags";
  import type { Tables } from "$lib/supabase/types";
  import SearchInput from "$lib/ui/search-input.svelte";
  import Table from "$lib/ui/table.svelte";
  import { watch } from "runed";

  let table = $state<Table<Tables<"tags">>>();
  const search = new Debounced(() => "");
  const select = async () => {
    return {
      data: await fetchTags(search.value),
    };
  };

  watch(
    () => search.value,
    () => {
      table?.pagination.reset();
    },
  );
</script>

<div class="p-3">
  <SearchInput value={search.value} oninput={search.set} />
  <Table
    bind:this={table}
    Cells={{ created_at: Timestamp }}
    Heads={{ id: "Id", name: "Name", owner_id: "User", created_at: "Created" }}
    columns={["id", "name", "owner_id", "created_at"]}
    key={(row) => row.id}
    {select}
  />
</div>

{#snippet Timestamp({ cellValue }: { cellValue: string })}
  {new Date(cellValue).toLocaleString("id")}
{/snippet}
