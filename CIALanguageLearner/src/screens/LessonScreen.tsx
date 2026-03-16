import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../theme/colors';
import { ILRBadge } from '../components/ILRBadge';
import { AudioButton } from '../components/AudioButton';
import { ProgressBar } from '../components/ProgressBar';
import { AgentMaya, AgentMayaInline } from '../components/AgentMaya';
import { AskMaya } from '../components/AskMaya';
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
        setPhase('drills'); setDrillIndex(0); setDrillExIndex(0);
      } else if (dialogues.length > 0) {
        setPhase('dialogue');
      } else {
        setPhase('complete');
      }
    } else if (phase === 'drills') {
      const currentDrill = drills[drillIndex];
      if (drillExIndex < currentDrill.exercises.length - 1) {
        setDrillExIndex(i => i + 1); setShowAnswer(false);
      } else if (drillIndex < drills.length - 1) {
        setDrillIndex(i => i + 1); setDrillExIndex(0); setShowAnswer(false);
      } else if (dialogues.length > 0) {
        setPhase('dialogue'); setDialogueIndex(0); setDialogueLine(0);
      } else {
        setPhase('complete');
      }
    } else if (phase === 'dialogue') {
      const currentDialogue = dialogues[dialogueIndex];
      if (dialogueLine < currentDialogue.lines.length - 1) {
        setDialogueLine(l => l + 1);
      } else if (dialogueIndex < dialogues.length - 1) {
        setDialogueIndex(i => i + 1); setDialogueLine(0);
      } else {
        setPhase('complete');
      }
    }
  }, [phase, vocabIndex, drillIndex, drillExIndex, dialogueIndex, dialogueLine,
      vocabCards, drills, dialogues, lesson]);

  const phaseColors: Record<LessonPhase, string> = {
    intro: Colors.brand,
    cultural: Colors.streak,
    vocabulary: Colors.primary,
    drills: Colors.success,
    dialogue: '#9B59B6',
    complete: Colors.success,
  };
  const headerColor = phaseColors[phase];

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header ── */}
      <View style={[styles.header, { borderBottomColor: headerColor + '30' }]}>
        <TouchableOpacity onPress={() => {
          Alert.alert(
            'Leave Lesson',
            'Leave this lesson? Your progress will be lost.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Leave', style: 'destructive', onPress: onBack },
            ]
          );
        }} style={styles.backBtn}>
          <Ionicons name="close" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.headerMiddle}>
          <ProgressBar progress={getProgress()} height={8} color={headerColor} />
          <Text style={[styles.phaseChip, { color: headerColor }]}>
            {getPhaseName(phase)}
          </Text>
        </View>
        <ILRBadge level={lesson.ilrLevel} size="small" />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── INTRO ── */}
        {phase === 'intro' && (
          <View style={styles.phaseContainer}>
            <Text style={styles.phaseTitle}>{lesson.title}</Text>
            <Text style={styles.phaseSubtitle}>{lesson.subtitle}</Text>

            <AgentMayaInline
              mood="happy"
              message={`¡Hola! I'm Agent Maya. I'll guide you through this lesson. Ready to begin?`}
            />

            <View style={[styles.objectiveCard, { borderLeftColor: Colors.brand }]}>
              <Text style={[styles.objectiveLabel, { color: Colors.brand }]}>LEARNING OBJECTIVE</Text>
              <Text style={styles.objectiveText}>{lesson.objective}</Text>
            </View>

            <View style={styles.contentsCard}>
              <Text style={styles.contentsTitle}>This lesson includes:</Text>
              {vocabCards.length > 0 && <ContentItem icon="📖" text={`${vocabCards.length} vocabulary cards`} />}
              {drills.length > 0 && <ContentItem icon="🔄" text={`${drills.length} FSI pattern drill${drills.length > 1 ? 's' : ''}`} />}
              {dialogues.length > 0 && <ContentItem icon="💬" text={`${dialogues.length} situational dialogue${dialogues.length > 1 ? 's' : ''}`} />}
              {lesson.culturalBriefing && <ContentItem icon="🌎" text="Cultural intelligence briefing" />}
              <ContentItem icon="⏱️" text={`~${lesson.estimatedMinutes} minutes`} />
              <ContentItem icon="⭐" text={`+${lesson.completionXP} XP on completion`} />
            </View>

            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: Colors.primary }]} onPress={advancePhase}>
              <Text style={styles.btnText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── CULTURAL BRIEFING ── */}
        {phase === 'cultural' && lesson.culturalBriefing && (
          <View style={styles.phaseContainer}>
            <View style={[styles.phaseBadge, { backgroundColor: Colors.streakLight }]}>
              <Text style={[styles.phaseBadgeText, { color: Colors.streak }]}>🌎 CULTURAL INTELLIGENCE BRIEFING</Text>
            </View>
            <Text style={styles.phaseTitle}>Field Intelligence</Text>
            <Text style={styles.phaseSubtitle}>
              The CIA's Foreign Language Program treats cultural fluency as equal to
              linguistic fluency. Language without cultural context creates operational risk.
            </Text>

            {/* Main cultural briefing */}
            <View style={[styles.culturalCard, { borderLeftColor: Colors.streak }]}>
              <Text style={[styles.culturalCardLabel, { color: Colors.streak }]}>SITUATION BRIEF</Text>
              <Text style={styles.culturalText}>{lesson.culturalBriefing}</Text>
            </View>

            {/* Immersion simulation */}
            <View style={styles.immersionCard}>
              <Text style={styles.immersionTitle}>🎭 IMMERSION SIMULATION</Text>
              <Text style={styles.immersionBody}>
                Before starting this lesson, imagine you are in a professional setting in
                Mexico City, Bogotá, or Buenos Aires. You are meeting a local contact for
                the first time. You must establish rapport ("confianza") before any
                substantive conversation.
              </Text>
              <View style={styles.immersionChecklist}>
                <ImmersionItem text='Greet formally with "buenos días / buenas tardes" — NOT "hola"' />
                <ImmersionItem text='Use "usted" unless they switch to "tú" first' />
                <ImmersionItem text='Comment on something personal before business: their city, family, or a recent event' />
                <ImmersionItem text="Allow pauses — don't rush to fill silence" />
              </View>
            </View>

            {/* Regional note */}
            <View style={[styles.regionalNote, { borderColor: Colors.primary + '30' }]}>
              <Text style={styles.regionalNoteTitle}>🗺️ REGIONAL INTELLIGENCE</Text>
              <Text style={styles.regionalNoteText}>
                Spanish varies significantly across Latin America. Mexican Spanish (the FSI
                standard) uses "ustedes" for all plural address. In Argentina and Uruguay,
                "vos" replaces "tú" with different verb endings. Colombia's Bogotá accent
                is considered the clearest and is ideal for learners. Adapt your register
                to the local context.
              </Text>
            </View>

            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: Colors.primary }]} onPress={advancePhase}>
              <Text style={styles.btnText}>Briefing Acknowledged →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── VOCABULARY ── */}
        {phase === 'vocabulary' && vocabCards.length > 0 && (
          <View style={styles.phaseContainer}>
            <View style={[styles.phaseBadge, { backgroundColor: Colors.primaryLight }]}>
              <Text style={[styles.phaseBadgeText, { color: Colors.primary }]}>📖 VOCABULARY</Text>
            </View>

            {/* Counter */}
            <View style={styles.vocabCounterRow}>
              <Text style={styles.vocabCounter}>{vocabIndex + 1} of {vocabCards.length} words</Text>
            </View>

            <VocabCardView key={vocabIndex} card={vocabCards[vocabIndex]} />

            {/* Prev / Next navigation */}
            <View style={styles.vocabNavRow}>
              <TouchableOpacity
                style={[styles.vocabNavBtn, vocabIndex === 0 && styles.vocabNavBtnDisabled]}
                onPress={() => { setVocabIndex(i => Math.max(0, i - 1)); }}
                disabled={vocabIndex === 0}
              >
                <Text style={[styles.vocabNavText, vocabIndex === 0 && styles.vocabNavTextDisabled]}>
                  ← Previous
                </Text>
              </TouchableOpacity>

              {/* Dot indicators */}
              {vocabCards.length <= 10 && (
                <View style={styles.dotRow}>
                  {vocabCards.map((_, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[styles.dot, i === vocabIndex && styles.dotActive]}
                      onPress={() => setVocabIndex(i)}
                    />
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.vocabNavBtn, styles.vocabNavBtnNext,
                  vocabIndex === vocabCards.length - 1 && styles.vocabNavBtnEnd,
                ]}
                onPress={advancePhase}
              >
                <Text style={styles.vocabNavTextNext}>
                  {vocabIndex < vocabCards.length - 1 ? 'Next →' : 'Continue →'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── DRILLS ── */}
        {phase === 'drills' && drills.length > 0 && (
          <View style={styles.phaseContainer}>
            <View style={[styles.phaseBadge, { backgroundColor: Colors.successLight }]}>
              <Text style={[styles.phaseBadgeText, { color: Colors.successDark }]}>🔄 PATTERN DRILL</Text>
            </View>
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
            <View style={[styles.phaseBadge, { backgroundColor: '#F3E8FF' }]}>
              <Text style={[styles.phaseBadgeText, { color: '#7C3AED' }]}>💬 DIALOGUE</Text>
            </View>
            <DialogueView
              dialogue={dialogues[dialogueIndex]}
              currentLine={dialogueLine}
              onNext={advancePhase}
            />
          </View>
        )}

        {/* ── COMPLETE ── */}
        {phase === 'complete' && (
          <View style={[styles.phaseContainer, styles.completeContainer]}>
            <Text style={styles.completeIcon}>🎖️</Text>

            <AgentMaya
              mood="celebrating"
              message="¡Excelente! Lesson complete, Agent!"
              size="medium"
              animate
            />

            <Text style={styles.completeTitle}>Lesson Complete!</Text>
            <Text style={styles.completeDesc}>{lesson.title}</Text>

            <View style={styles.xpCard}>
              <Text style={styles.xpEarned}>
                +{progress.completedLessons.includes(lessonId) ? 0 : lesson.completionXP}
              </Text>
              <Text style={styles.xpLabel}>XP EARNED</Text>
            </View>

            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: Colors.success }]} onPress={handleComplete}>
              <Text style={styles.btnText}>Continue →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Ask Maya AI Chat ── */}
        {phase !== 'complete' && (
          <View style={styles.askMayaWrapper}>
            <AskMaya
              lessonTitle={lesson.title}
              lessonObjective={lesson.objective}
              currentPhase={phase}
              currentWord={
                phase === 'vocabulary' && vocabCards[vocabIndex]
                  ? `${vocabCards[vocabIndex].spanish} (${vocabCards[vocabIndex].english})`
                  : phase === 'drills' && drills[drillIndex]
                  ? drills[drillIndex].title
                  : phase === 'dialogue' && dialogues[dialogueIndex]
                  ? dialogues[dialogueIndex].title
                  : undefined
              }
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Helper ─────────────────────────────────────────────────────────

function getPhaseName(phase: LessonPhase): string {
  switch (phase) {
    case 'intro': return 'Introduction';
    case 'cultural': return 'Cultural Briefing';
    case 'vocabulary': return 'Vocabulary';
    case 'drills': return 'Pattern Drills';
    case 'dialogue': return 'Dialogue';
    case 'complete': return 'Complete';
  }
}

// ── Sub-components ─────────────────────────────────────────────────

function ImmersionItem({ text }: { text: string }) {
  return (
    <View style={styles.immersionItem}>
      <Text style={styles.immersionBullet}>▸</Text>
      <Text style={styles.immersionItemText}>{text}</Text>
    </View>
  );
}

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
    <TouchableOpacity
      style={[styles.vocabCard, flipped && styles.vocabCardFlipped]}
      onPress={() => setFlipped(f => !f)}
      activeOpacity={0.92}
    >
      {!flipped ? (
        <View style={styles.vocabFront}>
          <Text style={styles.vocabSpanish}>{card.spanish}</Text>
          {card.phonetic ? (
            <Text style={styles.vocabPhonetic}>{card.phonetic}</Text>
          ) : null}
          <AudioButton text={card.spanish} />
          <View style={styles.tapHintRow}>
            <Text style={styles.tapHint}>Tap to reveal translation</Text>
          </View>
        </View>
      ) : (
        <View style={styles.vocabBack}>
          <Text style={styles.vocabEnglish}>{card.english}</Text>
          {card.exampleSentence ? (
            <View style={styles.exampleBox}>
              <Text style={styles.exampleSpanish}>"{card.exampleSentence}"</Text>
              <Text style={styles.exampleEnglish}>{card.exampleTranslation}</Text>
            </View>
          ) : null}
          {card.notes ? (
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>📌 {card.notes}</Text>
            </View>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
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
    <View style={{ gap: 14 }}>
      <Text style={styles.drillTitle}>{drill.title}</Text>

      <View style={styles.patternCard}>
        <Text style={styles.patternLabel}>PATTERN</Text>
        <Text style={styles.patternText}>{drill.pattern}</Text>
        <Text style={styles.patternExplanation}>{drill.patternExplanation}</Text>
      </View>

      <Text style={styles.drillInstruction}>{drill.instruction}</Text>

      <View style={styles.drillExercise}>
        <Text style={styles.exerciseProgress}>
          Exercise {exerciseIndex + 1} of {drill.exercises.length}
        </Text>

        <View style={styles.promptBox}>
          <Text style={styles.promptText}>{exercise.prompt}</Text>
          {exercise.audioPrompt && <AudioButton text={exercise.audioPrompt} size={20} />}
        </View>

        {exercise.hint && !showAnswer && (
          <Text style={styles.hintText}>💡 {exercise.hint}</Text>
        )}

        {showAnswer ? (
          <View style={{ gap: 12 }}>
            <View style={styles.answerBox}>
              <Text style={styles.answerLabel}>ANSWER</Text>
              <Text style={styles.answerText}>{exercise.answer}</Text>
              {exercise.audioPrompt && (
                <AudioButton text={exercise.answer} size={20} color={Colors.success} />
              )}
            </View>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: Colors.primary }]} onPress={onNext}>
              <Text style={styles.btnText}>
                {exerciseIndex < drill.exercises.length - 1 ? 'Next Exercise →' : 'Continue →'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.revealBtn} onPress={onReveal}>
            <Text style={styles.revealText}>Show Answer</Text>
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

  return (
    <View style={{ gap: 14 }}>
      <Text style={styles.dialogueTitle}>{dialogue.title}</Text>
      <Text style={styles.situationText}>{dialogue.situation}</Text>

      <View style={styles.charactersRow}>
        {dialogue.characters.map(char => (
          <View key={char.id} style={[styles.characterChip, char.isLearner && styles.characterChipYou]}>
            <Text style={styles.characterName}>{char.isLearner ? '👤 You' : `🧑 ${char.name}`}</Text>
            <Text style={styles.characterRole}>{char.role}</Text>
          </View>
        ))}
      </View>

      <View style={styles.dialogueLines}>
        {dialogue.lines.slice(0, currentLine + 1).map((l, i) => {
          const char = dialogue.characters.find(c => c.id === l.characterId);
          const isLearner = char?.isLearner;
          return (
            <View key={i} style={[styles.dialogueLine, isLearner ? styles.lineRight : styles.lineLeft]}>
              <View style={[styles.lineBubble, isLearner ? styles.bubbleLearner : styles.bubbleOther]}>
                <Text style={[styles.lineSpanish, isLearner && styles.lineSpanishLearner]}>
                  {l.spanish}
                </Text>
                <Text style={styles.lineEnglish}>{l.english}</Text>
                {l.phonetic && <Text style={styles.linePhonetic}>[{l.phonetic}]</Text>}
                {l.notes && i === currentLine && (
                  <Text style={styles.lineNote}>📌 {l.notes}</Text>
                )}
                <AudioButton text={l.spanish} size={16} />
              </View>
            </View>
          );
        })}
      </View>

      {currentLine === dialogue.lines.length - 1 && dialogue.culturalNotes && (
        <View style={styles.culturalNotes}>
          <Text style={styles.culturalNotesTitle}>🌎 Cultural Notes</Text>
          {dialogue.culturalNotes.map((note, i) => (
            <Text key={i} style={styles.culturalNoteText}>• {note}</Text>
          ))}
        </View>
      )}

      <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: Colors.primary }]} onPress={onNext}>
        <Text style={styles.btnText}>
          {currentLine < dialogue.lines.length - 1 ? 'Next Line →' : 'Complete Dialogue →'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.backgroundAlt },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 14,
    gap: 12, backgroundColor: Colors.backgroundCard,
    borderBottomWidth: 2,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.backgroundMuted,
    justifyContent: 'center', alignItems: 'center',
  },
  headerMiddle: { flex: 1, gap: 4 },
  phaseChip: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },

  content: { padding: 20, paddingTop: 16, paddingBottom: 28, gap: 0 },
  phaseContainer: { gap: 16 },
  askMayaWrapper: { marginTop: 20 },

  // Phase badge
  phaseBadge: {
    alignSelf: 'flex-start', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  phaseBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },

  // Titles
  phaseTitle: {
    fontSize: 26, fontWeight: '800', color: Colors.textPrimary, lineHeight: 32,
  },
  phaseSubtitle: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22 },

  progressChipRow: { flexDirection: 'row', alignItems: 'center' },
  progressChip: {
    fontSize: 13, color: Colors.textMuted, fontWeight: '600',
  },

  // ── Vocab navigation ──
  vocabCounterRow: { flexDirection: 'row', justifyContent: 'center' },
  vocabCounter: { color: Colors.textMuted, fontSize: 13, fontWeight: '600' },
  vocabNavRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 4,
  },
  vocabNavBtn: {
    borderRadius: 12, paddingHorizontal: 18, paddingVertical: 12,
    backgroundColor: Colors.backgroundMuted,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  vocabNavBtnDisabled: { opacity: 0.3 },
  vocabNavBtnNext: {
    backgroundColor: Colors.primary, borderColor: Colors.primary,
    ...Shadows.button,
  },
  vocabNavBtnEnd: { backgroundColor: Colors.success, borderColor: Colors.success },
  vocabNavText: { color: Colors.textSecondary, fontWeight: '700', fontSize: 14 },
  vocabNavTextDisabled: { color: Colors.textMuted },
  vocabNavTextNext: { color: Colors.textWhite, fontWeight: '800', fontSize: 14 },
  dotRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: { backgroundColor: Colors.primary, width: 10, height: 10, borderRadius: 5 },

  // Objective / intro cards
  objectiveCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14, padding: 16,
    borderLeftWidth: 4, ...Shadows.card,
  },
  objectiveLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 6 },
  objectiveText: { color: Colors.textPrimary, fontSize: 15, lineHeight: 22 },

  contentsCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14, padding: 16, gap: 10, ...Shadows.card,
  },
  contentsTitle: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 2 },
  contentItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  contentIcon: { fontSize: 16 },
  contentText: { color: Colors.textPrimary, fontSize: 14 },

  // Primary button
  primaryBtn: {
    borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', marginTop: 4, ...Shadows.button,
  },
  btnText: { color: Colors.textWhite, fontWeight: '800', fontSize: 16 },

  // Cultural card
  culturalCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14, padding: 18,
    borderLeftWidth: 4, gap: 8, ...Shadows.card,
  },
  culturalCardLabel: {
    fontSize: 10, fontWeight: '800', letterSpacing: 1,
  },
  culturalText: { color: Colors.textPrimary, fontSize: 15, lineHeight: 25 },

  // Immersion simulation card
  immersionCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 14, padding: 18, gap: 12,
  },
  immersionTitle: {
    color: '#F59E0B', fontSize: 12, fontWeight: '800', letterSpacing: 1,
  },
  immersionBody: {
    color: '#D1D5DB', fontSize: 14, lineHeight: 22,
  },
  immersionChecklist: { gap: 8 },
  immersionItem: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  immersionBullet: { color: '#F59E0B', fontSize: 14, marginTop: 1 },
  immersionItemText: { color: '#E5E7EB', fontSize: 13, lineHeight: 20, flex: 1 },

  // Regional note
  regionalNote: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12, padding: 14,
    borderWidth: 1.5, gap: 6, ...Shadows.card,
  },
  regionalNoteTitle: {
    color: Colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 0.8,
  },
  regionalNoteText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 20 },

  // ── Vocab Card — white, high contrast ──
  vocabCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20, minHeight: 240,
    borderWidth: 2, borderColor: Colors.border,
    justifyContent: 'center', ...Shadows.tile,
  },
  vocabCardFlipped: {
    borderColor: Colors.primary + '50',
    backgroundColor: Colors.primaryLight,
  },
  vocabFront: { padding: 32, alignItems: 'center', gap: 14 },
  vocabSpanish: {
    color: Colors.textPrimary, fontSize: 40, fontWeight: '800',
    textAlign: 'center', lineHeight: 48,
  },
  vocabPhonetic: {
    color: Colors.textMuted, fontSize: 16, fontStyle: 'italic', textAlign: 'center',
  },
  tapHintRow: {
    marginTop: 8, paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: Colors.backgroundMuted, borderRadius: 20,
  },
  tapHint: { color: Colors.textMuted, fontSize: 13 },

  vocabBack: { padding: 32, gap: 14 },
  vocabEnglish: {
    color: Colors.primary, fontSize: 32, fontWeight: '800', textAlign: 'center',
  },
  exampleBox: {
    backgroundColor: Colors.backgroundMuted, borderRadius: 12, padding: 14, gap: 4,
  },
  exampleSpanish: { color: Colors.textPrimary, fontSize: 14, fontStyle: 'italic' },
  exampleEnglish: { color: Colors.textSecondary, fontSize: 13 },
  noteBox: {
    backgroundColor: Colors.streakLight, borderRadius: 10, padding: 10,
  },
  noteText: { color: Colors.streak, fontSize: 13, lineHeight: 19 },

  // ── Drill ──
  drillTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  patternCard: {
    backgroundColor: Colors.backgroundCard, borderRadius: 12, padding: 14,
    borderLeftWidth: 3, borderLeftColor: Colors.primary, ...Shadows.card,
  },
  patternLabel: { color: Colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  patternText: { color: Colors.textPrimary, fontSize: 13, fontFamily: 'monospace', marginBottom: 6 },
  patternExplanation: { color: Colors.textSecondary, fontSize: 12, lineHeight: 18 },
  drillInstruction: { color: Colors.textSecondary, fontSize: 14, fontStyle: 'italic' },
  drillExercise: { gap: 12 },
  exerciseProgress: { color: Colors.textMuted, fontSize: 12 },
  promptBox: {
    backgroundColor: Colors.backgroundCard, borderRadius: 14, padding: 18,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border, ...Shadows.card,
  },
  promptText: { color: Colors.textPrimary, fontSize: 18, fontWeight: '600', flex: 1 },
  hintText: { color: Colors.textMuted, fontSize: 13, fontStyle: 'italic' },
  answerBox: {
    backgroundColor: Colors.successLight, borderRadius: 12, padding: 16,
    borderWidth: 1.5, borderColor: Colors.success + '60',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  answerLabel: { color: Colors.successDark, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  answerText: { color: Colors.textPrimary, fontSize: 18, fontWeight: '700', flex: 1 },
  revealBtn: {
    borderRadius: 14, borderWidth: 2, borderColor: Colors.border,
    height: 52, justifyContent: 'center', alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
  },
  revealText: { color: Colors.textSecondary, fontWeight: '700', fontSize: 15 },

  // ── Dialogue ──
  dialogueTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  situationText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
  charactersRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  characterChip: {
    backgroundColor: Colors.backgroundCard, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  characterChipYou: { borderColor: Colors.primary + '60', backgroundColor: Colors.primaryLight },
  characterName: { color: Colors.textPrimary, fontWeight: '700', fontSize: 12 },
  characterRole: { color: Colors.textMuted, fontSize: 10, marginTop: 1 },
  dialogueLines: { gap: 10 },
  dialogueLine: { flexDirection: 'row' },
  lineRight: { justifyContent: 'flex-end' },
  lineLeft: { justifyContent: 'flex-start' },
  lineBubble: { maxWidth: '85%', borderRadius: 16, padding: 14, gap: 4 },
  bubbleLearner: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1.5, borderColor: Colors.primary + '40',
  },
  bubbleOther: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  lineSpanish: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  lineSpanishLearner: { color: Colors.primary },
  lineEnglish: { color: Colors.textSecondary, fontSize: 12 },
  linePhonetic: { color: Colors.textMuted, fontSize: 11, fontStyle: 'italic' },
  lineNote: { color: Colors.streak, fontSize: 11, marginTop: 2 },
  culturalNotes: {
    backgroundColor: Colors.backgroundCard, borderRadius: 14, padding: 16,
    borderLeftWidth: 3, borderLeftColor: Colors.streak, gap: 8, ...Shadows.card,
  },
  culturalNotesTitle: { color: Colors.streak, fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
  culturalNoteText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 19 },

  // ── Complete ──
  completeContainer: { alignItems: 'center', paddingTop: 20 },
  completeIcon: { fontSize: 72 },
  completeTitle: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary },
  completeDesc: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center' },
  xpCard: {
    backgroundColor: Colors.brandLight, borderRadius: 16, padding: 24,
    alignItems: 'center', borderWidth: 2, borderColor: Colors.brand + '60',
    width: '100%',
  },
  xpEarned: { color: Colors.brandDark, fontSize: 52, fontWeight: '800' },
  xpLabel: { color: Colors.brandDark, fontSize: 13, fontWeight: '700', letterSpacing: 1 },
});
