# Categories

Base URL: `/api/categories`

---

## GET /

Lists all categories sorted by name.

**Auth:** None (public)

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

Creates a new category.

**Auth:** `Authorization: Bearer <token>` (admin only)

**Request:**

```json
{
  "name": "Jardineria",
  "type": "infrastructure",
  "description": "Problemas con areas verdes"
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | yes | Category name (2-100 chars) |
| type | string | yes | `infrastructure` or `coexistence` |
| description | string | no | Optional description (max 255 chars) |

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

**Errors:**

| Code | Description |
|------|-------------|
| 400 | Validation failed (invalid type, missing name, etc.) |
| 401 | Missing or invalid token |
| 403 | Not an admin |
| 409 | Category name already exists |
