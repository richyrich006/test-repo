import Link from 'next/link';
import { brands, categories, firms } from '@/data/brands';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>
            Know who <em>really</em> owns the brands you buy
          </h1>
          <p>
            Private equity firms buy beloved companies, load them with debt, cut
            quality and staff, extract fees — and too often leave bankruptcy
            behind. Toys&nbsp;R&nbsp;Us. Red Lobster. Payless. Instant Pot. Joann.
            The pattern repeats because we keep paying for it. Stop paying for it.
          </p>
          <div className="hero-actions">
            <Link href="/brands/" className="btn btn-primary">
              Search the Brand Directory
            </Link>
            <Link href="/warning-signs/" className="btn btn-outline">
              How to Spot a Buyout
            </Link>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stat">
            <b>{brands.length}+</b>
            <span>brands tracked</span>
          </div>
          <div className="stat">
            <b>{firms.length}</b>
            <span>PE firms profiled</span>
          </div>
          <div className="stat">
            <b>~12M</b>
            <span>US workers at PE-owned companies</span>
          </div>
          <div className="stat">
            <b>10×</b>
            <span>higher bankruptcy rate after PE buyouts*</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="callout" style={{ marginTop: 0 }}>
            <b>Noticed your usual place got worse?</b> Smaller portions, frozen
            instead of fresh, fewer staff, new fees, repairs that never come —
            these are the documented after-effects of a buyout, and customers and
            workers usually spot them years before the ownership change is common
            knowledge. <Link href="/warning-signs/">Learn the warning signs →</Link>
          </div>
          <h2 className="section-title">Browse by category</h2>
          <p className="section-sub">
            Check the aisles you actually shop. Every category links to the brands
            to avoid — and what to buy instead.
          </p>
          <div className="grid">
            {categories.map((c) => (
              <Link key={c.id} href={`/categories/${c.id}/`} className="card">
                <span className="emoji">{c.emoji}</span>
                <h3>{c.name}</h3>
                <p>{c.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="section-title">The firms behind the brands</h2>
          <p className="section-sub">
            A handful of buyout firms quietly control hundreds of household names.
            Learn who they are and what they own.
          </p>
          <div className="grid">
            {firms.slice(0, 6).map((f) => (
              <Link key={f.slug} href={`/firms/${f.slug}/`} className="card">
                <h3>{f.name}</h3>
                <p>{f.description.slice(0, 140)}…</p>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: '1.2rem' }}>
            <Link href="/firms/">See all {firms.length} firms →</Link>
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="callout">
            * Research by Ayash &amp; Rastad (2021) found that companies bought in
            leveraged buyouts were roughly ten times more likely to go bankrupt
            within ten years than comparable public companies. Sources and more
            evidence on the{' '}
            <Link href="/why-private-equity/">Why It Matters</Link> page.
          </div>
        </div>
      </section>
    </>
  );
}
