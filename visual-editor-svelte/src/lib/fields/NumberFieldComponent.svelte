<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte'

  interface Options {
    label?: string
    help?: string
    default?: string
    min?: number
    max?: number
    step?: number
  }

  interface Props {
    value: string
    onchange: (value: string) => void
    options: Options
  }

  let { value = $bindable(''), onchange, options }: Props = $props()

  let localValue = $state(value)
  let id = `numberinput-${Math.random().toString(36).substr(2, 9)}`

  $effect(() => {
    localValue = value
  })

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement
    localValue = target.value
    onchange(target.value)
  }
</script>

<Field
  label={options.label}
  type="number"
  {id}
  bind:value={localValue}
  oninput={handleInput}
  help={options.help}
  min={options.min}
  max={options.max}
  step={options.step}
/>
