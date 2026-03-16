import { PatternDrill } from '../types';

// ============================================================
// FSI Pattern Drills - Spanish
// Based on Foreign Service Institute "Substitution-Correlation Drills"
// These are the core of CIA/FSI language training methodology
// ============================================================

export const spanishDrills: PatternDrill[] = [

  // ─── UNIT 1: SER vs ESTAR ────────────────────────────────────
  {
    id: 'd001',
    title: 'SER: Permanent Identity',
    instruction: 'Use SER to describe permanent characteristics. Substitute the underlined element.',
    pattern: '[Subject] + ES/SOY/ERES + [identity/characteristic]',
    patternExplanation: 'SER describes WHO or WHAT something is: nationality, profession, physical traits, relationships. Think of it as the "essence" of something.',
    ilrLevel: 0,
    exercises: [
      { id: 'd001e1', prompt: 'Yo ___ americano.', answer: 'Yo soy americano.', hint: 'First person singular of SER', audioPrompt: 'Yo soy americano' },
      { id: 'd001e2', prompt: 'Él ___ médico.', answer: 'Él es médico.', hint: 'Third person singular of SER', audioPrompt: 'Él es médico' },
      { id: 'd001e3', prompt: 'Nosotros ___ diplomáticos.', answer: 'Nosotros somos diplomáticos.', audioPrompt: 'Nosotros somos diplomáticos' },
      { id: 'd001e4', prompt: 'Ellos ___ de México.', answer: 'Ellos son de México.', hint: 'Origin uses SER', audioPrompt: 'Ellos son de México' },
      { id: 'd001e5', prompt: 'Usted ___ el director.', answer: 'Usted es el director.', audioPrompt: 'Usted es el director' },
    ],
  },

  {
    id: 'd002',
    title: 'ESTAR: Location & Temporary States',
    instruction: 'Use ESTAR for location and temporary conditions.',
    pattern: '[Subject] + ESTÁ/ESTOY/ESTÁS + [location/condition]',
    patternExplanation: 'ESTAR describes WHERE something is or HOW it feels at a given moment. Remember: location ALWAYS uses ESTAR, even for permanent buildings.',
    ilrLevel: 0,
    exercises: [
      { id: 'd002e1', prompt: '¿Dónde ___ el hotel?', answer: '¿Dónde está el hotel?', audioPrompt: '¿Dónde está el hotel?' },
      { id: 'd002e2', prompt: 'Yo ___ en Madrid.', answer: 'Yo estoy en Madrid.', audioPrompt: 'Yo estoy en Madrid' },
      { id: 'd002e3', prompt: 'Ella ___ cansada.', answer: 'Ella está cansada.', hint: 'Tiredness is temporary', audioPrompt: 'Ella está cansada' },
      { id: 'd002e4', prompt: 'La embajada ___ en el centro.', answer: 'La embajada está en el centro.', audioPrompt: 'La embajada está en el centro' },
      { id: 'd002e5', prompt: 'Nosotros ___ listos.', answer: 'Nosotros estamos listos.', audioPrompt: 'Nosotros estamos listos' },
    ],
  },

  // ─── UNIT 2: PRESENT TENSE PATTERN DRILLS ────────────────────
  {
    id: 'd003',
    title: 'Present Tense: -AR Verbs',
    instruction: 'Conjugate the verb in parentheses for the given subject.',
    pattern: '[Subject] + [verb stem] + -o/-as/-a/-amos/-áis/-an',
    patternExplanation: '-AR verbs are the most common in Spanish. The stem stays the same; only the ending changes based on who is doing the action.',
    ilrLevel: 0,
    exercises: [
      { id: 'd003e1', prompt: 'Yo (hablar) ___ español.', answer: 'Yo hablo español.', audioPrompt: 'Yo hablo español' },
      { id: 'd003e2', prompt: 'Usted (trabajar) ___ aquí.', answer: 'Usted trabaja aquí.', audioPrompt: 'Usted trabaja aquí' },
      { id: 'd003e3', prompt: 'Ellos (necesitar) ___ ayuda.', answer: 'Ellos necesitan ayuda.', audioPrompt: 'Ellos necesitan ayuda' },
      { id: 'd003e4', prompt: 'Nosotros (buscar) ___ el hotel.', answer: 'Nosotros buscamos el hotel.', audioPrompt: 'Nosotros buscamos el hotel' },
      { id: 'd003e5', prompt: '¿Usted (llamar) ___ a la embajada?', answer: '¿Usted llama a la embajada?', audioPrompt: '¿Usted llama a la embajada?' },
    ],
  },

  {
    id: 'd004',
    title: 'Present Tense: Irregular Verbs (QUERER, PODER)',
    instruction: 'These "boot verbs" have stem changes. Practice the pattern.',
    pattern: 'QUERER: quiero/quieres/quiere/queremos/queréis/quieren',
    patternExplanation: 'Stem-changing verbs (e→ie, o→ue) change in all forms EXCEPT nosotros and vosotros — forming a "boot" shape. These are extremely high-frequency verbs.',
    ilrLevel: 1,
    exercises: [
      { id: 'd004e1', prompt: 'Yo ___ (querer) información.', answer: 'Yo quiero información.', audioPrompt: 'Yo quiero información' },
      { id: 'd004e2', prompt: '¿Usted ___ (poder) ayudarme?', answer: '¿Usted puede ayudarme?', audioPrompt: '¿Usted puede ayudarme?' },
      { id: 'd004e3', prompt: 'Ellos no ___ (poder) entrar.', answer: 'Ellos no pueden entrar.', audioPrompt: 'Ellos no pueden entrar' },
      { id: 'd004e4', prompt: '¿Qué ___ (querer) usted hacer?', answer: '¿Qué quiere usted hacer?', audioPrompt: '¿Qué quiere usted hacer?' },
      { id: 'd004e5', prompt: 'Nosotros ___ (querer) hablar con el director.', answer: 'Nosotros queremos hablar con el director.', audioPrompt: 'Nosotros queremos hablar con el director' },
    ],
  },

  // ─── UNIT 3: INTERROGATIVE PATTERNS ──────────────────────────
  {
    id: 'd005',
    title: 'Information Questions: The 5 W\'s',
    instruction: 'Form questions using the interrogative words. Critical for gathering information.',
    pattern: '¿[Interrogative] + [verb] + [subject]?',
    patternExplanation: 'In Spanish, the subject comes AFTER the verb in questions. The interrogative word carries an accent mark. These are the foundation of information gathering.',
    ilrLevel: 0,
    exercises: [
      { id: 'd005e1', prompt: 'Ask "Where is the embassy?"', answer: '¿Dónde está la embajada?', audioPrompt: '¿Dónde está la embajada?' },
      { id: 'd005e2', prompt: 'Ask "Who is the director?"', answer: '¿Quién es el director?', audioPrompt: '¿Quién es el director?' },
      { id: 'd005e3', prompt: 'Ask "When is the meeting?"', answer: '¿Cuándo es la reunión?', audioPrompt: '¿Cuándo es la reunión?' },
      { id: 'd005e4', prompt: 'Ask "How much does it cost?"', answer: '¿Cuánto cuesta?', audioPrompt: '¿Cuánto cuesta?' },
      { id: 'd005e5', prompt: 'Ask "Why are they here?"', answer: '¿Por qué están aquí?', audioPrompt: '¿Por qué están aquí?' },
    ],
  },

  // ─── UNIT 4: PAST TENSE (PRETERITE) ──────────────────────────
  {
    id: 'd006',
    title: 'Preterite: Completed Past Actions',
    instruction: 'Use the preterite for completed, specific past actions.',
    pattern: '[Subject] + [preterite form] + [complement]',
    patternExplanation: 'The preterite describes actions with a clear beginning and end. "Yesterday I spoke" = action is done. Essential for reporting past events.',
    ilrLevel: 1,
    exercises: [
      { id: 'd006e1', prompt: 'Yo (hablar) ___ con el cónsul ayer.', answer: 'Yo hablé con el cónsul ayer.', audioPrompt: 'Yo hablé con el cónsul ayer' },
      { id: 'd006e2', prompt: 'Ellos (llegar) ___ tarde.', answer: 'Ellos llegaron tarde.', audioPrompt: 'Ellos llegaron tarde' },
      { id: 'd006e3', prompt: '¿Usted (ver) ___ el documento?', answer: '¿Usted vio el documento?', hint: 'VER is irregular in preterite: vi/viste/vio/vimos', audioPrompt: '¿Usted vio el documento?' },
      { id: 'd006e4', prompt: 'Nosotros (ir) ___ a la reunión.', answer: 'Nosotros fuimos a la reunión.', hint: 'IR preterite is irregular: fui/fuiste/fue/fuimos', audioPrompt: 'Nosotros fuimos a la reunión' },
      { id: 'd006e5', prompt: 'Él (decir) ___ la verdad.', answer: 'Él dijo la verdad.', hint: 'DECIR preterite: dije/dijiste/dijo/dijimos', audioPrompt: 'Él dijo la verdad' },
    ],
  },

  // ─── UNIT 5: SUBJUNCTIVE ─────────────────────────────────────
  {
    id: 'd007',
    title: 'Present Subjunctive: Doubt & Desire',
    instruction: 'Use the subjunctive after expressions of wanting, needing, doubting, or recommending.',
    pattern: 'Quiero que + [subject] + [subjunctive verb]',
    patternExplanation: 'The subjunctive is used when there are TWO subjects and the first expresses desire, doubt, emotion, or recommendation about what the second does. It signals subjectivity.',
    ilrLevel: 2,
    exercises: [
      { id: 'd007e1', prompt: 'Quiero que usted ___ (venir) mañana.', answer: 'Quiero que usted venga mañana.', audioPrompt: 'Quiero que usted venga mañana' },
      { id: 'd007e2', prompt: 'Es necesario que nosotros ___ (hablar) con el ministro.', answer: 'Es necesario que nosotros hablemos con el ministro.', audioPrompt: 'Es necesario que nosotros hablemos con el ministro' },
      { id: 'd007e3', prompt: 'Recomiendo que usted ___ (leer) el informe.', answer: 'Recomiendo que usted lea el informe.', audioPrompt: 'Recomiendo que usted lea el informe' },
      { id: 'd007e4', prompt: 'Dudo que ellos ___ (saber) la verdad.', answer: 'Dudo que ellos sepan la verdad.', audioPrompt: 'Dudo que ellos sepan la verdad' },
      { id: 'd007e5', prompt: 'Es importante que el gobierno ___ (actuar) rápido.', answer: 'Es importante que el gobierno actúe rápido.', audioPrompt: 'Es importante que el gobierno actúe rápido' },
    ],
  },

  // ─── UNIT 6: CONDITIONAL ─────────────────────────────────────
  {
    id: 'd008',
    title: 'Conditional: Polite Requests & Hypotheticals',
    instruction: 'Use the conditional for polite requests and hypothetical situations.',
    pattern: '[Subject] + [conditional form] + [complement]',
    patternExplanation: 'The conditional (-ía ending) makes statements more polite and hypothetical. "I would like..." is much more professional than "I want..."  Essential for diplomatic and professional contexts.',
    ilrLevel: 2,
    exercises: [
      { id: 'd008e1', prompt: 'Make "quiero hablar" more polite.', answer: 'Quisiera hablar.', hint: 'Quisiera = I would like (very polite form)', audioPrompt: 'Quisiera hablar' },
      { id: 'd008e2', prompt: 'Yo (poder) ___ enviar el informe.', answer: 'Yo podría enviar el informe.', audioPrompt: 'Yo podría enviar el informe' },
      { id: 'd008e3', prompt: '¿Usted ___ (poder) ayudarme? (conditional)', answer: '¿Usted podría ayudarme?', audioPrompt: '¿Usted podría ayudarme?' },
      { id: 'd008e4', prompt: 'En ese caso, nosotros (deber) ___ negociar.', answer: 'En ese caso, nosotros deberíamos negociar.', audioPrompt: 'En ese caso, nosotros deberíamos negociar' },
      { id: 'd008e5', prompt: 'Ellos (estar) ___ de acuerdo si...', answer: 'Ellos estarían de acuerdo si...', audioPrompt: 'Ellos estarían de acuerdo si' },
    ],
  },
];

export const getDrillById = (id: string): PatternDrill | undefined =>
  spanishDrills.find(d => d.id === id);

export const getDrillsByLevel = (maxLevel: number): PatternDrill[] =>
  spanishDrills.filter(d => d.ilrLevel <= maxLevel);
