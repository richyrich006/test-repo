import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components/SiteChrome';

export const metadata: Metadata = {
  title: 'Why Private Equity Is a Problem',
  description:
    'How the leveraged buyout model raises prices, cuts quality, costs jobs, and drives companies into bankruptcy.',
};

export default function WhyPage() {
  return (
    <>
      <PageHero
        title="Why private equity is a problem"
        intro="Private equity isn't just 'investors.' It's a specific financial model — and the model has predictable consequences for workers, customers, and the products you buy."
      />
      <section className="section">
        <div className="container prose">
          <h2>The playbook, in plain English</h2>
          <p>
            A private equity firm raises a fund from pensions, endowments and
            wealthy investors. It uses that money as a down payment to buy a
            company — but most of the purchase price is borrowed. Crucially, the
            debt is placed on the <em>acquired company&apos;s</em> balance sheet, not
            the firm&apos;s. The company now has to service loans that were taken out
            to buy itself.
          </p>
          <p>Once in control, the standard moves are:</p>
          <ol>
            <li>
              <b>Cut costs to service the debt.</b> Staffing, hours, maintenance,
              ingredient quality, customer service — the things that don&apos;t show
              up on next quarter&apos;s balance sheet go first.
            </li>
            <li>
              <b>Sell the real estate.</b> In a &quot;sale-leaseback,&quot; the company&apos;s
              buildings are sold for a cash windfall that flows to the owners, and
              the company then rents back the space it used to own — converting an
              asset into a permanent expense.
            </li>
            <li>
              <b>Charge the company fees.</b> Management fees, monitoring fees,
              transaction fees, and consulting fees are billed by the PE firm to the
              business it owns.
            </li>
            <li>
              <b>Pay yourself a dividend with borrowed money.</b> A &quot;dividend
              recapitalization&quot; means the company takes on <em>new</em> debt purely
              to pay cash to its PE owners. The owners get paid whether or not the
              company survives.
            </li>
            <li>
              <b>Exit in 3–7 years</b> — sell it, list it, or let it fail. The fund
              has a clock, and that clock is much shorter than the life of a brand
              built over decades.
            </li>
          </ol>
          <blockquote>
            The core asymmetry: the firm&apos;s returns are largely locked in through
            fees, dividends and asset sales before the outcome is known. The
            company, its workers and its customers carry the downside.
          </blockquote>

          <h2>What the evidence shows</h2>

          <h3>Bankruptcies</h3>
          <p>
            Research by Brian Ayash and Mahdi Rastad, examining hundreds of
            leveraged buyouts, found companies taken private in an LBO were about{' '}
            <b>ten times more likely to go bankrupt</b> within ten years than
            comparable companies that weren&apos;t. The retail apocalypse of the 2010s
            was disproportionately a PE-debt apocalypse: Toys R Us, Payless, Sears
            (Lampert), Nine West, Claire&apos;s, Gymboree, RadioShack.
          </p>

          <h3>Jobs and wages</h3>
          <p>
            A large study by Steven Davis and co-authors, covering thousands of US
            buyouts, found employment at bought-out firms falls sharply relative to
            controls when the target was already a public company, with meaningful
            declines in worker earnings. Retail buyouts in particular have been
            linked to large net job losses.
          </p>

          <h3>Healthcare quality</h3>
          <p>
            This is the most alarming area. A 2021 NBER study of PE-owned nursing
            homes estimated that PE ownership caused roughly a{' '}
            <b>10% increase in short-term mortality</b> among Medicare patients,
            alongside lower staffing and higher billing. A 2023 <i>JAMA</i> study
            found hospital-acquired adverse events — falls, infections — increased
            after hospitals were acquired by private equity. Emergency staffing,
            dialysis, dental, autism services, hospice and air ambulance have all
            been consolidated by PE, and surprise-billing scandals traced back to
            PE-owned staffing firms drove federal legislation.
          </p>

          <h3>Prices and quality</h3>
          <p>
            Consolidation is the point: buy several competitors in a fragmented
            market, merge them, and gain pricing power. Veterinary care, dental
            care, dermatology, mobile-home parks, self-storage, car washes and
            single-family rentals have all seen PE roll-ups followed by price
            increases. On the shelf, cost engineering shows up as shrinkflation and
            reformulation — the same package, less product, cheaper ingredients.
          </p>

          <h3>Housing and rent</h3>
          <p>
            After the 2008 foreclosure crisis, PE firms bought tens of thousands of
            foreclosed single-family homes and became mass landlords. Studies and
            state attorneys general have documented above-market rent increases,
            aggressive fee-stacking and elevated eviction filing rates at
            institutional landlords.
          </p>

          <h2>&quot;Isn&apos;t some of this just normal investing?&quot;</h2>
          <p>
            Honest answer: yes, sometimes. Not every buyout ends badly. Some PE
            firms genuinely professionalize under-managed companies, fund growth, or
            rescue businesses that had no other buyer. Venture capital and growth
            equity fund things that need funding. Plenty of PE money belongs to
            public pension funds, which means teachers&apos; and firefighters&apos;
            retirements are partly invested in these returns.
          </p>
          <p>
            The critique here is narrower and sturdier: the{' '}
            <b>leveraged buyout structure</b> systematically separates who captures
            the gains from who bears the risk. When a firm can extract fees and
            debt-funded dividends before a company&apos;s fate is decided, bankruptcy
            stops being a failure for the owner. That&apos;s a structural problem, not a
            matter of individual villains — which is exactly why consumer pressure
            and policy reform, rather than outrage at any one firm, are the point.
          </p>

          <div className="callout">
            <b>Be accurate, it&apos;s more persuasive.</b> Ownership changes constantly,
            and a brand on this list today may be sold tomorrow. When you tell
            someone a brand is PE-owned, it&apos;s worth a quick check of recent news
            first. Overstating the case gives people a reason to dismiss the whole
            argument.
          </div>

          <h2>Sources &amp; further reading</h2>
          <ul>
            <li>Ayash &amp; Rastad, &quot;Leveraged Buyouts and Financial Distress&quot; (Finance Research Letters, 2021)</li>
            <li>Davis, Haltiwanger, Handley, Lipsius, Lerner &amp; Miranda, &quot;The Economic Effects of Private Equity Buyouts&quot; (NBER)</li>
            <li>Gupta, Howell, Yannelis &amp; Gupta, &quot;Does Private Equity Investment in Healthcare Benefit Patients?&quot; (NBER, 2021)</li>
            <li>Kannan, Bruch &amp; Song, &quot;Changes in Hospital Adverse Events… After Private Equity Acquisition&quot; (JAMA, 2023)</li>
            <li>Brendan Ballou, <i>Plunder: Private Equity&apos;s Plan to Pillage America</i></li>
            <li>Gretchen Morgenson &amp; Joshua Rosner, <i>These Are the Plunderers</i></li>
            <li>Americans for Financial Reform — Private Equity Stakeholder Project reporting</li>
          </ul>

          <p style={{ marginTop: '2rem' }}>
            <Link href="/case-studies/" className="btn btn-primary">
              See what happened to specific companies →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
