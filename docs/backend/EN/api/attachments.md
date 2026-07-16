# Attachments

Base URL: `/api/attachments`

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
  "file_url": "/uploads/photo.jpg",
  "file_type": "image/jpeg",
  "file_size": 204800,
  "uploaded_by": 1,
  "created_at": "2026-07-11T12:30:00"
}
```

**Errors:** 404 (attachment not found)

---

## Upload

There is currently **no upload endpoint**. Files are stored on the server filesystem and referenced by `file_url`. The GET endpoint only retrieves metadata from MongoDB. A file upload endpoint is planned for a future release.
