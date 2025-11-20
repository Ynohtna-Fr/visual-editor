<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  interface Props extends HTMLButtonAttributes {
    children: Snippet
  }

  let { children, ...rest }: Props = $props()
</script>

<button class="ve-unstyled-button" {...rest}>
  {@render children()}
</button>

<style>
  .ve-unstyled-button {
    background-color: transparent;
    border: none;
    padding: 0;
    margin: 0;
    color: inherit;
    cursor: pointer;
  }
</style>
