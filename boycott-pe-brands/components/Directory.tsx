'use client';

import { useMemo, useState } from 'react';
import { brands, categories, firmBySlug } from '@/data/brands';
import BrandCard from './BrandCard';

export default function Directory() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return brands
      .filter((b) => (category ? b.category === category : true))
      .filter((b) => {
        if (!q) return true;
        const firm = firmBySlug(b.firm);
        return (
          b.name.toLowerCase().includes(q) ||
          (firm?.name.toLowerCase().includes(q) ?? false) ||
          (b.note?.toLowerCase().includes(q) ?? false)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [query, category]);

  return (
    <div>
      <input
        className="search-bar"
        type="search"
        placeholder="Search a brand or PE firm (e.g. Subway, Blackstone, Panera)…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search brands"
      />
      <div className="filters">
        <button
          className={`filter-chip ${category === null ? 'active' : ''}`}
          onClick={() => setCategory(null)}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={`filter-chip ${category === c.id ? 'active' : ''}`}
            onClick={() => setCategory(category === c.id ? null : c.id)}
          >
            {c.emoji} {c.name}
          </button>
        ))}
      </div>
      <p className="result-count">
        {results.length} brand{results.length === 1 ? '' : 's'} found
      </p>
      <div className="grid">
        {results.map((b) => (
          <BrandCard key={b.name} brand={b} />
        ))}
      </div>
      {results.length === 0 && (
        <p>
          No matches. Don’t see a PE-owned brand you know about?{' '}
          <a href="/submit/">Submit it</a>.
        </p>
      )}
    </div>
  );
}
