import type { FieldDefinition } from '$lib/types'
import { defaultFieldProperties } from './utils'

// Note: Tabs is a special field group that creates tabbed sections
// Each tab contains its own set of fields

export type TabDefinition = {
  label: string
  fields: Array<FieldDefinition<any, any>>
}

type FieldOptions = {
  tabs: TabDefinition[]
}

export function Tabs(...tabs: TabDefinition[]) {
  return {
    ...defaultFieldProperties(),
    group: true as const,
    options: { tabs: tabs },
    // Tabs field group will be handled specially by FieldsRenderer
    // because it needs to render different fields per tab
    component: null as any, // Will be handled by FieldsRenderer
    fields: tabs.reduce(
      (acc, tab) => [...acc, ...tab.fields],
      [] as TabDefinition['fields']
    ) as FieldDefinition<any, any>[]
  }
}
