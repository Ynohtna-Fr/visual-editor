<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import Tooltip from './Tooltip.svelte'

  interface Props extends HTMLButtonAttributes {
    children?: Snippet
    danger?: boolean
    success?: boolean
    rotate?: number
    title?: string
  }

  let {
    children,
    danger = false,
    success = false,
    rotate,
    title,
    ...rest
  }: Props = $props()

  let style = $derived(rotate ? `transform: rotate(${rotate}deg)` : '')
</script>

{#if title}
  <Tooltip content={title} trigger="focus">
    <button
      class="ve-button-icon"
      class:danger
      class:success
      {style}
      aria-label={title}
      {...rest}
    >
      {#if children}
        {@render children()}
      {/if}
    </button>
  </Tooltip>
{:else}
  <button
    class="ve-button-icon"
    class:danger
    class:success
    {style}
    aria-label={title}
    {...rest}
  >
    {#if children}
      {@render children()}
    {/if}
  </button>
{/if}

<style>
  .ve-button-icon {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    transition:
      background-color 0.3s,
      transform 0.3s;
    border: none;
    outline: none;
    cursor: pointer;
    color: var(--ve-color-light);
    background: var(--ve-background);
  }

  .ve-button-icon:hover,
  .ve-button-icon:focus {
    background-color: var(--ve-hover);
    color: var(--ve-color);
  }

  .ve-button-icon.danger {
    color: var(--ve-danger);
  }

  .ve-button-icon.danger:hover,
  .ve-button-icon.danger:focus {
    color: var(--ve-danger);
    background-color: var(--ve-danger-light);
  }

  .ve-button-icon.success {
    color: #059669;
  }

  .ve-button-icon.success:hover,
  .ve-button-icon.success:focus {
    color: #059669;
    background-color: rgba(110, 231, 183, 0.2);
  }
</style>
