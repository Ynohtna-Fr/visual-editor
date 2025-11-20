import type { TranslationKey, Translation } from '$lib/types'
import { Translations as EN } from '$lib/langs/en'

// Global translation object - will be set by VisualEditorAPI
let currentTranslations: Translation = EN

export function setTranslations(translations: Translation) {
  currentTranslations = translations
}

export function t(key: TranslationKey, values?: Record<string, string | number>): string {
  let text: string = currentTranslations[key] || String(key)

  if (values) {
    Object.entries(values).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v))
    })
  }

  return text
}
