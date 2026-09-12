<script lang="ts">
  import AddPersonDialog from "./add-person-dialog.svelte";
  import PersonDataset from "./person-dataset.svelte";
</script>

<div class="px-3 pb-3">
  <PersonDataset>
    {#snippet action()}
      <AddPersonDialog />
    {/snippet}
  </PersonDataset>
</div>
