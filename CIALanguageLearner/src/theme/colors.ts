// CIA Language Learner — Rosetta Stone-inspired clean theme

export const Colors = {
  // ── Core Brand ──────────────────────────────────────────────
  // Rosetta Stone yellow/amber — used for headers, highlights
  brand: '#F0B429',
  brandDark: '#C88F1A',
  brandLight: '#FFF9E6',
  brandBorder: '#F0B42940',

  // Blue — CTAs, buttons, links
  primary: '#1C4BCC',
  primaryDark: '#153A9E',
  primaryLight: '#EBF0FF',

  // ── Backgrounds ─────────────────────────────────────────────
  background: '#FFFFFF',
  backgroundAlt: '#F7F8FA',
  backgroundCard: '#FFFFFF',
  backgroundMuted: '#F0F2F5',

  // ── Status ──────────────────────────────────────────────────
  success: '#58CC02',
  successDark: '#3E9900',
  successLight: '#E8FFD0',
  successBg: '#F3FFF0',

  error: '#FF4B4B',
  errorDark: '#CC2E2E',
  errorLight: '#FFE8E8',
  errorBg: '#FFF5F5',

  streak: '#FF9600',
  streakLight: '#FFF3E0',

  gold: '#F0B429',
  goldLight: '#FFF9E6',

  // ── Text ────────────────────────────────────────────────────
  textPrimary: '#1A1A1A',
  textSecondary: '#555555',
  textMuted: '#999999',
  textWhite: '#FFFFFF',
  textBrand: '#1A1A1A',   // text on brand/yellow bg

  // ── Borders ─────────────────────────────────────────────────
  border: '#E5E7EB',
  borderFocus: '#1C4BCC',

  // ── Quiz Options ─────────────────────────────────────────────
  optionDefault: '#FFFFFF',
  optionSelected: '#EBF0FF',
  optionCorrect: '#E8FFD0',
  optionWrong: '#FFE8E8',

  // ── Unit tile colors (Rosetta Stone–style bold tiles) ────────
  unit1: '#1C9BF0',   // blue
  unit2: '#E05555',   // red
  unit3: '#3DB462',   // green
  unit4: '#9B59B6',   // purple
  unit5: '#F0922B',   // orange
  unit6: '#1ABC9C',   // teal
  unit7: '#E67E22',   // warm orange
  unit8: '#E74C3C',   // red (danger/health)
  unit9: '#2C3E50',   // dark navy (advanced)

  // ── ILR Level colors ─────────────────────────────────────────
  ilr0: '#AAAAAA',
  ilr1: '#1C4BCC',
  ilr2: '#3DB462',
  ilr3: '#FF9600',
  ilr4: '#9B59B6',
  ilr5: '#F0B429',

  // ── Misc aliases (for backwards compat) ─────────────────────
  navy: '#1A3A5C',
  navyLight: '#EBF0FF',
  accent: '#F0B429',
  accentDark: '#C88F1A',
  accentLight: '#FFF9E6',
  warning: '#FF9600',
  warningLight: '#FFF3E0',
  textDark: '#1A1A1A',
  backgroundLight: '#F7F8FA',
  backgroundCard2: '#F0F2F5',
  overlay: 'rgba(0,0,0,0.5)',
  drillDialogue: '#FF9600',
  drillVocab: '#1C4BCC',
  drillPattern: '#9B59B6',
  drillListening: '#1ABC9C',
  drillPronunciation: '#FF4B4B',
  info: '#1C4BCC',
  shadow: '#00000012',
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  button: {
    shadowColor: '#1C4BCC',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  tile: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
};
