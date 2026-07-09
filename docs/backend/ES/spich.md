
# 🥤 CokeDecide — Documentación del Backend (para dummies)

> Si no sabes qué hace cada cosa, leé esto de punta a punta.

---

## 🔄 ¿Qué es REST y cómo lo usa CokeDecide?

**REST** significa "Transferencia de Estado Representacional". En criollo:

> **Es una forma de organizar la comunicación entre el frontend y el backend usando cosas que ya existen: URLs, métodos HTTP y JSON.**

REST no es un programa ni una librería. Es un **estilo de arquitectura**, como las reglas de tránsito: todos se ponen de acuerdo en cómo pedir y devolver datos.

### Las reglas REST que sigue CokeDecide:

### 1. Todo es un "recurso" (sustantivos, no verbos)

En REST no se usan verbos en las URLs. Usás sustantivos:

| ❌ Mal (no REST) | ✅ Bien (REST) |
|-----------------|----------------|
| `/api/createReport` | `POST /api/reports` |
| `/api/deleteUser?id=5` | `DELETE /api/admin/users/5` |
| `/api/getComments` | `GET /api/reports/1/comments` |

Los recursos de CokeDecide son: `reports`, `users`, `categories`, `comments`, `votes`, `comunicados`, `stats`.

### 2. Usás los métodos HTTP para decir qué hacer

| Método | Acción | Ejemplo en CokeDecide |
|--------|--------|----------------------|
| `GET` | Leer / listar | `GET /api/reports` → trae todos los reportes |
| `POST` | Crear | `POST /api/reports` → crea un reporte nuevo |
| `PATCH` | Actualizar parcialmente | `PATCH /api/reports/5/status` → cambia solo el estado |
| `DELETE` | Borrar | `DELETE /api/admin/users/3` → borra un usuario |

### 3. Las URLs tienen jerarquía (anidadas)

```
/api/reports                  → todos los reportes
/api/reports/5                → el reporte con ID 5
/api/reports/5/vote           → votar el reporte 5
/api/reports/5/comments       → comentarios del reporte 5
/api/reports/5/status         → estado del reporte 5
/api/admin/users              → usuarios (solo admin)
/api/admin/reports/5/assign   → asignar reporte 5 (solo admin)
```

Esto se lee como **"dentro de reports, el 5, sus comentarios"**.

### 4. Las respuestas son siempre JSON

REST no mezcla HTML con datos. Todo lo que devuelve CokeDecide es JSON puro:

```json
{
  "id": 5,
  "title": "Fuga de gas",
  "status": "open",
  "tracking_number": "CD-F1G2H3J4",
  "created_at": "2026-07-09T12:00:00"
}
```

El frontend agarra ese JSON y decide cómo mostrarlo (como tarjeta, lista, etc.).

### 5. Sin estado (stateless)

Cada pedido que llega al backend contiene **toda la información necesaria**. El backend no recuerda nada de pedidos anteriores. Por eso en cada request mandás el token:

```
POST /api/reports
Authorization: Bearer TOKEN_123   ← el backend no "recuerda" quién sos
{ "title": "..." }                 ← todo lo necesario está acá
```

### Cómo se ve REST en el código de CokeDecide:

```python
# routes/reports.py

@reports_bp.route("", methods=["GET"])           # GET  /api/reports      → listar
@reports_bp.route("", methods=["POST"])          # POST /api/reports      → crear
@reports_bp.route("/<int:report_id>", methods=["GET"])  # GET /api/reports/5 → detalle
@reports_bp.route("/<int:report_id>/vote", methods=["POST"])  # POST → votar
@reports_bp.route("/<int:report_id>/comments", methods=["POST"])  # POST → comentar
@reports_bp.route("/<int:report_id>/status", methods=["PATCH"])  # PATCH → cambiar estado
```

Cada línea = una operación REST sobre el recurso `reports`.

### Resumen visual de REST en CokeDecide:

