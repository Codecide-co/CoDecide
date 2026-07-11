# Auth

Base URL: `/api/auth`

---

## POST /register

Registers a new user.

**Auth:** No

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | yes | 2-100 characters |
| email | string | yes | Valid email, unique |
| password | string | yes | Minimum 6 characters |
| apartment | string | no | Max 20 characters |
| tower | string | no | Max 10 characters |

**Response 201:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "resident",
  "apartment": "101",
  "tower": "A",
  "created_at": "2026-07-11T12:00:00",
  "updated_at": "2026-07-11T12:00:00",
  "token": "eyJ..."
}
```

**Errors:** 400 (validation), 409 (duplicate email)

---

## POST /login

Authenticates and returns a JWT token.

**Auth:** No

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | yes | Registered email |
| password | string | yes | Password |

**Response 200:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "resident",
  "apartment": "101",
  "tower": "A",
  "created_at": "2026-07-11T12:00:00",
  "updated_at": "2026-07-11T12:00:00",
  "token": "eyJ..."
}
```

**Errors:** 400 (validation), 401 (invalid credentials)

---

## GET /me

Gets the authenticated user's profile.

**Auth:** `Authorization: Bearer <token>`

**Response 200:**

```json
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
```

---

## POST /logout

Logs out the user.

**Auth:** `Authorization: Bearer <token>`

**Response 200:**

```json
{
  "message": "Logged out successfully"
}
```
