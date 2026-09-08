<script lang="ts">
  import supabase from "$lib/supabase";
  import session from "$lib/supabase/session.svelte";
</script>

{#if $session}
  <button onclick={() => supabase.auth.signOut()} class="btn">Logout</button>
{:else}
  <a href="/auth/signin" class="btn">Login</a>
{/if}
