<script lang="ts">
  import SearchIcon from "@lucide/svelte/icons/search";

  type Props = {
    value?: string;
    loading?: boolean;
    placeholder?: string;
    oninput?: (v: string) => void;
  };
  let {
    value,
    loading = false,
    placeholder = "Search",
    oninput,
  }: Props = $props();
</script>

<label class="input">
  <SearchIcon size={16} />
  <input
    class="grow"
    {placeholder}
    {value}
    oninput={(e) => oninput?.(e.currentTarget.value)}
  />
  <span class:hidden={!loading} class="loading loading-spinner"></span>
</label>
