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
      {brand.alternatives && brand.alternatives.length > 0 && (
        <div className="alts">
          <b>Buy instead</b>
          {brand.alternatives.join(' · ')}
        </div>
      )}
    </div>
  );
}
