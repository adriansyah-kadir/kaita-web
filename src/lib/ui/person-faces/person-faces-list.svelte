<script lang="ts">
  import UploadedImageViewer from "../uploaded-image-viewer.svelte";
  import FaceDeleteBtn from "../faces/face-delete-btn.svelte";
  import { getPersonContext } from "$lib/context/person.svelte";

  const ctx = getPersonContext();
</script>

<div>
  {#each ctx.faces.current?.data as face}
    <div>
      <UploadedImageViewer id={face.image_id!} />
      <FaceDeleteBtn {face} onDelete={ctx.faces.fetch} />
    </div>
  {/each}
</div>
