<script lang="ts">
  import FaceEmbeddingExtractor from "../face-embedding-extractor.svelte";
  import PersonFaceUploadItem from "./person-faces-upload-item.svelte";
  import type { Extracted } from "$lib/services/embeddings";

  let embeddings = $state<Record<string, Extracted>>({});

  function discard(idx: string) {
    delete embeddings[idx];
  }
</script>

<div class="flex flex-wrap *:w-1/4 *:grow items-end gap-2 mb-2">
  {#each Object.entries(embeddings) as [k, embedding] (k)}
    {const remove = discard.bind(null, k)}
    <PersonFaceUploadItem {...embedding} onDiscard={remove} onDelete={remove} onUploaded={remove} />
  {/each}
</div>

<FaceEmbeddingExtractor
  onExtracted={(results) => {
    for (const embedding of results.map((e) => e.extracted).flat()) {
      embeddings[crypto.randomUUID()] = embedding;
    }
  }}
/>
