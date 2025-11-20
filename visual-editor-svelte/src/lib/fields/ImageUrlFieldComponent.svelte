<script lang="ts">
  import Label from '$lib/components/ui/Label.svelte'
  import ButtonIcon from '$lib/components/ui/ButtonIcon.svelte'

  interface Options {
    label?: string
    help?: string
    default?: string
    onBrowse?: (url?: string) => Promise<string>
  }

  interface Props {
    value: string
    onchange: (value: string) => void
    options: Options
  }

  let { value = $bindable(''), onchange, options }: Props = $props()

  let localValue = $state(value)
  let showTooltip = $state(false)

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement
    localValue = target.value
    onchange(target.value)
  }

  async function handleBrowse(e: Event) {
    e.preventDefault()
    if (options.onBrowse) {
      try {
        const newValue = await options.onBrowse(value)
        localValue = newValue
        onchange(newValue)
      } catch (e) {
        // Ignore errors (user cancelled)
      }
    }
  }

  let id = `imageinput-${Math.random().toString(36).substr(2, 9)}`
</script>

<div class="ve-field">
  {#if options.label}
    <Label for={id}>{options.label}</Label>
  {/if}

  <div class="ve-field-wrapper">
    <div
      class="ve-tooltip-wrapper"
      onmouseenter={() => value && (showTooltip = true)}
      onmouseleave={() => (showTooltip = false)}
      onfocus={() => value && (showTooltip = true)}
      onblur={() => (showTooltip = false)}
    >
      <input
        type="text"
        class="ve-input"
        {id}
        value={localValue}
        oninput={handleInput}
      />

      {#if showTooltip && value}
        <div class="ve-tooltip">
          <img src={value} alt="" class="ve-tooltip-image" />
          <div class="ve-tooltip-arrow"></div>
        </div>
      {/if}
    </div>

    {#if options.onBrowse}
      <div class="ve-field-icon">
        <ButtonIcon
          onclick={handleBrowse}
          style="width: 32px; height: 32px; color: var(--ve-color-light);"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path
              fill="currentColor"
              d="M3 21a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414l2 2H20a1 1 0 0 1 1 1v3h-2V7h-7.414l-2-2H4v11.998L5.5 11h17l-2.31 9.243a1 1 0 0 1-.97.757H3zm16.938-8H7.062l-1.5 6h12.876l1.5-6z"
            />
          </svg>
        </ButtonIcon>
      </div>
    {/if}
  </div>

  {#if options.help}
    <div class="ve-field-help">{options.help}</div>
  {/if}
</div>

<style>
  .ve-field {
    margin-bottom: 1em;
  }

  .ve-field-wrapper {
    position: relative;
  }

  .ve-field-help {
    font-style: italic;
    margin-top: 0.5em;
    font-size: 0.8em;
    color: var(--ve-color-light);
  }

  .ve-field-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 0;
    color: var(--ve-field-border);
    cursor: pointer;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
  }

  .ve-tooltip-wrapper {
    position: relative;
    display: block;
  }

  .ve-input {
    color: var(--ve-color);
    background: transparent;
    padding: 0.5rem 0.75em;
    padding-right: 40px;
    line-height: 1.25rem;
    border-radius: 0.2rem;
    display: block;
    width: 100%;
    border: 1px solid var(--ve-field-border);
    box-shadow: var(--ve-field-shadow);
  }

  .ve-input:focus {
    border-color: var(--ve-primary);
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgb(23 113 230 / 25%);
  }

  .ve-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-8px);
    background-color: #202227;
    padding: 0.2em 0.5em;
    border-radius: 4px;
    box-shadow:
      rgba(0, 0, 0, 0.1) 0 10px 15px -3px,
      rgba(0, 0, 0, 0.05) 0 4px 6px -2px;
    z-index: 1000;
    pointer-events: none;
    animation: fadeIn 0.2s ease-in-out;
  }

  .ve-tooltip-arrow {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #202227;
  }

  .ve-tooltip-image {
    width: 150px;
    height: 150px;
    position: relative;
    z-index: 2;
    object-fit: cover;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(-8px);
    }
  }
</style>
