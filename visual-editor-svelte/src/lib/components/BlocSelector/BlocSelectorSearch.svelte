<script lang="ts">
  import { t } from '$lib/functions/i18n'

  interface Props {
    value: string
    onchange: (value: string) => void
  }

  let { value = $bindable(), onchange }: Props = $props()

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement
    value = target.value
    onchange(target.value)
  }
</script>

<div class="search-wrapper">
  <input
    type="search"
    class="search-input"
    placeholder={t('searchComponent')}
    {value}
    oninput={handleInput}
  />
  <svg
    class="search-icon"
    width="14"
    height="14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m11.02 10.078 2.856 2.855-.943.943-2.855-2.855A6.002 6.002 0 0 1 .333 6.334c0-3.313 2.688-6 6-6a6.002 6.002 0 0 1 4.688 9.744Zm-1.337-.495a4.665 4.665 0 0 0-3.35-7.917 4.665 4.665 0 0 0-4.666 4.667 4.665 4.665 0 0 0 7.916 3.35l.1-.1Z"
      fill="currentColor"
    />
  </svg>
</div>

<style>
  .search-wrapper {
    position: relative;
    float: right;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    color: var(--ve-color-light);
    transform: translateY(-50%);
    pointer-events: none;
  }

  .search-input {
    height: 40px;
    background: var(--ve-hover);
    border-radius: 40px;
    padding: 0 1rem 0 2.6rem;
    border: 1px solid transparent;
    font: inherit;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--ve-primary);
  }
</style>
