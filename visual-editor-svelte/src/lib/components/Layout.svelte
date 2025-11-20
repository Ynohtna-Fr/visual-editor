<script lang="ts">
  import type { EditorComponentData } from '$lib/types'
  import { editorStore } from '$lib/stores/editor.svelte'
  import Sidebar from './Sidebar/Sidebar.svelte'
  import Preview from './Preview/Preview.svelte'
  import ResizeBar from './ResizeBar.svelte'
  import SidebarToggleButton from './SidebarToggleButton.svelte'
  import BlocSelector from './BlocSelector/BlocSelector.svelte'

  interface Props {
    data: EditorComponentData[]
    previewUrl?: string
    onclose: () => void
    iconsUrl: string
  }

  let { data, previewUrl, onclose, iconsUrl }: Props = $props()

  let sidebarCollapsed = $state(false)
  let showResizeControl = $derived(!sidebarCollapsed)

  function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed
  }

  let sidebarWidth = $derived(editorStore.sidebarWidth)
</script>

<div
  class="layout-wrapper"
  class:with-sidebar={!sidebarCollapsed}
  style:--ve-sidebar="{sidebarWidth}vw"
>
  <div class="sidebar-container" class:hidden={sidebarCollapsed}>
    <Sidebar {data} {onclose} />
  </div>

  {#if previewUrl}
    <Preview {data} {previewUrl} />
  {/if}

  <SidebarToggleButton collapsed={sidebarCollapsed} onclick={toggleSidebar} />

  {#if showResizeControl}
    <ResizeBar />
  {/if}

  <BlocSelector {iconsUrl} />

  <!-- RollbackMessage will go here later -->
</div>

<style>
  .layout-wrapper {
    isolation: isolate;
    z-index: 9999;
    font-size: 15px;
    --ve-sidebar: 600px;
    --ve-clampedSidebar: clamp(450px, var(--ve-sidebar), calc(100vw - 375px));
    color: var(--ve-color-light);
    transition: background-color 0.3s;
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    display: grid;
    background-color: var(--ve-field-border);
    animation: fadeIn 0.7s cubic-bezier(0.19, 1, 0.22, 1) both;
    grid-template-columns: 1fr;
  }

  .layout-wrapper.with-sidebar {
    grid-template-columns: var(--ve-clampedSidebar) 1fr;
  }

  @keyframes fadeIn {
    from {
      background-color: rgba(255, 255, 255, 0);
    }
    to {
      background-color: var(--ve-field-border);
    }
  }

  .sidebar-container {
    display: flex;
  }

  .sidebar-container.hidden {
    display: none;
  }

  /* Custom scrollbar styles */
  .layout-wrapper :global(*::-webkit-scrollbar) {
    width: 7px;
    height: 7px;
  }

  .layout-wrapper :global(*::-webkit-scrollbar-track) {
    background: transparent;
    padding: 1px;
  }

  .layout-wrapper :global(*::-webkit-scrollbar-thumb) {
    background: var(--ve-field-border);
    border-radius: 4px;
  }
</style>
