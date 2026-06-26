# Arquitectura del Frontend

## Visión General

Aplicación de una sola página construida con **JavaScript Vanilla (ES Modules)**, **Vite** como empaquetador y **Tailwind CSS** para estilos. Sin frameworks — la arquitectura sigue un patrón modular con separación clara de responsabilidades.

## Estructura de Directorios

```
src/
├── assets/            # Recursos estáticos (imágenes, iconos, SVGs)
├── components/
│   ├── ui/            # Primitivas de UI reutilizables y genéricas
│   │                   # (Button, Input, Modal, Badge, Spinner, etc.)
│   └── domain/        # Componentes compuestos de dominio específico
│                       # (ReportCard, VotingWidget, CommentList, etc.)
├── layout/            # Componentes del esqueleto de la app
│                       # (Header, Footer, Sidebar, MainLayout)
├── pages/             # Un directorio por ruta/vista
│   ├── home/          # Página de inicio / dashboard
│   ├── reports/       # Listado, creación y detalle de reportes
│   ├── profile/       # Perfil de usuario
│   ├── admin/         # Panel de administración y gestión de reportes
│   └── auth/          # Inicio de sesión y registro
├── router/            # Router cliente SPA basado en hash
│                       # Analiza la URL, carga la página correspondiente, maneja guards
├── services/          # Capa de comunicación con la API
│                       # Cada archivo encapsula un recurso del backend
│                       # (api.js instancia base, auth.service.js, reports.service.js, etc.)
├── store/             # Estado global reactivo (patrón basado en Proxy)
│                       # Estado centralizado con lógica de suscripción/re-renderizado
├── styles/            # CSS global y punto de entrada de Tailwind
│   └── index.css      # Directivas de Tailwind y resets globales
├── utils/             # Funciones auxiliares puras
│                       # (formateo de fechas, validadores, constantes, etc.)
└── main.js            # Punto de entrada de la aplicación
                        # Inicializa el router, monta el esqueleto de la app
```

## Flujo de Datos

```
main.js
  └─> router/
        └─> pages/         (carga el módulo de la página)
              └─> components/   (renderiza la UI)
                    └─> services/    (llamadas HTTP al backend)
                          └─> store/  (actualiza el estado reactivo)
                                └─> las vistas se re-renderizan al cambiar el estado
```

## Responsabilidades por Capa

### `router/`
- Escucha eventos `hashchange`
- Asocia patrones de URL con módulos de página
- Soporta guards de ruta (ej. redirigir si no está autenticado)
- Carga módulos de página bajo demanda (lazy loading)

### `pages/`
- Un módulo por ruta
- Orquesta componentes, servicios y store para esa vista
- Gestiona el ciclo de vida de la página (al montar, al destruir)

### `components/`
- **`ui/`**: Componentes puramente de presentación. Reciben props, renderizan HTML. Sin lógica de negocio.
- **`domain/`**: Componen componentes UI con datos del dominio. Pueden llamar servicios o leer del store.

### `services/`
- Responsabilidad única: comunicarse con la API del backend
- Retornan datos procesados o lanzan errores tipados
- Nunca manipulan el DOM directamente

### `store/`
- Estado reactivo centralizado usando `Proxy` de JavaScript
- Cada dominio (auth, reports) tiene su propia porción del store
- Los componentes se suscriben a porciones; el store notifica al cambiar

### `layout/`
- Define el esqueleto de la app: header, navegación, área de contenido principal
- Envuelve el contenido de las páginas de forma consistente entre rutas

### `utils/`
- Funciones puras sin efectos secundarios
- Helpers compartidos usados en todas las capas

## Convenciones

- **Archivos**: PascalCase para componentes (`Button.js`), camelCase para servicios/utils (`auth.service.js`)
- **Exportaciones**: Default export para componentes/páginas, named exports para servicios/utils
- **Importaciones**: Usar alias `@` (ej. `import Button from '@components/ui/Button'`)
- **DOM**: Nunca usar `document.querySelector` dentro de componentes — recibir el contenedor como argumento
- **Estado**: Los componentes leen del store, nunca escriben directamente — usar funciones de servicio
