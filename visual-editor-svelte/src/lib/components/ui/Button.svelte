<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  interface Props extends HTMLButtonAttributes {
    children?: Snippet
    secondary?: boolean
    outline?: boolean
    size?: 'small' | 'default'
    icon?: Snippet
  }

  let {
    children,
    secondary = false,
    outline = false,
    size = 'default',
    icon,
    ...rest
  }: Props = $props()
</script>

<button
  class="ve-button"
  class:secondary
  class:outline
  class:small={size === 'small'}
  {...rest}
>
  {#if icon}
    {@render icon()}
  {/if}
  {#if children}
    {@render children()}
  {/if}
</button>

<style>
  .ve-button {
    outline: none;
    display: flex;
    align-items: center;
    gap: 0.5em;
    font-weight: 700;
    background-color: var(--ve-primary);
    border: none;
    color: #fff;
    align-self: flex-end;
    font-size: 0.9rem;
    height: 48px;
    padding: 0 1em;
    line-height: 1.25rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  .ve-button:hover,
  .ve-button:focus {
    background-color: var(--ve-primary-hover);
  }

  .ve-button.secondary {
    background-color: transparent;
    color: var(--ve-primary);
  }

  .ve-button.secondary:hover,
  .ve-button.secondary:focus {
    background-color: var(--ve-primary-light);
  }

  .ve-button.small {
    height: 40px;
  }

  .ve-button.outline {
    border: solid 1px var(--ve-primary);
    background: transparent;
    color: var(--ve-primary);
  }

  .ve-button.outline:hover,
  .ve-button.outline:focus {
    background-color: var(--ve-primary);
    color: #fff;
  }
</style>
