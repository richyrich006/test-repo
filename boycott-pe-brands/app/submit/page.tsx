import type { Metadata } from 'next';
import { PageHero } from '@/components/SiteChrome';
import SubmitForm from '@/components/SubmitForm';

export const metadata: Metadata = {
  title: 'Submit a Brand',
  description: 'Suggest a PE-owned brand to add, or correct an entry that is out of date.',
};

export default function SubmitPage() {
  return (
    <>
      <PageHero
        title="Submit or correct a brand"
        intro="This directory is only as good as its sources. Add a brand we've missed, or flag one that's been sold, spun off, or listed wrong."
      />
      <section className="section">
        <div className="container prose">
          <div className="callout">
            <b>Sources are required.</b> We only publish ownership claims that link
            to public reporting — a news article, an SEC filing, or a company press
            release. Naming a business as PE-owned when it isn&apos;t causes real harm
            to real people, so unverified submissions are not added.
          </div>

          <SubmitForm />

          <h2>Other ways to reach us</h2>
          <p>
            You can also open an issue or a pull request directly against the
            repository — the full brand database lives in one file
            (<code>data/brands.ts</code>) and is straightforward to edit.
          </p>
          <p>
            <a href="https://github.com/richyrich006/test-repo/issues" target="_blank" rel="noopener noreferrer">
              github.com/richyrich006/test-repo/issues
            </a>
          </p>

          <h2>What makes a good submission</h2>
          <ul>
            <li>The brand as customers know it, not just the holding-company name.</li>
            <li>The specific PE firm, and the year it took control if you know it.</li>
            <li>A link to reporting that states the ownership.</li>
            <li>
              At least one realistic alternative. &quot;Shop local&quot; is fine, but a
              named alternative is far more useful.
            </li>
            <li>
              For corrections: what the entry says now, what it should say, and the
              source for the change.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
