<script lang="ts">
  import type { Tables } from "$lib/supabase/types";
    import { setContext } from "svelte";
  import PersonFaceList from "./person-faces-list.svelte";

  import PersonFaceUpload from "./person-faces-upload.svelte";

  const { person }: { person: Tables<"persons_view"> } = $props();

  // svelte-ignore state_referenced_locally
  setContext("personId", person.id!)
</script>

<div>
  <PersonFaceList />
  <PersonFaceUpload />
</div>
