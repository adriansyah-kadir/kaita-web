<script lang="ts">
  import {
    getPersonContext,
    hasPersonContext,
  } from "$lib/context/person.svelte";
  import FetchState from "$lib/runes/fetch.svelte";
  import type { Extracted } from "$lib/services/embeddings";
  import { insertFace } from "$lib/supabase/faces";
  import { uploadFile } from "$lib/supabase/storage";
  import type { Tables } from "$lib/supabase/types";
  import UploadIcon from "@lucide/svelte/icons/upload";

  const {
    cropped,
    embedding,
    personId,
    onSuccess,
  }: Extracted & {
    personId: string;
    onSuccess?: (face: Tables<"faces">) => any;
  } = $props();

  const person = hasPersonContext() ? getPersonContext() : undefined;
  const insert = new FetchState(async () => {
    const uploaded = await uploadFile(cropped);
    const face = await insertFace(personId, embedding, uploaded.id);
    return face;
  });

  function onClick() {
    insert.fetch().then((face) => {
      onSuccess?.(face);
      person?.faces.fetch();
    });
  }
</script>

<button onclick={onClick} class="btn btn-primary btn-soft">
  <UploadIcon size={16} />
</button>
