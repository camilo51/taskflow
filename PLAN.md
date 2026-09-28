# TaskFlow

> **Scope rule:** This is the project blueprint and learning roadmap. It is not authorization for an AI or contributor to implement a phase or task without an explicit request that states the desired scope.

## 1. Product vision

TaskFlow will help small teams plan, execute, and understand project work in one focused application. It will connect workspaces, projects, backlog, sprints, board work, personal task visibility, and an auditable history of important changes.

## 2. Objectives

Functionally, deliver a useful project-management workflow from account creation through delivery tracking. Technically, learn and demonstrate modular-monolith design, typed API contracts, relational modelling, security, testing, CI/CD, Docker, code review, and incremental delivery. Maintainability and clear decisions matter more than feature count.

## 3. Technology stack

| Area           | Choice                                               | Purpose                                |
| -------------- | ---------------------------------------------------- | -------------------------------------- |
| Frontend       | Next.js, TypeScript, React, App Router, Tailwind CSS | Responsive UI and rendering            |
| Forms/data     | React Hook Form, Zod, TanStack Query                 | Validation, cache, mutations           |
| Backend        | Python, FastAPI, Pydantic                            | Typed HTTP API and settings            |
| Persistence    | SQLAlchemy, Alembic, PostgreSQL                      | ORM, migrations, relational storage    |
| Testing        | Pytest, Playwright                                   | API/unit/integration and browser tests |
| Infrastructure | Docker, Docker Compose, GitHub Actions               | Local parity and CI                    |
| Deployment     | Selected in Phase 16                                 | Managed web, API, PostgreSQL, secrets  |

Start as a modular monolith. Do not add microservices, Kubernetes, Kafka, Elasticsearch, Redis, workers, or WebSockets until a measured requirement justifies them.

## 4. Architecture

Browser → Next.js → FastAPI routes → Service layer → Repository layer → SQLAlchemy → PostgreSQL.

Next.js owns presentation, navigation, forms, client cache, and accessible feedback. FastAPI owns validation, authentication/authorization enforcement, business rules, and HTTP contracts. Services orchestrate use cases; repositories isolate queries; SQLAlchemy models map to PostgreSQL. Avoid business logic in route handlers or UI components. Configuration, errors, logging, and dependencies are explicit cross-cutting modules.

## 5. Monorepo structure

- apps/web: Next.js application.
- apps/api: FastAPI application and tests.
- packages/config: reserved for truly shared tooling/configuration.
- infra: deployment manifests or IaC when selected.
- docs: durable supporting documentation when needed.
- scripts: repeatable local automation.
- .github: CI, Dependabot, templates, owners.
- PLAN.md: single initial roadmap and product blueprint.

The current structure intentionally has no domain modules beyond the API base. Add modules only while implementing an explicitly requested phase. Record material structural changes here.

## 6. Domain model

Users own identities; Workspaces group teams; Workspace Members attach a user and workspace role; Projects belong to a workspace; Project Members define participation; Sprints group planned work; User Stories represent backlog items; Tasks and subtasks represent executable work. Supporting concepts are statuses, priorities, labels, comments, checklists, attachments, invitations, notifications, and activity logs. Review IDs, timestamps, creator/updater references, constraints, indexes, relationship cardinality, cascades, and deletion policy before migrations.

## 7. Authentication

Plan register, login, logout, GET /me, modern adaptive password hashing, short-lived access tokens, secure refresh/session renewal, token rotation/revocation, and password recovery with single-use expiring tokens. Validate inputs with Pydantic/Zod and never expose hashes or token secrets. Authentication is Phase 2, not current functionality.

## 8. Authorization

Workspace roles are OWNER, ADMIN, MEMBER. OWNER controls ownership and destructive workspace administration; ADMIN manages permitted members and project-level operations; MEMBER participates only where membership and policy allow. Every protected route authorizes server-side from workspace/project membership, never UI visibility. Define and test an explicit permission matrix.

## 9. Workspaces

