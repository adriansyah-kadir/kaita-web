<script lang="ts">
  import FetchState from "$lib/runes/fetch.svelte";
  import FormState from "$lib/runes/form.svelte";
  import { addPersonSchema } from "$lib/schemas/person";
  import { insertPerson } from "$lib/supabase/persons";
  import type { Tables } from "$lib/supabase/types";
  import Fieldset from "$lib/ui/fieldset.svelte";
  import TagsCombobox from "$lib/ui/tags-combobox.svelte";
  import PlusIcon from "@lucide/svelte/icons/plus";

  const { onSuccess }: { onSuccess?: (person: Tables<"persons">) => void } =
    $props();

  let dialog = $state<HTMLDialogElement>();
  let tags = $state<TagsCombobox>();
  const addPerson = new FetchState(insertPerson);
  const form = new FormState(addPersonSchema, {
    onSubmit: ({ name, tagIds }) =>
      addPerson.fetch(name, tagIds).then((result) => {
        onSuccess?.(result.person);
        discard();
      }),
  });

  const discard = () => {
    addPerson.reset();
    form.reset();
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
  <form {@attach form.attachment} class="modal-box">
    <h3 class="text-lg font-bold">Hello!</h3>

    <Fieldset legend="Name">
      <input name="name" class="input" />
      <p class="label">Lorem ipsum dolor sit amet.</p>
      {#each form.issues.name as issue}
        <p class="text-error">{issue.message}</p>
      {/each}
    </Fieldset>

    {@render TagsInput()}

    <button type="reset" onclick={discard} class="btn">Cancel</button>
    <button disabled={addPerson.fetching} class="btn">Save</button>
  </form>
</dialog>

{#snippet TagsInput()}
  <Fieldset legend="Tags">
    {#each tags?.combobox.selected as t}
      <input
        hidden
        name="tagIds"
        value={t.id}
      />
    {/each}
    <TagsCombobox bind:this={tags} />
    <p class="label">Lorem ipsum dolor sit amet.</p>
    {#each form.issues.tagIds as issue}
      <p class="text-error">{issue.message}</p>
    {/each}
  </Fieldset>
{/snippet}
