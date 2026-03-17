import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  TextInput, ScrollView, Animated, Platform,
} from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Colors, Shadows } from '../theme/colors';
import { QuizQuestion, QuizResult, generateQuiz, scoreTextAnswer, QuizType } from '../utils/quizEngine';
import { PronunciationChecker } from '../components/PronunciationChecker';
import { AgentMaya, AgentMayaInline, MayaMood } from '../components/AgentMaya';

interface Props {
  cardIds: string[];
  lessonTitle: string;
  onComplete: (results: QuizResult[], xp: number) => void;
  onBack: () => void;
}

const MAX_HEARTS = 3;
const HEART_FULL  = '❤️';
const HEART_EMPTY = '🖤';

type QuizPhase = 'question' | 'feedback' | 'pronunciation' | 'done';

export function QuizScreen({ cardIds, lessonTitle, onComplete, onBack }: Props) {
  const TYPES: QuizType[] = ['multiple_choice', 'type_answer', 'flashcard', 'listening'];
  const [questions] = useState<QuizQuestion[]>(() =>
    generateQuiz(cardIds, TYPES, 1).slice(0, Math.min(cardIds.length, 10))
  );
  const [index, setIndex]               = useState(0);
  const [results, setResults]           = useState<QuizResult[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer]   = useState('');
  const [cardFlipped, setCardFlipped]   = useState(false);
  const [phase, setPhase]               = useState<QuizPhase>('question');
  const [lastCorrect, setLastCorrect]   = useState(false);
  const [hearts, setHearts]             = useState(MAX_HEARTS);
  const [mayaMood, setMayaMood]         = useState<MayaMood>('happy');
  const [mayaMessage, setMayaMessage]   = useState<string | undefined>(undefined);

  const shakeAnim   = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const question = questions[index];
  const progressPct = index / questions.length;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPct,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [index]);

  useEffect(() => {
    if (question?.type === 'listening') {
      setTimeout(() => speakWord(question.card.spanish), 400);
    }
    // Maya greeting at start of quiz
    if (index === 0) {
      setMayaMood('happy');
      setMayaMessage(`Let's quiz on "${lessonTitle}"!`);
    }
  }, [index]);

  const speakWord = (text: string) => {
    Speech.speak(text, { language: 'es-MX', rate: 0.85 });
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6,  duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const submitAnswer = (answer: string, correct: boolean) => {
    const result: QuizResult = {
      questionId: question.id,
      correct,
      userAnswer: answer,
      timeTaken: 0,
    };
    setResults(prev => [...prev, result]);
    setLastCorrect(correct);

    if (correct) {
      setMayaMood('correct');
      setMayaMessage(undefined);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      shake();
      setHearts(h => Math.max(0, h - 1));
      setMayaMood('wrong');
      setMayaMessage(undefined);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    setPhase('feedback');
  };

  const advanceFromFeedback = () => {
    // For correct answers on non-flashcard types, offer pronunciation practice
    if (lastCorrect && question.type !== 'flashcard') {
      setPhase('pronunciation');
    } else {
      goToNext();
    }
  };

  const goToNext = () => {
    setPhase('question');
    setSelectedOption(null);
    setTypedAnswer('');
    setCardFlipped(false);

    const nextIndex = index + 1;
    if (nextIndex >= questions.length || hearts === 0) {
      setPhase('done');
    } else {
      setIndex(nextIndex);
      setMayaMood('thinking');
      setMayaMessage(undefined);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (phase !== 'question') return;
    setSelectedOption(option);
    const correct = option === question.correctOption;
    submitAnswer(option, correct);
  };

  const handleTypeSubmit = () => {
    if (!typedAnswer.trim() || phase !== 'question') return;
    const correct = scoreTextAnswer(typedAnswer, question.card.english);
    submitAnswer(typedAnswer, correct);
  };

  const handleFlashcardRate = (correct: boolean) => {
    submitAnswer(correct ? 'knew it' : 'missed it', correct);
  };

  const optionBgColor = (opt: string) => {
    if (phase === 'question') {
      return selectedOption === opt ? Colors.optionSelected : Colors.optionDefault;
    }
    if (opt === question.correctOption) return Colors.optionCorrect;
    if (opt === selectedOption && opt !== question.correctOption) return Colors.optionWrong;
    return Colors.optionDefault;
  };

  const optionBorderColor = (opt: string) => {
    if (phase === 'question') {
      return selectedOption === opt ? Colors.primary : Colors.border;
    }
    if (opt === question.correctOption) return Colors.success;
    if (opt === selectedOption && opt !== question.correctOption) return Colors.error;
    return Colors.border;
  };

  // ── DONE screen ────────────────────────────────────────────────────
  if (phase === 'done') {
    const correct = results.filter(r => r.correct).length;
    const total = results.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const xp = correct * 10;
    const outOfHearts = hearts === 0;
    return (
      <ResultsScreen
        correct={correct}
        total={total}
        pct={pct}
        xp={xp}
        outOfHearts={outOfHearts}
        onContinue={() => onComplete(results, xp)}
      />
    );
  }

  if (!question) return null;

  // ── PRONUNCIATION step ─────────────────────────────────────────────
  if (phase === 'pronunciation') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onBack} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <HeartsDisplay hearts={hearts} />
          <ProgressPill correct={results.filter(r => r.correct).length} />
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <AgentMaya
            mood="encouraging"
            message="Now try saying it aloud! Tap the mic and speak."
            size="medium"
            animate
          />
          <PronunciationChecker expectedText={question.card.spanish} />
        </ScrollView>
        <TouchableOpacity style={styles.continueFooterBtn} onPress={goToNext}>
          <Text style={styles.continueFooterText}>Continue →</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── QUESTION + FEEDBACK ────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Animated.View style={[styles.progressTrack]}>
          <Animated.View style={[styles.progressFill, {
            width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          }]} />
        </Animated.View>
        <HeartsDisplay hearts={hearts} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Agent Maya */}
        <AgentMayaInline mood={mayaMood} message={mayaMessage} animate />

        {/* Question type label */}
        <Text style={styles.typeLabel}>{getTypeLabel(question.type)}</Text>

        {/* ── MULTIPLE CHOICE ── */}
        {question.type === 'multiple_choice' && (
          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            <View style={styles.promptCard}>
              <Text style={styles.promptWord}>{question.card.spanish}</Text>
              <Text style={styles.promptPhonetic}>{question.card.phonetic}</Text>
              <TouchableOpacity onPress={() => speakWord(question.card.spanish)} style={styles.audioBtn}>
                <Text style={styles.audioIcon}>🔊</Text>
                <Text style={styles.audioBtnText}>Hear it</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.instruction}>Select the correct translation</Text>
            <View style={styles.options}>
              {question.options!.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.option, {
                    backgroundColor: optionBgColor(opt),
                    borderColor: optionBorderColor(opt),
                  }]}
                  onPress={() => handleOptionSelect(opt)}
                  disabled={phase !== 'question'}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                  {phase === 'feedback' && opt === question.correctOption && (
                    <Text style={styles.optionIconCorrect}>✓</Text>
                  )}
                  {phase === 'feedback' && opt === selectedOption && opt !== question.correctOption && (
                    <Text style={styles.optionIconWrong}>✗</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* ── TYPE ANSWER ── */}
        {question.type === 'type_answer' && (
          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            <View style={styles.promptCard}>
              <Text style={styles.promptWord}>{question.card.spanish}</Text>
              <Text style={styles.promptPhonetic}>{question.card.phonetic}</Text>
              <TouchableOpacity onPress={() => speakWord(question.card.spanish)} style={styles.audioBtn}>
                <Text style={styles.audioIcon}>🔊</Text>
                <Text style={styles.audioBtnText}>Hear it</Text>
              </TouchableOpacity>
            </View>
            {question.card.notes ? (
              <View style={styles.grammarHint}>
                <Text style={styles.grammarHintText}>💡 {question.card.notes}</Text>
              </View>
            ) : null}
            <Text style={styles.instruction}>Type the English translation</Text>
            <TextInput
              style={[
                styles.textInput,
                phase === 'feedback' && lastCorrect && styles.textInputCorrect,
                phase === 'feedback' && !lastCorrect && styles.textInputWrong,
              ]}
              value={typedAnswer}
              onChangeText={setTypedAnswer}
              placeholder="Type here..."
              placeholderTextColor={Colors.textMuted}
              onSubmitEditing={handleTypeSubmit}
              editable={phase === 'question'}
              autoFocus
              autoCorrect={false}
              autoCapitalize="none"
            />
            {phase === 'feedback' && (
              <View style={[styles.answerReveal,
                lastCorrect ? styles.answerRevealCorrect : styles.answerRevealWrong]}>
                <Text style={styles.answerRevealText}>
                  {lastCorrect
                    ? `✓ Correct! "${question.card.english}"`
                    : `✗ Answer: "${question.card.english}"`}
                </Text>
              </View>
            )}
            {phase === 'question' && (
              <TouchableOpacity
                style={[styles.submitBtn, !typedAnswer.trim() && styles.submitBtnDisabled]}
                onPress={handleTypeSubmit}
                disabled={!typedAnswer.trim()}
              >
                <Text style={styles.submitBtnText}>Check Answer</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}

        {/* ── FLASHCARD ── */}
        {question.type === 'flashcard' && (
          <View>
            <Text style={styles.instruction}>
              {cardFlipped ? 'Did you know this?' : 'Tap the card to reveal the answer'}
            </Text>
            <TouchableOpacity
              style={[styles.flashCard, cardFlipped && styles.flashCardFlipped]}
              onPress={() => !cardFlipped && phase === 'question' && setCardFlipped(true)}
              activeOpacity={0.9}
            >
              {!cardFlipped ? (
                <View style={styles.flashCardInner}>
                  <Text style={styles.flashCardWord}>{question.card.spanish}</Text>
                  <Text style={styles.flashCardPhonetic}>{question.card.phonetic}</Text>
                  <TouchableOpacity onPress={() => speakWord(question.card.spanish)} style={styles.audioBtn}>
                    <Text style={styles.audioIcon}>🔊</Text>
                  </TouchableOpacity>
                  <Text style={styles.tapHint}>Tap to flip ↓</Text>
                </View>
              ) : (
                <View style={styles.flashCardInner}>
                  <Text style={styles.flashCardAnswer}>{question.card.english}</Text>
                  {question.card.exampleSentence && (
                    <Text style={styles.flashCardExample}>"{question.card.exampleSentence}"</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
            {cardFlipped && phase === 'question' && (
              <View style={styles.flashRatingRow}>
                <TouchableOpacity style={styles.flashBtnWrong} onPress={() => handleFlashcardRate(false)}>
                  <Text style={styles.flashBtnIcon}>😬</Text>
                  <Text style={styles.flashBtnText}>Missed it</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.flashBtnCorrect} onPress={() => handleFlashcardRate(true)}>
                  <Text style={styles.flashBtnIcon}>😊</Text>
                  <Text style={styles.flashBtnText}>Got it!</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ── LISTENING ── */}
        {question.type === 'listening' && (
          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            <View style={styles.listeningPrompt}>
              <TouchableOpacity
                style={styles.bigPlayBtn}
                onPress={() => speakWord(question.card.spanish)}
              >
                <Text style={styles.bigPlayIcon}>🔊</Text>
                <Text style={styles.bigPlayText}>Tap to hear</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.instruction}>What did you hear? Select the translation:</Text>
            <View style={styles.options}>
              {question.options!.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.option, {
                    backgroundColor: optionBgColor(opt),
                    borderColor: optionBorderColor(opt),
                  }]}
                  onPress={() => handleOptionSelect(opt)}
                  disabled={phase !== 'question'}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                  {phase === 'feedback' && opt === question.correctOption && (
                    <Text style={styles.optionIconCorrect}>✓</Text>
                  )}
                  {phase === 'feedback' && opt === selectedOption && opt !== question.correctOption && (
                    <Text style={styles.optionIconWrong}>✗</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Feedback bar — stays visible until user taps CONTINUE */}
      {phase === 'feedback' && (
        <TouchableOpacity
          style={[styles.feedbackBar, lastCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}
          onPress={advanceFromFeedback}
          activeOpacity={0.9}
        >
          <Text style={styles.feedbackIcon}>{lastCorrect ? '🎉' : '💡'}</Text>
          <View style={styles.feedbackTextBlock}>
            <Text style={[styles.feedbackTitle, { color: lastCorrect ? Colors.successDark : Colors.errorDark }]}>
              {lastCorrect ? 'Correct!' : 'Incorrect'}
            </Text>
            {!lastCorrect && (
              <Text style={styles.feedbackHint}>
                Answer: {question.direction === 'es_to_en' ? question.card.english : question.card.spanish}
              </Text>
            )}
          </View>
          <View style={[styles.nextBtn, { backgroundColor: lastCorrect ? Colors.success : Colors.error }]}>
            <Text style={styles.nextBtnText}>
              {lastCorrect && question.type !== 'flashcard' ? 'Speak →' : 'Next →'}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

// ── Sub-components ───────────────────────────────────────────────────

function HeartsDisplay({ hearts }: { hearts: number }) {
  return (
    <View style={styles.heartsRow}>
      {Array.from({ length: MAX_HEARTS }).map((_, i) => (
        <Text key={i} style={styles.heartIcon}>
          {i < hearts ? HEART_FULL : HEART_EMPTY}
        </Text>
      ))}
    </View>
  );
}

function ProgressPill({ correct }: { correct: number }) {
  return (
    <View style={styles.xpPill}>
      <Text style={styles.xpText}>⭐ {correct * 10} XP</Text>
    </View>
  );
}

function ResultsScreen({ correct, total, pct, xp, outOfHearts, onContinue }: {
  correct: number; total: number; pct: number; xp: number;
  outOfHearts: boolean; onContinue: () => void;
}) {
  const mood: MayaMood = pct >= 80 ? 'celebrating' : pct >= 60 ? 'encouraging' : 'happy';
  const message =
    outOfHearts        ? 'Don\'t give up! Every attempt builds fluency.' :
    pct >= 80          ? '¡Excelente! Outstanding performance!' :
    pct >= 60          ? 'Good work, Agent! Keep reviewing for mastery.' :
                         'Keep practicing — repetition builds fluency!';
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.resultsContainer}>
        <AgentMaya mood={mood} message={message} size="large" animate />

        <Text style={styles.resultsTitle}>
          {outOfHearts ? 'Out of Hearts!' : 'Quiz Complete!'}
        </Text>

        <View style={styles.resultsCard}>
          <ResultRow label="Correct"  value={`${correct}/${total}`} color={Colors.success} />
          <ResultRow label="Accuracy" value={`${pct}%`} color={pct >= 80 ? Colors.success : Colors.streak} />
          <ResultRow label="XP Earned" value={`+${xp}`} color={Colors.gold} />
        </View>

        <TouchableOpacity style={styles.continueBtn} onPress={onContinue}>
          <Text style={styles.continueBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function ResultRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={[styles.resultValue, { color }]}>{value}</Text>
    </View>
  );
}

function getTypeLabel(type: QuizType): string {
  switch (type) {
    case 'multiple_choice': return '🎯 Multiple Choice';
    case 'type_answer':     return '⌨️ Type the Answer';
    case 'flashcard':       return '🃏 Flashcard';
    case 'listening':       return '👂 Listening';
  }
}

// ── Styles ───────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, gap: 12,
    backgroundColor: Colors.backgroundCard,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.backgroundMuted,
    justifyContent: 'center', alignItems: 'center',
  },
  closeText: { color: Colors.textSecondary, fontSize: 16, fontWeight: '700' },
  progressTrack: {
    flex: 1, height: 10, borderRadius: 5,
    backgroundColor: Colors.border, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', borderRadius: 5,
    backgroundColor: Colors.brand,
  },
  heartsRow: { flexDirection: 'row', gap: 3 },
  heartIcon: { fontSize: 18 },
  xpPill: {
    backgroundColor: Colors.brandLight, borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1.5, borderColor: Colors.brand + '60',
  },
  xpText: { color: Colors.brandDark, fontWeight: '700', fontSize: 12 },

  content: { padding: 20, paddingBottom: 130, gap: 16 },

  typeLabel: {
    color: Colors.textMuted, fontSize: 12, fontWeight: '700',
    letterSpacing: 0.8, textTransform: 'uppercase',
  },

  promptCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20, padding: 32,
    alignItems: 'center', gap: 10,
    borderWidth: 2, borderColor: Colors.border,
    ...Shadows.card,
  },
  promptWord: { color: Colors.textPrimary, fontSize: 38, fontWeight: '800', textAlign: 'center' },
  promptPhonetic: { color: Colors.textMuted, fontSize: 16, fontStyle: 'italic', textAlign: 'center' },
  audioBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primaryLight,
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginTop: 4,
  },
  audioIcon: { fontSize: 18 },
  audioBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },

  instruction: { color: Colors.textSecondary, fontSize: 15, fontWeight: '600' },

  grammarHint: {
    backgroundColor: Colors.primaryLight, borderRadius: 10, padding: 12,
    borderLeftWidth: 3, borderLeftColor: Colors.primary,
  },
  grammarHintText: { color: Colors.primary, fontSize: 13, lineHeight: 18 },

  options: { gap: 10 },
  option: {
    borderRadius: 14, borderWidth: 2, padding: 18,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.backgroundCard, ...Shadows.card,
  },
  optionText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '600', flex: 1 },
  optionIconCorrect: { fontSize: 22, color: Colors.success, fontWeight: '700' },
  optionIconWrong:   { fontSize: 22, color: Colors.error,   fontWeight: '700' },

  textInput: {
    borderWidth: 2, borderColor: Colors.border,
    borderRadius: 14, padding: 18,
    fontSize: 18, color: Colors.textPrimary,
    backgroundColor: Colors.backgroundCard,
    ...Shadows.card,
  },
  textInputCorrect: { borderColor: Colors.success, backgroundColor: Colors.successBg },
  textInputWrong:   { borderColor: Colors.error,   backgroundColor: Colors.errorBg },
  answerReveal: { borderRadius: 14, padding: 14, borderWidth: 2 },
  answerRevealCorrect: { backgroundColor: Colors.successBg, borderColor: Colors.success },
  answerRevealWrong:   { backgroundColor: Colors.errorBg,   borderColor: Colors.error },
  answerRevealText: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  submitBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 17, alignItems: 'center', ...Shadows.button,
  },
  submitBtnDisabled: { backgroundColor: Colors.border },
  submitBtnText: { color: Colors.textWhite, fontWeight: '800', fontSize: 16 },

  flashCard: {
    borderRadius: 20, borderWidth: 2, borderColor: Colors.border,
    minHeight: 220, justifyContent: 'center', ...Shadows.card,
    backgroundColor: Colors.backgroundCard,
  },
  flashCardFlipped: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  flashCardInner: { padding: 32, alignItems: 'center', gap: 10 },
  flashCardWord: { color: Colors.textPrimary, fontSize: 40, fontWeight: '800' },
  flashCardPhonetic: { color: Colors.textMuted, fontSize: 16, fontStyle: 'italic' },
  flashCardAnswer: { color: Colors.primary, fontSize: 32, fontWeight: '800' },
  flashCardExample: {
    color: Colors.textSecondary, fontSize: 13, fontStyle: 'italic',
    textAlign: 'center', lineHeight: 19,
  },
  tapHint: { color: Colors.textMuted, fontSize: 13, marginTop: 4 },
  flashRatingRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  flashBtnWrong: {
    flex: 1, borderRadius: 14, borderWidth: 2,
    borderColor: Colors.error, padding: 18, alignItems: 'center',
    backgroundColor: Colors.errorLight,
  },
  flashBtnCorrect: {
    flex: 1, borderRadius: 14, borderWidth: 2,
    borderColor: Colors.success, padding: 18, alignItems: 'center',
    backgroundColor: Colors.successLight,
  },
  flashBtnIcon: { fontSize: 28 },
  flashBtnText: { fontWeight: '700', fontSize: 14, marginTop: 4, color: Colors.textPrimary },

  listeningPrompt: { alignItems: 'center', marginBottom: 8 },
  bigPlayBtn: {
    backgroundColor: Colors.brand, borderRadius: 60,
    width: 130, height: 130, justifyContent: 'center', alignItems: 'center',
    ...Shadows.tile,
  },
  bigPlayIcon: { fontSize: 44 },
  bigPlayText: { color: Colors.textBrand, fontSize: 12, fontWeight: '800', marginTop: 4 },

  // Feedback bar
  feedbackBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 20, paddingBottom: 30,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderTopWidth: 2,
  },
  feedbackCorrect: {
    backgroundColor: Colors.successLight,
    borderTopColor: Colors.success,
  },
  feedbackWrong: {
    backgroundColor: Colors.errorLight,
    borderTopColor: Colors.error,
  },
  feedbackIcon: { fontSize: 30 },
  feedbackTextBlock: { flex: 1 },
  feedbackTitle: { fontSize: 18, fontWeight: '800' },
  feedbackHint: { fontSize: 14, color: Colors.textSecondary, marginTop: 3 },
  nextBtn: {
    borderRadius: 12, paddingHorizontal: 18, paddingVertical: 12,
  },
  nextBtnText: { color: Colors.textWhite, fontWeight: '800', fontSize: 14 },

  // Pronunciation step footer
  continueFooterBtn: {
    margin: 16, backgroundColor: Colors.primary, borderRadius: 16,
    paddingVertical: 17, alignItems: 'center', ...Shadows.button,
  },
  continueFooterText: { color: Colors.textWhite, fontWeight: '800', fontSize: 17 },

  // Results
  resultsContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: 28, gap: 20,
  },
  resultsTitle: { color: Colors.textPrimary, fontSize: 28, fontWeight: '800' },
  resultsCard: {
    backgroundColor: Colors.backgroundCard, borderRadius: 18,
    padding: 22, width: '100%', gap: 14,
    borderWidth: 1.5, borderColor: Colors.border, ...Shadows.card,
  },
  resultRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  resultLabel: { color: Colors.textSecondary, fontSize: 15 },
  resultValue: { fontSize: 18, fontWeight: '800' },
  continueBtn: {
    backgroundColor: Colors.primary, borderRadius: 16,
    paddingVertical: 17, paddingHorizontal: 52, ...Shadows.button,
  },
  continueBtnText: { color: Colors.textWhite, fontWeight: '800', fontSize: 17 },
});
