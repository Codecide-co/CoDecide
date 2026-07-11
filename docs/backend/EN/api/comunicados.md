# Announcements

Base URL: `/api/comunicados`

---

## GET /

Lists all official announcements, ordered by creation date descending.

**Auth:** No

**Response 200:**

```json
[
  {
    "id": 1,
    "title": "Scheduled water outage",
    "body": "On Wednesday July 15 there will be a water outage...",
    "author_id": 2,
    "author_name": "Admin",
    "created_at": "2026-07-10T10:00:00",
    "updated_at": "2026-07-10T10:00:00"
  }
]
```

---

## POST /

Publishes a new official announcement.

**Auth:** `Authorization: Bearer <token>` (admin role)

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | yes | Announcement title |
| body | string | yes | Announcement content |

**Response 201:**

```json
{
  "id": 2,
  "title": "Scheduled water outage",
  "body": "On Wednesday July 15...",
  "author_id": 2,
  "author_name": "Admin",
  "created_at": "2026-07-11T12:00:00",
  "updated_at": "2026-07-11T12:00:00"
}
```

**Errors:** 400 (title and body required)
