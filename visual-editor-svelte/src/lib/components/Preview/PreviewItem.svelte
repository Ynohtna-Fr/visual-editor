<script lang="ts">
  import type { EditorComponentData } from '$lib/types'
  import { editorStore } from '$lib/stores/editor.svelte'
  import { VisualEditorAPI } from '$lib/index'
  import Spinner from '$lib/components/ui/Spinner.svelte'
  import { tick } from 'svelte'

  interface Props {
    data: EditorComponentData
    initialHTML: string
    previewUrl: string
    title: string
    iframeWindow?: Window | null
  }

  let { data, initialHTML, previewUrl, title, iframeWindow = null }: Props = $props()

  let element: HTMLDivElement
  let html = $state(initialHTML)
  let loading = $state(false)
  let isFirstRender = $state(!!initialHTML)
  let fetchTimeout: number | undefined
  let loadingTimeout: number | undefined

  let isFocused = $derived(editorStore.focusIndex === data._id)

  // Check if using client-side postMessage preview
  let usePostMessage = $derived(VisualEditorAPI.postMessagePreview)

  // Debounced preview update (fetch or postMessage)
  let dataStr = $derived(JSON.stringify(data))
  $effect(() => {
    // Read the derived value to track changes
    dataStr

    if (isFirstRender) {
      isFirstRender = false
      return
    }

    // Clear existing timeouts
    if (fetchTimeout) clearTimeout(fetchTimeout)
    if (loadingTimeout) clearTimeout(loadingTimeout)

    // Show loading spinner after 200ms (only for server-side)
    if (!usePostMessage) {
      loadingTimeout = window.setTimeout(() => {
        loading = true
      }, 200)
    }

    // Update after 500ms debounce
    fetchTimeout = window.setTimeout(async () => {
      try {
        if (usePostMessage && iframeWindow) {
          // Client-side: Send postMessage to iframe
          iframeWindow.postMessage(
            {
              type: 'visual-editor-update',
              componentId: data._id,
              data: { ...data, preview: true }
            },
            '*'
          )
        } else {
          // Server-side: Fetch HTML from server
          const response = await fetch(previewUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({ ...data, preview: true })
          })
          html = await response.text()
        }
      } catch (error) {
        console.error('Preview update failed:', error)
      } finally {
        if (loadingTimeout) clearTimeout(loadingTimeout)
        loading = false
      }
    }, 500)

    return () => {
      if (fetchTimeout) clearTimeout(fetchTimeout)
      if (loadingTimeout) clearTimeout(loadingTimeout)
    }
  })

  // Scroll into view when focused
  $effect(() => {
    if (isFocused && element) {
      tick().then(() => {
        const root = element.closest('html')
        if (root && element) {
          const top = element.offsetTop - 40
          root.scrollTop = top
        }
      })
    }
  })

  function handleClick() {
    editorStore.setFocusIndex(data._id)
  }
</script>

<div
  bind:this={element}
  class="preview-item"
  class:focused={isFocused}
  id="previewItem{data._id}"
  onclick={handleClick}
  role="button"
  tabindex="0"
>
  {#if loading}
    <Spinner style="top: 1rem; right: 1rem; left: auto; bottom: auto; color: var(--ve-primary);" />
  {/if}
  <div class="preview-item-title" class:focused={isFocused}>
    {title}
  </div>
  {@html html}
</div>

<style>
  .preview-item {
    position: relative;
    cursor: pointer;
  }

  .preview-item::before {
    content: '';
    position: absolute;
    inset: 0;
    border-style: solid;
    border-color: transparent;
    border-width: 1px;
    z-index: 10;
    transition: border-color 0.2s;
  }

  .preview-item:hover::before {
    border-color: var(--ve-primary);
  }

  .preview-item.focused::before {
    border-width: 2px;
    border-color: var(--ve-primary);
  }

  .preview-item-title {
    position: absolute;
    top: 0;
    left: 0;
    background-color: var(--ve-primary);
    color: #fff;
    padding: 0.2rem 0.4rem;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    opacity: 0;
    transform: translateY(calc(1px - 100%));
    transition:
      opacity 0.2s,
      transform 0.2s;
    z-index: 11;
    font-size: 0.85em;
  }

  .preview-item:hover .preview-item-title,
  .preview-item-title.focused {
    opacity: 1;
  }
</style>
