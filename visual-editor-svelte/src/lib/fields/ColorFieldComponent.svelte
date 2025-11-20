<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte'
  import UnstyledButton from '$lib/components/ui/UnstyledButton.svelte'

  interface Options {
    label?: string
    default?: string
    colors: string[]
  }

  interface Props {
    value: string | null
    onchange: (value: string | null) => void
    options: Options
  }

  let { value = $bindable(null), onchange, options }: Props = $props()

  let isOpen = $state(false)
  let buttonRef: HTMLButtonElement

  function colorToProperty(color: string): string {
    if (color.startsWith('--')) {
      return `var(${color})`
    }
    return color
  }

  function handleToggle() {
    isOpen = !isOpen
  }

  function handleSelect(color: string | null) {
    onchange(color)
    isOpen = false
  }

  function handleClickOutside(event: MouseEvent) {
    if (buttonRef && !buttonRef.contains(event.target as Node)) {
      isOpen = false
    }
  }

  $effect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }
  })
</script>

<Field label={options.label}>
  <div class="ve-color-picker">
    <button
      type="button"
      bind:this={buttonRef}
      class="ve-color-button"
      class:focused={isOpen}
      onclick={handleToggle}
      style="--ve-selected-color: {value ? colorToProperty(value) : 'transparent'}"
    >
      <div class="ve-color-preview" class:empty={!value}></div>
    </button>

    {#if isOpen}
      <div class="ve-color-palette" style="--children: {options.colors.length + 1}">
        <button
          type="button"
          class="ve-color-item ve-color-transparent"
          onclick={() => handleSelect(null)}
        >
          <div class="ve-color-slash"></div>
        </button>
        {#each options.colors as color}
          <button
            type="button"
            class="ve-color-item"
            style="--ve-color: {colorToProperty(color)}"
            onclick={() => handleSelect(color)}
          ></button>
        {/each}
      </div>
    {/if}
  </div>
</Field>

<style>
  .ve-color-picker {
    position: relative;
  }

  .ve-color-button {
    width: 38px;
    height: 38px;
    background-color: #fff;
    box-shadow: var(--ve-field-shadow);
    border: 1px solid var(--ve-field-border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 3px;
    padding: 0;
  }

  .ve-color-button:focus,
  .ve-color-button.focused {
    border-color: var(--ve-primary);
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgb(23 113 230 / 25%);
  }

  .ve-color-preview {
    display: block;
    width: 28px;
    height: 28px;
    flex: none;
    background: var(--ve-selected-color, red);
    border-radius: 2px;
  }

  .ve-color-preview.empty {
    background-image: repeating-linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0.1) 5px,
      transparent 5px,
      transparent 10px
    );
    background-size: 14px 14px;
    background-color: #fff;
  }

  .ve-color-palette {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
    padding: 3px;
    background-color: white;
    border: solid 1px rgba(0, 0, 0, 0.1);
    box-shadow:
      rgba(0, 0, 0, 0.1) 0 10px 15px -3px,
      rgba(0, 0, 0, 0.05) 0 4px 6px -2px;
    border-radius: 4px;
    display: flex;
    flex-wrap: wrap;
    width: calc(27px * var(--children) * 0.5);
    z-index: 1000;
    animation: slideIn 0.2s ease-out;
  }

  .ve-color-item {
    position: relative;
    background-color: var(--ve-color);
    width: 25px;
    height: 25px;
    margin: 1px;
    flex: none;
    z-index: 2;
    cursor: pointer;
    border-radius: 2px;
    border: 1px solid var(--ve-field-border);
    box-shadow: var(--ve-field-shadow);
    padding: 0;
  }

  .ve-color-item:hover {
    z-index: 3;
    transform: scale(1.2);
    border-color: var(--ve-primary);
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgb(23 113 230 / 25%);
  }

  .ve-color-transparent {
    background-image: repeating-linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0.1) 5px,
      transparent 5px,
      transparent 10px
    );
    background-size: 14px 14px;
    background-color: #fff;
    overflow: hidden;
  }

  .ve-color-slash {
    position: absolute;
    top: -9px;
    left: calc(50% - 1px);
    width: 2px;
    height: 40px;
    background: red;
    transform: rotate(45deg);
  }

  @keyframes slideIn {
    from {
      transform: translateY(-0.2em);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
