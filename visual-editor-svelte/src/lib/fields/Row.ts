import { defineFieldGroup } from './utils'
import RowFieldComponent from './RowFieldComponent.svelte'

type RowArgs = {
  label?: string
  columns?: string
}

export const Row = defineFieldGroup<RowArgs>({
  defaultOptions: {},
  component: RowFieldComponent
})
