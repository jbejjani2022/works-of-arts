# Architecture Documentation

## Overview

This application is built with Next.js 14 using the App Router pattern, TypeScript for type safety, Tailwind CSS for styling, and Supabase as the backend service.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Testing**: Vitest, React Testing Library
- **Deployment**: Vercel

## Folder Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── about/page.tsx     # About page
│   ├── artworks/
│   │   ├── page.tsx       # Artworks listing
│   │   └── [id]/page.tsx  # Individual artwork
│   ├── admin/
│   │   ├── layout.tsx     # Admin-protected layout
│   │   ├── page.tsx       # Admin dashboard
│   │   └── login/page.tsx # Admin login
│   └── api/
│       └── revalidate/    # ISR revalidation endpoint
├── components/
│   ├── layout/           # Layout components
│   ├── artworks/         # Artwork display components
│   ├── admin/            # Admin interface components
│   └── ui/               # Reusable UI components
├── lib/
│   ├── supabase/         # Supabase client configuration
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # Utility functions
│   └── validation.ts     # Zod schemas
└── test/                 # Test setup and utilities
```

## Data Architecture

### Database Schema

**artworks table:**

- `id` (uuid, primary key)
- `title` (text, required)
- `year` (integer, required)
- `medium` (enum: Painting, Work on Paper, Sculpture)
- `details` (text, optional)
- `height` (numeric, optional)
- `width` (numeric, optional)
- `length` (numeric, optional)
- `image_url` (text, required)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Display Rules:**

- Dimensions are only displayed if both width and height are provided
- For sculptures, dimensions are only displayed if width, height, AND length are all provided

**bio table:**

- `id` (uuid, primary key)
- `content` (text, required)
- `updated_at` (timestamp)

### Storage

- **Bucket**: `artworks`
- **Access**: Public read, authenticated write
- **File organization**: `/{artwork-id}/{filename}`

## Component Architecture

### Server Components

- All page routes (`page.tsx` files)
- Admin layout for authentication checking
- Initial data fetching for public content

### Client Components

- Interactive UI elements (forms, modals, toggles)
- Admin interface components
- Real-time features and state management

## Authentication & Authorization

- **Authentication**: Supabase Auth with email/password
- **Authorization**: Row Level Security (RLS) policies
- **Admin Access**: Single authenticated user (the artist)
- **Public Access**: Anonymous read access to artworks and bio

### RLS Policies

```sql
-- artworks table
SELECT: allow anon and authenticated
INSERT/UPDATE/DELETE: allow authenticated only

-- bio table
SELECT: allow anon and authenticated
UPDATE: allow authenticated only
```

## Data Flow

### Public Pages

1. Server Component → Supabase Server Client → Database
2. Static generation with ISR (60s revalidation)
3. Cached responses for performance

### Admin Interface

1. Client Component → Supabase Browser Client → Database/Storage
2. Real-time updates via direct client calls
3. RLS ensures data security

## State Management

- **Local State**: React `useState` for component-specific state
- **Form State**: `react-hook-form` with Zod validation
- **Server State**: Direct Supabase calls (no additional cache layer)
- **Navigation State**: Next.js router for page state

## Performance Considerations

- **Images**: Next.js Image component with optimization
- **Caching**: ISR for public content, on-demand revalidation
- **Code Splitting**: Automatic with Next.js App Router
- **Bundle Size**: Tree shaking, minimal dependencies

## Security

- **Environment Variables**: Separated by environment
- **API Keys**: Supabase anon key for public access only
- **File Uploads**: Direct to Supabase Storage with RLS
- **XSS Protection**: React's built-in protections
- **CSRF Protection**: Supabase handles auth tokens

## Testing Strategy

- **Unit Tests**: Utility functions and components
- **Integration Tests**: Page components with mocked data
- **E2E Tests**: Critical user flows (future enhancement)
- **Type Safety**: TypeScript for compile-time checks

## Deployment

### Vercel Configuration

- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Environment Variables**: Set in Vercel dashboard
- **Domain**: Custom domain configuration

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

## Monitoring & Maintenance

- **Error Tracking**: Built-in Next.js error boundaries
- **Performance**: Vercel Analytics (optional)
- **Uptime**: Vercel's built-in monitoring
- **Content Updates**: Admin interface for non-technical updates

## Future Enhancements

- **SEO**: Open Graph meta tags for artwork sharing
- **Analytics**: User behavior tracking
- **Performance**: Image CDN optimization
- **Features**: Contact form, exhibition history
