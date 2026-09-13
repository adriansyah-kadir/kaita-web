<script lang="ts">
  import FetchState from "$lib/runes/fetch.svelte";
  import SearchParamsState from "$lib/runes/search-param.svelte";
  import { personsPaginated } from "$lib/supabase/persons";
  import Pagination from "$lib/ui/pagination.svelte";
  import Table from "$lib/ui/table.svelte";
  import AddPersonDialog from "./add-person-dialog.svelte";
  import PersonFilter from "./person-filter.svelte";

  const paginated = async (...input: Parameters<typeof personsPaginated>) =>
    personsPaginated(...input);
  const persons = new FetchState(paginated);
  const params = new SearchParamsState({
    page: (v) => Number(v ?? 1),
    pageSize: (v) => Number(v ?? 10),
    name: (v) => v,
    tags: (...names) => names.filter((e) => e !== undefined),
  });

  const refetch = () =>
    persons.fetch({
      page: params.values.page,
      pageSize: params.values.pageSize,
      name: params.values.name,
      tags: params.values.tags,
    });

  $effect(() => {
    refetch();
  });
</script>

<div class="p-3 space-y-3">
  <div class="flex items-center gap-2 px-3">
    <PersonFilter />
    <AddPersonDialog success={refetch} />
  </div>

  <Table
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
    values={persons.current?.data ?? []}
  />

  <Pagination
    class="px-3"
    total={persons.current?.count ?? 0}
    pageSize={params.values.pageSize}
    onChange={(page) =>
      params.update({ page, tags: [...params.values.tags, String(page)] })}
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
