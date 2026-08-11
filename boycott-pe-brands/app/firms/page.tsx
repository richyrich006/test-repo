import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components/SiteChrome';
import { brandsByFirm, firms } from '@/data/brands';

export const metadata: Metadata = {
  title: 'Private Equity Firms',
  description: 'Profiles of the private equity firms that own household-name brands.',
};

export default function FirmsPage() {
  const sorted = [...firms].sort(
    (a, b) => brandsByFirm(b.slug).length - brandsByFirm(a.slug).length
  );
  return (
    <>
      <PageHero
        title="The Firms"
        intro="A short list of buyout firms controls a startling share of what Americans eat, wear, and pay for. Here's who they are and what they own."
      />
      <section className="section">
        <div className="container">
          <div className="grid">
            {sorted.map((f) => {
              const count = brandsByFirm(f.slug).length;
              return (
                <Link key={f.slug} href={`/firms/${f.slug}/`} className="card">
                  <span className="tag">
                    {count} brand{count === 1 ? '' : 's'}
                  </span>
                  <h3>{f.name}</h3>
                  <p>{f.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
