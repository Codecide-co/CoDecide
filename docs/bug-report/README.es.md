# Guía de Issues de Bug

## Labels de Dominio

- `backend` — Flask, SQLAlchemy, MongoDB, rutas, servicios, middleware
- `frontend` — Vanilla JS, Vite, Tailwind, componentes, páginas, estilos

Cada bug debe tener al menos un label de dominio.

## Formato del Título

Usa el formato de conventional commit:

```
fix(<scope>): <descripción corta en inglés>
```

**Ejemplos:**

| Bug | Título |
|-----|--------|
| Error en login | `fix(auth): login returns 500 on invalid token` |
| Formulario roto | `fix(components): report form crashes on empty category` |
| Endpoint dañado | `fix(routes): report list returns 500 on empty db` |

> El scope debe coincidir con uno de los scopes disponibles (ver [CONTRIBUTING.es.md](../CONTRIBUTING.es.md)).

## Formato de la Descripción

Ver las plantillas en esta carpeta:
- `bug-report.es.md` — Español
- `bug-report.md` — English

Secciones requeridas:
1. **Describe el bug** — qué está ocurriendo
2. **Para reproducir** — paso a paso
3. **Comportamiento esperado** — qué debería pasar
4. **Capturas / Logs** — si aplica
5. **Contexto adicional** — opcional
6. **Criterios de aceptación** — checklist para la solución

## Plantillas

| Idioma | Archivo |
|--------|---------|
| Español | `bug-report.es.md` |
| English | `bug-report.md` |
