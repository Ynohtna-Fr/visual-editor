<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    value: string
    checked: boolean
    icon: Snippet
    onchange: (value: string) => void
    name?: string
  }

  let { value, checked, icon, onchange, name }: Props = $props()

  function handleChange() {
    onchange(value)
  }

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
</script>

<div class="ve-alignment-button">
  <input
    type="radio"
    {value}
    {checked}
    onchange={handleChange}
    title={capitalize(value)}
    {name}
  />
  <div class="ve-alignment-button-icon">
    {@render icon()}
  </div>
</div>

<style>
  .ve-alignment-button {
    position: relative;
    border-right: 1px solid var(--ve-field-border);
  }

  .ve-alignment-button:last-of-type {
    border: none;
  }

  .ve-alignment-button:hover {
    background-color: var(--ve-hover);
  }

  .ve-alignment-button-icon {
    cursor: pointer;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition: 0.3s;
  }

  .ve-alignment-button input {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    cursor: pointer;
  }

  .ve-alignment-button input:checked + .ve-alignment-button-icon {
    background-color: var(--ve-primary);
    color: #fff;
    box-shadow: 0 0 0 1px var(--ve-primary);
    border-radius: 0.2em;
  }

  .ve-alignment-button input:focus + .ve-alignment-button-icon {
    box-shadow:
      0 0 0 1px var(--ve-primary),
      0 0 0 0.25rem rgb(23 113 230 / 25%);
    border-radius: 0.2em;
  }
</style>