```
FRONTEND                          BACKEND (REST API)
   │                                  │
   │  GET  /api/reports               │  → devuelve lista de reportes
   │  POST /api/reports  {datos}      │  → crea y devuelve el reporte nuevo
   │  GET  /api/reports/5             │  → devuelve el reporte #5
   │  POST /api/reports/5/vote {voto} │  → registra el voto
   │  GET  /api/stats                 │  → devuelve estadísticas
   │                                  │
   └──────────────────────────────────┘
         Todo es JSON, todo es sin estado,
         todo usa métodos HTTP estándar
```

---

## 🐍 ¿Qué es Flask y dónde se usa acá?

**Flask** es un "micro-framework" de Python para hacer APIs web. En criollo:

> **Es la fábrica que convierte tu código Python en un servidor que entiende pedidos HTTP.**

Sin Flask, tus funciones de Python se quedan en tu compu y nadie puede llamarlas. Con Flask, cada función se "ata" a una URL y cualquiera puede pegarla desde el frontend, Postman o un celular.

### Los 3 archivos clave donde Flask actúa:

### 1. `app/__init__.py` — La fábrica de la app

```python
def create_app() -> Flask:
    app = Flask(__name__)              # Crea el servidor Flask
    app.config.from_object(Config)     # Le pasa la config (.env)
    db.init_app(app)                   # Conecta SQLAlchemy
    mongo.init_app(app)                # Conecta MongoDB
    migrate.init_app(app, db)          # Prepara migraciones
    jwt.init_app(app)                  # Prepara JWT
    register_blueprints(app)           # Registra todas las rutas
    return app
```

**¿Qué hace?** Prende el servidor, conecta la base de datos, registra todas las rutas y deja todo listo para recibir pedidos.

### 2. `app/extensions.py` — Las herramientas que Flask usa

```python
db = SQLAlchemy()        # Habla con MySQL/SQLite
mongo = PyMongo()        # Habla con MongoDB
migrate = Migrate()      # Controla cambios en la BD
jwt = JWTManager()       # Maneja tokens de seguridad
```

### 3. `run.py` — El botón de encendido

```python
app = create_app()
app.run(debug=False)     # Arranca el servidor en http://localhost:5000
```

### ¿Qué hace Flask cuando llega un pedido?

```
1. Llega un request:  POST /api/reports
2. Flask mira la URL ("/api/reports") y el método ("POST")
3. Flask busca en sus rutas registradas cuál coincide
4. Flask ejecuta la función de Python que corresponde
5. Flask agarra el JSON que devolvió la función y lo envía como respuesta
```

### En cada archivo de rutas (routes/), Flask se usa así:

```python
from flask import Blueprint, jsonify, request

reports_bp = Blueprint("reports", __name__, url_prefix="/api/reports")

@reports_bp.route("", methods=["POST"])       # "Atá" esta función a POST /api/reports
def create_report():
    data = request.json                        # Flask agarra el body del request
    # ... lógica ...
    return jsonify(report.to_dict()), 201      # Flask convierte a JSON y lo devuelve
```

### Resumen fácil:

| Archivo | Rol de Flask |
|---------|-------------|
| `app/__init__.py` | Crea y configura el servidor |
| `app/extensions.py` | Conecta BD, JWT, migraciones |
| `app/routes/*.py` | Ata funciones a URLs |
| `app/middleware/auth.py` | Intercepta requests para verificar tokens |
| `run.py` | Arranca todo |

**Sin Flask, esto sería un montón de funciones Python que nadie puede llamar. Con Flask, cada función se convierte en un endpoint accesible desde internet.**

---

## 🤔 ¿Qué es una API y cómo funciona?

**API** significa "Interfaz de Programación de Aplicaciones". En criollo:

> **Es un mozo de restaurante.** Vos (el frontend / la app) le pedís algo, el mozo (la API) va a la cocina (la base de datos), prepara tu pedido y te lo trae de vuelta.

### Anatomía de un pedido (request):

