<script lang="ts">
  import { requestMediaDevices } from "$lib";
  import FetchState from "$lib/runes/fetch.svelte";
  import FormState from "$lib/runes/form.svelte";
  import { liveSchema } from "$lib/schemas/live";
  import Fieldset from "$lib/ui/fieldset.svelte";
  import TagsCombobox from "$lib/ui/tags-combobox.svelte";
  import { untrack } from "svelte";
  import { getLiveContext } from "./live-context.svelte";

  const { recognition } = getLiveContext();
  const start = new FetchState(recognition.start);
  const form = new FormState(liveSchema, start.fetch);

  $effect(() => {
    if (!recognition.connected)
      untrack(() => {
        start.reset();
        form.reset();
      });
  });
</script>

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

  <button
    disabled={form.validating || start.success() || start.fetching}
    class="btn btn-primary w-full mt-4"
  >
    Start {recognition.webrtc.connectionState}
  </button>

  <p class:hidden={start.success()} class="text-error mt-2">
    {start.error?.message}
  </p>
</form>
