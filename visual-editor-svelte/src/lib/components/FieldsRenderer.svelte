<script lang="ts">
  import type { FieldDefinition } from '$lib/types'

  interface Props {
    fields: FieldDefinition<any, any>[]
    data: Record<string, unknown>
    onUpdate: (value: unknown, path: string) => void
    path: string
  }

  let { fields, data, onUpdate, path }: Props = $props()

  // Filter fields that should be rendered
  let visibleFields = $derived(fields.filter((field) => field.shouldRender(data)))

  function handleChange(field: FieldDefinition<any, any>, value: unknown) {
    const fieldPath = field.name ? `${path}.${field.name}` : path
    onUpdate(value, fieldPath)
  }
</script>

{#each visibleFields as field, k (field.name || k)}
  {#if field.group}
    <!-- Field group (like Row, Tabs) -->
    {@const GroupComponent = field.component}
    {#if GroupComponent}
      <GroupComponent options={field.options}>
        <svelte:self {fields} {data} {path} {onUpdate} />
      </GroupComponent>
    {/if}
  {:else}
    <!-- Regular field -->
    {@const FieldComponent = field.component}
    {@const fieldValue = field.name ? data[field.name] : undefined}
    {@const extraProps = field.extraProps ? field.extraProps(data) : {}}
    {#if FieldComponent}
      <FieldComponent
        value={fieldValue}
        onchange={(v) => handleChange(field, v)}
        options={field.options}
        {...extraProps}
      />
    {/if}
  {/if}
{/each}
