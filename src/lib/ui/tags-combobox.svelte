<script lang="ts">
  // import ComboboxState from "$lib/runes/combobox.svelte";
  import FetchState from "$lib/runes/fetch.svelte";
  import { fetchTags } from "$lib/supabase/tags";
  import type { Tables } from "$lib/supabase/types";
  // import SearchInput from "./search-input.svelte";
  import Debounced from "$lib/runes/debounced.svelte";
  import ComboboxState from "$lib/runes/combobox.svelte";
  // import onFormReset from "$lib/hooks/on-form-reset";

  type Tag = Tables<"tags">;

  let {
    name,
    value = (t) => t.id,
  }: {
    name?: string;
    value?: (tag: Tag) => string;
  } = $props();

  const id = crypto.randomUUID();
  const search = new Debounced(() => "");
  const tags = new FetchState(fetchTags);
  const combobox = new ComboboxState<Tag>(() => ({
    items: tags.current ?? [],
    key: (tag) => tag.id,
  }));

  $effect(() => {
    tags.fetch(search.value);
  });
</script>

<button
  type="button"
  class="input text-start h-auto min-h-(--size) flex-wrap"
  command="toggle-popover"
  commandfor={id}
>
  {#if combobox.selected.length > 1}
    {combobox.selected.length} Selected
  {:else if combobox.selected.length > 0}
    {combobox.selected.at(0)?.name}
  {:else}
    Select tag
  {/if}
</button>

<div popover="auto" {id} class="min-w-[anchor-size(width)]">
  <div class="list bg-base-200 w-[anchor-size(width)] rounded-field">
    {#each tags.current as tag (tag.id)}
      <label class="list-row">
        <input
          bind:checked={
            () => combobox.checked(tag.id), (v) => combobox.toggle(tag.id, v)
          }
          {name}
          value={value(tag)}
          type="checkbox"
        />
        {tag.name}
      </label>
    {/each}
  </div>
</div>
