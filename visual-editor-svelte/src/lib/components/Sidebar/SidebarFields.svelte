<script lang="ts">
  import type { EditorComponentData, EditorComponentDefinition } from '$lib/types'
  import { editorStore } from '$lib/stores/editor.svelte'
  import FieldsRenderer from '$lib/components/FieldsRenderer.svelte'

  interface Props {
    fields: EditorComponentDefinition['fields']
    data: EditorComponentData
    path: string
  }

  let { fields, data, path }: Props = $props()

  function handleUpdate(value: unknown, updatePath: string) {
    editorStore.updateData(value, updatePath)
  }
</script>

<FieldsRenderer {fields} {data} {path} onUpdate={handleUpdate} />
