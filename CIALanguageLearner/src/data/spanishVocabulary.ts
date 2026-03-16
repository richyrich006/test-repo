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

  // ── FOOD & DRINK ──────────────────────────────────────────────────────
  { id: 'v300', spanish: 'el desayuno', english: 'breakfast', phonetic: 'el deh-sah-YOO-noh', category: 'food', ilrLevel: 1, exampleSentence: '¿A qué hora es el desayuno?', exampleTranslation: 'What time is breakfast?' },
  { id: 'v301', spanish: 'el almuerzo', english: 'lunch', phonetic: 'el ahl-MWEHR-soh', category: 'food', ilrLevel: 1 },
  { id: 'v302', spanish: 'la cena', english: 'dinner', phonetic: 'lah SEH-nah', category: 'food', ilrLevel: 1 },
  { id: 'v303', spanish: 'el agua', english: 'water', phonetic: 'el AH-gwah', category: 'food', ilrLevel: 0, exampleSentence: 'Quiero agua, por favor.', exampleTranslation: 'I want water, please.' },
  { id: 'v304', spanish: 'el café', english: 'coffee', phonetic: 'el kah-FEH', category: 'food', ilrLevel: 0 },
  { id: 'v305', spanish: 'la leche', english: 'milk', phonetic: 'lah LEH-cheh', category: 'food', ilrLevel: 0 },
  { id: 'v306', spanish: 'el jugo / el zumo', english: 'juice', phonetic: 'el HOO-goh / el SOO-moh', category: 'food', ilrLevel: 0, notes: 'jugo = Latin America, zumo = Spain' },
  { id: 'v307', spanish: 'la cerveza', english: 'beer', phonetic: 'lah sehr-BEH-sah', category: 'food', ilrLevel: 1 },
  { id: 'v308', spanish: 'el vino', english: 'wine', phonetic: 'el BEE-noh', category: 'food', ilrLevel: 1 },
  { id: 'v309', spanish: 'el pan', english: 'bread', phonetic: 'el pahn', category: 'food', ilrLevel: 0 },
  { id: 'v310', spanish: 'el arroz', english: 'rice', phonetic: 'el ah-ROHS', category: 'food', ilrLevel: 0 },
  { id: 'v311', spanish: 'los frijoles', english: 'beans', phonetic: 'lohs free-HOH-lehs', category: 'food', ilrLevel: 1 },
  { id: 'v312', spanish: 'la carne', english: 'meat', phonetic: 'lah KAHR-neh', category: 'food', ilrLevel: 1 },
  { id: 'v313', spanish: 'el pollo', english: 'chicken', phonetic: 'el POH-yoh', category: 'food', ilrLevel: 1 },
  { id: 'v314', spanish: 'el pescado', english: 'fish (food)', phonetic: 'el pehs-KAH-doh', category: 'food', ilrLevel: 1 },
  { id: 'v315', spanish: 'las verduras', english: 'vegetables', phonetic: 'lahs behr-DOO-rahs', category: 'food', ilrLevel: 1 },
  { id: 'v316', spanish: 'la fruta', english: 'fruit', phonetic: 'lah FROO-tah', category: 'food', ilrLevel: 0 },
  { id: 'v317', spanish: 'el menú / la carta', english: 'menu', phonetic: 'el meh-NOO / lah KAHR-tah', category: 'food', ilrLevel: 1, exampleSentence: '¿Me puede traer la carta?', exampleTranslation: 'Can you bring me the menu?' },
  { id: 'v318', spanish: 'la cuenta', english: 'the bill / check', phonetic: 'lah KWEHN-tah', category: 'food', ilrLevel: 1, exampleSentence: 'La cuenta, por favor.', exampleTranslation: 'The check, please.' },
  { id: 'v319', spanish: 'delicioso', english: 'delicious', phonetic: 'deh-lee-SYOH-soh', category: 'food', ilrLevel: 1 },
  { id: 'v320', spanish: 'picante', english: 'spicy / hot', phonetic: 'pee-KAHN-teh', category: 'food', ilrLevel: 1 },
  { id: 'v321', spanish: 'tengo hambre', english: 'I am hungry', phonetic: 'TEHN-goh AHM-breh', category: 'food', ilrLevel: 0, exampleSentence: 'Tengo mucha hambre.', exampleTranslation: 'I am very hungry.' },
  { id: 'v322', spanish: 'tengo sed', english: 'I am thirsty', phonetic: 'TEHN-goh sehd', category: 'food', ilrLevel: 0 },
  { id: 'v323', spanish: 'la propina', english: 'tip (gratuity)', phonetic: 'lah proh-PEE-nah', category: 'food', ilrLevel: 1 },

  // ── SHOPPING & MONEY ─────────────────────────────────────────────────
  { id: 'v330', spanish: 'el mercado', english: 'market', phonetic: 'el mehr-KAH-doh', category: 'shopping', ilrLevel: 1 },
  { id: 'v331', spanish: 'la tienda', english: 'store / shop', phonetic: 'lah TYEHN-dah', category: 'shopping', ilrLevel: 1 },
  { id: 'v332', spanish: 'el precio', english: 'price', phonetic: 'el PREH-syoh', category: 'shopping', ilrLevel: 1, exampleSentence: '¿Cuál es el precio?', exampleTranslation: 'What is the price?' },
  { id: 'v333', spanish: 'caro / barato', english: 'expensive / cheap', phonetic: 'KAH-roh / bah-RAH-toh', category: 'shopping', ilrLevel: 1 },
  { id: 'v334', spanish: 'el descuento', english: 'discount', phonetic: 'el dehs-KWEHN-toh', category: 'shopping', ilrLevel: 1 },
  { id: 'v335', spanish: '¿Tiene cambio?', english: 'Do you have change?', phonetic: 'TYEH-neh KAHM-byoh', category: 'shopping', ilrLevel: 1 },
  { id: 'v336', spanish: 'la tarjeta de crédito', english: 'credit card', phonetic: 'lah tahr-HEH-tah deh KREH-dee-toh', category: 'shopping', ilrLevel: 1 },
  { id: 'v337', spanish: 'el efectivo', english: 'cash', phonetic: 'el eh-fehk-TEE-boh', category: 'shopping', ilrLevel: 1 },
  { id: 'v338', spanish: 'el recibo', english: 'receipt', phonetic: 'el reh-SEE-boh', category: 'shopping', ilrLevel: 1 },
  { id: 'v339', spanish: 'la talla', english: 'size (clothing)', phonetic: 'lah TAH-yah', category: 'shopping', ilrLevel: 1 },
  { id: 'v340', spanish: 'quiero comprar', english: 'I want to buy', phonetic: 'KYEH-roh kohm-PRAHR', category: 'shopping', ilrLevel: 1 },
  { id: 'v341', spanish: '¿Acepta dólares?', english: 'Do you accept dollars?', phonetic: 'ah-SEHP-tah DOH-lah-rehs', category: 'shopping', ilrLevel: 1 },

  // ── TRANSPORTATION ────────────────────────────────────────────────────
  { id: 'v350', spanish: 'el taxi', english: 'taxi', phonetic: 'el TAHK-see', category: 'transportation', ilrLevel: 0, exampleSentence: 'Necesito un taxi.', exampleTranslation: 'I need a taxi.' },
  { id: 'v351', spanish: 'el autobús / el bus', english: 'bus', phonetic: 'el ow-toh-BOOS', category: 'transportation', ilrLevel: 0 },
  { id: 'v352', spanish: 'el metro / el subte', english: 'subway / metro', phonetic: 'el MEH-troh', category: 'transportation', ilrLevel: 1, notes: 'subte = Argentina' },
  { id: 'v353', spanish: 'el tren', english: 'train', phonetic: 'el trehn', category: 'transportation', ilrLevel: 0 },
  { id: 'v354', spanish: 'el avión', english: 'airplane', phonetic: 'el ah-BYOHN', category: 'transportation', ilrLevel: 0 },
  { id: 'v355', spanish: 'la parada', english: 'bus stop', phonetic: 'lah pah-RAH-dah', category: 'transportation', ilrLevel: 1 },
  { id: 'v356', spanish: 'la estación', english: 'station', phonetic: 'lah ehs-tah-SYOHN', category: 'transportation', ilrLevel: 1 },
  { id: 'v357', spanish: 'el boleto / el billete', english: 'ticket', phonetic: 'el boh-LEH-toh / el bee-YEH-teh', category: 'transportation', ilrLevel: 1, notes: 'boleto = Latin America, billete = Spain' },
  { id: 'v358', spanish: 'llevarme a...', english: 'take me to...', phonetic: 'yeh-BAHR-meh ah', category: 'transportation', ilrLevel: 1, exampleSentence: 'Lléveme al aeropuerto, por favor.', exampleTranslation: 'Take me to the airport, please.' },
  { id: 'v359', spanish: 'a la derecha', english: 'to the right', phonetic: 'ah lah deh-REH-chah', category: 'transportation', ilrLevel: 1 },
  { id: 'v360', spanish: 'a la izquierda', english: 'to the left', phonetic: 'ah lah ees-KYEHR-dah', category: 'transportation', ilrLevel: 1 },
  { id: 'v361', spanish: 'recto / todo recto', english: 'straight ahead', phonetic: 'REHK-toh / TOH-doh REHK-toh', category: 'transportation', ilrLevel: 1 },
  { id: 'v362', spanish: 'la gasolina / la nafta', english: 'gasoline / gas', phonetic: 'lah gah-soh-LEE-nah', category: 'transportation', ilrLevel: 1 },
  { id: 'v363', spanish: 'el aeropuerto', english: 'airport', phonetic: 'el ah-eh-roh-PWEHR-toh', category: 'transportation', ilrLevel: 0 },
  { id: 'v364', spanish: 'la frontera', english: 'border / frontier', phonetic: 'lah frohn-TEH-rah', category: 'transportation', ilrLevel: 1 },

  // ── FAMILY & RELATIONSHIPS ────────────────────────────────────────────
  { id: 'v370', spanish: 'la familia', english: 'family', phonetic: 'lah fah-MEE-lyah', category: 'family', ilrLevel: 0 },
  { id: 'v371', spanish: 'el padre / la madre', english: 'father / mother', phonetic: 'el PAH-dreh / lah MAH-dreh', category: 'family', ilrLevel: 0 },
  { id: 'v372', spanish: 'los padres', english: 'parents', phonetic: 'lohs PAH-drehs', category: 'family', ilrLevel: 0 },
  { id: 'v373', spanish: 'el hijo / la hija', english: 'son / daughter', phonetic: 'el EE-hoh / lah EE-hah', category: 'family', ilrLevel: 1 },
  { id: 'v374', spanish: 'el hermano / la hermana', english: 'brother / sister', phonetic: 'el ehr-MAH-noh / lah ehr-MAH-nah', category: 'family', ilrLevel: 1 },
  { id: 'v375', spanish: 'el esposo / la esposa', english: 'husband / wife', phonetic: 'el ehs-POH-soh / lah ehs-POH-sah', category: 'family', ilrLevel: 1 },
  { id: 'v376', spanish: 'el novio / la novia', english: 'boyfriend / girlfriend', phonetic: 'el NOH-byoh / lah NOH-byah', category: 'family', ilrLevel: 1 },
  { id: 'v377', spanish: 'el amigo / la amiga', english: 'friend', phonetic: 'el ah-MEE-goh / lah ah-MEE-gah', category: 'family', ilrLevel: 0 },
  { id: 'v378', spanish: 'el abuelo / la abuela', english: 'grandfather / grandmother', phonetic: 'el ah-BWEH-loh / lah ah-BWEH-lah', category: 'family', ilrLevel: 1 },
  { id: 'v379', spanish: 'el vecino / la vecina', english: 'neighbor', phonetic: 'el beh-SEE-noh', category: 'family', ilrLevel: 1 },
  { id: 'v380', spanish: 'soltero / casado', english: 'single / married', phonetic: 'sohl-TEH-roh / kah-SAH-doh', category: 'family', ilrLevel: 1 },

  // ── EMOTIONS & PERSONALITY ────────────────────────────────────────────
  { id: 'v385', spanish: 'contento / feliz', english: 'happy / glad', phonetic: 'kohn-TEHN-toh / feh-LEES', category: 'emotions', ilrLevel: 1 },
  { id: 'v386', spanish: 'triste', english: 'sad', phonetic: 'TREES-teh', category: 'emotions', ilrLevel: 1 },
  { id: 'v387', spanish: 'enojado / enojada', english: 'angry', phonetic: 'eh-noh-HAH-doh', category: 'emotions', ilrLevel: 1 },
  { id: 'v388', spanish: 'asustado', english: 'scared / frightened', phonetic: 'ah-soos-TAH-doh', category: 'emotions', ilrLevel: 1 },
  { id: 'v389', spanish: 'cansado', english: 'tired', phonetic: 'kahn-SAH-doh', category: 'emotions', ilrLevel: 1, exampleSentence: 'Estoy muy cansado.', exampleTranslation: 'I am very tired.' },
  { id: 'v390', spanish: 'preocupado', english: 'worried', phonetic: 'preh-oh-koo-PAH-doh', category: 'emotions', ilrLevel: 1 },
  { id: 'v391', spanish: 'sorprendido', english: 'surprised', phonetic: 'sohr-prehn-DEE-doh', category: 'emotions', ilrLevel: 1 },
  { id: 'v392', spanish: 'nervioso', english: 'nervous', phonetic: 'nehr-BYOH-soh', category: 'emotions', ilrLevel: 1 },
  { id: 'v393', spanish: 'tranquilo', english: 'calm / relaxed', phonetic: 'trahn-KEE-loh', category: 'emotions', ilrLevel: 1 },

  // ── BODY & HEALTH ─────────────────────────────────────────────────────
  { id: 'v400', spanish: 'la cabeza', english: 'head', phonetic: 'lah kah-BEH-sah', category: 'health', ilrLevel: 1 },
  { id: 'v401', spanish: 'el ojo / los ojos', english: 'eye / eyes', phonetic: 'el OH-hoh / lohs OH-hohs', category: 'health', ilrLevel: 1 },
  { id: 'v402', spanish: 'la boca', english: 'mouth', phonetic: 'lah BOH-kah', category: 'health', ilrLevel: 1 },
  { id: 'v403', spanish: 'la mano / las manos', english: 'hand / hands', phonetic: 'lah MAH-noh / lahs MAH-nohs', category: 'health', ilrLevel: 1 },
  { id: 'v404', spanish: 'el estómago', english: 'stomach', phonetic: 'el ehs-TOH-mah-goh', category: 'health', ilrLevel: 1 },
  { id: 'v405', spanish: 'me duele', english: 'it hurts me / my ... hurts', phonetic: 'meh DWEH-leh', category: 'health', ilrLevel: 1, exampleSentence: 'Me duele la cabeza.', exampleTranslation: 'My head hurts.' },
  { id: 'v406', spanish: 'estoy enfermo/a', english: 'I am sick', phonetic: 'ehs-TOY ehn-FEHR-moh', category: 'health', ilrLevel: 1 },
  { id: 'v407', spanish: 'el médico / el doctor', english: 'doctor', phonetic: 'el MEH-dee-koh', category: 'health', ilrLevel: 1 },
  { id: 'v408', spanish: 'el hospital', english: 'hospital', phonetic: 'el ohs-pee-TAHL', category: 'health', ilrLevel: 1 },
  { id: 'v409', spanish: 'la farmacia', english: 'pharmacy', phonetic: 'lah fahr-MAH-syah', category: 'health', ilrLevel: 1 },
  { id: 'v410', spanish: 'la medicina / el medicamento', english: 'medicine', phonetic: 'lah meh-dee-SEE-nah', category: 'health', ilrLevel: 1 },
  { id: 'v411', spanish: 'la alergia', english: 'allergy', phonetic: 'lah ah-LEHR-hyah', category: 'health', ilrLevel: 2 },
  { id: 'v412', spanish: 'la fiebre', english: 'fever', phonetic: 'lah FYEH-breh', category: 'health', ilrLevel: 1 },
  { id: 'v413', spanish: 'necesito ayuda', english: 'I need help', phonetic: 'neh-seh-SEE-toh ah-YOO-dah', category: 'health', ilrLevel: 0, exampleSentence: '¡Necesito ayuda médica!', exampleTranslation: 'I need medical help!' },

  // ── HOME & DAILY LIFE ─────────────────────────────────────────────────
  { id: 'v420', spanish: 'la casa / el apartamento', english: 'house / apartment', phonetic: 'lah KAH-sah / el ah-pahr-tah-MEHN-toh', category: 'home', ilrLevel: 1 },
  { id: 'v421', spanish: 'el cuarto / la habitación', english: 'room', phonetic: 'el KWAHR-toh / lah ah-bee-tah-SYOHN', category: 'home', ilrLevel: 1 },
  { id: 'v422', spanish: 'el baño', english: 'bathroom', phonetic: 'el BAH-nyoh', category: 'home', ilrLevel: 0, exampleSentence: '¿Dónde está el baño?', exampleTranslation: 'Where is the bathroom?' },
  { id: 'v423', spanish: 'la cama', english: 'bed', phonetic: 'lah KAH-mah', category: 'home', ilrLevel: 1 },
  { id: 'v424', spanish: 'la llave', english: 'key', phonetic: 'lah YAH-beh', category: 'home', ilrLevel: 1 },
  { id: 'v425', spanish: 'el internet / el wifi', english: 'internet / wifi', phonetic: 'el een-tehr-NEHT', category: 'home', ilrLevel: 0 },
  { id: 'v426', spanish: 'el teléfono', english: 'telephone', phonetic: 'el teh-LEH-foh-noh', category: 'home', ilrLevel: 0 },
  { id: 'v427', spanish: 'la electricidad', english: 'electricity', phonetic: 'lah eh-lehk-tree-see-DAHD', category: 'home', ilrLevel: 2 },
  { id: 'v428', spanish: 'el vecindario / el barrio', english: 'neighborhood', phonetic: 'el beh-seen-DAH-ryoh / el BAH-ryoh', category: 'home', ilrLevel: 1 },

  // ── TIME & CALENDAR ───────────────────────────────────────────────────
  { id: 'v440', spanish: 'hoy', english: 'today', phonetic: 'oy', category: 'time', ilrLevel: 0 },
  { id: 'v441', spanish: 'ayer', english: 'yesterday', phonetic: 'ah-YEHR', category: 'time', ilrLevel: 0 },
  { id: 'v442', spanish: 'mañana', english: 'tomorrow / morning', phonetic: 'mah-NYAH-nah', category: 'time', ilrLevel: 0, notes: 'Context determines meaning: "mañana" = tomorrow or morning' },
  { id: 'v443', spanish: 'la semana', english: 'week', phonetic: 'lah seh-MAH-nah', category: 'time', ilrLevel: 0 },
  { id: 'v444', spanish: 'el mes', english: 'month', phonetic: 'el mehs', category: 'time', ilrLevel: 0 },
  { id: 'v445', spanish: 'el año', english: 'year', phonetic: 'el AH-nyoh', category: 'time', ilrLevel: 0 },
  { id: 'v446', spanish: 'lunes, martes, miércoles', english: 'Monday, Tuesday, Wednesday', phonetic: 'LOO-nehs, MAHR-tehs, MYEHR-koh-lehs', category: 'time', ilrLevel: 1 },
  { id: 'v447', spanish: 'jueves, viernes, sábado, domingo', english: 'Thursday, Friday, Saturday, Sunday', phonetic: 'HWEH-behs, BYEHR-nehs, SAH-bah-doh, doh-MEEN-goh', category: 'time', ilrLevel: 1 },
  { id: 'v448', spanish: 'ahora / pronto / después', english: 'now / soon / later', phonetic: 'ah-OH-rah / PROHN-toh / dehs-PWES', category: 'time', ilrLevel: 1 },
  { id: 'v449', spanish: 'a tiempo / tarde / temprano', english: 'on time / late / early', phonetic: 'ah TYEHM-poh / TAHR-deh / tehm-PRAH-noh', category: 'time', ilrLevel: 1 },

  // ── OPINIONS & DISCUSSION ─────────────────────────────────────────────
  { id: 'v450', spanish: 'creo que / pienso que', english: 'I believe that / I think that', phonetic: 'KREH-oh keh / PYEHN-soh keh', category: 'opinions', ilrLevel: 2, exampleSentence: 'Creo que es un problema serio.', exampleTranslation: 'I think it is a serious problem.' },
  { id: 'v451', spanish: 'estoy de acuerdo', english: 'I agree', phonetic: 'ehs-TOY deh ah-KWEHR-doh', category: 'opinions', ilrLevel: 1 },
  { id: 'v452', spanish: 'no estoy de acuerdo', english: 'I disagree', phonetic: 'noh ehs-TOY deh ah-KWEHR-doh', category: 'opinions', ilrLevel: 1 },
  { id: 'v453', spanish: 'depende de', english: 'it depends on', phonetic: 'deh-PEHN-deh deh', category: 'opinions', ilrLevel: 2 },
  { id: 'v454', spanish: 'en mi opinión', english: 'in my opinion', phonetic: 'ehn mee oh-pee-NYOHN', category: 'opinions', ilrLevel: 2 },
  { id: 'v455', spanish: 'sin embargo', english: 'however / nevertheless', phonetic: 'seen ehm-BAHR-goh', category: 'opinions', ilrLevel: 2 },
  { id: 'v456', spanish: 'por lo tanto', english: 'therefore', phonetic: 'pohr loh TAHN-toh', category: 'opinions', ilrLevel: 2 },
  { id: 'v457', spanish: 'además', english: 'furthermore / also', phonetic: 'ah-deh-MAHS', category: 'opinions', ilrLevel: 2 },
  { id: 'v458', spanish: 'sin duda', english: 'without a doubt', phonetic: 'seen DOO-dah', category: 'opinions', ilrLevel: 2 },

  // ── FUTURE & CONDITIONAL ─────────────────────────────────────────────
  { id: 'v460', spanish: 'voy a + infinitive', english: 'I am going to (near future)', phonetic: 'BOY ah', category: 'verbs', ilrLevel: 1, exampleSentence: 'Voy a hablar con él mañana.', exampleTranslation: 'I am going to talk to him tomorrow.' },
  { id: 'v461', spanish: 'hablaré', english: 'I will speak (future)', phonetic: 'ah-blah-REH', category: 'verbs', ilrLevel: 2 },
  { id: 'v462', spanish: 'podría', english: 'I could / I would be able to', phonetic: 'poh-DREE-ah', category: 'verbs', ilrLevel: 2, exampleSentence: '¿Podría ayudarme?', exampleTranslation: 'Could you help me?' },
  { id: 'v463', spanish: 'quisiera', english: 'I would like', phonetic: 'kee-SYEH-rah', category: 'verbs', ilrLevel: 1, exampleSentence: 'Quisiera hablar con el gerente.', exampleTranslation: 'I would like to speak with the manager.' },
  { id: 'v464', spanish: 'si fuera posible', english: 'if it were possible', phonetic: 'see FWEH-rah poh-SEE-bleh', category: 'verbs', ilrLevel: 2 },

  // ── MEDIA & SOCIETY ───────────────────────────────────────────────────
  { id: 'v470', spanish: 'las noticias', english: 'the news', phonetic: 'lahs noh-TEE-syahs', category: 'society', ilrLevel: 2 },
  { id: 'v471', spanish: 'el periódico', english: 'newspaper', phonetic: 'el peh-RYOH-dee-koh', category: 'society', ilrLevel: 2 },
  { id: 'v472', spanish: 'el gobierno', english: 'the government', phonetic: 'el goh-BYEHR-noh', category: 'society', ilrLevel: 2 },
  { id: 'v473', spanish: 'la política', english: 'politics / policy', phonetic: 'lah poh-LEE-tee-kah', category: 'society', ilrLevel: 2 },
  { id: 'v474', spanish: 'la economía', english: 'the economy', phonetic: 'lah eh-koh-noh-MEE-ah', category: 'society', ilrLevel: 2 },
  { id: 'v475', spanish: 'la seguridad', english: 'security / safety', phonetic: 'lah seh-goo-ree-DAHD', category: 'society', ilrLevel: 2 },
  { id: 'v476', spanish: 'los derechos', english: 'rights', phonetic: 'lohs deh-REH-chohs', category: 'society', ilrLevel: 2 },
  { id: 'v477', spanish: 'la ley / la justicia', english: 'law / justice', phonetic: 'lah leh-ee / lah hoos-TEE-syah', category: 'society', ilrLevel: 2 },
  { id: 'v478', spanish: 'el acuerdo / el tratado', english: 'agreement / treaty', phonetic: 'el ah-KWEHR-doh / el trah-TAH-doh', category: 'society', ilrLevel: 3 },
  { id: 'v479', spanish: 'la reunión', english: 'meeting', phonetic: 'lah reh-oo-NYOHN', category: 'society', ilrLevel: 2 },

  // ── CLASSROOM / LEARNING ─────────────────────────────────────────────
  { id: 'v480', spanish: '¿Cómo se dice...?', english: 'How do you say...?', phonetic: 'KOH-moh seh DEE-seh', category: 'learning', ilrLevel: 0, exampleSentence: '¿Cómo se dice "hello" en español?', exampleTranslation: 'How do you say "hello" in Spanish?' },
  { id: 'v481', spanish: '¿Puede repetir, por favor?', english: 'Can you repeat, please?', phonetic: 'PWEH-deh reh-peh-TEER', category: 'learning', ilrLevel: 0 },
  { id: 'v482', spanish: 'Hablo un poco de español.', english: 'I speak a little Spanish.', phonetic: 'AH-bloh oon POH-koh deh ehs-pah-NYOHL', category: 'learning', ilrLevel: 0 },
  { id: 'v483', spanish: 'No entiendo.', english: 'I do not understand.', phonetic: 'noh ehn-TYEHN-doh', category: 'learning', ilrLevel: 0 },
  { id: 'v484', spanish: '¿Habla inglés?', english: 'Do you speak English?', phonetic: 'AH-blah een-GLEHS', category: 'learning', ilrLevel: 0 },
  { id: 'v485', spanish: 'Más despacio, por favor.', english: 'More slowly, please.', phonetic: 'mahs dehs-PAH-syoh', category: 'learning', ilrLevel: 0 },

  // ── COLORS ───────────────────────────────────────────────────────────────
  { id: 'v500', spanish: 'rojo / roja', english: 'red', phonetic: 'ROH-hoh / ROH-hah', category: 'adjectives', ilrLevel: 0, notes: 'Adjectives agree with gender: rojo (m) / roja (f)' },
  { id: 'v501', spanish: 'azul', english: 'blue', phonetic: 'ah-SOOL', category: 'adjectives', ilrLevel: 0, notes: 'Azul does not change for gender — azul (m/f), azules (plural)' },
  { id: 'v502', spanish: 'verde', english: 'green', phonetic: 'BEHR-deh', category: 'adjectives', ilrLevel: 0, notes: 'Verde is same for both genders; verdes in plural' },
  { id: 'v503', spanish: 'amarillo / amarilla', english: 'yellow', phonetic: 'ah-mah-REE-yoh', category: 'adjectives', ilrLevel: 0, notes: 'Adjectives agree with gender: amarillo (m) / amarilla (f)' },
  { id: 'v504', spanish: 'blanco / blanca', english: 'white', phonetic: 'BLAHN-koh / BLAHN-kah', category: 'adjectives', ilrLevel: 0, notes: 'Adjectives agree with gender: blanco (m) / blanca (f)' },
  { id: 'v505', spanish: 'negro / negra', english: 'black', phonetic: 'NEH-groh / NEH-grah', category: 'adjectives', ilrLevel: 0, notes: 'Adjectives agree with gender: negro (m) / negra (f)' },

  // ── WEATHER ──────────────────────────────────────────────────────────────
  { id: 'v510', spanish: '¿Qué tiempo hace?', english: 'What is the weather like?', phonetic: 'keh TYEHM-poh AH-seh', category: 'culture', ilrLevel: 0, notes: 'Use HACER for weather: hace calor, hace frío, hace sol' },
  { id: 'v511', spanish: 'hace calor / hace frío', english: 'it is hot / it is cold', phonetic: 'AH-seh kah-LOHR / AH-seh FREE-oh', category: 'culture', ilrLevel: 0, notes: 'Hace + weather noun — literally "makes heat/cold"' },
  { id: 'v512', spanish: 'está lloviendo / está nevando', english: 'it is raining / it is snowing', phonetic: 'ehs-TAH yoh-BYEHN-doh / ehs-TAH neh-BAHN-doh', category: 'culture', ilrLevel: 0, notes: 'Use ESTAR + gerund for active weather conditions' },
  { id: 'v513', spanish: 'hace viento / está nublado', english: 'it is windy / it is cloudy', phonetic: 'AH-seh BYEHN-toh / ehs-TAH noo-BLAH-doh', category: 'culture', ilrLevel: 0, notes: 'Mixed: HACER for wind, ESTAR for cloud cover' },
  { id: 'v514', spanish: 'la temporada seca / la temporada de lluvias', english: 'dry season / rainy season', phonetic: 'lah tehm-poh-RAH-dah SEH-kah / deh YOO-byahs', category: 'culture', ilrLevel: 1, notes: 'Crucial for fieldwork — most of Latin America has two seasons, not four' },

  // ── HOBBIES & LEISURE ────────────────────────────────────────────────────
  { id: 'v520', spanish: 'me gusta / me gustan', english: 'I like (singular) / I like (plural)', phonetic: 'meh GOOS-tah / meh GOOS-tahn', category: 'culture', ilrLevel: 0, notes: 'GUSTAR works backwards: "me gusta el fútbol" = "football pleases me"' },
  { id: 'v521', spanish: 'el fútbol', english: 'soccer / football', phonetic: 'el FOOT-bol', category: 'culture', ilrLevel: 0, notes: 'The most culturally important sport in Latin America — discussing it builds rapport instantly' },
  { id: 'v522', spanish: 'leer / escuchar música', english: 'to read / to listen to music', phonetic: 'leh-EHR / ehs-koo-CHAHR MOO-see-kah', category: 'culture', ilrLevel: 0 },
  { id: 'v523', spanish: 'cocinar / bailar', english: 'to cook / to dance', phonetic: 'koh-see-NAHR / by-LAHR', category: 'culture', ilrLevel: 0, notes: 'Baile (dance) is central to Latin American culture — salsa, cumbia, merengue vary by country' },
  { id: 'v524', spanish: 'viajar / explorar', english: 'to travel / to explore', phonetic: 'byah-HAHR / ehks-ploh-RAHR', category: 'culture', ilrLevel: 0 },
  { id: 'v525', spanish: 'el fin de semana', english: 'the weekend', phonetic: 'el feen deh seh-MAH-nah', category: 'culture', ilrLevel: 0, exampleSentence: '¿Qué haces el fin de semana?', exampleTranslation: 'What do you do on the weekend?' },
  { id: 'v526', spanish: 'el pasatiempo / la afición', english: 'hobby / passion', phonetic: 'el pah-sah-TYEHM-poh / lah ah-fee-SYOHN', category: 'culture', ilrLevel: 1 },
  { id: 'v527', spanish: 'practicar deportes', english: 'to play sports', phonetic: 'prahk-tee-KAHR deh-POHR-tehs', category: 'culture', ilrLevel: 0 },

  // ── TECHNOLOGY & MODERN LIFE ─────────────────────────────────────────────
  { id: 'v540', spanish: 'el teléfono / el celular', english: 'telephone / cell phone', phonetic: 'el teh-LEH-foh-noh / el seh-loo-LAHR', category: 'work', ilrLevel: 0, notes: '"Celular" is used across Latin America; "móvil" is the Spanish (Spain) term' },
  { id: 'v541', spanish: 'el correo electrónico', english: 'email', phonetic: 'el koh-REH-oh eh-lehk-TROH-nee-koh', category: 'work', ilrLevel: 1, notes: 'Often shortened to "el correo" in context; "e-mail" is also widely understood' },
  { id: 'v542', spanish: 'la contraseña', english: 'password', phonetic: 'lah kohn-trah-SEH-nyah', category: 'work', ilrLevel: 1 },
  { id: 'v543', spanish: 'la red / el internet', english: 'network / the internet', phonetic: 'lah rehd / el een-tehr-NEHT', category: 'work', ilrLevel: 1 },
  { id: 'v544', spanish: 'descargar / enviar', english: 'to download / to send', phonetic: 'dehs-kahr-GAHR / ehn-BYAHR', category: 'work', ilrLevel: 1 },
  { id: 'v545', spanish: 'la aplicación / la app', english: 'the app', phonetic: 'lah ah-plee-kah-SYOHN', category: 'work', ilrLevel: 1 },
  { id: 'v546', spanish: 'el mensaje de texto', english: 'text message', phonetic: 'el mehn-SAH-heh deh TEHKS-toh', category: 'work', ilrLevel: 0 },
  { id: 'v547', spanish: 'en línea / fuera de línea', english: 'online / offline', phonetic: 'ehn LEE-neh-ah / FWEH-rah deh LEE-neh-ah', category: 'work', ilrLevel: 1 },
  { id: 'v548', spanish: 'la videoconferencia', english: 'video conference', phonetic: 'lah bee-DEH-oh-kohn-feh-REHN-syah', category: 'work', ilrLevel: 2 },
  { id: 'v549', spanish: 'compartir / guardar', english: 'to share / to save', phonetic: 'kohm-pahr-TEER / gwahr-DAHR', category: 'work', ilrLevel: 1 },
];

export const getVocabByLevel = (maxLevel: number): VocabCard[] =>
  spanishVocabulary.filter(v => v.ilrLevel <= maxLevel);

export const getVocabByCategory = (category: string): VocabCard[] =>
  spanishVocabulary.filter(v => v.category === category);

export const getVocabById = (id: string): VocabCard | undefined =>
  spanishVocabulary.find(v => v.id === id);
