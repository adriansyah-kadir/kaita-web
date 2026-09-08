<script lang="ts">
  import FetchState from "$lib/states/fetch.svelte";
  import supabase from "$lib/supabase";
  import session from "$lib/states/session.svelte";

  const signOut = new FetchState(() => supabase.auth.signOut());
</script>

{#if $session}
  <button disabled={signOut.fetching} onclick={signOut.fetch} class="btn"
    >Logout</button
  >
{:else}
  <a href="/auth/signin" class="btn">Login</a>
{/if}
