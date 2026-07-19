# Arquitectura del Frontend

## Visión General

Aplicación de una sola página construida con **JavaScript Vanilla (ES Modules)**, **Vite** como empaquetador y **Tailwind CSS** para estilos. Sin frameworks — la arquitectura sigue un patrón modular con separación clara de responsabilidades.

## Estructura de Directorios

```
src/
├── core/               # Lógica pura, cero DOM
│   ├── api.js          # Cliente HTTP con token getter configurable
│   ├── router.js       # Ruteo genérico (no usado — ver src/router/)
│   ├── store.js        # Fábrica de estado reactivo (createStore via Proxy)
│   ├── validators.js   # Validación de formularios
│   └── helpers.js      # Utilidades puras (formatDate, escapeHtml, sesión, navigateTo)
│
├── services/           # Capa de API — un módulo por dominio
│   ├── auth.service.js
│   ├── reports.service.js
│   ├── categories.service.js
│   ├── stats.service.js
│   ├── announcements.service.js
│   └── attachments.service.js
│
├── components/         # Solo presentacionales. Sin API calls. Sin lógica de negocio.
│   ├── ui/             # Primitivas de UI genéricas (Modal, DataTable, Badge, FileUpload, etc.)
│   ├── domain/         # Componentes compuestos de dominio (VotingWidget, CategoryPicker)
│   ├── charts/         # Componentes Chart.js (PieChart, BarChart, LineChart, chartRegistry)
│   ├── forms/          # Helper de envío de formularios (FormHelper)
│   └── profile/        # Sub-componentes de perfil (PersonalInfo, ProfileCard, ProfileReports)
│
├── pages/              # Un directorio por ruta. Cada página orquesta: arma HTML, llama services, lee store.
│   ├── landing/        # Página pública de aterrizaje
│   ├── auth/           # Login / Register (AuthPage, LoginForm, RegisterForm)
│   ├── home/           # Dashboard principal (autenticado)
│   ├── reports/        # Listado, creación, detalle, éxito
│   ├── profile/        # Perfil de usuario
│   ├── stats/          # Estadísticas y gráficos
│   ├── admin/          # Panel de administración
│   ├── announcements/  # Comunicados públicos
│   ├── NotFoundPage.js
│   └── AccessDeniedPage.js
│
├── layouts/            # Shell de la app — Header, Sidebar, Footer
│
├── router/             # Router SPA: match path → render page, guards
│
├── store/              # Estado reactivo (auth.store.js)
│
├── styles/             # CSS global (punto de entrada Tailwind, estilos de componentes)
│
└── main.js             # Entry point: configura API, ejecuta router
```

## Flujo de Datos

```
main.js
  └─> router/              (match path → delegate)
        └─> pages/         (orquestan: HTML + services + store)
              ├─> components/   (renderizan UI, sin efectos secundarios)
              └─> services/     (llamadas HTTP al backend)
                    └─> core/api.js  (cliente HTTP de bajo nivel)
```

## Responsabilidades por Capa

### `core/`
- Lógica pura sin manipulación del DOM
- `api.js` — cliente HTTP configurable (token getter inyectado via `configureApi`)
- `store.js` — fábrica `createStore` usando `Proxy` de JavaScript para reactividad
- `validators.js` — funciones de validación puras que retornan `{ isValid, errors }`
- `helpers.js` — `formatDate`, `escapeHtml`, manejo de sesión, `navigateTo`

### `router/`
- Escucha eventos `popstate`
- Guards de ruta: redirige usuarios anónimos, bloquea rutas no-admin
- Delega el renderizado a `pages/` via el helper `render(app, view, init?)`
- El mapa de rutas es un array declarativo: entradas `{ path, view, init }` + patrones regex

### `pages/`
- Un módulo (o directorio) por ruta
- Cada página exporta una función `XxxPageView()` que retorna HTML, y opcionalmente `initXxxPage()` para binding de eventos
- Orquesta: construye el template HTML completo (layouts + componentes), llama servicios, lee del store
- Sin lógica de negocio en el template — toda la lógica vive en funciones `init`

### `components/`
- Puramente presentacionales: reciben datos, retornan HTML
- Sin API calls, sin `document.querySelector`, sin lógica de negocio
- `ui/` — primitivas genéricas utilizables en cualquier lado
- `domain/` — componentes compuestos que combinan primitivas UI con conceptos de dominio
- `charts/` — wrappers de Chart.js (cada componente es dueño de un canvas y se registra con `chartRegistry`)
- Los componentes que necesitan binding de eventos exportan una función `init` separada (ej. `initVotingWidget`)

### `services/`
- Responsabilidad única: comunicarse con la API del backend
- Cada archivo encapsula un recurso de dominio
- Retornan datos procesados o lanzan errores
- Nunca manipulan el DOM

### `layouts/`
- Definen el shell de la app: `HeaderHome`, `HeaderLanding`, `SidebarHome`, `FooterLanding`
- `HeaderHome` incluye el botón de toggle del sidebar
- `SidebarHome` soporta el atributo `data-collapsed` para modo solo-iconos (impulsado por CSS `:has()`)

### `store/`
- Porciones de estado reactivo creadas con `createStore` de `core/store.js`
- `auth.store.js` contiene el usuario actual y expone...

## Convenciones

- **Archivos**: PascalCase para componentes (`Button.js`), camelCase para servicios (`auth.service.js`)
- **Exportaciones**: Named exports para todo (sin default exports)
- **Patrón de página**: `XxxPage.js` exporta `XxxPageView` (HTML) + opcionalmente `initXxxPage` (eventos)
- **Importaciones**: Usar alias `@` (`@core/helpers`, `@services/reports.service`, `@components/ui/Modal`)
- **Alias de core**: `@core`, `@layouts`, `@services`, `@store`, `@router`, `@components`
- **Sin comentarios en código**: Mantener el código auto-documentado
- **DOM**: Los componentes reciben datos como argumentos, nunca consultan el DOM ellos mismos

## Lógica de Guards del Router

El router aplica tres guards en orden:
1. **Autenticado en páginas de auth**: redirige a `/home`
2. **No autenticado en páginas protegidas**: redirige a `/` (landing)
3. **No-admin en `/admin`**: muestra `AccessDeniedPage`

Las rutas se definen como un array plano — el primer match gana. Los segmentos dinámicos usan patrones regex (ej. `/reports/:id`).
