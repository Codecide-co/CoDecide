# Admin

Base URL: `/api/admin`

All endpoints require `Authorization: Bearer <token>` with admin role.

---

## GET /users

Lists all registered users.

**Response 200:**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "resident",
    "apartment": "101",
    "tower": "A",
    "created_at": "2026-07-11T12:00:00",
    "updated_at": "2026-07-11T12:00:00"
  }
]
```

---

## DELETE /users/{user_id}

Deletes a user from the system.

**Response 200:**

```json
{
  "message": "User deleted"
}
```

**Errors:** 404 (user not found)

---

## GET /audit-logs

Gets audit log records.

**Query Params:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | int | no | Max records (default 100) |

**Response 200:**

```json
[
  {
    "_id": "...",
    "user_id": 1,
    "action": "delete",
    "entity_type": "user",
    "entity_id": 3,
    "details": {"deleted_user_email": "test@example.com"},
    "ip_address": "192.168.1.1",
    "created_at": "2026-07-11T12:00:00"
  }
]
```

---

## PATCH /reports/{report_id}/assign

Assigns a report to a user.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user_id | int | yes | ID of the assigned user |

**Response 200:** Updated report object (includes assigned_to)

**Errors:** 400 (user_id required), 404 (report or user not found)
