<script lang="ts">
  import type { Snippet } from 'svelte'
  import Field from '$lib/components/ui/Field.svelte'

  interface Options {
    label?: string
    columns?: string
  }

  interface Props {
    options: Options
    children: Snippet
  }

  let { options, children }: Props = $props()
</script>

<Field label={options.label}>
  <div class="ve-row" style:grid-template-columns={options.columns || 'auto'}>
    {@render children()}
  </div>
</Field>

<style>
  .ve-row {
    display: flex;
    gap: var(--ve-gap);
  }

  .ve-row :global(> *) {
    width: 100%;
  }

  .ve-row[style*='grid-template-columns'] {
    display: grid;
  }
</style>
