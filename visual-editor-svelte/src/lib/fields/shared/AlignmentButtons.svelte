<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    children: Snippet
  }

  let { children }: Props = $props()
</script>

<div class="ve-alignment-buttons">
  {@render children()}
</div>

<style>
  .ve-alignment-buttons {
    display: inline-flex;
    border: 1px solid var(--ve-field-border);
    box-shadow: var(--ve-field-shadow);
    border-radius: 0.2em;
  }
</style>
