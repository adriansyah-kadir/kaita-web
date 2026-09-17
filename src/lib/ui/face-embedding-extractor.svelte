<script lang="ts">
  import FetchState from "$lib/runes/fetch.svelte";
  import { extractEmbeddings, type Extracted } from "$lib/services/embeddings";

  type Result = {
    file: File;
    extracted: Extracted[];
  };

  const { onExtracted }: { onExtracted?: (results: Result[]) => any } =
    $props();

  const extract = new FetchState((files: FileList) =>
    Promise.all(
      Array.from(files).map(async (file) => ({
        file: file,
        extracted: await extractEmbeddings(file),
      })),
    ),
  );

  function onChange(ev: Event & { currentTarget: HTMLInputElement }) {
    const files = ev.currentTarget.files;
    if (files === null || files.length === 0) return;
    extract.fetch(files).then(onExtracted);
  }
</script>

<input
  disabled={extract.fetching}
  onchange={onChange}
  name="image w-full"
  type="file"
  accept="image/*"
  class="input"
  multiple
/>
