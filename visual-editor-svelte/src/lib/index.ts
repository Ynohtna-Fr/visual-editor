// Main Visual Editor Component
export { default as VisualEditor } from './VisualEditor.svelte'

// Main API
export { editorStore, PreviewModes } from './stores/editor.svelte'
import { editorStore as store } from './stores/editor.svelte'
import { setTranslations as setLang } from './functions/i18n'

// UI Components
export * from './components/ui'
export { default as BaseStyles } from './components/BaseStyles.svelte'
export { default as Layout } from './components/Layout.svelte'
export { default as FieldsRenderer } from './components/FieldsRenderer.svelte'

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
 *
 * @example
 * ```typescript
 * import { VisualEditorAPI, Text, HTMLText } from '@boxraiser/visual-editor-svelte'
 *
 * const editor = new VisualEditorAPI({ lang: FR })
 *
 * editor.registerComponent('hero', {
 *   title: 'Hero Section',
 *   category: 'Content',
 *   fields: [
 *     Text({ name: 'title', label: 'Title' }),
 *     HTMLText({ name: 'content', label: 'Content' })
 *   ]
 * })
 *
 * editor.defineElement() // Defines <visual-editor> custom element
 * ```
 */
export class VisualEditorAPI {
  static postMessagePreview: boolean = false

  constructor(options: { lang?: any; postMessagePreview?: boolean } = {}) {
    console.log('[VisualEditorAPI] Constructor called with options:', options)
    if (options.lang) {
      setLang(options.lang)
    }
    if (options.postMessagePreview !== undefined) {
      VisualEditorAPI.postMessagePreview = options.postMessagePreview
      console.log('[VisualEditorAPI] postMessagePreview set to:', VisualEditorAPI.postMessagePreview)
    }
    console.log('[VisualEditorAPI] Final postMessagePreview value:', VisualEditorAPI.postMessagePreview)
  }

  /**
   * Register a new component type
   * @param name - Unique component identifier
   * @param definition - Component configuration including title, category, and fields
   *
   * @example
   * ```typescript
   * editor.registerComponent('button', {
   *   title: 'Button',
   *   category: 'Actions',
   *   fields: [
   *     Text({ name: 'text', label: 'Button Text' }),
   *     Select({
   *       name: 'variant',
   *       label: 'Style',
   *       options: ['primary', 'secondary', 'outline']
   *     })
   *   ]
   * })
   * ```
   */
  registerComponent(name: string, definition: import('./types').EditorComponentDefinition) {
    store.definitions = {
      ...store.definitions,
      [name]: { label: 'title', ...definition }
    }
  }

  /**
   * Register a pre-configured template
   * @param template - Template configuration with name, category, and data
   *
   * @example
   * ```typescript
   * editor.registerTemplate({
   *   name: 'Landing Page',
   *   category: 'Pages',
   *   data: [
   *     { _name: 'hero', title: 'Welcome', content: '...' },
   *     { _name: 'features', items: [...] }
   *   ]
   * })
   * ```
   */
  registerTemplate(template: import('./types').EditorComponentTemplate) {
    store.templates = [...store.templates, template]
  }

  /**
   * Define the custom element
   * In Svelte 5, the custom element is automatically defined by the compiler
   * This method is kept for API compatibility with the React version
   *
   * @param elementName - Name of the custom element (default: 'visual-editor')
   *
   * @example
   * ```typescript
   * const editor = new VisualEditorAPI()
   * editor.defineElement() // <visual-editor> is now available
   * ```
   *
   * Then in HTML:
   * ```html
   * <visual-editor
   *   value='[]'
   *   preview="/api/preview"
   *   iconsurl="/icons/[name].svg"
   * ></visual-editor>
   * ```
   */
  defineElement(elementName: string = 'visual-editor') {
    if (elementName !== 'visual-editor') {
      console.warn(
        `Custom element name "${elementName}" specified, but Svelte 5 defines it as "visual-editor". ` +
        `The component will be available as <visual-editor>.`
      )
    }
    // The actual custom element definition happens in VisualEditor.svelte
    // with <svelte:options customElement="visual-editor" />
    console.log('Custom element <visual-editor> is ready')
  }
}

// Export a default instance for convenience
export const visualEditor = new VisualEditorAPI()
