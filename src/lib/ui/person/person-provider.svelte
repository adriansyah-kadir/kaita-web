<script lang="ts">
  import {
    initPersonContext,
    setPersonContext,
  } from "$lib/context/person.svelte";
  import type { Person } from "$lib/supabase";
  import type { Snippet } from "svelte";

  const { person, children }: { person: Person; children?: Snippet } = $props();

  // svelte-ignore state_referenced_locally
  setPersonContext(initPersonContext(person));
</script>

{@render children?.()}
