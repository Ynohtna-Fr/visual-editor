import HTMLTextFieldComponent from './HTMLTextFieldComponent.svelte'
import { defaultFieldProperties } from './utils'
import { colorToProperty } from '$lib/functions/css'
import type { FieldDefinition } from '$lib/types'

type FieldArgs = {
  label?: string
  multiline?: boolean
  help?: string
  allowHeadings?: boolean
  colors?: string[]
  default?: string
  backgroundColor?: string
  textColor?: string
  defaultAlign?: string
}

export function HTMLText(name: string, options: FieldArgs = {}): FieldDefinition<FieldArgs, string> {
  return {
    name: name,
    options: {
      multiline: true,
      allowHeadings: false,
      default: '',
      ...options
    },
    extraProps: (data: Record<string, unknown>) => ({
      backgroundColor: colorToProperty(
        options.backgroundColor && (data[options.backgroundColor] as string)
      ),
      textColor: colorToProperty(options.textColor && (data[options.textColor] as string)),
      defaultAlign: options.defaultAlign ? (data[options.defaultAlign] as 'left' | 'right' | 'center' | 'justify') : undefined
    }),
    render: HTMLTextFieldComponent,
    group: false as const,
    ...defaultFieldProperties()
  }
}
