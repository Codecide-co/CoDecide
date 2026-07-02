# Seguimiento del Backend — Brandon Carranza

## Fecha: 02 de Julio de 2026

---

## 1. Dependencias (`requirements.txt`)

### Antes
```
flask
flask-sqlalchemy
flask-migrate
flask-pymongo
pymongo
pymysql
python-dotenv
flask-babel
colorama
```

### Después
```
flask
flask-sqlalchemy
flask-migrate
flask-pymongo
flask-jwt-extended
pymongo
pymysql
python-dotenv
flask-babel
colorama
marshmallow
bcrypt
```

### Dependencias agregadas
| Paquete | Propósito |
|---------|-----------|
| `flask-jwt-extended` | Generación y validación de tokens JWT para autenticación |
| `marshmallow` | Serialización y validación de datos en requests/responses |
| `bcrypt` | Hashing seguro de contraseñas |

---

## 2. Extensiones Flask (`app/extensions.py`)

### Código nuevo
```python
from flask_babel import Babel
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_pymongo import PyMongo
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
mongo = PyMongo()
migrate = Migrate()
jwt = JWTManager()
babel = Babel()
```

### Cambios
- Agregado `Migrate()` para manejo de migraciones con Alembic
- Agregado `JWTManager()` para autenticación JWT
- Agregado `Babel()` para internacionalización

---

## 3. Fábrica de Aplicación (`app/__init__.py`)

### Código nuevo
```python
from flask import Flask

from app.config import Config
from app.extensions import babel, db, jwt, migrate, mongo
from app.routes import register_blueprints


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    mongo.init_app(app, uri=Config.MONGO_URI)
    migrate.init_app(app, db)
    jwt.init_app(app)
    babel.init_app(app)

    register_blueprints(app)

    return app
```

### Cambios
- Se inicializan las nuevas extensiones (`migrate`, `jwt`, `babel`)
- Se removió `db.create_all()` ya que usamos Flask-Migrate para crear tablas

---

## 4. Modelos SQLAlchemy (MySQL)

### 4.1 User (`app/models/user.py`)

```python
from datetime import datetime, timezone

from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(100), nullable=False)
    email: Mapped[str] = mapped_column(db.String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(db.String(255), nullable=False)
    role: Mapped[str] = mapped_column(
        SAEnum("resident", "admin", name="user_role"),
        nullable=False,
        default="resident",
    )
    apartment: Mapped[str | None] = mapped_column(db.String(20))
    tower: Mapped[str | None] = mapped_column(db.String(10))
    created_at: Mapped[datetime] = mapped_column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relaciones
    reports: Mapped[list["Report"]] = relationship(
        "Report", back_populates="author", lazy="dynamic"
    )
    comments: Mapped[list["Comment"]] = relationship(
        "Comment", back_populates="author", lazy="dynamic"
    )
    votes: Mapped[list["Vote"]] = relationship(
        "Vote", back_populates="user", lazy="dynamic"
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "apartment": self.apartment,
            "tower": self.tower,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
```

**Campos:**
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| `id` | Integer | PK, autoincrement |
| `name` | String(100) | NOT NULL |
| `email` | String(120) | UNIQUE, NOT NULL |
| `password_hash` | String(255) | NOT NULL |
| `role` | Enum('resident','admin') | NOT NULL, default='resident' |
| `apartment` | String(20) | Nullable |
| `tower` | String(10) | Nullable |
| `created_at` | DateTime | NOT NULL, default=utcnow |
| `updated_at` | DateTime | NOT NULL, default=utcnow, onupdate=utcnow |

**Relaciones:** reports, comments, votes

---

### 4.2 Category (`app/models/category.py`)

```python
from datetime import datetime, timezone

from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db


class Category(db.Model):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(100), nullable=False)
    type: Mapped[str] = mapped_column(
        SAEnum("infrastructure", "coexistence", name="category_type"),
        nullable=False,
    )
    description: Mapped[str | None] = mapped_column(db.String(255))
    created_at: Mapped[datetime] = mapped_column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    # Relaciones
    reports: Mapped[list["Report"]] = relationship(
        "Report", back_populates="category", lazy="dynamic"
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "description": self.description,
            "created_at": self.created_at.isoformat(),
        }
```

**Campos:**
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| `id` | Integer | PK, autoincrement |
| `name` | String(100) | NOT NULL |
| `type` | Enum('infrastructure','coexistence') | NOT NULL |
| `description` | String(255) | Nullable |
| `created_at` | DateTime | NOT NULL, default=utcnow |

**Relaciones:** reports

---

### 4.3 Report (`app/models/report.py`)

