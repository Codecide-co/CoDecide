# Categorias

Base URL: `/api/categories`

---

## GET /

Lista todas las categorias ordenadas por nombre.

**Auth:** Ninguna (publico)

**Response 200:**

```json
[
  {
    "id": 1,
    "name": "Alumbrado publico",
    "type": "infrastructure",
    "description": "Problemas con farolas y postes de luz",
    "created_at": "2026-07-11T12:00:00"
  },
  {
    "id": 2,
    "name": "Ruido",
    "type": "coexistence",
    "description": "Quejas por ruido excesivo",
    "created_at": "2026-07-11T12:00:00"
  }
]
```

---

## POST /

Crea una nueva categoria.

**Auth:** `Authorization: Bearer <token>` (solo admin)

**Request:**

```json
{
  "name": "Jardineria",
  "type": "infrastructure",
  "description": "Problemas con areas verdes"
}
```

**Fields:**

| Campo | Tipo | Obligatorio | Descripcion |
|-------|------|-------------|-------------|
| name | string | si | Nombre de la categoria (2-100 caracteres) |
| type | string | si | `infrastructure` o `coexistence` |
| description | string | no | Descripcion opcional (max 255 caracteres) |

**Response 201:**

```json
{
  "id": 3,
  "name": "Jardineria",
  "type": "infrastructure",
  "description": "Problemas con areas verdes",
  "created_at": "2026-07-16T10:00:00"
}
```

**Errores:**

| Codigo | Descripcion |
|--------|-------------|
| 400 | Validacion fallida (tipo invalido, nombre faltante, etc.) |
| 401 | Token faltante o invalido |
| 403 | No es administrador |
| 409 | El nombre de la categoria ya existe |
