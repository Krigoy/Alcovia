# Backend Setup - Enrollment Form

This document describes the backend implementation for storing enrollment form submissions.

## Overview

The backend uses **Supabase** (PostgreSQL) to store enrollment data in the cloud. All form submissions from the "Enroll my child" form are saved to a Supabase database.

> **Note**: This project was migrated from SQLite to Supabase. The old SQLite implementation is still available in `lib/db.ts` but is no longer used.

## Database Structure

### Location
- Database: Supabase (PostgreSQL)
- Hosted in the cloud via Supabase
- Access via Supabase dashboard: https://app.supabase.com

### Schema

```sql
CREATE TABLE enrollments (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email ON enrollments(email);
CREATE INDEX idx_created_at ON enrollments(created_at);
```

See `supabase-migration.sql` for the complete migration script.

## API Endpoints

### POST `/api/signup`
Submits a new enrollment form.

**Request Body:**
```json
{
  "name": "Parent Name",
  "email": "parent@example.com",
  "context": "Optional context message"
}
```

**Response (Success):**
```json
{
  "ok": true,
  "message": "Enrollment submitted successfully",
  "id": 1
}
```

**Response (Error):**
```json
{
  "error": "Error message"
}
```

### GET `/api/enrollments`
Retrieves all enrollment submissions (for admin purposes).

**Response:**
```json
{
  "enrollments": [
    {
      "id": 1,
      "name": "Parent Name",
      "email": "parent@example.com",
      "context": "Optional context",
      "created_at": "2024-01-01 12:00:00"
    }
  ]
}
```

**Note:** In production, add authentication/authorization to this endpoint.

## Files Created/Modified

1. **`lib/supabase.ts`** - Supabase client configuration
   - Initializes Supabase client with environment variables
   - Validates configuration

2. **`lib/db-supabase.ts`** - Supabase database utility functions
   - `insertEnrollment()` - Save new enrollment
   - `getAllEnrollments()` - Retrieve all enrollments
   - `getEnrollmentById()` - Get single enrollment

3. **`lib/db.ts`** - Old SQLite implementation (deprecated, kept for reference)

2. **`app/api/signup/route.ts`** - Updated to save to database
   - Validates input data
   - Saves to SQLite database
   - Returns appropriate responses

3. **`app/api/enrollments/route.ts`** - New endpoint to view enrollments
   - GET endpoint to retrieve all submissions

4. **`components/CTA.tsx`** - Updated form component
   - Added loading states
   - Added success/error message display
   - Improved user feedback

5. **`.gitignore`** - Added database directory exclusion

## Features

- ✅ Form validation (name, email required)
- ✅ Input sanitization
- ✅ Error handling
- ✅ Success/error user feedback
- ✅ Loading states during submission
- ✅ Automatic database initialization
- ✅ Indexed database for performance

## Setup & Usage

### Initial Setup

1. **Create a Supabase project** (see `SUPABASE_SETUP.md` for detailed instructions)
   - Go to https://app.supabase.com
   - Create a new project
   - Get your API keys from Settings → API

2. **Configure environment variables** in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Run the database migration**:
   - Go to Supabase SQL Editor
   - Run the SQL from `supabase-migration.sql`

4. **Start the development server**:
   ```bash
   npm run dev
   ```

### Usage

1. Submit the form through the UI - data will be saved to Supabase automatically

2. View enrollments:
   - **Via API**: `GET http://localhost:3000/api/enrollments`
   - **Via Supabase Dashboard**: Table Editor → `enrollments` table

## Production Considerations

1. ✅ **Database**: Using Supabase (PostgreSQL) - production-ready
2. **Authentication**: Add authentication to the `/api/enrollments` endpoint
3. **Rate Limiting**: Add rate limiting to prevent spam
4. **Email Notifications**: Add email notifications when new enrollments are submitted
5. ✅ **Backup**: Supabase handles automatic backups
6. ✅ **Environment Variables**: Already configured via `.env.local`

## Environment Variables

Required environment variables (set in `.env.local`):

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key (safe for client-side)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-side only, keep secret)

See `SUPABASE_SETUP.md` for detailed setup instructions.

