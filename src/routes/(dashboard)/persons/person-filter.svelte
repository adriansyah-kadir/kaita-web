<script lang="ts">
  import Fieldset from "$lib/ui/fieldset.svelte";
  import SearchInput from "$lib/ui/search-input.svelte";
  import TagsCombobox from "$lib/ui/tags-combobox.svelte";
  import ListFilterIcon from "@lucide/svelte/icons/list-filter";
  import PersonsPageContext from "./context.svelte";

  let tags = $state<TagsCombobox>();
  const ctx = PersonsPageContext.get();
</script>

<button command="show-modal" commandfor="person-filter" class="btn btn-square"
  ><ListFilterIcon size={16} /></button
>

<dialog id="person-filter" class="modal">
  <form onreset={() => ctx.params.clear("name", "tags")} class="modal-box w-xs">
    <Fieldset legend="Name">
      <SearchInput class="w-ful" name="name" />
    </Fieldset>

    <Fieldset legend="Tags">
      {#each tags?.combobox.selected as tag}
        <input hidden name="tags" value={tag.name} />
      {/each}
      <TagsCombobox bind:this={tags} />
    </Fieldset>

    <button type="reset" class="btn mt-2">Clear</button>
    <button class="btn mt-2">Search</button>
  </form>
</dialog>
