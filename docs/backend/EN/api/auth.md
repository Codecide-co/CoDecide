# Auth

Base URL: `/api/auth`

---

## Roles

The system has two user roles:

| Role | Description |
|------|-------------|
| `resident` | Standard user who can create reports, vote, and comment |
| `admin` | Administrator who can manage reports, users, and categories |

Endpoints requiring `admin` role are marked with **Auth: Bearer (admin)**.

---

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | No | Registers a new user |
| POST | `/login` | No | Authenticates and returns a JWT token |
| GET | `/me` | Bearer | Gets the authenticated user's profile |
| PATCH | `/me` | Bearer | Updates the authenticated user's profile |
| POST | `/change-password` | Bearer | Changes the user's password |
| POST | `/logout` | Bearer | Logs out the user |

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

## PATCH /me

Updates the authenticated user's profile.

**Auth:** `Authorization: Bearer <token>`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | no | 2-100 characters |
| apartment | string | no | Max 20 characters |
| tower | string | no | Max 10 characters |

**Response 200:** Updated user object

**Errors:** 400 (validation)

---

## POST /change-password

Changes the authenticated user's password.

**Auth:** `Authorization: Bearer <token>`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| current_password | string | yes | Current password |
| new_password | string | yes | Minimum 6 characters |

**Response 200:**

```json
{
  "message": "Password updated successfully"
}
```

**Errors:** 400 (incorrect current password or validation)

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
