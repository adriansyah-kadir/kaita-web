<script lang="ts">
  import FetchState from "$lib/runes/fetch.svelte";
  import FormState from "$lib/runes/form.svelte";
  import { addPersonSchema } from "$lib/schemas/person";
  import { insertPerson } from "$lib/supabase/persons";
  import Fieldset from "$lib/ui/fieldset.svelte";
  import TagsCombobox from "$lib/ui/tags-combobox.svelte";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import { getPersonsPageContext } from "./context.svelte";

  let dialog = $state<HTMLDialogElement>();
  let tags = $state<TagsCombobox>();
  const ctx = getPersonsPageContext();
  const insert = new FetchState(insertPerson);
  const form = new FormState(addPersonSchema, ({ name, tagIds }) =>
    insert.fetch(name, tagIds).then(() => {
      ctx.refetch();
      close();
    }),
  );

  const close = () => {
    insert.reset();
    dialog?.close();
  };
</script>

<button
  class="btn btn-primary"
  command="show-modal"
  commandfor="add-person-dialog"
>
  <PlusIcon size={16} /> Create person
</button>

<dialog bind:this={dialog} id="add-person-dialog" class="modal">
  <form {@attach form.attach()} class="modal-box">
    <h3 class="text-lg font-bold">Hello!</h3>

    <Fieldset legend="Name">
      <input name="name" class="input" />
      <p class="label">Lorem ipsum dolor sit amet.</p>
      {#each form.issues.name as issue}
        <p class="text-error">{issue.message}</p>
      {/each}
    </Fieldset>

    {@render TagsInput()}

    <button type="reset" onclick={close} class="btn">Cancel</button>
    <button disabled={insert.fetching} class="btn">Save</button>
  </form>
</dialog>

{#snippet TagsInput()}
  <Fieldset legend="Tags">
    <TagsCombobox name="tagIds" />
    <p class="label">Lorem ipsum dolor sit amet.</p>
    {#each form.issues.tagIds as issue}
      <p class="text-error">{issue.message}</p>
    {/each}
  </Fieldset>
{/snippet}
