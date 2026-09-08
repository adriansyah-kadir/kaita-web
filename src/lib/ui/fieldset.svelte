<script lang="ts">
  import type { HTMLFieldsetAttributes } from "svelte/elements";

  const {
    legend,
    children,
    ...props
  }: HTMLFieldsetAttributes & { legend: string } = $props();
</script>

<fieldset {...props} class="fieldset {props.class}">
  <legend class="fieldset-legend">{legend}</legend>
  {@render children?.()}
</fieldset>
