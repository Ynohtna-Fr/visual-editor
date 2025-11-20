import { defineField } from './utils'
import NumberFieldComponent from './NumberFieldComponent.svelte'

type FieldArgs = {
  label?: string
  help?: string
  default?: string
  min?: number
  max?: number
  step?: number
}

export const Number = defineField<FieldArgs, string>({
  defaultOptions: {
    default: ''
  },
  render: NumberFieldComponent
})
