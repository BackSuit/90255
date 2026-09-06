# 90255.com — Local Portal for Huntington Park, CA

A production-ready local business directory, real estate listing portal, and community resource for ZIP code 90255 (Huntington Park, California).

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | PostgreSQL (Supabase) |
| ORM | Drizzle ORM |
| Auth | Supabase Auth (Google + Email/Password) |
| Image Storage | Vercel Blob |
| Validation | Zod |
| Deployment | Vercel |

## Features

- **Business Directory** — Browse, search, submit, and claim businesses
- **Real Estate Listings** — Property listings with affiliate-ready architecture
- **Admin Panel** — Manage businesses, submissions, claims, and listings
- **Authentication** — Custom JWT-based Authentication (`jose` + `bcryptjs`) + Email/Password
- **Image Uploads** — Via Vercel Blob with file validation
- **SEO** — Dynamic sitemap, meta tags, JSON-LD structured data, breadcrumbs
- **Domain for Sale** — Professional CTA pages linking to GoDaddy/Afternic

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm
- A [Supabase](https://supabase.com) project
- A [Vercel](https://vercel.com) account (for Blob storage)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd 90255
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `DATABASE_URL` | Supabase PostgreSQL connection string (use "Transaction pooler") |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read/write token |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` for dev, `https://90255.com` for prod |

### 3. Database Setup

Run the initial migration in your Supabase SQL Editor:

1. Connect to your PostgreSQL database (e.g. using TablePlus, pgAdmin, or psql)
2. Run the SQL script located in `drizzle/migrations/0000_initial.sql`
3. This creates all necessary tables (`profiles`, `businesses`, etc.)

### 4. Vercel Blob Setup

1. Go to your Vercel project → **Storage** → **Blob**
2. Create a new Blob store
3. Copy the `BLOB_READ_WRITE_TOKEN` to your `.env.local`

### 5. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin panel (server-side auth guard)
│   ├── auth/               # Login, signup, password reset, OAuth callback
│   ├── businesses/         # Business directory pages
│   ├── real-estate/        # Real estate listing pages
│   ├── search/             # Business search
│   ├── domain-for-sale/    # Domain acquisition page
│   ├── about|contact|privacy|terms/  # Static pages
│   ├── sitemap.ts          # Dynamic sitemap generation
│   ├── robots.ts           # robots.txt
│   └── page.tsx            # Homepage
├── actions/                # Server actions (business, claims, real-estate, upload)
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Header, footer, domain CTA
│   ├── business/           # Business card, grid, search, categories
│   ├── real-estate/        # Listing card, grid
│   ├── shared/             # Breadcrumbs
│   └── admin/              # Admin forms and action buttons
├── lib/
│   ├── db/                 # Drizzle schema and client
│   ├── supabase/           # Supabase client and server helpers
│   ├── blob/               # Vercel Blob upload helpers
│   ├── categories.ts       # Static category definitions
│   ├── constants.ts        # Site-wide constants
│   ├── validations.ts      # Zod schemas
│   └── utils.ts            # Utility functions
└── middleware.ts            # Supabase session refresh
```

## Business Categories

Categories are defined statically in `src/lib/categories.ts`. To add or edit categories:

1. Open `src/lib/categories.ts`
2. Add/edit entries in the `CATEGORIES` array
3. Each category has: `slug`, `name`, `icon` (Lucide), `description`

Current categories: Restaurants, Auto Repair, Beauty & Barber, Healthcare, Legal, Real Estate, Home Services, Retail, Professional Services, Grocery, Fitness, Education, Automotive, Other.

## Creating an Admin User

After signing up via the website:

```sql
-- Run in Supabase SQL Editor
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

## Importing/Seeding Businesses

Insert businesses directly via SQL:

```sql
INSERT INTO businesses (name, slug, description, category, address, city, state, zip, phone, website, status)
VALUES (
  'Example Restaurant',
  'example-restaurant',
  'A great local restaurant.',
  'restaurants',
  '123 Pacific Blvd',
  'Huntington Park',
  'CA',
  '90255',
  '3235550123',
  'https://example.com',
  'published'
);
```

Or use the admin panel at `/admin` to manage businesses through the UI.

## Database Migrations

Migrations are stored in `drizzle/migrations/`. To create new migrations:

1. Edit the schema in `src/lib/db/schema.ts`
2. Generate migration: `npx drizzle-kit generate`
3. Apply migration in Supabase SQL Editor

## Deployment (Vercel)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add all environment variables (see `.env.example`)
4. Set `NEXT_PUBLIC_SITE_URL` to `https://90255.com`
5. Deploy

## Domain for Sale

The domain sale CTA links to:
```
https://www.godaddy.com/en-ph/domainsearch/find?domainToCheck=90255
```

This is configured in `src/lib/constants.ts` as `DOMAIN_SALE_URL`.

## Future Expansion

The architecture supports easy addition of:
- **Payments** (Paddle) — No payment code exists yet, but the schema/actions pattern makes integration straightforward
- **Reviews** — Add a `reviews` table referencing `businesses`
- **Events/Jobs** — New tables + route groups
- **AI Search** — Replace PostgreSQL `ilike` with vector search
- **Affiliate feeds** — Real estate listings support `external_url`, `source`, and `affiliate_source` columns
