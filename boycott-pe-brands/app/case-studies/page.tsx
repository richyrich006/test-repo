import type { Metadata } from 'next';
import { PageHero } from '@/components/SiteChrome';

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    'What actually happened to Toys R Us, Red Lobster, Payless, Instant Pot, Steward Health Care and others after private equity took over.',
};

interface Study {
  name: string;
  sub: string;
  paras: string[];
}

const studies: Study[] = [
  {
    name: 'Toys R Us',
    sub: 'KKR, Bain Capital & Vornado · bought 2005 · liquidated 2018 · ~33,000 jobs lost',
    paras: [
      'A $6.6 billion leveraged buyout left the profitable toy retailer carrying roughly $5 billion in debt. Interest payments ran around $400 million a year — money that could not go into stores, e-commerce, or wages at exactly the moment Amazon was eating retail.',
      'The company was not failing when it was bought. It was starved of the capital it needed to compete, then blamed for failing to compete. When liquidation came in 2018, workers were initially told there would be no severance at all; a public campaign by former employees eventually won a $20 million hardship fund — a fraction of what the owners had collected in fees.',
    ],
  },
  {
    name: 'Red Lobster',
    sub: 'Golden Gate Capital · bought 2014 · bankrupt 2024',
    paras: [
      'Golden Gate bought Red Lobster for $2.1 billion — then immediately sold the chain\'s real estate for about $1.5 billion in a sale-leaseback, recouping most of the purchase price within days. Red Lobster went from owning its restaurants to renting them, permanently.',
      'Those rent obligations never went away. Headlines later blamed the 2024 bankruptcy on an "Endless Shrimp" promotion, which makes for a better story than a decade of lease payments on buildings the company used to own. The shrimp deal was a symptom; the balance sheet was the disease.',
    ],
  },
  {
    name: 'Payless ShoeSource',
    sub: 'Golden Gate Capital & Blum Capital · bought 2012 · two bankruptcies · ~16,000 jobs lost',
    paras: [
      'The owners took roughly $700 million in dividends out of Payless — funded by debt loaded onto the retailer. Creditors later alleged in court that these dividend recapitalizations directly caused the 2017 bankruptcy.',
      'Payless emerged, then filed again in 2019 and closed all North American stores. A chain that sold affordable shoes to working families was consumed to pay its owners.',
    ],
  },
  {
    name: 'Instant Pot / Pyrex / Corelle',
    sub: 'Cornell Capital · Instant Brands · bankrupt 2023',
    paras: [
      'The Instant Pot was a genuine consumer phenomenon — a well-made appliance people loved. Cornell Capital merged it with Corelle Brands in 2019, and in 2021 the combined company took on new debt to fund a dividend to its owners.',
      'When interest rates rose, the debt service became unmanageable and Instant Brands filed for Chapter 11 in 2023. A profitable, beloved product line was undone not by competition or bad design, but by the borrowing done in its name.',
    ],
  },
  {
    name: 'Steward Health Care',
    sub: 'Cerberus Capital Management · 2010–2020 · hospital system collapsed 2024',
    paras: [
      'Cerberus bought a Catholic hospital chain in Massachusetts, sold the hospitals\' real estate to a REIT for about $1.25 billion, and left the hospitals paying rent on their own buildings. Cerberus reportedly turned a roughly $250 million investment into around $800 million before exiting in 2020.',
      'What remained collapsed in 2024 in one of the largest hospital bankruptcies in US history. Hospitals closed in Massachusetts and other states. Reporting documented unpaid vendors, missing surgical supplies, and at least one patient death connected to equipment a supplier had repossessed over unpaid bills. This is the case that turned PE in healthcare into a congressional issue.',
    ],
  },
  {
    name: 'Joann Fabrics',
    sub: 'Leonard Green & Partners · bought 2011 · liquidated 2025 · ~19,000 jobs lost',
    paras: [
      'Taken private in a $1.6 billion leveraged buyout, Joann carried heavy debt for over a decade while its owners collected dividends and fees. A brief pandemic crafting boom was not enough to escape the balance sheet.',
      'After bankruptcy filings in 2024 and 2025, all stores were liquidated in 2025 — ending the largest fabric and craft retailer in the US and, for many quilters and sewists, the only in-person source of materials within driving distance.',
    ],
  },
  {
    name: 'Envision Healthcare',
    sub: 'KKR · bought 2018 · bankrupt 2023',
    paras: [
      'KKR bought the physician-staffing giant for $9.9 billion. Envision staffed emergency rooms — and became a poster child for surprise billing, where a patient goes to an in-network hospital and is treated by an out-of-network doctor employed by a staffing company.',
      'Envision and a rival PE-owned staffer funded a dark-money campaign against federal legislation to end the practice. The No Surprises Act passed anyway in 2020, and Envision filed for bankruptcy in 2023 with about $7 billion in debt.',
    ],
  },
  {
    name: 'Panera Bread',
    sub: 'JAB Holding · bought 2017 · still operating, mid-turnaround',
    paras: [
      'Panera is the clearest live example of the playbook applied to something people loved, because the company has admitted most of it. After JAB took it private in 2017, portions shrank while prices climbed, the advertised "No No List" of excluded ingredients came down, and cafes shifted from daily deliveries of fresh-baked bread to par-baked frozen dough finished in-store. Staffing was cut, and service got less consistent.',
      'None of that is a hostile characterization — Panera\'s own CEO acknowledged in 2025 that customers were being asked to pay significantly more for a smaller sandwich made with lower-quality ingredients. Sales fell, and the company announced a turnaround explicitly aimed at reversing the cuts.',
      'What makes it instructive is the sequence. Each individual change was small enough to deny and cheap enough to justify. Together they degraded the thing customers were actually paying for, and the company only reversed course after the damage showed up in the numbers. Employees and regulars were describing all of it publicly years before that.',
    ],
  },
  {
    name: "Claire's",
    sub: 'Apollo · bought 2007 for $3.1B · two bankruptcies · sold for ~$140M in 2025',
    paras: [
      'Apollo took the accessories chain private in a $3.1 billion leveraged buyout in 2007. The debt outlasted the strategy: Claire\'s filed for bankruptcy in 2018, restructured, and filed again in 2025.',
      'In August 2025 the brick-and-mortar business was bought out of bankruptcy by Ames Watson for about $140 million — roughly four cents on the dollar against the original purchase price, with a much smaller store fleet. Two generations of teenagers got their ears pierced there; what killed it was a capital structure, not a change in taste.',
    ],
  },
  {
    name: 'Progress Residential & HavenBrook Homes',
    sub: 'Pretium Partners · ~97,000 single-family rental homes',
    paras: [
      'After the 2008 foreclosure crisis, investment firms bought up foreclosed houses in bulk. Pretium\'s Progress Residential became the largest institutional owner of single-family rentals in the country, with roughly 97,000 homes.',
      'At Pretium-owned HavenBrook Homes in Minnesota, tenants reported going winters without heat, sewage backups, mold, and broken doors and windows that went unrepaired. The Minnesota attorney general sued over habitability conditions.',
      'This is the same deferred-maintenance logic as a restaurant cutting prep staff, applied to somewhere people live. Following a tenant campaign, Progress later sold 345 Twin Cities homes to nonprofit owners — a reminder that these outcomes are contested, not inevitable.',
    ],
  },
  {
    name: 'Petland-style vet roll-ups',
    sub: 'JAB (NVA), KKR (PetVet), Mars (VCA) · ongoing',
    paras: [
      'Veterinary care is one of the clearest live examples of a PE roll-up in progress. Firms have acquired thousands of independent clinics and typically keep the original local names and signage, so most clients never learn ownership changed.',
      'Veterinary service prices have risen substantially faster than overall inflation over the past decade, and vets at consolidated practices have publicly described pressure to raise per-visit revenue. If you want to keep your vet independent, the only reliable move is to ask who owns the practice.',
    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        title="Case studies"
        intro="Not theory — receipts. Here is what happened to specific, recognizable companies after a buyout, and who came out ahead."
      />
      <section className="section">
        <div className="container prose">
          {studies.map((s) => (
            <article key={s.name} className="case">
              <h3>{s.name}</h3>
              <div className="case-sub">{s.sub}</div>
              {s.paras.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </article>
          ))}
          <div className="callout">
            These summaries are drawn from public reporting, court filings and
            academic research. Details — especially dollar figures — vary between
            sources, and the companies and firms involved dispute some
            characterizations. Verify before citing anything as fact in a public
            argument.
          </div>
        </div>
      </section>
    </>
  );
}
