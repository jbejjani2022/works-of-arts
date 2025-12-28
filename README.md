# works of arts

A minimal, modern, responsive website for artist portfolios, featuring a simple CMS for managing artworks and bio content.

Work done on commission for artist Marcella Vlahos.

Easily configurable for the work of any artist.

## What This App Is

This is a Next.js application that serves as an artist's portfolio website with:

- Public portfolio pages (home, about, artworks)
- Private admin interface for content management
- Integration with Supabase for database, authentication, and file storage

## Features

- **Public Portfolio**: Hero homepage, about page with artist headshot, filterable artworks gallery
- **Admin CMS**: Authentication-protected interface for managing artworks, bio, headshot, and CV
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS, and Supabase

## How to Run

### Prerequisites

- Node.js 18+ and npm
- Supabase project (see setup instructions below)

### Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase project details in `.env.local`.

3. **Set up artist configuration**

   Customize [`src/lib/config.ts`](src/lib/config.ts) according to the artist's information (name, bio fallback, social links).

4. **Set up database and storage**

   Follow the instructions in [docs/supabase-setup.md](docs/supabase-setup.md) to create the database tables and storage buckets.

   After setting up the database, run the migration to add the headshots table:
   ```bash
   # See docs/migrations/001_add_headshots_table.sql for SQL to run in Supabase
   ```

5. **Run development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

1. **Build the application:**

   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

## How to Test

Run the test suite:

```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui
```

## Environment Variables

Required environment variables (see `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)
- `NEXT_PUBLIC_APP_URL`: Your app's URL (for development: `http://localhost:3000`)

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Run ESLint with auto-fix
- `npm run typecheck`: Run TypeScript type checking
- `npm run format`: Format code with Prettier
- `npm run format:check`: Check code formatting
- `npm run test`: Run tests in watch mode
- `npm run test:run`: Run tests once
- `npm run test:ui`: Run tests with UI

## Architecture

The application follows a clean, maintainable architecture with:

- **App Router**: Next.js 13+ app directory structure
- **Server Components**: For static content and data fetching
- **Client Components**: For interactive features and forms
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first styling
- **Supabase**: Backend as a service for database, auth, and storage

See [docs/architecture.md](docs/architecture.md) for detailed architecture documentation.

## Supabase Setup

See [docs/supabase-setup.md](docs/supabase-setup.md) for complete Supabase configuration instructions.

## Deployment

This application is designed for deployment on Vercel with GitHub integration.

For complete deployment instructions, including:

- Connecting GitHub to Vercel
- Setting environment variables
- Custom domain setup
- Troubleshooting common issues

See the [Deployment Guide](docs/deployment.md).
