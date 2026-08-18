import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PageHero } from '@/components/SiteChrome';
import BrandCard from '@/components/BrandCard';
import {
  brandBySlug,
  brandSlug,
  brands,
  brandsByCategory,
  brandsByFirm,
  categoryById,
  firmBySlug,
} from '@/data/brands';

export function generateStaticParams() {
  return brands.map((b) => ({ slug: brandSlug(b.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = brandBySlug(slug);
  if (!brand) return { title: 'Brand' };
  const firm = firmBySlug(brand.firm);
  return {
    title: brand.name,
    description: `${brand.name} is owned by ${firm?.name ?? 'a private equity firm'}${
      brand.since ? ` (since ${brand.since})` : ''
    }. ${brand.change ?? ''}`.trim(),
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = brandBySlug(slug);
  if (!brand) notFound();

  const firm = firmBySlug(brand.firm);
  const cat = categoryById(brand.category);

  const siblings = brandsByFirm(brand.firm)
    .filter((b) => b.name !== brand.name)
    .sort((a, b) => a.name.localeCompare(b.name));
  const sameCategory = brandsByCategory(brand.category)
    .filter((b) => b.name !== brand.name && b.firm !== brand.firm)
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 6);

  return (
    <>
      <PageHero
        title={brand.name}
        intro={`Owned by ${firm?.name ?? brand.firm}${brand.since ? ` since ${brand.since}` : ''}.`}
        crumb={{ href: '/brands/', label: 'All brands' }}
      />

      <section className="section">
        <div className="container">
          <div className="detail">
            <div>
              <dl className="factbox">
                <div>
                  <dt>Owner</dt>
                  <dd>
                    <Link href={`/firms/${brand.firm}/`}>{firm?.name ?? brand.firm}</Link>
                  </dd>
                </div>
                {brand.since && (
                  <div>
                    <dt>Owned since</dt>
                    <dd>{brand.since}</dd>
                  </div>
                )}
                {cat && (
                  <div>
                    <dt>Category</dt>
                    <dd>
                      <Link href={`/categories/${cat.id}/`}>
                        {cat.emoji} {cat.name}
                      </Link>
                    </dd>
                  </div>
                )}
                <div>
                  <dt>Sourcing</dt>
                  <dd>
                    {brand.sources?.length
                      ? `${brand.sources.length} citation${brand.sources.length === 1 ? '' : 's'}`
                      : 'Not yet cited'}
                  </dd>
                </div>
              </dl>

              {brand.note && (
                <>
                  <h2 className="detail-h">The ownership</h2>
                  <p>{brand.note}</p>
                </>
              )}

              <h2 className="detail-h">What changed</h2>
              {brand.change ? (
                <p>{brand.change}</p>
              ) : (
                <p className="muted">
                  We don&apos;t yet have a documented change for {brand.name} that meets the
                  evidence bar — reporting, a company statement, a court filing, or
                  research. Rather than guess, this space stays empty.{' '}
                  <Link href="/submit/">Send a source</Link> and we&apos;ll add it.
                </p>
              )}

              {brand.sources && brand.sources.length > 0 && (
                <>
                  <h2 className="detail-h">Sources</h2>
                  <ul className="source-list">
                    {brand.sources.map((s) => (
                      <li key={s.url}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer">
                          {s.label}
                        </a>
                        <span className="source-url">{new URL(s.url).hostname.replace(/^www\./, '')}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <aside className="detail-aside">
              {firm && (
                <div className="aside-box">
                  <h3>About {firm.name}</h3>
                  <p>{firm.description}</p>
                  <p>
                    <Link href={`/firms/${brand.firm}/`}>
                      See all {brandsByFirm(brand.firm).length} of its brands →
                    </Link>
                  </p>
                </div>
              )}
              <div className="aside-box">
                <h3>Check another brand</h3>
                <p>
                  <Link href="/brands/">Search the full directory →</Link>
                </p>
                <p>
                  <Link href="/warning-signs/">How to spot a buyout →</Link>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {siblings.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 className="section-title">Also owned by {firm?.name ?? brand.firm}</h2>
            <p className="section-sub">
              Same owner, same incentives — these are the other brands in our directory under{' '}
              {firm?.name ?? 'this firm'}.
            </p>
            <div className="grid">
              {siblings.slice(0, 9).map((b) => (
                <BrandCard key={b.name} brand={b} />
              ))}
            </div>
            {siblings.length > 9 && (
              <p style={{ marginTop: '1.2rem' }}>
                <Link href={`/firms/${brand.firm}/`}>See all {siblings.length + 1} →</Link>
              </p>
            )}
          </div>
        </section>
      )}

      {sameCategory.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 className="section-title">
              Other PE-owned {cat ? cat.name.toLowerCase() : 'brands'}
            </h2>
            <div className="grid">
              {sameCategory.map((b) => (
                <BrandCard key={b.name} brand={b} showCategory={false} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
