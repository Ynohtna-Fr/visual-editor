<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children: Snippet
    between?: boolean
    column?: boolean
    gap?: number
  }

  let { children, between = false, column = false, gap = 1, ...rest }: Props = $props()

  let gapStyle = $derived(`gap: ${gap}em; grid-gap: ${gap}em;`)
</script>

<div class="ve-flex" class:between class:column style={gapStyle} {...rest}>
  {@render children()}
</div>

<style>
  .ve-flex {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .ve-flex.between {
    justify-content: space-between;
  }

  .ve-flex.column {
    display: grid;
    align-content: flex-start;
    grid-template-columns: 1fr;
    align-items: flex-start;
  }
</style>
