<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'

  interface Props extends HTMLInputAttributes {
    value?: string | number
  }

  let { value = $bindable(''), ...rest }: Props = $props()
</script>

<input class="ve-input" bind:value {...rest} />

<style>
  .ve-input {
    color: var(--ve-color);
    background: transparent;
    padding: 0.5rem 0.75em;
    line-height: 1.25rem;
    border-radius: 0.2rem;
    display: block;
    width: 100%;
    border: 1px solid var(--ve-field-border);
    box-shadow: var(--ve-field-shadow);
  }

  .ve-input:focus {
    border-color: var(--ve-primary);
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgb(23 113 230 / 25%);
  }
</style>
