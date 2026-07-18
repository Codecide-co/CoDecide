# Variables de Entorno

Toda la configuracion del backend se hace mediante variables de entorno en un archivo `.env` ubicado en `apps/backend/.env`.

Copia la plantilla para empezar:

```bash
cp .env.example .env
```

---

## Referencia

### `SECRET_KEY`

| | |
|---|---|
| **Obligatorio** | No |
| **Default** | `dev-secret-key` |
| **Ejemplo** | `SECRET_KEY=sup3r-s3cr3t-k3y!` |

Clave secreta de Flask para firmar sesiones. **Cambiar siempre en produccion** por una cadena larga y aleatoria.

---

### `DATABASE_URL`

| | |
|---|---|
| **Obligatorio** | No |
| **Default** | `sqlite:///codecide.db` |
| **Ejemplo** | `DATABASE_URL=mysql+pymysql://user:pass@localhost:3306/codecide` |

Cadena de conexion a la base de datos. Usa **SQLite** por defecto para desarrollo local. En produccion, cambiar a **MySQL** con el formato de arriba.

---

### `MONGO_URI`

| | |
|---|---|
| **Obligatorio** | No |
| **Default** | `mongodb://localhost:27017/codecide` |
| **Ejemplo** | `MONGO_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/codecide` |

Cadena de conexion a MongoDB. Soporta **MongoDB Atlas** (plan gratuito) — solo pega tu cadena de conexion desde el panel de Atlas. Se usa para metadatos de archivos adjuntos y logs de auditoria.

---

### `MONGO_DB_NAME`

| | |
|---|---|
| **Obligatorio** | No |
| **Default** | `codecide` |
| **Ejemplo** | `MONGO_DB_NAME=codecide_prod` |

Nombre de la base de datos MongoDB. Solo se usa si la cadena de conexion no incluye un nombre de base de datos.

---

### `JWT_SECRET_KEY`

| | |
|---|---|
| **Obligatorio** | No |
| **Default** | `jwt-secret-key` |
| **Ejemplo** | `JWT_SECRET_KEY=another-long-random-string` |

Clave para firmar los tokens JWT. **Cambiar siempre en produccion**. Debe ser diferente de `SECRET_KEY`.

---

### `JWT_EXPIRATION_DAYS`

| | |
|---|---|
| **Obligatorio** | No |
| **Default** | `7` |
| **Ejemplo** | `JWT_EXPIRATION_DAYS=30` |

Numero de dias antes de que un token JWT expire. Despues de este periodo, el usuario debe iniciar sesion nuevamente para obtener un nuevo token.

---

### `CORS_ORIGINS`

| | |
|---|---|
| **Obligatorio** | No |
| **Default** | `http://localhost:5173` |
| **Ejemplo** | `CORS_ORIGINS=https://app.codecide.com,https://admin.codecide.com` |

Lista separada por comas de origenes frontend permitidos para CORS. Agregar el dominio de produccion aqui.

---

### `UPLOAD_FOLDER`

| | |
|---|---|
| **Obligatorio** | No |
| **Default** | `apps/backend/uploads/` |
| **Ejemplo** | `UPLOAD_FOLDER=/var/data/codecide/uploads` |

Ruta en el sistema de archivos donde se almacenan los archivos subidos (imagenes, PDFs, videos). Se crea automaticamente al iniciar. Si se deja vacio, usa el directorio `uploads/` dentro de la carpeta del backend.

---

### `MAX_FILE_SIZE_MB`

| | |
|---|---|
| **Obligatorio** | No |
| **Default** | `16` |
| **Ejemplo** | `MAX_FILE_SIZE_MB=32` |

Tamaño maximo permitido de archivo en megabytes para las subidas. Se usa tanto en la capa HTTP (Flask) como en la validacion explicita en `AttachmentService`.
