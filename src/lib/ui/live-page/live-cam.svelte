<script lang="ts">
  import { getLiveContext } from "./live-context.svelte";

  const { recognition } = getLiveContext();
</script>

<div class="w-full h-full relative">
  {#if recognition.remote}
    <video class="w-full h-full" autoplay srcObject={recognition.remote}></video>
  {/if}
  <div class="absolute bottom-2 left-2">
    <button class="btn btn-warning" onclick={recognition.stop}>Stop</button>
  </div>
</div>
