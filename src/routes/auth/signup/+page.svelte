<script lang="ts">
  import FormState from "$lib/states/form.svelte";
  import FetchState from "$lib/states/fetch.svelte";
  import supabase from "$lib/supabase";
  import Fieldset from "$lib/ui/fieldset.svelte";
  import { signInSchema, type SignInSchema } from "$lib/schemas/auth";
  import { goto } from "$app/navigation";

  const signUp = new FetchState(async (data: SignInSchema) => {
    const response = await supabase.auth.signUp(data);
    if (response.error) throw response.error.message;
    goto("/");
  });

  const form = new FormState(signInSchema, {
    onSubmit: signUp.fetch,
  });
</script>

<div class="w-dvw h-dvh flex items-center justify-center">
  <form {@attach form.attachment} class="max-w-sm w-full">
    <Fieldset
      legend="Kaita"
      class="bg-base-200 border border-base-300 rounded-box p-4 [&_legend]:text-xl"
    >
      <label for="email" class="label">Password</label>
      <input id="email" name="email" class="input w-full" />
      {#each form.issues.email as issue}
        <p class="text-error">{issue.message}</p>
      {/each}

      <label for="password" class="label">Password</label>
      <input id="password" name="password" class="input w-full" />
      {#each form.issues.password as issue}
        <p class="text-error">{issue.message}</p>
      {/each}

      <button
        type="submit"
        disabled={form.submitting || form.validating || signUp.fetching}
        class:ring={form.invalid || signUp.error}
        class:ring-error={form.invalid || signUp.error}
        class="btn btn-neutral mt-4">Sign Up</button
      >

      <p class:hidden={!signUp.error} class="text-error text-center">
        {signUp.error}
      </p>
    </Fieldset>

    <p class="my-4 text-sm text-center">
      Already have an account? <a class="link link-info" href="/auth/signin"
        >login</a
      >
    </p>
  </form>
</div>
