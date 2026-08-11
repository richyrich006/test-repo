import Link from 'next/link';
import { PageHero } from '@/components/SiteChrome';

export default function NotFound() {
  return (
    <>
      <PageHero title="Page not found" intro="That page doesn't exist — but the directory does." />
      <section className="section">
        <div className="container prose">
          <p>
            <Link href="/brands/" className="btn btn-primary">
              Search the brand directory →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
