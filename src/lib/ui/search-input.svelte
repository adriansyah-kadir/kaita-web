<script lang="ts">
  import SearchIcon from "@lucide/svelte/icons/search";
  import type { HTMLInputAttributes } from "svelte/elements";

  type Props = {
    loading?: boolean;
    onvalue?: (v: string) => void;
    debounce?: number;
  } & HTMLInputAttributes;

  let { loading = false, onvalue, debounce, ...props }: Props = $props();

  let timeout: ReturnType<typeof setTimeout>;

  function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
    const value = e.currentTarget.value;

    if (!debounce) {
      onvalue?.(value);
      return;
    }

    clearTimeout(timeout);
    timeout = setTimeout(() => onvalue?.(value), debounce);
  }
</script>

<label class="input {props.class}">
  <SearchIcon size={16} />
  <input {...props} class="grow" oninput={handleInput} />
  <span class:hidden={!loading} class="loading loading-spinner"></span>
</label>
