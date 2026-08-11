#!/usr/bin/env node
/**
 * Verify every citation URL in data/brands.ts still resolves.
 *
 * Source links are the site's credibility. They rot: outlets restructure,
 * press releases move, regulators archive. Run this periodically.
 *
 *   npm run check:sources
 *
 * Exits non-zero if any link is dead, so it can gate CI.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = await readFile(join(root, 'data/brands.ts'), 'utf8');

// Pair each URL with the brand entry it belongs to, so failures are actionable.
const entries = [];
for (const line of src.split('\n')) {
  const nameMatch = line.match(/\{ name: (?:'([^']*)'|"([^"]*)")/);
  if (!nameMatch) continue;
  const brand = nameMatch[1] ?? nameMatch[2];
  for (const m of line.matchAll(/\{ label: '((?:[^'\\]|\\.)*)', url: '([^']+)' \}/g)) {
    entries.push({ brand, label: m[1].replace(/\\'/g, "'"), url: m[2] });
  }
}

if (entries.length === 0) {
  console.error('No source URLs found — has the data format changed?');
  process.exit(1);
}

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

async function probe(url) {
  // Some publishers reject HEAD outright, so fall back to a ranged GET.
  for (const init of [
    { method: 'HEAD' },
    { method: 'GET', headers: { Range: 'bytes=0-2048' } },
  ]) {
    try {
      const res = await fetch(url, {
        ...init,
        redirect: 'follow',
        headers: { 'User-Agent': UA, ...(init.headers ?? {}) },
        signal: AbortSignal.timeout(25_000),
      });
      if (res.ok || res.status === 206) return { ok: true, status: res.status };
      // 403/405 usually means bot-blocking, not a dead page — flag, don't fail.
      if (res.status === 403 || res.status === 405 || res.status === 429) {
        return { ok: true, status: res.status, soft: true };
      }
      if (init.method === 'GET') return { ok: false, status: res.status };
    } catch (err) {
      if (init.method === 'GET') return { ok: false, status: err.name || 'network error' };
    }
  }
  return { ok: false, status: 'unknown' };
}

const results = [];
const CONCURRENCY = 6;
let cursor = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < entries.length) {
      const entry = entries[cursor++];
      results.push({ ...entry, ...(await probe(entry.url)) });
    }
  })
);

const dead = results.filter((r) => !r.ok);
const soft = results.filter((r) => r.soft);

for (const r of soft) {
  console.warn(`?  ${r.status}  ${r.brand} — ${r.label}\n   ${r.url}`);
}
for (const r of dead) {
  console.error(`✗  ${r.status}  ${r.brand} — ${r.label}\n   ${r.url}`);
}

console.log(
  `\n${results.length} links checked · ${results.length - dead.length} ok` +
    (soft.length ? ` (${soft.length} bot-blocked, verify by hand)` : '') +
    (dead.length ? ` · ${dead.length} BROKEN` : '')
);

process.exit(dead.length ? 1 : 0);
