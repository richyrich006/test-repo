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
  change: 'What measurably changed after the buyout.',  // optional
}
```

### The `change` field

`change` is the heart of the directory: what actually got worse, specifically,
after the buyout — prices, portions, staffing, ingredients, fees, closures,
lawsuits, regulatory findings.

**Only fill it in when the claim is tied to reporting, a company statement, a
court filing, or peer-reviewed research.** Roughly a quarter of entries have
one; the rest render a muted "no documented change on file yet" prompt that
invites a sourced submission. That gap is deliberate. Asserting that a real
business degraded its product, without evidence, is defamatory in tone even
when it's a fair guess — and a single fabricated claim would discredit every
sourced one next to it. An empty slot costs nothing; a wrong claim costs the
whole project.

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

`.github/workflows/deploy-pages.yml` builds and deploys this site
automatically on every push that touches `boycott-pe-brands/`.

**One-time setup:** in the repository, go to **Settings → Pages → Build and
deployment → Source** and select **GitHub Actions**. Until that's done the
workflow will fail at the "configure-pages" step. Once enabled, the site is
served at `https://<user>.github.io/test-repo/`.

Because Pages serves the repo under the `/test-repo/` subpath, the workflow
builds with `PAGES_BASE_PATH=/test-repo`, which `next.config.mjs` turns into
Next's `basePath`. Local builds leave it empty, so `npm run dev` still works at
the root. If you move to a custom domain, drop that env var from the workflow.

Use `Link` from `next/link` for internal navigation rather than raw `<a href>`
— `basePath` is applied to `Link` automatically, and a hand-written `href` will
break under the subpath.

## Disclaimer

This site is an expression of opinion and consumer activism. Nothing here is
investment, legal, or purchasing advice. Criticism is directed at ownership
structures, not at the employees and franchisees who work at these businesses.
