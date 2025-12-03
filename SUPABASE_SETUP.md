# Supabase Setup Guide

This guide will help you set up Supabase for storing enrollment form submissions.

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - **Name**: Your project name (e.g., "Alcovia")
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project" and wait for it to be set up (~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** (gear icon) → **API**
2. You'll see:
   - **Project URL**: Copy this value
   - **anon/public key**: Copy this value
   - **service_role key**: Copy this value (⚠️ Keep this secret!)

## Step 3: Create the Database Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `supabase-migration.sql` into the editor
4. Click "Run" to execute the SQL
5. You should see a success message

Alternatively, you can use the Table Editor:
1. Go to **Table Editor** in the sidebar
2. Click "New table"
3. Name it `enrollments`
4. Add the following columns:
   - `id` (type: int8, primary key, auto-increment)
   - `name` (type: text, not null)
   - `email` (type: text, not null)
   - `context` (type: text, nullable)
   - `created_at` (type: timestamptz, default: now())
5. Save the table

## Step 4: Configure Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add the following variables with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 5: Restart Your Development Server

After adding the environment variables:

```bash
# Stop your current dev server (Ctrl+C)
# Then restart it
npm run dev
```

## Step 6: Test the Integration

1. Open your app in the browser
2. Click "Enroll my child"
3. Fill out and submit the form
4. Check your Supabase dashboard → **Table Editor** → `enrollments` table
5. You should see your submission!

## Security Notes

- ✅ The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose in client-side code
- ⚠️ The `SUPABASE_SERVICE_ROLE_KEY` should **NEVER** be exposed to the client
- The `.env.local` file is already in `.gitignore` and won't be committed
- Row Level Security (RLS) is enabled on the table for additional security

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` exists in the project root
- Check that all three environment variables are set
- Restart your dev server after adding/changing env variables

### "Failed to insert enrollment" error
- Check that the `enrollments` table exists in Supabase
- Verify the table structure matches the migration SQL
- Check the Supabase dashboard logs for detailed error messages

### "relation 'enrollments' does not exist"
- Run the SQL migration in the Supabase SQL Editor
- Or create the table manually using the Table Editor

## Viewing Submissions

You can view all enrollments in two ways:

1. **Supabase Dashboard**: Go to Table Editor → `enrollments`
2. **API Endpoint**: `GET http://localhost:3000/api/enrollments` (in production, add authentication)

## Next Steps

- [ ] Set up email notifications when new enrollments are submitted
- [ ] Add authentication to the `/api/enrollments` endpoint
- [ ] Set up rate limiting to prevent spam
- [ ] Configure backups in Supabase dashboard

