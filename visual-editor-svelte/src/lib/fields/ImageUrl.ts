import { defineField } from './utils'
import ImageUrlFieldComponent from './ImageUrlFieldComponent.svelte'

type FieldArgs = {
  label?: string
  help?: string
  default?: string
  onBrowse?: (url?: string) => Promise<string>
}

export const ImageUrl = defineField<FieldArgs, string>({
  defaultOptions: {
    default: ''
  },
  component: ImageUrlFieldComponent
})
