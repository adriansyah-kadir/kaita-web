<script lang="ts">
  import {
    getPersonContext,
    hasPersonContext,
  } from "$lib/context/person.svelte";
  import FetchState from "$lib/runes/fetch.svelte";
  import supabase from "$lib/supabase";
  import type { Tables } from "$lib/supabase/types";
  import TrashIcon from "@lucide/svelte/icons/trash";

  const {
    face,
    onDelete,
  }: {
    face: Tables<"faces">;
    onDelete?: () => any;
  } = $props();

  const person = hasPersonContext() ? getPersonContext() : undefined;
  const del = new FetchState(async () => {
    const { error, data } = await supabase
      .from("faces")
      .delete()
      .eq("id", face.id)
      .select()
      .single();
    if (error) throw error;
    const file = await supabase
      .from("uploads")
      .select()
      .eq("id", data.image_id)
      .single();
    if (!file.data) return;
    await supabase.storage.from(file.data.bucket_id!).remove([file.data.name!]);
  });

  function onClick() {
    del.fetch().then(() => {
      onDelete?.();
      person?.faces.fetch();
    });
  }
</script>

<button disabled={del.fetching || del.success()} onclick={onClick} class="btn">
  <TrashIcon size={16} />
</button>
