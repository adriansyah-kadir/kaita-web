<script lang="ts">
	import Navbar from "$lib/ui/navbar.svelte";

	let { children } = $props();
</script>

<Navbar>
	{#snippet prefix()}
		<a href="/" class="leading-0">Kaita</a>
	{/snippet}
	{#snippet suffix()}
		<a class="btn" href="/auth/signin">Login</a>
	{/snippet}
</Navbar>
{@render children()}
