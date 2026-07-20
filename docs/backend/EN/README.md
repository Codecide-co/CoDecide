# Backend - CoDecide

Backend documentation.

---

## Index

- [Overview](#overview)
- [Structure](#structure)
- [Layer responsibilities](#layer-responsibilities)
- [Coding standards](#coding-standards)
- [Running the backend](#running-the-backend)
- [Endpoints](api/)
- [Database (MySQL/SQLite)](#database-mysqlsqlite)
- [MongoDB](#mongodb)
- [Request flow](#request-flow)
- [Security](#security)
- [Notes](#notes)

---

## Overview

REST API built with **Flask** (Python). Uses **MySQL** for relational data (users, reports, categories, votes, comments) and **MongoDB** for document storage (attachment metadata, audit logs, activity history).

All Python code must include **type hints** and **docstrings**.

---

## Structure

```
apps/backend/
├── run.py                          # Entry point
├── requirements.txt                # Dependencies
├── .env.example                    # Config template
│
└── app/
    ├── __init__.py                 # App factory (create_app)
    ├── config.py                   # Environment config
    ├── extensions.py               # Extension init (SQLAlchemy, JWT, etc.)
    ├── constants.py                # Constants
    │
    ├── models/                     # SQLAlchemy models (tables)
    │   ├── user.py                 # Users
    │   ├── report.py               # Reports
    │   ├── category.py             # Categories
    │   ├── comment.py              # Comments
    │   ├── vote.py                 # Votes
    │   └── comunicado.py           # Official announcements
    │
    ├── routes/                     # Endpoints (blueprints)
    │   ├── hello.py                # Health check
    │   ├── auth.py                 # Authentication
    │   ├── reports.py              # Reports CRUD
    │   ├── comunicados.py          # Announcements
    │   ├── stats.py                # Statistics
    │   └── admin.py                # Administration
    │
    ├── services/                   # Business logic
    │   ├── auth_service.py
    │   ├── report_service.py
    │   └── stats_service.py
    │
    ├── schemas/                    # Marshmallow validation
    │   ├── auth_schema.py
    │   ├── report_schema.py
    │   └── user_schema.py
    │
    ├── middleware/                  # Security decorators
    │   └── auth.py                 # @login_required, @admin_required
    │
    ├── mongodb/                    # MongoDB models
    │   ├── attachment.py           # File metadata
    │   └── audit_log.py            # Audit trail
    │
    └── utils/
        ├── git.py                  # Current Git commit
        └── logger.py               # Logging

migrations/                         # Alembic migrations
instance/
└── codecide.db                   # Local SQLite DB (development)
```

---

## Layer responsibilities

### models/ (SQLAlchemy)
- Define database tables as Python classes
- Include relationships, indexes, and constraints
- One model per file, named after the entity

### routes/ (Blueprints)
- Handle HTTP requests and return responses
- Validate input through schemas before passing to services
- Never contain business logic -- delegate to services
- One blueprint per resource domain

### services/
- Contain all business logic
- Orchestrate models, external calls, and transactions
- Raise custom exceptions for error handling

### schemas/ (Marshmallow)
- Serialize/deserialize request and response data
- Validate payload structure and types
- Ensure consistent API contract

### middleware/
- Decorator functions for cross-cutting concerns
- Authentication, authorization, request logging

### mongodb/
- Schemas and helpers for MongoDB document operations
- Used for non-relational data: file metadata, audit logs

---

## Coding standards

### Type Hints
Every function signature must include type annotations:

```python
from typing import Optional

def create_report(title: str, description: str, user_id: int, category_id: int, evidence: Optional[list[str]] = None) -> Report:
    ...
```

### Docstrings
Every module, class, and function must have a docstring:

```python
def create_report(title: str, description: str, user_id: int, ...) -> Report:
    """
    Creates a new report.

    Validates the category, assigns a tracking number, and
    persists the report in the database.

    Args:
        title: Report title (max. 200 chars).
        description: Detailed problem description.
        user_id: ID of the reporting user.
        category_id: ID of the assigned category.

    Returns:
        The newly created Report instance.

    Raises:
        ValidationError: If the category does not exist or
            the user is not authorized.
    """
```

---

## Running the backend

```bash
cd apps/backend
pip install -r requirements.txt
cp .env.example .env
flask db upgrade
python run.py
```

Server at `http://localhost:5000`.

---

## Endpoints

Detailed per-domain documentation in [api/](api/):

| File | Base URL |
|------|----------|
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

## Database (MySQL/SQLite)

### users

| Field | Type | Description |
|-------|------|-------------|
| id | Integer PK | Unique ID |
| name | String(100) | Full name |
| email | String(120) UNIQUE | Email address |
| password_hash | String(255) | Encrypted password |
| role | Enum(resident, admin) | User role |
| apartment | String(20) | Apartment number |
| tower | String(10) | Tower letter |
| last_seen | DateTime | Last login time |
| avatar_url | String(255) nullable | Avatar image path (gallery or uploaded) |
| created_at | DateTime | Registration date |
| updated_at | DateTime | Last modification |

### categories

| Field | Type | Description |
|-------|------|-------------|
| id | Integer PK | Unique ID |
| name | String(100) | Category name |
| type | Enum(infrastructure, coexistence) | Type |
| description | String(255) | Optional description |
| created_at | DateTime | Creation date |

### reports

| Field | Type | Description |
|-------|------|-------------|
| id | Integer PK | Unique ID |
| title | String(200) | Report title |
| description | Text | Detailed description |
| status | Enum(open, in_progress, resolved, closed) | Current status |
| tracking_number | String(12) UNIQUE | Public tracking number |
| location | String(255) | Location within the community |
| is_anonymous | Boolean | If true, hides the author's identity |
| category_id | Integer FK | Report category |
| user_id | Integer FK | Report author |
| assigned_to | Integer FK nullable | Assigned admin |
| created_at | DateTime | Creation date |
| updated_at | DateTime | Last modification |

### comments

| Field | Type | Description |
|-------|------|-------------|
| id | Integer PK | Unique ID |
| body | Text | Comment content |
| user_id | Integer FK | Author |
| report_id | Integer FK | Associated report |
| created_at | DateTime | Creation date |
| updated_at | DateTime | Last modification |

### votes

| Field | Type | Description |
|-------|------|-------------|
| id | Integer PK | Unique ID |
| vote_type | Enum(up, down) | Vote type |
| user_id | Integer FK | Voter |
| report_id | Integer FK | Voted report |
| created_at | DateTime | Creation date |

One user can only vote once per report (UniqueConstraint). If they change their vote type (up→down or down→up), the existing vote is updated (upsert).

### comunicados

| Field | Type | Description |
|-------|------|-------------|
| id | Integer PK | Unique ID |
| title | String(200) | Announcement title |
| body | Text | Content |
| author_id | Integer FK | Publishing admin |
| created_at | DateTime | Creation date |
| updated_at | DateTime | Last modification |

---

## MongoDB

### attachments

Stores metadata of files attached to reports.

Fields: report_id, file_name, file_url, file_type (image, pdf, video), file_size, uploaded_by, created_at.

### audit_logs

Immutable activity log for traceability.

Fields: user_id, action (create, update, delete, status_change), entity_type (report, comment, user), entity_id, details, ip_address, created_at.

---

## Request flow

```
Frontend (React)
    │
    ▼
Route (routes/*.py)      → Receives URL, applies middleware (token)
    │
    ▼
Schema (schemas/*.py)    → Validates input data
    │
    ▼
Service (services/*.py)  → Business logic, orchestrates models
    │
    ▼
Model (models/*.py)      → Persists or queries DB
    │
    ▼
JSON Response            → Returns to frontend
```

Example: "Juan creates a report"
1. Frontend calls `POST /api/reports` with token + data
2. `middleware/auth.py` verifies token, sets `request.current_user`
3. `schemas/report_schema.py` validates title, description, category_id
4. `services/report_service.py` finds category, creates report, logs to audit
5. Returns created report with tracking_number

---

## Security

- **JWT**: A token is received on login. Must be sent on every request as `Authorization: Bearer <token>`.
- **Passwords**: Encrypted with bcrypt/werkzeug.
- **Roles**:
  - `resident` - create reports, vote, comment, view stats
  - `admin` - change statuses, assign reports, delete users, view audit logs, publish announcements

---

## Notes

- SQLite for development, MySQL for production (change DATABASE_URL in .env)
- MongoDB must be running on localhost:27017 for attachments and audit_logs
- `/logout` does not invalidate the token (blacklist pending)
- Tracking numbers format: `CD-XXXXXXXX`
- Dates in UTC
- Python 3.10+ with type hints
