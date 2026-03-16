import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { ILRBadge } from '../components/ILRBadge';
import { AudioButton } from '../components/AudioButton';
import { ProgressBar } from '../components/ProgressBar';
import { AgentMaya, AgentMayaInline } from '../components/AgentMaya';
import { getLessonById } from '../data/curriculum';
import { getVocabById } from '../data/spanishVocabulary';
import { getDrillById } from '../data/spanishDrills';
import { getDialogueById } from '../data/spanishDialogues';
import { VocabCard, PatternDrill, Dialogue, UserProgress } from '../types';

type LessonPhase = 'intro' | 'cultural' | 'vocabulary' | 'drills' | 'dialogue' | 'complete';

interface Props {
  lessonId: string;
  progress: UserProgress;
  onComplete: (lessonId: string, xpEarned: number, minutesSpent: number) => void;
  onBack: () => void;
}

export function LessonScreen({ lessonId, progress, onComplete, onBack }: Props) {
  const lesson = getLessonById(lessonId);
  const [phase, setPhase] = useState<LessonPhase>('intro');
  const [vocabIndex, setVocabIndex] = useState(0);
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillExIndex, setDrillExIndex] = useState(0);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [dialogueLine, setDialogueLine] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [drillAnswer, setDrillAnswer] = useState('');
  const [startTime] = useState(Date.now());

  if (!lesson) return null;

  const vocabCards: VocabCard[] = lesson.vocabulary
    .map(id => getVocabById(id))
    .filter(Boolean) as VocabCard[];

  const drills: PatternDrill[] = lesson.drills
    .map(id => getDrillById(id))
    .filter(Boolean) as PatternDrill[];

  const dialogues: Dialogue[] = lesson.dialogues
    .map(id => getDialogueById(id))
    .filter(Boolean) as Dialogue[];

  const totalPhases = [
    lesson.culturalBriefing ? 1 : 0,
    vocabCards.length > 0 ? 1 : 0,
    drills.length > 0 ? 1 : 0,
    dialogues.length > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const getProgress = (): number => {
    switch (phase) {
      case 'intro': return 0;
      case 'cultural': return 0.1;
      case 'vocabulary': return 0.1 + (vocabIndex / Math.max(vocabCards.length, 1)) * 0.35;
      case 'drills': return 0.45 + (drillIndex / Math.max(drills.length, 1)) * 0.35;
      case 'dialogue': return 0.80 + (dialogueIndex / Math.max(dialogues.length, 1)) * 0.15;
      case 'complete': return 1;
    }
  };

  const handleComplete = () => {
    const minutesSpent = Math.round((Date.now() - startTime) / 60000);
    const isAlreadyDone = progress.completedLessons.includes(lessonId);
    const xp = isAlreadyDone ? 0 : lesson.completionXP;
    onComplete(lessonId, xp, Math.max(minutesSpent, 1));
  };

  const advancePhase = useCallback(() => {
    if (phase === 'intro') {
      if (lesson.culturalBriefing) setPhase('cultural');
      else if (vocabCards.length > 0) setPhase('vocabulary');
      else if (drills.length > 0) setPhase('drills');
      else if (dialogues.length > 0) setPhase('dialogue');
      else setPhase('complete');
    } else if (phase === 'cultural') {
      if (vocabCards.length > 0) setPhase('vocabulary');
      else if (drills.length > 0) setPhase('drills');
      else if (dialogues.length > 0) setPhase('dialogue');
      else setPhase('complete');
    } else if (phase === 'vocabulary') {
      if (vocabIndex < vocabCards.length - 1) {
        setVocabIndex(i => i + 1);
      } else if (drills.length > 0) {
        setPhase('drills');
        setDrillIndex(0);
        setDrillExIndex(0);
      } else if (dialogues.length > 0) {
        setPhase('dialogue');
      } else {
        setPhase('complete');
      }
    } else if (phase === 'drills') {
      const currentDrill = drills[drillIndex];
      if (drillExIndex < currentDrill.exercises.length - 1) {
        setDrillExIndex(i => i + 1);
        setShowAnswer(false);
      } else if (drillIndex < drills.length - 1) {
        setDrillIndex(i => i + 1);
        setDrillExIndex(0);
        setShowAnswer(false);
      } else if (dialogues.length > 0) {
        setPhase('dialogue');
        setDialogueIndex(0);
        setDialogueLine(0);
      } else {
        setPhase('complete');
      }
    } else if (phase === 'dialogue') {
      const currentDialogue = dialogues[dialogueIndex];
      if (dialogueLine < currentDialogue.lines.length - 1) {
        setDialogueLine(l => l + 1);
      } else if (dialogueIndex < dialogues.length - 1) {
        setDialogueIndex(i => i + 1);
        setDialogueLine(0);
      } else {
        setPhase('complete');
      }
    }
  }, [phase, vocabIndex, drillIndex, drillExIndex, dialogueIndex, dialogueLine,
      vocabCards, drills, dialogues, lesson]);

  return (
    <LinearGradient colors={[Colors.primaryDark, Colors.background]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {
            const confirmed = typeof window !== 'undefined'
              ? window.confirm('Leave this lesson? Your progress will be lost.')
              : true;
            if (confirmed) onBack();
          }} style={styles.backBtn}>
            <Ionicons name="close" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.headerProgress}>
            <ProgressBar progress={getProgress()} height={6} color={Colors.accent} />
          </View>
          <ILRBadge level={lesson.ilrLevel} size="small" />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* ── INTRO ── */}
          {phase === 'intro' && (
            <View style={styles.phaseContainer}>
              <Text style={styles.phaseLabel}>MISSION BRIEFING</Text>
              <Text style={styles.phaseTitle}>{lesson.title}</Text>
              <Text style={styles.phaseSubtitle}>{lesson.subtitle}</Text>

              <AgentMayaInline
                mood="happy"
                message={`¡Hola! I'm Agent Maya. I'll guide you through "${lesson.title}". Ready to begin?`}
              />

              <View style={styles.objectiveCard}>
                <Text style={styles.objectiveLabel}>Learning Objective</Text>
                <Text style={styles.objectiveText}>{lesson.objective}</Text>
              </View>

              <View style={styles.lessonContents}>
                <Text style={styles.contentsTitle}>This lesson includes:</Text>
                {vocabCards.length > 0 && (
                  <ContentItem icon="📖" text={`${vocabCards.length} vocabulary cards`} />
                )}
                {drills.length > 0 && (
                  <ContentItem icon="🔄" text={`${drills.length} FSI pattern drill${drills.length > 1 ? 's' : ''}`} />
                )}
                {dialogues.length > 0 && (
                  <ContentItem icon="💬" text={`${dialogues.length} situational dialogue${dialogues.length > 1 ? 's' : ''}`} />
                )}
                {lesson.culturalBriefing && (
                  <ContentItem icon="🌎" text="Cultural intelligence briefing" />
                )}
                <ContentItem icon="⏱️" text={`~${lesson.estimatedMinutes} minutes`} />
                <ContentItem icon="⭐" text={`+${lesson.completionXP} XP on completion`} />
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={advancePhase}>
                <LinearGradient colors={[Colors.accent, Colors.accentDark]} style={styles.btnGradient}>
                  <Text style={styles.btnText}>Begin Mission →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* ── CULTURAL BRIEFING ── */}
          {phase === 'cultural' && lesson.culturalBriefing && (
            <View style={styles.phaseContainer}>
              <Text style={styles.phaseLabel}>🌎 CULTURAL INTELLIGENCE</Text>
              <Text style={styles.phaseTitle}>Cultural Briefing</Text>
              <AgentMayaInline
                mood="thinking"
                message="Cultural knowledge is your cover. Study this carefully, Agent."
              />
              <Text style={styles.culturalText}>{lesson.culturalBriefing}</Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={advancePhase}>
                <LinearGradient colors={[Colors.accent, Colors.accentDark]} style={styles.btnGradient}>
                  <Text style={styles.btnText}>Understood →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* ── VOCABULARY ── */}
          {phase === 'vocabulary' && vocabCards.length > 0 && (
            <View style={styles.phaseContainer}>
              <Text style={styles.phaseLabel}>📖 VOCABULARY</Text>
              <Text style={styles.phaseProgress}>
                Card {vocabIndex + 1} of {vocabCards.length}
              </Text>
              <VocabCardView card={vocabCards[vocabIndex]} />
              <TouchableOpacity style={styles.primaryBtn} onPress={advancePhase}>
                <LinearGradient colors={[Colors.accent, Colors.accentDark]} style={styles.btnGradient}>
                  <Text style={styles.btnText}>
                    {vocabIndex < vocabCards.length - 1 ? 'Next Card →' : 'Continue →'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* ── DRILLS ── */}
          {phase === 'drills' && drills.length > 0 && (
            <View style={styles.phaseContainer}>
              <Text style={styles.phaseLabel}>🔄 PATTERN DRILL</Text>
              <DrillView
                drill={drills[drillIndex]}
                exerciseIndex={drillExIndex}
                showAnswer={showAnswer}
                onReveal={() => setShowAnswer(true)}
                onNext={advancePhase}
              />
            </View>
          )}

          {/* ── DIALOGUE ── */}
          {phase === 'dialogue' && dialogues.length > 0 && (
            <View style={styles.phaseContainer}>
              <Text style={styles.phaseLabel}>💬 SITUATIONAL DIALOGUE</Text>
              <DialogueView
                dialogue={dialogues[dialogueIndex]}
                currentLine={dialogueLine}
                onNext={advancePhase}
              />
            </View>
          )}

          {/* ── COMPLETE ── */}
          {phase === 'complete' && (
            <View style={styles.phaseContainer}>
              <Text style={styles.completeIcon}>🎖️</Text>
              <Text style={styles.phaseLabel}>MISSION COMPLETE</Text>
              <Text style={styles.phaseTitle}>{lesson.title}</Text>

              <AgentMaya
                mood="celebrating"
                message="¡Excelente! Mission complete, Agent! Your Spanish is getting sharper."
                size="medium"
                animate
              />

              <Text style={styles.completeDesc}>Excellent work. You've completed this training module.</Text>

              <View style={styles.xpCard}>
                <Text style={styles.xpEarned}>+{progress.completedLessons.includes(lessonId) ? 0 : lesson.completionXP}</Text>
                <Text style={styles.xpEarnedLabel}>XP EARNED</Text>
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleComplete}>
                <LinearGradient colors={[Colors.success, '#27AE60']} style={styles.btnGradient}>
                  <Text style={styles.btnText}>Continue →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function ContentItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.contentItem}>
      <Text style={styles.contentIcon}>{icon}</Text>
      <Text style={styles.contentText}>{text}</Text>
    </View>
  );
}

function VocabCardView({ card }: { card: VocabCard }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.vocabCard}
        onPress={() => setFlipped(f => !f)}
        activeOpacity={0.9}
      >
        <LinearGradient colors={['#1E3A56', '#152B45']} style={styles.vocabCardGradient}>
          {!flipped ? (
            <View style={styles.vocabFront}>
              <Text style={styles.vocabSpanish}>{card.spanish}</Text>
              <Text style={styles.vocabPhonetic}>{card.phonetic}</Text>
              <AudioButton text={card.spanish} />
              <Text style={styles.tapHint}>Tap to reveal translation</Text>
            </View>
          ) : (
            <View style={styles.vocabBack}>
              <Text style={styles.vocabEnglish}>{card.english}</Text>
              {card.exampleSentence && (
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleSpanish}>{card.exampleSentence}</Text>
                  <Text style={styles.exampleEnglish}>{card.exampleTranslation}</Text>
                </View>
              )}
              {card.notes && (
                <View style={styles.noteBox}>
                  <Text style={styles.noteText}>📌 {card.notes}</Text>
                </View>
              )}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function DrillView({
  drill, exerciseIndex, showAnswer, onReveal, onNext,
}: {
  drill: PatternDrill;
  exerciseIndex: number;
  showAnswer: boolean;
  onReveal: () => void;
  onNext: () => void;
}) {
  const exercise = drill.exercises[exerciseIndex];

  return (
    <View>
      {/* Pattern explanation */}
      <View style={styles.patternCard}>
        <Text style={styles.patternLabel}>PATTERN</Text>
        <Text style={styles.patternText}>{drill.pattern}</Text>
        <Text style={styles.patternExplanation}>{drill.patternExplanation}</Text>
      </View>

      <Text style={styles.drillInstruction}>{drill.instruction}</Text>

      <View style={styles.drillExercise}>
        <Text style={styles.exerciseProgress}>
          Exercise {exerciseIndex + 1} / {drill.exercises.length}
        </Text>

        {/* Prompt */}
        <View style={styles.promptBox}>
          <Text style={styles.promptText}>{exercise.prompt}</Text>
          {exercise.audioPrompt && (
            <AudioButton text={exercise.audioPrompt} size={20} />
          )}
        </View>

        {exercise.hint && !showAnswer && (
          <Text style={styles.hintText}>💡 {exercise.hint}</Text>
        )}

        {/* Answer */}
        {showAnswer ? (
          <View>
            <View style={styles.answerBox}>
              <Text style={styles.answerLabel}>ANSWER</Text>
              <Text style={styles.answerText}>{exercise.answer}</Text>
              {exercise.audioPrompt && (
                <AudioButton text={exercise.answer} size={20} color={Colors.success} />
              )}
            </View>
            <TouchableOpacity style={styles.primaryBtn} onPress={onNext}>
              <LinearGradient colors={[Colors.accent, Colors.accentDark]} style={styles.btnGradient}>
                <Text style={styles.btnText}>
                  {exerciseIndex < drill.exercises.length - 1 ? 'Next Exercise →' : 'Continue →'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.revealBtn} onPress={onReveal}>
            <Text style={styles.revealText}>Reveal Answer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function DialogueView({
  dialogue, currentLine, onNext,
}: {
  dialogue: Dialogue;
  currentLine: number;
  onNext: () => void;
}) {
  const line = dialogue.lines[currentLine];
  const learnerChar = dialogue.characters.find(c => c.isLearner);
  const otherChar = dialogue.characters.find(c => !c.isLearner);

  return (
    <View>
      <View style={styles.dialogueHeader}>
        <Text style={styles.dialogueTitle}>{dialogue.title}</Text>
        <View style={styles.scenarioChip}>
          <Text style={styles.scenarioText}>{dialogue.scenario}</Text>
        </View>
      </View>

      <Text style={styles.situationText}>{dialogue.situation}</Text>

      {/* Characters */}
      <View style={styles.charactersRow}>
        {dialogue.characters.map(char => (
          <View key={char.id} style={[styles.characterChip, char.isLearner && styles.characterChipYou]}>
            <Text style={styles.characterName}>{char.isLearner ? '👤 You' : `🧑 ${char.name}`}</Text>
            <Text style={styles.characterRole}>{char.role}</Text>
          </View>
        ))}
      </View>

      {/* Lines leading up to current */}
      <View style={styles.dialogueLines}>
        {dialogue.lines.slice(0, currentLine + 1).map((l, i) => {
          const char = dialogue.characters.find(c => c.id === l.characterId);
          const isLearner = char?.isLearner;
          return (
            <View
              key={i}
              style={[styles.dialogueLine, isLearner ? styles.lineRight : styles.lineLeft]}
            >
              <View style={[styles.lineBubble, isLearner ? styles.bubbleLearner : styles.bubbleOther]}>
                <Text style={[styles.lineSpanish, isLearner && styles.lineSpanishLearner]}>
                  {l.spanish}
                </Text>
                <Text style={styles.lineEnglish}>{l.english}</Text>
                {l.phonetic && (
                  <Text style={styles.linePhonetic}>[{l.phonetic}]</Text>
                )}
                {l.notes && i === currentLine && (
                  <Text style={styles.lineNote}>📌 {l.notes}</Text>
                )}
                <AudioButton text={l.spanish} size={16} />
              </View>
            </View>
          );
        })}
      </View>

      {/* Cultural notes if at end */}
      {currentLine === dialogue.lines.length - 1 && dialogue.culturalNotes && (
        <View style={styles.culturalNotes}>
          <Text style={styles.culturalNotesTitle}>Cultural Intelligence Notes</Text>
          {dialogue.culturalNotes.map((note, i) => (
            <View key={i} style={styles.culturalNote}>
              <Text style={styles.culturalNoteText}>• {note}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.primaryBtn} onPress={onNext}>
        <LinearGradient colors={[Colors.accent, Colors.accentDark]} style={styles.btnGradient}>
          <Text style={styles.btnText}>
            {currentLine < dialogue.lines.length - 1 ? 'Next Line →' : 'Complete Dialogue →'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: Colors.backgroundCard,
    justifyContent: 'center', alignItems: 'center',
  },
  headerProgress: { flex: 1 },
  content: { padding: 20, paddingTop: 8 },
  phaseContainer: { gap: 16 },
  phaseLabel: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  phaseTitle: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
  },
  phaseSubtitle: { color: Colors.textSecondary, fontSize: 15, lineHeight: 22 },
  phaseProgress: { color: Colors.textMuted, fontSize: 13 },

  objectiveCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12, padding: 16,
    borderLeftWidth: 3, borderLeftColor: Colors.accent,
  },
  objectiveLabel: { color: Colors.accent, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  objectiveText: { color: Colors.textPrimary, fontSize: 15, lineHeight: 22 },

  lessonContents: { backgroundColor: Colors.backgroundCard, borderRadius: 12, padding: 16, gap: 10 },
  contentsTitle: { color: Colors.textSecondary, fontSize: 13, marginBottom: 4 },
  contentItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  contentIcon: { fontSize: 16 },
  contentText: { color: Colors.textPrimary, fontSize: 14 },

  primaryBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  btnGradient: { height: 52, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: Colors.textDark, fontWeight: '800', fontSize: 16 },

  culturalText: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12, padding: 18,
    borderLeftWidth: 3, borderLeftColor: Colors.warning,
  },

  vocabCard: { borderRadius: 16, overflow: 'hidden', minHeight: 220 },
  vocabCardGradient: { padding: 28, minHeight: 220, justifyContent: 'center' },
  vocabFront: { alignItems: 'center', gap: 12 },
  vocabSpanish: { color: Colors.textPrimary, fontSize: 36, fontWeight: '800', textAlign: 'center' },
  vocabPhonetic: { color: Colors.textMuted, fontSize: 16, fontStyle: 'italic' },
  tapHint: { color: Colors.textMuted, fontSize: 12, marginTop: 8 },
  vocabBack: { gap: 12 },
  vocabEnglish: { color: Colors.accent, fontSize: 28, fontWeight: '800' },
  exampleBox: {
    backgroundColor: Colors.backgroundLight, borderRadius: 10, padding: 12,
  },
  exampleSpanish: { color: Colors.textPrimary, fontSize: 14, fontStyle: 'italic', marginBottom: 4 },
  exampleEnglish: { color: Colors.textSecondary, fontSize: 13 },
  noteBox: { backgroundColor: Colors.warning + '20', borderRadius: 8, padding: 10 },
  noteText: { color: Colors.warning, fontSize: 13, lineHeight: 19 },

  patternCard: {
    backgroundColor: Colors.backgroundCard, borderRadius: 12, padding: 14,
    borderLeftWidth: 3, borderLeftColor: Colors.primaryLight,
  },
  patternLabel: { color: Colors.primaryLight, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  patternText: { color: Colors.textPrimary, fontSize: 13, fontFamily: 'monospace', marginBottom: 6 },
  patternExplanation: { color: Colors.textSecondary, fontSize: 12, lineHeight: 18 },
  drillInstruction: { color: Colors.textMuted, fontSize: 13, fontStyle: 'italic' },
  drillExercise: { gap: 12 },
  exerciseProgress: { color: Colors.textMuted, fontSize: 12 },
  promptBox: {
    backgroundColor: Colors.backgroundCard, borderRadius: 12, padding: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  promptText: { color: Colors.textPrimary, fontSize: 18, fontWeight: '600', flex: 1 },
  hintText: { color: Colors.textMuted, fontSize: 13, fontStyle: 'italic' },
  answerBox: {
    backgroundColor: Colors.success + '15', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: Colors.success + '40',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  answerLabel: { color: Colors.success, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  answerText: { color: Colors.textPrimary, fontSize: 18, fontWeight: '700', flex: 1 },
  revealBtn: {
    borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border,
    height: 50, justifyContent: 'center', alignItems: 'center',
  },
  revealText: { color: Colors.textSecondary, fontWeight: '600', fontSize: 15 },

  dialogueHeader: { gap: 8 },
  dialogueTitle: { color: Colors.textPrimary, fontWeight: '800', fontSize: 20 },
  scenarioChip: {
    backgroundColor: Colors.drillDialogue + '20',
    borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4,
    alignSelf: 'flex-start', borderWidth: 1, borderColor: Colors.drillDialogue + '40',
  },
  scenarioText: { color: Colors.drillDialogue, fontSize: 12, fontWeight: '600' },
  situationText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
  charactersRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  characterChip: {
    backgroundColor: Colors.backgroundCard, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.border,
  },
  characterChipYou: { borderColor: Colors.accent + '60', backgroundColor: Colors.accent + '10' },
  characterName: { color: Colors.textPrimary, fontWeight: '700', fontSize: 12 },
  characterRole: { color: Colors.textMuted, fontSize: 10, marginTop: 1 },
  dialogueLines: { gap: 10 },
  dialogueLine: { flexDirection: 'row' },
  lineRight: { justifyContent: 'flex-end' },
  lineLeft: { justifyContent: 'flex-start' },
  lineBubble: {
    maxWidth: '85%', borderRadius: 14, padding: 12, gap: 4,
  },
  bubbleLearner: { backgroundColor: Colors.accent + '25', borderWidth: 1, borderColor: Colors.accent + '50' },
  bubbleOther: { backgroundColor: Colors.backgroundCard, borderWidth: 1, borderColor: Colors.border },
  lineSpanish: { color: Colors.textPrimary, fontSize: 15, fontWeight: '600' },
  lineSpanishLearner: { color: Colors.accent },
  lineEnglish: { color: Colors.textSecondary, fontSize: 12 },
  linePhonetic: { color: Colors.textMuted, fontSize: 11, fontStyle: 'italic' },
  lineNote: { color: Colors.warning, fontSize: 11, marginTop: 2 },
  culturalNotes: {
    backgroundColor: Colors.backgroundCard, borderRadius: 12, padding: 14,
    borderLeftWidth: 3, borderLeftColor: Colors.warning,
  },
  culturalNotesTitle: { color: Colors.warning, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8 },
  culturalNote: { marginBottom: 6 },
  culturalNoteText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 18 },

  completeIcon: { fontSize: 72, textAlign: 'center' },
  completeDesc: { color: Colors.textSecondary, fontSize: 15, textAlign: 'center', lineHeight: 22 },
  xpCard: {
    backgroundColor: Colors.accent + '20', borderRadius: 14, padding: 20,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.accent + '40',
  },
  xpEarned: { color: Colors.accent, fontSize: 48, fontWeight: '800' },
  xpEarnedLabel: { color: Colors.accent, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
});
