# Claude Development Guidelines

This document provides comprehensive development guidelines for working on this Next.js project. These standards ensure consistency, maintainability, and optimal performance.

## TypeScript Standards

**Priority: Critical - Always Apply**

Apply these standards to all TypeScript files in the project. Ensure strict typing to prevent runtime errors and improve code readability.

### Requirements

- **Strict Mode**: Always use strict TypeScript configuration
- **No "any" types**: Never use `any`. Use `unknown` if type is truly unknown, then narrow it
- **Readonly arrays**: Use `readonly` for data arrays that shouldn't be mutated (e.g., `readonly string[]`)
- **Type definitions**: All types should be defined in `types/` directory
- **Type imports**: Use `type` keyword for type-only imports: `import type { SomeType } from "..."`
- **Unused variables**: Enable `noUnusedLocals` and `noUnusedParameters` in tsconfig

### Examples

```typescript
// Good: Using readonly arrays
export interface Project {
  technologies: readonly string[];
}

// Good: Type-only import
import type { Project } from "@/types";

// Bad: Using 'any'
function processData(data: any) {
  return data;
}

// Good: Using 'unknown' and narrowing
function processData(data: unknown) {
  if (typeof data === 'string') {
    // data is now narrowed to string
    return data.toUpperCase();
  }
  throw new Error('Invalid data type');
}
```

## Component Patterns

Differentiate between server and client components to optimize performance and maintainability. Use Server Components by default, and only use Client Components when interactivity is required.

### Server Components (Default)

- Use Server Components by default for data fetching
- Server Components are async and can directly call Server Actions
- No `"use client"` directive needed

### Client Components

- Only use `"use client"` when needed (interactivity, hooks, browser APIs)
- Mark the component with `"use client"` directive at the top

### Component Organization

- Each component should have a JSDoc comment describing its purpose
- Export components from `index.ts` files for cleaner imports
- Use named exports, not default exports for components

### Component Props

- Always define explicit TypeScript interfaces for component props
- Use descriptive prop names

### Reusable Components

- Always prefer reusable Components over raw HTML
- If a Component doesn't exist for the desired use case, consider adding one

### Examples

```typescript
// Server Component: Fetches data at build/request time
import { getAbout } from "@/app/actions";

/**
 * About Section Component
 * Displays introduction, core technologies, specialties, achievements, and highlights
 */
export async function AboutSection() {
  const aboutData = await getAbout();
  return (
    <section id="about">
      {/* Component implementation */}
    </section>
  );
}
```

```typescript
// Client Component: Handles user interactions
"use client";

import { useState } from "react";
import type { Project } from "@/types";

/**
 * Project Card Component
 * Displays project information with image, title, description, technologies, and links
 */
interface ProjectCardProps {
  project: Project;
  onImageClick: (project: Project) => void;
}

export function ProjectCard({ project, onImageClick }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  // Component implementation
}
```

## Data Fetching Patterns

Utilize Server Actions for data fetching to maintain a clear separation between server and client logic. All data loading should be server-side to optimize performance and security.

### Server Actions

- All Server Actions must be in `app/actions/` directory
- Must include `"use server"` directive at the top
- Should handle errors gracefully with try/catch
- Return typed data using interfaces from `types/portfolio.ts`

### Data Loading

- Use `lib/data-loader.ts` for reading JSON files
- Data loaders are server-only (use in Server Components or Server Actions)
- All data should be typed with interfaces from `types/portfolio.ts`

### Examples

```typescript
// Server Action: Fetches about section data
"use server";

import { getAboutData } from "@/lib/data-loader";
import type { AboutData } from "@/types";

/**
 * Server Action to fetch about section data
 * Currently reads from JSON file, can be migrated to Supabase later
 */
export async function getAbout(): Promise<AboutData> {
  try {
    return await getAboutData();
  } catch (error) {
    console.error("Error fetching about data:", error);
    throw new Error("Failed to fetch about data");
  }
}
```

```typescript
// Server Component: Calls Server Action
import { getAbout } from "@/app/actions";

export async function AboutSection() {
  const aboutData = await getAbout();
  return <section>{/* Render aboutData */}</section>;
}
```

## Styling Guidelines

Utilize Tailwind CSS for styling to ensure a consistent and efficient design system. Follow the established color palette and spacing conventions throughout the project.

### Tailwind CSS

- Use Tailwind utility classes exclusively
- Use the `cn()` utility from `lib/utils.ts` for conditional classes
- Avoid custom CSS unless necessary for specific use cases

### Responsive Design

- Use responsive prefixes: `md:`, `lg:`
- Ensure all layouts work on mobile, tablet, and desktop
- Test breakpoints: mobile (< 768px), tablet (768px - 1024px), desktop (> 1024px)

### Component Styling

- Use consistent spacing: `p-4`, `p-6`, `p-8` for padding
- Use consistent border radius: `rounded-[10px]` for cards
- Use consistent gaps: `gap-4`, `gap-6`, `gap-8`

### Examples

```typescript
import { cn } from "@/lib/utils";

// Conditional classes with cn()
<div className={cn(
  "rounded-[10px] bg-white p-6",
  isActive && "bg-[#f8f8f8]"
)}>
  Content
</div>

// Responsive design
<div className="px-4 py-12 md:px-8 md:py-16 lg:px-[176px] lg:py-[204px]">
  Content
</div>
```

## Accessibility (A11Y) Requirements

Adhere to accessibility standards (WCAG 2.1 Level AA) to make the application usable for all users, including those using assistive technologies.

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Use proper `tabIndex` values
- Handle `Enter` and `Space` keys for clickable elements
- Maintain logical tab order

### ARIA Labels

- All images must have descriptive `alt` text
- Use `aria-label` for interactive elements without visible text
- Use `aria-labelledby` for sections with headings
- Use `aria-hidden="true"` for decorative elements

### Semantic HTML

- Use proper HTML5 semantic elements: `<section>`, `<nav>`, `<main>`, `<header>`, `<footer>`
- Use heading hierarchy correctly (h1, h2, h3, etc.)
- Include skip-to-content link in layout

### Focus Management

- Ensure focus indicators are visible
- Maintain logical tab order

### Examples

```typescript
// Keyboard navigation
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }}
  aria-label="View project images"
>
  {/* Content */}
</div>

// Semantic HTML with ARIA
<section id="about" aria-labelledby="about-heading">
  <h2 id="about-heading">About Me</h2>
  {/* Content */}
</section>

// Image with alt text
import Image from "next/image";

<Image
  src={imageSrc}
  alt="Project screenshot showing the dashboard interface"
  fill
/>
```

## Summary Checklist

When working on this project, ensure you:

- ✅ Use strict TypeScript (no `any` types)
- ✅ Define all types in `types/` directory
- ✅ Use Server Components by default
- ✅ Only use `"use client"` when interactivity is needed
- ✅ Place Server Actions in `app/actions/` directory
- ✅ Use Tailwind CSS for all styling
- ✅ Follow accessibility standards (WCAG 2.1 Level AA)
- ✅ Add JSDoc comments to components
- ✅ Use semantic HTML and proper ARIA labels
- ✅ Test responsive design across all breakpoints
