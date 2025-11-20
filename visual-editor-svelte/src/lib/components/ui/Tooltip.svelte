<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    content: string | Snippet
    children: Snippet
    visible?: boolean
    trigger?: 'click' | 'focus' | 'hover'
  }

  let { content, children, visible = false, trigger = 'hover' }: Props = $props()

  let isSnippet = $derived(typeof content === 'function')

  let isVisible = $state(visible)
  let tooltipElement: HTMLDivElement

  function show() {
    if (trigger === 'hover' || trigger === 'focus') {
      isVisible = true
    }
  }

  function hide() {
    if (trigger === 'hover' || trigger === 'focus') {
      isVisible = false
    }
  }

  function toggle() {
    if (trigger === 'click') {
      isVisible = !isVisible
    }
  }

  $effect(() => {
    isVisible = visible ?? false
  })
</script>

<div
  class="ve-tooltip-wrapper"
  role="tooltip"
  onmouseenter={show}
  onmouseleave={hide}
  onfocus={show}
  onblur={hide}
  onclick={toggle}
>
  {@render children()}
  {#if isVisible && content}
    <div class="ve-tooltip" bind:this={tooltipElement}>
      {#if isSnippet}
        {@render content()}
      {:else}
        {content}
      {/if}
      <div class="ve-tooltip-arrow"></div>
    </div>
  {/if}
</div>

<style>
  .ve-tooltip-wrapper {
    position: relative;
    display: inline-block;
  }

  .ve-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-8px);
    background-color: #202227;
    color: #fff;
    padding: 0.2em 0.5em;
    border-radius: 4px;
    font-size: 0.75em;
    line-height: 1.4;
    box-shadow:
      rgba(0, 0, 0, 0.1) 0 10px 15px -3px,
      rgba(0, 0, 0, 0.05) 0 4px 6px -2px;
    z-index: 1000;
    white-space: nowrap;
    pointer-events: none;
    animation: fadeIn 0.2s ease-in-out;
  }

  .ve-tooltip-arrow {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #202227;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(-8px);
    }
  }
</style>
