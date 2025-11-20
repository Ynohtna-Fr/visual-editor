<script lang="ts">
  import UnstyledButton from '$lib/components/ui/UnstyledButton.svelte'

  interface Props {
    onclick?: () => void
  }

  let { onclick }: Props = $props()
</script>

<UnstyledButton {onclick} class="add-floating">
  <span>Ajouter un bloc</span>
</UnstyledButton>

<style>
  :global(.add-floating) {
    position: relative;
    margin-top: -40px;
    margin-bottom: -40px;
    opacity: 0;
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 101;
    background-color: transparent;
    border: none;
    transition: opacity 0.3s;
  }

  :global(.add-floating:hover) {
    opacity: 1;
  }

  :global(.add-floating::before) {
    content: '';
    height: 2px;
    width: 100%;
    position: absolute;
    top: calc(50% - 1px);
    left: 0;
    z-index: 101;
    background-color: var(--ve-primary);
  }

  :global(.add-floating::after) {
    content: '+';
    font-size: 1.5em;
    z-index: 101;
    width: 40px;
    height: 40px;
    background: var(--ve-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border-radius: 40px;
    transition: transform 0.3s;
  }

  :global(.add-floating span) {
    pointer-events: none;
    font-size: 15px;
    height: 34px;
    background: var(--ve-primary);
    padding: 0 0.5em;
    display: flex;
    align-items: center;
    position: absolute;
    left: 50%;
    bottom: -30px;
    transform: translate(-50%, 5px);
    color: #fff;
    transition: transform 0.3s;
  }

  :global(.add-floating span::before) {
    content: '';
    position: absolute;
    display: block;
    left: calc(50% - 6px);
    top: -6px;
    width: 12px;
    height: 12px;
    background: var(--ve-primary);
    transform: rotate(45deg);
  }

  :global(.add-floating:hover span) {
    transform: translate(-50%, 0px);
  }
</style>
