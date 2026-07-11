# Reports

Base URL: `/api/reports`

---

## GET /

Lists reports with filters and pagination.

**Auth:** `Authorization: Bearer <token>`

**Query Params:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | int | no | Page number (default 1) |
| per_page | int | no | Items per page (default 20) |
| status | string | no | Filter by status: open, in_progress, resolved, closed |
| category_id | int | no | Filter by category |
| user_id | int | no | Filter by author |

**Response 200:** Array of reports

```json
[
  {
    "id": 1,
    "title": "Gas leak",
    "status": "open",
    "tracking_number": "CD-F1G2H3J4",
    "category_id": 1,
    "user_id": 1,
    "created_at": "2026-07-11T12:00:00",
    "votes_count": 5,
    "comments_count": 2
  }
]
```

---

## POST /

Creates a new report.

**Auth:** `Authorization: Bearer <token>`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | yes | 5-200 characters |
| description | string | yes | Minimum 10 characters |
| category_id | int | yes | Valid category ID |
| location | string | no | Max 255 characters |

**Response 201:**

```json
{
  "id": 1,
  "title": "Gas leak",
  "description": "There is a gas smell on the third floor hallway",
  "status": "open",
  "tracking_number": "CD-F1G2H3J4",
  "location": "Tower A, floor 3",
  "category_id": 1,
  "user_id": 1,
  "created_at": "2026-07-11T12:00:00",
  "updated_at": "2026-07-11T12:00:00"
}
```

**Errors:** 400 (validation or business error)

---

## GET /{report_id}

Gets report details including votes and comments.

**Auth:** `Authorization: Bearer <token>`

**Response 200:**

```json
{
  "id": 1,
  "title": "Gas leak",
  "description": "There is a gas smell on the third floor hallway",
  "status": "open",
  "tracking_number": "CD-F1G2H3J4",
  "location": "Tower A, floor 3",
  "category_id": 1,
  "user_id": 1,
  "created_at": "2026-07-11T12:00:00",
  "updated_at": "2026-07-11T12:00:00",
  "votes_count": 5,
  "comments_count": 2,
  "comments": [
    {
      "id": 1,
      "body": "I already notified the admin",
      "user_id": 2,
      "author_name": "Jane Smith",
      "created_at": "2026-07-11T13:00:00"
    }
  ]
}
```

**Errors:** 404 (report not found)

---

## PATCH /{report_id}/status

Updates a report's status.

**Auth:** `Authorization: Bearer <token>` (admin role)

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| status | string | yes | Values: open, in_progress, resolved, closed |

**Response 200:** Updated report object

**Errors:** 400 (invalid status)

---

## POST /{report_id}/vote

Votes on a report (up/down).

**Auth:** `Authorization: Bearer <token>`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| vote_type | string | yes | Values: up, down |

**Response 200:**

```json
{
  "id": 1,
  "vote_type": "up",
  "user_id": 1,
  "report_id": 1,
  "created_at": "2026-07-11T12:00:00"
}
```

**Errors:** 400 (duplicate or invalid vote)

---

## POST /{report_id}/comments

Adds a comment to a report.

**Auth:** `Authorization: Bearer <token>`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| body | string | yes | Minimum 1 character |

**Response 201:**

```json
{
  "id": 1,
  "body": "I already notified the admin",
  "user_id": 1,
  "report_id": 1,
  "created_at": "2026-07-11T12:00:00",
  "updated_at": "2026-07-11T12:00:00"
}
```

**Errors:** 400 (validation)
