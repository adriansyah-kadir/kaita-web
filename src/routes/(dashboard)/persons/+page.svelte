<script lang="ts">
  import Pagination from "$lib/ui/pagination.svelte";
  import PersonsPageContext, { initContext } from "./context.svelte";
  import PersonCreateDialog from "./person-create-dialog.svelte";
  import PersonsFilter from "./persons-filter.svelte";
  import PersonsTable from "./persons-table.svelte";

  const ctx = PersonsPageContext.set(initContext());
</script>

<div class="p-3 space-y-3">
  <div class="flex items-center gap-2">
    <PersonsFilter />
    <PersonCreateDialog />
  </div>

  <div class="overflow-x-auto">
    <PersonsTable />
  </div>

  <Pagination
    total={ctx.persons.current?.count ?? 0}
    page={ctx.params.values.page}
    pageSize={ctx.params.values.pageSize}
    onChange={(page) => ctx.params.update({ page })}
  />
</div>
