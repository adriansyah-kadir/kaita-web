<script lang="ts" generics="T extends Record<string, any>">
  import FetchState from "$lib/runes/fetch.svelte";
  import PaginationState from "$lib/runes/pagination.svelte";
  import { type Snippet } from "svelte";
  import Pagination from "./pagination.svelte";
  import Checkbox from "./checkbox.svelte";
  import ComboboxState from "$lib/runes/combobox.svelte";
  import Debounced from "$lib/runes/debounced.svelte";

  type CellProps<K extends keyof T> = {
    cellValue: T[K];
    rowValue: T;
  };

  type Cell<K extends keyof T> = Snippet<[CellProps<K>]>;
  type Head = Snippet | string;

  type Select = (
    pagination: PaginationState,
  ) => Promise<{ data: T[]; count?: number | null }>;

  type Props = {
    select: Select;
    key: (row: T) => string;
    columns?: (keyof T)[];
    selected?: T[];
    RowAction?: Snippet<[T]>;
    Heads?: Partial<Record<keyof T, Head>>;
    Cells?: Partial<{
      [K in keyof T]: Cell<K>;
    }>;
  };

  let {
    selected = $bindable(),
    select,
    key,
    columns,
    RowAction,
    Cells = {},
    Heads = {},
  }: Props = $props();
  const values = $derived(new FetchState(select));
  const first = $derived(values.current?.data.at(0));
  const headers = $derived(columns ? columns : Object.keys(first ?? {}));
  const loading = new Debounced(() => values.fetching);
  export const pagination = new PaginationState();
  export const combobox = new ComboboxState(() => ({
    items: values.current?.data ?? [],
    key,
  }));

  export const refetch = () => values.fetch(pagination);

  $effect(() => {
    refetch();
  });

  $effect(() => {
    pagination.total = values.current?.count ?? null;
  });

  $effect(() => {
    selected = combobox.selected;
  });
</script>

<table class="table">
  <thead>
    <tr>
      {@render HeadCheck()}
      {#each headers as h}
        <th>{@render Head(h)}</th>
      {/each}
      {#if RowAction}
        <th>Action</th>
      {/if}
    </tr>
  </thead>
  <tbody>
    {#each values.current?.data as row}
      <tr>
        {@render RowCheck(row)}
        {#each headers as k}
          {@render Cell(row, k)}
        {/each}
        {#if RowAction}
          <td>{@render RowAction(row)}</td>
        {/if}
      </tr>
    {/each}
  </tbody>
  {#if loading.value}
    <caption class="text-center">Loading</caption>
  {:else if !values.current?.data.length}
    <caption class="text-center">Empty</caption>
  {/if}
</table>
<Pagination class="px-4" state={pagination} />

{#snippet Head(k: keyof T)}
  {@const head = Heads[k]}
  {#if typeof head === "string"}
    {head}
  {:else if head !== undefined}
    {@render head()}
  {:else}
    {k}
  {/if}
{/snippet}

{#snippet HeadCheck()}
  {#if selected !== undefined}
    <th
      ><Checkbox
        checked={combobox.isSelectedAll}
        onchecked={combobox.toggleall}
      /></th
    >
  {/if}
{/snippet}

{#snippet RowCheck(row: T)}
  {#if selected !== undefined}
    <th>
      <Checkbox
        checked={combobox.isSelected(key(row))}
        onchecked={combobox.toggle.bind(null, key(row))}
      /></th
    >
  {/if}
{/snippet}

{#snippet Cell(row: T, k: keyof T)}
  {@const cell = Cells[k]}
  {@const cellValue = row[k]}
  <td>
    {#if cell}
      {@render cell({ cellValue, rowValue: row })}
    {:else}
      {row[k]}
    {/if}
  </td>
{/snippet}
