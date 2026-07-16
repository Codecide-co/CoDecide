# Archivos Adjuntos

Base URL: `/api/attachments`

---

## POST /upload

Sube un archivo como adjunto a un reporte.

**Auth:** `Authorization: Bearer <token>`

**Request:** `multipart/form-data`

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| file | file | si | Archivo a subir (jpg, png, pdf, mp4, etc.) |
| report_id | int | si | ID del reporte asociado |

**Tipos de archivo permitidos:** png, jpg, jpeg, gif, webp, pdf, doc, docx, mp4, mov, avi

**Tamaño maximo:** 16 MB

**Response 201:**

```json
{
  "id": "abc123def456",
  "report_id": 1,
  "file_name": "foto.jpg",
  "file_url": "/uploads/a1b2c3d4e5f6.jpg",
  "file_type": "image/jpeg",
  "file_size": 204800,
  "uploaded_by": 1,
  "created_at": "2026-07-16T12:00:00"
}
```

**Errores:** 400 (archivo faltante, tipo invalido, report_id faltante), 404 (reporte no encontrado)

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
  "file_url": "/uploads/a1b2c3d4e5f6.jpg",
  "file_type": "image/jpeg",
  "file_size": 204800,
  "uploaded_by": 1,
  "created_at": "2026-07-16T12:30:00"
}
```

**Errores:** 404 (archivo no encontrado)

---

## GET /{attachment_id}/file

Sirve el archivo fisico de un adjunto.

**Auth:** `Authorization: Bearer <token>`

**Response 200:** Archivo raw con el tipo MIME correcto.

**Errores:** 404 (archivo no encontrado)
