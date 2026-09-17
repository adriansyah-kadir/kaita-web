<script lang="ts">
  import DialogState from "$lib/runes/dialog.svelte";
  import type { Tables } from "$lib/supabase/types";
  import PersonFaces from "$lib/ui/person-faces/person-faces.svelte";

  const { person }: { person: Tables<"persons_view"> } = $props();

  const dialog = new DialogState();
</script>

<button onclick={dialog.show} class="btn btn-sm btn-info">
  Upload faces
</button>

<dialog {@attach dialog.attach()} class="modal">
  <div class="modal-box space-y-2">
    {#if dialog.open}
      <PersonFaces {person} />
    {/if}
  </div>
</dialog>
