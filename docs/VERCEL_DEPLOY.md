# Vercel Deployment Guide

## Quick Deploy

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository: `Krigoy/Alcovia`
4. Vercel will auto-detect Next.js settings
5. **IMPORTANT**: Add the following environment variables before deploying:

### Required Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

#### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

#### Supabase Database
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Option 2: Deploy via CLI

```bash
# Login to Vercel (if not already logged in)
vercel login

# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

**Note**: You'll still need to add environment variables in the Vercel Dashboard after the first deployment.

## After Deployment

1. **Set Environment Variables**: Go to Project Settings → Environment Variables and add all required variables
2. **Redeploy**: After adding environment variables, trigger a new deployment
3. **Check Build Logs**: Monitor the deployment in the Vercel dashboard

## Automatic Deployments

Once connected to GitHub, Vercel will automatically deploy:
- Every push to `main` branch → Production
- Pull requests → Preview deployments

## Troubleshooting

- **Build Errors**: Check build logs in Vercel dashboard
- **Environment Variables**: Ensure all variables are set for Production, Preview, and Development
- **Database Connection**: Verify Supabase URL and keys are correct
- **Clerk Authentication**: Ensure Clerk keys are set correctly

## Current Project Status

✅ Code pushed to GitHub: `main` branch
✅ Build tested locally: Successful
⏳ Vercel deployment: Pending setup

