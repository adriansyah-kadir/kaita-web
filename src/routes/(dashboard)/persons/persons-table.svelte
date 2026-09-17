<script lang="ts">
  import type { Tables } from "$lib/supabase/types";
  import EyeIcon from "@lucide/svelte/icons/eye";
  import Table from "$lib/ui/table.svelte";
  import PersonFacesDialog from "./person-faces-dialog.svelte";
  import type { Snippet } from "svelte";
  import PersonProvider from "$lib/ui/person/person-provider.svelte";
  import { getPersonContext } from "$lib/context/person.svelte";
  import { getPersonsPageContext } from "./context.svelte";
  const ctx = getPersonsPageContext();
</script>

<Table
  class="[&_tr]:hover:bg-base-300 bg-base-200 overflow-hidden"
  key={(row) => row.id!}
  columns={["name", "tags", "metadata", "created_at", "updated_at", "faces"]}
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
  RowAction={Action}
  {Row}
  values={ctx.persons.current?.data ?? []}
/>

{#snippet Row({
  children,
  row,
}: {
  children: Snippet;
  row: Tables<"persons_view">;
})}
  <PersonProvider person={row}>
    {@render children()}
  </PersonProvider>
{/snippet}

{#snippet Tags(tags: string[] | null)}
  {#each tags as tag}
    <span class="badge text-nowrap">{tag}</span>
  {:else}
    -
  {/each}
{/snippet}

{#snippet Timestamp(timestamp: string | null)}
  {new Date(timestamp!).toLocaleString("id", {
    timeStyle: "short",
    dateStyle: "short",
  })}
{/snippet}

{#snippet Json(json: any)}
  {@const id = crypto.randomUUID()}
  <button command="show-modal" commandfor={id} class="btn btn-sm btn-square"
    ><EyeIcon size={16} /></button
  >
  <dialog {id} class="modal">
    <div class="modal-box">{JSON.stringify(json)}</div>
  </dialog>
{/snippet}

{#snippet Faces()}
  {const person = getPersonContext()}
  <span class="badge text-nowrap">{person.faces.current?.count} faces</span>
{/snippet}

{#snippet Action()}
  <PersonFacesDialog />
{/snippet}
