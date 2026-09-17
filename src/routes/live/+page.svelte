<script lang="ts">
  import { requestMediaDevices } from "$lib";
  import FormState from "$lib/runes/form.svelte";
  import { liveSchema } from "$lib/schemas/live";
  import Fieldset from "$lib/ui/fieldset.svelte";
  import TagsCombobox from "$lib/ui/tags-combobox.svelte";

  const form = new FormState(liveSchema, console.log);
</script>

<div class="w-dvw h-dvh flex items-center justify-center">
  <form {@attach form.attach()} class="w-xs">
    <Fieldset legend="Tags">
      <TagsCombobox name="tags" />
      {#each form.issues.tags as issue}
        <span class="text-error">{issue.message}</span>
      {/each}
    </Fieldset>

    <Fieldset legend="Cam">
      <select name="device" class="select">
        {#await requestMediaDevices({ video: true }) then devices}
          {#each devices as dev}
            <option value={dev.deviceId}>{dev.label}</option>
          {/each}
        {/await}
      </select>
      {#each form.issues.device as issue}
        <span class="text-error">{issue.message}</span>
      {/each}
    </Fieldset>

    <button disabled={form.validating} class="btn btn-primary w-full mt-4"
      >Start</button
    >
  </form>
</div>
