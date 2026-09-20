<script lang="ts">
  import type RecognitionService from "$lib/services/recognition.svelte";

  const {
    recognition,
  }: {
    recognition: RecognitionService;
  } = $props();
</script>

{#if recognition.remote}
  <video autoplay srcObject={recognition.remote}></video>
{/if}
