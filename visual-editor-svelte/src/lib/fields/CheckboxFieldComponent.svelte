<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte'

  interface Options {
    label: string
    help?: string
    default?: boolean
  }

  interface Props {
    value: boolean
    onchange: (value: boolean) => void
    options: Options
  }

  let { value = $bindable(false), onchange, options }: Props = $props()

  let id = `checkbox-${Math.random().toString(36).substr(2, 9)}`

  function handleChange() {
    onchange(!value)
  }
</script>

<Field help={options.help}>
  <div class="ve-checkbox-wrapper">
    <input
      type="checkbox"
      class="ve-checkbox-input"
      {id}
      checked={value}
      onchange={handleChange}
    />
    <label for={id} class="ve-checkbox-label">{options.label}</label>
  </div>
</Field>

<style>
  .ve-checkbox-wrapper {
    position: relative;
    display: flex;
  }

  .ve-checkbox-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 5;
  }

  .ve-checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    line-height: 1;
  }

  .ve-checkbox-label::before {
    cursor: pointer;
    display: block;
    content: '';
    width: 38px;
    height: 20px;
    border: solid 1px var(--ve-field-border);
    border-radius: 18px;
    margin-right: 0.5em;
    transition: 0.3s;
  }

  .ve-checkbox-label::after {
    position: absolute;
    content: '';
    top: 2px;
    left: 2px;
    border-radius: 16px;
    width: 16px;
    height: 16px;
    background-color: var(--ve-color-light);
    transition: 0.3s;
  }

  .ve-checkbox-input:checked + .ve-checkbox-label::before {
    border-color: var(--ve-primary);
    background-color: var(--ve-primary);
  }

  .ve-checkbox-input:focus + .ve-checkbox-label::before {
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgb(23 113 230 / 25%);
  }

  .ve-checkbox-input:checked + .ve-checkbox-label::after {
    background-color: #fff;
    transform: translateX(17px);
  }
</style>
