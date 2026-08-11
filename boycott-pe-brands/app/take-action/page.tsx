import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components/SiteChrome';

export const metadata: Metadata = {
  title: 'Take Action',
  description:
    'Practical ways to shift your spending away from private equity and push for policy change.',
};

export default function TakeActionPage() {
  return (
    <>
      <PageHero
        title="Take action"
        intro="Boycotting works best when it's sustainable, specific, and paired with pressure that goes beyond shopping. Here's how to make it stick."
      />
      <section className="section">
        <div className="container prose">
          <h2>1. Shift your spending</h2>
          <p>
            You will not purge private equity from your life entirely, and trying to
            do it in one week is the fastest route to giving up. Pick the changes
            that are easy to keep.
          </p>
          <ul>
            <li>
              <b>Start with your top five.</b> Look at last month&apos;s card
              statement, find your five most frequent merchants, and check them in
              the <Link href="/brands/">directory</Link>. Replacing two habitual
              purchases beats a perfect one-off boycott.
            </li>
            <li>
              <b>Ask who owns it.</b> Vet clinics, dental offices, urgent care and
              daycares almost always keep their original local name after being
              acquired. &quot;Is this practice independently owned?&quot; is a fair, normal
              question to ask at the front desk.
            </li>
            <li>
              <b>Prefer these ownership structures.</b> Employee-owned (ESOP)
              companies, co-ops, B Corps, family-owned businesses, nonprofits, and
              actual local independents. Recognizable employee-owned names include
              Publix, WinCo Foods, King Arthur Baking, Bob&apos;s Red Mill and
              Recreational Equipment (REI is a consumer co-op).
            </li>
            <li>
              <b>Buy less, buy repairable.</b> The cheapest way to stop funding an
              extractive supply chain is not to replace things that still work.
              Secondhand, repair shops, and buy-it-once goods all route money away
              from consolidated retail.
            </li>
            <li>
              <b>Move the recurring stuff.</b> Subscriptions, gym memberships,
              insurance and pharmacy are where switching once saves you money every
              month afterward.
            </li>
          </ul>

          <div className="callout callout-green">
            <b>Keep it about the money, not the people.</b> The workers at a
            PE-owned chain didn&apos;t choose their owners, and they take the hit when
            traffic drops. Be kind to staff, tip normally, and direct criticism at
            the ownership structure. Never harass employees or franchisees — it&apos;s
            wrong, and it discredits the argument.
          </div>

          <h2>2. Tell people what you found</h2>
          <ul>
            <li>
              Share a specific brand page rather than a general complaint — &quot;did
              you know who owns this?&quot; travels much further than &quot;private equity is
              bad.&quot;
            </li>
            <li>
              Bring receipts. The <Link href="/case-studies/">case studies</Link>{' '}
              page exists so you can point at Toys R Us or Red Lobster instead of
              arguing in the abstract.
            </li>
            <li>
              Correct yourself publicly if a brand turns out to have been sold. Being
              the accurate person in the conversation is what makes you persuasive.
            </li>
          </ul>

          <h2>3. Push where the leverage actually is</h2>
          <p>
            Consumer boycotts alone rarely change a buyout firm&apos;s behavior — their
            money comes from institutional investors, not shoppers. The structural
            fixes are political and financial:
          </p>
          <ul>
            <li>
              <b>Contact your representatives</b> about closing the carried-interest
              loophole (which taxes PE managers&apos; profits at capital-gains rates),
              limiting dividend recapitalizations, restricting hospital
              sale-leasebacks, and requiring ownership disclosure in healthcare. Find
              your US representatives at{' '}
              <a href="https://www.house.gov/representatives/find-your-representative" target="_blank" rel="noopener noreferrer">
                house.gov
              </a>{' '}
              and{' '}
              <a href="https://www.senate.gov/senators/senators-contact.htm" target="_blank" rel="noopener noreferrer">
                senate.gov
              </a>
              . State legislatures and AGs are often faster — several states have
              passed healthcare-transaction review laws.
            </li>
            <li>
              <b>Look at your own pension.</b> If you belong to a public pension
              system, a union, or a university endowment, its PE allocations are
              often disclosed. Members asking questions at board meetings is one of
              the few pressure points PE firms genuinely respond to.
            </li>
            <li>
              <b>Support the reporting.</b> Groups doing the tracking include the
              Private Equity Stakeholder Project, Americans for Financial Reform, and
              the American Economic Liberties Project. Local investigative newsrooms
              break most of these stories first.
            </li>
          </ul>

          <h2>4. Help keep this list accurate</h2>
          <p>
            Ownership data goes stale fast. If you spot a brand that was sold,
            acquired, or listed incorrectly, tell us — corrections matter as much as
            additions.
          </p>
          <p>
            <Link href="/submit/" className="btn btn-primary">
              Submit or correct a brand →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
