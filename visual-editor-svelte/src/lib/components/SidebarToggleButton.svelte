<script lang="ts">
  import ButtonIcon from '$lib/components/ui/ButtonIcon.svelte'

  interface Props {
    collapsed: boolean
    onclick: () => void
  }

  let { collapsed, onclick }: Props = $props()
</script>

<ButtonIcon {onclick} class="sidebar-toggle-btn" class:collapsed>
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.5 2.5L4.5 20.5L2.5 20.5L2.5 2.5L4.5 2.5ZM10.328 12.5L16.4 18.571L14.986 19.985L6.5 11.5L14.985 3.015L16.4 4.429L10.33 10.5L21.5 10.5L21.5 12.5L10.328 12.5Z"
      fill="currentColor"
    />
  </svg>
</ButtonIcon>

<style>
  :global(.sidebar-toggle-btn) {
    position: absolute;
    top: 10px;
    z-index: 1001;
    box-shadow: var(--ve-field-shadow);
    border: 1px solid var(--ve-hover);
    transition:
      opacity 0.3s,
      transform 0.3s,
      left 0.3s;
    left: calc(var(--ve-clampedSidebar) + 1em);
    opacity: 0;
    transform: rotate(0deg);
  }

  :global(.sidebar-toggle-btn:hover) {
    opacity: 1;
  }

  :global(.sidebar-toggle-btn.collapsed) {
    left: 1em;
    opacity: 1;
    transform: rotate(180deg);
  }
</style>
