<script lang="ts">
  import Fieldset from "$lib/ui/fieldset.svelte";
</script>

<div class="w-dvw h-dvh flex items-center justify-center">
  <form class="max-w-sm w-full">
    <Fieldset
      legend="Kaita"
      class="bg-base-200 border border-base-300 rounded-box p-4 [&_legend]:text-xl"
    >
      <label for="email" class="label">Password</label>
      <input name="email" class="input w-full" />

      <label for="password" class="label">Password</label>
      <input name="password" class="input w-full" />

      <button type="submit" class="btn btn-neutral mt-4">Sign In</button>
    </Fieldset>
    <p class="my-4 text-sm text-center">Didn't have an account? <a class="link link-info" href="/auth/signup">register</a></p>
  </form>
</div>
