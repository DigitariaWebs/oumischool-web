# AGENTS.md - Web Development Guidelines

## Project Overview

This is a **Next.js 16** application with **React 19**, **TypeScript**, and **Tailwind CSS v4**. The project uses **Bun** as the package manager.

## Build / Lint / Test Commands

```bash
# Development
bun run dev              # Start Next.js development server

# Build
bun run build           # Production build
bun run start           # Start production server

# Linting & Formatting
bun run lint            # Run ESLint
bun run format:check    # Check formatting without writing
bun run prune           # Run knip to detect unused code
```

> **Note:** Do not write tests unless explicitly requested by the user.

## Code Style Guidelines

### General Conventions

- **Package Manager**: Always use `bun` (not npm/yarn/pnpm)
- **Path Alias**: Use `@/` for imports (e.g., `@/lib/utils` maps to `src/lib/utils.ts`)
- **No Comments**: Do not add comments unless explaining complex business logic
- **Strict TypeScript**: `strict: true` is enabled in tsconfig.json

### Imports

- Sort imports automatically via `@trivago/prettier-plugin-sort-imports` and Prettier
- Group order: React imports, then external libs, then internal `@/` imports

```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";
```

### Formatting

- Run `bun run format:check` to verify formatting before committing
- Tailwind classes are sorted automatically via `prettier-plugin-tailwindcss`
- Use double quotes for strings

### Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`, `DataTable.tsx`)
- **Hooks**: camelCase starting with `use` (e.g., `useAuth`, `useStudents`)
- **Files**: kebab-case for utilities (e.g., `api-client.ts`, `utils.ts`)
- **Interfaces/Types**: PascalCase, avoid `I` prefix unless necessary
- **Variables/Functions**: camelCase

### Component Patterns

#### UI Components (`src/components/ui/`)

1. Use `class-variance-authority` (CVA) for variant management
2. Use `tailwind-merge` + `clsx` via `cn()` utility for class merging
3. Use Radix UI primitives for interactive components
4. Export both component and variants

```typescript
const buttonVariants = cva("base classes", {
  variants: { variant: {...}, size: {...} },
  defaultVariants: { variant: "default", size: "default" },
});

function Button({ className, variant, size, ...props }: ButtonProps) {
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
export { Button, buttonVariants };
```

#### Page Components (`src/app/`)

- Use Next.js App Router conventions
- Server Components by default, add `'use client'` only when needed
- Route groups use `(folder)` naming (e.g., `(auth)`)

### State Management

- **Server State**: TanStack Query (`@tanstack/react-query`)
- **Client State**: Zustand (`zustand`)
- Store files in `src/store/` (e.g., `src/store/settings.ts`)

### API Patterns (`src/lib/api-client.ts`)

- Use the exported `api` client: `api.get()`, `api.post()`, `api.put()`, `api.del()`
- Response wrapper pattern: expect `{ success: boolean, data: T, error?: ... }`
- Auth tokens stored in localStorage as `auth_token` and `refresh_token`

### Error Handling

- API errors: throw with message from `json.error.message` or `Request failed: {status}`
- Use try/catch for async operations in components
- Display errors via UI components (toast, inline error message)

### Forms

- Use React Hook Form (`react-hook-form`) with Zod validation
- Use `@hookform/resolvers` to integrate Zod schemas
- Create form components in `src/components/ui/form.tsx` following Radix patterns

### Tailwind CSS v4

- Classes are version 4 syntax (no `config.js` - uses CSS variables)
- Use `@theme` directive in CSS for custom tokens
- Apply classes directly in JSX; Prettier sorts them automatically

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── (auth)/          # Auth route group
│   └── dashboard/       # Protected dashboard pages
├── components/
│   └── ui/              # Reusable UI components
├── hooks/               # TanStack Query hooks (per-entity folders)
├── lib/
│   ├── api-client.ts    # Fetch wrapper
│   ├── utils.ts         # cn(), formatCurrency()
│   └── data/            # Static data
└── store/               # Zustand stores
```

## Pre-commit Hooks

Husky and lint-staged are configured:

- Runs ESLint fix + Prettier on staged `.ts`/`.tsx` files
- Runs Prettier on `.json`, `.md`, `.css` files
