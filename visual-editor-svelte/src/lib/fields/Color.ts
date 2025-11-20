import { defineField } from './utils'
import ColorFieldComponent from './ColorFieldComponent.svelte'

type FieldArgs = {
  label?: string
  default?: string
  colors: string[]
}

export const Color = defineField<FieldArgs, string | null>({
  defaultOptions: {
    default: '',
    colors: [] as string[]
  },
  component: ColorFieldComponent
})
