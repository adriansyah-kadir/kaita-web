<script lang="ts">
  import DialogState from "$lib/runes/dialog.svelte";
  import PersonFaces from "$lib/ui/person-faces/person-faces.svelte";

  const dialog = new DialogState();
</script>

<button onclick={dialog.show} class="btn btn-sm btn-info">
  Upload faces
</button>

<dialog {@attach dialog.attach()} class="modal">
  <div class="modal-box space-y-2">
    {#if dialog.open}
      <PersonFaces />
    {/if}
  </div>
</dialog>
