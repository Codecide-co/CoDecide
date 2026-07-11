# Auth

Base URL: `/api/auth`

---

## POST /register

Registra un nuevo usuario.

**Auth:** No

**Request Body:**

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| name | string | si | 2-100 caracteres |
| email | string | si | Email valido, unico |
| password | string | si | Minimo 6 caracteres |
| apartment | string | no | Maximo 20 caracteres |
| tower | string | no | Maximo 10 caracteres |

**Response 201:**

```json
{
  "id": 1,
  "name": "Juan Perez",
  "email": "juan@example.com",
  "role": "resident",
  "apartment": "101",
  "tower": "A",
  "created_at": "2026-07-11T12:00:00",
  "updated_at": "2026-07-11T12:00:00",
  "token": "eyJ..."
}
```

**Errors:** 400 (validacion), 409 (email duplicado)

---

## POST /login

Inicia sesion y retorna un token JWT.

**Auth:** No

**Request Body:**

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| email | string | si | Email registrado |
| password | string | si | Contrasena |

**Response 200:**

```json
{
  "id": 1,
  "name": "Juan Perez",
  "email": "juan@example.com",
  "role": "resident",
  "apartment": "101",
  "tower": "A",
  "created_at": "2026-07-11T12:00:00",
  "updated_at": "2026-07-11T12:00:00",
  "token": "eyJ..."
}
```

**Errors:** 400 (validacion), 401 (credenciales invalidas)

---

## GET /me

Obtiene el perfil del usuario autenticado.

**Auth:** `Authorization: Bearer <token>`

**Response 200:**

```json
{
  "id": 1,
  "name": "Juan Perez",
  "email": "juan@example.com",
  "role": "resident",
  "apartment": "101",
  "tower": "A",
  "created_at": "2026-07-11T12:00:00",
  "updated_at": "2026-07-11T12:00:00"
}
```

---

## POST /logout

Cierra la sesion del usuario.

**Auth:** `Authorization: Bearer <token>`

**Response 200:**

```json
{
  "message": "Logged out successfully"
}
```
