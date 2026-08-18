import Link from 'next/link';
import { Brand, brandSlug, categoryById, firmBySlug } from '@/data/brands';

export default function BrandCard({ brand, showCategory = true }: { brand: Brand; showCategory?: boolean }) {
  const firm = firmBySlug(brand.firm);
  const cat = categoryById(brand.category);
  const cited = brand.sources && brand.sources.length > 0;

  return (
    <div className="brand-card">
      <h3>
        <Link href={`/brands/${brandSlug(brand.name)}/`} className="brand-link">
          {brand.name}
        </Link>
      </h3>
      <div className="brand-meta">
        Owned by <Link href={`/firms/${brand.firm}/`}>{firm?.name ?? brand.firm}</Link>
        {brand.since ? ` since ${brand.since}` : ''}
        {showCategory && cat ? (
          <>
            {' · '}
            <Link href={`/categories/${cat.id}/`}>
              {cat.emoji} {cat.name}
            </Link>
          </>
        ) : null}
      </div>

      {brand.note && <p className="brand-note">{brand.note}</p>}

      {brand.change ? (
        <div className="changed">
          <b>What changed</b>
          {brand.change}
        </div>
      ) : (
        <div className="changed changed-empty">
          <b>What changed</b>
          No documented change on file yet.{' '}
          <Link href="/submit/">Know of one? Send a source →</Link>
        </div>
      )}

      {cited ? (
        <p className="sources">
          <span className="sources-label">Sources</span>
          {brand.sources!.map((s, i) => (
            <span key={s.url}>
              {i > 0 && ' · '}
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </span>
          ))}
        </p>
      ) : brand.change ? (
        <p className="sources sources-missing">
          Not yet cited — <Link href="/submit/">send a source</Link>
        </p>
      ) : null}
    </div>
  );
}
