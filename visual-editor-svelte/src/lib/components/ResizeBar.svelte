<script lang="ts">
  import { editorStore } from '$lib/stores/editor.svelte'

  let isDragging = $state(false)

  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    isDragging = true

    const handleMouseMove = (e: MouseEvent) => {
      editorStore.setSidebarWidth(Math.round((100 * e.clientX) / window.innerWidth))
    }

    const handleMouseUp = () => {
      isDragging = false
      document.documentElement.removeEventListener('mousemove', handleMouseMove)
      document.documentElement.removeEventListener('mouseup', handleMouseUp)
    }

    document.documentElement.addEventListener('mousemove', handleMouseMove)
    document.documentElement.addEventListener('mouseup', handleMouseUp)
  }
</script>

<div
  class="resize-bar"
  class:dragging={isDragging}
  onmousedown={handleMouseDown}
  role="separator"
  aria-orientation="vertical"
></div>

{#if isDragging}
  <div class="resize-overlay"></div>
{/if}

<style>
  .resize-bar {
    position: fixed;
    top: 0;
    bottom: 0;
    height: 100%;
    left: var(--ve-clampedSidebar);
    width: 15px;
    z-index: 1002;
    cursor: ew-resize;
    transition: box-shadow 0.3s;
  }

  .resize-bar:hover,
  .resize-bar.dragging {
    box-shadow: -1px -1px 0 1px var(--ve-primary);
  }

  .resize-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1001;
  }
</style>
