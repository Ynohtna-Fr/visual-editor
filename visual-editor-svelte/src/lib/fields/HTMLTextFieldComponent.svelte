<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte'
  import TiptapEditor from '$lib/components/TiptapEditor.svelte'
  import { colorToProperty } from '$lib/functions/css'

  interface Options {
    label?: string
    multiline?: boolean
    help?: string
    allowHeadings?: boolean
    colors?: string[]
    default?: string
    backgroundColor?: string
    textColor?: string
    defaultAlign?: string
  }

  interface Props {
    value: string
    onchange: (value: string) => void
    options: Options
    backgroundColor?: string
    textColor?: string
    defaultAlign?: 'left' | 'right' | 'center' | 'justify'
  }

  let {
    value = $bindable(''),
    onchange,
    options,
    backgroundColor,
    textColor,
    defaultAlign = 'left'
  }: Props = $props()
</script>

<Field label={options.label} help={options.help}>
  <TiptapEditor
    {value}
    {onchange}
    backgroundColor={colorToProperty(backgroundColor)}
    color={colorToProperty(textColor)}
    colors={options.colors || []}
    multiline={options.multiline ?? true}
    {defaultAlign}
  />
</Field>
