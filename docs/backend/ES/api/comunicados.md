# Comunicados

Base URL: `/api/comunicados`

---

## GET /

Lista todos los comunicados oficiales, ordenados por fecha de creacion descendente.

**Auth:** No

**Response 200:**

```json
[
  {
    "id": 1,
    "title": "Corte de agua programado",
    "body": "El dia miercoles 15 de julio se realizara un corte de agua...",
    "author_id": 2,
    "author_name": "Admin",
    "created_at": "2026-07-10T10:00:00",
    "updated_at": "2026-07-10T10:00:00"
  }
]
```

---

## POST /

Publica un nuevo comunicado oficial.

**Auth:** `Authorization: Bearer <token>` (rol admin)

**Request Body:**

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| title | string | si | Titulo del comunicado |
| body | string | si | Cuerpo del comunicado |

**Response 201:**

```json
{
  "id": 2,
  "title": "Corte de agua programado",
  "body": "El dia miercoles 15 de julio...",
  "author_id": 2,
  "author_name": "Admin",
  "created_at": "2026-07-11T12:00:00",
  "updated_at": "2026-07-11T12:00:00"
}
```

**Errors:** 400 (title y body requeridos)
