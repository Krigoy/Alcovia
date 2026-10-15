# Clerk Authentication Setup Guide

## Prerequisites
- A Clerk account (sign up at https://clerk.com)
- Your Next.js project set up

## Step 1: Create a Clerk Application

1. Go to https://dashboard.clerk.com
2. Click "Create Application"
3. Choose your preferred authentication methods (Email, Google, etc.)
4. Complete the setup wizard

## Step 2: Get Your API Keys

1. In your Clerk Dashboard, go to **API Keys**
2. Copy the following keys:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)

## Step 3: Configure Google OAuth (Optional but Recommended)

1. In your Clerk Dashboard, go to **User & Authentication** → **Social Connections**
2. Click on **Google**
3. Enable Google OAuth
4. You'll need to:
   - Create a Google Cloud Project (if you don't have one)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `https://your-domain.com/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google` (for local development)
   - Copy the **Client ID** and **Client Secret** from Google Cloud Console
   - Paste them into Clerk's Google OAuth settings
5. Save the configuration

## Step 4: Add Environment Variables

Create or update your `.env.local` file in the root of your project:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional: For production
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
# CLERK_SECRET_KEY=sk_live_...
```

## Step 5: Configure Allowed Redirect URLs

In your Clerk Dashboard:
1. Go to **Paths**
2. Add the following redirect URLs:
   - `http://localhost:3000/*` (for development)
   - `https://your-domain.com/*` (for production)

## Step 6: Verify Setup

1. Restart your Next.js development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `/login` or `/sign-in`
3. You should see:
   - Email/Password login option
   - Google login button (if configured)
   - Other social providers you've enabled

## Troubleshooting

### Google OAuth Not Showing
- Ensure Google OAuth is enabled in Clerk Dashboard
- Verify Google Cloud credentials are correctly entered
- Check that redirect URIs match exactly (including http vs https)
- Make sure you've saved the configuration in Clerk

### Hydration Errors
- Clear `.next` folder and restart dev server
- Ensure all client components have `"use client"` directive
- Check for any server-side rendering of client-only code

### Authentication Not Working
- Verify environment variables are correctly set
- Check that keys match your Clerk application
- Ensure middleware is properly configured
- Check browser console for any error messages

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Integration](https://clerk.com/docs/quickstarts/nextjs)
- [Google OAuth Setup](https://clerk.com/docs/authentication/social-connections/google)
