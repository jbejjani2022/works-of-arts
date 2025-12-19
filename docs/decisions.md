# Architecture Decision Records

## ADR-001: Framework Choice - Next.js 14 with App Router

**Status**: Accepted

**Context**: Need a modern React framework for a portfolio website with both static and dynamic content.

**Decision**: Use Next.js 14 with App Router

**Rationale**:

- Server-side rendering for SEO and performance
- App Router provides better developer experience and layout composition
- Built-in image optimization crucial for artwork display
- Vercel deployment integration
- TypeScript support out of the box

**Consequences**:

- Learning curve for App Router patterns
- Tight coupling to Next.js ecosystem
- Excellent performance and SEO
- Simplified deployment process

---

## ADR-002: Backend Service - Supabase

**Status**: Accepted

**Context**: Need backend services for database, authentication, and file storage.

**Decision**: Use Supabase as the primary backend service

**Rationale**:

- PostgreSQL database with excellent TypeScript integration
- Built-in authentication with email/password
- File storage with CDN for artwork images
- Row Level Security for data protection
- No server management required

**Consequences**:

- Vendor lock-in to Supabase ecosystem
- Limited control over database optimization
- Simplified architecture and deployment
- Automatic scaling and backup

---

## ADR-003: Styling - Tailwind CSS

**Status**: Accepted

**Context**: Need a CSS framework that supports responsive design and rapid development.

**Decision**: Use Tailwind CSS for all styling

**Rationale**:

- Utility-first approach for consistent design system
- Excellent responsive design capabilities
- Small bundle size with purging
- Great developer experience with IntelliSense
- No custom CSS needed for most use cases

**Consequences**:

- HTML can become verbose with many classes
- Learning curve for utility-first approach
- Excellent consistency and maintainability
- Fast development iteration

---

## ADR-004: Authentication Strategy - Single Admin User

**Status**: Accepted

**Context**: The portfolio is for a single artist who needs admin access.

**Decision**: Implement simple email/password auth for one admin user

**Rationale**:

- Single user eliminates need for complex role management
- Email/password is familiar and secure
- Supabase Auth handles security concerns
- No need for user registration flows

**Consequences**:

- Cannot easily add multiple admin users later
- Simple implementation and maintenance
- Secure with industry-standard practices

---

## ADR-005: Data Fetching - Server Components with ISR

**Status**: Accepted

**Context**: Public content should be fast and SEO-friendly, admin content needs real-time updates.

**Decision**: Use Server Components with ISR for public pages, Client Components for admin

**Rationale**:

- Server Components provide excellent performance for static content
- ISR ensures fresh content without rebuild
- Client Components enable real-time admin interface
- Clear separation of concerns

**Consequences**:

- Mixed rendering patterns to understand
- Optimal performance for both use cases
- SEO benefits for public content

---

## ADR-006: State Management - No Global State

**Status**: Accepted

**Context**: Application has simple state requirements.

**Decision**: Use React's built-in state management only

**Rationale**:

- Application state is mostly local to components
- Form state handled by react-hook-form
- Server state managed by direct Supabase calls
- Reduced complexity and bundle size

**Consequences**:

- May need refactoring if app becomes more complex
- Simple and maintainable codebase
- Fewer dependencies to manage

---

## ADR-007: Testing Strategy - Vitest + React Testing Library

**Status**: Accepted

**Context**: Need testing framework that works well with modern React and TypeScript.

**Decision**: Use Vitest with React Testing Library

**Rationale**:

- Vitest is fast and has excellent TypeScript support
- React Testing Library encourages good testing practices
- ESM support out of the box
- Great developer experience with watch mode

**Consequences**:

- Newer tooling with smaller ecosystem
- Excellent performance and developer experience
- Good test coverage capabilities

---

## ADR-008: Image Handling - Direct Supabase Storage

**Status**: Accepted

**Context**: Need to store and serve artwork images efficiently.

**Decision**: Store images directly in Supabase Storage, serve via CDN

**Rationale**:

- Supabase Storage provides CDN capabilities
- Direct upload from admin interface
- Automatic image optimization available
- Simple URL structure for Next.js Image

**Consequences**:

- Limited image processing options
- Simple implementation and maintenance
- Good performance with CDN
- Integrated with authentication system

---

## ADR-009: Deployment Platform - Vercel

**Status**: Accepted

**Context**: Need reliable hosting with good Next.js integration.

**Decision**: Deploy on Vercel with GitHub integration

**Rationale**:

- Excellent Next.js support and performance
- Automatic deployments on git push
- Built-in analytics and monitoring
- Edge network for global performance
- Simple environment variable management

**Consequences**:

- Vendor lock-in to Vercel platform
- Excellent developer experience
- Minimal deployment configuration required
- Built-in performance optimizations
