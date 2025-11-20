<script lang="ts">
  import { dndzone } from 'svelte-dnd-action'
  import type { DndEvent } from 'svelte-dnd-action'
  import Label from '$lib/components/ui/Label.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import ButtonIcon from '$lib/components/ui/ButtonIcon.svelte'
  import DragHandle from '$lib/components/ui/DragHandle.svelte'
  import FieldsRenderer from '$lib/components/FieldsRenderer.svelte'
  import type { FieldDefinition } from '$lib/types'
  import { deepSet } from '$lib/functions/object'
  import { t } from '$lib/functions/i18n'
  import { fillDefaults } from '$lib/functions/fields'

  type RepeaterLine = { _id: string; [key: string]: unknown }

  interface Options {
    label?: string
    min?: number
    max?: number
    addLabel?: string
    fields: FieldDefinition<any, any>[]
    collapsed?: string
    default?: RepeaterLine[]
  }

  interface Props {
    value: RepeaterLine[]
    onchange: (value: RepeaterLine[]) => void
    options: Options
  }

  let { value = $bindable([]), onchange, options }: Props = $props()

  let items = $state(value || [])
  let lastAdditionIndex = $state(-1)
  let collapsedStates = $state<Record<string, boolean>>({})

  const canAdd = $derived(!options.max || items.length < options.max)
  const canRemove = $derived(!options.min || items.length > options.min)

  function generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  function add() {
    const newItem = fillDefaults({ _id: generateId() }, options.fields) as RepeaterLine
    items = [...items, newItem]
    lastAdditionIndex = items.length - 1
    // New items start expanded
    collapsedStates[newItem._id] = false
    onchange(items)
  }

  function remove(line: RepeaterLine) {
    items = items.filter((v) => v !== line)
    delete collapsedStates[line._id]
    onchange(items)
  }

  function updateProperty(v: unknown, path: string) {
    items = deepSet(items, path, v) as RepeaterLine[]
    onchange(items)
  }

  function handleDndConsider(e: CustomEvent<DndEvent<RepeaterLine>>) {
    items = e.detail.items
  }

  function handleDndFinalize(e: CustomEvent<DndEvent<RepeaterLine>>) {
    items = e.detail.items
    onchange(items)
  }

  function toggleCollapsed(id: string) {
    collapsedStates[id] = !collapsedStates[id]
  }

  function getTitle(line: RepeaterLine, index: number): string {
    if (options.collapsed && line[options.collapsed]) {
      const title = line[options.collapsed] as string
      // Strip HTML tags for display
      return title.replace(/<[^>]*>/g, '')
    }
    return `#${index + 1}`
  }

  // Initialize collapsed states for existing items
  $effect(() => {
    items.forEach((item, index) => {
      if (collapsedStates[item._id] === undefined) {
        collapsedStates[item._id] = index !== lastAdditionIndex
      }
    })
  })

  // Sync items with value prop
  $effect(() => {
    if (value !== items) {
      items = value || []
    }
  })
</script>

<div class="ve-field">
  {#if options.label}
    <Label>{options.label}</Label>
  {/if}

  <div class="ve-repeater-wrapper">
    <div
      class="ve-repeater-items"
      use:dndzone={{ items, flipDurationMs: 200, dropTargetStyle: {} }}
      onconsider={handleDndConsider}
      onfinalize={handleDndFinalize}
    >
      {#each items as line, index (line._id)}
        {@const isCollapsed = collapsedStates[line._id] ?? true}
        {@const title = getTitle(line, index)}
        <div class="ve-repeater-item" data-dragging={false}>
          <DragHandle />

          <div class="ve-repeater-item-header">
            <button
              type="button"
              class="ve-repeater-item-toggle"
              onclick={() => toggleCollapsed(line._id)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                style:transform={isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)'}
                style:transition="transform 0.2s"
              >
                <path
                  d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <span class="ve-repeater-item-title" onclick={() => toggleCollapsed(line._id)}>
              {title}
            </span>

            <div class="ve-repeater-item-actions">
              {#if canRemove}
                <ButtonIcon
                  danger
                  onclick={() => remove(line)}
                  title={t('deleteItem')}
                  style="color: var(--ve-danger);"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-4.586 6l1.768 1.768-1.414 1.414L12 15.414l-1.768 1.768-1.414-1.414L10.586 14l-1.768-1.768 1.414-1.414L12 12.586l1.768-1.768 1.414 1.414L13.414 14zM9 4v2h6V4H9z"
                      fill="currentColor"
                    />
                  </svg>
                </ButtonIcon>
              {/if}
            </div>
          </div>

          {#if !isCollapsed}
            <div class="ve-repeater-item-body">
              <FieldsRenderer
                fields={options.fields}
                data={line}
                onUpdate={updateProperty}
                path={index.toString()}
              />
            </div>
          {/if}
        </div>
      {/each}
    </div>

    {#if canAdd}
      <div class="ve-repeater-footer">
        <Button secondary onclick={add}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            style="margin-right: 0.5em;"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4zm1 11C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"
              fill="currentColor"
            />
          </svg>
          {options.addLabel || t('addItem')}
        </Button>
      </div>
    {/if}
  </div>
</div>

<style>
  .ve-field {
    margin-bottom: 1em;
  }

  .ve-repeater-wrapper {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .ve-repeater-items {
    display: flex;
    flex-direction: column;
  }

  .ve-repeater-item {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5em;
    padding: 0.4rem 0.7rem 0.4rem calc(10px + 0.7rem);
    border-bottom: solid 1px rgba(0, 0, 0, 0.06);
    background-color: #fff;
  }

  .ve-repeater-item[data-dragging='true'] {
    opacity: 0.5;
  }

  .ve-repeater-item-header {
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.5em 0;
    cursor: pointer;
  }

  .ve-repeater-item-toggle {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ve-color);
  }

  .ve-repeater-item-title {
    flex: 1;
    font-weight: 500;
    color: var(--ve-color);
    cursor: pointer;
  }

  .ve-repeater-item-actions {
    display: flex;
    gap: 0.25em;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .ve-repeater-item:hover .ve-repeater-item-actions {
    opacity: 1;
  }

  .ve-repeater-item-body {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1em;
    padding: 0.5em 0 1em 0;
  }

  .ve-repeater-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0.2rem;
    background-color: rgba(0, 0, 0, 0.03);
  }
</style>
