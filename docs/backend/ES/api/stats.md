# Stats

Base URL: `/api/stats`

---

## GET /

Obtiene metricas comunitarias.

**Auth:** `Authorization: Bearer <token>`

**Parametros:** Ninguno

**Response 200:**

```json
{
  "total_reports": 150,
  "open_reports": 45,
  "resolved_reports": 80,
  "total_users": 30
}
```
