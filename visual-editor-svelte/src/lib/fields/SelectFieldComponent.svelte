<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte'

  interface Option {
    value: string
    label: string
  }

  interface Options {
    label?: string
    options: Option[]
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
  let id = `selectinput-${Math.random().toString(36).substr(2, 9)}`

  $effect(() => {
    localValue = value
  })

  function handleInput(e: Event) {
    const target = e.target as HTMLSelectElement
    localValue = target.value
    onchange(target.value)
  }
</script>

<Field
  {id}
  label={options.label}
  help={options.help}
  options={options.options}
  bind:value={localValue}
  oninput={handleInput}
/>
