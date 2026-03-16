import { Lesson, Unit, ILRLevelInfo } from '../types';

// ============================================================
// ILR Level Definitions
// Used by CIA, NSA, DIA, State Department
// ============================================================

export const ILR_LEVELS: ILRLevelInfo[] = [
  {
    level: 0,
    label: 'No Proficiency',
    description: 'No practical ability. Minimal memorized vocabulary.',
    operationalCapability: 'Cannot operate independently.',
    targetWeeks: 0,
  },
  {
    level: 0.5,
    label: 'Memorized Proficiency',
    description: 'Can ask basic questions using memorized phrases.',
    operationalCapability: 'Survival phrases only.',
    targetWeeks: 4,
  },
  {
    level: 1,
    label: 'Elementary Proficiency',
    description: 'Can handle basic survival situations and simple exchanges.',
    operationalCapability: 'Navigate airports, hotels, emergency situations.',
    targetWeeks: 10,
  },
  {
    level: 1.5,
    label: 'Elementary+ Proficiency',
    description: 'Can discuss familiar topics with some complexity.',
    operationalCapability: 'Casual social interaction, simple requests.',
    targetWeeks: 16,
  },
  {
    level: 2,
    label: 'Limited Working Proficiency',
    description: 'Can handle work requirements and social situations.',
    operationalCapability: 'Conduct routine meetings, read basic reports.',
    targetWeeks: 24,
  },
  {
    level: 2.5,
    label: 'Limited Working Proficiency+',
    description: 'Can discuss most topics with some limitations.',
    operationalCapability: 'Negotiate simple agreements, write formal correspondence.',
    targetWeeks: 32,
  },
  {
    level: 3,
    label: 'Professional Working Proficiency',
    description: 'Can perform most professional tasks with fluency.',
    operationalCapability: 'CIA minimum for operational use. Full professional negotiations.',
    targetWeeks: 44,
  },
  {
    level: 3.5,
    label: 'Professional Working Proficiency+',
    description: 'Can discuss complex topics with precision and nuance.',
    operationalCapability: 'Handle all professional situations independently.',
    targetWeeks: 55,
  },
  {
    level: 4,
    label: 'Full Professional Proficiency',
    description: 'Equivalent to educated native speaker in most respects.',
    operationalCapability: 'Conduct sensitive negotiations, detect deception nuances.',
    targetWeeks: 70,
  },
  {
    level: 5,
    label: 'Native or Bilingual Proficiency',
    description: 'Functionally equivalent to educated native speaker.',
    operationalCapability: 'Operate entirely in language without compromise.',
    targetWeeks: 100,
  },
];

// ============================================================
// Lesson Curriculum
// Structured like FSI Programmatic Course - 10 Units
// ============================================================

