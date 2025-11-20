<script lang="ts">
  import type { EditorComponentData } from '$lib/types'
  import { mount, unmount } from 'svelte'
  import { onMount } from 'svelte'
  import { editorStore, PreviewModes } from '$lib/stores/editor.svelte'
  import { VisualEditorAPI } from '$lib/index'
  import Spinner from '$lib/components/ui/Spinner.svelte'
  import PreviewItems from './PreviewItems.svelte'

  interface Props {
    data: EditorComponentData[]
    previewUrl: string
    usePostMessagePreview?: boolean
  }

  let { data, previewUrl, usePostMessagePreview = false }: Props = $props()

  let iframeEl: HTMLIFrameElement
  let iframeRoot: HTMLElement | null = $state(null)
  let iframeWindow: Window | null = $state(null)
  let loaded = $state(false)
  let showSpinner = $derived(!loaded)
  let initialHTML: Record<string, string> = {}
  let previewItemsComponent: any = null

  let previewMode = $derived(editorStore.previewMode)
  let isMobile = $derived(previewMode === PreviewModes.PHONE)

  onMount(async () => {
    console.log('[Preview] onMount - usePostMessagePreview (from prop):', usePostMessagePreview)
    console.log('[Preview] VisualEditorAPI.postMessagePreview (global):', VisualEditorAPI.postMessagePreview)

    try {
      if (usePostMessagePreview) {
        console.log('[Preview] Using CLIENT-SIDE mode (postMessage)')
        // Client-side: Load preview page directly in iframe
        iframeEl.src = previewUrl

        // Wait for iframe to load
        await new Promise((resolve) => {
          iframeEl.addEventListener('load', resolve, { once: true })
        })

        const iframeDoc = iframeEl.contentDocument
        const iframeWin = iframeEl.contentWindow

        if (iframeDoc && iframeWin) {
          iframeWindow = iframeWin

          // Find the root element for components
          const root = iframeDoc.querySelector('#ve-components') as HTMLElement
          if (root) {
            // In client-side mode, we don't extract initialHTML since
            // the page handles its own rendering via postMessage
            iframeRoot = root
          }
        }
      } else {
        console.log('[Preview] Using SERVER-SIDE mode (fetch POST)')
        // Server-side: Fetch the initial preview HTML
        const response = await fetch(previewUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(data)
        })

        if (!response.ok) {
          console.error('Preview fetch failed:', response.statusText)
          return
        }

        // Write content to iframe
        const html = await response.text()
        const iframeDoc = iframeEl.contentDocument
        if (iframeDoc) {
          iframeDoc.open()
          iframeDoc.write(html)
          iframeDoc.close()

          const iframeWin = iframeEl.contentWindow
          if (iframeWin) {
            iframeWindow = iframeWin
          }

          // Find the root element for components
          const root = iframeDoc.querySelector('#ve-components') as HTMLElement
          if (root) {
            // Store initial HTML for each component
            initialHTML = Array.from(root.children).reduce(
              (acc, v, k) => ({ ...acc, [data[k]?._id || k]: v.outerHTML }),
              {}
            )
            root.innerHTML = ''
            iframeRoot = root

            // Mount PreviewItems into the iframe
            mountPreviewItems(root)
          }
        }
      }
    } catch (error) {
      console.error('Preview loading error:', error)
    }

    return () => {
      if (previewItemsComponent) {
        unmount(previewItemsComponent)
      }
    }
  })

  function mountPreviewItems(target: HTMLElement) {
    if (previewItemsComponent) {
      unmount(previewItemsComponent)
    }

    previewItemsComponent = mount(PreviewItems, {
      target,
      props: {
        data,
        initialHTML,
        previewUrl,
        iframeWindow,
        usePostMessagePreview
      }
    })
  }

  // Re-mount when data changes
  $effect(() => {
    if (iframeRoot && data) {
      mountPreviewItems(iframeRoot)
    }
  })

  function handleLoad() {
    loaded = true
  }
</script>

<div class="preview-wrapper">
  {#if showSpinner}
    <Spinner style="color: white; opacity: 0.6;" />
  {/if}
  <iframe
    bind:this={iframeEl}
    class="preview-iframe"
    class:loaded
    class:mobile={isMobile}
    title="Preview"
    onload={handleLoad}
  ></iframe>
</div>

<style>
  .preview-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    animation: fadeIn 0.7s cubic-bezier(0.19, 1, 0.22, 1) both;
  }

  @keyframes fadeIn {
    from {
      transform: translateX(50px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .preview-iframe {
    transform-origin: 50% 50%;
    border: none;
    color: var(--ve-primary);
    transition:
      width 0.3s,
      height 0.3s,
      opacity 0.5s;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .preview-iframe.loaded {
    opacity: 1;
  }

  .preview-iframe.mobile {
    width: 390px;
    height: 844px;
  }
</style>
