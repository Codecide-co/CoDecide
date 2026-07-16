# Auth

Base URL: `/api/auth`

---

## Roles

El sistema tiene dos roles de usuario:

| Rol | Descripcion |
|-----|-------------|
| `resident` | Usuario comun que puede crear reportes, votar y comentar |
| `admin` | Usuario administrador que puede gestionar reportes, usuarios y categorias |

Los endpoints que requieren rol `admin` estan marcados con **Auth: Bearer (admin)**.

---

## Endpoints

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| POST | `/register` | No | Registra un nuevo usuario |
| POST | `/login` | No | Inicia sesion y retorna un token JWT |
| GET | `/me` | Bearer | Obtiene el perfil del usuario autenticado |
| PATCH | `/me` | Bearer | Actualiza el perfil del usuario autenticado |
| POST | `/change-password` | Bearer | Cambia la contrasena del usuario |
| POST | `/logout` | Bearer | Cierra la sesion del usuario |

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

## PATCH /me

Actualiza el perfil del usuario autenticado.

**Auth:** `Authorization: Bearer <token>`

**Request Body:**

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| name | string | no | 2-100 caracteres |
| apartment | string | no | Maximo 20 caracteres |
| tower | string | no | Maximo 10 caracteres |

**Response 200:** Objeto del usuario actualizado

**Errors:** 400 (validacion)

---

## POST /change-password

Cambia la contrasena del usuario autenticado.

**Auth:** `Authorization: Bearer <token>`

**Request Body:**

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| current_password | string | si | Contrasena actual |
| new_password | string | si | Minimo 6 caracteres |

**Response 200:**

```json
{
  "message": "Password updated successfully"
}
```

**Errors:** 400 (contrasena actual incorrecta o validacion)

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
