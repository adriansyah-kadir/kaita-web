<script lang="ts">
  import FetchState from "$lib/runes/fetch.svelte";
  import supabase from "$lib/supabase";
  import { getContext } from "svelte";
  import UploadedImageViewer from "../uploaded-image-viewer.svelte";
  import FaceDeleteBtn from "../faces/face-delete-btn.svelte";

  const personId: string = getContext("personId");
  const list = new FetchState(async () => {
    const { data, error } = await supabase
      .from("faces")
      .select()
      .eq("person_id", personId);
    if (error) throw error;
    return data;
  });

  $effect(() => {
    list.fetch();
  });
</script>

<div>
  {#each list.current as face}
    <div>
      <UploadedImageViewer id={face.image_id} />
      <FaceDeleteBtn {face} onDelete={list.fetch} />
    </div>
  {/each}
</div>
