<script lang="ts">
  import type { Tables } from "$lib/supabase/types";
  import PenIcon from "@lucide/svelte/icons/pen";

  type Props = {
    persons?: Tables<"persons_view">[];
  };
  const { persons }: Props = $props();
</script>

<table class="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Tags</th>
      <th>Faces</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each persons as person (person.id)}
      <tr>
        <td>{person.name}</td>
        <td>
          {#each person.tags as tag}
            <span class="badge">{tag}</span>
          {/each}
        </td>
        <td>{person.faces}</td>
        <td
          ><button class="btn btn-square btn-neutral btn-sm"
            ><PenIcon size={12} /></button
          ></td
        >
      </tr>
    {/each}
  </tbody>
</table>
