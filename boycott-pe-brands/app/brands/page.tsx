import type { Metadata } from 'next';
import { PageHero } from '@/components/SiteChrome';
import Directory from '@/components/Directory';

export const metadata: Metadata = {
  title: 'Brand Directory',
  description: 'Search brands owned by private equity firms and find independent alternatives.',
};

export default function BrandsPage() {
  return (
    <>
      <PageHero
        title="Brand Directory"
        intro="Search any brand to see whether a private equity firm owns it — and what to buy instead. Filter by the categories you shop most."
      />
      <section className="section">
        <div className="container">
          <Directory />
        </div>
      </section>
    </>
  );
}
