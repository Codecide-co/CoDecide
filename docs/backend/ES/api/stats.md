# Stats

Base URL: `/api/stats`

---

## Endpoints

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/` | Bearer | Obtiene metricas comunitarias |
| GET | `/reports-over-time` | Bearer | Obtiene reportes creados por dia |

---

## GET /

Obtiene metricas comunitarias.

**Auth:** `Authorization: Bearer <token>`

**Parametros:** Ninguno

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

Obtiene la cantidad de reportes creados por dia en un periodo.

**Auth:** `Authorization: Bearer <token>`

**Query Params:**

| Parametro | Tipo | Requerido | Descripcion |
|-----------|------|-----------|-------------|
| days | int | no | Periodo en dias (default: 30) |

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
