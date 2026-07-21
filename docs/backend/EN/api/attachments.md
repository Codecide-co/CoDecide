# Attachments

Base URL: `/api/attachments`

---

## POST /upload

Uploads a file as an attachment to a report.

**Auth:** `Authorization: Bearer <token>`

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| file | file | yes | File to upload (jpg, png, pdf, mp4, etc.) |
| report_id | int | yes | ID of the associated report |

**Allowed file types:** png, jpg, jpeg, gif, webp, pdf, doc, docx, mp4, mov, avi

**Max file size:** 16 MB

**Response 201:**

```json
{
  "id": "abc123def456",
  "report_id": 1,
  "file_name": "photo.jpg",
  "file_url": "/uploads/a1b2c3d4e5f6.jpg",
  "file_type": "image/jpeg",
  "file_size": 204800,
  "uploaded_by": 1,
  "created_at": "2026-07-16T12:00:00"
}
```

**Errors:** 400 (missing file, invalid type, missing report_id), 404 (report not found)

---

## GET /{attachment_id}

Retrieves attachment metadata.

**Auth:** `Authorization: Bearer <token>`

**Response 200:**

```json
{
  "id": "abc123",
  "report_id": 1,
  "file_name": "photo.jpg",
  "file_url": "/uploads/a1b2c3d4e5f6.jpg",
  "file_type": "image/jpeg",
  "file_size": 204800,
  "uploaded_by": 1,
  "created_at": "2026-07-16T12:30:00"
}
```

**Errors:** 404 (attachment not found)

---

## GET /{attachment_id}/file

Serves the actual file of an attachment.

**Auth:** `Authorization: Bearer <token>`

**Response 200:** Raw file with the correct MIME type.

**Errors:** 404 (attachment not found)
