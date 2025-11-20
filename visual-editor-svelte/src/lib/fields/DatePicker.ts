import { defineField } from './utils'
import DatePickerFieldComponent from './DatePickerFieldComponent.svelte'

type FieldArgs = {
  label?: string
  help?: string
  default?: string
  time?: boolean
}

export const DatePicker = defineField<FieldArgs, number>({
  defaultOptions: {
    default: '',
    time: false
  },
  render: DatePickerFieldComponent
})
