# Attachments

Base URL: `/api/attachments`

---

## GET /{attachment_id}

Obtiene los metadatos de un archivo adjunto.

**Auth:** `Authorization: Bearer <token>`

**Response 200:**

```json
{
  "id": "abc123",
  "report_id": 1,
  "file_name": "foto.jpg",
  "file_url": "/uploads/foto.jpg",
  "file_type": "image/jpeg",
  "file_size": 204800,
  "uploaded_by": 1,
  "created_at": "2026-07-11T12:30:00"
}
```

**Errors:** 404 (archivo no encontrado)

---

## Subida

Actualmente **no existe un endpoint de subida**. Los archivos se almacenan en el sistema de archivos del servidor y se referencian mediante `file_url`. El endpoint GET solo recupera metadatos de MongoDB. Un endpoint de subida de archivos esta planificado para una version futura.
