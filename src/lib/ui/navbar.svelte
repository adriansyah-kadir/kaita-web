<script lang="ts">
  import type { Snippet } from "svelte";
  import MenuIcon from "@lucide/svelte/icons/menu";

  type Link = { name: string; link: string } | { name: string; links: Link[] };
  type Props = {
    links?: Link[];
    prefix?: Snippet;
    suffix?: Snippet;
  };

  const {
    prefix,
    suffix,
    links = [
      { name: "Dashboard", link: "/" },
      { name: "Persons", link: "/persons" },
      { name: "Tags", link: "/tags" },
    ],
  }: Props = $props();
</script>

<div class="navbar">
  <div class="navbar-start gap-2">
    <button
      command="show-popover"
      commandfor="navs"
      class="btn btn-square sm:hidden"><MenuIcon size={16} /></button
    >
    <div id="navs" popover class="bg-base-200 my-1 rounded-box [&_a]:pr-10">
      {@render NavsMobile(links)}
    </div>
    {@render prefix?.()}
  </div>
  <div class="navbar-center hidden sm:block">
    {@render NavsDesktop(links)}
  </div>
  <div class="navbar-end gap-2">
    {@render suffix?.()}
  </div>
</div>

{#snippet NavsMobile(links: Link[])}
  <ul class="menu menu-vertical px-1">
    {#each links as link}
      {@render NavMobile(link)}
    {/each}
  </ul>
{/snippet}

{#snippet NavMobile(link: Link)}
  {#if "link" in link}
    <li><a href={link.link}>{link.name}</a></li>
  {:else}
    <li>
      <details>
        <summary>{link.name}</summary>
        {@render NavsMobile(link.links)}
      </details>
    </li>
  {/if}
{/snippet}

{#snippet NavsDesktop(links: Link[])}
  <ul class="menu menu-horizontal px-1">
    {#each links as link}
      {@render NavDesktop(link)}
    {/each}
  </ul>
{/snippet}

{#snippet NavDesktop(link: Link)}
  {#if "link" in link}
    <li><a href={link.link}>{link.name}</a></li>
  {:else}
    <li>
      <details>
        <summary>{link.name}</summary>
        {@render NavsDesktop(link.links)}
      </details>
    </li>
  {/if}
{/snippet}
