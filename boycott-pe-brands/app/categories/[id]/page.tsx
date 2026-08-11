import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PageHero } from '@/components/SiteChrome';
import BrandCard from '@/components/BrandCard';
import { brandsByCategory, categories, categoryById } from '@/data/brands';

export function generateStaticParams() {
  return categories.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const cat = categoryById(id);
  return {
    title: cat ? cat.name : 'Category',
    description: cat?.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cat = categoryById(id);
  if (!cat) notFound();
  const list = brandsByCategory(cat.id).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <PageHero
        title={`${cat.emoji} ${cat.name}`}
        intro={cat.description}
        crumb={{ href: '/brands/', label: 'All brands' }}
      />
      <section className="section">
        <div className="container">
          <p className="result-count">{list.length} PE-owned brands in this category</p>
          <div className="grid">
            {list.map((b) => (
              <BrandCard key={b.name} brand={b} showCategory={false} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
