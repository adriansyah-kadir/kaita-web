<script lang="ts">
  import FormState from "$lib/runes/form.svelte";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import { createTagSchema } from "$lib/schemas/tag";
  import Fieldset from "$lib/ui/fieldset.svelte";
  import FetchState from "$lib/runes/fetch.svelte";
  import { insertTag } from "$lib/supabase/tags";

  let dialog = $state<HTMLDialogElement>();
  const insert = new FetchState(insertTag);
  const form = new FormState(createTagSchema, {
    onSubmit: ({ name }) => insert.fetch(name).then(() => dialog?.close()),
  });
</script>

<button
  command="show-modal"
  commandfor="create-tag-dialog"
  class="btn btn-primary"
>
  <PlusIcon size={16} />
  Create tag
</button>

<dialog bind:this={dialog} id="create-tag-dialog" class="modal">
  <form {@attach form.attachment} class="modal-box space-y-2">
    <Fieldset legend="Name">
      <input name="name" class="input" />
      {#each form.issues.name as e}
        <span class="text-error">{e.message}</span>
      {/each}
    </Fieldset>
    <div>
      <button type="reset" onclick={() => dialog?.close()} class="btn"
        >Cancel</button
      >
      <button disabled={insert.fetching} class="btn">Save</button>
    </div>
  </form>
</dialog>
