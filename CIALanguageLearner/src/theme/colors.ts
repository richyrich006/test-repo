// CIA Language Learner — Clean, high-contrast theme
// Inspired by Rosetta Stone: white backgrounds, bold yellow accent, readable dark text

export const Colors = {
  // ── Core Brand ────────────────────────────────────────────────
  brand: '#F59E0B',          // Amber-400 — header, highlights, accents
  brandDark: '#B45309',      // Amber-700 — text on yellow bg
  brandLight: '#FFFBEB',     // Amber-50  — tinted backgrounds
  brandBorder: '#FCD34D',    // Amber-300 — borders

  // Blue — CTAs, buttons, links, primary interactions
  primary: '#2563EB',        // Blue-600 — strong readable blue
  primaryDark: '#1D4ED8',    // Blue-700
  primaryLight: '#EFF6FF',   // Blue-50

  // ── Backgrounds ────────────────────────────────────────────────
  background: '#FFFFFF',
  backgroundAlt: '#F9FAFB',   // Gray-50
  backgroundCard: '#FFFFFF',
  backgroundMuted: '#F3F4F6', // Gray-100

  // ── Status ─────────────────────────────────────────────────────
  success: '#059669',         // Emerald-600
  successDark: '#047857',
  successLight: '#D1FAE5',    // Emerald-100
  successBg: '#ECFDF5',

  error: '#DC2626',           // Red-600
  errorDark: '#B91C1C',
  errorLight: '#FEE2E2',      // Red-100
  errorBg: '#FEF2F2',

  streak: '#EA580C',          // Orange-600
  streakLight: '#FFF7ED',     // Orange-50

  gold: '#D97706',            // Amber-600
  goldLight: '#FFFBEB',

  // ── Text (high contrast) ────────────────────────────────────────
  textPrimary: '#111827',     // Gray-900 — nearly black, max contrast
  textSecondary: '#374151',   // Gray-700 — strong secondary
  textMuted: '#6B7280',       // Gray-500 — subdued but readable
  textWhite: '#FFFFFF',
  textBrand: '#111827',       // Dark text ON yellow brand header

  // ── Borders ─────────────────────────────────────────────────────
  border: '#E5E7EB',          // Gray-200
  borderFocus: '#2563EB',

  // ── Quiz Options ─────────────────────────────────────────────────
  optionDefault: '#FFFFFF',
  optionSelected: '#EFF6FF',
  optionCorrect: '#D1FAE5',
  optionWrong: '#FEE2E2',

  // ── Unit tile colors ─────────────────────────────────────────────
  unit1: '#2563EB',   // blue
  unit2: '#DC2626',   // red
  unit3: '#059669',   // green
  unit4: '#7C3AED',   // violet
  unit5: '#EA580C',   // orange
  unit6: '#0891B2',   // cyan
  unit7: '#D97706',   // amber
  unit8: '#DB2777',   // pink
  unit9: '#1F2937',   // slate

  // ── ILR Level colors ─────────────────────────────────────────────
  ilr0: '#9CA3AF',
  ilr1: '#2563EB',
  ilr2: '#059669',
  ilr3: '#EA580C',
  ilr4: '#7C3AED',
  ilr5: '#D97706',

  // ── Legacy aliases (keep existing code working) ──────────────────
  navy: '#1E3A5F',
  navyLight: '#EFF6FF',
  accent: '#F59E0B',
  accentDark: '#B45309',
  accentLight: '#FFFBEB',
  warning: '#EA580C',
  warningLight: '#FFF7ED',
  textDark: '#111827',
  backgroundLight: '#F9FAFB',
  backgroundCard2: '#F3F4F6',
  overlay: 'rgba(0,0,0,0.5)',
  drillDialogue: '#EA580C',
  drillVocab: '#2563EB',
  drillPattern: '#7C3AED',
  drillListening: '#0891B2',
  drillPronunciation: '#DC2626',
  info: '#2563EB',
  shadow: '#00000010',
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  tile: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
};
