import type {
  EditorComponentData,
  EditorComponentDefinitions,
  EditorComponentTemplate
} from '$lib/types'
import { deepSet, indexify } from '$lib/functions/object'
import { insertItem } from '$lib/functions/array'
import { uniqId } from '$lib/functions/string'
import { clamp } from '$lib/functions/number'
import { fillDefaults } from '$lib/functions/fields'
import { t } from '$lib/functions/i18n'
import { InsertPosition } from '$lib/enum'

export enum PreviewModes {
  PHONE = 'phone',
  DESKTOP = 'desktop'
}

// Get sidebar width from localStorage
const getSavedSidebarWidth = (): number => {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('veSidebarWidth')
    return saved ? parseInt(saved, 10) : 33
  }
  return 33
}

class EditorStore {
  // State properties using Svelte 5 runes
  data = $state<EditorComponentData[]>([])
  definitions = $state<EditorComponentDefinitions>({})
  templates = $state<EditorComponentTemplate[]>([])
  previousData = $state<EditorComponentData[]>([])
  hiddenCategories = $state<string[]>([])
  focusIndex = $state<string | null>(null)
  rollbackMessage = $state<string | null>(null)
  previewMode = $state<PreviewModes>(PreviewModes.DESKTOP)
  sidebarWidth = $state<number>(33)
  addBlockIndex = $state<number | null>(null)
  rootElement = $state<HTMLElement | null>(null)
  insertPosition = $state<InsertPosition>(InsertPosition.Start)

  constructor() {
    // Initialize sidebar width from localStorage
    if (typeof window !== 'undefined') {
      this.sidebarWidth = clamp(getSavedSidebarWidth(), 20, 60)
    }
  }

  // Initialize store with data
  initialize(options: {
    data: EditorComponentData[]
    definitions: EditorComponentDefinitions
    templates: EditorComponentTemplate[]
    hiddenCategories: string[]
    rootElement: HTMLElement
    insertPosition: InsertPosition
  }) {
    this.data = options.data
    this.definitions = options.definitions
    this.templates = options.templates
    this.hiddenCategories = options.hiddenCategories
    this.rootElement = options.rootElement
    this.insertPosition = options.insertPosition
  }

  // Actions
  setSidebarWidth(width: number) {
    const clamped = clamp(width, 20, 60)
    this.sidebarWidth = clamped
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('veSidebarWidth', clamped.toString())
    }
  }

  updateData(newData: any, path?: string) {
    if (path) {
      this.data = deepSet(this.data, path, newData) as EditorComponentData[]
    } else {
      this.data = newData
    }
  }

  removeBloc(removedData: EditorComponentData) {
    this.previousData = this.data
    this.data = this.data.filter((d) => d !== removedData)
    this.rollbackMessage = t('deleteItemConfirm')
  }

  rollback() {
    this.data = this.previousData
    this.previousData = []
    this.rollbackMessage = null
  }

  voidRollback() {
    this.rollbackMessage = null
    this.previousData = []
  }

  insertData(name: string, index: number, extraData?: object): EditorComponentData {
    const newData: EditorComponentData = {
      ...extraData,
      _name: name,
      _id: name + uniqId()
    } as EditorComponentData

    this.data = insertItem(this.data, index, newData)
    this.focusIndex = newData._id

    return newData
  }

  setData(newData: Omit<EditorComponentData, '_id'>[]): void {
    this.data = indexify(newData) as EditorComponentData[]
    this.focusIndex = null
  }

  setFocusIndex(id: string | null) {
    this.focusIndex = id
  }

  setAddBlockIndex(index?: number | string | null) {
    if (index === undefined) {
      this.addBlockIndex =
        this.insertPosition === InsertPosition.Start ? 0 : this.data.length
      return
    }
    if (typeof index === 'string') {
      this.addBlockIndex = this.data.findIndex((v) => v._id === index)
      return
    }
    this.addBlockIndex = index
  }

  togglePreviewMode() {
    this.previewMode =
      this.previewMode === PreviewModes.DESKTOP ? PreviewModes.PHONE : PreviewModes.DESKTOP
  }

  // Computed getters using $derived
  get focusedItem() {
    return this.data.find((d) => d._id === this.focusIndex) || null
  }

  get isBlocSelectorVisible() {
    return this.addBlockIndex !== null
  }

  get visibleDefinitions() {
    return Object.entries(this.definitions).filter(
      ([_, def]) => !this.hiddenCategories.includes(def.category || '')
    )
  }

  get categories() {
    const cats = new Set<string>()
    Object.values(this.definitions).forEach((def) => {
      if (def.category && !this.hiddenCategories.includes(def.category)) {
        cats.add(def.category)
      }
    })
    return Array.from(cats)
  }

  // Helper method to add block (combines insertData + setAddBlockIndex)
  addBlock(blocName: string) {
    const index = this.addBlockIndex ?? 0
    const definition = this.definitions[blocName]

    if (!definition) {
      console.error(`Block definition not found: ${blocName}`)
      return
    }

    this.insertData(blocName, index, fillDefaults({}, definition.fields))
    this.setAddBlockIndex(null)
  }
}

// Create singleton instance
export const editorStore = new EditorStore()