export const spanishLessons: Lesson[] = [
  // ─── UNIT 1: FOUNDATIONS ─────────────────────────────────────
  {
    id: 'l001',
    unitId: 'u001',
    title: 'Lesson 1: First Contact',
    subtitle: 'Greetings & Self-Introduction',
    objective: 'Greet people formally, introduce yourself, and exchange basic courtesies.',
    ilrLevel: 0,
    estimatedMinutes: 20,
    vocabulary: ['v001', 'v002', 'v003', 'v004', 'v005', 'v006', 'v007', 'v008', 'v009', 'v010', 'v011', 'v012', 'v013', 'v014', 'v015'],
    drills: ['d001'],
    dialogues: ['dia001'],
    culturalBriefing: 'In Latin America, greetings carry significant social weight. A proper greeting establishes trust and respect. Use "usted" (formal you) until explicitly invited to use "tú." In many countries, even people you see daily get a full greeting. Skipping greetings is considered rude.',
    completionXP: 100,
  },
  {
    id: 'l002',
    unitId: 'u001',
    title: 'Lesson 2: Essential Questions',
    subtitle: 'The 5 W\'s — Gathering Information',
    objective: 'Form and respond to basic information questions. The foundation of all communication.',
    ilrLevel: 0,
    estimatedMinutes: 25,
    vocabulary: ['v020', 'v021', 'v022', 'v023', 'v024', 'v025', 'v026', 'v027'],
    drills: ['d005'],
    dialogues: [],
    culturalBriefing: 'Questions are power. The ability to ask precise questions is the most critical skill in any operational language situation. Master these 7 interrogative words and you can extract any information you need.',
    completionXP: 100,
  },
  {
    id: 'l003',
    unitId: 'u001',
    title: 'Lesson 3: SER & ESTAR — The Two "To Be"s',
    subtitle: 'The Most Important Grammar Distinction in Spanish',
    objective: 'Correctly use SER (permanent) and ESTAR (temporary/location) — the most common learner error.',
    ilrLevel: 0,
    estimatedMinutes: 30,
    vocabulary: ['v030', 'v031'],
    drills: ['d001', 'd002'],
    dialogues: [],
    culturalBriefing: 'The SER/ESTAR distinction is uniquely Spanish. Native speakers find this error immediately obvious. Mixing them up can change your meaning significantly — "estar muerto" means physically dead; "ser aburrido" means being a boring person vs "estar aburrido" = being bored right now.',
    completionXP: 150,
  },

  // ─── UNIT 2: SURVIVAL OPERATIONS ─────────────────────────────
  {
    id: 'l004',
    unitId: 'u002',
    title: 'Lesson 4: High-Frequency Verbs',
    subtitle: 'The 15 Verbs That Power 80% of Conversation',
    objective: 'Deploy the most common Spanish verbs fluently in present tense.',
    ilrLevel: 0,
    estimatedMinutes: 35,
    vocabulary: ['v032', 'v033', 'v034', 'v035', 'v036', 'v037', 'v038', 'v039', 'v040', 'v041', 'v042', 'v043', 'v044'],
    drills: ['d003', 'd004'],
    dialogues: [],
    culturalBriefing: 'FSI research shows that just 500 words and 15 core verbs allow you to communicate about 90% of everyday needs. Master these first — quantity of vocabulary matters less than fluency with high-frequency words.',
    completionXP: 150,
  },
  {
    id: 'l005',
    unitId: 'u002',
    title: 'Lesson 5: Emergency Protocols',
    subtitle: 'Critical Phrases That Could Save Your Life',
    objective: 'Handle emergency situations: theft, medical, lost documents. Request consular assistance.',
    ilrLevel: 0,
    estimatedMinutes: 20,
    vocabulary: ['v080', 'v081', 'v082', 'v083', 'v084', 'v085', 'v086', 'v087', 'v088'],
    drills: [],
    dialogues: ['dia003'],
    culturalBriefing: 'Operational priority: Know these phrases before anything else. If you can only learn 10 phrases, make them emergency phrases. Knowing "Soy ciudadano americano" (I am an American citizen) and "Quiero hablar con el cónsul" (I want to speak with the consul) are rights, not requests.',
    completionXP: 120,
  },
  {
    id: 'l006',
    unitId: 'u002',
    title: 'Lesson 6: Numbers & Navigation',
    subtitle: 'Transactional Language for Operational Mobility',
    objective: 'Use numbers for prices, addresses, phone numbers, times, and quantities.',
    ilrLevel: 0,
    estimatedMinutes: 25,
    vocabulary: ['v050', 'v051', 'v052', 'v053', 'v054', 'v055', 'v056', 'v057', 'v058', 'v059', 'v060', 'v061', 'v062'],
    drills: [],
    dialogues: ['dia002'],
    culturalBriefing: 'Numbers are critical for any transaction: money, time, addresses. In Spanish, note that numbers agree with gender: "un libro" (one book) vs "una silla" (one chair). Phone numbers are often said in pairs in Latin America.',
    completionXP: 100,
  },

  // ─── UNIT 3: WORKING PROFICIENCY ─────────────────────────────
  {
    id: 'l007',
    unitId: 'u003',
    title: 'Lesson 7: The Past — Preterite Tense',
    subtitle: 'Reporting Completed Events',
    objective: 'Describe and report past events accurately using the preterite tense.',
    ilrLevel: 1,
    estimatedMinutes: 40,
    vocabulary: ['v100', 'v101', 'v102', 'v103', 'v104', 'v105', 'v106', 'v107'],
    drills: ['d006'],
    dialogues: [],
    culturalBriefing: 'The preterite is used for reporting — briefing someone on what happened. "Ayer habló con el ministro" (Yesterday he spoke with the minister). This is essential for debriefings and event reporting.',
    completionXP: 175,
  },
  {
    id: 'l008',
    unitId: 'u003',
    title: 'Lesson 8: Professional Context',
    subtitle: 'Work, Business & Formal Settings',
    objective: 'Navigate professional settings: meetings, reports, introductions, negotiations.',
    ilrLevel: 1,
    estimatedMinutes: 35,
    vocabulary: ['v110', 'v111', 'v112', 'v113', 'v114', 'v115', 'v116', 'v117', 'v118'],
    drills: ['d008'],
    dialogues: ['dia004'],
    culturalBriefing: 'Professional Spanish has distinct formality markers. Business relationships in Latin America are built on personal trust ("confianza"). Investing time in social conversation before business is not wasted time — it is essential groundwork.',
    completionXP: 175,
  },

  // ─── UNIT 4: PROFESSIONAL OPERATIONS ─────────────────────────
  {
    id: 'l009',
    unitId: 'u004',
    title: 'Lesson 9: Subjunctive — Advanced Expression',
    subtitle: 'Expressing Doubt, Desire & Recommendation',
    objective: 'Use the subjunctive mood to express wants, doubts, and recommendations with nuance.',
    ilrLevel: 2,
    estimatedMinutes: 45,
    vocabulary: ['v220', 'v221', 'v222', 'v223', 'v224', 'v225', 'v226', 'v227'],
    drills: ['d007'],
    dialogues: [],
    culturalBriefing: 'The subjunctive is the mood of indirect communication — expressing what you want others to do without commanding. "Quisiera que usted considerara..." (I would like you to consider...) This indirect style is preferred in formal Latin American communication.',
    completionXP: 200,
  },
  {
    id: 'l010',
    unitId: 'u004',
    title: 'Lesson 10: Diplomatic Navigation',
    subtitle: 'Overcoming Obstacles with Language',
    objective: 'Use strategic language to navigate bureaucratic and political obstacles diplomatically.',
    ilrLevel: 2,
    estimatedMinutes: 40,
    vocabulary: ['v200', 'v201', 'v202', 'v203', 'v204', 'v205', 'v240', 'v241', 'v242', 'v243', 'v244'],
    drills: ['d008'],
    dialogues: ['dia005'],
    culturalBriefing: 'Operational context: Language is your primary tool for navigating complex environments. The ability to reframe, find face-saving solutions for both parties, and communicate respect while maintaining objectives is the mark of ILR 3 proficiency.',
    completionXP: 250,
  },
];

