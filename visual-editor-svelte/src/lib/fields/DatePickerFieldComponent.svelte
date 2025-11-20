<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte'
  import ButtonIcon from '$lib/components/ui/ButtonIcon.svelte'

  interface Options {
    label?: string
    help?: string
    default?: string
    time?: boolean
  }

  interface Props {
    value: number
    onchange: (value: number) => void
    options: Options
  }

  let { value = $bindable(0), onchange, options }: Props = $props()

  // Convert timestamp to date string
  let dateString = $derived(() => {
    if (!value) return ''
    const date = new Date(value * 1000)
    if (options.time) {
      // Format: YYYY-MM-DDTHH:MM
      return date.toISOString().slice(0, 16)
    }
    // Format: YYYY-MM-DD
    return date.toISOString().slice(0, 10)
  })

  // Format for display
  let formattedDate = $derived(() => {
    if (!value) return ''
    const date = new Date(value * 1000)
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'long',
      timeStyle: options.time ? 'short' : undefined
    }).format(date)
  })

  let showPicker = $state(false)
  let inputRef: HTMLInputElement

  function handleDateChange(e: Event) {
    const target = e.target as HTMLInputElement
    if (target.value) {
      const date = new Date(target.value)
      onchange(Math.floor(date.getTime() / 1000))
      if (!options.time) {
        showPicker = false
      }
    }
  }

  function openPicker() {
    showPicker = true
    // Try to trigger native picker
    if (inputRef) {
      inputRef.showPicker?.()
    }
  }

  let id = `datepicker-${Math.random().toString(36).substr(2, 9)}`
</script>

<Field {id} label={options.label} help={options.help}>
  {#snippet icon()}
    <ButtonIcon onclick={openPicker}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.5" />
        <path d="M2 6h12M5 1v3M11 1v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </ButtonIcon>
  {/snippet}

  <div class="ve-datepicker">
    <input
      type="text"
      class="ve-datepicker-display"
      {id}
      value={formattedDate()}
      readonly
      onfocus={openPicker}
    />

    {#if showPicker}
      <div class="ve-datepicker-popup">
        <input
          bind:this={inputRef}
          type={options.time ? 'datetime-local' : 'date'}
          class="ve-datepicker-input"
          value={dateString()}
          onchange={handleDateChange}
          onblur={() => (showPicker = false)}
        />
      </div>
    {/if}
  </div>
</Field>

<style>
  .ve-datepicker {
    position: relative;
    width: 100%;
  }

  .ve-datepicker-display {
    color: var(--ve-color);
    background: transparent;
    padding: 0.5rem 0.75em;
    line-height: 1.25rem;
    border-radius: 0.2rem;
    display: block;
    width: 100%;
    border: 1px solid var(--ve-field-border);
    box-shadow: var(--ve-field-shadow);
    cursor: pointer;
  }

  .ve-datepicker-display:focus {
    border-color: var(--ve-primary);
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgb(23 113 230 / 25%);
  }

  .ve-datepicker-popup {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
    background: white;
    border: 1px solid var(--ve-field-border);
    border-radius: 4px;
    padding: 8px;
    box-shadow:
      rgba(0, 0, 0, 0.1) 0 10px 15px -3px,
      rgba(0, 0, 0, 0.05) 0 4px 6px -2px;
    z-index: 1000;
    animation: slideIn 0.2s ease-out;
  }

  .ve-datepicker-input {
    border: 1px solid var(--ve-field-border);
    border-radius: 4px;
    padding: 8px;
    font-size: 1rem;
  }

  .ve-datepicker-input:focus {
    border-color: var(--ve-primary);
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgb(23 113 230 / 25%);
  }

  @keyframes slideIn {
    from {
      transform: translateY(-0.5em);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
