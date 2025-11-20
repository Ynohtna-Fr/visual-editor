<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    children: Snippet
  }

  let { children }: Props = $props()
</script>

<div class="bloc-grid">
  {@render children()}
</div>

<style>
  .bloc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, 218px);
    gap: 2rem;
    overflow: auto;
    max-height: calc(100vh - 300px);
    margin-top: 2rem;
    align-content: flex-start;
    height: 700px;
  }

  .bloc-grid::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  .bloc-grid::-webkit-scrollbar-track {
    background: var(--ve-hover);
    padding: 1px;
  }

  .bloc-grid::-webkit-scrollbar-thumb {
    background: var(--ve-field-border);
    border-radius: 4px;
  }
</style>
