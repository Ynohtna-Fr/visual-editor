<svelte:options customElement="visual-editor" />

<script lang="ts">
  import { onMount, tick } from 'svelte'
  import { editorStore } from './stores/editor.svelte'
  import Layout from './components/Layout.svelte'
  import BaseStyles from './components/BaseStyles.svelte'
  import { indexify, stringifyFields } from './functions/object'
  import { fillDefaults } from './functions/fields'
  import { InsertPosition } from './enum'
  import type { EditorComponentData } from './types'

  // Custom element attributes (all lowercase for HTML)
  interface Props {
    value?: string
    preview?: string
    iconsurl?: string
    name?: string
    hidden?: boolean
    insertposition?: string
    hiddencategories?: string
    postmessagepreview?: string
  }

  let {
    value = '[]',
    preview = '',
    iconsurl = '/',
    name = '',
    hidden = false,
    insertposition = 'start',
    hiddencategories = '',
    postmessagepreview = 'false'
  }: Props = $props()

  // Internal state
  let visible = $state(!hidden)
  let mounted = $state(false)
  let skipNextChange = $state(true)

  // Parse postmessagepreview attribute (string to boolean)
  let usePostMessagePreview = $derived(postmessagepreview === 'true')

  // Parse and initialize data
  function parseValue(jsonString: string): EditorComponentData[] {
    try {
      const json = JSON.parse(jsonString)
      return indexify(json).map((item: EditorComponentData) => {
        const definition = editorStore.definitions[item._name]
        if (!definition) return item
        return fillDefaults(item, definition.fields ?? [])
      })
    } catch (e) {
      console.error('Failed to parse visual editor data:', jsonString, e)
      return []
    }
  }

  // Cleaned data without internal IDs for export
  let cleanedData = $derived.by(() => {
    return JSON.stringify(stringifyFields(editorStore.data))
  })

  // Initialize store with value prop
  $effect(() => {
    if (!mounted) return

    // Only update if value actually changed
    if (value !== cleanedData) {
      skipNextChange = true
      const parsedData = parseValue(value)
      editorStore.data = parsedData
    }
  })

  // Emit change event when data changes
  $effect(() => {
    if (!mounted) return

    const json = cleanedData

    if (skipNextChange) {
      skipNextChange = false
      return
    }

    // Dispatch change event
    const event = new CustomEvent('change', {
      detail: json,
      bubbles: true,
      composed: true
    })
    dispatchEvent(event)
  })

  // Update visibility when hidden prop changes
  $effect(() => {
    visible = !hidden
  })

  // Initialize on mount
  onMount(() => {
    // Parse hidden categories
    const categories = hiddencategories
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
    editorStore.hiddenCategories = categories

    // Set insert position
    editorStore.insertPosition =
      insertposition === 'end' ? InsertPosition.End : InsertPosition.Start

    // Parse initial data
    const initialData = parseValue(value)
    editorStore.data = initialData

    // Mark as mounted
    mounted = true
    skipNextChange = true
  })

  // Handle close event
  function handleClose() {
    const event = new Event('close', {
      bubbles: true,
      composed: true
    })
    dispatchEvent(event)
  }
</script>

{#if visible}
  <div class="visual-editor-wrapper">
    <BaseStyles>
      <Layout
        data={editorStore.data}
        previewUrl={preview}
        iconsUrl={iconsurl}
        usePostMessagePreview={usePostMessagePreview}
        onclose={handleClose}
      />
    </BaseStyles>
  </div>
{/if}

<!-- Hidden textarea for form submission -->
<textarea {name} value={cleanedData} hidden readonly></textarea>

<style>
  .visual-editor-wrapper {
    /* Ensure the wrapper doesn't interfere with layout */
    display: contents;
  }

  textarea {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
