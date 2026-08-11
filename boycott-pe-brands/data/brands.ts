// ─────────────────────────────────────────────────────────────────────────────
// Brand ownership database
//
// IMPORTANT: Private-equity ownership changes constantly (buyouts, exits,
// IPOs, bankruptcies). Entries reflect widely reported ownership at the time
// of the last review pass (see LAST_VERIFIED) and should be re-verified
// before being treated as current fact.
//
// Some entries below are firms other than classic buyout shops — hedge funds
// (Alden, Chatham) and family investment vehicles (JAB, BDT) that run the same
// debt-and-extraction playbook. Where that distinction matters it is noted.
// See the site-wide disclaimer in the footer.
// ─────────────────────────────────────────────────────────────────────────────

export interface Firm {
  slug: string;
  name: string;
  description: string;
}

export interface Brand {
  name: string;
  category: string; // category id
  firm: string; // firm slug
  since?: string; // year of PE acquisition/control
  note?: string;
  /** What measurably changed after the buyout. Only set when it can be
   *  tied to reporting, company statements, court filings or research. */
  change?: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'restaurants',
    name: 'Restaurants & Fast Food',
    emoji: '🍔',
    description:
      'Franchised restaurant chains are a favorite PE target: buy the brand, load it with debt, squeeze franchisees and cut food quality.',
  },
  {
    id: 'groceries',
    name: 'Groceries & Snacks',
    emoji: '🛒',
    description:
      'Legacy food brands get bought, cost-engineered, and shrunk — same package, smaller portion, cheaper ingredients.',
  },
  {
    id: 'retail',
    name: 'Retail & Apparel',
    emoji: '🛍️',
    description:
      'Retail is where PE leaves its biggest graveyard: Toys R Us, Payless, Nine West, and Joann all collapsed under buyout debt.',
  },
  {
    id: 'home',
    name: 'Home & Kitchen',
    emoji: '🏠',
    description:
      'Household names in cookware, home goods and home services increasingly answer to PE portfolio managers.',
  },
  {
    id: 'pets',
    name: 'Pets & Veterinary',
    emoji: '🐾',
    description:
      'PE has rolled up thousands of vet clinics and pet retailers — one reason vet bills have far outpaced inflation.',
  },
  {
    id: 'health',
    name: 'Health & Personal Care',
    emoji: '🩺',
    description:
      'From pharmacies to dental chains to contact lenses, healthcare consolidation by PE is linked to higher prices and worse outcomes.',
  },
  {
    id: 'fitness',
    name: 'Fitness & Wellness',
    emoji: '💪',
    description:
      'Gym and studio franchises are heavily PE-consolidated — memberships get harder to cancel, staffing gets thinner.',
  },
  {
    id: 'kids',
    name: 'Kids & Family',
    emoji: '🧸',
    description:
      'Daycare chains and family entertainment have become PE assets, with tuition hikes and cost-cutting following the buyouts.',
  },
  {
    id: 'travel',
    name: 'Entertainment & Travel',
    emoji: '🎢',
    description:
      'Theme parks, ski passes and attractions run by PE tend to mean aggressive pricing, upsells, and cut staffing.',
  },
  {
    id: 'services',
    name: 'Home Services & Other',
    emoji: '🔧',
    description:
      'Plumbing, lawn care, car washes, water treatment — PE roll-ups are consolidating local trades and raising prices.',
  },
  {
    id: 'media',
    name: 'Media & Tech',
    emoji: '💻',
    description:
      'News outlets, publishers and consumer tech under PE ownership face layoffs, paywalls and data monetization.',
  },
  {
    id: 'housing',
    name: 'Housing & Rentals',
    emoji: '🏘️',
    description:
      'After 2008, investment firms bought foreclosed homes by the tens of thousands. Institutional landlords are linked to above-market rent hikes, fee stacking and elevated eviction rates.',
  },
  {
    id: 'eldercare',
    name: 'Elder Care',
    emoji: '🧓',
    description:
      'The best-documented harm in the whole sector: peer-reviewed research ties PE ownership of nursing homes to lower staffing and higher resident mortality.',
  },
];

