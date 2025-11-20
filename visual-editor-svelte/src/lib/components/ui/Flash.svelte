<script lang="ts">
  import type { Snippet } from 'svelte'
  import Flex from './Flex.svelte'
  import Button from './Button.svelte'
  import { fade, fly } from 'svelte/transition'

  interface Props {
    children?: Snippet
    action?: Snippet
    onclick?: () => void
    onhide?: () => void
    duration?: number
  }

  let { children, action, onclick, onhide, duration }: Props = $props()

  let progressElement: HTMLDivElement

  function handleAnimationEnd() {
    if (onhide) {
      onhide()
    }
  }

  function handleClick(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (onclick) {
      onclick()
    }
  }
</script>

{#if children}
  <div
    class="ve-flash-wrapper"
    in:fly={{ x: 50, duration: 300 }}
    out:fly={{ x: -50, duration: 300 }}
  >
    <Flex between={true}>
      <div>
        {@render children()}
      </div>
      {#if action}
        <Button size="small" class="ve-flash-button" onclick={handleClick}>
          {@render action()}
        </Button>
      {/if}
    </Flex>
    {#if duration}
      <div
        class="ve-flash-progress"
        bind:this={progressElement}
        onanimationend={handleAnimationEnd}
        style="animation-duration: {duration}s"
      ></div>
    {/if}
  </div>
{/if}

<style>
  .ve-flash-wrapper {
    position: fixed;
    bottom: 1rem;
    right: 2rem;
    color: var(--ve-background);
    background: var(--ve-dark);
    z-index: 1001;
    padding: 1em;
    border-radius: 4px;
    width: 460px;
    font-weight: 500;
  }

  .ve-flash-wrapper :global(.ve-flash-button) {
    border: solid 1px var(--ve-background);
    background-color: transparent;
  }

  .ve-flash-progress {
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    transform-origin: 0 0;
    background-color: var(--ve-primary);
    animation: progressAnimation 1s both linear;
  }

  @keyframes progressAnimation {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }
</style>
