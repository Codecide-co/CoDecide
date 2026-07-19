# Frontend Architecture

## Overview

Single-page application built with **Vanilla JavaScript (ES Modules)**, **Vite** as the build tool, and **Tailwind CSS** for styling. No frameworks — the architecture follows a modular pattern with clear separation of concerns.

## Directory Structure

```
src/
├── core/               # Pure logic, zero DOM
│   ├── api.js          # HTTP client with configurable token getter
│   ├── router.js       # Generic route matching (unused — see src/router/)
│   ├── store.js        # Reactive state factory (createStore via Proxy)
│   ├── validators.js   # Form validation logic
│   └── helpers.js      # Pure utilities (formatDate, escapeHtml, session, navigateTo)
│
├── services/           # API layer — one module per domain
│   ├── auth.service.js
│   ├── reports.service.js
│   ├── categories.service.js
│   ├── stats.service.js
│   ├── announcements.service.js
│   └── attachments.service.js
│
├── components/         # Purely presentational. No API calls. No business logic.
│   ├── ui/             # Generic UI primitives (Modal, DataTable, Badge, FileUpload, etc.)
│   ├── domain/         # Domain-specific composed components (VotingWidget, CategoryPicker)
│   ├── charts/         # Chart.js components (PieChart, BarChart, LineChart, chartRegistry)
│   ├── forms/          # Form submission helper (FormHelper)
│   └── profile/        # Profile sub-components (PersonalInfo, ProfileCard, ProfileReports)
│
├── pages/              # One directory per route. Each page orchestrates: builds HTML, calls services, reads store.
│   ├── landing/        # Public landing page
│   ├── auth/           # Login / Register (AuthPage, LoginForm, RegisterForm)
│   ├── home/           # Authenticated home dashboard
│   ├── reports/        # Listing, creation, detail, success pages
│   ├── profile/        # User profile
│   ├── stats/          # Statistics & charts
│   ├── admin/          # Admin panel
│   ├── announcements/  # Public announcements
│   ├── NotFoundPage.js
│   └── AccessDeniedPage.js
│
├── layouts/            # App shell — Header, Sidebar, Footer
│
├── router/             # SPA client router: match path → render page, guards
│
├── store/              # Reactive state slices (auth.store.js)
│
├── styles/             # Global CSS (Tailwind entry, component styles)
│
└── main.js             # Entry point: configure API, run router
```

## Data Flow

```
main.js
  └─> router/              (match path → delegate)
        └─> pages/         (orchestrate: HTML + services + store)
              ├─> components/   (render UI, no side effects)
              └─> services/     (HTTP calls to backend)
                    └─> core/api.js  (low-level HTTP client)
```

## Layer Responsibilities

### `core/`
- Pure logic with zero DOM manipulation
- `api.js` — configurable HTTP client (token getter injected via `configureApi`)
- `store.js` — `createStore` factory using JavaScript `Proxy` for reactivity
- `validators.js` — pure validation functions returning `{ isValid, errors }`
- `helpers.js` — `formatDate`, `escapeHtml`, session management, `navigateTo`

### `router/`
- Listens to `popstate` events
- Route guards: redirect anonymous users, block non-admin routes
- Delegates rendering to `pages/` via the `render(app, view, init?)` helper
- Route map is a declarative array: `{ path, view, init }` entries + regex patterns

### `pages/`
- One module (or directory) per route
- Each page exports a `XxxPageView()` function returning HTML, and optionally an `initXxxPage()` for event binding
- Orchestrates: builds the full HTML template (layouts + components), calls services, reads store
- No business logic in the template — all logic lives in `init` functions

### `components/`
- Purely presentational: receive data, return HTML
- No API calls, no `document.querySelector`, no business logic
- `ui/` — generic primitives usable anywhere
- `domain/` — composed components that combine UI primitives with domain concepts
- `charts/` — Chart.js wrappers (each component owns a canvas and registers with `chartRegistry`)
- Components that need event binding export a separate `init` function (e.g., `initVotingWidget`)

### `services/`
- Single responsibility: communicate with the backend API
- Each file encapsulates one resource domain
- Return parsed data or throw errors
- Never manipulate the DOM

### `layouts/`
- Define the app shell: `HeaderHome`, `HeaderLanding`, `SidebarHome`, `FooterLanding`
- `HeaderHome` includes the sidebar toggle button
- `SidebarHome` supports a `data-collapsed` attribute for icon-only mode (driven by CSS `:has()`)

### `store/`
- Reactive state slices created with `createStore` from `core/store.js`
- `auth.store.js` holds the current user and provide...

## Conventions

- **Files**: PascalCase for components (`Button.js`), camelCase for services (`auth.service.js`)
- **Exports**: Named exports for everything (no default exports)
- **Page pattern**: `XxxPage.js` exports `XxxPageView` (HTML) + optionally `initXxxPage` (events)
- **Imports**: Use `@` path aliases (`@core/helpers`, `@services/reports.service`, `@components/ui/Modal`)
- **Core aliases**: `@core`, `@layouts`, `@services`, `@store`, `@router`, `@components`
- **No comments in code**: Keep the code self-documenting
- **DOM**: Components receive data as arguments, never query the DOM themselves

## Route Guard Logic

The router applies three guards in order:
1. **Authenticated on auth pages**: redirect to `/home`
2. **Unauthenticated on protected pages**: redirect to `/` (landing)
3. **Non-admin on `/admin`**: show `AccessDeniedPage`

Routes are defined as a flat array — the first match wins. Dynamic segments use regex patterns (e.g., `/reports/:id`).
