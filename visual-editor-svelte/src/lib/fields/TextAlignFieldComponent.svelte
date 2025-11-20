<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte'
  import AlignmentButtons from './shared/AlignmentButtons.svelte'
  import AlignmentButton from './shared/AlignmentButton.svelte'

  type FieldValue = 'left' | 'center' | 'right'

  interface Options {
    label?: string
    default?: FieldValue
  }

  interface Props {
    value: string
    onchange: (value: string) => void
    options: Options
  }

  let { value = $bindable('left'), onchange, options }: Props = $props()

  const alignments: FieldValue[] = ['left', 'center', 'right']
  let id = `textalign-${Math.random().toString(36).substr(2, 9)}`
</script>

<Field label={options.label}>
  <AlignmentButtons>
    {#each alignments as alignment}
      <AlignmentButton
        value={alignment}
        checked={value === alignment}
        {onchange}
        name={id}
      >
        {#snippet icon()}
          {#if alignment === 'left'}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 3h12M2 7h8M2 11h10"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          {:else if alignment === 'center'}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 3h12M4 7h8M3 11h10"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          {:else}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 3h12M6 7h8M4 11h10"
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
