import { defineField } from './utils'
import TextAlignFieldComponent from './TextAlignFieldComponent.svelte'

type FieldValue = 'left' | 'center' | 'right'

type FieldArgs = {
  label?: string
  default?: FieldValue
}

export const TextAlign = defineField<FieldArgs, string>({
  defaultOptions: {
    default: 'left'
  },
  render: TextAlignFieldComponent
})
