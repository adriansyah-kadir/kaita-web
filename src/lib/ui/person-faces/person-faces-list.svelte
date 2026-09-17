<script lang="ts">
  import UploadedImageViewer from "../uploaded-image-viewer.svelte";
  import FaceDeleteBtn from "../faces/face-delete-btn.svelte";
  import { getPersonContext } from "$lib/context/person.svelte";

  const ctx = getPersonContext();
</script>

<div class="flex flex-wrap *:w-1/4 [&_img]:rounded-t-md [&_img]:w-full gap-2 items-end">
  {#each ctx.faces.current?.data as face (face.id)}
    <div class="[&>button]:w-full [&>button]:rounded-t-none">
      <UploadedImageViewer id={face.image_id!} />
      <FaceDeleteBtn {face} onDelete={ctx.faces.fetch} />
    </div>
  {/each}
</div>
