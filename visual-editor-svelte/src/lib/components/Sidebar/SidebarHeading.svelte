<script lang="ts">
  import type { Snippet } from 'svelte'
  import Flex from '$lib/components/ui/Flex.svelte'
  import UnstyledButton from '$lib/components/ui/UnstyledButton.svelte'

  interface Props {
    title: string
    description?: string | null
    onclick?: () => void
    children?: Snippet
    hoverActions?: Snippet
  }

  let { title, description = null, onclick, children, hoverActions }: Props = $props()
</script>

<div class="sidebar-heading" bind:this={headingElement}>
  <Flex gap={0} between>
    {#if onclick}
      <UnstyledButton {onclick} class="heading-title">
        <strong>{title}</strong>
        {#if description}
          <span class="description">{description}</span>
        {/if}
      </UnstyledButton>
    {:else}
      <div class="heading-title">
        <strong>{title}</strong>
        {#if description}
          <span class="description">{description}</span>
        {/if}
      </div>
    {/if}
    {#if hoverActions}
      <div class="hoverable-actions">
        {@render hoverActions()}
      </div>
    {/if}
    {#if children}
      {@render children()}
    {/if}
  </Flex>
</div>

<style>
  .sidebar-heading {
    width: 100%;
  }

  .heading-title {
    width: 100%;
    color: var(--ve-color-light);
    text-align: left;
    font-size: 0.95em;
    scroll-margin: 1.8em;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font-family: inherit;
  }

  .heading-title strong {
    display: block;
    color: var(--ve-color);
    font-weight: 500;
    font-size: 1.1em;
  }

  .description {
    display: block;
  }

  .hoverable-actions {
    opacity: 0;
    transition: opacity 0.3s;
    display: flex;
    gap: 0;
  }

  .sidebar-heading:hover .hoverable-actions {
    opacity: 1;
  }
</style>

<script context="module" lang="ts">
  let headingElement: HTMLDivElement
</script>