// ============================================================
// Units
// ============================================================

export const spanishUnits: Unit[] = [
  {
    id: 'u001',
    title: 'Unit 1: Foundations',
    subtitle: 'First Contact & Core Grammar',
    theme: 'Establishing communication from zero',
    ilrLevel: 0,
    lessons: ['l001', 'l002', 'l003'],
    icon: '🔰',
    color: '#3498DB',
  },
  {
    id: 'u002',
    title: 'Unit 2: Survival Operations',
    subtitle: 'Navigate Any Situation Safely',
    theme: 'Operational survival vocabulary',
    ilrLevel: 0,
    lessons: ['l004', 'l005', 'l006'],
    icon: '🛡️',
    color: '#E74C3C',
  },
  {
    id: 'u003',
    title: 'Unit 3: Working Proficiency',
    subtitle: 'The Past & Professional World',
    theme: 'Professional communication basics',
    ilrLevel: 1,
    lessons: ['l007', 'l008'],
    icon: '💼',
    color: '#2ECC71',
  },
  {
    id: 'u004',
    title: 'Unit 4: Professional Operations',
    subtitle: 'Advanced Grammar & Diplomacy',
    theme: 'Nuanced communication for complex situations',
    ilrLevel: 2,
    lessons: ['l009', 'l010'],
    icon: '⚡',
    color: '#9B59B6',
  },
];

export const getLessonById = (id: string): Lesson | undefined =>
  spanishLessons.find(l => l.id === id);

export const getUnitById = (id: string): Unit | undefined =>
  spanishUnits.find(u => u.id === id);

export const getLessonsForUnit = (unitId: string): Lesson[] =>
  spanishLessons.filter(l => l.unitId === unitId);
