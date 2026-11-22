# Architecture Decision Records

| ID | Decision | Status |
|---|---|---|
| ADR-001 | Modular TypeScript monorepo | Accepted |
| ADR-002 | Web/PWA first | Accepted |
| ADR-003 | Independent engines with versioned rulesets | Accepted |
| ADR-004 | I Ching isolated from daily score | Accepted |
| ADR-005 | PostgreSQL + Prisma persistence | Proposed |
| ADR-006 | Fastify API and Zod validation | Proposed |

## ADR-001 — Modular monorepo
Accepted. Shared domain contracts are versioned separately from independently governed engines.

## ADR-002 — Web/PWA first
Accepted. The first client is a responsive web application with an installable PWA path.

## ADR-003 — Versioned independent engines
Accepted. Every engine declares ruleset and version, and returns provenance and warnings.

## ADR-004 — I Ching isolation
Accepted. I Ching casting is explicit and user initiated. Its result is not an input to the daily score.
