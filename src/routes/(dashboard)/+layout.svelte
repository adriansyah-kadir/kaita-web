<script lang="ts">
	import AuthBtn from "$lib/ui/auth-btn.svelte";
	import Navbar from "$lib/ui/navbar.svelte";

	let { children } = $props();
</script>

<Navbar>
	{#snippet prefix()}
		<a href="/" class="leading-0">Kaita</a>
	{/snippet}
	{#snippet suffix()}
		<AuthBtn />
	{/snippet}
</Navbar>
{@render children()}
