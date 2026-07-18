# Environment Variables

All backend configuration is done through environment variables in a `.env` file placed at `apps/backend/.env`.

Copy the template to get started:

```bash
cp .env.example .env
```

---

## Reference

### `SECRET_KEY`

| | |
|---|---|
| **Required** | No |
| **Default** | `dev-secret-key` |
| **Example** | `SECRET_KEY=sup3r-s3cr3t-k3y!` |

Flask secret key used for session signing. **Always change this in production** to a long, random string.

---

### `DATABASE_URL`

| | |
|---|---|
| **Required** | No |
| **Default** | `sqlite:///codecide.db` |
| **Example** | `DATABASE_URL=mysql+pymysql://user:pass@localhost:3306/codecide` |

Database connection string. Uses **SQLite** by default for local development. For production, switch to **MySQL** with the format above.

---

### `MONGO_URI`

| | |
|---|---|
| **Required** | No |
| **Default** | `mongodb://localhost:27017/codecide` |
| **Example** | `MONGO_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/codecide` |

MongoDB connection string. Supports **MongoDB Atlas** (free tier) — just paste your connection string from the Atlas dashboard. Used for attachment metadata and audit logs.

---

### `MONGO_DB_NAME`

| | |
|---|---|
| **Required** | No |
| **Default** | `codecide` |
| **Example** | `MONGO_DB_NAME=codecide_prod` |

MongoDB database name. Only used if your connection string does not include a database name.

---

### `JWT_SECRET_KEY`

| | |
|---|---|
| **Required** | No |
| **Default** | `jwt-secret-key` |
| **Example** | `JWT_SECRET_KEY=another-long-random-string` |

Key used to sign JWT tokens. **Always change this in production**. Must be different from `SECRET_KEY`.

---

### `JWT_EXPIRATION_DAYS`

| | |
|---|---|
| **Required** | No |
| **Default** | `7` |
| **Example** | `JWT_EXPIRATION_DAYS=30` |

Number of days before a JWT token expires. After this period, the user must log in again to obtain a new token.

---

### `CORS_ORIGINS`

| | |
|---|---|
| **Required** | No |
| **Default** | `http://localhost:5173` |
| **Example** | `CORS_ORIGINS=https://app.codecide.com,https://admin.codecide.com` |

Comma-separated list of allowed frontend origins for CORS. Add your production domain here.

---

### `UPLOAD_FOLDER`

| | |
|---|---|
| **Required** | No |
| **Default** | `apps/backend/uploads/` |
| **Example** | `UPLOAD_FOLDER=/var/data/codecide/uploads` |

Filesystem path where uploaded files (images, PDFs, videos) are stored. Created automatically on startup. If left empty, defaults to the `uploads/` directory inside the backend folder.

---

### `MAX_FILE_SIZE_MB`

| | |
|---|---|
| **Required** | No |
| **Default** | `16` |
| **Example** | `MAX_FILE_SIZE_MB=32` |

Maximum allowed file size in megabytes for uploads. Used by both the HTTP layer (Flask) and the explicit validation in `AttachmentService`.
