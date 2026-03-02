# Ascension Convention 2026 – Shirt Order Form

Static Astro 5 order form for Ascension Convention 2026 shirts. Uses Netlify Forms for submission capture, with a design picker and zoomable shirt images.

## Stack

- **Astro 5** (static)
- **Netlify Forms** – Form detection and submissions
- **pnpm** – Package manager

## Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm` or `corepack enable && corepack prepare pnpm@latest --activate`)

## Quick Start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build locally |

## Netlify Forms

1. Enable **Form detection** in Netlify: Forms → Form detection → Enable
2. Deploy the site. Netlify will scan the build output and register the `shirt-order` form
3. Submissions appear in Netlify UI: Forms → shirt-order
4. On submit, users are redirected to `/success/`
5. Optionally set up email notifications or form-triggered functions

## Order Form & Designs

The form (`/`) lets customers choose from six shirt designs:

| Design | Name |
|--------|------|
| 1 | White with pink lettering |
| 2 | White with gold lettering |
| 3 | Black with pink lettering |
| 4 | Black with gold lettering |
| 5 | Black weathered with pink lettering |
| 6 | Black weathered with gold lettering |

### Pricing

- **White & black shirts** (designs 1–4): **$20** base
- **Weathered shirts** (designs 5–6): **$30** base
- **2XL and 3XL** add **$2.00** (3XL not available for weathered designs)

### Sizes

- Sizes: XS, S, M, L, XL, 2XL, 3XL
- **3XL is hidden** when a weathered design (5 or 6) is selected; only designs 1–4 offer 3XL

- **Design images** live in `src/images/` (shirt-1.jpg through shirt-6.png)
- **Image zoom modal**: Click any design thumbnail to view larger
- Design metadata is in `src/data/designs.json`

## Project Structure

```
src/
├── pages/
│   ├── index.astro   # Order form (Netlify form)
│   └── success.astro # Thank-you page
├── layouts/
├── data/
└── images/
```

## License

Proprietary – Ascension Convention 2026.
