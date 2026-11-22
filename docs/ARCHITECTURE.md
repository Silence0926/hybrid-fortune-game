# System Architecture

## Workspace boundaries

The repository uses a modular monorepo. The web client calls the API; the API validates requests and delegates to independent domain engines. Shared contracts live in the domain package. Engine packages do not import one another.

## Runtime flow

1. Web client collects user input and displays engine status.
2. API validates request payloads using shared Zod contracts.
3. Calendar adapter normalizes time only when a validated provider is configured.
4. Each engine executes under a declared engine and ruleset version.
5. Result metadata records status, warnings, provenance, and input digest.
6. Interpretation may combine attributed outputs after review.
7. Daily reflection scoring accepts only explicitly approved factors. I Ching is excluded.

## Trust boundaries
- User input is untrusted and schema-validated.
- Calendar and ephemeris datasets require source, version, license, and checksum metadata.
- Engine outputs with unverified rules cannot be promoted to complete.
- Interpretation is not allowed to rewrite source engine outputs.
- Birth data is sensitive personal information; persistence and retention policy must be approved before accounts or database writes are enabled.

## Initial runtime routes
- GET /health
- GET /v1/engines
- POST /v1/calculations/bazi
- POST /v1/calculations/almanac
- POST /v1/divinations/iching

The current calculation routes deliberately return not_implemented status until their rulesets and datasets pass validation.
