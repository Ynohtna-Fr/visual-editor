<script lang="ts">
  interface Props {
    size?: number
  }

  let { size = 30 }: Props = $props()
</script>

<div class="ve-spinner" style="--size: {size}px">
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M30 60C46.5685 60 60 46.5685 60 30C60 13.4315 46.5685 0 30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60ZM30 50C41.0457 50 50 41.0457 50 30C50 18.9543 41.0457 10 30 10C18.9543 10 10 18.9543 10 30C10 41.0457 18.9543 50 30 50Z"
      fill="url(#paint0_linear_313_15)"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M10 30H0C0 46.5685 13.4315 60 30 60V50C18.9543 50 10 41.0457 10 30Z"
      fill="currentColor"
    />
    <defs>
      <linearGradient
        id="paint0_linear_313_15"
        x1="30"
        y1="30"
        x2="17"
        y2="30"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="currentColor" stop-opacity="0" />
        <stop offset="0.198062" stop-color="currentColor" stop-opacity="0.217786" />
        <stop offset="0.434425" stop-color="currentColor" stop-opacity="0.477687" />
        <stop offset="1" stop-color="currentColor" />
      </linearGradient>
    </defs>
  </svg>
</div>

<style>
  .ve-spinner {
    position: absolute;
    top: calc(50% - var(--size) * 0.5);
    left: calc(50% - var(--size) * 0.5);
    width: var(--size);
    height: var(--size);
    animation: spin 1.4s infinite linear;
  }

  .ve-spinner svg {
    display: block;
    width: var(--size);
    height: var(--size);
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }
</style>
