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

  // ─── UNIT 7: FOOD & ORDERING ──────────────────────────────────
  {
    id: 'd009',
    title: 'Ordering Food & Drinks',
    instruction: 'Practice ordering at a restaurant. Use polite, professional language.',
    pattern: 'Quisiera / Me trae / ¿Qué recomienda? + [food/drink]',
    patternExplanation: 'Ordering food seems simple but requires specific vocabulary and register. "Quisiera" (I would like) is the polished way to order. Knowing how to handle a menu is essential in any field setting.',
    ilrLevel: 0,
    exercises: [
      { id: 'd009e1', prompt: 'Order "the chicken with rice" politely.', answer: 'Quisiera el pollo con arroz.', hint: 'Use quisiera for polite ordering', audioPrompt: 'Quisiera el pollo con arroz' },
      { id: 'd009e2', prompt: 'Ask "What do you recommend?"', answer: '¿Qué recomienda usted?', audioPrompt: '¿Qué recomienda usted?' },
      { id: 'd009e3', prompt: 'Ask for "a coffee and the bill".', answer: 'Un café y la cuenta, por favor.', audioPrompt: 'Un café y la cuenta, por favor' },
      { id: 'd009e4', prompt: 'Say "I am allergic to shellfish."', answer: 'Soy alérgico a los mariscos.', hint: 'Critical health information — know how to say this', audioPrompt: 'Soy alérgico a los mariscos' },
      { id: 'd009e5', prompt: 'Ask "Is this dish spicy?"', answer: '¿Este plato es picante?', audioPrompt: '¿Este plato es picante?' },
    ],
  },

  // ─── UNIT 8: FUTURE TENSE ────────────────────────────────────
  {
    id: 'd010',
    title: 'Future Tense: Plans & Predictions',
    instruction: 'Use IR + A + infinitive for near future, and the simple future (-é/-ás/-á) for predictions.',
    pattern: 'Voy a [infinitive] / [Subject] + [verb stem] + -é/-ás/-á/-emos/-éis/-án',
    patternExplanation: 'Spanish has two future forms: IR + A + infinitive (near future, planned) and the simple future (predictions, formal promises). Master both — they signal different levels of certainty and commitment.',
    ilrLevel: 1,
    exercises: [
      { id: 'd010e1', prompt: 'Say "I am going to call the embassy tomorrow."', answer: 'Voy a llamar a la embajada mañana.', audioPrompt: 'Voy a llamar a la embajada mañana' },
      { id: 'd010e2', prompt: 'Say "We will arrive on Monday." (simple future)', answer: 'Llegaremos el lunes.', hint: 'LLEGAR → llegaré/llegarás/llegará/llegaremos', audioPrompt: 'Llegaremos el lunes' },
      { id: 'd010e3', prompt: 'Say "They are going to sign the agreement."', answer: 'Van a firmar el acuerdo.', audioPrompt: 'Van a firmar el acuerdo' },
      { id: 'd010e4', prompt: 'Say "The meeting will be at ten." (simple future)', answer: 'La reunión será a las diez.', hint: 'SER → seré/serás/será/seremos', audioPrompt: 'La reunión será a las diez' },
      { id: 'd010e5', prompt: 'Ask "What are you going to do?"', answer: '¿Qué va a hacer usted?', audioPrompt: '¿Qué va a hacer usted?' },
    ],
  },

  // ─── UNIT 9: COMMANDS (IMPERATIVE) ───────────────────────────
  {
    id: 'd011',
    title: 'Imperative Mood: Giving Instructions',
    instruction: 'Form commands using the imperative. Know formal (usted) vs informal (tú) commands.',
    pattern: 'USTED: verb stem + -e (AR) / -a (ER/IR) | TÚ: third-person singular present',
    patternExplanation: 'Commands are essential for directing action. Formal commands (usted) are used with strangers and superiors. Informal (tú) with close contacts. Negative commands use the subjunctive form.',
    ilrLevel: 1,
    exercises: [
      { id: 'd011e1', prompt: 'Tell someone (formal) to "wait here."', answer: 'Espere aquí.', hint: 'ESPERAR formal command: espere', audioPrompt: 'Espere aquí' },
      { id: 'd011e2', prompt: 'Tell someone (formal) to "speak more slowly."', answer: 'Hable más despacio.', audioPrompt: 'Hable más despacio' },
      { id: 'd011e3', prompt: 'Tell someone (formal) to "follow me."', answer: 'Sígame.', hint: 'SEGUIR formal command: siga + me', audioPrompt: 'Sígame' },
      { id: 'd011e4', prompt: 'Tell someone (formal) "don\'t worry."', answer: 'No se preocupe.', hint: 'Negative formal: no + subjunctive form', audioPrompt: 'No se preocupe' },
      { id: 'd011e5', prompt: 'Tell someone (formal) to "sign here."', answer: 'Firme aquí.', audioPrompt: 'Firme aquí' },
    ],
  },

  // ─── UNIT 10: REFLEXIVE VERBS ─────────────────────────────────
  {
    id: 'd012',
    title: 'Reflexive Verbs: Daily Routine',
    instruction: 'Reflexive verbs describe actions done to oneself. The reflexive pronoun matches the subject.',
    pattern: '[Reflexive pronoun] + [reflexive verb] — me/te/se/nos/os/se',
    patternExplanation: 'Many daily routine verbs are reflexive: levantarse, ducharse, vestirse, llamarse. The pronoun (me/te/se) shows the action reflects back on the subject. This is a very common pattern in Spanish.',
    ilrLevel: 1,
    exercises: [
      { id: 'd012e1', prompt: 'Say "My name is Carlos." (using llamarse)', answer: 'Me llamo Carlos.', hint: 'LLAMARSE = to call oneself; me llamo = I call myself', audioPrompt: 'Me llamo Carlos' },
      { id: 'd012e2', prompt: 'Say "I wake up at six."', answer: 'Me despierto a las seis.', audioPrompt: 'Me despierto a las seis' },
      { id: 'd012e3', prompt: 'Say "He sits down."', answer: 'Él se sienta.', audioPrompt: 'Él se sienta' },
      { id: 'd012e4', prompt: 'Say "We get ready quickly."', answer: 'Nos preparamos rápido.', audioPrompt: 'Nos preparamos rápido' },
      { id: 'd012e5', prompt: 'Ask "What is your name?" (formal)', answer: '¿Cómo se llama usted?', audioPrompt: '¿Cómo se llama usted?' },
    ],
  },

  // ─── UNIT 11: ADJECTIVE AGREEMENT ────────────────────────────
  {
    id: 'd013',
    title: 'Adjective Agreement: Gender & Number',
    instruction: 'Spanish adjectives agree with the noun they describe in gender (masculine/feminine) and number (singular/plural).',
    pattern: '[Adjective-o/a/os/as] matches [noun gender/number]',
    patternExplanation: 'Every adjective must agree with its noun. "Un hombre alto" → "Una mujer alta" → "Dos hombres altos." This is automatic for native speakers — practice until it becomes instinct.',
    ilrLevel: 1,
    exercises: [
      { id: 'd013e1', prompt: 'Describe "a tall woman" (alta/alto)', answer: 'una mujer alta', audioPrompt: 'una mujer alta' },
      { id: 'd013e2', prompt: 'Describe "the important documents" (importante)', answer: 'los documentos importantes', hint: 'Adjectives ending in -e only add -s for plural', audioPrompt: 'los documentos importantes' },
      { id: 'd013e3', prompt: 'Describe "a good trip" (bueno/buena)', answer: 'un buen viaje', hint: 'BUENO shortens to BUEN before masculine singular nouns', audioPrompt: 'un buen viaje' },
      { id: 'd013e4', prompt: 'Describe "the new employees" (nuevo)', answer: 'los empleados nuevos', audioPrompt: 'los empleados nuevos' },
      { id: 'd013e5', prompt: 'Describe "a difficult situation" (difícil)', answer: 'una situación difícil', audioPrompt: 'una situación difícil' },
    ],
  },

  // ─── UNIT 12: POR vs PARA ─────────────────────────────────────
  {
    id: 'd014',
    title: 'POR vs PARA: The Critical Preposition Pair',
    instruction: 'Choose correctly between POR (cause/means/duration) and PARA (purpose/destination/deadline).',
    pattern: 'PARA = purpose/destination/deadline | POR = cause/means/exchange/duration',
    patternExplanation: 'POR and PARA are the most confused preposition pair in Spanish. PARA points forward (goal, destination, purpose). POR looks backward or laterally (cause, agent, exchange, period). One mnemonic: PARA = "purpose of" / POR = "because of."',
    ilrLevel: 2,
    exercises: [
      { id: 'd014e1', prompt: '"I study Spanish ___ work." (purpose)', answer: 'Estudio español para el trabajo.', hint: 'Purpose/goal → PARA', audioPrompt: 'Estudio español para el trabajo' },
      { id: 'd014e2', prompt: '"Thank you ___ your help." (because of)', answer: 'Gracias por su ayuda.', hint: 'Gratitude reason → POR', audioPrompt: 'Gracias por su ayuda' },
      { id: 'd014e3', prompt: '"The document is ___ the director." (destination/recipient)', answer: 'El documento es para el director.', audioPrompt: 'El documento es para el director' },
      { id: 'd014e4', prompt: '"They traveled ___ plane." (means of transport)', answer: 'Viajaron por avión.', hint: 'Means/method → POR', audioPrompt: 'Viajaron por avión' },
      { id: 'd014e5', prompt: '"I need this ___ Monday." (deadline)', answer: 'Necesito esto para el lunes.', hint: 'Deadline → PARA', audioPrompt: 'Necesito esto para el lunes' },
    ],
  },
];

  // ─── UNIT 10: COLORS & ADJECTIVE AGREEMENT ─────────────────────
  {
    id: 'd015',
    title: 'Adjective Gender Agreement',
    instruction: 'Make the adjective agree with the noun in gender (masculine/feminine).',
    pattern: '[Noun] + [adjective matching gender: -o/-a or invariable]',
    patternExplanation: 'Most Spanish adjectives change ending to match noun gender. -o = masculine, -a = feminine. Some adjectives (azul, verde, grande) are the same for both genders. Adjectives follow the noun in Spanish.',
    ilrLevel: 0,
    exercises: [
      { id: 'd015e1', prompt: '"The red car" — la/el carro ___', answer: 'el carro rojo', hint: 'Carro = masculine → rojo', audioPrompt: 'el carro rojo' },
      { id: 'd015e2', prompt: '"The white house" — la/el casa ___', answer: 'la casa blanca', hint: 'Casa = feminine → blanca', audioPrompt: 'la casa blanca' },
      { id: 'd015e3', prompt: '"The blue shirt" — la/el camisa ___', answer: 'la camisa azul', hint: 'Azul is invariable — same for masculine and feminine', audioPrompt: 'la camisa azul' },
      { id: 'd015e4', prompt: '"The black shoes" — los/las zapatos ___', answer: 'los zapatos negros', hint: 'Zapatos = masculine plural → negros', audioPrompt: 'los zapatos negros' },
      { id: 'd015e5', prompt: '"The yellow flowers" — las flores ___', answer: 'las flores amarillas', hint: 'Flores = feminine plural → amarillas', audioPrompt: 'las flores amarillas' },
    ],
  },
  // ─── UNIT 10: GUSTAR + INFINITIVE ─────────────────────────────
  {
    id: 'd016',
    title: 'GUSTAR: Expressing Likes & Hobbies',
    instruction: 'Use the correct form of GUSTAR to express likes and dislikes.',
    pattern: '(A mí/ti/él) + [indirect object pronoun] + GUSTA/GUSTAN + [noun/infinitive]',
    patternExplanation: 'GUSTAR works in reverse: the thing liked is the subject. Use GUSTA + singular noun/infinitive, GUSTAN + plural noun. Indirect object pronouns: me (I), te (you), le (he/she), nos (we), les (they).',
    ilrLevel: 0,
    exercises: [
      { id: 'd016e1', prompt: '"I like soccer."', answer: 'Me gusta el fútbol.', hint: 'Fútbol = singular → gusta', audioPrompt: 'Me gusta el fútbol' },
      { id: 'd016e2', prompt: '"She likes to travel."', answer: 'Le gusta viajar.', hint: 'Infinitive → always gusta (singular)', audioPrompt: 'Le gusta viajar' },
      { id: 'd016e3', prompt: '"We like the weekends."', answer: 'Nos gustan los fines de semana.', hint: 'Fines de semana = plural → gustan', audioPrompt: 'Nos gustan los fines de semana' },
      { id: 'd016e4', prompt: '"Do you like to dance?"', answer: '¿Te gusta bailar?', hint: 'Use te for "you" (tú)', audioPrompt: '¿Te gusta bailar?' },
      { id: 'd016e5', prompt: '"They like the movies."', answer: 'Les gustan las películas.', hint: 'Películas = plural → gustan', audioPrompt: 'Les gustan las películas' },
    ],
  },
];

export const getDrillById = (id: string): PatternDrill | undefined =>
  spanishDrills.find(d => d.id === id);

export const getDrillsByLevel = (maxLevel: number): PatternDrill[] =>
  spanishDrills.filter(d => d.ilrLevel <= maxLevel);
