<script lang="ts">
  import LiveCam from "$lib/ui/live-page/live-cam.svelte";
  import LiveContext, {
    getLiveContext,
  } from "$lib/ui/live-page/live-context.svelte";
  import LiveForm from "$lib/ui/live-page/live-form.svelte";
</script>

<LiveContext>
  {@const { recognition } = getLiveContext()}
  <div class="w-dvw h-dvh flex items-center justify-center">
    {#if recognition.connected}
      <LiveCam />
    {:else}
      <LiveForm />
    {/if}
  </div>
</LiveContext>
