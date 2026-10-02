<script>
  import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableContent,
    TableEmptyState,
    TableHeader,
    TableRow,
    TableScrollContainer,
  } from "heroui-svelte";
  import { fetchTags } from "$lib/supabase/tags";
  import FetchState from "$lib/runes/fetch.svelte";
  import SearchParamsState from "$lib/runes/search-param.svelte";
  import Trash from "@lucide/svelte/icons/trash";

  const tags = new FetchState(fetchTags);
  const params = new SearchParamsState({
    name: (v) => v,
  });
  const refetch = () => tags.fetch(params.values.name ?? undefined);

  $effect(() => {
    refetch();
  });
</script>

<Table>
  <TableScrollContainer>
    <TableContent>
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Id</TableColumn>
        <TableColumn>User</TableColumn>
        <TableColumn>Created</TableColumn>
        <TableColumn>Action</TableColumn>
      </TableHeader>
      <TableBody>
        {#each tags.current as tag}
          <TableRow>
            <TableCell>
              {tag.name}
            </TableCell>
            <TableCell>
              {tag.id}
            </TableCell>
            <TableCell>
              {tag.owner_id}
            </TableCell>
            <TableCell>
              {new Date(tag.created_at).toLocaleString()}
            </TableCell>
            <TableCell>
              <Button size="sm" variant="danger-soft" isIconOnly>
                <Trash class="size-4" />
              </Button>
            </TableCell>
          </TableRow>
        {:else}
          <TableEmptyState />
        {/each}
      </TableBody>
    </TableContent>
  </TableScrollContainer>
</Table>