Plan create/read/update/archive, membership listing, invitations, role changes, safe removal, ownership transfer, and workspace-scoped project lists. Enforce unique membership and tenant isolation. The UI includes switching, empty, loading, error, and denied states.

## 10. Projects

Projects belong to one workspace and contain metadata, members, backlog, sprints, and board configuration. Plan create/edit/archive, project-member management, visibility rules, overview, and project-scoped URLs. Archiving preserves history and blocks inappropriate new work.

## 11. Product Backlog

A User Story includes code, title, description, acceptance criteria, priority, Story Points, MoSCoW category, assignee, labels, sprint, due date, comments, subtasks, and status. Plan ordering/reordering, filters, detail editing, validation, and clear separation between stories and executable tasks.

## 12. Sprints

Plan create, edit, add/remove user stories, capacity/date validation, start, complete, and review outcomes. Start with one active sprint per project unless a later product decision changes the rule. Completion explicitly handles unfinished items and creates activity events.

## 13. Kanban

Initial statuses are TO DO, IN PROGRESS, IN REVIEW, DONE. Support accessible drag-and-drop plus non-drag controls, ordering, filters, and empty states. A status change follows: optimistic UI update → API request → authorization → database update → activity event → success; on API failure: rollback UI plus accessible feedback. Ordering, concurrency, failure recovery, and permissions require tests; client-side transitions are never trusted.

## 14. Tasks and subtasks

Plan creation/editing, assignment, status/priority/due date, ordering, parent-story association, checklist/subtask completion, and aggregate progress. Define cycle prevention and independent subtask behavior before schema implementation.

## 15. Comments

Plan work-item comments with author, timestamps, edit/delete rules, authorization, sanitization, pagination, and activity integration. Rich text is deferred until there is a concrete requirement and sanitization strategy.

## 16. Attachments

Store attachment metadata in PostgreSQL and bytes in an external object store chosen during deployment design. Enforce authorization, limits, file type policy, scanning when appropriate, safe download URLs, deletion, and retention. Do not default to arbitrary production blobs in the primary database.

## 17. Activity / Audit

Record significant events: creation, important edits, membership/role changes, sprint lifecycle, status moves, comments, and archive/delete actions. Events need actor, target, timestamp, workspace/project scope, and safe structured before/after summaries. They are append-oriented and never expose sensitive values.

## 18. Notifications

Plan in-app notifications for assignments, mentions, invitations, and relevant activity, with read state, deduplication, preferences, pagination, and authorization. Start with polling/refetching; real-time delivery requires demonstrated value.

## 19. Dashboard

Plan workspace/project dashboards with sprint progress, work distribution, due/overdue work, and recent activity. Metrics need documented query definitions and bounded aggregation.

## 20. My Tasks

Plan an authenticated view of assigned work across permitted workspaces/projects with status, due date, priority, search, filters, pagination, and deep links. It must honor every membership change and tenant boundary.

## 21. Search and filters

Start with indexed, workspace/project-scoped PostgreSQL queries, validated filters, allow-listed sorting, and URL-persisted UI filters where useful. Add full-text or external search only after profiling and need.

## 22. Pagination

Use a consistent API contract: validated page size, stable sort, total/next metadata where useful, and cursor pagination for high-churn/large feeds. UI shows loading, empty, end-of-results, failed, and retry states.

## 23. Error handling

Backend uses central exception mapping, stable error codes, request IDs, validation errors, and safe production responses. Frontend uses error boundaries where appropriate, query/mutation failures, inline form errors, retry actions, and accessible status feedback. Log diagnostics; do not leak them.

## 24. Logging

Use structured logs with timestamp, level, correlation ID, route, latency, and safe actor/resource context. Redact credentials, tokens, passwords, and sensitive personal data. Define levels and do not treat logs as an audit database.

## 25. Security

Use HTTPS in deployment; secure headers; CORS allow-lists; validated schemas; ORM parameterization; least privilege; authentication/recovery rate limits; password hashing; token rotation; authorization tests; dependency updates; secret management; upload controls; and ongoing OWASP review. .env is ignored; secrets never enter source, images, logs, fixtures, or commits.

