import Link from 'next/link';
import { Brand, categoryById, firmBySlug } from '@/data/brands';

export default function BrandCard({ brand, showCategory = true }: { brand: Brand; showCategory?: boolean }) {
  const firm = firmBySlug(brand.firm);
  const cat = categoryById(brand.category);
  return (
    <div className="brand-card">
      <h3>{brand.name}</h3>
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
    </div>
  );
}
