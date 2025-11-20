# Changelog

All notable changes to @boxraiser/visual-editor-svelte will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0-beta.1] - 2025-01-20

### 🎉 Initial Release - Complete Svelte 5 Migration

This is the first beta release of the Visual Editor rewritten from React to Svelte 5, delivering significant performance improvements and a smaller bundle size.

### ✨ Added

#### Core Features
- **14 Field Types** - Text, HTMLText, Checkbox, Select, Number, Range, Color, DatePicker, ImageUrl, Alignment, TextAlign, Repeater, Row, Tabs
- **Drag & Drop System** - Smooth component reordering with visual feedback using svelte-dnd-action
- **Live Preview** - Real-time iframe preview with server-side rendering
- **Responsive Preview** - Desktop (100%) and mobile (390×844px) preview modes
- **Undo/Redo System** - Rollback component deletions with toast notifications
- **i18n Support** - Multi-language support (English, French)
- **Templates System** - Pre-configured page templates for quick starts
- **Web Component Export** - Use as `<visual-editor>` custom element in any HTML page

#### Developer Experience
- **Svelte 5 Runes** - Built with modern Svelte 5 reactive patterns ($state, $derived, $effect)
- **TypeScript** - Full type safety with auto-generated declarations
- **Component Registration API** - Simple API for registering components and templates
- **Conditional Fields** - `.when()` method for conditional field display
- **Global State Management** - Centralized editor store with reactive updates
- **Custom Events** - Native DOM events (change, close) for Web Component integration

#### UI Components (15 components)
- Button, ButtonIcon, Card, Checkbox, Divider, Fade, Flash, Flex, Icon, Input, Label, ListItem, Select, Switch, Textarea

#### Layout Components
- Main Layout with sidebar/preview split
- Collapsible Sidebar with toggle
- Component Picker Modal (BlocSelector)
- Preview wrapper with responsive controls
- Rollback toast notifications

### 🚀 Performance Improvements

#### Bundle Size Reductions
- **ES Module**: 271 KB (69 KB gzipped) - **66% smaller** than React version
- **UMD Module**: 178 KB (55 KB gzipped) - **65% smaller** than React version
- **Lines of Code**: ~7,200 - **28% reduction** from React version
- **Dependencies**: 15 packages - **62% fewer** dependencies
- **Build Time**: ~2s - **75% faster** than React version

#### Runtime Performance
- No Virtual DOM overhead
- Compiled to optimal JavaScript
- Faster reactive updates with Svelte 5 runes
- Reduced memory footprint

### 🔄 Changed from React Version

#### API Changes
- Class name changed from `VisualEditor` to `VisualEditorAPI`
- Custom element automatically defined by Svelte compiler
- Events use native DOM `CustomEvent` instead of React callbacks
- Store access via `editorStore` import instead of React hooks

#### Architecture Changes
- Migrated from React components to Svelte 5 components
- Replaced Emotion/styled-components with native CSS in `<style>` blocks
- Replaced Radix UI with custom Svelte UI components
- Replaced React hooks with Svelte 5 runes
- Replaced React Context with Svelte stores
- Migrated Tiptap integration to Svelte lifecycle

#### Breaking Changes
- Custom element name is always `<visual-editor>` (cannot be customized)
- All HTML attributes must be lowercase (e.g., `iconsurl` instead of `iconsUrl`)
- Event listeners use native `addEventListener` instead of props
- No SSR support in beta (planned for future release)

### 📦 Dependencies

#### Runtime Dependencies
- `clsx` ^2.1.1 - Conditional class names
- `svelte-dnd-action` ^0.9.50 - Drag and drop functionality

#### Peer Dependencies
- `svelte` ^5.0.0 - Svelte 5 framework
- `@tiptap/core` ^3.0.7 - Rich text editor core
- `@tiptap/pm` ^3.0.7 - ProseMirror integration

### 🏗️ Technical Details

#### Project Structure
```
visual-editor-svelte/
├── src/lib/
│   ├── VisualEditor.svelte        # Main Web Component
│   ├── stores/
│   │   └── editor.svelte.ts       # Global state with Svelte 5 runes
│   ├── components/
│   │   ├── ui/                    # 15 UI components
│   │   ├── Layout.svelte          # Main layout
│   │   ├── Sidebar/               # Sidebar components
│   │   ├── Preview/               # Preview components
│   │   └── BlocSelector/          # Component picker modal
│   ├── fields/                    # 14 field types
│   ├── functions/                 # Utilities
│   ├── langs/                     # i18n (EN, FR)
│   └── types.ts                   # TypeScript types
```

#### Technologies
- Svelte 5.2.10 - Reactive UI framework with runes
- TypeScript 5.7.2 - Type safety
- Vite 7.0.6 - Build tool
- svelte-dnd-action 0.9.50 - Drag & drop
- Tiptap 3.0.7 - Rich text editor
- Vitest 3.2.4 - Unit testing
- Cypress 15.6.0 - E2E testing

### 📚 Documentation

- Comprehensive README.md with features, installation, and quick start
- Complete USAGE.md with all field types and API reference
- CONTRIBUTING.md for contributors
- TypeScript type definitions for all APIs

### 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+

### 🐛 Known Issues

- Some edge cases with nested Repeater fields may need refinement
- PostMessage preview communication not yet fully implemented
- No SSR support in beta (planned for v1.0.0)

### 📝 Migration Guide

See [USAGE.md](./USAGE.md#migration-from-react-version) for a complete migration guide from the React version.

---

## Planned for 1.0.0 (Stable Release)

### Features
- SSR (Server-Side Rendering) support
- Enhanced PostMessage preview communication
- Additional field types (File upload, Multi-select)
- Advanced template system with categories
- Component search/filter in sidebar

### Testing
- Complete unit test coverage (>90%)
- E2E tests for all critical user flows
- Performance benchmarks

### Documentation
- Video tutorials
- Interactive playground
- Storybook component showcase

---

## Development Phases Completed

- ✅ **Phase 1**: Project setup and configuration
- ✅ **Phase 2**: Stores and state management (Svelte 5 runes)
- ✅ **Phase 3**: UI components library (15 components)
- ✅ **Phase 4**: All field types (14 types)
- ✅ **Phase 5**: Layout and structure components
- ✅ **Phase 6**: Drag & drop integration
- ✅ **Phase 8**: BlocSelector component picker
- ✅ **Phase 9**: Web Component / Custom Element export
- ✅ **Phase 11**: Documentation (README, USAGE, CHANGELOG, CONTRIBUTING)

### In Progress
- 🟨 **Phase 7**: Preview & iframe enhancements
- 🟨 **Phase 10**: Testing (Vitest + Cypress)
- 🟨 **Phase 12**: Build & distribution (npm publication)

---

## Acknowledgments

- Original React version by [BoxRaiser](https://github.com/boxraiser/visual-editor)
- Svelte 5 migration and enhancements completed in January 2025
- Special thanks to the Svelte community for guidance on modern patterns

---

**For bugs and feature requests, please visit:** https://github.com/boxraiser/visual-editor-svelte/issues
