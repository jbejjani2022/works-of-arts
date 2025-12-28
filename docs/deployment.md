# Deployment Guide

This guide covers deploying the Works of Arts portfolio site to Vercel with GitHub integration.

## Prerequisites

Before deploying, ensure you have:

1. **GitHub Repository**: Your code is pushed to a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free Hobby tier is sufficient)
3. **Supabase Project**: Your production Supabase instance is set up and configured (see [supabase-setup.md](./supabase-setup.md))

## Initial Deployment

### Step 1: Connect GitHub Repository to Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Select **"Import Git Repository"**
4. Choose your GitHub repository from the list
5. If not visible, click **"Adjust GitHub App Permissions"** to grant Vercel access to your repository

### Step 2: Configure Project Settings

Vercel will auto-detect that this is a Next.js project. Verify the following settings:

- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Step 3: Set Environment Variables

In the Vercel project settings, add the following environment variables:

**Required Variables:**

```
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_APP_URL=https://your-site.vercel.app
```

**Where to find these values:**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
5. Copy the **anon/public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
6. Copy the **service_role key** (`SUPABASE_SERVICE_ROLE_KEY`)

**Note on `NEXT_PUBLIC_APP_URL`:**

- Initially set this to your Vercel auto-generated URL (e.g., `https://your-project.vercel.app`)
- After deployment, update this if you connect a custom domain
- You can leave it as the Vercel URL initially and update it later

### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your site (takes 2-3 minutes)
3. Once complete, you'll see a success message with your live URL

## Continuous Deployment

### Automatic Deploys

With GitHub integration enabled, Vercel will automatically:

- **Deploy to Production** when you push to the `main` branch
- **Create Preview Deployments** for pull requests and other branches

### Manual Deploys

To trigger a manual deployment:

1. Go to your project in the Vercel Dashboard
2. Click the **"Deployments"** tab
3. Click **"Redeploy"** on any previous deployment

## Custom Domain Setup

### Adding a Custom Domain

1. Go to your project in the Vercel Dashboard
2. Click **"Settings"** → **"Domains"**
3. Enter your custom domain (e.g., `marcellavlahos.com`)
4. Follow Vercel's DNS configuration instructions

### Update Environment Variables

After adding a custom domain:

1. Go to **"Settings"** → **"Environment Variables"**
2. Update `NEXT_PUBLIC_APP_URL` to your custom domain:
   ```
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```
3. Click **"Save"**
4. Redeploy the site for changes to take effect

## Post-Deployment Configuration

### Verify SEO Meta Tags

After deployment, verify your SEO configuration:

1. Visit your site
2. Use browser dev tools to inspect the `<head>` section
3. Verify Open Graph and Twitter Card meta tags are present
4. Test social media sharing on Twitter, LinkedIn, or Facebook

### Test Error Boundaries

Verify error handling works correctly:

- Navigate to a non-existent page (e.g., `/test-404`) to see the 404 page
- The error boundary should catch and display errors gracefully

### Monitor Performance

Vercel provides built-in analytics:

1. Go to **"Analytics"** tab in your project dashboard
2. Monitor page load times, Core Web Vitals, and visitor traffic
3. Use this data to identify performance bottlenecks

## Troubleshooting

### Build Failures

**Issue**: Build fails with environment variable errors

**Solution**: Verify all required environment variables are set in Vercel dashboard

**Issue**: TypeScript compilation errors

**Solution**: Run `npm run typecheck` locally to identify and fix type errors before pushing

### Runtime Errors

**Issue**: "Failed to fetch data" errors on deployed site

**Solution**:

- Verify Supabase URL and keys are correct in Vercel environment variables
- Check Supabase RLS policies allow public read access to necessary tables
- Review Vercel deployment logs for specific error messages

**Issue**: Images not loading

**Solution**:

- Verify Supabase Storage bucket is set to public
- Check image URLs are correct in the database
- Ensure `next.config.ts` includes Supabase domain in `images.remotePatterns`

### Environment Variables

**Issue**: Changes to environment variables not taking effect

**Solution**: After updating environment variables in Vercel dashboard, you must redeploy the site for changes to take effect

## Rollback Strategy

If a deployment introduces issues:

1. Go to **"Deployments"** tab in Vercel Dashboard
2. Find the last known good deployment
3. Click the three dots menu (⋯) → **"Promote to Production"**
4. This instantly rolls back to the previous version

## Security Best Practices

### Environment Variables

- **Never commit** `.env.local` or production credentials to Git
- Use Vercel's environment variable management exclusively for production secrets
- Rotate Supabase service role key periodically (every 90 days)

### API Keys

- The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose in client-side code (it's public)
- The `SUPABASE_SERVICE_ROLE_KEY` should **never** be used in client components
- All sensitive operations should use Supabase RLS policies for security

## Performance Optimization

### Image Optimization

Next.js automatically optimizes images via the `next/image` component:

- Images are served in modern formats (WebP/AVIF) when supported
- Images are lazy-loaded by default
- Vercel's Edge Network serves optimized images globally

### Caching Strategy

The app uses Next.js revalidation for optimal performance:

- Home page: 1 hour revalidation (`revalidate = 3600`)
- About & Artworks pages: 5 minutes revalidation (`revalidate = 300`)
- Artwork detail pages: 5 minutes revalidation (`revalidate = 300`)

### CDN & Edge

Vercel automatically:

- Serves static assets via global CDN
- Caches pages at the edge for fast load times
- Serves content from the nearest edge location to visitors

## Monitoring & Maintenance

### Recommended Monitoring

**Free Tier:**

- Vercel Analytics (included)
- Vercel Deployment Logs (included)
- Supabase Dashboard (monitors database usage)

**Optional (Paid):**

- Sentry for error tracking
- Google Analytics for detailed user analytics

### Regular Maintenance Tasks

**Weekly:**

- Review Vercel deployment logs for errors
- Check Supabase database storage usage

**Monthly:**

- Review Vercel Analytics for traffic patterns
- Optimize images if new artworks added
- Test all site functionality (forms, uploads, etc.)

**Quarterly:**

- Update dependencies (`npm update`)
- Review and optimize Supabase queries
- Consider rotating Supabase service role key

## Scaling Considerations

### Vercel Hobby Tier Limits

The free Hobby tier includes:

- **Bandwidth**: 100GB/month
- **Build Execution**: 100 hours/month
- **Serverless Function Execution**: 100GB-hours/month

For an artist portfolio site, these limits are typically sufficient.

### When to Upgrade

Consider upgrading to Vercel Pro if you exceed:

- 10,000+ monthly visitors
- 100GB bandwidth usage
- Need for advanced analytics

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)

## Support

If you encounter issues not covered in this guide:

1. Check [Vercel Status Page](https://www.vercel-status.com/) for service outages
2. Review [Vercel Community Forums](https://github.com/vercel/next.js/discussions)
3. Contact Vercel Support via dashboard (Pro tier only)
