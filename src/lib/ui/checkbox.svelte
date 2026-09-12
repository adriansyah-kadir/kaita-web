<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  type Props = HTMLInputAttributes & {
    type?: "checkbox";
    onchecked?: (checked: boolean) => void;
  };

  const { onchecked, ...props }: Props = $props();
</script>

<input
  {...props}
  type={props.type ?? "checkbox"}
  onchange={(ev) => onchecked?.(ev.currentTarget.checked)}
  class="checkbox {props.class}"
/>
