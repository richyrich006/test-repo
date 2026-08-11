# Boycott PE Brands

An activist website that helps people find out which brands are owned by private
equity firms — and what to buy instead.

## What's here

| Page | Path | Purpose |
| --- | --- | --- |
| Home | `/` | Pitch, stats, category and firm entry points |
| Brand directory | `/brands` | Live search + category filters over the whole database |
| Category | `/categories/[id]` | Every PE-owned brand in one shopping category |
| Firms index | `/firms` | All profiled PE firms, ranked by brands owned |
| Firm profile | `/firms/[slug]` | Who the firm is and everything it owns |
| Why It Matters | `/why-private-equity` | The LBO playbook and the research on its effects |
| Case Studies | `/case-studies` | Toys R Us, Red Lobster, Steward Health, Joann, and more |
| Take Action | `/take-action` | Practical boycott tactics plus policy pressure points |
| Submit | `/submit` | Pre-fills a GitHub issue with a new brand or a correction |

## The data

Everything lives in a single file: **`data/brands.ts`**. It exports three arrays
— `categories`, `firms`, and `brands` — plus small lookup helpers. Adding a
brand is one object:

```ts
{
  name: 'Jersey Mike\'s',
  category: 'restaurants',      // must match a category id
  firm: 'blackstone',           // must match a firm slug
  since: '2025',
  note: 'Blackstone acquired majority control in a ~$8B deal.',
  alternatives: ['Local independent sub shops'],
}
```

New pages are generated automatically — categories and firm profiles are built
from these arrays via `generateStaticParams`.

### Accuracy policy

Private equity ownership changes constantly. Entries reflect widely reported
ownership as of early 2026 and carry a site-wide disclaimer. **Only add a brand
when public reporting supports it** — a news article, SEC filing, or company
press release. Wrongly labeling a business as PE-owned harms real people and
undermines the whole project. Corrections are as welcome as additions.

Update `LAST_VERIFIED` in `data/brands.ts` when you do a review pass.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export into ./out
```

Built with Next.js 15 (App Router) and TypeScript. `next.config.mjs` sets
`output: 'export'`, so `npm run build` produces a fully static site in `out/`
that can be hosted on GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any
static host. No server or database required.

### Deploying to GitHub Pages

Push `out/` to a `gh-pages` branch, or add a workflow that runs `npm run build`
and uploads `out/` as the Pages artifact. If you host under a repository
subpath rather than a custom domain, set `basePath` in `next.config.mjs` to
match.

## Disclaimer

This site is an expression of opinion and consumer activism. Nothing here is
investment, legal, or purchasing advice. Criticism is directed at ownership
structures, not at the employees and franchisees who work at these businesses.
