<script lang="ts">
  import FetchState from "$lib/runes/fetch.svelte";
  import supabase from "$lib/supabase";

  const { id }: { id: string } = $props();
  const url = new FetchState(async () => {
    const { data, error } = await supabase
      .from("uploads")
      .select()
      .eq("id", id)
      .single();
    if (error) throw error;
    const url = supabase.storage.from(data.bucket_id!).getPublicUrl(data.name!);
    return url.data.publicUrl;
  });

  $effect(() => {
    url.fetch();
  });
</script>

{#if url.current}
  <img alt="Uploaded" src={url.current} />
{/if}
