// CIA Language Learner - Duolingo-inspired Light Theme

export const Colors = {
  // Backgrounds
  background: '#FFFFFF',
  backgroundAlt: '#F0F4FF',
  backgroundCard: '#FFFFFF',
  backgroundMuted: '#F7F7F7',

  // Primary blue (clean, friendly)
  primary: '#4B6EF5',
  primaryDark: '#3451CC',
  primaryLight: '#E8EDFF',

  // Success / Correct (Duolingo green)
  success: '#58CC02',
  successDark: '#3E9900',
  successLight: '#D7FFB8',
  successBg: '#F0FFF0',

  // Error / Wrong
  error: '#FF4B4B',
  errorDark: '#CC2E2E',
  errorLight: '#FFE5E5',
  errorBg: '#FFF0F0',

  // Streak / Warning
  streak: '#FF9600',
  streakLight: '#FFF3E0',

  // CIA Gold — used for XP, achievements, rank
  gold: '#F5A623',
  goldLight: '#FFF8E7',

  // Navy — used for headers, lesson titles
  navy: '#1A3A5C',
  navyLight: '#E8F0FA',

  // Text
  textPrimary: '#3C3C3C',
  textSecondary: '#6B6B6B',
  textMuted: '#AFAFAF',
  textWhite: '#FFFFFF',

  // Borders & dividers
  border: '#E5E5E5',
  borderFocus: '#4B6EF5',

  // Quiz option states
  optionDefault: '#FFFFFF',
  optionSelected: '#E8EDFF',
  optionCorrect: '#D7FFB8',
  optionWrong: '#FFE5E5',

  // ILR Level colors (kept bright)
  ilr0: '#AFAFAF',
  ilr1: '#4B6EF5',
  ilr2: '#58CC02',
  ilr3: '#FF9600',
  ilr4: '#9B59B6',
  ilr5: '#F5A623',

  // Shadow
  shadow: '#00000015',

  // ── Aliases for backwards compatibility with older screens ──
  accent: '#F5A623',
  accentDark: '#C47D0E',
  accentLight: '#FFF8E7',
  warning: '#FF9600',
  warningLight: '#FFF3E0',
  textDark: '#3C3C3C',
  backgroundLight: '#F0F4FF',
  backgroundCard2: '#F7F7F7',
  overlay: 'rgba(0,0,0,0.5)',
  drillDialogue: '#FF9600',
  drillVocab: '#4B6EF5',
  drillPattern: '#9B59B6',
  drillListening: '#1ABC9C',
  drillPronunciation: '#FF4B4B',
  info: '#4B6EF5',
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: '#4B6EF5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
};
