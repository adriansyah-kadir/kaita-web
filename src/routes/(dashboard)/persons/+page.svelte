<script lang="ts">
  import Debounced from "$lib/runes/debounced.svelte";
  import type PaginationState from "$lib/runes/pagination.svelte";
  import { personsPaginated } from "$lib/supabase/persons";
  import type { Tables } from "$lib/supabase/types";
  import Table from "$lib/ui/table.svelte";
  import SearchInput from "$lib/ui/search-input.svelte";
  import TagsCombobox from "$lib/ui/tags-combobox.svelte";
  import AddPersonDialog from "./add-person-dialog.svelte";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  let table = $state<Table<Tables<"persons_view">>>();
  let tags = $state<Tables<"tags">[]>([]);
  const search = new Debounced(() => "");
  const select = (pagination: PaginationState) => {
    return personsPaginated({
      page: pagination.page,
      pageSize: pagination.pageSize,
      searchName: search.value,
      containTags: tags.map((e) => e.name),
    });
  };
</script>

<div class="p-3">
  <div class="flex items-center gap-2">
    <SearchInput value={search.target} oninput={search.set} />
    <TagsCombobox bind:selected={tags} />
    <AddPersonDialog success={table?.refetch} />
  </div>

  <Table
    bind:this={table}
    key={(row) => row.id!}
    columns={["name", "tags", "metadata", "created_at", "updated_at", "faces"]}
    Cells={{
      created_at: Timestamp,
      updated_at: Timestamp,
      metadata: Json,
      faces: Faces,
    }}
    Heads={{
      name: "Name",
      tags: "Tags",
      metadata: "Meta",
      created_at: "Created",
      updated_at: "Updated",
      faces: "Faces",
    }}
    {select}
  />
</div>

{#snippet Timestamp({ cellValue }: { cellValue: string | null })}
  {new Date(cellValue!).toLocaleString("id", {
    timeStyle: "short",
    dateStyle: "short",
  })}
{/snippet}

{#snippet Json({ cellValue }: { cellValue: any })}
  {JSON.stringify(cellValue)}
{/snippet}

{#snippet Faces({ cellValue }: { cellValue: number | null })}
  <a href="/faces" class="badge">{cellValue} faces</a>
{/snippet}