```
POST /api/reports  HTTP/1.1
Host: localhost:5000
Authorization: Bearer TOKEN_123
Content-Type: application/json

{
  "title": "Se rompió la puerta",
  "description": "La puerta del edificio no cierra",
  "category_id": 1
}
```

Cada pedido tiene:
- **Método HTTP**: la acción que querés hacer
  - `GET` → **leer** / obtener datos
  - `POST` → **crear** algo nuevo
  - `PATCH` → **actualizar** / modificar algo existente
  - `DELETE` → **borrar** algo
- **URL**: a dónde pegás (ej: `/api/reports`)
- **Headers**: datos extra como el token de autenticación
- **Body**: el contenido del pedido (en formato JSON)

### Lo que devuelve la API (response):

```json
{
  "id": 1,
  "title": "Se rompió la puerta",
  "status": "open",
  "tracking_number": "CD-A1B2C3D4",
  "created_at": "2026-07-09T..."
}
```

Siempre viene con un **código de estado HTTP**:
| Código | Significado |
|--------|-------------|
| `200` | ✅ OK (todo bien) |
| `201` | ✅ Creado (se creó algo nuevo) |
| `400` | ❌ Datos inválidos (mandaste cualquier cosa) |
| `401` | ❌ No autenticado (falta token o es inválido) |
| `403` | ❌ Prohibido (no tenés permisos, ej: no sos admin) |
| `404` | ❌ No encontrado (lo que buscas no existe) |
| `409` | ❌ Conflicto (ej: email ya registrado) |

### ¿Quién usa esta API?

Cualquier cosa que hable HTTP:
- El **frontend** de CokeDecide (la página web)
- **Postman** / **Insomnia** (apps para probar APIs)
- **cURL** (comandos en terminal)
- **Apps móviles** (si se conectan al mismo backend)

---

## 🌐 Los endpoints (el menú del restaurante)

## 📁 Árbol de Carpetas (como se ve en el disco)

```
apps/backend/
├── run.py                          # 🟢 ARRANCA EL SERVIDOR (el "botón de encendido")
├── requirements.txt                # Lista de librerías que necesita el proyecto
├── .env                            # Configuración secreta (base de datos, claves)
├── .env.example                    # Plantilla del .env (para saber qué poner)
│
└── app/                            # 🌟 EL CORAZÓN DEL BACKEND
    ├── __init__.py                 # Crea y configura la aplicación Flask
    ├── config.py                   # Lee el .env y guarda la configuración
    ├── extensions.py               # Inicializa las herramientas (SQLAlchemy, JWT, etc.)
    ├── constants.py                # Constantes boludas como el nombre "CokeDecide"
    │
    ├── models/                     # 🗄️ DEFINICIÓN DE TABLAS DE LA BASE DE DATOS
    │   ├── __init__.py             #   Importa todos los modelos
    │   ├── user.py                 #   Tabla: usuarios (residentes y admins)
    │   ├── report.py               #   Tabla: reportes (problemas que reporta la gente)
    │   ├── category.py             #   Tabla: categorías (infraestructura, convivencia)
    │   ├── comment.py              #   Tabla: comentarios (la gente opina)
    │   ├── vote.py                 #   Tabla: votos (me gusta / no me gusta)
    │   └── comunicado.py           #   Tabla: comunicados (anuncios oficiales)
    │
    ├── routes/                     # 🌐 ENDPOINTS (las URLs que llamás desde el frontend)
    │   ├── __init__.py             #   Registra todos los blueprints (conecta las rutas)
    │   ├── hello.py                #   GET /api/hello → "todo funciona?"
    │   ├── auth.py                 #   POST /api/auth/register, /login, /me, /logout
    │   ├── reports.py              #   CRUD de /api/reports (crear, listar, votar, comentar)
    │   ├── comunicados.py          #   GET/POST /api/comunicados
    │   ├── stats.py                #   GET /api/stats → estadísticas
    │   └── admin.py                #   Solo admins: listar users, borrar, asignar, audit logs
    │
    ├── services/                   # 🧠 LÓGICA DE NEGOCIO (la inteligencia)
    │   ├── auth_service.py         #   Registro, login, hashear contraseñas
    │   ├── report_service.py       #   Crear reportes, cambiar estado, votar, comentar
    │   └── stats_service.py        #   Contar reportes por estado, por categoría
    │
    ├── schemas/                    # ✅ VALIDACIÓN (control de calidad de datos)
    │   ├── auth_schema.py          #   Register, Login (qué campos son obligatorios)
    │   ├── report_schema.py        #   Crear reporte, cambiar estado, votar, comentar
    │   └── user_schema.py          #   Perfil de usuario
    │
    ├── middleware/                 # 🚪 SEGURIDAD (lo que se ejecuta antes de cada ruta)
    │   └── auth.py                 #   Decoradores: @login_required, @admin_required
    │
    ├── mongo/                      # 📄 MONGO (base de datos documentos — archivos, logs)
    │   ├── __init__.py             #   Exporta Attachment y AuditLog
    │   ├── attachment.py           #   Metadatos de archivos/imágenes que sube la gente
    │   └── audit_log.py            #   Registro de auditoría (quién hizo qué, cuándo)
    │
    └── utils/                      # 🔧 UTILIDADES (herramientitas)
        ├── git.py                  #   Lee el commit actual de Git (para mostrarlo)
        └── logger.py               #   Sistema de logs con colores y tags

migrations/                         # 🗃️ HISTORIAL DE CAMBIOS DE LA BASE DE DATOS
└── versions/                       #   Cada archivo = un cambio en la BD
    ├── dcd3654559b7_initial...     #   Migración inicial (crea todas las tablas)
    └── 960c944b52d3_add_comunicado #   Agrega tabla comunicados
    └── 7c538bc046e5_add_indexes... #   Agrega índices a comentarios y votos
    └── b701b7850ea5_add_assigned.. #   Agrega columna assigned_to a reports

instance/
└── cokedecide.db                   # 💾 BASE DE DATOS SQLite (archivo local)
```

