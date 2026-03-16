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

  // ─── LEVEL 1: DAILY LIFE SITUATIONS ─────────────────────────

  {
    id: 'dia006',
    title: 'At the Restaurant',
    scenario: 'Dining Out',
    situation: 'You are dining at a local restaurant. Practice ordering food professionally, handling dietary restrictions, and interacting with your server — a routine but operationally important social skill.',
    ilrLevel: 0,
    characters: [
      { id: 'c1', name: 'Waiter (Mesero)', role: 'Restaurant Server', isLearner: false },
      { id: 'c2', name: 'You', role: 'Diner', isLearner: true },
    ],
    lines: [
      { characterId: 'c1', spanish: 'Buenas noches. ¿Están listos para ordenar?', english: 'Good evening. Are you ready to order?', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Sí, gracias. ¿Qué recomienda usted?', english: 'Yes, thank you. What do you recommend?', isLearnerLine: true, phonetic: 'see, GRAH-syahs. keh reh-koh-MYEHN-dah oos-TEHD' },
      { characterId: 'c1', spanish: 'El caldo de res está muy bueno hoy. También tenemos enchiladas verdes.', english: 'The beef soup is very good today. We also have green enchiladas.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Quisiera las enchiladas, por favor. ¿Tienen algo sin gluten?', english: 'I would like the enchiladas, please. Do you have anything gluten-free?', isLearnerLine: true, phonetic: 'kee-SYEH-rah lahs ehn-chee-LAH-dahs, por fah-BOR' },
      { characterId: 'c1', spanish: 'Sí, los tamales son sin gluten. ¿Y para tomar?', english: 'Yes, the tamales are gluten-free. And to drink?', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Agua mineral, por favor. Sin hielo.', english: 'Sparkling water, please. No ice.', isLearnerLine: true, phonetic: 'AH-gwah mee-neh-RAHL, por fah-BOR. seen YEH-loh' },
      { characterId: 'c1', spanish: 'Perfecto. ¿Algo más?', english: 'Perfect. Anything else?', isLearnerLine: false },
      { characterId: 'c2', spanish: 'No, eso es todo por ahora. Gracias.', english: 'No, that is all for now. Thank you.', isLearnerLine: true },
      { characterId: 'c1', spanish: 'Enseguida le traigo su orden.', english: 'I will bring your order right away.', isLearnerLine: false },
      { characterId: 'c2', spanish: '¿Me puede traer la cuenta cuando pueda?', english: 'Could you bring me the bill when you can?', isLearnerLine: true, phonetic: 'meh PWEH-deh trah-EHR lah KWEHN-tah KWAHN-doh PWEH-dah' },
    ],
    culturalNotes: [
      '"Mesero" is used in Mexico; "camarero" or "mozo" in other countries — learn the local term.',
      'In Latin America, the waiter will NOT bring your check until you ask — it is considered rude to rush diners.',
      'Tipping (propina) is expected: 10-15% is standard; 20% is generous.',
      'Dietary restrictions are a recent concept — explain clearly and verify, as "sin gluten" may not be well understood everywhere.',
    ],
    keyVocab: ['v300', 'v301', 'v302', 'v303', 'v304', 'v305', 'v306', 'v307', 'v308'],
  },

  {
    id: 'dia007',
    title: 'At the Doctor\'s Office',
    scenario: 'Medical Situation',
    situation: 'You are not feeling well and need to visit a local doctor. Describing symptoms accurately in a foreign language is a critical health and safety skill.',
    ilrLevel: 1,
    characters: [
      { id: 'c1', name: 'Dr. Herrera', role: 'Physician', isLearner: false },
      { id: 'c2', name: 'You', role: 'Patient', isLearner: true },
    ],
    lines: [
      { characterId: 'c1', spanish: 'Buenos días. ¿Cómo se siente?', english: 'Good morning. How are you feeling?', isLearnerLine: false },
      { characterId: 'c2', spanish: 'No me siento bien. Me duele la cabeza y tengo fiebre desde ayer.', english: 'I don\'t feel well. My head hurts and I have had a fever since yesterday.', isLearnerLine: true, phonetic: 'noh meh SYEHN-toh byehn. meh DWEH-leh lah kah-BEH-sah ee TEHN-goh FYEH-breh' },
      { characterId: 'c1', spanish: '¿Tiene otros síntomas? ¿Tos, dolor de garganta?', english: 'Do you have other symptoms? Cough, sore throat?', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Sí, tengo un poco de tos y me duele el estómago.', english: 'Yes, I have a bit of a cough and my stomach hurts.', isLearnerLine: true },
      { characterId: 'c1', spanish: '¿Es alérgico a algún medicamento?', english: 'Are you allergic to any medication?', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Soy alérgico a la penicilina.', english: 'I am allergic to penicillin.', isLearnerLine: true, notes: 'Critical — always know how to communicate medical allergies', phonetic: 'soy ah-LEHR-hee-koh ah lah peh-nee-see-LEE-nah' },
      { characterId: 'c1', spanish: 'De acuerdo. Voy a examinarlo. Abra la boca, por favor.', english: 'Very well. I am going to examine you. Open your mouth, please.', isLearnerLine: false },
      { characterId: 'c2', spanish: '¿Es grave?', english: 'Is it serious?', isLearnerLine: true },
      { characterId: 'c1', spanish: 'No, es una infección leve. Le voy a recetar antibióticos y reposo.', english: 'No, it is a mild infection. I am going to prescribe antibiotics and rest.', isLearnerLine: false },
      { characterId: 'c2', spanish: '¿Dónde puedo comprar la medicina?', english: 'Where can I buy the medicine?', isLearnerLine: true },
    ],
    culturalNotes: [
      'In Latin America, pharmacies (farmacias) often give basic medical advice and sell many drugs without a prescription.',
      'Private clinics (clínicas) typically have shorter wait times than public hospitals.',
      'Always carry your blood type, known allergies, and emergency contacts in the local language.',
      '"Me duele" = it hurts me (body part). "Tengo dolor de..." = I have pain in... Both are correct.',
    ],
    keyVocab: ['v400', 'v401', 'v402', 'v403', 'v404', 'v405', 'v406', 'v407'],
  },

  {
    id: 'dia008',
    title: 'Asking for Directions',
    scenario: 'Navigation',
    situation: 'You are lost and need to find your way to an important location. Practice asking for and understanding directions — a fundamental operational mobility skill.',
    ilrLevel: 0,
    characters: [
      { id: 'c1', name: 'Local Resident', role: 'Passerby', isLearner: false },
      { id: 'c2', name: 'You', role: 'Traveler', isLearner: true },
    ],
    lines: [
      { characterId: 'c2', spanish: 'Disculpe, ¿sabe usted dónde está el Banco Nacional?', english: 'Excuse me, do you know where the National Bank is?', isLearnerLine: true, phonetic: 'dees-KOOL-peh, SAH-beh oos-TEHD DON-deh ehs-TAH ehl BAN-koh nah-syoh-NAHL' },
      { characterId: 'c1', spanish: 'Sí, claro. Siga derecho dos cuadras, luego doble a la derecha.', english: 'Yes, of course. Go straight two blocks, then turn right.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Perdone, ¿puede repetir más despacio? No entiendo bien.', english: 'Excuse me, can you repeat more slowly? I don\'t understand well.', isLearnerLine: true, phonetic: 'pehr-DOH-neh, PWEH-deh reh-peh-TEER mahs dehs-PAH-syoh' },
      { characterId: 'c1', spanish: 'Con gusto. Siga... derecho... dos cuadras. Luego... doble... a la derecha. El banco está en la esquina.', english: 'Of course. Go... straight... two blocks. Then... turn... right. The bank is on the corner.', isLearnerLine: false },
      { characterId: 'c2', spanish: '¿Está lejos de aquí?', english: 'Is it far from here?', isLearnerLine: true },
      { characterId: 'c1', spanish: 'No, está a unos cinco minutos caminando.', english: 'No, it is about five minutes walking.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Muchas gracias. Usted es muy amable.', english: 'Thank you very much. You are very kind.', isLearnerLine: true, phonetic: 'MOO-chahs GRAH-syahs. oos-TEHD ehs moo-ee ah-MAH-bleh' },
      { characterId: 'c1', spanish: 'De nada. ¡Buen provecho en el banco!', english: 'You\'re welcome. Good luck at the bank!', isLearnerLine: false },
    ],
    culturalNotes: [
      'Latin Americans are generally very willing to help with directions — do not hesitate to ask.',
      'Directions often use landmarks ("at the corner past the church") rather than street names.',
      '"Una cuadra" = one city block. Distances are often expressed in cuadras.',
      'Always confirm by repeating back what you understood: "Entonces, ¿dos cuadras y luego a la derecha?"',
    ],
    keyVocab: ['v350', 'v351', 'v352', 'v353', 'v354', 'v355', 'v356'],
  },

  {
    id: 'dia009',
    title: 'Shopping at the Market',
    scenario: 'Market Transaction',
    situation: 'You are buying items at a local market. Practice negotiating prices, describing quantities, and completing transactions — key skills for operating in any local economy.',
    ilrLevel: 1,
    characters: [
      { id: 'c1', name: 'Vendor (Vendedor)', role: 'Market Vendor', isLearner: false },
      { id: 'c2', name: 'You', role: 'Customer', isLearner: true },
    ],
    lines: [
      { characterId: 'c2', spanish: 'Buenas tardes. ¿Cuánto cuesta esto?', english: 'Good afternoon. How much does this cost?', isLearnerLine: true },
      { characterId: 'c1', spanish: 'Ese artículo cuesta doscientos pesos, señor.', english: 'That item costs two hundred pesos, sir.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Hmm. ¿Me puede hacer un descuento?', english: 'Hmm. Can you give me a discount?', isLearnerLine: true, phonetic: 'meh PWEH-deh ah-SEHR oon dehs-KWEHN-toh', notes: 'Bargaining is expected and respected in markets' },
      { characterId: 'c1', spanish: 'Bueno, para usted lo dejo en ciento ochenta.', english: 'Well, for you I\'ll leave it at one hundred eighty.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Está bien. Voy a llevar dos.', english: 'That\'s fine. I\'ll take two.', isLearnerLine: true },
      { characterId: 'c1', spanish: 'Son trescientos sesenta en total.', english: 'That is three hundred sixty total.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Aquí tiene. ¿Me da una bolsa, por favor?', english: 'Here you go. Can you give me a bag, please?', isLearnerLine: true },
      { characterId: 'c1', spanish: 'Por supuesto. Gracias por su compra.', english: 'Of course. Thank you for your purchase.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Gracias. ¿Acepta tarjetas de crédito?', english: 'Thank you. Do you accept credit cards?', isLearnerLine: true },
    ],
    culturalNotes: [
      'Bargaining (regatear) is expected in markets but NOT in stores with fixed prices — read the context.',
      'Asking for a discount is not rude — it is part of the social ritual of market shopping.',
      'Always count your change before leaving a vendor — mistakes happen and this is normal practice.',
      'Large bills may be refused for small purchases — carry small bills and coins (sencillo/feria).',
    ],
    keyVocab: ['v330', 'v331', 'v332', 'v333', 'v334', 'v335', 'v336', 'v337'],
  },

  {
    id: 'dia010',
    title: 'Making a Phone Call',
    scenario: 'Telephone Communication',
    situation: 'You need to make an important phone call to arrange a meeting. Phone communication removes visual cues and requires extra linguistic clarity — a significant operational challenge.',
    ilrLevel: 1,
    characters: [
      { id: 'c1', name: 'Secretary (Secretaria)', role: 'Office Secretary', isLearner: false },
      { id: 'c2', name: 'You', role: 'Caller', isLearner: true },
    ],
    lines: [
      { characterId: 'c1', spanish: 'Ministerio de Relaciones Exteriores, buenos días.', english: 'Ministry of Foreign Relations, good morning.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Buenos días. Quisiera hablar con el señor Reyes, por favor.', english: 'Good morning. I would like to speak with Mr. Reyes, please.', isLearnerLine: true, phonetic: 'BWEH-nohs DEE-ahs. kee-SYEH-rah ah-BLAHR kohn ehl seh-NYOR REH-yehs' },
      { characterId: 'c1', spanish: '¿De parte de quién, por favor?', english: 'From whom, please?', isLearnerLine: false },
      { characterId: 'c2', spanish: 'De parte del señor [nombre], de la embajada americana.', english: 'From Mr. [name], from the American embassy.', isLearnerLine: true, notes: 'Always identify yourself fully when calling an office' },
      { characterId: 'c1', spanish: 'Un momento, por favor. Voy a comunicarle.', english: 'One moment, please. I will connect you.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Gracias.', english: 'Thank you.', isLearnerLine: true },
      { characterId: 'c1', spanish: 'Lo siento, el señor Reyes no está disponible en este momento. ¿Desea dejar un mensaje?', english: 'I\'m sorry, Mr. Reyes is not available at this moment. Would you like to leave a message?', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Sí, por favor. Dígale que llamé y que le llame cuando pueda. Mi número es el cuatro-cuatro-tres, dos-dos-ocho-uno.', english: 'Yes, please. Tell him that I called and to call me when he can. My number is 443-2281.', isLearnerLine: true, notes: 'Latin Americans often say phone numbers in pairs' },
      { characterId: 'c1', spanish: 'Muy bien, le daré el recado.', english: 'Very well, I will give him the message.', isLearnerLine: false },
      { characterId: 'c2', spanish: 'Muchas gracias. Hasta luego.', english: 'Thank you very much. Goodbye.', isLearnerLine: true },
    ],
    culturalNotes: [
      '"¿De parte de quién?" (From whom?) is the standard way to ask who is calling — always have your answer ready.',
      'Identify your institution clearly: "de la embajada americana" opens doors that your name alone may not.',
      'Leaving a clear message is an art: name, institution, number, and brief reason for calling.',
      'Phone calls in Latin American offices may involve multiple transfers and waiting — patience is professional.',
    ],
    keyVocab: ['v420', 'v421', 'v422', 'v423', 'v424'],
  },
];

export const getDialogueById = (id: string): Dialogue | undefined =>
  spanishDialogues.find(d => d.id === id);

export const getDialoguesByLevel = (maxLevel: number): Dialogue[] =>
  spanishDialogues.filter(d => d.ilrLevel <= maxLevel);
