import { defineField } from './utils'
import RangeFieldComponent from './RangeFieldComponent.svelte'

type FieldArgs = {
  label?: string
  help?: string
  default?: number
  min?: number
  max?: number
  step?: number
}

export const Range = defineField<FieldArgs, number>({
  defaultOptions: {
    default: 0,
    min: 0,
    max: 100,
    step: 1
  },
  render: RangeFieldComponent
})
