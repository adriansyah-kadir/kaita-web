<script lang="ts">
  import type { Extracted } from "$lib/services/embeddings";
  import XIcon from "@lucide/svelte/icons/x";
  import type { Tables } from "$lib/supabase/types";
  import { getContext } from "svelte";
  import FaceDeleteBtn from "../faces/face-delete-btn.svelte";
  import FaceInsertBtn from "../faces/face-insert-btn.svelte";

  const {
    cropped,
    embedding,
    onDiscard,
    onUploaded,
    onDelete,
  }: Extracted & {
    onDiscard?: () => void;
    onDelete?: () => void;
    onUploaded?: (value: Tables<"faces">) => void;
  } = $props();

  let face = $state<Tables<"faces">>();
  const personId: string = getContext("personId");
</script>

<div class="rounded-sm overflow-hidden flex flex-col">
  <img alt="Cropped embedding grow" src={URL.createObjectURL(cropped)} />
  <div class="join w-full *:grow *:rounded-t-none flex">
    {#if face}
      <FaceDeleteBtn {face} {onDelete} />
    {:else}
      <FaceInsertBtn
        {cropped}
        {embedding}
        {personId}
        onSuccess={(v) => {
          face = v;
          onUploaded?.(v);
        }}
      />
      <button onclick={onDiscard} class="btn btn-error btn-soft"
        ><XIcon size={16} /></button
      >
    {/if}
  </div>
</div>
