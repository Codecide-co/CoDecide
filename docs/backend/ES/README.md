# Backend - CoDecide

Documentacion del backend.

---

## Indice

- [Vision general](#vision-general)
- [Estructura](#estructura)
- [Responsabilidades por capa](#responsabilidades-por-capa)
- [Estandares de codificacion](#estandares-de-codificacion)
- [Arrancar el backend](#arrancar-el-backend)
- [Endpoints](api/)
- [Base de datos (MySQL/SQLite)](#base-de-datos-mysqlsqlite)
- [MongoDB](#mongodb)
- [Flujo de una peticion](#flujo-de-una-peticion)
- [Seguridad](#seguridad)
- [Notas](#notas)

---

## Vision general

API REST construida con **Flask** (Python). Usa **MySQL** para datos relacionales (usuarios, reportes, categorias, votos, comentarios) y **MongoDB** para almacenamiento de documentos (metadatos de adjuntos, logs de auditoria, historial de actividad).

Todo el codigo Python debe incluir **type hints** y **docstrings**.

---

## Estructura

```
apps/backend/
├── run.py                          # Punto de entrada
├── requirements.txt                # Dependencias
├── .env.example                    # Plantilla de configuracion
│
└── app/
    ├── __init__.py                 # Fabrica de aplicacion (create_app)
    ├── config.py                   # Configuracion por entorno
    ├── extensions.py               # Inicializacion de extensiones (SQLAlchemy, JWT, etc.)
    ├── constants.py                # Constantes
    │
    ├── models/                     # Modelos SQLAlchemy (tablas)
    │   ├── user.py                 # Usuarios
    │   ├── report.py               # Reportes
    │   ├── category.py             # Categorias
    │   ├── comment.py              # Comentarios
    │   ├── vote.py                 # Votos
    │   └── comunicado.py           # Comunicados oficiales
    │
    ├── routes/                     # Endpoints (blueprints)
    │   ├── hello.py                # Health check
    │   ├── auth.py                 # Autenticacion
    │   ├── reports.py              # CRUD reportes
    │   ├── comunicados.py          # Comunicados
    │   ├── stats.py                # Estadisticas
    │   └── admin.py                # Administracion
    │
    ├── services/                   # Logica de negocio
    │   ├── auth_service.py
    │   ├── report_service.py
    │   └── stats_service.py
    │
    ├── schemas/                    # Validacion con Marshmallow
    │   ├── auth_schema.py
    │   ├── report_schema.py
    │   └── user_schema.py
    │
    ├── translations/               # Archivos de traduccion i18n
    │   ├── es/LC_MESSAGES/messages.po  # Espanol (por defecto)
    │   └── en/LC_MESSAGES/messages.po  # Ingles
    │
    ├── middleware/                  # Decoradores de seguridad
    │   └── auth.py                 # @login_required, @admin_required
    │
    ├── mongodb/                    # Modelos MongoDB
    │   ├── attachment.py           # Metadatos de archivos
    │   └── audit_log.py            # Registro de auditoria
    │
    └── utils/
        ├── git.py                  # Commit actual de Git
        └── logger.py               # Logs

migrations/                         # Migraciones Alembic
instance/
└── codecide.db                   # BD SQLite local (desarrollo)
```

---

## Responsabilidades por capa

### models/ (SQLAlchemy)
- Definen las tablas de la base de datos como clases de Python
- Incluyen relaciones, indices y restricciones
- Un modelo por archivo, nombrado segun la entidad

### routes/ (Blueprints)
- Manejan peticiones HTTP y retornan respuestas
- Validan la entrada mediante schemas antes de pasar a los servicios
- Nunca contienen logica de negocio -- delegan en los servicios
- Un blueprint por dominio de recurso

### services/
- Contienen toda la logica de negocio
- Orquestan modelos, llamadas externas y transacciones
- Lanzan excepciones personalizadas para el manejo de errores

### schemas/ (Marshmallow)
- Serializan/deserializan datos de peticiones y respuestas
- Validan la estructura y tipos del payload
- Garantizan un contrato de API consistente

### middleware/
- Funciones decoradoras para aspectos transversales
- Autenticacion, autorizacion, logging de peticiones

### mongodb/
- Schemas y helpers para operaciones con documentos MongoDB
- Usado para datos no relacionales: metadatos de archivos, logs de auditoria

---

## Estandares de codificacion

### Type Hints
Toda firma de funcion debe incluir anotaciones de tipo:

```python
from typing import Optional

def create_report(title: str, description: str, user_id: int, category_id: int, evidence: Optional[list[str]] = None) -> Report:
    ...
```

### Docstrings
Todo modulo, clase y funcion debe tener un docstring:

```python
def create_report(title: str, description: str, user_id: int, ...) -> Report:
    """
    Crea un nuevo reporte.

    Valida la categoria, asigna un numero de seguimiento y
    persiste el reporte en la base de datos.

    Args:
        title: Titulo del reporte (max. 200 caracteres).
        description: Descripcion detallada del problema.
        user_id: ID del usuario que reporta.
        category_id: ID de la categoria asignada.

    Returns:
        La instancia del Reporte recien creado.

    Raises:
        ValidationError: Si la categoria no existe o
            el usuario no esta autorizado.
    """
```

---

## Arrancar el backend

```bash
cd apps/backend
pip install -r requirements.txt
cp .env.example .env
flask db upgrade
pybabel compile -d app/translations   # Compilar traducciones i18n
python run.py
```

Servidor en `http://localhost:5000`.

---

## Internacionalizacion (i18n)

El backend usa **Flask-Babel** para responder en español o inglés.

### Comportamiento por defecto

El servidor siempre responde en **español** a menos que se indique lo contrario.

### Como cambiar el idioma

1. **Query param** — cualquier endpoint acepta `?lang=en` o `?lang=es`:
   ```bash
   curl http://localhost:5000/api/hello?lang=en
   ```

2. **Cookie persistente** — `POST /api/language` guarda el idioma en una cookie:
   ```bash
   curl -X POST http://localhost:5000/api/language \
     -H "Content-Type: application/json" \
     -d '{"language": "en"}'
   ```

### Orden de resolucion del locale

1. `?lang=` en la URL
2. Cookie `language`
3. `es` (español) por defecto

### Como agregar o modificar traducciones

1. Marca los strings en el codigo con `gettext()` o `lazy_gettext()`:
   ```python
   from flask_babel import gettext
   raise ValueError(gettext("User not found"))
   ```

2. Extrae los strings al archivo `.pot`:
   ```bash
   pybabel extract -F babel.cfg -o app/translations/messages.pot --no-wrap app
   ```

3. Actualiza los archivos `.po` de cada idioma:
   ```bash
   pybabel update -i app/translations/messages.pot -d app/translations --no-wrap
   ```

4. Edita `app/translations/es/LC_MESSAGES/messages.po` o `app/translations/en/LC_MESSAGES/messages.po` con las traducciones faltantes.

5. Compila los archivos `.mo`:
   ```bash
   pybabel compile -d app/translations
   ```

---

## Migraciones de Base de Datos

Los cambios de esquema se gestionan con **Flask-Migrate** (Alembic). Todos los archivos de migración están en `migrations/versions/`.

### Flujo de trabajo

1. Editar un modelo en `app/models/` (agregar columna, crear tabla, etc.)
2. Generar una migración:
   ```bash
   flask db migrate -m "add avatar_url to users"
   ```
3. Revisar el archivo generado en `migrations/versions/`
4. Aplicarla:
   ```bash
   flask db upgrade
   ```

### Primera configuración

Si la carpeta `migrations/` no existe (ej. clonado fresco):

```bash
flask db init          # Crear el directorio de migraciones
flask db stamp head    # Marcar la BD existente como actualizada
```

> **Nota:** `flask db stamp head` es crítico — le indica a Alembic que el estado actual de la BD coincide con los modelos sin ejecutar SQL. Úsalo al configurar un nuevo entorno con una BD existente o al reinicializar migraciones.

### Comandos comunes

| Comando | Propósito |
|---------|-----------|
| `flask db init` | Crear el directorio `migrations/` (una vez) |
| `flask db migrate -m "msg"` | Auto-generar un script de migración desde cambios en modelos |
| `flask db upgrade` | Aplicar todas las migraciones pendientes |
| `flask db downgrade` | Revertir la última migración |
| `flask db stamp head` | Marcar la BD como actualizada sin ejecutar SQL |
| `flask db history` | Mostrar la cadena completa de migraciones |
| `flask db current` | Mostrar qué revisión está aplicada actualmente |
| `flask db heads` | Mostrar todas las revisiones cabeza (detectar forks) |

### Solución de problemas

- **Múltiples cabezas** — Si `flask db upgrade` falla con "Multiple head revisions", elimina el archivo de migración no deseado de `migrations/versions/` y ejecuta `flask db upgrade` de nuevo.
- **Error "no such table"** — La tabla existe en el modelo pero no se generó una migración. Ejecuta `flask db migrate -m "add <table>"` para crearla.
- **Migración ya aplicada** — Si se agregó un archivo de migración manualmente, ejecuta `flask db stamp head` para sincronizar Alembic sin re-ejecutarlo.

---

## Endpoints

Documentacion detallada por dominio en [api/](api/):

| Archivo | Base URL |
|---------|----------|
| [hello.md](api/hello.md) | `/api` |
| [auth.md](api/auth.md) | `/api/auth` |
| [reports.md](api/reports.md) | `/api/reports` |
| [comunicados.md](api/comunicados.md) | `/api/comunicados` |
| [categories.md](api/categories.md) | `/api/categories` |
| [stats.md](api/stats.md) | `/api/stats` |
| [admin.md](api/admin.md) | `/api/admin` |
| [attachments.md](api/attachments.md) | `/api/attachments` |
| [env.md](env.md) | — |

---

## Base de datos (MySQL/SQLite)

![Diagrama DER](../../.github/images/der_diagram.png)

### users

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | Integer PK | ID unico |
| name | String(100) | Nombre completo |
| email | String(120) UNIQUE | Correo electronico |
| password_hash | String(255) | Contrasena encriptada |
| role | Enum(resident, admin) | Rol del usuario |
| apartment | String(20) | Apartamento |
| tower | String(10) | Torre |
| last_seen | DateTime | Ultima vez que inicio sesion |
| avatar_url | String(255) nullable | Ruta de la imagen de avatar (galeria o subida) |
| created_at | DateTime | Fecha de registro |
| updated_at | DateTime | Ultima modificacion |

### categories

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | Integer PK | ID unico |
| name | String(100) | Nombre de la categoria |
| type | Enum(infrastructure, coexistence) | Tipo |
| description | String(255) | Descripcion opcional |
| created_at | DateTime | Fecha de creacion |

### reports

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | Integer PK | ID unico |
| title | String(200) | Titulo del reporte |
| description | Text | Descripcion detallada |
| status | Enum(open, in_progress, resolved, closed) | Estado actual |
| tracking_number | String(12) UNIQUE | Numero de seguimiento publico |
| location | String(255) | Ubicacion dentro de la comunidad |
| is_anonymous | Boolean | Si es true, oculta la identidad del autor |
| category_id | Integer FK | Categoria del reporte |
| user_id | Integer FK | Autor del reporte |
| assigned_to | Integer FK nullable | Admin asignado |
| created_at | DateTime | Fecha de creacion |
| updated_at | DateTime | Ultima modificacion |

### comments

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | Integer PK | ID unico |
| body | Text | Contenido del comentario |
| user_id | Integer FK | Autor |
| report_id | Integer FK | Reporte asociado |
| created_at | DateTime | Fecha de creacion |
| updated_at | DateTime | Ultima modificacion |

### votes

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | Integer PK | ID unico |
| vote_type | Enum(up, down) | Tipo de voto |
| user_id | Integer FK | Usuario que vota |
| report_id | Integer FK | Reporte votado |
| created_at | DateTime | Fecha de creacion |

Un usuario solo puede votar una vez por reporte (UniqueConstraint). Si cambia de tipo de voto (up→down o down→up), el voto existente se actualiza (upsert).

### comunicados

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | Integer PK | ID unico |
| title | String(200) | Titulo del anuncio |
| body | Text | Contenido |
| author_id | Integer FK | Admin que lo publico |
| created_at | DateTime | Fecha de creacion |
| updated_at | DateTime | Ultima modificacion |

---

## MongoDB

### attachments

Almacena metadatos de archivos adjuntos a reportes.

Campos: report_id, file_name, file_url, file_type (image, pdf, video), file_size, uploaded_by, created_at.

### audit_logs

Registro de actividad inmutable para trazabilidad.

Campos: user_id, action (create, update, delete, status_change), entity_type (report, comment, user), entity_id, details, ip_address, created_at.

---

## Flujo de una peticion

```
Frontend (React)
    │
    ▼
Route (routes/*.py)      → Recibe la URL, aplica middleware (token)
    │
    ▼
Schema (schemas/*.py)    → Valida que los datos sean correctos
    │
    ▼
Service (services/*.py)  → Logica de negocio, orquesta modelos
    │
    ▼
Modelo (models/*.py)     → Persiste o consulta en BD
    │
    ▼
Respuesta JSON           → Vuelve al frontend
```

Ejemplo: "Juan crea un reporte"
1. Frontend llama `POST /api/reports` con token + datos
2. `middleware/auth.py` verifica el token, asigna `request.current_user`
3. `schemas/report_schema.py` valida title, description, category_id
4. `services/report_service.py` busca la categoria, crea el reporte, registra en audit_log
5. Devuelve el reporte creado con tracking_number

---

## Seguridad

- **JWT**: Al loguearse se recibe un token. Debe enviarse en cada request como `Authorization: Bearer <token>`.
- **Contrasenas**: Encriptadas con bcrypt/werkzeug.
- **Roles**:
  - `resident` - crear reportes, votar, comentar, ver stats
  - `admin` - cambiar estados, asignar reportes, borrar usuarios, ver audit logs, publicar comunicados (no puede crear reportes)

---

## Notas

- SQLite para desarrollo, MySQL para produccion (cambiar DATABASE_URL en .env)
- MongoDB debe estar corriendo en localhost:27017 para attachments y audit_logs
- `/logout` no invalida el token realmente (pendiente implementar blacklist)
- Tracking numbers: formato `CD-XXXXXXXX`
- Fechas en UTC
- Python 3.10+ con type hints
