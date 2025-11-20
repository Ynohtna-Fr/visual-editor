<script lang="ts">
  import type { Snippet } from 'svelte'
  import ButtonIcon from './ButtonIcon.svelte'

  interface Props {
    children: Snippet
    title: string
    isOpen: boolean
    onclose: () => void
  }

  let { children, title, isOpen, onclose }: Props = $props()

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onclose()
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen) {
      onclose()
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <div class="ve-modal-overlay" onclick={handleBackdropClick} role="presentation">
    <div class="ve-modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h2 class="ve-modal-title" id="modal-title">{title}</h2>
      <div class="ve-modal-body">
        {@render children()}
      </div>
      <div class="ve-modal-close">
        <ButtonIcon onclick={onclose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </ButtonIcon>
      </div>
    </div>
  </div>
{/if}

<style>
  .ve-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.5);
    animation: fadeIn 300ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .ve-modal-content {
    position: fixed;
    top: 50%;
    left: 0;
    right: 0;
    z-index: 51;
    margin-left: auto;
    margin-right: auto;
    width: calc(100% - 2rem);
    max-width: 1290px;
    border-radius: 8px;
    background-color: var(--ve-background);
    padding: 1.5rem 2rem;
    transform: translateY(-50%);
    animation: contentIn 300ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .ve-modal-title {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0;
    padding: 0;
    margin-bottom: 1rem;
  }

  .ve-modal-body {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }

  .ve-modal-close {
    position: absolute;
    top: 1.2rem;
    right: 1.5rem;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes contentIn {
    from {
      opacity: 0;
      transform: translateY(-48%) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(-50%) scale(1);
    }
  }
</style>
