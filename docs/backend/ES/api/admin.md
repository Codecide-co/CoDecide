# Admin

Base URL: `/api/admin`

Todos los endpoints requieren `Authorization: Bearer <token>` con rol admin.

---

## GET /users

Lista todos los usuarios registrados.

**Response 200:**

```json
[
  {
    "id": 1,
    "name": "Juan Perez",
    "email": "juan@example.com",
    "role": "resident",
    "apartment": "101",
    "tower": "A",
    "created_at": "2026-07-11T12:00:00",
    "updated_at": "2026-07-11T12:00:00"
  }
]
```

---

## DELETE /users/{user_id}

Elimina un usuario del sistema.

**Response 200:**

```json
{
  "message": "User deleted"
}
```

**Errors:** 404 (usuario no encontrado)

---

## GET /audit-logs

Obtiene los registros de auditoria.

**Query Params:**

| Parametro | Tipo | Requerido | Descripcion |
|-----------|------|-----------|-------------|
| limit | int | no | Maximo de registros (default 100) |

**Response 200:**

```json
[
  {
    "_id": "...",
    "user_id": 1,
    "action": "delete",
    "entity_type": "user",
    "entity_id": 3,
    "details": {"deleted_user_email": "test@example.com"},
    "ip_address": "192.168.1.1",
    "created_at": "2026-07-11T12:00:00"
  }
]
```

---

## PATCH /reports/{report_id}/assign

Asigna un reporte a un usuario.

**Request Body:**

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| user_id | int | si | ID del usuario asignado |

**Response 200:** Objeto del reporte actualizado (incluye assigned_to)

**Errors:** 400 (user_id requerido), 404 (reporte o usuario no encontrado)
