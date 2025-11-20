<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte'
  import AlignmentButtons from './shared/AlignmentButtons.svelte'
  import AlignmentButton from './shared/AlignmentButton.svelte'

  type FieldValue = 'top' | 'right' | 'bottom' | 'left'

  interface Options {
    label?: string
    vertical?: boolean
    default?: FieldValue
  }

  interface Props {
    value: FieldValue
    onchange: (value: FieldValue) => void
    options: Options
  }

  let { value = $bindable('left'), onchange, options }: Props = $props()

  let alignments = $derived(() => {
    const base: FieldValue[] = ['left', 'right']
    if (options.vertical) {
      base.push('top', 'bottom')
    }
    return base
  })
</script>

<Field label={options.label}>
  <AlignmentButtons>
    {#each alignments() as alignment}
      <AlignmentButton value={alignment} checked={value === alignment} {onchange}>
        {#snippet icon()}
          {#if alignment === 'left'}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 2v12M6 5h7M6 8h5M6 11h6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          {:else if alignment === 'right'}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13 2v12M3 5h7M6 8h5M4 11h6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          {:else if alignment === 'top'}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 3h12M5 6v7M8 6v5M11 6v6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          {:else}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 13h12M5 3v7M8 5v5M11 4v6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          {/if}
        {/snippet}
      </AlignmentButton>
    {/each}
  </AlignmentButtons>
</Field>
