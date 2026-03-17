/**
 * CIA Field Notes — replaces the broken API-based "Ask Maya" chat.
 *
 * Displays context-sensitive FSI method tips, cultural intelligence,
 * and grammar notes based on the current lesson phase and word.
 * Requires NO API key — all content is built-in.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Shadows } from '../theme/colors';

interface Note {
  icon: string;
  title: string;
  body: string;
}

interface Props {
  lessonTitle: string;
  lessonObjective?: string;
  currentPhase?: string;
  currentWord?: string;
}

// ── Built-in FSI / CIA knowledge base ─────────────────────────────

const VOCAB_NOTES: Note[] = [
  {
    icon: '🎯',
    title: 'FSI Audio-Lingual Method',
    body: 'Say each new word aloud 5× before advancing. The FSI audio-lingual method builds speaking automaticity — muscle memory in your mouth, not just recognition in your mind.',
  },
  {
    icon: '🧠',
    title: 'CIA Memory Technique',
    body: 'Create a vivid mental image linking the Spanish word\'s sound to an English scene. Example: "hablar" (to speak) → imagine a HABlative person BLARing a trumpet. The weirder the image, the better it sticks.',
  },
  {
    icon: '⏱️',
    title: 'Spaced Repetition (SRS)',
    body: 'CIA linguists review words at optimal intervals: 1 hour → 1 day → 3 days → 1 week → 2 weeks → 1 month. This follows the Ebbinghaus curve. Your Review deck is built on this science.',
  },
  {
    icon: '🔊',
    title: 'Mimicry Drill',
    body: 'Tap the audio, listen once, then repeat immediately while trying to match tone, rhythm, and mouth position exactly. The CIA calls this "acoustic mimicry" — it\'s the fastest path to a native accent.',
  },
  {
    icon: '📻',
    title: 'Immersion Prescription',
    body: 'Listen to Radio Nacional de México or Radio Caracol Colombia during any non-mental task (commute, cooking). 1hr passive exposure/day accelerates comprehension by 30% over classroom-only learners.',
  },
  {
    icon: '✍️',
    title: 'Write-It Method',
    body: 'After each new word, write a sentence using it in a real context you might face — not a textbook example. CIA candidates write situational sentences: "Necesito hablar con el embajador." (I need to speak with the ambassador.)',
  },
];

const DRILL_NOTES: Note[] = [
  {
    icon: '🔄',
    title: 'Why Pattern Drills?',
    body: 'The FSI estimates 600–750 classroom hours to reach ILR-3 in Spanish. Pattern drills automate grammar so your working memory is freed to focus on meaning, not structure. This is called "proceduralization."',
  },
  {
    icon: '⚡',
    title: 'The 3-Second Rule',
    body: 'Respond within 3 seconds in every drill. If you hesitate longer, the pattern isn\'t automatic yet — that\'s the point of the drill. FSI instructors call hesitation "the learning signal." Repeat until instant.',
  },
  {
    icon: '🎙️',
    title: 'Speak Every Response',
    body: 'Never just think the answer — say it aloud. Research shows spoken practice has 40% better retention than silent practice. FSI courses are conducted almost entirely orally for this reason.',
  },
  {
    icon: '🔁',
    title: 'Substitution Drills',
    body: 'The core FSI technique: take a pattern and substitute one element at a time. "Yo hablo" → "Tú hablas" → "Él habla." Mastering substitution drills internalizes all verb conjugations without memorizing tables.',
  },
  {
    icon: '↔️',
    title: 'Transformation Drills',
    body: 'Convert statements to questions, positive to negative, present to past. "Ella habla español" → "¿Habla ella español?" These transformations reveal how Spanish grammar WORKS rather than just what it IS.',
  },
];

const DIALOGUE_NOTES: Note[] = [
  {
    icon: '🎭',
    title: 'FSI Dialogue Memorization',
    body: 'The FSI teaches complete dialogue scripts before analyzing them. Memorize the full script, then break it apart. This mirrors how children learn language — whole utterances first, grammar analysis later.',
  },
  {
    icon: '👔',
    title: 'Tú vs. Usted — Field Critical',
    body: 'In professional and field settings, always default to "usted" until explicitly invited to use "tú." Incorrect register is an immediate credibility red flag. Educated Latin Americans notice immediately.',
  },
  {
    icon: '🌎',
    title: 'Regional Variance',
    body: 'Spanish varies significantly by country. Mexican "ahorita" = "right now" (or maybe never). Argentine "vos" replaces "tú" with different conjugations. Colombian speech is considered the clearest for learners. Know your operational region.',
  },
  {
    icon: '🤐',
    title: 'What NOT to Say',
    body: 'Avoid Americanisms: "Estoy embarazada" means "I\'m pregnant," not embarrassed. "Coger el tren" is fine in Spain but vulgar in Mexico. "Manejar" vs "conducir" — regional preference matters for authenticity.',
  },
  {
    icon: '⏸️',
    title: 'Silence & Pause',
    body: 'Latin American conversational pace often has longer pauses than American English. Filling every silence feels aggressive. CIA operatives learn to sit comfortably in pauses — it signals confidence and cultural competency.',
  },
];

const CULTURAL_NOTES: Note[] = [
  {
    icon: '🤝',
    title: 'Confianza — Trust First',
    body: 'Latin American culture is high-context and relationship-driven. "Confianza" (mutual trust) must be established BEFORE business can happen. Jumping straight to agenda is seen as rude and counterproductive.',
  },
  {
    icon: '🏢',
    title: 'Time & Meetings',
    body: 'Meetings often start 15–30 minutes after scheduled time in social contexts, but arriving late to formal appointments signals disrespect. Adapt: arrive on time, expect others to be late, never show irritation.',
  },
  {
    icon: '🍽️',
    title: 'Food as Trust Signal',
    body: 'Sharing food is a critical trust ritual. Refusing offered food is often offensive. Learn "¡Qué rico!" (How delicious!), ask about ingredients, and never decline a home-cooked meal without a serious reason.',
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Family is Everything',
    body: 'Ask about family early — it signals genuine interest. Knowing someone\'s family background (hometown, siblings, parents\' professions) is valued intelligence. People share much more after you express authentic interest in their family.',
  },
  {
    icon: '🏛️',
    title: 'Class & Education Signals',
    body: 'Vocabulary choice, grammar accuracy, and pronunciation signal education level and social class in Spanish-speaking countries. Speaking correctly communicates respect and competence. Slang is fine socially but damages professional credibility.',
  },
  {
    icon: '📞',
    title: 'Communication Style',
    body: 'Direct "no" is often avoided in favor of indirect refusals: "Qué difícil" or "Lo voy a pensar" often mean no. Learn to read these signals — pressing for a direct answer is a faux pas and damages trust.',
  },
];

const PHASE_MAP: Record<string, Note[]> = {
  intro: VOCAB_NOTES,
  cultural: CULTURAL_NOTES,
  vocabulary: VOCAB_NOTES,
  drills: DRILL_NOTES,
  dialogue: DIALOGUE_NOTES,
  complete: VOCAB_NOTES,
};

// ── Component ──────────────────────────────────────────────────────

export function AskMaya({ currentPhase = 'vocabulary' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [noteIndex, setNoteIndex] = useState(0);

  const notes = PHASE_MAP[currentPhase] ?? VOCAB_NOTES;
  const note = notes[noteIndex % notes.length];

  const phaseColors: Record<string, string> = {
    vocabulary: Colors.primary,
    drills: Colors.success,
    dialogue: '#7C3AED',
    cultural: Colors.streak,
    intro: Colors.brand,
    complete: Colors.success,
  };
  const accentColor = phaseColors[currentPhase] ?? Colors.primary;

  if (!isOpen) {
    return (
      <TouchableOpacity
        style={[styles.toggleBtn, { borderColor: accentColor + '30' }]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.toggleIcon}>📋</Text>
        <View style={styles.toggleTextBlock}>
          <Text style={[styles.toggleTitle, { color: accentColor }]}>CIA Field Notes</Text>
          <Text style={styles.toggleSub}>FSI techniques · Cultural intel · Method tips</Text>
        </View>
        <Text style={styles.toggleArrow}>›</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { borderColor: accentColor + '30' }]}>
      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: accentColor + '12' }]}>
        <Text style={styles.headerIcon}>📋</Text>
        <View style={styles.headerMiddle}>
          <Text style={[styles.headerTitle, { color: accentColor }]}>CIA Field Notes</Text>
          <Text style={styles.headerSub}>{noteIndex + 1} of {notes.length}</Text>
        </View>
        <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.closeBtn}>
          <Text style={[styles.closeText, { color: accentColor }]}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* ── Current note ── */}
      <View style={styles.noteArea}>
        <View style={[styles.noteCard, { borderLeftColor: accentColor }]}>
          <View style={styles.noteTitleRow}>
            <Text style={styles.noteIcon}>{note.icon}</Text>
            <Text style={[styles.noteTitle, { color: accentColor }]}>{note.title}</Text>
          </View>
          <Text style={styles.noteBody}>{note.body}</Text>
        </View>

        {/* ── Navigation ── */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navBtn, noteIndex === 0 && styles.navBtnDisabled]}
            onPress={() => setNoteIndex(i => Math.max(0, i - 1))}
            disabled={noteIndex === 0}
          >
            <Text style={[styles.navBtnText, noteIndex === 0 && styles.navBtnTextDisabled]}>
              ← Prev
            </Text>
          </TouchableOpacity>

          <View style={styles.dotRow}>
            {notes.map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.dot, i === noteIndex && { backgroundColor: accentColor }]}
                onPress={() => setNoteIndex(i)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: accentColor }, noteIndex === notes.length - 1 && styles.navBtnLast]}
            onPress={() => setNoteIndex(i => Math.min(notes.length - 1, i + 1))}
            disabled={noteIndex === notes.length - 1}
          >
            <Text style={styles.navBtnTextPrimary}>
              Next →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  toggleBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14, padding: 14,
    borderWidth: 1.5, ...Shadows.card,
  },
  toggleIcon: { fontSize: 20 },
  toggleTextBlock: { flex: 1 },
  toggleTitle: { fontWeight: '800', fontSize: 14 },
  toggleSub: { color: Colors.textMuted, fontSize: 12, marginTop: 1 },
  toggleArrow: { color: Colors.textMuted, fontSize: 22 },

  container: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16, borderWidth: 1.5,
    overflow: 'hidden', ...Shadows.card,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerIcon: { fontSize: 16 },
  headerMiddle: { flex: 1 },
  headerTitle: { fontWeight: '800', fontSize: 14 },
  headerSub: { color: Colors.textMuted, fontSize: 11, marginTop: 1 },
  closeBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.backgroundMuted,
    justifyContent: 'center', alignItems: 'center',
  },
  closeText: { fontSize: 13, fontWeight: '800' },

  noteArea: { padding: 14, gap: 12 },
  noteCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12, padding: 14,
    borderLeftWidth: 3, gap: 8,
  },
  noteTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  noteIcon: { fontSize: 18 },
  noteTitle: { fontWeight: '800', fontSize: 14, flex: 1 },
  noteBody: {
    color: Colors.textSecondary, fontSize: 14, lineHeight: 21,
  },

  navRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  navBtn: {
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: Colors.backgroundMuted,
  },
  navBtnDisabled: { opacity: 0.3 },
  navBtnLast: { opacity: 0.3 },
  navBtnText: { color: Colors.textSecondary, fontWeight: '700', fontSize: 13 },
  navBtnTextDisabled: { color: Colors.textMuted },
  navBtnTextPrimary: { color: Colors.textWhite, fontWeight: '800', fontSize: 13 },

  dotRow: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  dot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: Colors.border,
  },
});
