# Ascension Convention 2026 – Shirt Order Form

Astro 5 SSR order form for Ascension Convention 2026 shirts. Features Stripe checkout, PostgreSQL (Drizzle), Resend emails, admin order management, and a design picker with zoomable shirt images.

## Stack

- **Astro 5** (SSR) with Netlify adapter (Cloudflare Pages and Node adapters available)
- **Stripe** – Payments and webhooks
- **Drizzle ORM** – PostgreSQL schema and migrations
- **Resend** – Order confirmation emails
- **pnpm** – Package manager

## Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm` or `corepack enable && corepack prepare pnpm@latest --activate`)
- PostgreSQL (local, [Supabase](https://supabase.com), [Neon](https://neon.tech), etc.)
- Stripe and Resend accounts

## Quick Start

```bash
# Install dependencies (uses pnpm)
pnpm install

# Copy env template
cp .env.example .env
# Edit .env with your keys

# Run database migrations
pnpm db:migrate

# Start dev server
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build locally |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:studio` | Open Drizzle Studio for DB inspection |

## Environment Variables

See `.env.example` for all required variables:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `RESEND_API_KEY` | Resend API key |
| `ADMIN_PASSWORD` | Password for `/admin` |
| `SITE_URL` | Base URL for redirects and emails |
| `ADMIN_EMAIL` | Optional notification email |

## Deployment

- **Netlify**: Default adapter. Deploy via Netlify CLI or Git.
- **Cloudflare Pages**: Use `astro.config.cloudflare.mjs` and deploy with Wrangler.
- **Node/VPS**: Use `astro.config.node.mjs` for Node.js server deployment.

Configure environment variables in your platform’s dashboard.

## Order Form & Designs

The order form (`/`) lets customers choose from six shirt designs:

| Design | Name |
|--------|------|
| 1 | White with pink lettering |
| 2 | White with gold lettering |
| 3 | Black with pink lettering |
| 4 | Black with gold lettering |
| 5 | Black weathered with pink lettering |
| 6 | Black weathered with gold lettering |

- **Design images** live in `src/images/` (shirt-1.jpg through shirt-6.png) and are imported at build time.
- **Image zoom modal**: Click any design thumbnail to view it larger. Closable via X button, Escape key, or clicking outside the image.
- **Thumbnails** use a 4:3 aspect ratio with `object-fit: contain` so composite front/back views display fully.
- Design metadata (names, pricing) is in `src/data/designs.json`.

## MCP Servers (Cursor)

This project is set up to use these MCP servers for development:

- **org-controller** – Org workflows, planning, policies
- **Astro Docs** – Search official Astro docs (`search_astro_docs`)

Ensure these are enabled in Cursor settings (global `mcp.json` or project `.cursor/mcp.json`).

## Project Structure

```
src/
├── pages/           # Astro pages
│   ├── index.astro  # Order form (design picker, zoom modal, checkout)
│   ├── success.astro
│   ├── admin.astro
│   └── api/         # API routes (checkout, webhooks, admin)
├── layouts/         # BaseLayout.astro
├── lib/             # Stripe, email, DB, pricing
├── data/            # designs.json (design names, pricing)
├── images/          # Shirt design images (shirt-1.jpg … shirt-6.png)
└── styles/          # Global styles
```

## License

Proprietary – Ascension Convention 2026.
