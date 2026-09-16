<script lang="ts">
  import DialogState from "$lib/runes/dialog.svelte";
  import FetchState from "$lib/runes/fetch.svelte";
  import FormState from "$lib/runes/form.svelte";
  import { createFaceSchema } from "$lib/schemas/faces";
  import { selectPersonFaces } from "$lib/supabase/faces";
  import type { Tables } from "$lib/supabase/types";
  import Fieldset from "$lib/ui/fieldset.svelte";
  import { uploadFace } from "./actions";

  const { person }: { person: Tables<"persons_view"> } = $props();

  const dialog = new DialogState();
  // svelte-ignore state_referenced_locally
  const list = new FetchState(selectPersonFaces.bind(null, person.id!));
  // svelte-ignore state_referenced_locally
  const upload = new FetchState(uploadFace.bind(null, person.id!));

  const form = new FormState(createFaceSchema, ({ image }) =>
    upload.fetch(image).then(list.fetch),
  );

  $effect(() => {
    if (dialog.open) list.fetch();
    else upload.reset();
  });
</script>

<button onclick={dialog.show} class="btn btn-sm btn-info">Faces</button>

<dialog {@attach dialog.attach()} class="modal">
  <form
    {@attach form.attach()}
    class="modal-box space-y-2"
    onreset={dialog.close}
  >
    <div>
      {#each list.current?.data as face}
        <p>{face.image_id}</p>
      {/each}
    </div>
    <Fieldset legend="Upload image">
      <input
        class="input invalid:bg-error"
        type="file"
        name="image"
        accept="image/*"
      />
      {#each form.issues.image as e}
        <span class="text-error">{e.message}</span>
      {/each}

      <span class:hidden={upload.success} class="text-error"
        >{upload.error?.message}</span
      >
    </Fieldset>
    <div>
      <button class="btn" type="reset">Cancel</button>
      <button class="btn" disabled={form.validating}>Submit</button>
    </div>
  </form>
</dialog>
