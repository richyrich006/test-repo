import { VocabCard } from '../types';

// ============================================================
// Spanish Vocabulary - CIA/FSI Method
// Organized by operational priority and ILR level
// FSI source: based on Programmatic Course in Spanish
// ============================================================

export const spanishVocabulary: VocabCard[] = [

  // ─── ILR 0→1: SURVIVAL VOCABULARY ───────────────────────────

  // Greetings & Basic Interaction
  { id: 'v001', spanish: 'Hola', english: 'Hello', phonetic: 'OH-lah', category: 'greetings', ilrLevel: 0, exampleSentence: '¡Hola! ¿Cómo está usted?', exampleTranslation: 'Hello! How are you?' },
  { id: 'v002', spanish: 'Buenos días', english: 'Good morning', phonetic: 'BWEH-nohs DEE-ahs', category: 'greetings', ilrLevel: 0, exampleSentence: 'Buenos días, señor García.', exampleTranslation: 'Good morning, Mr. García.' },
  { id: 'v003', spanish: 'Buenas tardes', english: 'Good afternoon', phonetic: 'BWEH-nahs TAR-dehs', category: 'greetings', ilrLevel: 0 },
  { id: 'v004', spanish: 'Buenas noches', english: 'Good evening / Good night', phonetic: 'BWEH-nahs NOH-chehs', category: 'greetings', ilrLevel: 0 },
  { id: 'v005', spanish: 'Adiós', english: 'Goodbye', phonetic: 'ah-DYOHS', category: 'greetings', ilrLevel: 0 },
  { id: 'v006', spanish: 'Hasta luego', english: 'See you later', phonetic: 'AHS-tah LWEH-goh', category: 'greetings', ilrLevel: 0 },
  { id: 'v007', spanish: 'Por favor', english: 'Please', phonetic: 'por fah-BOR', category: 'greetings', ilrLevel: 0 },
  { id: 'v008', spanish: 'Gracias', english: 'Thank you', phonetic: 'GRAH-syahs', category: 'greetings', ilrLevel: 0 },
  { id: 'v009', spanish: 'De nada', english: "You're welcome", phonetic: 'deh NAH-dah', category: 'greetings', ilrLevel: 0 },
  { id: 'v010', spanish: 'Perdón / Disculpe', english: 'Excuse me / Sorry', phonetic: 'pehr-DOHN / dees-KOOL-peh', category: 'greetings', ilrLevel: 0 },
  { id: 'v011', spanish: 'Sí', english: 'Yes', phonetic: 'see', category: 'greetings', ilrLevel: 0 },
  { id: 'v012', spanish: 'No', english: 'No', phonetic: 'noh', category: 'greetings', ilrLevel: 0 },
  { id: 'v013', spanish: 'Me llamo...', english: 'My name is...', phonetic: 'meh YAH-moh', category: 'greetings', ilrLevel: 0, exampleSentence: 'Me llamo Carlos.', exampleTranslation: 'My name is Carlos.' },
  { id: 'v014', spanish: 'Mucho gusto', english: 'Nice to meet you', phonetic: 'MOO-choh GOOS-toh', category: 'greetings', ilrLevel: 0 },
  { id: 'v015', spanish: '¿Cómo está usted?', english: 'How are you? (formal)', phonetic: 'KOH-moh ehs-TAH oos-TEHD', category: 'greetings', ilrLevel: 0 },

  // Interrogatives - CIA priority (information gathering)
  { id: 'v020', spanish: '¿Qué?', english: 'What?', phonetic: 'keh', category: 'interrogatives', ilrLevel: 0 },
  { id: 'v021', spanish: '¿Quién?', english: 'Who?', phonetic: 'kyehn', category: 'interrogatives', ilrLevel: 0 },
  { id: 'v022', spanish: '¿Dónde?', english: 'Where?', phonetic: 'DOHN-deh', category: 'interrogatives', ilrLevel: 0 },
  { id: 'v023', spanish: '¿Cuándo?', english: 'When?', phonetic: 'KWAHN-doh', category: 'interrogatives', ilrLevel: 0 },
  { id: 'v024', spanish: '¿Cómo?', english: 'How?', phonetic: 'KOH-moh', category: 'interrogatives', ilrLevel: 0 },
  { id: 'v025', spanish: '¿Por qué?', english: 'Why?', phonetic: 'por KEH', category: 'interrogatives', ilrLevel: 0 },
  { id: 'v026', spanish: '¿Cuánto?', english: 'How much?', phonetic: 'KWAHN-toh', category: 'interrogatives', ilrLevel: 0 },
  { id: 'v027', spanish: '¿Cuántos?', english: 'How many?', phonetic: 'KWAHN-tohs', category: 'interrogatives', ilrLevel: 0 },

  // Core Verbs - FSI "high frequency" verbs
  { id: 'v030', spanish: 'ser', english: 'to be (permanent)', phonetic: 'sehr', category: 'verbs_core', ilrLevel: 0, notes: 'Used for permanent states: identity, origin, characteristics. NOT for location.' },
  { id: 'v031', spanish: 'estar', english: 'to be (temporary)', phonetic: 'ehs-TAR', category: 'verbs_core', ilrLevel: 0, notes: 'Used for location, emotions, temporary states.' },
  { id: 'v032', spanish: 'tener', english: 'to have', phonetic: 'teh-NEHR', category: 'verbs_core', ilrLevel: 0 },
  { id: 'v033', spanish: 'ir', english: 'to go', phonetic: 'eer', category: 'verbs_core', ilrLevel: 0, exampleSentence: '¿Adónde va usted?', exampleTranslation: 'Where are you going?' },
  { id: 'v034', spanish: 'querer', english: 'to want', phonetic: 'keh-REHR', category: 'verbs_core', ilrLevel: 0 },
  { id: 'v035', spanish: 'poder', english: 'to be able to / can', phonetic: 'poh-DEHR', category: 'verbs_core', ilrLevel: 0 },
  { id: 'v036', spanish: 'saber', english: 'to know (facts)', phonetic: 'sah-BEHR', category: 'verbs_core', ilrLevel: 0 },
  { id: 'v037', spanish: 'hablar', english: 'to speak', phonetic: 'ah-BLAR', category: 'verbs_core', ilrLevel: 0, exampleSentence: '¿Habla usted inglés?', exampleTranslation: 'Do you speak English?' },
  { id: 'v038', spanish: 'necesitar', english: 'to need', phonetic: 'neh-seh-see-TAR', category: 'verbs_core', ilrLevel: 0 },
  { id: 'v039', spanish: 'venir', english: 'to come', phonetic: 'beh-NEER', category: 'verbs_core', ilrLevel: 0 },
  { id: 'v040', spanish: 'hacer', english: 'to do / make', phonetic: 'ah-SEHR', category: 'verbs_core', ilrLevel: 0 },
  { id: 'v041', spanish: 'dar', english: 'to give', phonetic: 'dar', category: 'verbs_core', ilrLevel: 0 },
  { id: 'v042', spanish: 'ver', english: 'to see', phonetic: 'behr', category: 'verbs_core', ilrLevel: 0 },
  { id: 'v043', spanish: 'decir', english: 'to say / tell', phonetic: 'deh-SEER', category: 'verbs_core', ilrLevel: 0 },
  { id: 'v044', spanish: 'llamar', english: 'to call', phonetic: 'yah-MAR', category: 'verbs_core', ilrLevel: 0 },

  // Numbers
  { id: 'v050', spanish: 'uno, una', english: 'one', phonetic: 'OO-noh / OO-nah', category: 'numbers', ilrLevel: 0 },
  { id: 'v051', spanish: 'dos', english: 'two', phonetic: 'dohs', category: 'numbers', ilrLevel: 0 },
  { id: 'v052', spanish: 'tres', english: 'three', phonetic: 'trehs', category: 'numbers', ilrLevel: 0 },
  { id: 'v053', spanish: 'cuatro', english: 'four', phonetic: 'KWAH-troh', category: 'numbers', ilrLevel: 0 },
  { id: 'v054', spanish: 'cinco', english: 'five', phonetic: 'SEEN-koh', category: 'numbers', ilrLevel: 0 },
  { id: 'v055', spanish: 'seis', english: 'six', phonetic: 'sehs', category: 'numbers', ilrLevel: 0 },
  { id: 'v056', spanish: 'siete', english: 'seven', phonetic: 'SYEH-teh', category: 'numbers', ilrLevel: 0 },
  { id: 'v057', spanish: 'ocho', english: 'eight', phonetic: 'OH-choh', category: 'numbers', ilrLevel: 0 },
  { id: 'v058', spanish: 'nueve', english: 'nine', phonetic: 'NWEH-beh', category: 'numbers', ilrLevel: 0 },
  { id: 'v059', spanish: 'diez', english: 'ten', phonetic: 'dyehs', category: 'numbers', ilrLevel: 0 },
  { id: 'v060', spanish: 'veinte', english: 'twenty', phonetic: 'BEHN-teh', category: 'numbers', ilrLevel: 0 },
  { id: 'v061', spanish: 'cien / ciento', english: 'one hundred', phonetic: 'syehn / SYEHN-toh', category: 'numbers', ilrLevel: 0, notes: 'cien before nouns, ciento before other numbers' },
  { id: 'v062', spanish: 'mil', english: 'one thousand', phonetic: 'meel', category: 'numbers', ilrLevel: 0 },

  // Places - Travel & Operational
  { id: 'v070', spanish: 'el aeropuerto', english: 'the airport', phonetic: 'ehl ah-eh-roh-PWEHR-toh', category: 'places', ilrLevel: 0 },
  { id: 'v071', spanish: 'el hotel', english: 'the hotel', phonetic: 'ehl oh-TEHL', category: 'places', ilrLevel: 0 },
  { id: 'v072', spanish: 'el hospital', english: 'the hospital', phonetic: 'ehl ohs-pee-TAHL', category: 'places', ilrLevel: 0 },
  { id: 'v073', spanish: 'la embajada', english: 'the embassy', phonetic: 'lah ehm-bah-HAH-dah', category: 'places', ilrLevel: 1, notes: 'Critical operational vocabulary' },
  { id: 'v074', spanish: 'la comisaría', english: 'the police station', phonetic: 'lah koh-mee-sah-REE-ah', category: 'places', ilrLevel: 0 },
  { id: 'v075', spanish: 'el banco', english: 'the bank', phonetic: 'ehl BAHN-koh', category: 'places', ilrLevel: 0 },
  { id: 'v076', spanish: 'el mercado', english: 'the market', phonetic: 'ehl mehr-KAH-doh', category: 'places', ilrLevel: 0 },
  { id: 'v077', spanish: 'la calle', english: 'the street', phonetic: 'lah KAH-yeh', category: 'places', ilrLevel: 0 },
  { id: 'v078', spanish: 'la frontera', english: 'the border', phonetic: 'lah frohn-TEH-rah', category: 'places', ilrLevel: 1 },
  { id: 'v079', spanish: 'el consulado', english: 'the consulate', phonetic: 'ehl kohn-soo-LAH-doh', category: 'places', ilrLevel: 1 },

  // Emergency vocabulary - CIA priority
  { id: 'v080', spanish: '¡Ayuda!', english: 'Help!', phonetic: 'ah-YOO-dah', category: 'emergency', ilrLevel: 0 },
  { id: 'v081', spanish: '¡Llame a la policía!', english: 'Call the police!', phonetic: 'YAH-meh ah lah poh-lee-SEE-ah', category: 'emergency', ilrLevel: 0 },
  { id: 'v082', spanish: 'Me robaron', english: 'I was robbed', phonetic: 'meh roh-BAH-rohn', category: 'emergency', ilrLevel: 1 },
  { id: 'v083', spanish: 'Estoy perdido/a', english: "I'm lost", phonetic: 'ehs-TOY pehr-DEE-doh/dah', category: 'emergency', ilrLevel: 0 },
  { id: 'v084', spanish: 'Necesito un médico', english: 'I need a doctor', phonetic: 'neh-seh-SEE-toh oon MEH-dee-koh', category: 'emergency', ilrLevel: 0 },
  { id: 'v085', spanish: 'No entiendo', english: "I don't understand", phonetic: 'noh ehn-TYEHN-doh', category: 'emergency', ilrLevel: 0 },
  { id: 'v086', spanish: '¿Habla inglés?', english: 'Do you speak English?', phonetic: 'AH-blah een-GLEHS', category: 'emergency', ilrLevel: 0 },
  { id: 'v087', spanish: 'Soy ciudadano americano', english: 'I am an American citizen', phonetic: 'soy syoo-dah-DAH-noh ah-meh-ree-KAH-noh', category: 'emergency', ilrLevel: 1 },
  { id: 'v088', spanish: 'Quiero hablar con el cónsul', english: 'I want to speak with the consul', phonetic: 'KYEH-roh ah-BLAR kohn ehl KOHN-sool', category: 'emergency', ilrLevel: 1 },

  // ─── ILR 1→2: WORKING PROFICIENCY ───────────────────────────

  // Time expressions
  { id: 'v100', spanish: 'ahora', english: 'now', phonetic: 'ah-OH-rah', category: 'time', ilrLevel: 1 },
  { id: 'v101', spanish: 'después', english: 'after / later', phonetic: 'dehs-PWEHS', category: 'time', ilrLevel: 1 },
  { id: 'v102', spanish: 'antes', english: 'before', phonetic: 'AHN-tehs', category: 'time', ilrLevel: 1 },
  { id: 'v103', spanish: 'mañana', english: 'tomorrow / morning', phonetic: 'mah-NYAH-nah', category: 'time', ilrLevel: 1, notes: 'Context determines meaning: "mañana" = tomorrow; "la mañana" = the morning' },
  { id: 'v104', spanish: 'ayer', english: 'yesterday', phonetic: 'ah-YEHR', category: 'time', ilrLevel: 1 },
  { id: 'v105', spanish: 'hoy', english: 'today', phonetic: 'oy', category: 'time', ilrLevel: 1 },
  { id: 'v106', spanish: 'esta semana', english: 'this week', phonetic: 'EHS-tah seh-MAH-nah', category: 'time', ilrLevel: 1 },
  { id: 'v107', spanish: 'el año pasado', english: 'last year', phonetic: 'ehl AH-nyoh pah-SAH-doh', category: 'time', ilrLevel: 1 },

  // Work & Professional
  { id: 'v110', spanish: 'el trabajo', english: 'work / job', phonetic: 'ehl trah-BAH-hoh', category: 'work', ilrLevel: 1 },
  { id: 'v111', spanish: 'la reunión', english: 'the meeting', phonetic: 'lah reh-oo-NYOHN', category: 'work', ilrLevel: 1 },
  { id: 'v112', spanish: 'el informe', english: 'the report', phonetic: 'ehl een-FOR-meh', category: 'work', ilrLevel: 1 },
  { id: 'v113', spanish: 'el jefe / la jefa', english: 'the boss', phonetic: 'ehl HEH-feh', category: 'work', ilrLevel: 1 },
  { id: 'v114', spanish: 'el empleado', english: 'the employee', phonetic: 'ehl ehm-pleh-AH-doh', category: 'work', ilrLevel: 1 },
  { id: 'v115', spanish: 'la empresa', english: 'the company', phonetic: 'lah ehm-PREH-sah', category: 'work', ilrLevel: 1 },
  { id: 'v116', spanish: 'el contrato', english: 'the contract', phonetic: 'ehl kohn-TRAH-toh', category: 'work', ilrLevel: 1 },
  { id: 'v117', spanish: 'negociar', english: 'to negotiate', phonetic: 'neh-goh-SYAR', category: 'work', ilrLevel: 2 },
  { id: 'v118', spanish: 'el acuerdo', english: 'the agreement / deal', phonetic: 'ehl ah-KWEHR-doh', category: 'work', ilrLevel: 2 },

  // Family
  { id: 'v120', spanish: 'la familia', english: 'the family', phonetic: 'lah fah-MEE-lyah', category: 'family', ilrLevel: 1 },
  { id: 'v121', spanish: 'el padre / la madre', english: 'the father / mother', phonetic: 'ehl PAH-dreh / lah MAH-dreh', category: 'family', ilrLevel: 1 },
  { id: 'v122', spanish: 'el hijo / la hija', english: 'the son / daughter', phonetic: 'ehl EE-hoh / lah EE-hah', category: 'family', ilrLevel: 1 },
  { id: 'v123', spanish: 'el esposo / la esposa', english: 'the husband / wife', phonetic: 'ehl ehs-POH-soh / lah ehs-POH-sah', category: 'family', ilrLevel: 1 },
  { id: 'v124', spanish: 'el hermano / la hermana', english: 'the brother / sister', phonetic: 'ehl ehr-MAH-noh', category: 'family', ilrLevel: 1 },

  // ─── ILR 2→3: PROFESSIONAL OPERATIONAL VOCABULARY ────────────

  // Government & Official
  { id: 'v200', spanish: 'el gobierno', english: 'the government', phonetic: 'ehl goh-BYEHR-noh', category: 'government', ilrLevel: 2 },
  { id: 'v201', spanish: 'el ministerio', english: 'the ministry / department', phonetic: 'ehl mee-nees-TEH-ryoh', category: 'government', ilrLevel: 2 },
  { id: 'v202', spanish: 'el funcionario', english: 'the official / civil servant', phonetic: 'ehl foon-syoh-NAH-ryoh', category: 'government', ilrLevel: 2 },
  { id: 'v203', spanish: 'la ley', english: 'the law', phonetic: 'lah ley', category: 'government', ilrLevel: 2 },
  { id: 'v204', spanish: 'el decreto', english: 'the decree', phonetic: 'ehl deh-KREH-toh', category: 'government', ilrLevel: 2 },
  { id: 'v205', spanish: 'la política', english: 'politics / policy', phonetic: 'lah poh-LEE-tee-kah', category: 'government', ilrLevel: 2 },
  { id: 'v206', spanish: 'el tratado', english: 'the treaty', phonetic: 'ehl trah-TAH-doh', category: 'government', ilrLevel: 3 },
  { id: 'v207', spanish: 'la soberanía', english: 'sovereignty', phonetic: 'lah soh-beh-rah-NEE-ah', category: 'government', ilrLevel: 3 },
  { id: 'v208', spanish: 'la constitución', english: 'the constitution', phonetic: 'lah kohn-stee-too-SYOHN', category: 'government', ilrLevel: 2 },
  { id: 'v209', spanish: 'las elecciones', english: 'the elections', phonetic: 'lahs eh-lehk-SYOH-nehs', category: 'government', ilrLevel: 2 },

  // Negotiation
  { id: 'v220', spanish: 'proponer', english: 'to propose', phonetic: 'proh-poh-NEHR', category: 'negotiation', ilrLevel: 2 },
  { id: 'v221', spanish: 'rechazar', english: 'to reject', phonetic: 'reh-chah-SAR', category: 'negotiation', ilrLevel: 2 },
  { id: 'v222', spanish: 'aceptar', english: 'to accept', phonetic: 'ah-sehp-TAR', category: 'negotiation', ilrLevel: 1 },
  { id: 'v223', spanish: 'conceder', english: 'to concede / grant', phonetic: 'kohn-seh-DEHR', category: 'negotiation', ilrLevel: 2 },
  { id: 'v224', spanish: 'la demanda', english: 'the demand', phonetic: 'lah deh-MAHN-dah', category: 'negotiation', ilrLevel: 2 },
  { id: 'v225', spanish: 'comprometerse', english: 'to commit / compromise', phonetic: 'kohm-proh-meh-TEHR-seh', category: 'negotiation', ilrLevel: 2 },
  { id: 'v226', spanish: 'la condición', english: 'the condition', phonetic: 'lah kohn-dee-SYOHN', category: 'negotiation', ilrLevel: 2 },
  { id: 'v227', spanish: 'en nombre de', english: 'on behalf of', phonetic: 'ehn NOHM-breh deh', category: 'negotiation', ilrLevel: 2 },
  { id: 'v228', spanish: 'las partes interesadas', english: 'the stakeholders', phonetic: 'lahs PAR-tehs een-teh-reh-SAH-dahs', category: 'negotiation', ilrLevel: 3 },

  // Culture & Idioms
  { id: 'v240', spanish: 'tener en cuenta', english: 'to take into account / keep in mind', phonetic: 'teh-NEHR ehn KWEHN-tah', category: 'culture', ilrLevel: 2 },
  { id: 'v241', spanish: 'a propósito', english: 'by the way / on purpose', phonetic: 'ah proh-POH-see-toh', category: 'culture', ilrLevel: 2, notes: 'Context determines meaning' },
  { id: 'v242', spanish: 'sin embargo', english: 'however / nevertheless', phonetic: 'seen ehm-BAR-goh', category: 'culture', ilrLevel: 2 },
  { id: 'v243', spanish: 'por lo tanto', english: 'therefore / thus', phonetic: 'por loh TAHN-toh', category: 'culture', ilrLevel: 2 },
  { id: 'v244', spanish: 'en cuanto a', english: 'as for / regarding', phonetic: 'ehn KWAHN-toh ah', category: 'culture', ilrLevel: 2 },
  { id: 'v245', spanish: 'dar a entender', english: 'to imply / insinuate', phonetic: 'dar ah ehn-tehn-DEHR', category: 'culture', ilrLevel: 3 },
  { id: 'v246', spanish: 'no hay de qué', english: "don't mention it", phonetic: 'noh ay deh keh', category: 'culture', ilrLevel: 1 },

  // Adjectives - Essential descriptions
  { id: 'v260', spanish: 'importante', english: 'important', phonetic: 'eem-por-TAHN-teh', category: 'adjectives', ilrLevel: 1 },
  { id: 'v261', spanish: 'urgente', english: 'urgent', phonetic: 'oor-HEHN-teh', category: 'adjectives', ilrLevel: 1 },
  { id: 'v262', spanish: 'confidencial', english: 'confidential', phonetic: 'kohn-fee-dehn-SYAHL', category: 'adjectives', ilrLevel: 2 },
  { id: 'v263', spanish: 'seguro / inseguro', english: 'safe / unsafe', phonetic: 'seh-GOO-roh / een-seh-GOO-roh', category: 'adjectives', ilrLevel: 1 },
  { id: 'v264', spanish: 'disponible', english: 'available', phonetic: 'dees-poh-NEE-bleh', category: 'adjectives', ilrLevel: 1 },
  { id: 'v265', spanish: 'necesario', english: 'necessary', phonetic: 'neh-seh-SAH-ryoh', category: 'adjectives', ilrLevel: 1 },
  { id: 'v266', spanish: 'posible / imposible', english: 'possible / impossible', phonetic: 'poh-SEE-bleh / eem-poh-SEE-bleh', category: 'adjectives', ilrLevel: 1 },
  { id: 'v267', spanish: 'verdadero / falso', english: 'true / false', phonetic: 'behr-dah-DEH-roh / FAHL-soh', category: 'adjectives', ilrLevel: 1 },
];

export const getVocabByLevel = (maxLevel: number): VocabCard[] =>
  spanishVocabulary.filter(v => v.ilrLevel <= maxLevel);

export const getVocabByCategory = (category: string): VocabCard[] =>
  spanishVocabulary.filter(v => v.category === category);

export const getVocabById = (id: string): VocabCard | undefined =>
  spanishVocabulary.find(v => v.id === id);
