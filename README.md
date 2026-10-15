# Alcovia 2.0 — Animated Learning-Platform Website

A redesigned marketing site for Alcovia, a leadership program for teenagers, built as a **24-hour full-stack take-home challenge**. The brief asked for a bold, premium feel with scroll animations and micro-interactions. Beyond the front end, it includes Clerk sign-in and an enrollment form backed by a Supabase (PostgreSQL) database.

**Live demo:** https://alcovia-omega.vercel.app

<!-- TODO: add a screenshot or short GIF of the hero and offerings grid, e.g. ![Alcovia hero](docs/screenshot-hero.png) -->

## Features

- **Hero section** with scroll-linked parallax and staggered entrance animation (Framer Motion `useScroll` / `useTransform`).
- **Custom "Alcovian" cursor** that follows the pointer with smoothing via `requestAnimationFrame`; hidden on touch devices.
- **Manifesto, offerings grid and "At school / Outside school" toggle** with scroll-triggered reveals and hover effects (Framer Motion, GSAP ScrollTrigger in the toggle and CTA section).
- **Scroll progress indicator** and CSS smooth scrolling.
- **Reduced-motion support** through a `useMotionPref` hook that respects `prefers-reduced-motion`.
- **Enrollment form** — `POST /api/signup` validates the name and email on the server and stores the submission in Supabase.
- **Authentication** — Clerk sign-in / sign-up pages and a sign-out button.

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS 3, shadcn/ui components |
| Animation | Framer Motion, GSAP + ScrollTrigger |
| Auth | Clerk (`@clerk/nextjs` v4) |
| Database | Supabase (PostgreSQL) via `@supabase/supabase-js` |
| Hosting | Vercel |

## How it works

```
Browser ──(form submit)──▶ /api/signup (Next.js route handler)
                              │  validates name + email
                              ▼
                         Supabase "enrollments" table
                         (server-side client, service-role key never sent to the browser)
```

Key files:

```
app/page.tsx                 Page composition (hero, manifesto, offerings, toggle, CTA, footer)
app/api/signup/route.ts      Enrollment endpoint with server-side validation
components/                  Section components, custom cursor, scroll progress, CTA modal
lib/ScrollProvider.tsx       GSAP ScrollTrigger defaults and smooth-scroll class
lib/supabase.ts              Server-side Supabase client
lib/db-supabase.ts           Database helpers
middleware.ts                Clerk middleware (public routes listed explicitly)
supabase-migration.sql       Table, indexes and row-level-security policy
```

## Getting started

### Prerequisites

- Node.js 18+ and pnpm
- A [Supabase](https://supabase.com) project and a [Clerk](https://clerk.com) application

### Setup

```bash
git clone https://github.com/Krigoy/Alcovia.git
cd Alcovia
pnpm install
cp .env.local.example .env.local   # then fill in your own keys
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Clerk authentication |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — used by the API route to write enrollments |

Create the database table by running `supabase-migration.sql` in the Supabase SQL editor, then:

```bash
pnpm dev     # http://localhost:3000
pnpm build && pnpm start
```

If the Clerk keys are missing, the middleware falls back to a pass-through so the public site still runs locally.

## Further notes

Detailed notes from the build live in [`docs/`](docs): design decisions and the component-to-brief mapping, performance notes, and Clerk, Supabase and Vercel setup guides.

## Limitations and next steps

- Built under a 24-hour time limit; there are no automated tests.
- There is no admin view of enrollments yet. One should sit behind Clerk authentication and a role check.
- Signed-in users don't yet get any member-only features.
- `better-sqlite3` (from an earlier SQLite version) and `lenis` are listed as dependencies but unused, and can be removed.
