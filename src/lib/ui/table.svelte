<script lang="ts" generics="T extends Record<string, any>">
  import { type Snippet } from "svelte";
  import Checkbox from "./checkbox.svelte";
  import ComboboxState from "$lib/runes/combobox.svelte";
  import type { HTMLAttributes } from "svelte/elements";

  type Cell<K extends keyof T> = Snippet<[T[K], T]>;
  type Head = Snippet | string;

  type Props = {
    values: T[];
    key: (row: T) => string;
    columns?: (keyof T)[];
    selected?: T[];
    select?: boolean;
    Row?: Snippet<[{ row: T; children: Snippet }]>;
    RowAction?: Snippet<[T]>;
    Heads?: Partial<Record<keyof T, Head>>;
    Cells?: Partial<{
      [K in keyof T]: Cell<K>;
    }>;
  } & HTMLAttributes<HTMLTableElement>;

  let {
    select,
    values,
    key,
    columns,
    RowAction,
    Cells = {},
    Heads = {},
    Row,
    ...props
  }: Props = $props();
  // const values = $derived(new FetchState(select));
  const first = $derived(values.at(0));
  const headers = $derived(columns ? columns : Object.keys(first ?? {}));
  export const combobox = new ComboboxState(() => ({
    items: values ?? [],
    key,
  }));
</script>

<table {...props} class="table {props.class}">
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
      {#snippet Inner()}
        {@render RowInner(row)}
      {/snippet}
      {#if Row}
        {@render Row({ row, children: Inner })}
      {:else}
        {@render Inner()}
      {/if}
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

{#snippet RowInner(row: T)}
  <tr>
    {@render RowCheck(row)}
    {#each headers as k}
      {@render Cell(row, k)}
    {/each}
    {#if RowAction}
      <td>{@render RowAction(row)}</td>
    {/if}
  </tr>
{/snippet}

{#snippet HeadCheck()}
  {#if select}
    <th
      ><Checkbox
        checked={combobox.isSelectedAll}
        onchecked={combobox.toggleall}
      /></th
    >
  {/if}
{/snippet}

{#snippet RowCheck(row: T)}
  {#if select}
    <th>
      <Checkbox
        checked={combobox.isSelected(key(row))}
        onchecked={combobox.toggle.bind(null, key(row))}
      /></th
    >
  {/if}
{/snippet}

{#snippet Cell(row: T, k: keyof T)}
  {@const cellRender = Cells[k]}
  {@const cellValue = row[k]}
  <td>
    {#if cellRender}
      {@render cellRender(cellValue, row)}
    {:else}
      {cellValue}
    {/if}
  </td>
{/snippet}
