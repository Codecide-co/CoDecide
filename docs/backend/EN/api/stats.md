# Stats

Base URL: `/api/stats`

---

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Bearer | Gets community metrics |
| GET | `/reports-over-time` | Bearer | Gets reports created per day |

---

## GET /

Gets community metrics.

**Auth:** `Authorization: Bearer <token>`

**Parameters:** None

**Response 200:**

```json
{
  "total_reports": 150,
  "by_status": {
    "open": 45,
    "in_progress": 20,
    "resolved": 80,
    "closed": 5
  },
  "by_category": {
    "1": 100,
    "2": 50
  },
  "resolved_today": 3,
  "total_votes": 200,
  "total_comments": 75,
  "active_users": 10,
  "total_users": 30
}
```

---

## GET /reports-over-time

Gets the number of reports created per day over a period.

**Auth:** `Authorization: Bearer <token>`

**Query Params:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| days | int | no | Period in days (default: 30) |

**Response 200:**

```json
[
  {
    "date": "2026-07-01",
    "count": 5
  },
  {
    "date": "2026-07-02",
    "count": 3
  }
]
```
