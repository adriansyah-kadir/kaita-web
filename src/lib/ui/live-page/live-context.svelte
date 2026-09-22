<script module>
  import RecognitionService from "$lib/services/recognition.svelte";
  import { createContext } from "svelte";

  function initLiveContext() {
    const recognition = new RecognitionService();

    return {
      recognition,
    };
  }

  export type LiveContext = ReturnType<typeof initLiveContext>;

  export const [getLiveContext, setLiveContext] = createContext<LiveContext>();
</script>

<script lang="ts">
  const { children } = $props();

  setLiveContext(initLiveContext());
</script>

{@render children?.()}