---

## 🚀 Cómo arrancar el backend

```bash
# 1. Pararse en la carpeta del backend
cd apps/backend

# 2. Instalar dependencias (solo la primera vez)
pip install -r requirements.txt

# 3. Crear el .env (si no existe)
cp .env.example .env

# 4. Inicializar/actualizar la base de datos
flask db upgrade

# 5. PRENDERLO 🔥
python run.py
```

El servidor arranca en `http://localhost:5000`. Vas a ver un banner gigante de CokeDecide en la terminal.

---

## 🌐 Todos los endpoints (las URLs que existen)

### GET `/api/hello`
**Sirve para:** Probar que el servidor está vivo.
**Respuesta:** `{"message": "Hello, CokeDecide!"}`

---

### POST `/api/auth/register`
**Sirve para:** Crear una cuenta nueva.
**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@mail.com",
  "password": "123456",
  "apartment": "3B",
  "tower": "Torre A"
}
```
**Respuesta:** Te devuelve tus datos + un token (como una credencial para después).

---

### POST `/api/auth/login`
**Sirve para:** Iniciar sesión.
**Body:**
```json
{
  "email": "juan@mail.com",
  "password": "123456"
}
```
**Respuesta:** Tus datos + token.

---

### GET `/api/auth/me`
**Requerido:** Token en el header.
**Sirve para:** Obtener tu perfil.

---

### POST `/api/auth/logout`
**Requerido:** Token.
**Sirve para:** Cerrar sesión. No invalida el token realmente (solo avisa).

---

### GET `/api/reports`
**Requerido:** Token.
**Sirve para:** Listar reportes.
**Query params:** `?page=1&per_page=20&status=open&category_id=2&user_id=1`

---

### POST `/api/reports`
**Requerido:** Token.
**Sirve para:** Crear un reporte.
**Body:**
```json
{
  "title": "Filtración de agua",
  "description": "Se inunda el pasillo del 3er piso",
  "category_id": 1,
  "location": "Torre A, piso 3"
}
```

---

### GET `/api/reports/:id`
**Requerido:** Token.
**Sirve para:** Ver un reporte en detalle (con votos y comentarios).

---

### PATCH `/api/reports/:id/status`
**Requerido:** Token de **admin**.
**Sirve para:** Cambiar el estado del reporte (open → in_progress → resolved → closed).
**Body:**
```json
{ "status": "in_progress" }
```

---

### POST `/api/reports/:id/vote`
**Requerido:** Token.
**Sirve para:** Votar un reporte (up = a favor, down = en contra).
**Body:**
```json
{ "vote_type": "up" }
```
**Regla:** Un usuario solo puede votar una vez por reporte.

---

### POST `/api/reports/:id/comments`
**Requerido:** Token.
**Sirve para:** Comentar un reporte.
**Body:**
```json
{ "body": "Yo también vi esto, es peligroso" }
```

---

### GET `/api/stats`
**Requerido:** Token.
**Sirve para:** Ver estadísticas (total reportes, por estado, por categoría).

---

### GET `/api/comunicados`
**NO requiere token.**
**Sirve para:** Ver anuncios oficiales (los ve cualquiera).

---

### POST `/api/comunicados`
**Requerido:** Token de **admin**.
**Sirve para:** Publicar un anuncio.
**Body:**
```json
{
  "title": "Corte de agua",
  "body": "Mañana no hay agua de 8am a 2pm"
}
```

---

### GET `/api/admin/users`
**Requerido:** Token de **admin**.
**Sirve para:** Listar todos los usuarios.

---

### DELETE `/api/admin/users/:id`
**Requerido:** Token de **admin**.
**Sirve para:** Borrar un usuario. Queda registrado en audit logs.

---

### GET `/api/admin/audit-logs`
**Requerido:** Token de **admin**.
**Sirve para:** Ver el historial de acciones (quién creó qué, cuándo).

---

### PATCH `/api/admin/reports/:id/assign`
**Requerido:** Token de **admin**.
**Sirve para:** Asignar un reporte a un usuario responsable.
**Body:**
```json
{ "user_id": 3 }
```

---

## 🗄️ Las tablas de la base de datos (MySQL/SQLite)

### `users` (usuarios)
| Campo | ¿Qué guarda? |
|-------|-------------|
| id | Número único del usuario |
| name | Nombre completo |
| email | Correo (no se puede repetir) |
| password_hash | Contraseña encriptada (nadie la ve) |
| role | "resident" o "admin" |
| apartment | N° de apartamento |
| tower | Torre donde vive |
| created_at | Cuándo se registró |
| updated_at | Última modificación |

### `categories` (categorías)
| Campo | ¿Qué guarda? |
|-------|-------------|
| id | Número único |
| name | Nombre (ej: "Fugas de agua") |
| type | "infrastructure" o "coexistence" |
| description | Descripción opcional |

### `reports` (reportes de problemas)
| Campo | ¿Qué guarda? |
|-------|-------------|
| id | Número único |
| title | Título corto del problema |
| description | Descripción larga |
| status | "open", "in_progress", "resolved", "closed" |
| tracking_number | Código único tipo CD-XXXXXXXX |
| location | Dónde ocurre |
| category_id | FK → categories |
| user_id | FK → users (quién reportó) |
| assigned_to | FK → users (a quién se asignó, opcional) |
| created_at | Cuándo se creó |
| updated_at | Última modificación |

### `comments` (comentarios)
| Campo | ¿Qué guarda? |
|-------|-------------|
| id | Número único |
| body | Texto del comentario |
| user_id | FK → users (quién comenta) |
| report_id | FK → reports (en qué reporte) |
| created_at / updated_at | Fechas |

### `votes` (votos)
| Campo | ¿Qué guarda? |
|-------|-------------|
| id | Número único |
| vote_type | "up" (a favor) o "down" (en contra) |
| user_id | FK → users |
| report_id | FK → reports |
| created_at | Cuándo votó |

**Regla:** Un usuario NO puede votar dos veces el mismo reporte.

### `comunicados` (anuncios oficiales)
| Campo | ¿Qué guarda? |
|-------|-------------|
| id | Número único |
| title | Título del anuncio |
| body | Contenido |
| author_id | FK → users (admin que lo publicó) |
| created_at / updated_at | Fechas |

---

## 📄 MongoDB (base de datos aparte para archivos y logs)

MongoDB guarda cosas que no son tablitas ordenadas, sino documentos sueltos.

### `attachments` (archivos adjuntos)
Cada documento tiene: id, report_id (a qué reporte pertenece), file_name, file_url, file_type, file_size, uploaded_by (quién lo subió), created_at.

### `audit_logs` (registro de actividad)
Cada documento tiene: id, user_id (quién hizo la acción), action (create, update, delete, status_change), entity_type (report, comment, user), entity_id, details (info extra), ip_address, created_at.

**Esto es útil para saber:** ¿Quién borró qué? ¿Cuándo? ¿Por qué?

---

## 🧠 Cómo se conectan las piezas (flujo de una petición)

```
Frontend (JS/React)
    │
    ▼
