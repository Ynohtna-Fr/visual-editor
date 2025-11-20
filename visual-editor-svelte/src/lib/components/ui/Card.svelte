<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children: Snippet
    hoverable?: boolean
  }

  let { children, hoverable = false, ...rest }: Props = $props()
</script>

<div class="ve-card" class:hoverable {...rest}>
  {@render children()}
</div>

<style>
  .ve-card {
    padding: 0.8em 0.6em 0.8em 1.4em;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s !important;
  }

  .ve-card.hoverable:hover {
    box-shadow: var(--ve-shadow-dragging);
    z-index: 10;
  }
</style>
