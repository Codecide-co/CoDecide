# Reports

Base URL: `/api/reports`

---

## GET /

Lista reportes con filtros y paginacion.

**Auth:** `Authorization: Bearer <token>`

**Query Params:**

| Parametro | Tipo | Requerido | Descripcion |
|-----------|------|-----------|-------------|
| page | int | no | Pagina (default 1) |
| per_page | int | no | Items por pagina (default 20) |
| status | string | no | Filtrar por estado: open, in_progress, resolved, closed |
| category_id | int | no | Filtrar por categoria |
| user_id | int | no | Filtrar por autor |

**Response 200:** Lista de reportes (array)

```json
{
  "reports": [
    {
      "id": 1,
      "title": "Fuga de gas",
      "status": "open",
      "tracking_number": "CD-F1G2H3J4",
      "category_id": 1,
      "category_name": "Infraestructura",
      "user_id": 1,
      "author_name": "Juan Perez",
      "is_anonymous": false,
      "created_at": "2026-07-11T12:00:00",
      "votes_count": 5,
      "upvotes": 4,
      "downvotes": 1,
      "user_vote": "up",
      "comments_count": 2
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 20,
  "pages": 1
}
```

---

## POST /

Crea un nuevo reporte.

**Auth:** `Authorization: Bearer <token>`

**Request Body:**

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| title | string | si | 5-200 caracteres |
| description | string | si | Minimo 10 caracteres |
| category_id | int | si | ID de categoria valida |
| location | string | no | Maximo 255 caracteres |
| is_anonymous | bool | no | Oculta la identidad del autor (default: false) |

**Response 201:**

```json
{
  "id": 1,
  "title": "Fuga de gas",
  "description": "Hay olor a gas en el pasillo del tercer piso",
  "status": "open",
  "tracking_number": "CD-F1G2H3J4",
  "location": "Torre A, piso 3",
  "category_id": 1,
  "category_name": "Infraestructura",
  "user_id": 1,
  "author_name": "Juan Perez",
  "is_anonymous": false,
  "created_at": "2026-07-11T12:00:00",
  "updated_at": "2026-07-11T12:00:00"
}
```

**Errors:** 400 (validacion o error de negocio)

---

## GET /{report_id}

Obtiene detalle de un reporte, incluyendo votos y comentarios.

**Auth:** `Authorization: Bearer <token>`

**Response 200:**

```json
{
  "id": 1,
  "title": "Fuga de gas",
  "description": "Hay olor a gas en el pasillo del tercer piso",
  "status": "open",
  "tracking_number": "CD-F1G2H3J4",
  "location": "Torre A, piso 3",
  "category_id": 1,
  "category_name": "Infraestructura",
  "user_id": 1,
  "author_name": "Juan Perez",
  "is_anonymous": false,
  "created_at": "2026-07-11T12:00:00",
  "updated_at": "2026-07-11T12:00:00",
  "votes_count": 5,
  "upvotes": 4,
  "downvotes": 1,
  "user_vote": "up",
  "comments_count": 2,
  "attachments": [
    {
      "id": "abc123",
      "file_name": "foto.jpg",
      "file_url": "/uploads/foto.jpg",
      "file_type": "image/jpeg",
      "file_size": 204800,
      "created_at": "2026-07-11T12:30:00"
    }
  ],
  "status_history": [
    {
      "id": "log1",
      "user_id": 2,
      "action": "status_change",
      "details": {
        "from": "open",
        "to": "in_progress",
        "comment": "Revisando el reporte"
      },
      "created_at": "2026-07-11T14:00:00"
    }
  ],
  "comments": [
    {
      "id": 1,
      "body": "Ya avise al administrador",
      "user_id": 2,
      "author_name": "Maria Lopez",
      "created_at": "2026-07-11T13:00:00"
    }
  ]
}
```

**Errors:** 404 (reporte no encontrado)

---

## PATCH /{report_id}/status

Actualiza el estado de un reporte.

**Auth:** `Authorization: Bearer <token>` (rol admin)

**Request Body:**

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| status | string | si | Valores: open, in_progress, resolved, closed |
| comment | string | no | Comentario opcional sobre el cambio (max 500 caracteres) |

**Response 200:** Objeto del reporte actualizado

**Errors:** 400 (estado invalido o transicion no permitida)

---

## POST /{report_id}/vote

Vota un reporte (up/down).

**Auth:** `Authorization: Bearer <token>`

**Request Body:**

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| vote_type | string | si | Valores: up, down |

**Response 200:**

```json
{
  "upvotes": 4,
  "downvotes": 1,
  "user_vote": "up"
}
```

**Notas:**
- Si el usuario ya voto con un tipo distinto (up→down o down→up), el voto se actualiza (upsert).
- No se puede votar el propio reporte.
- No se puede votar dos veces con el mismo tipo.

**Errors:** 400 (voto invalido, auto-voto o voto duplicado)

---

## POST /{report_id}/comments

Agrega un comentario a un reporte.

**Auth:** `Authorization: Bearer <token>`

**Request Body:**

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| body | string | si | Minimo 1 caracter |

**Response 201:**

```json
{
  "id": 1,
  "body": "Ya avise al administrador",
  "user_id": 1,
  "report_id": 1,
  "created_at": "2026-07-11T12:00:00",
  "updated_at": "2026-07-11T12:00:00"
}
```

**Errors:** 400 (validacion)
