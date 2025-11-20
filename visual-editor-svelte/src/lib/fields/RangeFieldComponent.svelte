<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte'

  interface Options {
    label?: string
    help?: string
    default?: number
    min?: number
    max?: number
    step?: number
  }

  interface Props {
    value: number
    onchange: (value: number) => void
    options: Options
  }

  let { value = $bindable(0), onchange, options }: Props = $props()

  let localValue = $state(value ?? options.default ?? 0)

  $effect(() => {
    localValue = value ?? options.default ?? 0
  })

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement
    const newValue = parseFloat(target.value)
    localValue = newValue
    onchange(newValue)
  }
</script>

<Field
  label={`${options.label} (${localValue})`}
  help={options.help}
>
  <div class="ve-range-wrapper">
    <input
      type="range"
      class="ve-range-input"
      min={options.min ?? 0}
      max={options.max ?? 100}
      step={options.step ?? 1}
      value={localValue}
      oninput={handleInput}
    />
    <div class="ve-range-track">
      <div
        class="ve-range-track-selected"
        style="width: {((localValue - (options.min ?? 0)) / ((options.max ?? 100) - (options.min ?? 0))) * 100}%"
      ></div>
    </div>
  </div>
</Field>

<style>
  .ve-range-wrapper {
    position: relative;
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
  }

  .ve-range-track {
    position: absolute;
    width: 100%;
    height: 5px;
    background-color: var(--ve-field-border);
    border-radius: 5px;
    pointer-events: none;
  }

  .ve-range-track-selected {
    position: absolute;
    left: 0;
    height: 100%;
    background-color: var(--ve-primary);
    border-radius: 5px;
    transition: width 0.15s ease;
  }

  .ve-range-input {
    position: relative;
    width: 100%;
    height: 20px;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    z-index: 1;
  }

  .ve-range-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    background: #fff;
    border: 1px solid var(--ve-field-border);
    box-shadow:
      rgba(0, 0, 0, 0.1) 0 10px 15px -3px,
      rgba(0, 0, 0, 0.05) 0 4px 6px -2px;
    cursor: pointer;
  }

  .ve-range-input::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 20px;
    background: #fff;
    border: 1px solid var(--ve-field-border);
    box-shadow:
      rgba(0, 0, 0, 0.1) 0 10px 15px -3px,
      rgba(0, 0, 0, 0.05) 0 4px 6px -2px;
    cursor: pointer;
  }

  .ve-range-input:focus::-webkit-slider-thumb {
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgb(23 113 230 / 25%);
  }

  .ve-range-input:focus::-moz-range-thumb {
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgb(23 113 230 / 25%);
  }
</style>
