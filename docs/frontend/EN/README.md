# Frontend Architecture

## Overview

Single-page application built with **Vanilla JavaScript (ES Modules)**, **Vite** as the build tool, and **Tailwind CSS** for styling. No frameworks — the architecture follows a modular pattern with clear separation of concerns.

## Directory Structure

```
src/
├── assets/            # Static resources (images, icons, SVGs)
├── components/
│   ├── ui/            # Generic reusable UI primitives
│   │                   # (Button, Input, Modal, Badge, Spinner, etc.)
│   └── domain/        # Domain-specific composed components
│                       # (ReportCard, VotingWidget, CommentList, etc.)
├── layout/            # App shell components
│                       # (Header, Footer, Sidebar, MainLayout)
├── pages/             # One directory per route/view
│   ├── home/          # Landing / dashboard page
│   ├── reports/       # Report listing, creation, detail
│   ├── profile/       # User profile
│   ├── admin/         # Admin dashboard and report management
│   └── auth/          # Login and registration
├── router/            # Hash-based SPA client router
│                       # Parses URL, loads matching page, handles guards
├── services/          # API communication layer
│                       # Each file encapsulates a backend resource
│                       # (api.js base instance, auth.service.js, reports.service.js, etc.)
├── store/             # Global reactive state (Proxy-based pattern)
│                       # Centralized state with subscription/re-render logic
├── styles/            # Global CSS and Tailwind entry point
│   └── index.css      # Tailwind directives and global resets
├── utils/             # Pure helper functions
│                       # (date formatting, validators, constants, etc.)
└── main.js            # Application entry point
                        # Initializes router, mounts app shell
```

## Data Flow

```
main.js
  └─> router/
        └─> pages/         (loads page module)
              └─> components/   (renders UI)
                    └─> services/    (HTTP calls to backend)
                          └─> store/  (updates reactive state)
                                └─> views re-render on state change
```

## Layer Responsibilities

### `router/`
- Listens to `hashchange` events
- Matches URL patterns to page modules
- Supports route guards (e.g., redirect if not authenticated)
- Lazy-loads page modules on demand

### `pages/`
- One module per route
- Orchestrates components, services, and store for that view
- Owns the page lifecycle (on mount, on destroy)

### `components/`
- **`ui/`**: Pure presentational components. Receive props, render HTML. No business logic.
- **`domain/`**: Compose UI components with domain data. May call services or read from store.

### `services/`
- Single responsibility: communicate with the backend API
- Return parsed data or throw typed errors
- Never manipulate the DOM directly

### `store/`
- Centralized reactive state using JavaScript `Proxy`
- Each domain (auth, reports) has its own store slice
- Components subscribe to slices; store notifies on change

### `layout/`
- Defines the app shell: header, navigation, main content area
- Wraps page content consistently across routes

### `utils/`
- Pure functions with zero side effects
- Shared helpers used across all layers

## Conventions

- **Files**: PascalCase for components (`Button.js`), camelCase for services/utils (`auth.service.js`)
- **Exports**: Default export for components/pages, named exports for services/utils
- **Imports**: Use `@` path aliases (e.g., `import Button from '@components/ui/Button'`)
- **DOM**: Never use `document.querySelector` inside components — receive container as argument
- **State**: Components read from store, never write directly — use service functions