🌐 RUTA (routes/archivo.py)
    │  Recibe la URL, valida que el token sea válido (middleware)
    │  Pasa los datos al Schema para validar que estén completos
    ▼
✅ SCHEMA (schemas/archivo.py)
    │  Revisa: "el título es obligatorio? el email es válido?" etc
    │  Si algo falla, devuelve error 400
    ▼
🧠 SERVICE (services/archivo.py)
    │  Hace la lógica pesada: crear, consultar, actualizar
    │  Habla con los modelos (SQLAlchemy) y con MongoDB
    ▼
🗄️ MODELO (models/archivo.py)
    │  Guarda o lee de la base de datos SQLite/MySQL
    ▼
📦 Respuesta JSON  ←  vuelve al frontend
```

**Ejemplo concreto:** "Juan crea un reporte desde la app"
1. El frontend llama `POST /api/reports` con token + datos
2. `middleware/auth.py` revisa que el token sea válido → pone a Juan en `request.current_user`
3. `schemas/report_schema.py` revisa que título, descripción y categoría estén OK
4. `services/report_service.py` busca la categoría en BD, crea el reporte, y guarda en audit_logs que Juan creó un reporte
5. Devuelve el reporte creado con su número de seguimiento

---

## 🔐 Seguridad

- **Tokens JWT**: Cuando te logueás, recibís un token. Ese token lo tenés que mandar en cada request como header `Authorization: Bearer <token>`.
- **Contraseñas**: Se guardan encriptadas con bcrypt/werkzeug (nadie puede leer tu contraseña, ni siquiera el admin).
- **Roles**: Hay dos tipos de usuario:
  - `resident` → puede crear reportes, votar, comentar, ver stats
  - `admin` → puede cambiar estados, asignar reportes, borrar usuarios, ver audit logs, crear comunicados

---

## ⚠️ Cosas a tener en cuenta

- **SQLite** se usa para desarrollo (archivo local `instance/cokedecide.db`). Para producción hay que cambiar a MySQL en el `.env`.
- **MongoDB** tiene que estar corriendo en `localhost:27017` para que funcionen attachments y audit_logs. Si no, esas partes fallan.
- El endpoint `/logout` no invalida el token realmente (el token sigue sirviendo hasta que expire). Para hacerlo bien falta implementar una blacklist.
- **No hay tests** todavía (archivos de prueba).
- **No hay seed data** (datos de ejemplo para probar, como categorías precargadas).

---

## 📝 Notas finales

- Todo el código usa **Python 3.10+** con type hints (los `: str`, `-> dict`, etc.)
- Las fechas siempre están en **UTC** (hora universal)
- Los números de seguimiento se generan así: `CD-A1B2C3D4` (CD = CokeDecide + 8 letras/números aleatorios)
- Si querés probar los endpoints sin frontend, podés usar **Postman**, **Insomnia** o  **curl**
