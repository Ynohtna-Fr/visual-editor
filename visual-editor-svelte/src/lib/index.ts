// Main API
export { editorStore, PreviewModes } from './stores/editor.svelte'

// UI Components
export * from './components/ui'
export { default as BaseStyles } from './components/BaseStyles.svelte'

// Fields
export * from './fields'

// Types
export type {
  EditorComponentData,
  EditorComponentDefinition,
  EditorComponentDefinitions,
  EditorComponentTemplate,
  FieldDefinition,
  FieldComponent,
  Translation,
  TranslationKey
} from './types'

// Enums
export { InsertPosition } from './enum'

// i18n
export { Translations as EN } from './langs/en'
export { Translations as FR } from './langs/fr'
export { t, setTranslations } from './functions/i18n'

// Utilities
export * from './functions/object'
export * from './functions/string'
export * from './functions/array'
export * from './functions/fields'
export * from './functions/number'
export * from './functions/css'

/**
 * Visual Editor API
 * Main class for initializing and configuring the visual editor
 */
export class VisualEditorAPI {
  constructor(options: { lang?: any; postMessagePreview?: boolean } = {}) {
    if (options.lang) {
      setTranslations(options.lang)
    }
    // postMessagePreview support will be added later
  }

  /**
   * Register a new component type
   */
  registerComponent(name: string, definition: import('./types').EditorComponentDefinition) {
    editorStore.definitions = {
      ...editorStore.definitions,
      [name]: { label: 'title', ...definition }
    }
  }

  /**
   * Register a template
   */
  registerTemplate(template: import('./types').EditorComponentTemplate) {
    editorStore.templates = [...editorStore.templates, template]
  }

  /**
   * Define the custom element
   * Note: With Svelte 5, the custom element is defined in the component itself
   * This method is kept for API compatibility
   */
  defineElement(elementName: string = 'visual-editor') {
    console.log(`Custom element <${elementName}> will be defined by Svelte compiler`)
    // The actual custom element definition happens in VisualEditor.svelte
    // with <svelte:options customElement="visual-editor" />
  }
}
