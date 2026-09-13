<script lang="ts" generics="T extends Record<string, any>">
  import { type Snippet } from "svelte";
  import Checkbox from "./checkbox.svelte";
  import ComboboxState from "$lib/runes/combobox.svelte";

  type CellProps<K extends keyof T> = {
    cellValue: T[K];
    rowValue: T;
  };

  type Cell<K extends keyof T> = Snippet<[CellProps<K>]>;
  type Head = Snippet | string;

  type Props = {
    values: T[];
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
    values,
    key,
    columns,
    RowAction,
    Cells = {},
    Heads = {},
  }: Props = $props();
  // const values = $derived(new FetchState(select));
  const first = $derived(values.at(0));
  const headers = $derived(columns ? columns : Object.keys(first ?? {}));
  export const combobox = new ComboboxState(() => ({
    items: values ?? [],
    key,
  }));

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
    {#each values as row}
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
  {#if !values.length}
    <caption class="text-center caption-bottom p-5">Empty</caption>
  {/if}
</table>

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
      {cellValue}
    {/if}
  </td>
{/snippet}
