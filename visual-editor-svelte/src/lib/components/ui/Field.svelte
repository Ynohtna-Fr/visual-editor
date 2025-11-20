<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'
  import Label from './Label.svelte'
  import Input from './Input.svelte'
  import Tooltip from './Tooltip.svelte'

  interface Option {
    value: string
    label: string
  }

  interface Props extends HTMLInputAttributes {
    label?: string
    help?: string
    options?: Option[]
    tooltip?: string | Snippet
    icon?: Snippet
    children?: Snippet
  }

  let {
    children,
    label,
    help,
    type = 'text',
    options,
    tooltip,
    icon,
    value = $bindable(''),
    ...rest
  }: Props = $props()

  // Generate field content
  let fieldContent = $derived.by(() => {
    if (children) {
      return 'custom'
    }
    if (options) {
      return 'select'
    }
    if (type === 'textarea') {
      return 'textarea'
    }
    if (['text', 'number'].includes(type || '')) {
      return 'input'
    }
    return 'unknown'
  })
</script>

<div class="ve-field">
  {#if label}
    <Label for={rest.id}>{label}</Label>
  {/if}

  <div class="ve-field-wrapper">
    {#if tooltip}
      <Tooltip content={tooltip}>
        {#if fieldContent === 'custom' && children}
          {@render children()}
        {:else if fieldContent === 'select' && options}
          <select class="ve-input" bind:value {...rest}>
            {#each options as option (option.value)}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        {:else if fieldContent === 'textarea'}
          <textarea class="ve-input" bind:value {...rest}></textarea>
        {:else if fieldContent === 'input'}
          <Input bind:value {type} {...rest} />
        {/if}
      </Tooltip>
    {:else}
      {#if fieldContent === 'custom' && children}
        {@render children()}
      {:else if fieldContent === 'select' && options}
        <select class="ve-input" bind:value {...rest}>
          {#each options as option (option.value)}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      {:else if fieldContent === 'textarea'}
        <textarea class="ve-input" bind:value {...rest}></textarea>
      {:else if fieldContent === 'input'}
        <Input bind:value {type} {...rest} />
      {/if}
    {/if}

    {#if icon}
      <div class="ve-field-icon">
        {@render icon()}
      </div>
    {/if}
  </div>

  {#if help}
    <div class="ve-field-help">{help}</div>
  {/if}
</div>

<style>
  .ve-field {
    margin-bottom: 1em;
  }

  .ve-field-wrapper {
    position: relative;
  }

  .ve-field-help {
    font-style: italic;
    margin-top: 0.5em;
    font-size: 0.8em;
    color: var(--ve-color-light);
  }

  .ve-field-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 0;
    color: var(--ve-field-border);
    cursor: pointer;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
  }

  .ve-field :global(select.ve-input),
  .ve-field :global(textarea.ve-input) {
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

  .ve-field :global(select.ve-input:focus),
  .ve-field :global(textarea.ve-input:focus) {
    border-color: var(--ve-primary);
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgb(23 113 230 / 25%);
  }

  .ve-field :global(textarea.ve-input) {
    min-height: 100px;
    resize: vertical;
  }
</style>