```python
import uuid
from datetime import datetime, timezone

from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db


class Report(db.Model):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(db.String(200), nullable=False)
    description: Mapped[str] = mapped_column(db.Text, nullable=False)
    status: Mapped[str] = mapped_column(
        SAEnum("open", "in_progress", "resolved", "closed", name="report_status"),
        nullable=False,
        default="open",
    )
    tracking_number: Mapped[str] = mapped_column(db.String(20), unique=True, nullable=False)
    location: Mapped[str | None] = mapped_column(db.String(255))

    # Foreign Keys
    category_id: Mapped[int] = mapped_column(db.ForeignKey("categories.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(db.ForeignKey("users.id"), nullable=False)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relaciones
    author: Mapped["User"] = relationship("User", back_populates="reports")
    category: Mapped["Category"] = relationship("Category", back_populates="reports")
    comments: Mapped[list["Comment"]] = relationship(
        "Comment", back_populates="report", lazy="dynamic"
    )
    votes: Mapped[list["Vote"]] = relationship(
        "Vote", back_populates="report", lazy="dynamic"
    )

    @staticmethod
    def generate_tracking_number() -> str:
        """Genera un número de seguimiento único para el reporte."""
        return f"CD-{uuid.uuid4().hex[:8].upper()}"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "tracking_number": self.tracking_number,
            "location": self.location,
            "category_id": self.category_id,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
```

**Campos:**
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| `id` | Integer | PK, autoincrement |
| `title` | String(200) | NOT NULL |
| `description` | Text | NOT NULL |
| `status` | Enum('open','in_progress','resolved','closed') | NOT NULL, default='open' |
| `tracking_number` | String(20) | UNIQUE, NOT NULL |
| `location` | String(255) | Nullable |
| `category_id` | Integer | FK→categories.id, NOT NULL |
| `user_id` | Integer | FK→users.id, NOT NULL |
| `created_at` | DateTime | NOT NULL, default=utcnow |
| `updated_at` | DateTime | NOT NULL, default=utcnow, onupdate=utcnow |

**Método estático:** `generate_tracking_number()` — genera IDs tipo `CD-XXXXXXXX`

**Relaciones:** author (User), category (Category), comments, votes

---

### 4.4 Comment (`app/models/comment.py`)

```python
from datetime import datetime, timezone

from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db


class Comment(db.Model):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True)
    body: Mapped[str] = mapped_column(db.Text, nullable=False)

    # Foreign Keys
    user_id: Mapped[int] = mapped_column(db.ForeignKey("users.id"), nullable=False)
    report_id: Mapped[int] = mapped_column(db.ForeignKey("reports.id"), nullable=False)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relaciones
    author: Mapped["User"] = relationship("User", back_populates="comments")
    report: Mapped["Report"] = relationship("Report", back_populates="comments")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "body": self.body,
            "user_id": self.user_id,
            "report_id": self.report_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
```

**Campos:**
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| `id` | Integer | PK, autoincrement |
| `body` | Text | NOT NULL |
| `user_id` | Integer | FK→users.id, NOT NULL |
| `report_id` | Integer | FK→reports.id, NOT NULL |
| `created_at` | DateTime | NOT NULL, default=utcnow |
| `updated_at` | DateTime | NOT NULL, default=utcnow, onupdate=utcnow |

**Relaciones:** author (User), report (Report)

---

### 4.5 Vote (`app/models/vote.py`)

```python
from datetime import datetime, timezone

from sqlalchemy import Enum as SAEnum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db


class Vote(db.Model):
    __tablename__ = "votes"

    id: Mapped[int] = mapped_column(primary_key=True)
    vote_type: Mapped[str] = mapped_column(
        SAEnum("up", "down", name="vote_type"),
        nullable=False,
    )

    # Foreign Keys
    user_id: Mapped[int] = mapped_column(db.ForeignKey("users.id"), nullable=False)
    report_id: Mapped[int] = mapped_column(db.ForeignKey("reports.id"), nullable=False)

    # Timestamp
    created_at: Mapped[datetime] = mapped_column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    # Relaciones
    user: Mapped["User"] = relationship("User", back_populates="votes")
    report: Mapped["Report"] = relationship("Report", back_populates="votes")

    # Constraint: un usuario solo puede votar una vez por reporte
    __table_args__ = (
        UniqueConstraint("user_id", "report_id", name="uq_user_report_vote"),
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "vote_type": self.vote_type,
            "user_id": self.user_id,
            "report_id": self.report_id,
            "created_at": self.created_at.isoformat(),
        }
```

**Campos:**
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| `id` | Integer | PK, autoincrement |
| `vote_type` | Enum('up','down') | NOT NULL |
| `user_id` | Integer | FK→users.id, NOT NULL |
| `report_id` | Integer | FK→reports.id, NOT NULL |
| `created_at` | DateTime | NOT NULL, default=utcnow |

**Constraint único:** `uq_user_report_vote` — un usuario solo puede votar una vez por reporte

