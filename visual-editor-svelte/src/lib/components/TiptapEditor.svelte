<script lang="ts">
  import { Editor } from '@tiptap/core'
  import Document from '@tiptap/extension-document'
  import Paragraph from '@tiptap/extension-paragraph'
  import Text from '@tiptap/extension-text'
  import Bold from '@tiptap/extension-bold'
  import Italic from '@tiptap/extension-italic'
  import Underline from '@tiptap/extension-underline'
  import { Color } from '@tiptap/extension-color'
  import { TextStyle } from '@tiptap/extension-text-style'
  import { Highlight } from '@tiptap/extension-highlight'
  import Link from '@tiptap/extension-link'
  import History from '@tiptap/extension-history'
  import HardBreak from '@tiptap/extension-hard-break'
  import BulletList from '@tiptap/extension-bullet-list'
  import OrderedList from '@tiptap/extension-ordered-list'
  import ListItem from '@tiptap/extension-list-item'
  import Blockquote from '@tiptap/extension-blockquote'
  import Heading from '@tiptap/extension-heading'
  import TextAlign from '@tiptap/extension-text-align'
  import { Node } from '@tiptap/core'
  import { onMount, onDestroy } from 'svelte'

  // Single line document node
  const SingleDocument = Node.create({
    name: 'doc',
    topNode: true,
    group: 'block',
    content: 'inline*'
  })

  interface Props {
    value: string
    onchange: (value: string) => void
    colors?: string[]
    backgroundColor?: string
    color?: string
    multiline?: boolean
    defaultAlign?: 'left' | 'right' | 'center' | 'justify'
  }

  let {
    value = $bindable(''),
    onchange,
    colors = [],
    backgroundColor,
    color,
    multiline = false,
    defaultAlign = 'left'
  }: Props = $props()

  let editorElement: HTMLDivElement
  let editor: Editor | null = null
  let isFocused = $state(false)

  function cleanHTML(str: string, isMultiline: boolean): string {
    let content = str.replaceAll(
      /(<[uo]l[^>]*>)(.*?)(<\/[uo]l>)/gi,
      (_, openingTag, inner, closingTag) =>
        `${openingTag}${removeParagraphs(inner)}${closingTag}`
    )
    if (!isMultiline) {
      content = removeParagraphs(content)
    }
    return content.trim()
  }

  function removeParagraphs(str: string): string {
    return str
      .replaceAll(/<\/p><p[^>]*>/gi, '<br>')
      .replaceAll(/<p[^>]*>/gi, '')
      .replaceAll(/<\/p>/gi, '')
  }

  onMount(() => {
    editor = new Editor({
      element: editorElement,
      extensions: [
        ...(multiline ? [Document] : [SingleDocument]),
        Paragraph,
        Text,
        Bold,
        Italic,
        Underline,
        TextStyle,
        Color,
        Highlight,
        HardBreak,
        History,
        BulletList,
        OrderedList,
        ListItem,
        Blockquote,
        Heading.configure({ levels: [2, 3, 4, 5, 6] }),
        Link.configure({ openOnClick: false }),
        TextAlign.configure({
          types: ['heading', 'bulletList', 'listItem', 'orderedList', 'blockquote', 'paragraph'],
          defaultAlignment: defaultAlign
        })
      ],
      content: value,
      onUpdate: ({ editor }) => {
        onchange(cleanHTML(editor.getHTML(), multiline))
      },
      onFocus: () => (isFocused = true),
      onBlur: () => (isFocused = false)
    })
  })

  onDestroy(() => {
    if (editor) {
      editor.destroy()
    }
  })

  // Update content when value prop changes externally
  $effect(() => {
    if (editor && !editor.isFocused && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  })

  // Toolbar actions
  function toggleBold() {
    editor?.chain().focus().toggleBold().run()
  }

  function toggleItalic() {
    editor?.chain().focus().toggleItalic().run()
  }

  function toggleUnderline() {
    editor?.chain().focus().toggleUnderline().run()
  }

  function toggleBulletList() {
    editor?.chain().focus().toggleBulletList().run()
  }

  function toggleOrderedList() {
    editor?.chain().focus().toggleOrderedList().run()
  }

  function setAlignment(align: 'left' | 'center' | 'right' | 'justify') {
    editor?.chain().focus().setTextAlign(align).run()
  }

  function toggleHighlight() {
    editor?.chain().focus().toggleHighlight().run()
  }

  function setColor(colorValue: string) {
    editor?.chain().focus().setColor(colorValue).run()
  }

  // Check if actions are active
  let isBold = $derived(editor?.isActive('bold') ?? false)
  let isItalic = $derived(editor?.isActive('italic') ?? false)
  let isUnderline = $derived(editor?.isActive('underline') ?? false)
  let isBulletList = $derived(editor?.isActive('bulletList') ?? false)
  let isOrderedList = $derived(editor?.isActive('orderedList') ?? false)
  let isHighlight = $derived(editor?.isActive('highlight') ?? false)
</script>

<div
  class="tiptap-wrapper"
  class:focused={isFocused}
  style:color
  style:background-color={backgroundColor}
  style:text-align={defaultAlign}
>
  <div bind:this={editorElement} class="tiptap-editor"></div>

  {#if editor && isFocused}
    <div class="tiptap-toolbar">
      <!-- List buttons -->
      {#if multiline}
        <button
          type="button"
          class="toolbar-btn"
          class:active={isOrderedList}
          onclick={toggleOrderedList}
          title="Ordered List"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1H3zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2v-.5zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"
              fill="currentColor"
            />
          </svg>
        </button>
        <button
          type="button"
          class="toolbar-btn"
          class:active={isBulletList}
          onclick={toggleBulletList}
          title="Bullet List"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"
              fill="currentColor"
            />
          </svg>
        </button>

        <div class="toolbar-separator"></div>
      {/if}

      <!-- Alignment buttons -->
      <button
        type="button"
        class="toolbar-btn"
        onclick={() => setAlignment('left')}
        title="Align Left"
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="currentColor" d="M3 4h18v2H3V4zm0 4h12v2H3V8zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z" />
        </svg>
      </button>
      <button
        type="button"
        class="toolbar-btn"
        onclick={() => setAlignment('center')}
        title="Align Center"
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="currentColor" d="M3 4h18v2H3V4zm3 4h12v2H6V8zm-3 4h18v2H3v-2zm3 4h12v2H6v-2zm-3 4h18v2H3v-2z" />
        </svg>
      </button>
      <button
        type="button"
        class="toolbar-btn"
        onclick={() => setAlignment('right')}
        title="Align Right"
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="currentColor" d="M3 4h18v2H3V4zm6 4h12v2H9V8zm-6 4h18v2H3v-2zm6 4h12v2H9v-2zm-6 4h18v2H3v-2z" />
        </svg>
      </button>

      <div class="toolbar-separator"></div>

      <!-- Format buttons -->
      <button
        type="button"
        class="toolbar-btn"
        class:active={isBold}
        onclick={toggleBold}
        title="Bold"
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z"
          />
        </svg>
      </button>
      <button
        type="button"
        class="toolbar-btn"
        class:active={isItalic}
        onclick={toggleItalic}
        title="Italic"
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="currentColor" d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z" />
        </svg>
      </button>
      <button
        type="button"
        class="toolbar-btn"
        class:active={isUnderline}
        onclick={toggleUnderline}
        title="Underline"
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M8 3v9a4 4 0 1 0 8 0V3h2v9a6 6 0 1 1-12 0V3h2zM4 20h16v2H4v-2z"
          />
        </svg>
      </button>
      <button
        type="button"
        class="toolbar-btn"
        class:active={isHighlight}
        onclick={toggleHighlight}
        title="Highlight"
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M15.243 4.515l-6.738 6.737-.707 2.121-1.04 1.041 2.828 2.829 1.04-1.041 2.122-.707 6.737-6.738-4.242-4.242zm6.364 3.535a1 1 0 0 1 0 1.414l-7.779 7.779-2.12.707-1.415 1.414a1 1 0 0 1-1.414 0l-4.243-4.243a1 1 0 0 1 0-1.414l1.414-1.414.707-2.121 7.779-7.779a1 1 0 0 1 1.414 0l5.657 5.657zm-6.364-.707l1.414 1.414-4.95 4.95-1.414-1.414 4.95-4.95zM4.283 16.89l2.828 2.829-1.414 1.414-4.243-1.414 2.828-2.829z"
          />
        </svg>
      </button>

      <!-- Color picker for text -->
      {#if colors.length > 0}
        <div class="toolbar-separator"></div>
        <div class="toolbar-colors">
          {#each colors as colorValue}
            <button
              type="button"
              class="color-btn"
              style:background-color={colorValue.startsWith('--') ? `var(${colorValue})` : colorValue}
              onclick={() => setColor(colorValue.startsWith('--') ? `var(${colorValue})` : colorValue)}
              title="Set color"
            ></button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .tiptap-wrapper {
    color: var(--ve-color);
    background: transparent;
    padding: 0.5rem 0.75em;
    line-height: 1.25rem;
    border-radius: 0.2rem;
    display: block;
    width: 100%;
    border: solid 1px var(--ve-field-border);
    box-shadow: var(--ve-field-shadow);
    outline: none;
    position: relative;
  }

  .tiptap-wrapper.focused {
    border-color: var(--ve-primary);
    box-shadow: 0 0 0 0.25rem rgb(23 113 230 / 25%);
  }

  .tiptap-editor :global(.ProseMirror) {
    outline: none;
    min-height: 2em;
  }

  .tiptap-editor :global(p),
  .tiptap-editor :global(ul),
  .tiptap-editor :global(ol),
  .tiptap-editor :global(h2),
  .tiptap-editor :global(h3),
  .tiptap-editor :global(h4),
  .tiptap-editor :global(h5),
  .tiptap-editor :global(h1) {
    margin: 0 0 1em 0;
  }

  .tiptap-editor :global(li p) {
    margin: 0;
  }

  .tiptap-editor :global(.ProseMirror > *:last-child) {
    margin: 0;
  }

  .tiptap-toolbar {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-8px);
    background-color: #444;
    color: #fff;
    border-radius: 8px;
    padding: 0.5em;
    display: flex;
    align-items: center;
    gap: 0.25em;
    box-shadow:
      rgba(0, 0, 0, 0.1) 0 10px 15px -3px,
      rgba(0, 0, 0, 0.05) 0 4px 6px -2px;
    z-index: 1000;
    animation: slideDown 0.2s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-12px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(-8px);
    }
  }

  .toolbar-btn {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 0.5em;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .toolbar-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .toolbar-btn.active {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .toolbar-separator {
    width: 1px;
    height: 1.5em;
    background-color: rgba(255, 255, 255, 0.2);
    margin: 0 0.25em;
  }

  .toolbar-colors {
    display: flex;
    gap: 0.25em;
  }

  .color-btn {
    width: 20px;
    height: 20px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    cursor: pointer;
    padding: 0;
  }

  .color-btn:hover {
    border-color: #fff;
    transform: scale(1.1);
  }
</style>
