<h1 align="center">CokeDecide</h1>

<p align="center">
  <a href="https://git-scm.com/"><img src="https://img.shields.io/badge/Monorepo-111111?style=for-the-badge"></a>
  <a href="https://www.conventionalcommits.org/"><img src="https://img.shields.io/badge/Conventional_Commits-1.0.0-FE5196?style=for-the-badge&logo=conventionalcommits&logoColor=white"></a>
</p>

---

<p align="center">
  Community portal for reporting and tracking neighborhood issues<br>
  — from infrastructure problems to coexistence conflicts.
</p>

---

## Table of Contents

- [Badges](#badges)
- [Project Categories](#project-categories)
- [Structure](#structure)
- [Quick Start](#quick-start)
- [Team](#team)
- [Documentation](#documentation)
- [Contributing](#contributing)

---

<div align="center">

## Badges

### Build & Tooling

<p>
  <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"></a>
  <a href="https://git-scm.com/"><img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white"></a>
</p>

### Frontend

<p>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules"><img src="https://img.shields.io/badge/JavaScript-ES_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"></a>
  <a href=""><img src="https://img.shields.io/badge/Architecture-SPA-ff71ce?style=for-the-badge"></a>
</p>

### Backend

<p>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"></a>
  <a href="https://flask.palletsprojects.com/"><img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white"></a>
  <a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"></a>
  <a href=""><img src="https://img.shields.io/badge/API-REST-25A162?style=for-the-badge"></a>
</p>

</div>

---

## Project Categories

- **Social Inclusion** — empowering residents to participate in community decisions
- **Productivity** — streamlining issue reporting and management
- **Culture** — fostering transparent coexistence and civic engagement

## Structure

```
CokeDecide/
├── apps/
│   ├── frontend/       # Vite + Vanilla JS SPA
│   └── backend/        # Flask REST API (MySQL + MongoDB)
├── docs/
│   ├── frontend/       # Frontend architecture docs (EN/ES)
│   └── backend/        # Backend architecture docs (EN/ES)
├── docs/
│   ├── CONTRIBUTING.md     # Branch strategy, commit conventions, PR workflow (EN)
│   └── CONTRIBUTING.es.md  # Mismo contenido en español
├── .gitignore
└── README.md
```

## Quick Start

```bash
# Clone the repository and switch to dev branch
git clone https://github.com/Zerik-Official/CokeDecide.git
cd CokeDecide
git checkout dev
git pull origin dev

# Frontend
cd apps/frontend
npm install
npm run dev

# Backend
cd apps/backend
python -m venv venv        # create virtual environment (optional but recommended)
.\venv\Scripts\activate     # Windows — on Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
python run.py               # starts on http://localhost:5000
```

## Team

### Backend

| Name | Clan | GitHub |
|------|------|--------|
| Brandon Carranza | Garabato | [nastex123](https://github.com/nastex123) |
| Camilo Gale | Garabato | [JuanGale-20](https://github.com/JuanGale-20) |

### Frontend

| Name | Clan | GitHub |
|------|------|--------|
| Carlos Muñoz | Micaela | [Carmuand](https://github.com/Carmuand) |
| Maria Muñoz | Micaela | [AngelusMunoz](https://github.com/AngelusMunoz) |

### QA, Test & DBA

| Name | Clan | GitHub |
|------|------|--------|
| Andrea Bernal | Cayena | [Andrea2112Jotanicia](https://github.com/Andrea2112Jotanicia) |

### Scrum Master

| Name | Clan | GitHub |
|------|------|--------|
| Gustavo Guzman | Micaela | [Zerik-Official](https://github.com/Zerik-Official) |

## Documentation

| Language | Frontend | Backend |
|----------|----------|---------|
| English | [Architecture](docs/frontend/EN/) | [Architecture](docs/backend/EN/) |
| Spanish | [Arquitectura](docs/frontend/ES/) | [Arquitectura](docs/backend/ES/) |

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for branch strategy, commit conventions, and PR workflow.
