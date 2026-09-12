<script lang="ts">
  import SearchIcon from "@lucide/svelte/icons/search";
  import type { HTMLInputAttributes } from "svelte/elements";

  type Props = {
    loading?: boolean;
    onvalue?: (v: string) => void;
  } & HTMLInputAttributes;

  let { loading = false, onvalue: onvalue, ...props }: Props = $props();
</script>

<label class="input {props.class}">
  <SearchIcon size={16} />
  <input
    {...props}
    class="grow"
    oninput={(e) => onvalue?.(e.currentTarget.value)}
  />
  <span class:hidden={!loading} class="loading loading-spinner"></span>
</label>