## 26. Testing strategy

Unit tests cover pure services, permissions, and validation. Integration tests cover routes, repositories, migrations, and PostgreSQL constraints with isolated databases. Playwright E2E covers critical browser journeys against web + API + PostgreSQL. Prefer deterministic fixtures and behavior-focused test names. Do not create fictional E2E tests in Phase 0.

## 27. Docker

docker compose up --build starts web, api, and postgres. PostgreSQL persists in postgres_data and has a readiness check; API waits for it and exposes /health; web waits for API. Images contain no secrets and use runtime configuration. Development bind mounts are local-only; production images/overrides come later.

## 28. CI/CD

Current GitHub Actions validate API (Ruff lint/format, Pytest), web (install, lint, typecheck, test script, build), and Docker image builds. Path filters prevent irrelevant work. When PostgreSQL integration tests exist, add a PostgreSQL service to API CI. Later E2E CI starts web/API/PostgreSQL and runs Playwright. Phase 16 deployment adds environment secrets, migration sequencing, health checks, rollback, and post-deploy verification.

## 29. Git workflow

typed branch → Conventional Commits → push → Pull Request → CI → review → merge → main.

Create branches from current main: feat/_, fix/_, refactor/_, test/_, docs/_, chore/_, or ci/*. Keep PRs focused, tested, documented, and reviewable. Do not develop directly on main during normal work.

## 30. Conventional Commits

Required format: type(scope): description. Main types: feat, fix, docs, style, refactor, test, chore, ci, perf, build. Examples: feat(api): add workspace repository; fix(web): preserve board filters; docs(plan): clarify sprint completion; ci(api): add postgres service. Husky's commit-msg hook invokes Commitlint after root npm install; CI/review remain protection if a local hook is bypassed.

## 31. Branch protection

GitHub configuration cannot be applied from this local repository: there is no GitHub remote or authenticated authorization. After creating/pushing the repository and replacing the placeholder in .github/CODEOWNERS, create a Ruleset targeting main:

1. Require a pull request before merging; block direct pushes.
2. Require API, web, and Docker validation status checks.
3. Require approval when collaborators exist; require Code Owner review once CODEOWNERS has a valid account.
4. Require conversation resolution and dismiss stale approvals after new commits where appropriate.
5. Block force pushes and deletion of main.
6. Restrict bypass permissions to deliberate administrators only.

With one developer, independent review cannot be meaningful in GitHub. Maintain PR/CI discipline and require approval when a qualified second reviewer joins.

## 32. Figma

Official visual source: https://www.figma.com/design/yStKNDNyP2UCD596sjJgkF. Before implementing a screen, inspect its Figma node for layout, components, spacing, typography, colors, responsive behavior, interactions, and states, then compare implementation to it. Do not redesign arbitrarily. Inventory relevant screens from Figma before implementation: authentication, workspace selection/settings, projects, overview, backlog, sprint planning, Kanban, story detail, dashboard, My Tasks, notifications, and profile/settings. If Figma omits a state, extend its existing design system consistently and record why.

## 33. Responsive strategy

Honor the source design, then verify desktop, tablet, and mobile intentionally with fluid layouts, tokenized spacing, readable type, responsive navigation, touch-safe controls, a horizontal-board strategy, and no hover-only interaction. Test real content lengths; do not simply shrink desktop UI.

## 34. Accessibility

Target semantic HTML, keyboard operation, visible focus, logical heading order, form labels/errors, contrast, meaningful alternatives, live mutation feedback, reduced-motion support, and accessible drag-and-drop alternatives. Test keyboard and automated checks as screens are built; fix issues instead of suppressing rules.

## 35. Deployment architecture

Deploy Next.js and FastAPI as separately configurable services backed by managed PostgreSQL in a private/network-restricted configuration. Use provider secret storage for database URL, allowed origins, token/signing configuration, and service credentials. NEXT_PUBLIC_* values are public by design. Run migrations safely in releases, expose health checks, collect logs/metrics, back up PostgreSQL, and document rollback.

## 36. Development phases

| Phase                           | Objective          | Learn                            | Backend/database                       | Frontend                     | Tests/dependencies/Definition of Done        |
| ------------------------------- | ------------------ | -------------------------------- | -------------------------------------- | ---------------------------- | -------------------------------------------- |
| 0 — Repository & tooling        | Stable foundation  | monorepo, Git, Docker, CI        | API base, PostgreSQL config            | Next shell                   | CI green; Docker works; plan exists          |
| 1 — Database foundation         | Design persistence | SQLAlchemy, Alembic, constraints | engine/session, migration, base models | no product UI needed         | migration/integration tests; schema reviewed |
| 2 — Authentication              | Secure identity    | hashing, tokens, cookies         | User, sessions/tokens, auth routes     | register/login/session UX    | Pytest/E2E paths; security rules met         |
| 3 — Workspaces                  | Tenant boundary    | roles, policies                  | workspace/member/invitation            | switcher/settings/members    | permission matrix tests; scoped UX done      |
| 4 — Projects                    | Project lifecycle  | modular services                 | projects/project members               | project list/create/settings | tenant/archive tests; UI states done         |
| 5 — Backlog                     | Plan product work  | query/filter/order               | stories, labels, priorities            | backlog/list/detail forms    | CRUD/filter tests; Figma comparison          |
| 6 — Sprints                     | Iteration planning | state transitions                | sprints/story assignment               | planning controls            | lifecycle tests; rules documented            |
| 7 — Kanban                      | Execute work       | optimistic mutation              | task status/order/activity             | board and accessible moves   | rollback/concurrency tests; responsive done  |
| 8 — Story detail                | Deep management    | aggregates/validation            | tasks/subtasks/checklists              | detail view                  | permissions/progress tests                   |
| 9 — Comments & attachments      | Collaboration      | storage boundaries               | comments/files metadata                | comment/upload UX            | authorization/upload tests                   |
| 10 — Activity                   | Traceability       | append-only events               | event queries                          | activity feeds               | event/pagination tests                       |
| 11 — Notifications              | Awareness          | preferences/read state           | notification records                   | inbox/badges                 | delivery/read-state tests                    |
| 12 — Dashboard                  | Decision support   | aggregate queries                | metrics endpoints                      | overview widgets             | metric definitions/empty states              |
| 13 — My Tasks                   | Personal execution | cross-project scope              | assigned-work query                    | filtered view                | tenant/filter/pagination E2E                 |
| 14 — Testing                    | Confidence         | pyramid/fixtures                 | integration test DB                    | Playwright journeys          | critical paths reliable                      |
| 15 — Responsive & accessibility | Inclusive product  | a11y/responsive QA               | API contracts as needed                | key screens                  | keyboard/mobile/a11y checks pass             |
| 16 — Deployment                 | Release safely     | environments/operations          | migration/release strategy             | production config            | deploy, rollback, monitoring runbook         |

Before coding each phase, write its explicit mini-plan: objective, learning concepts, backend, frontend, migration, tests, dependency justification, and Definition of Done. Stop at phase boundaries unless the developer asks to continue.

## 37. Definition of Done

A feature is done only when requested scope is implemented; Figma is followed for visual work; authorization and validation are enforced; migrations are reviewed; unit/integration/E2E coverage is proportionate; lint, format, typecheck, tests, and build pass; loading/error/empty states exist; accessibility and responsive behavior are checked; secrets are absent; docs/contracts are updated; and its focused PR goes through CI and review.

## 38. Future improvements

Consider Redis only for measured caching, rate limiting, or ephemeral coordination needs; WebSockets only when polling no longer meets collaboration/notification latency needs; background workers only for real asynchronous work such as email/file processing; and external search only after PostgreSQL limits are profiled. Before adding each, evaluate cost, operations, failures, tests, and observability.
