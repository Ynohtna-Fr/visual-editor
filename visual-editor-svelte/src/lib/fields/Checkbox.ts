import { defineField } from './utils'
import CheckboxFieldComponent from './CheckboxFieldComponent.svelte'

type FieldArgs = {
  label: string
  help?: string
  default?: boolean
}

export const Checkbox = defineField<FieldArgs, boolean>({
  defaultOptions: {
    label: '',
    default: false
  },
  component: CheckboxFieldComponent
})
