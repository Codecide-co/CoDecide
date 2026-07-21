# Bug Issue Guide

## Domain Labels

- `backend` — Flask, SQLAlchemy, MongoDB, routes, services, middleware
- `frontend` — Vanilla JS, Vite, Tailwind, components, pages, styles

Every bug must have at least one domain label.

## Title Format

Use conventional commit format:

```
fix(<scope>): <short description in English>
```

**Examples:**

| Bug | Title |
|-----|-------|
| Auth login crash | `fix(auth): login returns 500 on invalid token` |
| Form crash | `fix(components): report form crashes on empty category` |
| Broken endpoint | `fix(routes): report list returns 500 on empty db` |

> The scope must match one of the available scopes (see [CONTRIBUTING.md](../CONTRIBUTING.md)).

## Description Format

See the templates in this folder:
- `bug-report.md` — English
- `bug-report.es.md` — Español

Required sections:
1. **Describe the bug** — what is happening
2. **To Reproduce** — step by step
3. **Expected behavior** — what should happen
4. **Screenshots / Logs** — if applicable
5. **Additional context** — optional
6. **Acceptance Criteria** — checklist for the fix

## Templates

| Language | File |
|----------|------|
| English | `bug-report.md` |
| Español | `bug-report.es.md` |
