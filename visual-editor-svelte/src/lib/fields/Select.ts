import { defineField } from './utils'
import SelectFieldComponent from './SelectFieldComponent.svelte'

type Option = {
  value: string
  label: string
}

type FieldArgs = {
  label?: string
  options: Option[]
  help?: string
  default?: string
}

export const Select = defineField<FieldArgs, string>({
  defaultOptions: {
    default: '',
    options: []
  },
  render: SelectFieldComponent
})
