<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte'

  interface Options {
    label?: string
    multiline?: boolean
    help?: string
    default?: string
  }

  interface Props {
    value: string
    onchange: (value: string) => void
    options: Options
  }

  let { value = $bindable(''), onchange, options }: Props = $props()

  let localValue = $state(value)
  let id = `textinput-${Math.random().toString(36).substr(2, 9)}`

  // Sync local value with prop value
  $effect(() => {
    localValue = value
  })

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    localValue = target.value
    onchange(target.value)
  }
</script>

<Field
  label={options.label}
  type={options.multiline ? 'textarea' : 'text'}
  {id}
  bind:value={localValue}
  oninput={handleInput}
  help={options.help}
/>
