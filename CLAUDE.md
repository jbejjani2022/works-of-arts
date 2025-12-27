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
- Update docs when behavior changes (README.md and any relevant docs/\*).
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

## Decisions and architecture

- For any new, key decisions made or changed, update docs/decisions.md appropriately to document the decision.
- For any new, key architectural decisions or changes made, update docs/architecture.md appropriately to document the change.

## Implementation Roadmap

### ✅ Step 1: Project Foundation & Tooling [COMPLETE]

**Goal**: Set up Next.js project with all tooling, configs, and baseline structure
**Status**: Complete (commit: fab6ff3)
**Includes**:

- Next.js 14 with App Router + TypeScript + Tailwind
- ESLint, Prettier, TypeScript strict mode
- Vitest + React Testing Library
- Supabase client setup (server & client)
- Basic folder structure and placeholder files
- Complete documentation (README, architecture, decisions, Supabase setup)
- Package scripts: dev, build, lint, typecheck, test, format

### ✅ Step 2: Core Layout & Navigation [COMPLETE]

**Goal**: Implement responsive sidebar and basic page routing
**Status**: Complete
**Includes**:

- Sidebar component with navigation logic
  - Artist name links to homepage
  - Navigation links (About, Artworks)
  - Nested medium filters on Artworks page
  - Smooth slide animations
- Shell wrapper component for About/Artworks pages
- SidebarToggle component for home page hero overlay
- Responsive behavior:
  - Home page: sidebar closed by default, toggleable on all screens
  - About/Artworks pages: sidebar always visible on desktop, toggleable on mobile
- Basic page shells for /, /about, /artworks
- Proper mobile spacing and cursor pointer styling
- All TypeScript types, tests pass, code formatted

### ⏳ Step 3: Supabase Integration & Types [NEXT]

**Goal**: Set up Supabase clients and database schema
**Success Criteria**:

- Supabase clients configured for server/client use
- TypeScript types defined for Artwork and Bio
- Environment variables documented

### ⏳ Step 4: Public Pages Implementation

**Goal**: Build home, about, and artworks pages with real data
**Success Criteria**:

- Home page shows random hero artwork
- About page displays bio content
- Artworks page shows filterable grid

### ⏳ Step 5: Admin Authentication & Layout

**Goal**: Implement secure admin area with authentication
**Success Criteria**:

- Login/logout flow works
- Admin pages are auth-protected
- Admin shell layout implemented

### ⏳ Step 6: Admin CMS Functionality

**Goal**: Full CRUD operations for artworks and bio editing
**Success Criteria**:

- Can create, edit, delete artworks
- Image upload to Supabase Storage works
- Bio editor saves content

### ⏳ Step 7: Polish & Production Readiness

**Goal**: Final optimizations, error handling, and deployment prep
**Success Criteria**:

- Error boundaries implemented
- Loading states for all async operations
- Performance optimized
