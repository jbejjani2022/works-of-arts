# Claude Code Project Memory (READ FIRST)
This repo is a Next.js app (App Router) using TypeScript and Tailwind CSS.
The product requirements live in: SPEC.md (source of truth).

## Operating rules
- Read SPEC.md before proposing or implementing changes.
- Prefer maintainability over cleverness; optimize for clarity and explicitness.
- Work in small, reviewable commits. Keep diffs focused. If a change is large, propose a plan first.
- Keep the project runnable at every commit.
- Do not add new dependencies without asking; justify any new package.

## Workflow (how to work)
- Before coding: summarize relevant parts of SPEC.md and propose an implementation plan.
- After coding: ensure formatting, lint, typecheck, and tests pass.
- Update docs when behavior changes (README.md and any relevant docs/*).
- When uncertain: ask a question rather than guessing.

## Tech decisions (defaults)
- Framework: Next.js App Router (server components by default; use "use client" only when needed).
- TypeScript: strict types; avoid `any`. Prefer narrow types and runtime validation at boundaries.
- Styling: Tailwind. Prefer small reusable components over repeated complex class strings.
- Runtime: Node by default.

## Code organization conventions
- Keep "domain logic" separate from UI where practical (lib/ or server/ modules).
- Prefer named exports for utilities; keep module boundaries clean.
- Keep files small; refactor when a file grows too large or mixes concerns.

## Quality bar (required)
- Add tests for non-trivial logic. Prefer fast unit tests; add integration tests for critical flows.
- No dead code, no commented-out blocks, no TODOs without an issue/link and clear scope.
- Handle errors explicitly; return useful error messages in UI and logs (without leaking secrets).
- Accessibility: ensure basic a11y (labels, button semantics, keyboard navigation).

## Security & data handling
- Never log secrets (tokens, keys, user credentials).
- Treat all external inputs as untrusted (forms, query params, headers, webhooks).
- Validate and sanitize at boundaries; fail closed by default.

## Git hygiene
- Make focused commits with clear messages.
- If asked to "implement step N", do only that step and stop for review.

## Project-specific notes
- Any additional conventions not in SPEC.md should be proposed first and then recorded here.
