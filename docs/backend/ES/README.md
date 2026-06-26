# Arquitectura del Backend

## Visión General

API REST construida con **Flask** (Python). Usa **MySQL** para datos relacionales (usuarios, reportes, categorías, votos, comentarios) y **MongoDB** para almacenamiento de documentos (metadatos de adjuntos, logs de auditoría, historial de actividad).

Todo el código Python debe incluir **type hints** y **docstrings**.

## Estructura de Directorios

```
app/
├── __init__.py           # Fábrica de aplicación (create_app)
├── config.py             # Configuración por entorno (dev, prod, test)
├── extensions.py         # Inicialización de extensiones Flask (SQLAlchemy, PyMongo, Migrate)
├── models/               # Modelos ORM de SQLAlchemy
│   ├── user.py           # Modelo User (id, nombre, email, password, rol, apto, torre)
│   ├── report.py         # Modelo Report (título, descripción, categoría, estado, evidencia)
│   ├── category.py       # Modelo Category (nombre, tipo: infraestructura|convivencia)
│   ├── comment.py        # Modelo Comment (cuerpo, autor, reporte, marcas de tiempo)
│   └── vote.py           # Modelo Vote (usuario, reporte, tipo_voto: a_favor|en_contra)
├── routes/               # Blueprints de Flask (controladores)
│   ├── auth.py           # POST /login, /register, /logout, /me
│   ├── reports.py        # CRUD /reports, PATCH /reports/:id/status
│   ├── comunicados.py    # CRUD /comunicados
│   ├── stats.py          # GET /stats (métricas, gráficos)
│   └── admin.py          # Endpoints solo para administradores
├── services/             # Capa de lógica de negocio
│   ├── auth_service.py   # Hashing de contraseñas, generación/validación de JWT
│   ├── report_service.py # Creación de reportes, transiciones de estado, lógica de votación
│   └── stats_service.py  # Consultas de agregación, cálculo de métricas
├── schemas/              # Serialización y validación de peticiones/respuestas
│   ├── auth_schema.py    # Schemas Marshmallow para payloads de login/register
│   ├── report_schema.py  # Serializadores para creación, actualización y listado de reportes
│   └── user_schema.py    # Serialización del perfil de usuario
├── middleware/            # Interceptores de peticiones (decoradores)
│   └── auth.py           # Decoradores @login_required, @admin_required
mongo/                    # Modelos/schemas de MongoDB
│   ├── __init__.py
│   ├── attachment.py     # Metadatos de imágenes/archivos almacenados en MongoDB
│   └── audit_log.py      # Registro de actividad y trazabilidad
migrations/               # Archivos de migración Flask-Migrate (Alembic)
requirements.txt
run.py                    # Punto de entrada del servidor de desarrollo
```

## Responsabilidades por Capa

### `models/` (SQLAlchemy)
- Definen las tablas de la base de datos como clases de Python
- Incluyen relaciones, índices y restricciones
- Un modelo por archivo, nombrado según la entidad

### `routes/` (Blueprints)
- Manejan peticiones HTTP y retornan respuestas
- Validan la entrada mediante schemas antes de pasar a los servicios
- Nunca contienen lógica de negocio — delegan en los servicios
- Un blueprint por dominio de recurso

### `services/`
- Contienen toda la lógica de negocio
- Orquestan modelos, llamadas externas y transacciones
- Lanzan excepciones personalizadas para el manejo de errores

### `schemas/` (Marshmallow)
- Serializan/deserializan datos de peticiones y respuestas
- Validan la estructura y tipos del payload
- Garantizan un contrato de API consistente

### `middleware/`
- Funciones decoradoras para aspectos transversales
- Autenticación, autorización, logging de peticiones

### `mongo/`
- Schemas y helpers para operaciones con documentos MongoDB
- Usado para datos no relacionales: metadatos de archivos, logs de auditoría

## Estándares de Codificación

### Type Hints
Toda firma de función debe incluir anotaciones de tipo:

```python
from typing import Optional

def create_report(title: str, description: str, user_id: int, category_id: int, evidence: Optional[list[str]] = None) -> Report:
    ...
```

### Docstrings
Todo módulo, clase y función debe tener un docstring:

```python
def create_report(title: str, description: str, user_id: int, ...) -> Report:
    """
    Crea un nuevo reporte.

    Valida la categoría, asigna un número de seguimiento y
    persiste el reporte en la base de datos.

    Args:
        title: Título del reporte (máx. 200 caracteres).
        description: Descripción detallada del problema.
        user_id: ID del usuario que reporta.
        category_id: ID de la categoría asignada.

    Returns:
        La instancia del Reporte recién creado.

    Raises:
        ValidationError: Si la categoría no existe o
            el usuario no está autorizado.
    """
```

## Endpoints de la API

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrar un nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión, retorna JWT | No |
| GET | `/api/auth/me` | Obtener perfil del usuario actual | Sí |
| GET | `/api/reports` | Listar reportes (filtros, paginación) | Sí |
| POST | `/api/reports` | Crear un reporte | Sí |
| GET | `/api/reports/:id` | Obtener detalle del reporte | Sí |
| PATCH | `/api/reports/:id/status` | Actualizar estado del reporte | Admin |
| POST | `/api/reports/:id/vote` | Votar un reporte | Sí |
| POST | `/api/reports/:id/comments` | Agregar un comentario | Sí |
| GET | `/api/stats` | Obtener métricas comunitarias | Sí |
| GET | `/api/comunicados` | Listar comunicados oficiales | No |
| POST | `/api/comunicados` | Publicar un comunicado | Admin |

## Diseño de Base de Datos

### MySQL (relacional)
- `users` — residentes y administradores
- `reports` — problemas de infraestructura y convivencia
- `categories` — clasificación de reportes
- `comments` — discusión en hilos sobre reportes
- `votes` — votación comunitaria sobre reportes

### MongoDB (documentos)
- `attachments` — metadatos de imágenes/archivos vinculados a reportes
- `audit_logs` — registro de actividad inmutable para transparencia
