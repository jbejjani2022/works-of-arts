# Production Deployment Checklist

Use this checklist before and after deploying to production.

## Pre-Deployment Checklist

### Code Quality

- [ ] All tests pass locally (`npm run test:run`)
- [ ] TypeScript compilation succeeds (`npm run typecheck`)
- [ ] Linting passes without errors (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Production build succeeds locally (`npm run build`)

### Configuration

- [ ] Artist configuration is correct in `src/lib/config.ts`
  - [ ] Artist name
  - [ ] Artist photo URL
  - [ ] Bio fallback text
  - [ ] Social media links
- [ ] `.env.example` is up to date with all required variables
- [ ] No sensitive credentials are committed to Git
- [ ] `.gitignore` includes `.env` and `.env.local`

### Supabase Setup

- [ ] Production Supabase project is created
- [ ] Database schema is deployed (all tables created)
- [ ] Row Level Security (RLS) policies are enabled
  - [ ] `artworks` table: SELECT for anon/auth, INSERT/UPDATE/DELETE for auth only
  - [ ] `bio` table: SELECT for anon/auth, UPDATE for auth only
  - [ ] `cv` table: SELECT for anon/auth, UPDATE for auth only
- [ ] Storage buckets are created and configured
  - [ ] `artworks` bucket is public
  - [ ] `CV` bucket is public
  - [ ] RLS policies allow read for anon/auth, write for auth only
- [ ] At least one admin user is created for authentication
- [ ] Initial content is populated (optional):
  - [ ] Bio content in `bio` table
  - [ ] Sample artworks in `artworks` table (if desired)

### GitHub Repository

- [ ] All changes are committed to Git
- [ ] Working branch is merged to `main`
- [ ] Repository is pushed to GitHub
- [ ] Repository is set to private or public (as desired)

## Vercel Deployment Checklist

### Initial Setup

- [ ] Vercel account is created
- [ ] GitHub repository is connected to Vercel
- [ ] Project is imported in Vercel dashboard
- [ ] Framework preset is set to "Next.js" (auto-detected)

### Environment Variables

Set these in Vercel project settings:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` (from Supabase Dashboard → Settings → API)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from Supabase Dashboard → Settings → API)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (from Supabase Dashboard → Settings → API)
- [ ] `NEXT_PUBLIC_APP_URL` (your Vercel URL or custom domain)

### Deployment

- [ ] Click "Deploy" in Vercel dashboard
- [ ] Build completes successfully (check build logs)
- [ ] No critical errors in deployment logs
- [ ] Deployment URL is accessible

## Post-Deployment Verification

### Functionality Testing

- [ ] **Home page** loads correctly
  - [ ] Random artwork is displayed
  - [ ] Sidebar opens/closes smoothly
  - [ ] Navigation links work
- [ ] **About page** loads correctly
  - [ ] Artist photo displays
  - [ ] Bio content renders correctly
  - [ ] Contact links work (email, Instagram, CV)
- [ ] **Artworks page** loads correctly
  - [ ] Artwork grid displays
  - [ ] Item count is correct
  - [ ] Medium filters work (Paintings, Works on Paper, Sculpture)
  - [ ] Filtered URLs are correct
- [ ] **Artwork detail page** works
  - [ ] Individual artworks load
  - [ ] Navigation (prev/next) works
  - [ ] Zoom modal opens and functions
  - [ ] Breadcrumbs work correctly
- [ ] **Admin authentication** works
  - [ ] Can log in at `/admin/login`
  - [ ] Can log out
  - [ ] Protected routes redirect to login when not authenticated
- [ ] **Admin CMS** functions correctly
  - [ ] Can create new artworks
  - [ ] Can edit existing artworks
  - [ ] Can delete artworks
  - [ ] Can upload images to Supabase Storage
  - [ ] Can edit bio with rich text formatting
  - [ ] Can upload CV (if none exists)
  - [ ] Can replace CV (if one exists)

### Error Handling

- [ ] Visit a non-existent page (e.g., `/test-404`)
  - [ ] 404 page displays correctly
  - [ ] "Go Home" link works
- [ ] Disconnect internet and reload a page
  - [ ] Error message displays appropriately
  - [ ] No unhandled errors in console

### SEO & Metadata

- [ ] Open browser dev tools → Elements/Inspector
- [ ] Check `<head>` section includes:
  - [ ] `<title>` tag is correct
  - [ ] `<meta name="description">` is present
  - [ ] Open Graph tags are present (`og:title`, `og:description`, `og:image`, `og:url`)
  - [ ] Twitter Card tags are present (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- [ ] Test social media sharing
  - [ ] Share a link on Twitter/X
  - [ ] Verify card preview displays correctly
  - [ ] Share a link on Facebook/LinkedIn
  - [ ] Verify preview displays correctly

### Performance

- [ ] Run Lighthouse audit in Chrome DevTools
  - [ ] Performance score > 80 (target: 90+)
  - [ ] Accessibility score > 90
  - [ ] Best Practices score > 90
  - [ ] SEO score > 90
- [ ] Test on mobile device
  - [ ] Pages load quickly
  - [ ] Layout is responsive
  - [ ] Touch interactions work smoothly

### Security

- [ ] Check browser console for security warnings
- [ ] Verify no credentials are exposed in client-side code
- [ ] Test RLS policies:
  - [ ] Can view artworks without authentication
  - [ ] Cannot edit artworks without authentication
  - [ ] Admin operations require authentication

### Monitoring

- [ ] Vercel Analytics is enabled (optional)
- [ ] Review deployment logs for warnings or errors
- [ ] Check Supabase dashboard for database activity

## Optional Enhancements

### Custom Domain

- [ ] Custom domain is configured in Vercel
- [ ] DNS records are updated
- [ ] SSL certificate is issued (automatic with Vercel)
- [ ] `NEXT_PUBLIC_APP_URL` environment variable is updated
- [ ] Site is redeployed after updating environment variable
- [ ] Custom domain is accessible
- [ ] Vercel auto-generated URL redirects to custom domain (optional)

### Analytics

- [ ] Google Analytics is configured (if desired)
- [ ] Vercel Analytics is enabled for advanced metrics
- [ ] Privacy policy is added (if using analytics)

### Error Tracking

- [ ] Sentry or similar error tracking is configured (optional)
- [ ] Error alerts are set up

## Ongoing Maintenance

### Weekly

- [ ] Review Vercel deployment logs for errors
- [ ] Check Supabase usage (database storage, bandwidth)
- [ ] Test critical user flows (login, uploads, etc.)

### Monthly

- [ ] Review Vercel Analytics for traffic patterns
- [ ] Test all admin functionality
- [ ] Verify all images and content load correctly
- [ ] Run Lighthouse audit to track performance over time

### Quarterly

- [ ] Update npm dependencies
  ```bash
  npm update
  npm run test:run
  npm run build
  ```
- [ ] Review and optimize Supabase queries
- [ ] Consider rotating Supabase service role key
- [ ] Backup database content from Supabase (export SQL)

## Rollback Plan

If critical issues occur after deployment:

1. [ ] Go to Vercel Dashboard → Deployments
2. [ ] Find the last known good deployment
3. [ ] Click ⋯ menu → "Promote to Production"
4. [ ] Verify the previous version is now live
5. [ ] Investigate and fix the issue locally
6. [ ] Redeploy when ready

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Project Deployment Guide](./deployment.md)
- [Supabase Setup Guide](./supabase-setup.md)
- [Architecture Documentation](./architecture.md)

---

**Last Updated**: 2025-12-27
