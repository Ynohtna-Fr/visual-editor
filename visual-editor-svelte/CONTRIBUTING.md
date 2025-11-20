# Contributing to Visual Editor Svelte

Thank you for your interest in contributing to the Visual Editor Svelte project! This document provides guidelines and instructions for contributing.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

---

## Code of Conduct

This project adheres to a code of conduct that all contributors are expected to follow:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Accept responsibility for mistakes
- Prioritize the community's best interests

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher (v22.17.1 recommended)
- **npm**: v9.0.0 or higher
- **Git**: Latest stable version
- **PHP**: v7.4+ (for E2E tests with preview server)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR-USERNAME/visual-editor-svelte.git
cd visual-editor-svelte
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/boxraiser/visual-editor-svelte.git
```

---

## Development Setup

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

This starts the Vite development server at `http://localhost:5173`

### Build the Library

```bash
npm run build
```

This creates:
1. Vite build output in `.svelte-kit/output`
2. Package output in `dist/` via `svelte-package`

### Run Tests

```bash
# Run all tests (unit + E2E)
npm test

# Unit tests only
npm run test:unit

# Unit tests in watch mode
npm run test:unit:watch

# E2E tests
npm run test:e2e

# E2E tests in watch mode (Cypress UI)
npm run test:e2e:watch
```

### Type Checking

```bash
# One-time check
npm run check

# Watch mode
npm run check:watch
```

### Code Formatting

```bash
# Format all files
npm run format

# Check formatting without modifying
npm run lint
```

---

## Project Structure

```
visual-editor-svelte/
├── src/
│   ├── lib/                       # Library source code
│   │   ├── VisualEditor.svelte    # Main Web Component
│   │   ├── index.ts               # Public API exports
│   │   ├── stores/
│   │   │   └── editor.svelte.ts   # Global state (Svelte 5 runes)
│   │   ├── components/
│   │   │   ├── ui/                # 15 UI components
│   │   │   ├── Layout.svelte
│   │   │   ├── Sidebar/
│   │   │   ├── Preview/
│   │   │   └── BlocSelector/
│   │   ├── fields/                # 14 field types
│   │   ├── functions/             # Utility functions
│   │   ├── langs/                 # i18n translations
│   │   └── types.ts               # TypeScript types
│   └── routes/                    # Development test pages
├── tests/
│   ├── unit/                      # Vitest unit tests
│   └── e2e/                       # Cypress E2E tests
├── dist/                          # Build output (gitignored)
├── package.json
├── vite.config.ts
├── svelte.config.js
├── tsconfig.json
└── README.md
```

---

## Development Workflow

### Creating a New Branch

Always create a feature branch from the latest `main`:

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions/fixes

### Making Changes

1. **Write code** following the [Coding Standards](#coding-standards)
2. **Add tests** for new functionality
3. **Update documentation** if needed (README.md, USAGE.md, JSDoc comments)
4. **Run tests** to ensure nothing breaks
5. **Format code** with `npm run format`
6. **Type check** with `npm run check`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
git commit -m "feat(fields): add MultiSelect field type"
git commit -m "fix(drag-drop): prevent dragging while editing"
git commit -m "docs(readme): update installation instructions"
git commit -m "test(repeater): add unit tests for nested repeaters"
```

---

## Coding Standards

### Svelte 5 Patterns

Use modern Svelte 5 runes:

```svelte
<script lang="ts">
  // Props
  let { value, onchange }: Props = $props()

  // State
  let count = $state(0)

  // Derived state
  let doubled = $derived(count * 2)

  // Effects
  $effect(() => {
    console.log('Count changed:', count)
  })
</script>
```

### TypeScript

- Always use TypeScript for new files
- Define interfaces for component props
- Export types from `types.ts` when reusable
- Avoid `any` - use `unknown` if type is truly unknown

```typescript
interface Props {
  value: string
  optional?: number
  onchange?: (value: string) => void
}
```

### Component Structure

Organize component files in this order:

```svelte
<script lang="ts">
  // 1. Imports
  import { onMount } from 'svelte'
  import Button from './ui/Button.svelte'

  // 2. Types/Interfaces
  interface Props {
    // ...
  }

  // 3. Props
  let { value, onchange }: Props = $props()

  // 4. State
  let localState = $state('')

  // 5. Derived values
  let computed = $derived(localState.toUpperCase())

  // 6. Functions
  function handleClick() {
    // ...
  }

  // 7. Lifecycle / Effects
  $effect(() => {
    // ...
  })
</script>

<!-- 8. Template -->
<div class="component">
  <!-- markup -->
</div>

<!-- 9. Styles -->
<style>
  .component {
    /* styles */
  }
</style>
```

### Styling

- Use scoped `<style>` blocks in components
- Use CSS custom properties for theming (prefix with `--ve-`)
- Follow BEM-like naming for classes
- Avoid inline styles unless dynamic

```svelte
<style>
  .ve-button {
    background: var(--ve-primary);
  }

  .ve-button--disabled {
    opacity: 0.5;
  }
</style>
```

### Naming Conventions

- **Components**: PascalCase (`Button.svelte`, `SidebarBloc.svelte`)
- **Files**: kebab-case (`editor.svelte.ts`, `index.ts`)
- **Variables**: camelCase (`editorStore`, `focusedIndex`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ITEMS`)
- **Types/Interfaces**: PascalCase (`EditorComponentData`)

