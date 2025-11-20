import { defineField } from './utils'
import TextFieldComponent from './TextFieldComponent.svelte'

type FieldArgs = {
  label?: string
  multiline?: boolean
  help?: string
  default?: string
}

export const Text = defineField<FieldArgs, string>({
  defaultOptions: {
    default: ''
  },
  render: TextFieldComponent
})
