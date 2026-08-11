import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PageHero } from '@/components/SiteChrome';
import BrandCard from '@/components/BrandCard';
import { brandsByFirm, firmBySlug, firms } from '@/data/brands';

export function generateStaticParams() {
  return firms.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const firm = firmBySlug(slug);
  return {
    title: firm ? firm.name : 'Firm',
    description: firm?.description,
  };
}

export default async function FirmPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const firm = firmBySlug(slug);
  if (!firm) notFound();
  const list = brandsByFirm(firm.slug).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <PageHero
        title={firm.name}
        intro={firm.description}
        crumb={{ href: '/firms/', label: 'All firms' }}
      />
      <section className="section">
        <div className="container">
          <h2 className="section-title">Brands to avoid</h2>
          <p className="section-sub">
            {list.length} brand{list.length === 1 ? '' : 's'} in our directory owned or
            controlled by {firm.name}.
          </p>
          <div className="grid">
            {list.map((b) => (
              <BrandCard key={b.name} brand={b} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
