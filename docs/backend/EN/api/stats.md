# Stats

Base URL: `/api/stats`

---

## GET /

Gets community metrics.

**Auth:** `Authorization: Bearer <token>`

**Parameters:** None

**Response 200:**

```json
{
  "total_reports": 150,
  "open_reports": 45,
  "resolved_reports": 80,
  "total_users": 30
}
```
