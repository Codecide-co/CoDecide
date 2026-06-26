# Contributing Guidelines

## Branch Strategy

```
main ────────────── releases only
  └── dev ────────── integration branch
        ├── frontend ── frontend-specific work
        │     ├── feature/login-form
        │     ├── fix/report-card-height
        │     └── refactor/router-middleware
        └── backend ─── backend-specific work
              ├── feature/auth-jwt
              ├── fix/pagination-offset
              └── refactor/db-session
```

### Branch Naming Convention

```
<type>/<short-description>
```

| Type | Description | Example |
|------|-------------|---------|
| `feature/` or `feat/` | New functionality | `feature/report-voting` |
| `fix/` | Bug fix | `fix/login-redirect-loop` |
| `refactor/` | Code restructuring without behavior change | `refactor/extract-report-service` |
| `chore/` | Tooling, dependencies, config | `chore/upgrade-vite` |
| `docs/` | Documentation only | `docs/api-endpoints` |

Use **kebab-case** for the description. Keep it short but meaningful.

### Rules

- **Never push directly to `main`.** All changes to `main` must come from a pull request.
- **Never push directly to `dev`.** All changes to `dev` must come from a pull request.
- `frontend` and `backend` branches receive PRs from feature/fix branches.
- Feature branches branch off `frontend` or `backend`, never off `dev` directly.
- Any commit pushed directly to `main` will be deleted.

---

## Conventional Commits

Every commit message must follow the **Conventional Commits** specification.

### Format

```
<type>(<scope>): <description>
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `style` | Formatting, missing semicolons, etc. (no production code change) |
| `docs` | Documentation only changes |
| `chore` | Build process, dependencies, or tooling changes |
| `test` | Adding or modifying tests |
| `perf` | Performance improvement |

### Scope

The scope indicates **what area** the change affects.

Frontend scopes: `router`, `store`, `pages`, `components`, `services`, `styles`, `utils`, `layout`
Backend scopes: `routes`, `models`, `services`, `schemas`, `middleware`, `mongo`, `config`
Cross-cutting: `deps`, `config`, `ci`, `docs`

### Examples

```
feat(reports): add community voting on reports
feat(router): implement route guards for authenticated pages
fix(services): handle 401 response and redirect to login
refactor(store): replace manual event emit with Proxy-based reactivity
chore(deps): upgrade tailwindcss to v4
docs(api): document report status transition endpoints
style(components): format Button.js with consistent spacing
test(models): add unit tests for Report status transitions
```

### Rules

- **Description must be in English.**
- **Description must be imperative, present tense:** "add" not "added" or "adds".
- **Description must be concise** — under 72 characters if possible.
- **Do not capitalise the first letter** of the description.
- **No period at the end.**

> Any commit that does not follow this convention will be **deleted**.
> Use `git rebase` to fix messages before pushing.

---

## Commit Size

### Guidelines

- **One commit per logical change.** If you fix two unrelated bugs, make two commits.
- **One file per commit** is acceptable when files are unrelated.
- **Group related files** in a single commit only when the changes share the same purpose and cannot work independently.
- **Large commits are strongly discouraged.** If you changed 20+ files, reconsider whether they can be split.

### Good examples

```
feat(auth): add login form component
    - src/components/domain/LoginForm.js (new)

feat(auth): wire login form to auth service
    - src/pages/auth/login.js (modified)
    - src/services/auth.service.js (modified)
    - src/store/auth.store.js (modified)
```

These are two separate commits because the component can exist independently of the service wiring.

### Bad examples

```
feat: add lots of stuff
    - 35 files changed, 1200 additions

fix(styles): fix style
    - Every CSS file in the project modified because "it needed it"
```

---

## Pull Request Workflow

1. Create a feature/fix branch from `frontend` or `backend`:

   ```bash
   git checkout frontend
   git pull
   git checkout -b feature/report-voting
   ```

2. Commit following the Conventional Commits format.

3. Push and open a PR targeting `frontend` or `backend` (never `dev` or `main`).

4. Ensure the PR description explains **what** and **why**.

5. After review and approval, the branch is merged into the target branch.

6. Periodically, `frontend` and `backend` are merged into `dev` for integration testing.

7. When `dev` is stable, a PR is opened from `dev` to `main` for release.

### PR Title Format

Same as commit format:

```
feat(reports): add community voting on reports
```

### PR Description Template

```markdown
## What
Brief description of the change.

## Why
Reason for the change.

## How to test
Steps to verify the change works.

## Screenshots (if applicable)
```
