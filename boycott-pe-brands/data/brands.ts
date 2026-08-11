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
  alternatives?: string[]; // non-PE-owned alternatives
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
  { name: 'Subway', category: 'restaurants', firm: 'roark-capital', since: '2024', note: 'Sold by its founding families to Roark for ~$9.6B.', alternatives: ['Local independent delis and sandwich shops'] },
  { name: "Dunkin'", category: 'restaurants', firm: 'roark-capital', since: '2020', note: 'Part of Roark’s Inspire Brands.', alternatives: ['Independent local coffee shops and bakeries'] },
  { name: 'Baskin-Robbins', category: 'restaurants', firm: 'roark-capital', since: '2020', note: 'Part of Inspire Brands.', alternatives: ['Local scoop shops and creameries'] },
  { name: "Arby's", category: 'restaurants', firm: 'roark-capital', since: '2011', note: 'The original Inspire Brands chain.', alternatives: ['Local sandwich shops'] },
  { name: 'Buffalo Wild Wings', category: 'restaurants', firm: 'roark-capital', since: '2018', note: 'Part of Inspire Brands.', alternatives: ['Local sports bars and wing joints'] },
  { name: 'Sonic Drive-In', category: 'restaurants', firm: 'roark-capital', since: '2018', note: 'Part of Inspire Brands.', alternatives: ['Local drive-ins and burger stands'] },
  { name: "Jimmy John's", category: 'restaurants', firm: 'roark-capital', since: '2019', note: 'Part of Inspire Brands.', alternatives: ['Local independent sandwich shops'] },
  { name: 'Cinnabon', category: 'restaurants', firm: 'roark-capital', note: 'Part of GoTo Foods (formerly Focus Brands).', alternatives: ['Local bakeries'] },
  { name: "Auntie Anne's", category: 'restaurants', firm: 'roark-capital', note: 'Part of GoTo Foods.', alternatives: ['Local bakeries and pretzel shops'] },
  { name: 'Jamba', category: 'restaurants', firm: 'roark-capital', note: 'Part of GoTo Foods.', alternatives: ['Independent juice and smoothie bars'] },
  { name: "Moe's Southwest Grill", category: 'restaurants', firm: 'roark-capital', note: 'Part of GoTo Foods.', alternatives: ['Local taquerias'] },
  { name: "Schlotzsky's", category: 'restaurants', firm: 'roark-capital', note: 'Part of GoTo Foods.', alternatives: ['Local sandwich shops'] },
  { name: "Carl's Jr. / Hardee's", category: 'restaurants', firm: 'roark-capital', note: 'CKE Restaurants is Roark-owned.', alternatives: ['Local burger joints'] },
  { name: "Culver's (minority stake)", category: 'restaurants', firm: 'roark-capital', note: 'Roark holds a minority investment; still family-led.', alternatives: ['Local frozen-custard stands'] },
  { name: 'Nothing Bundt Cakes', category: 'restaurants', firm: 'roark-capital', since: '2021', alternatives: ['Local bakeries'] },
  { name: "Jersey Mike's", category: 'restaurants', firm: 'blackstone', since: '2025', note: 'Blackstone acquired majority control in a ~$8B deal.', alternatives: ['Local independent sub shops'] },
  { name: 'Tropical Smoothie Cafe', category: 'restaurants', firm: 'blackstone', since: '2024', alternatives: ['Independent smoothie bars'] },
  { name: 'Panera Bread', category: 'restaurants', firm: 'jab-holding', since: '2017', alternatives: ['Local bakery-cafes'] },
  { name: 'Pret A Manger', category: 'restaurants', firm: 'jab-holding', since: '2018', alternatives: ['Local cafes and delis'] },
  { name: 'Krispy Kreme', category: 'restaurants', firm: 'jab-holding', since: '2016', note: 'Listed on Nasdaq but JAB remains controlling shareholder.', alternatives: ['Local doughnut shops'] },
  { name: "Peet's Coffee", category: 'restaurants', firm: 'jab-holding', since: '2012', note: 'Part of JAB’s JDE Peet’s.', alternatives: ['Independent coffee roasters'] },
  { name: 'Caribou Coffee', category: 'restaurants', firm: 'jab-holding', since: '2012', alternatives: ['Independent coffee shops'] },
  { name: 'Einstein Bros. Bagels', category: 'restaurants', firm: 'jab-holding', since: '2014', alternatives: ['Local bagel shops'] },
  { name: 'Whataburger', category: 'restaurants', firm: 'bdt-msd', since: '2019', note: 'Founding Dobson family sold majority control to BDT Capital.', alternatives: ['Local burger joints'] },
  { name: "P.F. Chang's", category: 'restaurants', firm: 'triartisan', since: '2019', alternatives: ['Local family-owned Chinese restaurants'] },
  { name: 'Hooters', category: 'restaurants', firm: 'triartisan', note: 'Filed for bankruptcy in 2025 under PE ownership.', alternatives: ['Local sports bars'] },
  { name: 'Bob Evans Restaurants', category: 'restaurants', firm: 'golden-gate-capital', since: '2017', alternatives: ['Local diners'] },
  { name: 'First Watch', category: 'restaurants', firm: 'advent-international', note: 'Publicly listed but Advent remains the controlling shareholder.', alternatives: ['Local breakfast spots'] },

  // ── Groceries & Snacks ─────────────────────────────────────────────────────
  { name: 'Chef Boyardee', category: 'groceries', firm: 'brynwood-partners', since: '2025', note: 'Sold by Conagra to Brynwood’s Hometown Food Company.', alternatives: ['Store-brand pasta + homemade sauce', 'Local Italian delis'] },
  { name: 'Pillsbury (shelf products)', category: 'groceries', firm: 'brynwood-partners', since: '2018', note: 'Baking mixes/flour under Hometown Food; refrigerated dough remains General Mills.', alternatives: ['King Arthur Baking (employee-owned)', 'Bob’s Red Mill (employee-owned)'] },
  { name: 'Birch Benders', category: 'groceries', firm: 'brynwood-partners', since: '2023', alternatives: ['King Arthur Baking (employee-owned)'] },
  { name: 'Turkey Hill', category: 'groceries', firm: 'peak-rock', since: '2019', note: 'Iced tea and ice cream brand sold by Kroger to Peak Rock.', alternatives: ['Local dairies and creameries', 'Brew your own iced tea'] },
  { name: "Shearer's Foods", category: 'groceries', firm: 'cdr', since: '2024', note: 'Makes many store-brand chips and snacks.', alternatives: ['Regional independent snack makers'] },
  { name: 'Family Dollar', category: 'groceries', firm: 'cdr', since: '2025', note: 'Bought from Dollar Tree by Brigade Capital & Macellum with PE backing.', alternatives: ['Local grocers and co-ops'] },
  { name: 'The Fresh Market', category: 'groceries', firm: 'apollo', since: '2016', note: 'Apollo took the grocer private; Cencosud later bought a majority stake.', alternatives: ['Local food co-ops and farmers markets'] },
  { name: 'Utz (minority PE stakes historically)', category: 'groceries', firm: 'cdr', note: 'Now public; listed here as an example to verify — snack aisle ownership shifts fast.', alternatives: ['Regional family-owned snack brands'] },

  // ── Retail & Apparel ───────────────────────────────────────────────────────
  { name: 'Walgreens / Duane Reade', category: 'retail', firm: 'sycamore-partners', since: '2025', note: 'Sycamore took Walgreens Boots Alliance private in a ~$10B deal.', alternatives: ['Independent local pharmacies', 'Cost Plus Drugs (online)'] },
  { name: 'Staples', category: 'retail', firm: 'sycamore-partners', since: '2017', alternatives: ['Local office-supply stores', 'Independent print shops'] },
  { name: 'Belk', category: 'retail', firm: 'sycamore-partners', since: '2015', alternatives: ['Local boutiques and department stores'] },
  { name: 'Hot Topic / BoxLunch', category: 'retail', firm: 'sycamore-partners', since: '2013', alternatives: ['Independent comic and band-merch shops'] },
  { name: 'Ann Taylor / LOFT / Lane Bryant', category: 'retail', firm: 'sycamore-partners', since: '2020', note: 'Bought out of Ascena’s bankruptcy (KnitWell Group).', alternatives: ['Local boutiques', 'Secondhand/thrift'] },
  { name: 'Talbots', category: 'retail', firm: 'sycamore-partners', since: '2012', alternatives: ['Local boutiques'] },
  { name: 'Michaels', category: 'retail', firm: 'apollo', since: '2021', alternatives: ['Local independent craft and art-supply stores'] },
  { name: 'Skechers', category: 'retail', firm: '3g-capital', since: '2025', note: '~$9.4B take-private by 3G Capital.', alternatives: ['New Balance (private, family-controlled)', 'Brooks (Berkshire-owned, not PE)', 'Local running stores'] },
  { name: 'Canada Goose (controlling stake)', category: 'retail', firm: 'bain-capital', since: '2013', note: 'Public, but Bain retains voting control.', alternatives: ['Patagonia (purpose-trust owned)', 'Local outdoor retailers'] },
  { name: 'Birkenstock (controlling stake)', category: 'retail', firm: 'l-catterton', since: '2021', note: 'Public since 2023; L Catterton remains controlling shareholder.', alternatives: ['Local cobblers and independent shoe brands'] },
  { name: 'Spanx (majority stake)', category: 'retail', firm: 'blackstone', since: '2021', alternatives: ['Independent apparel brands'] },
  { name: 'Guitar Center', category: 'retail', firm: 'ares-management', note: 'Owned by Ares after its 2020 bankruptcy; previously Bain-owned and debt-laden.', alternatives: ['Local independent music stores', 'Sweetwater (founder-rooted, though PE has a stake — verify)'] },
  { name: 'Mattress chains (various)', category: 'retail', firm: 'advent-international', note: 'Serta Simmons went bankrupt in 2023 under Advent; check who owns your mattress brand.', alternatives: ['Local factory-direct mattress makers'] },

  // ── Home & Kitchen ─────────────────────────────────────────────────────────
  { name: 'Weber Grills', category: 'home', firm: 'bdt-msd', since: '2023', note: 'Taken private by BDT after a rocky IPO.', alternatives: ['Local hardware stores’ house brands'] },
  { name: 'Culligan', category: 'home', firm: 'bdt-msd', since: '2021', alternatives: ['Local independent water-treatment companies'] },
  { name: 'At Home', category: 'home', firm: 'hellman-friedman', since: '2021', note: 'Filed for Chapter 11 bankruptcy in 2025.', alternatives: ['Local furniture and decor stores', 'Estate sales and secondhand'] },
  { name: 'Instant Pot / Pyrex / Corelle', category: 'home', firm: 'cornell-capital', note: 'Instant Brands went bankrupt in 2023 after a PE dividend recap; brands now under successor owners.', alternatives: ['Lodge Cast Iron (family-owned)', 'OXO (Helen of Troy, public)'] },
  { name: 'TruGreen', category: 'home', firm: 'cdr', alternatives: ['Local independent lawn-care companies'] },
  { name: 'Neighborly (Mr. Rooter, Molly Maid, etc.)', category: 'home', firm: 'roark-capital', note: 'Roark’s home-services franchise empire: 30+ brands.', alternatives: ['Local independent plumbers, cleaners and tradespeople'] },

  // ── Pets & Veterinary ──────────────────────────────────────────────────────
  { name: 'PetSmart', category: 'pets', firm: 'bc-partners', since: '2015', alternatives: ['Local independent pet stores'] },
  { name: 'Petco', category: 'pets', firm: 'cvc-capital', since: '2015', note: 'CVC Capital & CPP Investments.', alternatives: ['Local independent pet stores'] },
  { name: 'National Veterinary Associates (NVA)', category: 'pets', firm: 'ethos-veterinary', since: '2025', note: 'JAB built NVA to 1,000+ clinics, then combined it with Ethos in 2025. Most clinics keep their original local names, so clients rarely notice the change.', alternatives: ['Independently owned vet practices — ask who owns your clinic'] },
  { name: 'PetVet Care Centers', category: 'pets', firm: 'kkr', since: '2018', alternatives: ['Independently owned vet practices'] },
  { name: 'Thrive Pet Healthcare', category: 'pets', firm: 'tsg-consumer', alternatives: ['Independently owned vet practices'] },

  // ── Health & Personal Care ─────────────────────────────────────────────────
  { name: '1-800 Contacts', category: 'health', firm: 'kkr', since: '2020', alternatives: ['Local optometrists', 'Warby Parker (public)'] },
  { name: 'Aspen Dental', category: 'health', firm: 'leonard-green', note: 'Ares & Leonard Green-backed dental chain.', alternatives: ['Independent local dentists'] },
  { name: 'Heartland Dental', category: 'health', firm: 'kkr', since: '2018', note: 'Largest US dental support organization.', alternatives: ['Independent local dentists'] },
  { name: 'CityMD / Summit Health', category: 'health', firm: 'warburg-pincus', note: 'Urgent-care roll-up (merged into VillageMD/Walgreens orbit — verify current structure).', alternatives: ['Independent urgent-care clinics, community health centers'] },
  { name: 'Olaplex', category: 'health', firm: 'advent-international', since: '2020', note: 'Public, but Advent controls the company.', alternatives: ['Independent salon brands'] },
  { name: 'Dollar Shave Club', category: 'health', firm: 'nexus-capital', since: '2023', alternatives: ['Traditional safety razors (buy-once)', 'Local barbershops'] },
  { name: 'Thorne (supplements)', category: 'health', firm: 'l-catterton', since: '2023', alternatives: ['Employee-owned or family-owned supplement brands — verify each'] },
  { name: 'Ancestry', category: 'health', firm: 'blackstone', since: '2020', note: 'Your family DNA data, owned by the world’s largest PE firm.', alternatives: ['FamilySearch (nonprofit, free)'] },

  // ── Fitness & Wellness ─────────────────────────────────────────────────────
  { name: 'Anytime Fitness', category: 'fitness', firm: 'roark-capital', note: 'Purpose Brands (Roark-backed).', alternatives: ['Community rec centers, YMCA (nonprofit)', 'Independent local gyms'] },
  { name: 'Orangetheory Fitness', category: 'fitness', firm: 'roark-capital', since: '2024', note: 'Merged with Self Esteem Brands, Roark-backed.', alternatives: ['Independent local studios'] },
  { name: 'Massage Envy', category: 'fitness', firm: 'roark-capital', alternatives: ['Independent licensed massage therapists'] },
  { name: 'Hand & Stone', category: 'fitness', firm: 'harvest-partners', since: '2022', alternatives: ['Independent massage therapists and estheticians'] },
  { name: 'CorePower Yoga', category: 'fitness', firm: 'tsg-consumer', alternatives: ['Independent local yoga studios'] },
  { name: 'Solidcore', category: 'fitness', firm: 'l-catterton', since: '2024', alternatives: ['Independent pilates studios'] },

  // ── Kids & Family ──────────────────────────────────────────────────────────
  { name: 'The Goddard School', category: 'kids', firm: 'sycamore-partners', since: '2022', alternatives: ['Nonprofit and co-op preschools', 'Independent local daycares'] },
  { name: 'Primrose Schools', category: 'kids', firm: 'roark-capital', since: '2021', alternatives: ['Nonprofit and co-op preschools'] },
  { name: 'Learning Care Group (La Petite, Childtime)', category: 'kids', firm: 'american-securities', alternatives: ['Nonprofit and community daycares'] },
  { name: 'Urban Air Adventure Park', category: 'kids', firm: 'unleashed-brands', alternatives: ['Public parks, community centers, local play spaces'] },
  { name: 'Varsity Brands (cheer & school spirit)', category: 'kids', firm: 'kkr', since: '2024', note: 'Bought by KKR from Bain; long criticized for monopolizing competitive cheer.', alternatives: ['Independent local cheer gyms where possible'] },
  { name: 'Bugaboo (strollers)', category: 'kids', firm: 'bain-capital', since: '2018', alternatives: ['Secondhand strollers', 'Family-owned brands (verify)'] },

  // ── Entertainment & Travel ─────────────────────────────────────────────────
  { name: 'Great Wolf Lodge', category: 'travel', firm: 'blackstone', alternatives: ['State parks, community pools, independent lodges'] },
  { name: 'Merlin Entertainments (Legoland, Madame Tussauds)', category: 'travel', firm: 'blackstone', since: '2019', note: 'Blackstone-led consortium with KIRKBI and CPP.', alternatives: ['Local museums, science centers, county fairs'] },
  { name: 'Alterra / Ikon Pass (Palisades, Steamboat, Deer Valley…)', category: 'travel', firm: 'ksl-capital', note: 'KSL Capital + Henry Crown. Ski-pass duopoly with Vail’s Epic.', alternatives: ['Independent ski hills — see the Indy Pass'] },
  { name: 'Shutterfly / Snapfish', category: 'travel', firm: 'apollo', since: '2019', alternatives: ['Local photo printers and labs'] },

  // ── Home Services & Other ──────────────────────────────────────────────────
  { name: 'Securus (prison phone calls)', category: 'services', firm: 'platinum-equity', note: 'Charges incarcerated people and families steep rates; long-running divestment campaigns target it.', alternatives: ['Support orgs like Worth Rises campaigning for free prison calls'] },
  { name: 'ViaPath / GTL (prison services)', category: 'services', firm: 'american-securities', alternatives: ['Support prison-telecom reform campaigns'] },

  // ── Media & Tech ───────────────────────────────────────────────────────────
  { name: 'Yahoo / AOL / TechCrunch / Engadget', category: 'media', firm: 'apollo', since: '2021', alternatives: ['Independent and nonprofit newsrooms'] },
  { name: 'Simon & Schuster', category: 'media', firm: 'kkr', since: '2023', alternatives: ['Independent publishers and local bookstores', 'Bookshop.org'] },
  { name: 'McClatchy (Miami Herald, KC Star, Sacramento Bee)', category: 'media', firm: 'chatham-asset', since: '2020', note: 'Bought out of bankruptcy by the hedge fund Chatham Asset Management; roughly 30 dailies.', alternatives: ['Subscribe to independent and nonprofit local newsrooms'] },

  // ── Added August 2026 review pass ──────────────────────────────────────────

  // Restaurants
  { name: "Dave's Hot Chicken", category: 'restaurants', firm: 'roark-capital', since: '2025', note: 'Roark took a majority stake at a reported $1B valuation — its 21st restaurant chain.', alternatives: ['Local hot-chicken and fried-chicken spots'] },
  { name: "McAlister's Deli", category: 'restaurants', firm: 'roark-capital', note: 'Part of GoTo Foods.', alternatives: ['Local delis'] },
  { name: 'Carvel', category: 'restaurants', firm: 'roark-capital', note: 'Part of GoTo Foods.', alternatives: ['Local ice cream shops'] },

  // Retail & apparel
  { name: "Claire's", category: 'retail', firm: 'ames-watson', since: '2025', note: 'Apollo bought it for $3.1B in 2007 in a leveraged buyout; after two bankruptcies the stores sold for about $140M in 2025 — roughly 4% of the original price.', alternatives: ['Local jewelry and accessory shops', 'Independent piercing studios'] },
  { name: 'Torrid', category: 'retail', firm: 'sycamore-partners', note: 'Public, but Sycamore holds roughly 55% of the shares.', alternatives: ['Independent plus-size boutiques', 'Secondhand'] },

  // Fitness
  { name: 'Club Pilates', category: 'fitness', firm: 'xponential', alternatives: ['Independent pilates studios'] },
  { name: 'Pure Barre', category: 'fitness', firm: 'xponential', alternatives: ['Independent barre and dance studios'] },
  { name: 'StretchLab', category: 'fitness', firm: 'xponential', alternatives: ['Licensed physical therapists and massage therapists'] },
  { name: 'YogaSix', category: 'fitness', firm: 'xponential', alternatives: ['Independent local yoga studios'] },
  { name: 'CycleBar', category: 'fitness', firm: 'xponential', alternatives: ['Independent spin studios', 'Riding an actual bicycle'] },
  { name: "Barry's Bootcamp", category: 'fitness', firm: 'north-castle', alternatives: ['Independent local gyms and bootcamps'] },
  { name: 'Life Time', category: 'fitness', firm: 'tpg', since: '2015', note: 'Taken private for ~$4B by TPG and Leonard Green; relisted in 2021 with both firms still major holders.', alternatives: ['YMCA (nonprofit)', 'Community rec centers'] },

  // Housing & rentals
  { name: 'Progress Residential', category: 'housing', firm: 'pretium-partners', note: 'The largest institutional owner of single-family rental homes in the US — about 97,000 houses.', alternatives: ['Rent from small local landlords', 'Housing co-ops and community land trusts'] },
  { name: 'HavenBrook Homes', category: 'housing', firm: 'pretium-partners', note: 'Tenants reported no heat in winter, sewage backups and mold; sued by the Minnesota attorney general over habitability.', alternatives: ['Small local landlords', 'Nonprofit housing providers'] },
  { name: 'FirstKey Homes', category: 'housing', firm: 'cerberus', note: 'Cerberus-backed single-family landlord with 50,000+ homes.', alternatives: ['Small local landlords'] },
  { name: 'Amherst Residential', category: 'housing', firm: 'amherst', note: 'Roughly 59,000 single-family rental homes.', alternatives: ['Small local landlords'] },
  { name: 'Blackstone single-family rentals', category: 'housing', firm: 'blackstone', note: 'Blackstone founded Invitation Homes after the foreclosure crisis and still holds tens of thousands of rental houses.', alternatives: ['Small local landlords', 'Community land trusts'] },

  // Elder care
  { name: 'PE-owned nursing homes (sector-wide)', category: 'eldercare', firm: 'blackstone', note: 'Not one chain but a pattern: peer-reviewed research links PE ownership to ~10–11% higher resident mortality, lower staffing and more federal violations. Ownership is often buried in holding companies — check a facility on Medicare’s Care Compare before choosing one.', alternatives: ['Nonprofit and religiously affiliated nursing homes', 'Facilities rated 4–5 stars on Medicare Care Compare'] },
  { name: 'Elara Caring (home health & hospice)', category: 'eldercare', firm: 'blue-wolf-kelso', alternatives: ['Nonprofit hospice providers', 'Community home-health agencies'] },
  { name: 'Enhabit Home Health & Hospice', category: 'eldercare', firm: 'kinderhook', since: '2026', note: '$1.1B acquisition covering roughly 249 home-health and 117 hospice locations in 34 states.', alternatives: ['Nonprofit hospice providers'] },

  // Health
  { name: 'US Renal Care (dialysis)', category: 'health', firm: 'summit-bain-renal', note: 'Third-largest dialysis provider. Dialysis patients need treatment three times a week and cannot realistically switch providers — the definition of a captive market.', alternatives: ['Nonprofit and hospital-run dialysis centers where available'] },
  { name: 'Center for Social Dynamics (autism therapy)', category: 'health', firm: 'goldman-pia', note: 'One of many PE-backed applied behavior analysis chains rolling up autism services.', alternatives: ['Independent and nonprofit ABA providers', 'University-affiliated clinics'] },
  { name: 'VetCor', category: 'pets', firm: 'harvest-partners', note: 'Veterinary roll-up co-owned with Cressey & Company; clinics keep local names.', alternatives: ['Independently owned vet practices'] },
  { name: 'Mission Pet Health / Southern Veterinary Partners', category: 'pets', firm: 'southern-vet', since: '2025', note: 'Formed by merger in 2025; another large network of locally branded clinics.', alternatives: ['Independently owned vet practices'] },

  // Home services
  { name: 'Apex Service Partners (HVAC & plumbing)', category: 'services', firm: 'apollo', note: 'Apollo-backed roll-up valued around $10B, buying up local HVAC and plumbing companies that keep their original names.', alternatives: ['Independent local HVAC and plumbing contractors'] },
  { name: 'Champions Group (HVAC)', category: 'services', firm: 'blackstone', alternatives: ['Independent local HVAC contractors'] },
  { name: 'Wrench Group (HVAC & plumbing)', category: 'services', firm: 'apax-partners', alternatives: ['Independent local contractors'] },
  { name: 'Authority Brands (Benjamin Franklin Plumbing, Mister Sparky…)', category: 'services', firm: 'apax-partners', note: 'Franchise platform spanning plumbing, HVAC, electrical and pest.', alternatives: ['Independent local tradespeople'] },
  { name: 'Sila Services (HVAC & plumbing)', category: 'services', firm: 'morgan-stanley-cp', alternatives: ['Independent local contractors'] },
  { name: 'Redwood Services (home trades)', category: 'services', firm: 'sun-capital', alternatives: ['Independent local contractors'] },
  { name: 'Aptive Environmental (pest control)', category: 'services', firm: 'goldman-pia', alternatives: ['Independent local pest-control companies'] },
  { name: 'Anticimex (pest control)', category: 'services', firm: 'eqt', alternatives: ['Independent local pest-control companies'] },

  // Media & tech
  { name: 'Chicago Tribune', category: 'media', firm: 'alden-global', since: '2021', note: 'Alden cut the newsroom sharply after taking control of Tribune Publishing.', alternatives: ['Independent and nonprofit local newsrooms', 'Chicago Sun-Times (nonprofit-owned)'] },
  { name: 'New York Daily News', category: 'media', firm: 'alden-global', since: '2021', note: 'The union reported layoffs of 28% of its members in early 2026.', alternatives: ['Independent and nonprofit local newsrooms'] },
  { name: 'The Denver Post', category: 'media', firm: 'alden-global', note: 'The paper whose own editorial board publicly revolted against Alden’s cuts.', alternatives: ['Colorado Sun (journalist-owned)'] },
  { name: 'The Baltimore Sun', category: 'media', firm: 'alden-global', alternatives: ['Baltimore Banner (nonprofit)'] },
  { name: 'San Jose Mercury News / East Bay Times', category: 'media', firm: 'alden-global', note: 'Combined Bay Area newsrooms shrank from roughly 380 staffers to around 160.', alternatives: ['Independent and nonprofit local newsrooms'] },
  { name: 'The San Diego Union-Tribune', category: 'media', firm: 'alden-global', since: '2023', alternatives: ['Voice of San Diego (nonprofit)'] },
  { name: 'Orange County Register', category: 'media', firm: 'alden-global', alternatives: ['Independent local newsrooms'] },
  { name: 'Boston Herald', category: 'media', firm: 'alden-global', alternatives: ['Independent local newsrooms'] },
  { name: 'St. Paul Pioneer Press', category: 'media', firm: 'alden-global', alternatives: ['Sahan Journal and other nonprofit Minnesota newsrooms'] },
  { name: 'Citrix / Cloud Software Group', category: 'media', firm: 'vista-equity', since: '2022', note: 'Taken private with Elliott and merged with TIBCO under roughly $15–16B of new debt, followed by mass layoffs and steep licensing price hikes.', alternatives: ['Open-source remote-access tools'] },
  { name: 'Zendesk', category: 'media', firm: 'permira', since: '2022', note: '$10.2B take-private led by Hellman & Friedman and Permira.', alternatives: ['Open-source or independently owned helpdesk software'] },
  { name: 'Coupa Software', category: 'media', firm: 'thoma-bravo', since: '2022', note: '$6.2B take-private.', alternatives: ['Independently owned procurement software'] },
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
