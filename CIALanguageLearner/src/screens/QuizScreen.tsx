import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  TextInput, ScrollView, Animated, Platform,
} from 'react-native';
import * as Speech from 'expo-speech';
import { Colors, Shadows } from '../theme/colors';
import { QuizQuestion, QuizResult, generateQuiz, scoreTextAnswer, QuizType } from '../utils/quizEngine';
import { PronunciationChecker } from '../components/PronunciationChecker';

interface Props {
  cardIds: string[];
  lessonTitle: string;
  onComplete: (results: QuizResult[], xp: number) => void;
  onBack: () => void;
}

export function QuizScreen({ cardIds, lessonTitle, onComplete, onBack }: Props) {
  const TYPES: QuizType[] = ['multiple_choice', 'type_answer', 'flashcard', 'listening'];
  const [questions] = useState<QuizQuestion[]>(() =>
    generateQuiz(cardIds, TYPES, 1).slice(0, Math.min(cardIds.length, 10))
  );
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [cardFlipped, setCardFlipped] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [questionStart] = useState(Date.now());
  const [done, setDone] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const question = questions[index];
  const progress = index / questions.length;

  const speakWord = (text: string) => {
    Speech.speak(text, { language: 'es-MX', rate: 0.85 });
  };

  useEffect(() => {
    // Auto-play audio for listening questions
    if (question?.type === 'listening') {
      setTimeout(() => speakWord(question.card.spanish), 300);
    }
  }, [index]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const submitAnswer = (answer: string, correct: boolean) => {
    const result: QuizResult = {
      questionId: question.id,
      correct,
      userAnswer: answer,
      timeTaken: Date.now() - questionStart,
    };
    const newResults = [...results, result];
    setResults(newResults);
    setFeedback(correct ? 'correct' : 'wrong');
    if (!correct) shake();

    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);
      setTypedAnswer('');
      setCardFlipped(false);
      if (index + 1 >= questions.length) {
        setDone(true);
      } else {
        setIndex(i => i + 1);
      }
    }, 1200);
  };

  const handleOptionSelect = (option: string) => {
    if (feedback) return;
    setSelectedOption(option);
    const correct = option === question.correctOption;
    submitAnswer(option, correct);
  };

  const handleTypeSubmit = () => {
    if (!typedAnswer.trim() || feedback) return;
    const correct = scoreTextAnswer(typedAnswer, question.card.english);
    submitAnswer(typedAnswer, correct);
  };

  const handleFlashcardRate = (correct: boolean) => {
    submitAnswer(correct ? 'knew it' : 'missed it', correct);
  };

  if (done) {
    const correct = results.filter(r => r.correct).length;
    const total = results.length;
    const pct = Math.round((correct / total) * 100);
    const xp = correct * 10;
    return <ResultsScreen correct={correct} total={total} pct={pct} xp={xp}
      onContinue={() => onComplete(results, xp)} />;
  }

  if (!question) return null;

  const optionBgColor = (opt: string) => {
    if (!feedback || selectedOption !== opt) {
      return selectedOption === opt ? Colors.optionSelected : Colors.optionDefault;
    }
    if (opt === question.correctOption) return Colors.optionCorrect;
    if (opt === selectedOption) return Colors.optionWrong;
    return Colors.optionDefault;
  };

  const optionBorderColor = (opt: string) => {
    if (!feedback || selectedOption !== opt) {
      return selectedOption === opt ? Colors.primary : Colors.border;
    }
    if (opt === question.correctOption) return Colors.success;
    if (opt === selectedOption) return Colors.error;
    return Colors.border;
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
        </View>
        <View style={styles.xpPill}>
          <Text style={styles.xpText}>⭐ {results.filter(r => r.correct).length * 10}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
                  disabled={!!feedback}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                  {feedback && opt === question.correctOption && (
                    <Text style={styles.optionIcon}>✓</Text>
                  )}
                  {feedback && opt === selectedOption && opt !== question.correctOption && (
                    <Text style={styles.optionIcon}>✗</Text>
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
              </TouchableOpacity>
            </View>
            <Text style={styles.instruction}>Type the English translation</Text>
            <TextInput
              style={[
                styles.textInput,
                feedback === 'correct' && styles.textInputCorrect,
                feedback === 'wrong' && styles.textInputWrong,
              ]}
              value={typedAnswer}
              onChangeText={setTypedAnswer}
              placeholder="Type here..."
              placeholderTextColor={Colors.textMuted}
              onSubmitEditing={handleTypeSubmit}
              editable={!feedback}
              autoFocus
              autoCorrect={false}
              autoCapitalize="none"
            />
            {feedback && (
              <View style={[styles.answerReveal,
                feedback === 'correct' ? styles.answerRevealCorrect : styles.answerRevealWrong]}>
                <Text style={styles.answerRevealText}>
                  {feedback === 'correct' ? `✓ Correct! "${question.card.english}"` : `✗ Answer: "${question.card.english}"`}
                </Text>
              </View>
            )}
            {!feedback && (
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
              onPress={() => !cardFlipped && setCardFlipped(true)}
              activeOpacity={0.9}
            >
              {!cardFlipped ? (
                <View style={styles.flashCardInner}>
                  <Text style={styles.flashCardWord}>{question.card.spanish}</Text>
                  <Text style={styles.flashCardPhonetic}>{question.card.phonetic}</Text>
                  <TouchableOpacity onPress={() => speakWord(question.card.spanish)} style={styles.audioBtn}>
                    <Text style={styles.audioIcon}>🔊</Text>
                  </TouchableOpacity>
                  <Text style={styles.tapHint}>Tap to flip</Text>
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
            {cardFlipped && (
              <View style={styles.flashRatingRow}>
                <TouchableOpacity
                  style={styles.flashBtnWrong}
                  onPress={() => handleFlashcardRate(false)}
                >
                  <Text style={styles.flashBtnIcon}>😬</Text>
                  <Text style={styles.flashBtnText}>Missed it</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.flashBtnCorrect}
                  onPress={() => handleFlashcardRate(true)}
                >
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
                  disabled={!!feedback}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                  {feedback && opt === question.correctOption && (
                    <Text style={styles.optionIcon}>✓</Text>
                  )}
                  {feedback && opt === selectedOption && opt !== question.correctOption && (
                    <Text style={styles.optionIcon}>✗</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Pronunciation section (shown after correct answer) */}
        {feedback === 'correct' && question.type !== 'flashcard' && (
          <View style={styles.pronunciationSection}>
            <PronunciationChecker expectedText={question.card.spanish} />
          </View>
        )}
      </ScrollView>

      {/* Feedback bar */}
      {feedback && (
        <View style={[styles.feedbackBar, feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong]}>
          <Text style={styles.feedbackIcon}>{feedback === 'correct' ? '🎉' : '💡'}</Text>
          <View>
            <Text style={styles.feedbackTitle}>
              {feedback === 'correct' ? 'Correct!' : 'Incorrect'}
            </Text>
            {feedback === 'wrong' && (
              <Text style={styles.feedbackHint}>
                Answer: {question.direction === 'es_to_en' ? question.card.english : question.card.spanish}
              </Text>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

function ResultsScreen({ correct, total, pct, xp, onContinue }: {
  correct: number; total: number; pct: number; xp: number; onContinue: () => void;
}) {
  const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚';
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsEmoji}>{emoji}</Text>
        <Text style={styles.resultsTitle}>Quiz Complete!</Text>
        <View style={styles.resultsCard}>
          <ResultRow label="Correct" value={`${correct}/${total}`} color={Colors.success} />
          <ResultRow label="Accuracy" value={`${pct}%`} color={pct >= 80 ? Colors.success : Colors.streak} />
          <ResultRow label="XP Earned" value={`+${xp}`} color={Colors.gold} />
        </View>
        <Text style={styles.resultsMessage}>
          {pct >= 80 ? 'Outstanding! Your training is effective.' :
           pct >= 60 ? 'Good work. Keep reviewing for mastery.' :
           'Keep practicing. Repetition builds fluency.'}
        </Text>
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
    case 'type_answer': return '⌨️ Type the Answer';
    case 'flashcard': return '🃏 Flashcard';
    case 'listening': return '👂 Listening';
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, gap: 12,
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
    backgroundColor: Colors.primary,
  },
  xpPill: {
    backgroundColor: Colors.goldLight, borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: Colors.gold + '60',
  },
  xpText: { color: Colors.gold, fontWeight: '700', fontSize: 12 },

  content: { padding: 20, paddingBottom: 120, gap: 16 },

  typeLabel: {
    color: Colors.textMuted,
    fontSize: 13, fontWeight: '700',
    letterSpacing: 0.5,
  },

  promptCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 20, padding: 28,
    alignItems: 'center', gap: 8,
    marginBottom: 8,
    borderWidth: 2, borderColor: Colors.primary + '30',
  },
  promptWord: {
    color: Colors.textPrimary, fontSize: 36,
    fontWeight: '800', textAlign: 'center',
  },
  promptPhonetic: {
    color: Colors.textMuted, fontSize: 16,
    fontStyle: 'italic', textAlign: 'center',
  },
  audioBtn: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 20, paddingHorizontal: 16,
    paddingVertical: 8, marginTop: 4,
  },
  audioIcon: { fontSize: 20 },

  instruction: {
    color: Colors.textSecondary, fontSize: 15,
    fontWeight: '600', marginBottom: 4,
  },

  options: { gap: 10 },
  option: {
    borderRadius: 14, borderWidth: 2,
    padding: 16, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    ...Shadows.card,
  },
  optionText: {
    color: Colors.textPrimary, fontSize: 16,
    fontWeight: '600', flex: 1,
  },
  optionIcon: { fontSize: 18, fontWeight: '700' },

  textInput: {
    borderWidth: 2, borderColor: Colors.border,
    borderRadius: 14, padding: 16,
    fontSize: 18, color: Colors.textPrimary,
    backgroundColor: Colors.backgroundCard,
    ...Shadows.card,
  },
  textInputCorrect: { borderColor: Colors.success, backgroundColor: Colors.successBg },
  textInputWrong: { borderColor: Colors.error, backgroundColor: Colors.errorBg },
  answerReveal: {
    borderRadius: 12, padding: 12,
    borderWidth: 1.5,
  },
  answerRevealCorrect: {
    backgroundColor: Colors.successBg, borderColor: Colors.success,
  },
  answerRevealWrong: {
    backgroundColor: Colors.errorBg, borderColor: Colors.error,
  },
  answerRevealText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  submitBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
    ...Shadows.button,
  },
  submitBtnDisabled: { backgroundColor: Colors.border },
  submitBtnText: {
    color: Colors.textWhite, fontWeight: '800', fontSize: 16,
  },

  flashCard: {
    borderRadius: 20, borderWidth: 2,
    borderColor: Colors.border, minHeight: 200,
    justifyContent: 'center', ...Shadows.card,
    backgroundColor: Colors.backgroundCard,
  },
  flashCardFlipped: {
    borderColor: Colors.primary,
    backgroundColor: Colors.backgroundAlt,
  },
  flashCardInner: {
    padding: 28, alignItems: 'center', gap: 10,
  },
  flashCardWord: {
    color: Colors.textPrimary, fontSize: 38, fontWeight: '800',
  },
  flashCardPhonetic: {
    color: Colors.textMuted, fontSize: 16, fontStyle: 'italic',
  },
  flashCardAnswer: {
    color: Colors.primary, fontSize: 32, fontWeight: '800',
  },
  flashCardExample: {
    color: Colors.textSecondary, fontSize: 13,
    fontStyle: 'italic', textAlign: 'center', lineHeight: 19,
  },
  tapHint: { color: Colors.textMuted, fontSize: 12, marginTop: 8 },
  flashRatingRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  flashBtnWrong: {
    flex: 1, borderRadius: 14, borderWidth: 2,
    borderColor: Colors.error, padding: 16,
    alignItems: 'center', backgroundColor: Colors.errorLight,
  },
  flashBtnCorrect: {
    flex: 1, borderRadius: 14, borderWidth: 2,
    borderColor: Colors.success, padding: 16,
    alignItems: 'center', backgroundColor: Colors.successLight,
  },
  flashBtnIcon: { fontSize: 26 },
  flashBtnText: { fontWeight: '700', fontSize: 14, marginTop: 4, color: Colors.textPrimary },

  listeningPrompt: { alignItems: 'center', marginBottom: 8 },
  bigPlayBtn: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 60, width: 120, height: 120,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: Colors.primary + '40',
    ...Shadows.card,
  },
  bigPlayIcon: { fontSize: 40 },
  bigPlayText: { color: Colors.primary, fontSize: 12, fontWeight: '700', marginTop: 4 },

  pronunciationSection: { marginTop: 8 },

  feedbackBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 20, paddingBottom: 28,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
  },
  feedbackCorrect: { backgroundColor: Colors.successLight },
  feedbackWrong: { backgroundColor: Colors.errorLight },
  feedbackIcon: { fontSize: 28 },
  feedbackTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  feedbackHint: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },

  resultsContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: 28, gap: 16,
  },
  resultsEmoji: { fontSize: 72 },
  resultsTitle: {
    color: Colors.textPrimary, fontSize: 28, fontWeight: '800',
  },
  resultsCard: {
    backgroundColor: Colors.backgroundMuted,
    borderRadius: 16, padding: 20, width: '100%',
    gap: 14, borderWidth: 1, borderColor: Colors.border,
  },
  resultRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  resultLabel: { color: Colors.textSecondary, fontSize: 15 },
  resultValue: { fontSize: 18, fontWeight: '800' },
  resultsMessage: {
    color: Colors.textSecondary, fontSize: 14,
    textAlign: 'center', lineHeight: 21, fontStyle: 'italic',
  },
  continueBtn: {
    backgroundColor: Colors.primary, borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 48,
    ...Shadows.button,
  },
  continueBtnText: {
    color: Colors.textWhite, fontWeight: '800', fontSize: 17,
  },
});
