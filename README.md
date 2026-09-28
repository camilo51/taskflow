# TaskFlow

TaskFlow is a full-stack project-management application being built incrementally as a professional portfolio and learning project. It will support teams, workspaces, projects, sprints, user stories, and tasks.

## Current status

The repository foundation is ready. It includes a Next.js application shell, a FastAPI service with `GET /health`, PostgreSQL configuration, Docker Compose, quality checks, and GitHub Actions. No authentication, workspace, project, backlog, Kanban, or other business functionality exists yet.

The complete product blueprint and phased roadmap are in [PLAN.md](PLAN.md). That document is reference material, not authorization to implement future phases automatically.

## Stack

- Web: Next.js, TypeScript, React, App Router, Tailwind CSS
- API: Python, FastAPI, Pydantic, SQLAlchemy, Alembic
- Database: PostgreSQL
- Quality: ESLint, TypeScript, Prettier, Ruff, Pytest
- Infrastructure: Docker Compose and GitHub Actions

## Repository structure

```text
apps/web       Next.js frontend
apps/api       FastAPI backend
packages       Shared configuration/packages when needed
infra          Deployment infrastructure when needed
docs           Project documentation when needed
scripts        Development and automation scripts when needed
.github        Pull request templates, ownership, CI, Dependabot
```

## Quick start

1. Copy the example environment file: `cp .env.example .env`.
2. Start the full local environment: `docker compose up --build`.
3. Open `http://localhost:3000` and `http://localhost:8000/health`.

PostgreSQL is available on port `5432` and persists data in the named `postgres_data` Docker volume.

To stop the containers, use `docker compose down`. This preserves the database volume. Use `docker compose down -v` only when intentionally resetting local database data.

## Local development without Docker

### Web

```bash
npm install
npm run dev:web
```

The web application runs at `http://localhost:3000`.

### API

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
python -m pip install -e ".[dev]"
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`; its health endpoint is `GET /health`.

## Quality commands

```bash
# Frontend
npm run lint:web
npm run typecheck:web
npm run test:web
npm run build:web

# Repository formatting
npm run format

# Backend (from apps/api, with its virtual environment active)
ruff check .
ruff format --check .
pytest
```

## Git workflow

Do not develop directly on `main`. Create a typed branch such as `feat/projects`, make Conventional Commits (`type(scope): description`), push it, open a pull request, let CI pass, review, then merge. The commit-msg hook validates the format after `npm install` has initialized Husky.

Before enabling the main branch ruleset, replace the placeholder in `.github/CODEOWNERS` with the real GitHub username. See [PLAN.md](PLAN.md#31-branch-protection) for the required GitHub ruleset.

## Design source

Figma is the visual source of truth for frontend screens: <https://www.figma.com/design/yStKNDNyP2UCD596sjJgkF>.
