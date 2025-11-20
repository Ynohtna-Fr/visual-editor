import type {
  FieldComponent,
  FieldCondition,
  FieldDefinition,
  FieldGroupComponent
} from '$lib/types'
import { cast } from '$lib/functions/object'
import type { Component } from 'svelte'

type FieldOption = Record<string, any>

/**
 * Helpers to ease the creation of new field type
 */
export function defineField<Options extends FieldOption, Value>(
  args:
    | {
        defaultOptions: Options
        render: Component<any>
      }
    | (() => {
        defaultOptions: Options
        render: Component<any>
      })
) {
  return (name: string, options = {} as Options) => {
    const fieldArgs = typeof args === 'function' ? args() : args
    return {
      ...genericFieldDefinition(fieldArgs, options),
      ...fieldArgs,
      options: { ...fieldArgs.defaultOptions, ...options },
      name,
      group: false as const
    }
  }
}

export function defineFieldGroup<Options extends FieldOption>(args: {
  defaultOptions: Options
  render: Component<any>
}) {
  return (fields: FieldDefinition<any, any>[], options: Options = {} as Options) => {
    return {
      ...genericFieldDefinition(args, options),
      group: true as const,
      fields: fields,
      render: args.component
    }
  }
}

export function defaultFieldProperties() {
  return {
    conditions: [] as FieldCondition[],
    shouldRender(data: Record<string, any>) {
      return this.conditions.filter((condition) => !condition(data)).length === 0
    },
    when(fieldName: string, expectedValue: unknown = true) {
      return {
        ...this,
        conditions: [
          ...this.conditions,
          (data: Record<string, any>) => {
            if (typeof expectedValue === 'function') {
              return expectedValue(data[fieldName])
            }
            return cast(data[fieldName], expectedValue) === expectedValue
          }
        ]
      } as any
    }
  }
}

function genericFieldDefinition<Options extends FieldOption>(
  args: { defaultOptions?: Options },
  options: Options
) {
  return {
    options: { ...args.defaultOptions, ...options },
    ...defaultFieldProperties()
  }
}
