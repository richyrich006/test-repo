import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components/SiteChrome';

export const metadata: Metadata = {
  title: 'Warning Signs',
  description:
    'How to recognize a private-equity buyout from the customer side: the specific changes that show up after an acquisition, and the documented cases behind each one.',
};

interface Sign {
  notice: string;
  why: string;
  evidence: string;
}

const signs: Sign[] = [
  {
    notice: 'The portion got smaller and the price went up — at the same time.',
    why: 'Cost engineering. Shrinking a portion is invisible on a menu board in a way that a price increase is not, so margin gets taken from both ends at once.',
    evidence:
      'Panera. Its CEO publicly admitted that portions had been shrunk while prices rose, describing customers buying a sandwich that cost significantly more, in a smaller size, with lower-quality ingredients. The company announced a turnaround in late 2025 explicitly to reverse the cuts after sales sank.',
  },
  {
    notice: 'Food that used to be made fresh on-site now arrives frozen.',
    why: 'Prepping from frozen needs fewer hours and less skill, which cuts the single largest controllable cost in a restaurant: labor.',
    evidence:
      'Panera moved from daily deliveries of fresh-baked bread, bagels and pastries to par-baked frozen dough finished in-store.',
  },
  {
    notice: 'A quality promise the brand used to advertise quietly disappears.',
    why: 'Ingredient standards are expensive. Removing the promise is cheaper than keeping it, and rarely announced.',
    evidence:
      'Panera removed its long-advertised "No No List" signage, and ingredients it had previously pledged to exclude returned to the menu.',
  },
  {
    notice: 'The same number of customers, visibly fewer staff.',
    why: 'Payroll is the fastest lever to pull when debt service has to be met every month regardless of sales.',
    evidence:
      'Documented across sectors. In nursing homes, NBER research found staffing fell after PE acquisition and mortality rose roughly 10–11% — the same lever, with far higher stakes than a slow checkout line.',
  },
  {
    notice: 'The company suddenly rents the building it used to own.',
    why: 'A sale-leaseback converts real estate into an immediate cash payout for the owners and a permanent rent obligation for the business.',
    evidence:
      'Red Lobster: Golden Gate bought it for $2.1B and sold the real estate for about $1.5B almost immediately. Steward Health Care did the same with hospitals, and the system later collapsed.',
  },
  {
    notice: 'Maintenance requests stop getting answered.',
    why: 'Deferred maintenance is invisible on a balance sheet in the short term, which is exactly as long as a fund intends to hold the asset.',
    evidence:
      'Tenants of Pretium-owned HavenBrook Homes reported going winters without heat, plus sewage backups and mold. The Minnesota attorney general sued over habitability.',
  },
  {
    notice: 'New fees appear for things that used to be included.',
    why: 'Fee income is high-margin and often escapes the headline price a customer compares when shopping.',
    evidence:
      'Institutional single-family landlords have been repeatedly documented stacking fees onto rent. In prison telecom, PE-owned Securus and ViaPath built entire businesses on per-minute charges to incarcerated people and their families.',
  },
  {
    notice: 'Your local business kept its name, sign and staff — but something changed.',
    why: 'Roll-ups deliberately keep local branding. The acquisition is invisible by design, so customers never connect rising prices to a change of owner.',
    evidence:
      'Veterinary medicine is the clearest case: corporate and PE ownership went from roughly 8% of US clinics in 2011 to about half by 2025, and acquired clinics commonly raise prices within 12–24 months. The same pattern is now running through HVAC, plumbing, dental and dermatology.',
  },
  {
    notice: 'The company takes on new debt and the owners get a payout.',
    why: 'A dividend recapitalization pays the owners with borrowed money. They get paid whether or not the business survives the loan.',
    evidence:
      'Payless: creditors alleged in court that roughly $700M in dividends funded by debt caused the bankruptcy. Instant Brands did a dividend recap in 2021 and filed for Chapter 11 in 2023.',
  },
  {
    notice: 'Software you depend on gets more expensive and less supported.',
    why: 'Enterprise software customers are slow and costly to migrate, which makes them ideal for price increases after a buyout.',
    evidence:
      'Citrix, taken private by Vista and Elliott and merged into Cloud Software Group under roughly $15–16B of debt, followed by mass layoffs and sharp licensing price increases.',
  },
];

export default function WarningSignsPage() {
  return (
    <>
      <PageHero
        title="Warning signs"
        intro="You usually find out a company was bought by private equity years after it happened — by noticing the symptoms. Here's how to read them, and the documented case behind each one."
      />
      <section className="section">
        <div className="container prose">
          <p>
            The most common way people encounter this is not a news story. It&apos;s
            a worker saying &quot;we were told to use less,&quot; or a customer noticing
            the sandwich shrank. Those observations are usually right, and they
            usually arrive long before the ownership change is common knowledge.
          </p>
          <p>
            Every sign below pairs the thing you&apos;d actually notice with the
            financial reason behind it and a case where it&apos;s documented on the
            record. None of these is proof on its own — plenty of companies cut
            costs without a buyout. Two or three together, in a business that
            recently changed hands, is a pattern.
          </p>

          {signs.map((s, i) => (
            <article key={i} className="case">
              <h3>{s.notice}</h3>
              <div className="case-sub">Why it happens</div>
              <p>{s.why}</p>
              <div className="case-sub">On the record</div>
              <p>{s.evidence}</p>
            </article>
          ))}

          <div className="callout">
            <b>A note on where these come from.</b> Workers and customers
            describing changes in forums, reviews and social posts are often the
            earliest signal, and this page was prompted by exactly that kind of
            report. But individual posts can&apos;t be verified, and people&apos;s jobs
            can be at risk when they speak. So nothing here rests on an anonymous
            account: every example above is tied to on-the-record reporting,
            company statements, court filings or peer-reviewed research.
          </div>

          <div className="callout callout-green">
            <b>If you work at one of these companies</b> and recognize this
            pattern, the most useful thing you can do is not an anonymous post —
            it&apos;s telling a local reporter, a union, or a regulator, who can
            verify it and give it weight. Be careful: many employers restrict
            what staff may say publicly.
          </div>

          <p style={{ marginTop: '2rem' }}>
            <Link href="/brands/" className="btn btn-primary">
              Check who owns a brand →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
