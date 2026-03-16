import { Dialogue } from '../types';

// ============================================================
// Situational Dialogues - CIA/FSI Operational Scenarios
// Based on FSI Spanish Programmatic Course dialogues
// Each dialogue prepares learner for real-world situations
// ============================================================

export const spanishDialogues: Dialogue[] = [

  // ─── LEVEL 1: SURVIVAL SITUATIONS ────────────────────────────

  {
    id: 'dia001',
    title: 'Arrival at the Airport',
    scenario: 'Immigration & Customs',
    situation: 'You have just landed in a Spanish-speaking country. A customs officer is checking your documents. Stay calm, answer clearly, and demonstrate cooperative intent.',
    ilrLevel: 0,
    characters: [
      { id: 'c1', name: 'Officer Ramírez', role: 'Customs Official', isLearner: false },
      { id: 'c2', name: 'You', role: 'Traveler', isLearner: true },
    ],
    lines: [
      { characterId: 'c1', spanish: 'Buenos días. Su pasaporte, por favor.', english: 'Good morning. Your passport, please.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Buenos días. Aquí está.', english: 'Good morning. Here it is.', isLearnerLine: true, phonetic: 'BWEH-nohs DEE-ahs. ah-KEE ehs-TAH' },
      { characterId: 'c1', spanish: '¿Cuál es el motivo de su visita?', english: 'What is the purpose of your visit?', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Estoy aquí por negocios.', english: 'I am here on business.', isLearnerLine: true, phonetic: 'ehs-TOY ah-KEE por neh-GOH-syohs' },
      { characterId: 'c1', spanish: '¿Cuánto tiempo va a quedarse?', english: 'How long are you going to stay?', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Voy a quedarme dos semanas.', english: 'I am going to stay for two weeks.', isLearnerLine: true, phonetic: 'BOY ah keh-DAR-meh dohs seh-MAH-nahs' },
      { characterId: 'c1', spanish: '¿Tiene algo que declarar?', english: 'Do you have anything to declare?', isLearnerLine: false },
      { characterId: 'c2', spanish: 'No, no tengo nada que declarar.', english: 'No, I have nothing to declare.', isLearnerLine: true, phonetic: 'noh, noh TEHN-goh NAH-dah keh deh-klah-RAR' },
      { characterId: 'c1', spanish: 'Muy bien. Bienvenido.', english: 'Very good. Welcome.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Gracias.', english: 'Thank you.', isLearnerLine: true },
    ],
    culturalNotes: [
      'Always use "usted" (formal you) with officials — it signals respect and professionalism.',
      'Maintain steady eye contact and a calm demeanor — nervousness can trigger additional scrutiny.',
      'Answering directly and concisely is viewed positively by officials.',
    ],
    keyVocab: ['v002', 'v007', 'v008', 'v070'],
  },

  {
    id: 'dia002',
    title: 'Checking into a Hotel',
    scenario: 'Hotel Check-In',
    situation: 'You need to check into a hotel. You have a reservation. Practice maintaining professional composure while handling administrative details.',
    ilrLevel: 0,
    characters: [
      { id: 'c1', name: 'Receptionist', role: 'Hotel Receptionist', isLearner: false },
      { id: 'c2', name: 'You', role: 'Guest', isLearner: true },
    ],
    lines: [
      { characterId: 'c2', spanish: 'Buenas tardes. Tengo una reservación a nombre de Johnson.', english: 'Good afternoon. I have a reservation in the name of Johnson.', isLearnerLine: true, phonetic: 'BWEH-nahs TAR-dehs. TEHN-goh OO-nah reh-sehr-bah-SYOHN ah NOHM-breh deh Johnson' },
      { characterId: 'c1', spanish: 'Un momento, por favor... Sí, aquí está. Una habitación doble, tres noches.', english: 'One moment, please... Yes, here it is. A double room, three nights.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Correcto.', english: 'Correct.', isLearnerLine: true },
      { characterId: 'c1', spanish: '¿Me permite su pasaporte y su tarjeta de crédito?', english: 'May I have your passport and credit card?', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Por supuesto. Aquí tiene.', english: 'Of course. Here you go.', isLearnerLine: true, phonetic: 'por soo-PWES-toh. ah-KEE TYEH-neh' },
      { characterId: 'c1', spanish: 'Su habitación es la trescientos doce, en el tercer piso.', english: 'Your room is 312, on the third floor.', isLearnerLine: false },
      { characterId: 'c2', spanish: '¿A qué hora es el desayuno?', english: 'What time is breakfast?', isLearnerLine: true, phonetic: 'ah keh OH-rah ehs ehl deh-sah-YOO-noh' },
      { characterId: 'c1', spanish: 'De siete a diez de la mañana.', english: 'From seven to ten in the morning.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Perfecto. Muchas gracias.', english: 'Perfect. Thank you very much.', isLearnerLine: true },
    ],
    culturalNotes: [
      '"Por supuesto" (of course) is more formal and professional than "claro" in official contexts.',
      'Hotels in Latin America often require passport registration — this is standard, not suspicious.',
      'Tipping receptionist staff is common in many Latin American countries.',
    ],
    keyVocab: ['v003', 'v007', 'v008', 'v071'],
  },

  {
    id: 'dia003',
    title: 'Reporting a Problem to Police',
    scenario: 'Emergency Situation',
    situation: 'Your bag has been stolen. You must report this at the police station. Staying calm and providing clear, factual information is essential.',
    ilrLevel: 1,
    characters: [
      { id: 'c1', name: 'Officer Torres', role: 'Police Officer', isLearner: false },
      { id: 'c2', name: 'You', role: 'Victim', isLearner: true },
    ],
    lines: [
      { characterId: 'c2', spanish: 'Disculpe, necesito reportar un robo.', english: 'Excuse me, I need to report a robbery.', isLearnerLine: true },
      { characterId: 'c1', spanish: '¿Qué pasó?', english: 'What happened?', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Me robaron la bolsa hace media hora, en la plaza central.', english: 'My bag was stolen half an hour ago, in the central plaza.', isLearnerLine: true, notes: 'Be specific about time and location' },
      { characterId: 'c1', spanish: '¿Puede describir al ladrón?', english: 'Can you describe the thief?', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Era un hombre joven, de unos veinte años, con camisa roja.', english: 'It was a young man, about twenty years old, with a red shirt.', isLearnerLine: true },
      { characterId: 'c1', spanish: '¿Qué había en la bolsa?', english: 'What was in the bag?', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Mi pasaporte, mi billetera, y mi teléfono celular.', english: 'My passport, my wallet, and my cell phone.', isLearnerLine: true },
      { characterId: 'c1', spanish: 'Necesito que llene este formulario.', english: 'I need you to fill out this form.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Entendido. ¿Podría llamar a la embajada americana?', english: 'Understood. Could you call the American embassy?', isLearnerLine: true, notes: 'Know your rights — you can request embassy contact' },
    ],
    culturalNotes: [
      'Always remain calm and cooperative with police — confrontational behavior can escalate situations.',
      'Request a police report (denuncia) — you need this for insurance and embassy assistance.',
      'In an emergency, say "Soy ciudadano americano" (I am an American citizen) to invoke consular rights.',
    ],
    keyVocab: ['v080', 'v082', 'v074', 'v073', 'v087', 'v088'],
  },

  // ─── LEVEL 2: PROFESSIONAL SITUATIONS ───────────────────────

  {
    id: 'dia004',
    title: 'Business Meeting Introduction',
    scenario: 'Professional Meeting',
    situation: 'You are meeting a senior official for the first time. First impressions matter. Use formal register, show cultural awareness, and establish rapport before getting to business.',
    ilrLevel: 1,
    characters: [
      { id: 'c1', name: 'Director Morales', role: 'Government Director', isLearner: false },
      { id: 'c2', name: 'You', role: 'Representative', isLearner: true },
    ],
    lines: [
      { characterId: 'c1', spanish: 'Buenos días. Soy el Director Morales. Bienvenido a nuestra oficina.', english: 'Good morning. I am Director Morales. Welcome to our office.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Buenos días, señor Director. Encantado de conocerle. Soy [nombre], de la embajada.', english: 'Good morning, Mr. Director. Delighted to meet you. I am [name], from the embassy.', isLearnerLine: true, notes: 'Use title + surname for senior officials' },
      { characterId: 'c1', spanish: 'El gusto es mío. ¿Tuvo un buen viaje?', english: 'The pleasure is mine. Did you have a good trip?', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Sí, muy bueno, gracias. La ciudad es hermosa.', english: 'Yes, very good, thank you. The city is beautiful.', isLearnerLine: true, notes: 'Small talk before business is expected in Latin culture' },
      { characterId: 'c1', spanish: 'Me alegra. ¿Le apetece un café?', english: 'I\'m glad. Would you like a coffee?', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Con mucho gusto, gracias.', english: 'With pleasure, thank you.', isLearnerLine: true, notes: 'Always accept hospitality — refusing is considered rude' },
      { characterId: 'c1', spanish: 'Bien. ¿De qué asuntos queremos hablar hoy?', english: 'Good. What matters did we want to discuss today?', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Principalmente, quisiera hablar sobre el acuerdo bilateral que está pendiente.', english: 'Primarily, I would like to discuss the bilateral agreement that is pending.', isLearnerLine: true, notes: 'Use quisiera (conditional) — more polite than quiero' },
    ],
    culturalNotes: [
      'In Latin American business culture, personal relationships ("personalismo") are crucial — always invest time in rapport-building.',
      'Titles matter greatly: Doctor, Licenciado, Ingeniero, Director — use them until invited to use first names.',
      'Accepting food/drink offered by a host is a sign of trust and respect.',
      'Business cards are exchanged with respect — receive them with both hands and look at them.',
    ],
    keyVocab: ['v110', 'v111', 'v117', 'v118', 'v014'],
  },

  // ─── LEVEL 3: ADVANCED OPERATIONAL DIALOGUES ─────────────────

  {
    id: 'dia005',
    title: 'Navigating a Bureaucratic Obstacle',
    scenario: 'Government Office',
    situation: 'You need a document but are being told it\'s impossible to obtain. Use persuasion, patience, and strategic communication to find a solution. This tests negotiation under bureaucratic pressure.',
    ilrLevel: 2,
    characters: [
      { id: 'c1', name: 'Official Vega', role: 'Government Clerk', isLearner: false },
      { id: 'c2', name: 'You', role: 'Foreign Representative', isLearner: true },
    ],
    lines: [
      { characterId: 'c2', spanish: 'Buenos días. Vengo a solicitar el permiso de trabajo para mis colegas.', english: 'Good morning. I\'m here to request the work permit for my colleagues.', isLearnerLine: true },
      { characterId: 'c1', spanish: 'Lo siento, pero eso no es posible. Faltan varios documentos.', english: 'I\'m sorry, but that\'s not possible. Several documents are missing.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Entiendo su preocupación. ¿Podría indicarme exactamente qué documentos faltan?', english: 'I understand your concern. Could you indicate exactly which documents are missing?', isLearnerLine: true, notes: 'Acknowledge their position before asking for specifics' },
      { characterId: 'c1', spanish: 'Necesitamos una carta de autorización del ministerio.', english: 'We need an authorization letter from the ministry.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Comprendo. Sin embargo, tengo entendido que en casos urgentes se puede proceder con una aprobación provisional. ¿Es correcto?', english: 'I understand. However, it is my understanding that in urgent cases one can proceed with provisional approval. Is that correct?', isLearnerLine: true, notes: 'Know the rules better than the bureaucrat — diplomatically' },
      { characterId: 'c1', spanish: 'Bueno... en casos especiales, sí. Pero tendría que hablar con mi supervisor.', english: 'Well... in special cases, yes. But I would have to speak with my supervisor.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Se lo agradecería mucho. Este asunto es de gran importancia para la cooperación bilateral entre nuestros países.', english: 'I would greatly appreciate it. This matter is of great importance for the bilateral cooperation between our countries.', isLearnerLine: true, notes: 'Frame the request in terms of mutual benefit' },
      { characterId: 'c1', spanish: 'De acuerdo. Voy a consultarlo ahora mismo.', english: 'All right. I\'ll consult on it right now.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Muchas gracias. Le estoy muy agradecido por su colaboración.', english: 'Thank you very much. I am very grateful for your collaboration.', isLearnerLine: true },
    ],
    culturalNotes: [
      'Never challenge authority directly — find ways to help them say yes while saving face.',
      '"Personalismo": if possible, ask who the person is rather than just citing regulations.',
      'Patience is a strategic asset — showing frustration signals weakness.',
      'Framing requests in terms of "cooperation" and "mutual benefit" is very effective in Latin American diplomatic contexts.',
    ],
    keyVocab: ['v220', 'v221', 'v222', 'v224', 'v226', 'v242', 'v244'],
  },
];

export const getDialogueById = (id: string): Dialogue | undefined =>
  spanishDialogues.find(d => d.id === id);

export const getDialoguesByLevel = (maxLevel: number): Dialogue[] =>
  spanishDialogues.filter(d => d.ilrLevel <= maxLevel);
