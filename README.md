# Insights Mafia — Website

Next.js (App Router) + TypeScript + Tailwind + Prisma. Public marketing site
plus a working admin panel (leads inbox, services publish toggle).

## Structure

```
src/app/            pages (App Router) + API routes
src/app/admin/      admin panel (login, dashboard, leads, services)
src/app/api/        public API (leads, auth) + admin API (stats, leads, services)
src/components/     one file per section/element (Hero, ServicesList, WorkGrid, ...)
src/lib/            db client, auth helpers, zod validation
prisma/schema.prisma  full content model (Pages, Services, Projects, Leads, etc.)
prisma/seed.ts      creates the admin user + starter services
public/logo.jpg     your logo
```

## Run it locally

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Site: http://localhost:3000
Admin: http://localhost:3000/admin/login — sign in with the ADMIN_EMAIL /
ADMIN_PASSWORD from your `.env` (defaults are in `.env.example` — change them).

## What's real vs. what's a starting point

**Working now:**
- Contact form → validated (zod) → saved to the database → shows up in
  `/admin/leads` immediately. Honeypot + basic rate limiting included.
- Admin login (JWT + bcrypt password hashing).
- Services publish/draft toggle from the admin panel.

**Stubbed / next steps** (per the original spec):
- Email notifications on new leads (wire Resend or SMTP in
  `src/app/api/leads/route.ts` — the `TODO` is marked).
- Full CRUD for Projects, Team, Testimonials, Posts, FAQ, Pages (the schema
  and models already exist in `prisma/schema.prisma` — this scaffold wires
  Services + Leads end-to-end as the pattern to copy for the rest).
- Image upload to object storage (Vercel Blob / Cloudflare R2).
- Block-builder for flexible pages, SEO metadata/sitemap/JSON-LD, Cloudflare
  Turnstile on the form.
- Swapping SQLite for hosted Postgres (Neon/Supabase) before deploying —
  change `provider` in `prisma/schema.prisma` to `"postgresql"` and update
  `DATABASE_URL`, then `npx prisma migrate deploy`.

## Design system

Colors, type and the "funky-professional" look (light background, purple/
coral/yellow pops, chunky outlined buttons with hard offset shadows, tilted
cards) live in `src/app/globals.css` as CSS variables — change the palette
there and it updates everywhere.

## Deploying

Vercel is the easiest path: push this repo to GitHub, import it in Vercel,
add the env vars from `.env.example` (with a real Postgres `DATABASE_URL`),
and deploy.
