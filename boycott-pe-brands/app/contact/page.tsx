import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components/SiteChrome';
import Newsletter from '@/components/Newsletter';
import { CONTACT_EMAIL, REPO_URL } from '@/site.config';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Corrections, submissions, press enquiries and how to reach the people behind the directory.',
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact"
        intro="Corrections are the most valuable thing you can send. Here's how to reach us, and what to include."
      />
      <section className="section">
        <div className="container prose">
          <h2>Corrections and additions</h2>
          <p>
            The fastest route is the <Link href="/submit/">submission form</Link>,
            which opens a pre-filled issue with the fields we need. If a brand has
            been sold, spun off, taken public or listed wrong, say so — an entry
            that is out of date does more damage than a missing one, because it
            hands critics a reason to dismiss the rest.
          </p>
          <p>
            Include a source. We only publish ownership claims and post-buyout
            changes that link to public reporting, a regulator or court document,
            a company statement, or research.
          </p>

          <h2>If a company wants to dispute an entry</h2>
          <p>
            Send the specific claim you believe is wrong and the evidence that
            contradicts it, and we will correct it publicly. This site describes
            ownership and documented consequences; where a company disputes a
            characterization we are willing to say so in the entry itself. What we
            will not do is remove a sourced, accurate claim because it is
            unflattering.
          </p>

          <h2>Press and researchers</h2>
          <p>
            The full dataset lives in a single file,{' '}
            <a href={`${REPO_URL}/blob/main/boycott-pe-brands/data/brands.ts`} target="_blank" rel="noopener noreferrer">
              <code>data/brands.ts</code>
            </a>
            , with citations attached to individual entries. It is free to reuse.
            If you are writing about a specific buyout we are glad to point you at
            the underlying sources.
          </p>

          <h2>Ways to reach us</h2>
          <ul>
            <li>
              <b>Submissions and corrections:</b>{' '}
              <Link href="/submit/">the submission form</Link>
            </li>
            <li>
              <b>Anything else:</b>{' '}
              <a href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer">
                open an issue on GitHub
              </a>
            </li>
            {CONTACT_EMAIL ? (
              <li>
                <b>Email:</b> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
            ) : null}
          </ul>

          {!CONTACT_EMAIL && (
            <div className="callout">
              <b>No public email address is set.</b> Add one in{' '}
              <code>site.config.ts</code> to show it here. Use a dedicated inbox
              rather than a personal address — this site names large companies by
              name, and the address will be scraped.
            </div>
          )}

          <h2>A note on workers</h2>
          <p>
            If you work at a company listed here, be careful what you send and from
            where. Many employers restrict what staff may say publicly, and we
            cannot offer you legal protection. A reporter, a union, or a regulator
            can do more with your account than we can — and can protect a source
            properly.
          </p>

          <div className="callout callout-green" style={{ marginTop: '2rem' }}>
            <Newsletter compact />
          </div>
        </div>
      </section>
    </>
  );
}
