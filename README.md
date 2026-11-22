# Hybrid Fortune & Destiny Simulation Game

A modular, versioned cultural-computing application that brings together five traditional and modern symbolic systems: BaZi, Zi Wei Dou Shu, I Ching, Chinese Almanac, and Western Astrology.

> **Scope and disclaimer:** This project presents traditional systems for cultural learning, entertainment, and personal reflection. It does not provide scientifically validated predictions or professional medical, financial, legal, or other high-stakes advice.

## Product direction

- Web-first application with Progressive Web App (PWA) support.
- Modular monorepo with independently versioned calculation engines.
- Every calculation records its ruleset and engine version for reproducibility.
- I Ching divination remains a separate user-initiated workflow and is not an input to the daily score.
- Unverified rules and calendar data must be marked explicitly; no fabricated calculation output is allowed.

## Planned stack

- Frontend: React, TypeScript, Vite
- API: Node.js, Fastify, TypeScript
- Validation/contracts: Zod
- Database: PostgreSQL, Prisma
- Tests: Vitest, golden test fixtures
- CI: GitHub Actions

## Repository status

Initial repository bootstrap. The first milestone establishes architecture, domain contracts, documentation, and CI. Calendar and metaphysical rules will be implemented only after their conventions and authoritative reference data are validated.

## Documentation

- [Technical Specification V1.0](docs/TECHNICAL_SPEC_V1.0.md)
- [Architecture Decision Records](docs/decisions/README.md)
- [Ruleset governance](docs/RULESET_GOVERNANCE.md)

## Development

Requirements and local setup instructions will be added with the application workspace in the next milestone.
