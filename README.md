# Hybrid Fortune & Destiny Simulation Game

A modular, versioned cultural-computing application that brings together five independent systems: BaZi, Zi Wei Dou Shu, I Ching, Chinese Almanac, and Western Astrology.

> **Scope and disclaimer:** This project presents traditional systems for cultural learning, entertainment, and personal reflection. It does not provide scientifically validated predictions or professional medical, financial, legal, or other high-stakes advice.

## Product direction
- Web-first application with Progressive Web App (PWA) support.
- Modular TypeScript monorepo.
- Independent calculation engines with versioned rulesets and provenance.
- I Ching is a separate user-initiated workflow and is not an input to the daily reflection score.
- Unverified rules and calendar data must be marked explicitly. No fabricated results.

## Technology
- Web: React, TypeScript, Vite
- API: Node.js, Fastify, TypeScript
- Contracts: Zod
- Database model: PostgreSQL + Prisma schema
- Tests: Vitest
- CI: GitHub Actions

## Repository layout
- apps/web — responsive React web client and PWA shell
- apps/api — Fastify API and versioned engine routes
- packages/domain — shared schemas and contracts
- packages/calendar — calendar/time normalization boundary
- packages/engines-bazi — BaZi engine boundary
- packages/engines-ziwei — Zi Wei Dou Shu engine boundary
- packages/engines-iching — independent divination boundary
- packages/engines-almanac — Chinese Almanac boundary
- packages/engines-astrology — Western Astrology boundary
- packages/interpretation — attributed synthesis interface
- packages/scoring — configurable daily reflection score
- prisma — initial PostgreSQL data model
- docs — technical specification and governance

## Local development
Requirements: Node.js 22+ and npm 10+.

```bash
npm install
npm run dev --workspace @hybrid-fortune/web
npm run dev --workspace @hybrid-fortune/api
```

Web development server: http://localhost:5173  
API: http://localhost:3000/health

Validation:
```bash
npm run typecheck
npm test
npm run build
```

## Current implementation status
The repository foundation, initial UI, API shell, shared input contracts, engine boundaries, Prisma schema draft, ruleset governance, and CI workflow have been committed. The BaZi, almanac, Zi Wei Dou Shu, and Western Astrology calculation engines intentionally remain unimplemented pending approved conventions and validated data sources. I Ching is isolated but its casting implementation awaits method and text-edition decisions. Daily score weights are not approved and the score remains disabled by default.

## Documentation
- [Technical Specification V1.0](docs/TECHNICAL_SPEC_V1.0.md)
- [BaZi Ruleset V1.0 — Confirmed Conventions](docs/BAZI_RULESET_V1.0.md)
- [Ruleset Governance](docs/RULESET_GOVERNANCE.md)
- [Zi Wei Dou Shu Ruleset Research V0.1](docs/ZIWEI_RULESET_RESEARCH_V0.1.md)
- [Architecture Decision Records](docs/decisions/README.md)