---

## Testing

### Unit Tests (Vitest)

Create unit tests for:
- Utility functions
- Store logic
- Field type logic
- Component behavior (where appropriate)

Example:

```typescript
// tests/unit/functions/indexify.test.ts
import { describe, it, expect } from 'vitest'
import { indexify } from '$lib/functions/indexify'

describe('indexify', () => {
  it('should add unique IDs to items', () => {
    const input = [{ _name: 'hero' }]
    const output = indexify(input)
    expect(output[0]._id).toBeDefined()
  })
})
```

### E2E Tests (Cypress)

Create E2E tests for:
- User workflows (add component, edit, delete, undo)
- Drag and drop
- Preview updates
- Form submission

Example:

```typescript
// tests/e2e/add-component.cy.ts
describe('Add Component', () => {
  it('should add a component when clicking sidebar item', () => {
    cy.visit('/')
    cy.get('[data-cy="sidebar-bloc-hero"]').click()
    cy.get('[data-cy="editor-component"]').should('have.length', 1)
  })
})
```

### Test Coverage

Aim for:
- **>80% coverage** for utility functions
- **>60% coverage** for components
- **100% coverage** for critical paths (data manipulation, undo/redo)

---

## Submitting Changes

### Pull Request Process

1. **Update your branch** with the latest upstream changes:

```bash
git checkout main
git pull upstream main
git checkout your-feature-branch
git rebase main
```

2. **Push your branch** to your fork:

```bash
git push origin your-feature-branch
```

3. **Create a Pull Request** on GitHub:
   - Use a clear, descriptive title
   - Reference any related issues (`Fixes #123`)
   - Describe what changes you made and why
   - Include screenshots for UI changes
   - Ensure all CI checks pass

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Code formatted (`npm run format`)
- [ ] Type checking passes (`npm run check`)
- [ ] All tests pass (`npm test`)

## Related Issues
Fixes #(issue number)

## Screenshots (if applicable)
```

### Review Process

- All PRs require at least one approval
- Address review feedback promptly
- Keep PRs focused (one feature/fix per PR)
- Avoid large PRs (>500 lines changed)

---

## Reporting Bugs

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Try the latest version** to see if it's already fixed
3. **Reproduce the issue** in a clean environment

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. ...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS 14.2]
- Browser: [e.g., Chrome 120]
- Node.js: [e.g., v20.10.0]
- Package version: [e.g., 1.0.0-beta.1]

## Additional Context
Screenshots, error messages, etc.
```

---

## Feature Requests

We welcome feature requests! Please:

1. **Check existing issues** to avoid duplicates
2. **Describe the use case** - why is this feature needed?
3. **Propose a solution** - how should it work?
4. **Consider alternatives** - are there other ways to solve this?

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Use Case
Why is this feature needed? What problem does it solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other ways to solve this problem

## Additional Context
Mockups, examples from other tools, etc.
```

---

## Questions?

- **GitHub Discussions**: For questions and general discussion
- **GitHub Issues**: For bugs and feature requests
- **Email**: support@boxraiser.com

---

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Visual Editor Svelte! 🎉**
