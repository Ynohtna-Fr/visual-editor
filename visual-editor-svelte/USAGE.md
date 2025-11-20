# Visual Editor Svelte 5 - Usage Guide

Complete guide for using the Visual Editor as a Web Component or Svelte component.

## Table of Contents

- [Installation](#installation)
- [Quick Start (Web Component)](#quick-start-web-component)
- [Using in a Svelte Project](#using-in-a-svelte-project)
- [API Reference](#api-reference)
- [Component Registration](#component-registration)
- [Field Types](#field-types)
- [Templates](#templates)
- [Events](#events)
- [Advanced Usage](#advanced-usage)

---

## Installation

```bash
npm install @boxraiser/visual-editor-svelte
```

---

## Quick Start (Web Component)

### 1. Initialize the API and Register Components

```typescript
import { VisualEditorAPI, Text, HTMLText, Select, Checkbox, Color } from '@boxraiser/visual-editor-svelte'

// Create an instance with optional configuration
const editor = new VisualEditorAPI({
  lang: FR, // Optional: Use French translations (default is English)
  postMessagePreview: false // Optional: Enable iframe postMessage communication
})

// Register a component
editor.registerComponent('hero', {
  title: 'Hero Section',
  category: 'Content',
  fields: [
    Text({ name: 'title', label: 'Title' }),
    HTMLText({ name: 'content', label: 'Content' }),
    Checkbox({ name: 'centered', label: 'Center Text' })
  ]
})

editor.registerComponent('button', {
  title: 'Button',
  category: 'Actions',
  fields: [
    Text({ name: 'text', label: 'Button Text' }),
    Text({ name: 'url', label: 'URL' }),
    Select({
      name: 'variant',
      label: 'Style',
      options: ['primary', 'secondary', 'outline']
    }),
    Color({ name: 'bg', label: 'Background Color', default: '#007bff' })
  ]
})

// Define the custom element (optional - for clarity)
editor.defineElement()
```

### 2. Use the Web Component in HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Visual Editor Example</title>
  <script type="module" src="/path/to/your/setup.js"></script>
</head>
<body>
  <visual-editor
    value='[]'
    preview="/api/preview.php"
    iconsurl="/icons/[name].svg"
    name="page_content"
  ></visual-editor>
</body>
</html>
```

### 3. Handle Changes

```html
<script>
  const editor = document.querySelector('visual-editor')

  // Listen for changes
  editor.addEventListener('change', (event) => {
    const json = event.detail
    console.log('Content changed:', json)

    // Save to server, localStorage, etc.
    localStorage.setItem('editorData', json)
  })

  // Listen for close event
  editor.addEventListener('close', () => {
    console.log('Editor closed')
  })

  // Programmatically set value
  const savedData = localStorage.getItem('editorData')
  if (savedData) {
    editor.setAttribute('value', savedData)
  }
</script>
```

---

## Using in a Svelte Project

### As a Svelte Component

```svelte
<script lang="ts">
  import { VisualEditor } from '@boxraiser/visual-editor-svelte'
  import { editorStore } from '@boxraiser/visual-editor-svelte'

  let editorData = $state([])

  function handleClose() {
    console.log('Editor closed')
  }

  $effect(() => {
    // React to data changes
    console.log('Data updated:', editorStore.data)
  })
</script>

<VisualEditor
  value={JSON.stringify(editorData)}
  preview="/api/preview"
  iconsurl="/icons/[name].svg"
  name="content"
/>
```

---

## API Reference

### VisualEditorAPI Class

#### Constructor

```typescript
new VisualEditorAPI(options?: {
  lang?: Translation
  postMessagePreview?: boolean
})
```

**Options:**
- `lang`: Translation object (use imported `EN` or `FR`)
- `postMessagePreview`: Enable iframe postMessage communication (default: `false`)

#### Methods

##### `registerComponent(name: string, definition: EditorComponentDefinition)`

Register a new component type.

```typescript
editor.registerComponent('testimonial', {
  title: 'Testimonial',
  category: 'Social Proof',
  label: 'author', // Optional: Field to display in collapsed view
  fields: [
    Text({ name: 'author', label: 'Author Name' }),
    HTMLText({ name: 'quote', label: 'Quote' }),
    ImageUrl({ name: 'photo', label: 'Author Photo' }),
    Number({ name: 'rating', label: 'Rating', options: { min: 1, max: 5 } })
  ]
})
```

##### `registerTemplate(template: EditorComponentTemplate)`

Register a pre-configured template.

```typescript
editor.registerTemplate({
  name: 'Landing Page',
  category: 'Pages',
  data: [
    { _name: 'hero', title: 'Welcome!', content: '<p>Start here</p>' },
    { _name: 'features', items: [...] }
  ]
})
```

##### `defineElement(elementName?: string)`

Define the custom element (for API compatibility).

```typescript
editor.defineElement() // Creates <visual-editor>
```

---

## Component Registration

### Field Definition Structure

```typescript
interface EditorComponentDefinition {
  title: string // Display name in the UI
  category?: string // Category for grouping
  label?: string // Field name to use as label when collapsed
  fields: FieldDefinition[] // Array of field definitions
}
```

### Example with All Field Types

```typescript
editor.registerComponent('advanced-section', {
  title: 'Advanced Section',
  category: 'Content',
  label: 'heading',
  fields: [
    Text({ name: 'heading', label: 'Heading' }),
    HTMLText({ name: 'body', label: 'Content' }),
    Select({
      name: 'layout',
      label: 'Layout',
      options: ['full', 'sidebar-left', 'sidebar-right']
    }),
    Checkbox({ name: 'fullWidth', label: 'Full Width' }),
    Number({ name: 'columns', label: 'Columns', options: { min: 1, max: 4 } }),
    Range({ name: 'opacity', label: 'Opacity', options: { min: 0, max: 100 } }),
    Color({ name: 'bg', label: 'Background' }),
    DatePicker({ name: 'publishDate', label: 'Publish Date' }),
    ImageUrl({ name: 'bgImage', label: 'Background Image' }),
    Alignment({ name: 'align', label: 'Alignment', options: { vertical: true } }),
    TextAlign({ name: 'textAlign', label: 'Text Alignment' }),
    Repeater({
      name: 'items',
      label: 'Items',
      fields: [
        Text({ name: 'title', label: 'Item Title' }),
        Text({ name: 'description', label: 'Description' })
      ]
    }),
    Row({
      name: 'settings',
      fields: [
        Checkbox({ name: 'shadow', label: 'Shadow' }),
        Checkbox({ name: 'rounded', label: 'Rounded' })
      ]
    }),
    Tabs({
      name: 'content',
      tabs: [
        {
          name: 'general',
          label: 'General',
          fields: [Text({ name: 'title', label: 'Title' })]
        },
        {
          name: 'advanced',
          label: 'Advanced',
          fields: [Text({ name: 'customClass', label: 'CSS Class' })]
        }
      ]
    })
  ]
})
```

---

## Field Types

### Text

```typescript
Text({
  name: 'fieldName',
  label: 'Display Label',
  options: {
    multiline: false, // Enable textarea
    default: 'Default value'
  }
})
```

### HTMLText

Rich text editor with formatting options.

```typescript
HTMLText({
  name: 'content',
  label: 'Content',
  options: {
    default: '<p>Default content</p>'
  }
})
```

### Select

```typescript
Select({
  name: 'variant',
  label: 'Style',
  options: ['option1', 'option2', 'option3']
})
```

### Checkbox

```typescript
Checkbox({
  name: 'enabled',
  label: 'Enable Feature',
  options: {
    default: true
  }
})
```

### Number

```typescript
Number({
  name: 'quantity',
  label: 'Quantity',
  options: {
    min: 1,
    max: 100,
    step: 1,
    default: 1
  }
})
```

### Range

Slider input.

```typescript
Range({
  name: 'opacity',
  label: 'Opacity',
  options: {
    min: 0,
    max: 100,
    default: 100
  }
})
```

### Color

Color picker.

```typescript
Color({
  name: 'bgColor',
  label: 'Background Color',
  options: {
    default: '#ffffff'
  }
})
```

### DatePicker

```typescript
DatePicker({
  name: 'publishDate',
  label: 'Publish Date',
  options: {
    default: '2024-01-01'
  }
})
```

### ImageUrl

```typescript
ImageUrl({
  name: 'image',
  label: 'Image',
  options: {
    default: '/default-image.jpg'
  }
})
```

### Alignment

Position alignment (left, right, top, bottom).

```typescript
Alignment({
  name: 'position',
  label: 'Position',
  options: {
    vertical: true, // Enable top/bottom options
    default: 'left'
  }
})
```

### TextAlign

Text alignment (left, center, right).

```typescript
TextAlign({
  name: 'textAlign',
  label: 'Text Alignment',
  options: {
    default: 'left'
  }
})
```

### Repeater

Array of items with nested fields.

```typescript
Repeater({
  name: 'features',
  label: 'Features',
  fields: [
    Text({ name: 'title', label: 'Feature Title' }),
    HTMLText({ name: 'description', label: 'Description' }),
    ImageUrl({ name: 'icon', label: 'Icon' })
  ],
  options: {
    default: []
  }
})
```

### Row

Horizontal layout for grouping fields.

```typescript
Row({
  name: 'rowName',
  fields: [
    Checkbox({ name: 'option1', label: 'Option 1' }),
    Checkbox({ name: 'option2', label: 'Option 2' })
  ]
})
```

### Tabs

Organize fields into tabs.

```typescript
Tabs({
  name: 'tabsName',
  tabs: [
    {
      name: 'tab1',
      label: 'Tab 1',
      fields: [/* fields */]
    },
    {
      name: 'tab2',
      label: 'Tab 2',
      fields: [/* fields */]
    }
  ]
})
```

---

## Templates

Templates allow users to quickly insert pre-configured components.

```typescript
editor.registerTemplate({
  name: 'About Page',
  category: 'Pages',
  data: [
    {
      _name: 'hero',
      title: 'About Us',
      content: '<p>Welcome to our company</p>',
      centered: true
    },
    {
      _name: 'features',
      items: [
        { title: 'Mission', description: 'Our mission statement' },
        { title: 'Vision', description: 'Our vision for the future' }
      ]
    }
  ]
})
```

---

## Events

### `change`

Fired when the editor data changes.

```javascript
editor.addEventListener('change', (event) => {
  const json = event.detail
  console.log('Data:', JSON.parse(json))
})
```

### `close`

Fired when the editor is closed.

```javascript
editor.addEventListener('close', () => {
  console.log('Editor closed')
  // Hide editor, save state, etc.
})
```

---

## Advanced Usage

### Custom Element Attributes

```html
<visual-editor
  value='[]'                      <!-- JSON data -->
  preview="/api/preview"          <!-- Preview endpoint URL -->
  iconsurl="/icons/[name].svg"    <!-- Icon URL template -->
  name="content"                  <!-- Form field name -->
  hidden                          <!-- Hide editor (boolean) -->
  insertposition="end"            <!-- Insert position: 'start' or 'end' -->
  hiddencategories="Legacy;Old"   <!-- Hide categories (semicolon-separated) -->
></visual-editor>
```

### Server-Side Preview

The `preview` URL receives a POST request with the component data:

```php
// preview.php
<?php
header('Content-Type: text/html');

$data = json_decode(file_get_contents('php://input'), true);

// Render component based on $data['_name']
switch ($data['_name']) {
  case 'hero':
    echo renderHero($data);
    break;
  case 'button':
    echo renderButton($data);
    break;
}

function renderHero($data) {
  $centered = $data['centered'] ? 'text-center' : '';
  return "
    <div class='hero {$centered}'>
      <h1>{$data['title']}</h1>
      <div>{$data['content']}</div>
    </div>
  ";
}
?>
```

### Conditional Field Display

Use the `.when()` method to conditionally show fields:

```typescript
Text({ name: 'title', label: 'Title' }),
Checkbox({ name: 'hasSubtitle', label: 'Show Subtitle' }),
Text({ name: 'subtitle', label: 'Subtitle' })
  .when((data) => data.hasSubtitle === true)
```

### Accessing the Store Directly

In Svelte projects, you can access the editor store:

```typescript
import { editorStore } from '@boxraiser/visual-editor-svelte'

// Access current data
console.log(editorStore.data)

// Programmatically update data
editorStore.updateData(newValue, 'path.to.field')

// Set focus
editorStore.setFocusIndex('component-id')

// Add a component
editorStore.addBlock('hero')
```

---

## Bundle Size

The Visual Editor Svelte 5 build is significantly smaller than the React version:

- **ES Module**: ~271 KB (69 KB gzipped)
- **UMD**: ~178 KB (55 KB gzipped)

This represents a **40-60% reduction** compared to the React version, thanks to:
- No Virtual DOM overhead
- Svelte's compile-time optimizations
- Removal of Emotion/styled-components
- Removal of Radix UI dependencies

---

## Migration from React Version

If you're migrating from `@boxraiser/visual-editor` (React):

1. **API Compatibility**: The API is mostly the same
2. **Custom Element**: Use `<visual-editor>` instead of mounting React
3. **Field Definitions**: Same syntax and structure
4. **Events**: Use native DOM events instead of React callbacks

Example migration:

**Before (React):**
```javascript
const editor = new VisualEditor({ lang: FR })
editor.registerComponent('hero', { /* ... */ })
editor.defineElement()
```

**After (Svelte):**
```javascript
import { VisualEditorAPI, FR } from '@boxraiser/visual-editor-svelte'
const editor = new VisualEditorAPI({ lang: FR })
editor.registerComponent('hero', { /* ... */ })
editor.defineElement()
```

---

## Support

For issues, questions, or contributions:
- GitHub: [boxraiser/visual-editor-svelte](https://github.com/boxraiser/visual-editor-svelte)
- Documentation: [docs.boxraiser.com](https://docs.boxraiser.com)

---

## License

MIT © BoxRaiser
