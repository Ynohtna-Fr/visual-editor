import { defineField } from './utils'
import RepeaterFieldComponent from './RepeaterFieldComponent.svelte'
import type { FieldDefinition } from '$lib/types'
import { t } from '$lib/functions/i18n'

type RepeaterLine = { _id: string; [key: string]: unknown }

type FieldArgs = {
  label?: string
  min?: number
  max?: number
  addLabel?: string
  fields: FieldDefinition<any, any>[]
  collapsed?: string
  default?: RepeaterLine[]
}

export const Repeater = defineField<FieldArgs, RepeaterLine[]>({
  defaultOptions: {
    addLabel: t('addItem'),
    fields: [],
    default: []
  },
  component: RepeaterFieldComponent
})
