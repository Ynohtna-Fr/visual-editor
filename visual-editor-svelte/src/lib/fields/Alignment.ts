import { defineField } from './utils'
import AlignmentFieldComponent from './AlignmentFieldComponent.svelte'

type FieldValue = 'top' | 'right' | 'bottom' | 'left'

type FieldArgs = {
  label?: string
  vertical?: boolean
  default?: FieldValue
}

export const Alignment = defineField<FieldArgs, FieldValue>({
  defaultOptions: {
    default: 'left'
  },
  render: AlignmentFieldComponent
})
