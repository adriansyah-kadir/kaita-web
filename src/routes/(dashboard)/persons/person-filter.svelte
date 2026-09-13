<script lang="ts">
  import Fieldset from "$lib/ui/fieldset.svelte";
  import SearchInput from "$lib/ui/search-input.svelte";
  import TagsCombobox from "$lib/ui/tags-combobox.svelte";
  import ListFilterIcon from "@lucide/svelte/icons/list-filter";

  let tags = $state<TagsCombobox>();
</script>

<button command="show-modal" commandfor="person-filter" class="btn btn-square"
  ><ListFilterIcon size={16} /></button
>

<dialog id="person-filter" class="modal">
  <form class="modal-box w-xs">
    <Fieldset legend="Name">
      <SearchInput class="w-ful" name="name" />
    </Fieldset>

    <Fieldset legend="Tags">
      <input
        hidden
        multiple
        checked
        type="checkbox"
        name="tags"
        value={tags?.combobox.selected.map((e) => e.name).join(",")}
      />
      <TagsCombobox bind:this={tags} />
    </Fieldset>

    <button type="reset" class="btn mt-2">Clear</button>
    <button class="btn mt-2">Search</button>
  </form>
</dialog>