**Relaciones:** user (User), report (Report)

---

## 5. Modelos MongoDB

### 5.1 Attachment (`mongo/attachment.py`)

```python
from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId

from app.extensions import mongo


class Attachment:
    """Metadatos de archivos adjuntos almacenados en MongoDB."""

    collection = mongo.db.attachments

    @classmethod
    def create(cls, report_id, file_name, file_url, file_type, file_size, uploaded_by) -> dict
    @classmethod
    def find_by_report(cls, report_id: int) -> list[dict]
    @classmethod
    def find_by_id(cls, attachment_id: str) -> Optional[dict]
    @classmethod
    def delete_by_report(cls, report_id: int) -> int
    @classmethod
    def to_dict(cls, doc: dict) -> dict
```

**Campos del documento:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | ObjectId | Identificador único de MongoDB |
| `report_id` | int | ID del reporte asociado |
| `file_name` | str | Nombre original del archivo |
| `file_url` | str | URL o ruta del archivo |
| `file_type` | str | Tipo: image, pdf, video |
| `file_size` | int | Tamaño en bytes |
| `uploaded_by` | int | ID del usuario que subió |
| `created_at` | datetime | Fecha de creación |

**Métodos:** create, find_by_report, find_by_id, delete_by_report, to_dict

---

### 5.2 AuditLog (`mongo/audit_log.py`)

```python
from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId

from app.extensions import mongo


class AuditLog:
    """Registro de actividad inmutable para transparencia."""

    collection = mongo.db.audit_logs

    @classmethod
    def create(cls, user_id, action, entity_type, entity_id, details=None, ip_address=None) -> dict
    @classmethod
    def find_by_entity(cls, entity_type: str, entity_id: int) -> list[dict]
    @classmethod
    def find_by_user(cls, user_id: int, limit: int = 50) -> list[dict]
    @classmethod
    def find_all(cls, limit: int = 100) -> list[dict]
    @classmethod
    def to_dict(cls, doc: dict) -> dict
```

**Campos del documento:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | ObjectId | Identificador único de MongoDB |
| `user_id` | int | ID del usuario que realizó la acción |
| `action` | str | Tipo de acción: create, update, delete, login, status_change |
| `entity_type` | str | Entidad afectada: report, comment, user |
| `entity_id` | int | ID de la entidad afectada |
| `details` | dict | Detalles adicionales de la acción |
| `ip_address` | str | Dirección IP del usuario |
| `created_at` | datetime | Fecha de creación |

**Métodos:** create, find_by_entity, find_by_user, find_all, to_dict

---

## 6. Migraciones (`migrations/`)

### Archivo generado
`migrations/versions/dcd3654559b7_initial_migration_with_all_models.py`

### Tablas creadas
```
alembic_version → version_num
categories      → id, name, type, description, created_at
comments        → id, body, user_id, report_id, created_at, updated_at
reports         → id, title, description, status, tracking_number, location, category_id, user_id, created_at, updated_at
users           → id, name, email, password_hash, role, apartment, tower, created_at, updated_at
votes           → id, vote_type, user_id, report_id, created_at
```

### Comandos ejecutados
```bash
flask db init                    # Inicializar Alembic
flask db migrate -m "initial..." # Generar migración
flask db upgrade                 # Aplicar migración
```

---

## 7. Archivos creados/modificados (resumen)

| Archivo | Acción | Líneas |
|---------|--------|--------|
| `requirements.txt` | Modificado | 12 |
| `app/extensions.py` | Modificado | 13 |
| `app/__init__.py` | Modificado | 18 |
| `app/models/user.py` | Reescrito | 57 |
| `app/models/category.py` | **Nuevo** | 38 |
| `app/models/report.py` | **Nuevo** | 76 |
| `app/models/comment.py` | **Nuevo** | 44 |
| `app/models/vote.py` | **Nuevo** | 50 |
| `app/models/__init__.py` | Modificado | 8 |
| `mongo/attachment.py` | **Nuevo** | 107 |
| `mongo/audit_log.py` | **Nuevo** | 107 |
| `mongo/__init__.py` | Modificado | 5 |
| `migrations/versions/...py` | **Nuevo** | Auto-generado |

---

## 8. Notas técnicas

- Todos los modelos usan **SQLAlchemy 2.x** con `Mapped[]` y `mapped_column()`
- Todas las fechas usan **UTC** con `datetime.now(timezone.utc)`
- El `tracking_number` de Report se genera con UUID (formato `CD-XXXXXXXX`)
- MongoDB usa **pymongo** a través de Flask-PyMongo
- Los modelos MongoDB son **clases Python** con métodos de clase estáticos (no ORM)
- La migración fue aplicada exitosamente con SQLite para pruebas
- Para producción: cambiar `DATABASE_URL` en `.env` a MySQL