export const firms: Firm[] = [
  {
    slug: 'roark-capital',
    name: 'Roark Capital',
    description:
      'Atlanta-based PE firm that quietly controls a huge share of American franchising: Subway, Dunkin’, Arby’s, Sonic, Buffalo Wild Wings, Jimmy John’s, Cinnabon, Massage Envy, Anytime Fitness and more, largely through Inspire Brands, GoTo Foods and Neighborly.',
  },
  {
    slug: 'blackstone',
    name: 'Blackstone',
    description:
      'The world’s largest alternative asset manager (over $1 trillion AUM). Owns consumer brands like Ancestry, Spanx, Jersey Mike’s and Tropical Smoothie Cafe, plus vast holdings in housing — it has been widely criticized as a mega-landlord driving up rents.',
  },
  {
    slug: 'kkr',
    name: 'KKR',
    description:
      'The original leveraged-buyout giant (of "Barbarians at the Gate" fame). Co-led the Toys R Us buyout that ended in liquidation, and owned ER-staffing firm Envision Healthcare through its bankruptcy. Owns Simon & Schuster, 1-800 Contacts and PetVet.',
  },
  {
    slug: 'apollo',
    name: 'Apollo Global Management',
    description:
      'One of the most aggressive credit-and-buyout shops. Owns Yahoo, Michaels and Shutterfly; previously controlled Chuck E. Cheese (bankrupt 2020) and Smart & Final.',
  },
  {
    slug: 'bain-capital',
    name: 'Bain Capital',
    description:
      'Boston PE firm co-founded by Mitt Romney. Co-owned Toys R Us at its collapse and Guitar Center through its 2020 bankruptcy. Holds stakes in Canada Goose, Bugaboo and Varsity Brands.',
  },
  {
    slug: 'sycamore-partners',
    name: 'Sycamore Partners',
    description:
      'Retail-focused PE firm notorious for aggressive financial engineering — it stripped assets from Nine West (bankrupt 2018) and Talbots. Owns Staples, Belk, Hot Topic, Ann Taylor/Loft brands, The Goddard School, and acquired Walgreens Boots Alliance in 2025.',
  },
  {
    slug: 'jab-holding',
    name: 'JAB Holding',
    description:
      'Investment vehicle of Germany’s billionaire Reimann family, run like a PE fund. Rolled up coffee and breakfast: Panera, Pret A Manger, Krispy Kreme, Peet’s, Caribou, Einstein Bros — plus one of the largest US veterinary chains (NVA).',
  },
  {
    slug: 'golden-gate-capital',
    name: 'Golden Gate Capital',
    description:
      'San Francisco PE firm behind two infamous retail/restaurant failures: Payless ShoeSource (bankrupt twice) and Red Lobster, whose real estate it sold off in a sale-leaseback that helped sink the chain. Owns Bob Evans Restaurants.',
  },
  {
    slug: 'advent-international',
    name: 'Advent International',
    description:
      'Global buyout firm. Controls Olaplex and First Watch; owned Serta Simmons through its 2023 bankruptcy.',
  },
  {
    slug: 'l-catterton',
    name: 'L Catterton',
    description:
      'Consumer-focused PE firm backed by LVMH and Bernard Arnault. Controls Birkenstock, took Thorne supplements private, and has owned stakes in dozens of food, beauty and fitness brands (including Solidcore).',
  },
  {
    slug: 'cerberus',
    name: 'Cerberus Capital Management',
    description:
      'Named after the three-headed dog guarding Hades. Its ownership of Steward Health Care — hospitals stripped of their real estate while Cerberus extracted hundreds of millions — ended in one of the largest hospital bankruptcies in US history (2024).',
  },
  {
    slug: 'cdr',
    name: 'Clayton, Dubilier & Rice (CD&R)',
    description:
      'Veteran buyout firm. Owns TruGreen lawn care and Shearer’s (store-brand snacks), and led the 2025 take-private of Family Dollar.',
  },
  {
    slug: 'bc-partners',
    name: 'BC Partners',
    description: 'European buyout firm that has owned PetSmart since 2015 and previously controlled Chewy.',
  },
  {
    slug: 'cvc-capital',
    name: 'CVC Capital Partners',
    description:
      'One of Europe’s largest PE firms; co-owns Petco (with CPP Investments) and holds stakes across sports, retail and consumer businesses.',
  },
  {
    slug: '3g-capital',
    name: '3G Capital',
    description:
      'Brazilian-American buyout firm famous for ruthless "zero-based budgeting" cost cuts at Kraft Heinz and Burger King. Acquired Skechers in 2025 for about $9.4 billion.',
  },
  {
    slug: 'tsg-consumer',
    name: 'TSG Consumer Partners',
    description: 'Consumer-brand PE firm; owns Thrive Pet Healthcare and CorePower Yoga among others.',
  },
  {
    slug: 'leonard-green',
    name: 'Leonard Green & Partners',
    description:
      'LA-based buyout firm. Its portfolio company Joann (fabric & crafts) went bankrupt and liquidated in 2025 after years of buyout debt; co-owned J.Crew into its 2020 bankruptcy. Co-owns Aspen Dental.',
  },
  {
    slug: 'brynwood-partners',
    name: 'Brynwood Partners (Hometown Food)',
    description:
      'PE firm specializing in buying "orphaned" legacy food brands from big conglomerates, including Pillsbury shelf products, Birch Benders, and Chef Boyardee (acquired 2025).',
  },
  {
    slug: 'peak-rock',
    name: 'Peak Rock Capital',
    description: 'Middle-market PE firm; owns Turkey Hill (iced tea & ice cream) since 2019.',
  },
  {
    slug: 'nexus-capital',
    name: 'Nexus Capital Management',
    description: 'LA PE firm that bought Dollar Shave Club from Unilever in 2023.',
  },
  {
    slug: 'bdt-msd',
    name: 'BDT & MSD Partners',
    description:
      'Merchant bank/PE hybrid managing money for billionaire families (including Michael Dell). Controls Whataburger, Weber grills and Culligan.',
  },
  {
    slug: 'triartisan',
    name: 'TriArtisan Capital',
    description:
      'PE firm behind P.F. Chang’s and Hooters (bankrupt 2025); owned TGI Fridays as it slid into 2024 bankruptcy.',
  },
  {
    slug: 'ares-management',
    name: 'Ares Management',
    description:
      'Credit-and-PE giant. Took control of Guitar Center after its bankruptcy; owned 99 Cents Only, which liquidated all stores in 2024. Co-owns Aspen Dental.',
  },
  {
    slug: 'platinum-equity',
    name: 'Platinum Equity',
    description:
      'Tom Gores’ buyout firm. Long criticized for owning prison-phone monopolist Securus, which charges incarcerated people and their families steep rates for calls.',
  },
  {
    slug: 'ksl-capital',
    name: 'KSL Capital / Henry Crown',
    description:
      'Travel-and-leisure PE. Co-controls Alterra Mountain Company (Ikon Pass, Palisades Tahoe, Steamboat, Deer Valley) — a force behind ski-pass consolidation.',
  },
  {
    slug: 'warburg-pincus',
    name: 'Warburg Pincus',
    description: 'Global growth/buyout firm; backed the CityMD/Summit Health urgent-care roll-up.',
  },
  {
    slug: 'harvest-partners',
    name: 'Harvest Partners',
    description: 'Mid-market PE firm; owns the Hand & Stone massage franchise.',
  },
  {
    slug: 'american-securities',
    name: 'American Securities',
    description:
      'Owns Learning Care Group daycare chains and ViaPath (formerly GTL), the other half of the prison-phone duopoly.',
  },
  {
    slug: 'cornell-capital',
    name: 'Cornell Capital',
    description:
      'Owned Instant Brands (Instant Pot, Pyrex, Corelle), which it loaded with debt — including a dividend recapitalization — before the company went bankrupt in 2023.',
  },
  {
    slug: 'hellman-friedman',
    name: 'Hellman & Friedman',
    description: 'Took At Home (home decor superstores) private in 2021; the chain filed for bankruptcy in 2025.',
  },
  {
    slug: 'unleashed-brands',
    name: 'Unleashed Brands (PE-backed)',
    description: 'PE-backed franchise roll-up of kids’ activity brands: Urban Air, Little Gym, Snapology and more.',
  },
  {
    slug: 'pretium-partners',
    name: 'Pretium Partners',
    description:
      'Through Progress Residential, the largest institutional owner of single-family rental homes in the US — roughly 97,000 houses. Tenants at its HavenBrook Homes have reported months without heat, sewage backups, and mold; the Minnesota attorney general sued over habitability and the company later sold hundreds of Twin Cities homes to nonprofits.',
  },
  {
    slug: 'amherst',
    name: 'The Amherst Group',
    description: 'Institutional single-family landlord with roughly 59,000 rental houses.',
  },
  {
    slug: 'alden-global',
    name: 'Alden Global Capital',
    description:
      'A hedge fund rather than a buyout firm, but it runs the same playbook on local news. Through MediaNews Group and Tribune Publishing it owns around 68 daily papers and 300+ weeklies, and is the second-largest newspaper owner in the country. Its pattern is repeated layoffs, newsroom consolidation and sale of newspaper real estate.',
  },
  {
    slug: 'chatham-asset',
    name: 'Chatham Asset Management',
    description: 'Hedge fund that owns McClatchy — the Miami Herald, Kansas City Star, Sacramento Bee and about 28 other dailies — bought out of bankruptcy in 2020.',
  },
  {
    slug: 'apax-partners',
    name: 'Apax Partners',
    description: 'London-based buyout firm behind two large home-services roll-ups: Wrench Group and the Authority Brands franchise platform.',
  },
  {
    slug: 'morgan-stanley-cp',
    name: 'Morgan Stanley Capital Partners',
    description: 'Private equity arm of the bank; built Sila Services into a large East Coast HVAC and plumbing roll-up.',
  },
  {
    slug: 'sun-capital',
    name: 'Sun Capital Partners',
    description: 'Buyout firm with a long retail and restaurant track record, including several portfolio bankruptcies; now backing the Redwood Services home-trades roll-up.',
  },
  {
    slug: 'goldman-pia',
    name: 'Goldman Sachs (Asset Management)',
    description: 'The bank’s private investing arm backs Aptive Environmental pest control and, with NMS Capital, the Center for Social Dynamics autism-therapy chain.',
  },
  {
    slug: 'eqt',
    name: 'EQT',
    description: 'Large Swedish buyout firm; owns Anticimex, a global pest-control roll-up.',
  },
  {
    slug: 'thoma-bravo',
    name: 'Thoma Bravo',
    description:
      'The most acquisitive software buyout firm in the world, with a reputation for buying mature software, cutting R&D and headcount, and raising subscription prices on locked-in customers.',
  },
  {
    slug: 'vista-equity',
    name: 'Vista Equity Partners',
    description:
      'Software-focused buyout firm. With Elliott it took Citrix private and merged it with TIBCO into Cloud Software Group — one of the largest software LBOs ever by debt, followed by deep layoffs and sharp licensing price increases.',
  },
  {
    slug: 'permira',
    name: 'Permira',
    description: 'European buyout firm; co-led the $10.2B take-private of Zendesk with Hellman & Friedman.',
  },
  {
    slug: 'ames-watson',
    name: 'Ames Watson',
    description: 'Bought Claire’s global store estate out of its second bankruptcy in 2025 for about $140 million — the latest owner of a chain Apollo had bought for $3.1 billion in 2007.',
  },
  {
    slug: 'tpg',
    name: 'TPG',
    description: 'Major buyout firm; co-led the ~$4B take-private of Life Time Fitness with Leonard Green.',
  },
  {
    slug: 'north-castle',
    name: 'North Castle Partners',
    description: 'Health-and-wellness focused PE firm; backer of Barry’s Bootcamp and other studio chains.',
  },
  {
    slug: 'xponential',
    name: 'Xponential Fitness (PE-backed)',
    description:
      'A PE-built roll-up of boutique studio franchises — Club Pilates, Pure Barre, StretchLab, YogaSix, CycleBar and more. Went public in 2021; franchisees have publicly disputed the economics of its model.',
  },
  {
    slug: 'blue-wolf-kelso',
    name: 'Blue Wolf Capital & Kelso',
    description: 'Co-owners of Elara Caring, one of the largest home-health, personal-care and hospice providers in the US.',
  },
  {
    slug: 'kinderhook',
    name: 'Kinderhook Industries',
    description: 'Agreed in 2026 to buy Enhabit, a home-health and hospice operator running roughly 249 home-health and 117 hospice locations across 34 states, for $1.1 billion.',
  },
  {
    slug: 'ethos-veterinary',
    name: 'Ethos Veterinary Health',
    description:
      'PE-backed veterinary group that acquired National Veterinary Associates in 2025, combining two of the largest clinic networks in the country. Most acquired clinics keep their original local names.',
  },
  {
    slug: 'southern-vet',
    name: 'Mission Pet Health / Southern Veterinary Partners',
    description: 'PE-backed veterinary roll-up formed by the 2025 merger of Southern Veterinary Partners and Mission Veterinary Partners.',
  },
  {
    slug: 'summit-bain-renal',
    name: 'Bain Capital & Summit Partners',
    description: 'Joint owners of US Renal Care, the third-largest dialysis provider in the country — a sector where patients cannot simply switch providers.',
  },
];

