<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLLabelAttributes } from 'svelte/elements'

  interface Props extends HTMLLabelAttributes {
    children: Snippet
  }

  let { children, ...rest }: Props = $props()
</script>

<label class="ve-label" {...rest}>
  {@render children()}
</label>

<style>
  .ve-label {
    display: block;
    margin-bottom: 0.5em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
