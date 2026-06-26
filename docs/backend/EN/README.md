# Backend Architecture

## Overview

RESTful API built with **Flask** (Python). Uses **MySQL** for relational data (users, reports, categories, votes, comments) and **MongoDB** for document storage (attachments metadata, audit logs, activity history).

All Python code must include **type hints** and **docstrings**.

## Directory Structure

```
app/
├── __init__.py           # Application factory (create_app)
├── config.py             # Environment-based configuration (dev, prod, test)
├── extensions.py         # Flask extensions initialization (SQLAlchemy, PyMongo, Migrate)
├── models/               # SQLAlchemy ORM models
│   ├── user.py           # User model (id, name, email, password, role, apt, tower)
│   ├── report.py         # Report model (title, description, category, status, evidence)
│   ├── category.py       # Category model (name, type: infrastructure|coexistence)
│   ├── comment.py        # Comment model (body, author, report, timestamps)
│   └── vote.py           # Vote model (user, report, vote_type: up|down)
├── routes/               # Flask Blueprints (controllers)
│   ├── auth.py           # POST /login, /register, /logout, /me
│   ├── reports.py        # CRUD /reports, PATCH /reports/:id/status
│   ├── comunicados.py    # CRUD /comunicados
│   ├── stats.py          # GET /stats (metrics, charts)
│   └── admin.py          # Admin-only endpoints
├── services/             # Business logic layer
│   ├── auth_service.py   # Password hashing, JWT generation/validation
│   ├── report_service.py # Report creation, status transitions, voting logic
│   └── stats_service.py  # Aggregation queries, metrics computation
├── schemas/              # Request/response serialization and validation
│   ├── auth_schema.py    # Marshmallow schemas for login/register payloads
│   ├── report_schema.py  # Report creation, update, listing serializers
│   └── user_schema.py    # User profile serialization
├── middleware/            # Request interceptors (decorators)
│   └── auth.py           # @login_required, @admin_required decorators
mongo/                    # MongoDB models/schemas
│   ├── __init__.py
│   ├── attachment.py     # Image/file metadata stored in MongoDB
│   └── audit_log.py      # Activity and audit trail
migrations/               # Flask-Migrate (Alembic) migration files
requirements.txt
run.py                    # Development server entry point
```

## Layer Responsibilities

### `models/` (SQLAlchemy)
- Define database tables as Python classes
- Include relationships, indexes, and constraints
- Each model in its own file named after the entity

### `routes/` (Blueprints)
- Handle HTTP requests and return responses
- Validate input through schemas before passing to services
- Never contain business logic — delegate to services
- One blueprint per resource domain

### `services/`
- Contain all business logic
- Orchestrate models, external calls, and transactions
- Raise custom exceptions for error handling

### `schemas/` (Marshmallow)
- Serialize/deserialize request and response data
- Validate payload structure and types
- Ensure consistent API contract

### `middleware/`
- Decorator functions for cross-cutting concerns
- Authentication, authorization, request logging

### `mongo/`
- Schemas and helpers for MongoDB document operations
- Used for non-relational data: file metadata, audit logs

## Coding Standards

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
    Create a new report.

    Validates the category, assigns a tracking number, and
    persists the report to the database.

    Args:
        title: Report title (max 200 chars).
        description: Detailed description of the issue.
        user_id: ID of the reporting user.
        category_id: ID of the assigned category.

    Returns:
        The newly created Report instance.

    Raises:
        ValidationError: If the category does not exist or
            the user is not authorized.
    """
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login, returns JWT | No |
| GET | `/api/auth/me` | Get current user profile | Yes |
| GET | `/api/reports` | List reports (filters, pagination) | Yes |
| POST | `/api/reports` | Create a report | Yes |
| GET | `/api/reports/:id` | Get report detail | Yes |
| PATCH | `/api/reports/:id/status` | Update report status | Admin |
| POST | `/api/reports/:id/vote` | Vote on a report | Yes |
| POST | `/api/reports/:id/comments` | Add a comment | Yes |
| GET | `/api/stats` | Get community metrics | Yes |
| GET | `/api/comunicados` | List official announcements | No |
| POST | `/api/comunicados` | Publish an announcement | Admin |

## Database Design

### MySQL (relational)
- `users` — residents and admins
- `reports` — infrastructure and coexistence issues
- `categories` — report classification
- `comments` — threaded discussion on reports
- `votes` — community voting on reports

### MongoDB (documents)
- `attachments` — image/file metadata linked to reports
- `audit_logs` — immutable activity trail for transparency