export const brands: Brand[] = [
  // ── Restaurants & Fast Food ────────────────────────────────────────────────
  { name: 'Subway', category: 'restaurants', firm: 'roark-capital', since: '2024', note: 'Sold by its founding families to Roark for ~$9.6B.', change: 'Closed 729 more US stores in 2025 and has shed over 8,000 US locations since 2015. Franchisees say the in-store meat slicers pushed in 2022–23 never delivered the promised traffic, and operators of 5,000+ locations petitioned against a rewards program they said lost them money. Several large franchisees have since filed for bankruptcy.' },
  { name: "Dunkin'", category: 'restaurants', firm: 'roark-capital', since: '2020', note: 'Part of Roark’s Inspire Brands.' },
  { name: 'Baskin-Robbins', category: 'restaurants', firm: 'roark-capital', since: '2020', note: 'Part of Inspire Brands.' },
  { name: "Arby's", category: 'restaurants', firm: 'roark-capital', since: '2011', note: 'The original Inspire Brands chain.' },
  { name: 'Buffalo Wild Wings', category: 'restaurants', firm: 'roark-capital', since: '2018', note: 'Part of Inspire Brands.', change: 'Widely reported among the chains whose portions shrank — customers and trade press have documented smaller wings for the same price.' },
  { name: 'Sonic Drive-In', category: 'restaurants', firm: 'roark-capital', since: '2018', note: 'Part of Inspire Brands.' },
  { name: "Jimmy John's", category: 'restaurants', firm: 'roark-capital', since: '2019', note: 'Part of Inspire Brands.' },
  { name: 'Cinnabon', category: 'restaurants', firm: 'roark-capital', note: 'Part of GoTo Foods (formerly Focus Brands).' },
  { name: "Auntie Anne's", category: 'restaurants', firm: 'roark-capital', note: 'Part of GoTo Foods.' },
  { name: 'Jamba', category: 'restaurants', firm: 'roark-capital', note: 'Part of GoTo Foods.' },
  { name: "Moe's Southwest Grill", category: 'restaurants', firm: 'roark-capital', note: 'Part of GoTo Foods.' },
  { name: "Schlotzsky's", category: 'restaurants', firm: 'roark-capital', note: 'Part of GoTo Foods.' },
  { name: "Carl's Jr. / Hardee's", category: 'restaurants', firm: 'roark-capital', note: 'CKE Restaurants is Roark-owned.' },
  { name: "Culver's (minority stake)", category: 'restaurants', firm: 'roark-capital', note: 'Roark holds a minority investment; still family-led.' },
  { name: 'Nothing Bundt Cakes', category: 'restaurants', firm: 'roark-capital', since: '2021' },
  { name: "Jersey Mike's", category: 'restaurants', firm: 'blackstone', since: '2025', note: 'Blackstone acquired majority control in a ~$8B deal.' },
  { name: 'Tropical Smoothie Cafe', category: 'restaurants', firm: 'blackstone', since: '2024' },
  { name: 'Panera Bread', category: 'restaurants', firm: 'jab-holding', since: '2017', change: 'Portions shrank while prices rose — the CEO admitted in 2025 that customers were paying significantly more for a smaller sandwich with lower-quality ingredients. Cafes switched from daily fresh-baked bread to par-baked frozen dough, the advertised “No No List” of excluded ingredients came down, and staffing was cut. Sales fell and the company announced a turnaround to reverse the cuts.' },
  { name: 'Pret A Manger', category: 'restaurants', firm: 'jab-holding', since: '2018' },
  { name: 'Krispy Kreme', category: 'restaurants', firm: 'jab-holding', since: '2016', note: 'Listed on Nasdaq but JAB remains controlling shareholder.' },
  { name: "Peet's Coffee", category: 'restaurants', firm: 'jab-holding', since: '2012', note: 'Part of JAB’s JDE Peet’s.' },
  { name: 'Caribou Coffee', category: 'restaurants', firm: 'jab-holding', since: '2012' },
  { name: 'Einstein Bros. Bagels', category: 'restaurants', firm: 'jab-holding', since: '2014' },
  { name: 'Whataburger', category: 'restaurants', firm: 'bdt-msd', since: '2019', note: 'Founding Dobson family sold majority control to BDT Capital.' },
  { name: "P.F. Chang's", category: 'restaurants', firm: 'triartisan', since: '2019' },
  { name: 'Hooters', category: 'restaurants', firm: 'triartisan', note: 'Filed for bankruptcy in 2025 under PE ownership.', change: 'Filed for bankruptcy in 2025 under PE ownership.' },
  { name: 'Bob Evans Restaurants', category: 'restaurants', firm: 'golden-gate-capital', since: '2017' },
  { name: 'First Watch', category: 'restaurants', firm: 'advent-international', note: 'Publicly listed but Advent remains the controlling shareholder.' },

  // ── Groceries & Snacks ─────────────────────────────────────────────────────
  { name: 'Chef Boyardee', category: 'groceries', firm: 'brynwood-partners', since: '2025', note: 'Sold by Conagra to Brynwood’s Hometown Food Company.' },
  { name: 'Pillsbury (shelf products)', category: 'groceries', firm: 'brynwood-partners', since: '2018', note: 'Baking mixes/flour under Hometown Food; refrigerated dough remains General Mills.' },
  { name: 'Birch Benders', category: 'groceries', firm: 'brynwood-partners', since: '2023' },
  { name: 'Turkey Hill', category: 'groceries', firm: 'peak-rock', since: '2019', note: 'Iced tea and ice cream brand sold by Kroger to Peak Rock.' },
  { name: "Shearer's Foods", category: 'groceries', firm: 'cdr', since: '2024', note: 'Makes many store-brand chips and snacks.' },
  { name: 'Family Dollar', category: 'groceries', firm: 'cdr', since: '2025', note: 'Bought from Dollar Tree by Brigade Capital & Macellum with PE backing.', change: 'Sold by Dollar Tree in 2025 to investors including PE backers, after years in which understaffing and store-condition problems drew repeated regulatory penalties across the dollar-store sector.' },
  { name: 'The Fresh Market', category: 'groceries', firm: 'apollo', since: '2016', note: 'Apollo took the grocer private; Cencosud later bought a majority stake.' },
  { name: 'Utz (minority PE stakes historically)', category: 'groceries', firm: 'cdr', note: 'Now public; listed here as an example to verify — snack aisle ownership shifts fast.' },

  // ── Retail & Apparel ───────────────────────────────────────────────────────
  { name: 'Walgreens / Duane Reade', category: 'retail', firm: 'sycamore-partners', since: '2025', note: 'Sycamore took Walgreens Boots Alliance private in a ~$10B deal.', change: 'Sycamore took Walgreens private in August 2025 and installed a former Staples executive as CEO. The company had announced 1,200 store closures over three years; the US store count has fallen from about 8,500 at acquisition to roughly 8,000, alongside corporate layoffs. Pharmacy closures hit low-income and rural areas hardest, where the nearest alternative may be many miles away.' },
  { name: 'Staples', category: 'retail', firm: 'sycamore-partners', since: '2017' },
  { name: 'Belk', category: 'retail', firm: 'sycamore-partners', since: '2015' },
  { name: 'Hot Topic / BoxLunch', category: 'retail', firm: 'sycamore-partners', since: '2013' },
  { name: 'Ann Taylor / LOFT / Lane Bryant', category: 'retail', firm: 'sycamore-partners', since: '2020', note: 'Bought out of Ascena’s bankruptcy (KnitWell Group).' },
  { name: 'Talbots', category: 'retail', firm: 'sycamore-partners', since: '2012' },
  { name: 'Michaels', category: 'retail', firm: 'apollo', since: '2021' },
  { name: 'Skechers', category: 'retail', firm: '3g-capital', since: '2025', note: '~$9.4B take-private by 3G Capital.' },
  { name: 'Canada Goose (controlling stake)', category: 'retail', firm: 'bain-capital', since: '2013', note: 'Public, but Bain retains voting control.' },
  { name: 'Birkenstock (controlling stake)', category: 'retail', firm: 'l-catterton', since: '2021', note: 'Public since 2023; L Catterton remains controlling shareholder.' },
  { name: 'Spanx (majority stake)', category: 'retail', firm: 'blackstone', since: '2021' },
  { name: 'Guitar Center', category: 'retail', firm: 'ares-management', note: 'Owned by Ares after its 2020 bankruptcy; previously Bain-owned and debt-laden.', change: 'Loaded with debt under Bain, filed for bankruptcy in 2020, and emerged under the control of Ares — its creditors.' },
  { name: 'Mattress chains (various)', category: 'retail', firm: 'advent-international', note: 'Serta Simmons went bankrupt in 2023 under Advent; check who owns your mattress brand.' },

  // ── Home & Kitchen ─────────────────────────────────────────────────────────
  { name: 'Weber Grills', category: 'home', firm: 'bdt-msd', since: '2023', note: 'Taken private by BDT after a rocky IPO.' },
  { name: 'Culligan', category: 'home', firm: 'bdt-msd', since: '2021' },
  { name: 'At Home', category: 'home', firm: 'hellman-friedman', since: '2021', note: 'Filed for Chapter 11 bankruptcy in 2025.', change: 'Taken private by Hellman & Friedman in 2021 and filed for Chapter 11 bankruptcy in 2025.' },
  { name: 'Instant Pot / Pyrex / Corelle', category: 'home', firm: 'cornell-capital', note: 'Instant Brands went bankrupt in 2023 after a PE dividend recap; brands now under successor owners.', change: 'Instant Brands took on new debt in 2021 to fund a dividend to its PE owners; when rates rose the debt service became unmanageable and the company filed for Chapter 11 in 2023 — a profitable, popular product line undone by borrowing done in its name.' },
  { name: 'TruGreen', category: 'home', firm: 'cdr' },
  { name: 'Neighborly (Mr. Rooter, Molly Maid, etc.)', category: 'home', firm: 'roark-capital', note: 'Roark’s home-services franchise empire: 30+ brands.' },

  // ── Pets & Veterinary ──────────────────────────────────────────────────────
  { name: 'PetSmart', category: 'pets', firm: 'bc-partners', since: '2015' },
  { name: 'Petco', category: 'pets', firm: 'cvc-capital', since: '2015', note: 'CVC Capital & CPP Investments.', change: 'Announced closures of underperforming stores and took analyst downgrades on falling sales and profit, with persistent customer complaints about pricing well above mass-market retailers.' },
  { name: 'National Veterinary Associates (NVA)', category: 'pets', firm: 'ethos-veterinary', since: '2025', note: 'JAB built NVA to 1,000+ clinics, then combined it with Ethos in 2025. Most clinics keep their original local names, so clients rarely notice the change.', change: 'Part of a sector-wide roll-up: corporate and PE ownership of US vet clinics went from roughly 8% in 2011 to about half by 2025, and acquired clinics commonly raise prices within 12–24 months. Clinics keep their original names, so most clients never learn the owner changed.' },
  { name: 'PetVet Care Centers', category: 'pets', firm: 'kkr', since: '2018' },
  { name: 'Thrive Pet Healthcare', category: 'pets', firm: 'tsg-consumer' },

  // ── Health & Personal Care ─────────────────────────────────────────────────
  { name: '1-800 Contacts', category: 'health', firm: 'kkr', since: '2020', change: 'The FTC brought an antitrust case over agreements with rival sellers that restricted search advertising and, the agency argued, kept contact-lens prices higher than they would otherwise have been.' },
  { name: 'Aspen Dental', category: 'health', firm: 'leonard-green', note: 'Ares & Leonard Green-backed dental chain.', change: 'A long regulatory record: settlements with the Pennsylvania (2010), New York (2015) and Indiana (2015) attorneys general; a $3.5M Massachusetts settlement in 2023 over bait-and-switch tactics; and a California settlement over violating the state ban on corporate practice of dentistry and false advertising. Class actions allege patients were pressured into unnecessary treatment and expensive financing.' },
  { name: 'Heartland Dental', category: 'health', firm: 'kkr', since: '2018', note: 'Largest US dental support organization.' },
  { name: 'CityMD / Summit Health', category: 'health', firm: 'warburg-pincus', note: 'Urgent-care roll-up (merged into VillageMD/Walgreens orbit — verify current structure).' },
  { name: 'Olaplex', category: 'health', firm: 'advent-international', since: '2020', note: 'Public, but Advent controls the company.' },
  { name: 'Dollar Shave Club', category: 'health', firm: 'nexus-capital', since: '2023' },
  { name: 'Thorne (supplements)', category: 'health', firm: 'l-catterton', since: '2023' },
  { name: 'Ancestry', category: 'health', firm: 'blackstone', since: '2020', note: 'Your family DNA data, owned by the world’s largest PE firm.' },

  // ── Fitness & Wellness ─────────────────────────────────────────────────────
  { name: 'Anytime Fitness', category: 'fitness', firm: 'roark-capital', note: 'Purpose Brands (Roark-backed).', change: 'Merged with Orangetheory in 2024 into a Roark-backed group with 7,000+ locations and roughly $3.5B in system-wide sales — further consolidating the budget-gym market.' },
  { name: 'Orangetheory Fitness', category: 'fitness', firm: 'roark-capital', since: '2024', note: 'Merged with Self Esteem Brands, Roark-backed.', change: 'Members have filed BBB complaints saying they were sold on “cancel anytime” and later told they were locked into 12-month contracts. After the 2024 merger with Anytime Fitness’s parent, franchisees formed an independent association over weak membership growth, and one 90-location franchisee paused new development.' },
  { name: 'Massage Envy', category: 'fitness', firm: 'roark-capital' },
  { name: 'Hand & Stone', category: 'fitness', firm: 'harvest-partners', since: '2022' },
  { name: 'CorePower Yoga', category: 'fitness', firm: 'tsg-consumer' },
  { name: 'Solidcore', category: 'fitness', firm: 'l-catterton', since: '2024' },

  // ── Kids & Family ──────────────────────────────────────────────────────────
  { name: 'The Goddard School', category: 'kids', firm: 'sycamore-partners', since: '2022', change: 'Owned since 2022 by Sycamore, the firm behind Nine West and Staples — childcare bought by a retail-focused buyout shop, in a sector where tuition increases hit families with no easy alternative.' },
  { name: 'Primrose Schools', category: 'kids', firm: 'roark-capital', since: '2021' },
  { name: 'Learning Care Group (La Petite, Childtime)', category: 'kids', firm: 'american-securities' },
  { name: 'Urban Air Adventure Park', category: 'kids', firm: 'unleashed-brands' },
  { name: 'Varsity Brands (cheer & school spirit)', category: 'kids', firm: 'kkr', since: '2024', note: 'Bought by KKR from Bain; long criticized for monopolizing competitive cheer.', change: 'Paid an $82.5M antitrust settlement approved in 2024, after an earlier $43.5M settlement, over claims it monopolized cheer competitions, camps and apparel and charged families inflated prices. Bain Capital and Charlesbank were named alongside the company.' },
  { name: 'Bugaboo (strollers)', category: 'kids', firm: 'bain-capital', since: '2018' },

  // ── Entertainment & Travel ─────────────────────────────────────────────────
  { name: 'Great Wolf Lodge', category: 'travel', firm: 'blackstone' },
  { name: 'Merlin Entertainments (Legoland, Madame Tussauds)', category: 'travel', firm: 'blackstone', since: '2019', note: 'Blackstone-led consortium with KIRKBI and CPP.' },
  { name: 'Alterra / Ikon Pass (Palisades, Steamboat, Deer Valley…)', category: 'travel', firm: 'ksl-capital', note: 'KSL Capital + Henry Crown. Ski-pass duopoly with Vail’s Epic.', change: 'The Ikon Pass rose about 40% since 2021, to $1,399 for 2026-27. Single-day tickets climbed far faster — Steamboat went from $159 in 2019 to $339. In March 2026 skiers filed an antitrust class action against Alterra and Vail alleging their pass bundling inflated prices and suppressed competition. Regular complaints center on crowding at the resorts the passes funnel people into.' },
  { name: 'Shutterfly / Snapfish', category: 'travel', firm: 'apollo', since: '2019' },

  // ── Home Services & Other ──────────────────────────────────────────────────
  { name: 'Securus (prison phone calls)', category: 'services', firm: 'platinum-equity', note: 'Charges incarcerated people and families steep rates; long-running divestment campaigns target it.', change: 'The FCC capped prison call rates in 2024 at about $0.06/minute in state prisons. Securus sought an exemption, was denied, and challenged the caps in court. In October 2025 the FCC voted to raise the caps to roughly $0.10–$0.18/minute, with video up to $0.41/minute in small jails, plus an 11–20% facility add-on — costs borne by families, most of them low income.' },
  { name: 'ViaPath / GTL (prison services)', category: 'services', firm: 'american-securities', change: 'Half of the prison-telecom duopoly whose limited competition regulators and advocates blame for persistently high call costs; benefited alongside Securus when the FCC raised rate caps in October 2025.' },

  // ── Media & Tech ───────────────────────────────────────────────────────────
  { name: 'Yahoo / AOL / TechCrunch / Engadget', category: 'media', firm: 'apollo', since: '2021' },
  { name: 'Simon & Schuster', category: 'media', firm: 'kkr', since: '2023' },
  { name: 'McClatchy (Miami Herald, KC Star, Sacramento Bee)', category: 'media', firm: 'chatham-asset', since: '2020', note: 'Bought out of bankruptcy by the hedge fund Chatham Asset Management; roughly 30 dailies.' },

  // ── Added August 2026 review pass ──────────────────────────────────────────

  // Restaurants
  { name: "Dave's Hot Chicken", category: 'restaurants', firm: 'roark-capital', since: '2025', note: 'Roark took a majority stake at a reported $1B valuation — its 21st restaurant chain.' },
  { name: "McAlister's Deli", category: 'restaurants', firm: 'roark-capital', note: 'Part of GoTo Foods.' },
  { name: 'Carvel', category: 'restaurants', firm: 'roark-capital', note: 'Part of GoTo Foods.' },

  // Retail & apparel
  { name: "Claire's", category: 'retail', firm: 'ames-watson', since: '2025', note: 'Apollo bought it for $3.1B in 2007 in a leveraged buyout; after two bankruptcies the stores sold for about $140M in 2025 — roughly 4% of the original price.', change: 'Apollo’s $3.1B leveraged buyout in 2007 was followed by bankruptcies in 2018 and 2025. The store business sold for about $140 million in 2025 — roughly four cents on the dollar — with a much smaller store fleet.' },
  { name: 'Torrid', category: 'retail', firm: 'sycamore-partners', note: 'Public, but Sycamore holds roughly 55% of the shares.' },

  // Fitness
  { name: 'Club Pilates', category: 'fitness', firm: 'xponential', change: 'Parent Xponential agreed in 2026 to pay about $39.75M — a $17M FTC settlement returning money to franchisees, the largest ever in a franchise case, plus $22.75M to 500+ franchisees. The FTC said it misrepresented studio costs, risks and time to open.' },
  { name: 'Pure Barre', category: 'fitness', firm: 'xponential', change: 'Same Xponential settlements: roughly $39.75M total, including the largest franchisee payout the FTC has ever obtained, over misrepresented costs and risks.' },
  { name: 'StretchLab', category: 'fitness', firm: 'xponential', change: 'Covered by the 2026 Xponential FTC and franchisee settlements totaling about $39.75M over misrepresented franchise costs and risks.' },
  { name: 'YogaSix', category: 'fitness', firm: 'xponential', change: 'Covered by the 2026 Xponential FTC and franchisee settlements totaling about $39.75M over misrepresented franchise costs and risks.' },
  { name: 'CycleBar', category: 'fitness', firm: 'xponential', change: 'Covered by the 2026 Xponential FTC and franchisee settlements totaling about $39.75M over misrepresented franchise costs and risks.' },
  { name: "Barry's Bootcamp", category: 'fitness', firm: 'north-castle' },
  { name: 'Life Time', category: 'fitness', firm: 'tpg', since: '2015', note: 'Taken private for ~$4B by TPG and Leonard Green; relisted in 2021 with both firms still major holders.' },

  // Housing & rentals
  { name: 'Progress Residential', category: 'housing', firm: 'pretium-partners', note: 'The largest institutional owner of single-family rental homes in the US — about 97,000 houses.', change: 'Grew into the largest institutional owner of US single-family rentals at roughly 97,000 houses. After a tenant campaign it sold 345 Twin Cities homes to nonprofit owners.' },
  { name: 'HavenBrook Homes', category: 'housing', firm: 'pretium-partners', note: 'Tenants reported no heat in winter, sewage backups and mold; sued by the Minnesota attorney general over habitability.', change: 'Tenants reported going winters without heat, plus sewage backups, mold, and broken doors and windows left unrepaired. The Minnesota attorney general sued over habitability conditions.' },
  { name: 'FirstKey Homes', category: 'housing', firm: 'cerberus', note: 'Cerberus-backed single-family landlord with 50,000+ homes.' },
  { name: 'Amherst Residential', category: 'housing', firm: 'amherst', note: 'Roughly 59,000 single-family rental homes.' },
  { name: 'Blackstone single-family rentals', category: 'housing', firm: 'blackstone', note: 'Blackstone founded Invitation Homes after the foreclosure crisis and still holds tens of thousands of rental houses.' },

  // Elder care
  { name: 'PE-owned nursing homes (sector-wide)', category: 'eldercare', firm: 'blackstone', note: 'Not one chain but a pattern: peer-reviewed research links PE ownership to ~10–11% higher resident mortality, lower staffing and more federal violations. Ownership is often buried in holding companies — check a facility on Medicare’s Care Compare before choosing one.', change: 'NBER and Weill Cornell research found staffing fell and short-term mortality rose roughly 10–11% after PE acquisition, with more ER visits and more hospitalizations for largely preventable causes — an estimated 20,150 additional deaths over twelve years.' },
  { name: 'Elara Caring (home health & hospice)', category: 'eldercare', firm: 'blue-wolf-kelso' },
  { name: 'Enhabit Home Health & Hospice', category: 'eldercare', firm: 'kinderhook', since: '2026', note: '$1.1B acquisition covering roughly 249 home-health and 117 hospice locations in 34 states.' },

  // Health
  { name: 'US Renal Care (dialysis)', category: 'health', firm: 'summit-bain-renal', note: 'Third-largest dialysis provider. Dialysis patients need treatment three times a week and cannot realistically switch providers — the definition of a captive market.', change: 'Dialysis patients need treatment roughly three times a week and realistically cannot switch providers — a captive market, and precisely the kind of position that makes price and staffing decisions consequential.' },
  { name: 'Center for Social Dynamics (autism therapy)', category: 'health', firm: 'goldman-pia', note: 'One of many PE-backed applied behavior analysis chains rolling up autism services.' },
  { name: 'VetCor', category: 'pets', firm: 'harvest-partners', note: 'Veterinary roll-up co-owned with Cressey & Company; clinics keep local names.', change: 'Another locally branded clinic network in the same roll-up wave that has pushed corporate ownership to roughly half of US vet practices.' },
  { name: 'Mission Pet Health / Southern Veterinary Partners', category: 'pets', firm: 'southern-vet', since: '2025', note: 'Formed by merger in 2025; another large network of locally branded clinics.', change: 'Formed by a 2025 merger of two large clinic networks — further consolidation in a market where vet costs have risen far faster than inflation and 81% of vets reported clients growing more price-sensitive in 2025.' },

  // Home services
  { name: 'Apex Service Partners (HVAC & plumbing)', category: 'services', firm: 'apollo', note: 'Apollo-backed roll-up valued around $10B, buying up local HVAC and plumbing companies that keep their original names.' },
  { name: 'Champions Group (HVAC)', category: 'services', firm: 'blackstone' },
  { name: 'Wrench Group (HVAC & plumbing)', category: 'services', firm: 'apax-partners' },
  { name: 'Authority Brands (Benjamin Franklin Plumbing, Mister Sparky…)', category: 'services', firm: 'apax-partners', note: 'Franchise platform spanning plumbing, HVAC, electrical and pest.' },
  { name: 'Sila Services (HVAC & plumbing)', category: 'services', firm: 'morgan-stanley-cp' },
  { name: 'Redwood Services (home trades)', category: 'services', firm: 'sun-capital' },
  { name: 'Aptive Environmental (pest control)', category: 'services', firm: 'goldman-pia' },
  { name: 'Anticimex (pest control)', category: 'services', firm: 'eqt' },

  // Media & tech
  { name: 'Chicago Tribune', category: 'media', firm: 'alden-global', since: '2021', note: 'Alden cut the newsroom sharply after taking control of Tribune Publishing.' },
  { name: 'New York Daily News', category: 'media', firm: 'alden-global', since: '2021', note: 'The union reported layoffs of 28% of its members in early 2026.', change: 'The NewsGuild reported Alden laid off 28% of its union members in early 2026. Since Alden took over in 2021 the paper has become largely remote, with layoffs roughly every six months.' },
  { name: 'The Denver Post', category: 'media', firm: 'alden-global', note: 'The paper whose own editorial board publicly revolted against Alden’s cuts.', change: 'Cuts under Alden were severe enough that the paper’s own editorial board publicly revolted against its owner — an almost unheard-of act by a newsroom against the people who sign its checks.' },
  { name: 'The Baltimore Sun', category: 'media', firm: 'alden-global' },
  { name: 'San Jose Mercury News / East Bay Times', category: 'media', firm: 'alden-global', note: 'Combined Bay Area newsrooms shrank from roughly 380 staffers to around 160.', change: 'Alden merged the Oakland Tribune, Contra Costa Times and Daily Review into the East Bay Times; combined newsroom staffing fell from roughly 380 to about 160.' },
  { name: 'The San Diego Union-Tribune', category: 'media', firm: 'alden-global', since: '2023' },
  { name: 'Orange County Register', category: 'media', firm: 'alden-global' },
  { name: 'Boston Herald', category: 'media', firm: 'alden-global' },
  { name: 'St. Paul Pioneer Press', category: 'media', firm: 'alden-global' },
  { name: 'Citrix / Cloud Software Group', category: 'media', firm: 'vista-equity', since: '2022', note: 'Taken private with Elliott and merged with TIBCO under roughly $15–16B of new debt, followed by mass layoffs and steep licensing price hikes.', change: 'Merged with TIBCO under roughly $15–16B of new debt, followed by mass layoffs and sharp licensing price increases for customers who are slow and expensive to migrate away.' },
  { name: 'Zendesk', category: 'media', firm: 'permira', since: '2022', note: '$10.2B take-private led by Hellman & Friedman and Permira.' },
  { name: 'Coupa Software', category: 'media', firm: 'thoma-bravo', since: '2022', note: '$6.2B take-private.' },
];

// Derived helpers -------------------------------------------------------------

export function firmBySlug(slug: string): Firm | undefined {
  return firms.find((f) => f.slug === slug);
}

export function categoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function brandsByFirm(slug: string): Brand[] {
  return brands.filter((b) => b.firm === slug);
}

export function brandsByCategory(id: string): Brand[] {
  return brands.filter((b) => b.category === id);
}

export const LAST_VERIFIED = 'August 2026';
