<script lang="ts">
  import FetchState from "$lib/runes/fetch.svelte";
  import SearchParamsState from "$lib/runes/search-param.svelte";
  import { personsPaginated } from "$lib/supabase/persons";
  import Pagination from "$lib/ui/pagination.svelte";
  import Table from "$lib/ui/table.svelte";
  import AddPersonDialog from "./create-person-dialog.svelte";
  import PersonFilter from "./person-filter.svelte";
  import EyeIcon from "@lucide/svelte/icons/eye";

  const paginated = async (...input: Parameters<typeof personsPaginated>) =>
    personsPaginated(...input);
  const persons = new FetchState(paginated);
  const params = new SearchParamsState({
    page: (v) => Number(v?.length ? v : 1),
    pageSize: (v) => Number(v?.length ? v : 10),
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
  <div class="flex items-center gap-2">
    <PersonFilter />
    <AddPersonDialog onSuccess={refetch} />
  </div>

  <div class="overflow-x-auto">
    <Table
      class="[&_tr]:hover:bg-base-300 bg-base-200 overflow-hidden"
      key={(row) => row.id!}
      columns={[
        "name",
        "tags",
        "metadata",
        "created_at",
        "updated_at",
        "faces",
      ]}
      Cells={{
        tags: Tags,
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
  </div>

  <Pagination
    total={persons.current?.count ?? 0}
    pageSize={params.values.pageSize}
    onChange={(page) => params.update({ page })}
  />
</div>

{#snippet Tags({ cellValue }: { cellValue: string[] | null })}
  {#each cellValue as tag}
    <span class="badge text-nowrap">{tag}</span>
  {:else}
    -
  {/each}
{/snippet}

{#snippet Timestamp({ cellValue }: { cellValue: string | null })}
  {new Date(cellValue!).toLocaleString("id", {
    timeStyle: "short",
    dateStyle: "short",
  })}
{/snippet}

{#snippet Json({ cellValue }: { cellValue: any })}
  {@const id = crypto.randomUUID()}
  <button command="show-modal" commandfor={id} class="btn btn-sm btn-square"
    ><EyeIcon size={16} /></button
  >
  <dialog {id} class="modal">
    <div class="modal-box">{JSON.stringify(cellValue)}</div>
  </dialog>
{/snippet}

{#snippet Faces({ cellValue }: { cellValue: number | null })}
  <a href="/faces" class="badge text-nowrap">{cellValue} faces</a>
{/snippet}
