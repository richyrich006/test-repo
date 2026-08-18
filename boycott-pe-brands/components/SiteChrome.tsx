import Link from 'next/link';
import { LAST_VERIFIED } from '@/data/brands';

export function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="logo">
          Boycott <span>PE</span> Brands
        </Link>
        <nav className="nav">
          <Link href="/brands/">Brand Directory</Link>
          <Link href="/firms/">PE Firms</Link>
          <Link href="/why-private-equity/">Why It Matters</Link>
          <Link href="/warning-signs/">Warning Signs</Link>
          <Link href="/case-studies/">Case Studies</Link>
          <Link href="/take-action/">Take Action</Link>
          <Link href="/submit/">Submit</Link>
          <Link href="/contact/">Contact</Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          <b>Boycott PE Brands</b> — vote with your wallet. Buy independent, local,
          employee-owned and cooperative instead.
        </p>
        <p style={{ marginTop: '0.6rem' }}>
          <Link href="/brands/">Directory</Link> ·{' '}
          <Link href="/why-private-equity/">Why it matters</Link> ·{' '}
          <Link href="/warning-signs/">Warning signs</Link> ·{' '}
          <Link href="/case-studies/">Case studies</Link> ·{' '}
          <Link href="/take-action/">Take action</Link> ·{' '}
          <Link href="/submit/">Submit a brand</Link> ·{' '}
          <Link href="/contact/">Contact</Link>
        </p>
        <p className="disclaimer">
          Disclaimer: This site is an expression of opinion and consumer activism.
          Ownership information is compiled from public reporting and reflects
          widely reported ownership as of {LAST_VERIFIED}. Private-equity holdings
          change frequently through acquisitions, exits, IPOs and bankruptcies —
          verify current ownership before relying on any entry. Nothing here is
          investment, legal, or purchasing advice. Corrections are welcome via the
          Submit page.
        </p>
      </div>
    </footer>
  );
}

export function PageHero({
  title,
  intro,
  crumb,
}: {
  title: string;
  intro?: string;
  crumb?: { href: string; label: string };
}) {
  return (
    <div className="page-hero">
      <div className="container">
        {crumb && (
          <div className="breadcrumb">
            <Link href={crumb.href}>← {crumb.label}</Link>
          </div>
        )}
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
    </div>
  );
}
