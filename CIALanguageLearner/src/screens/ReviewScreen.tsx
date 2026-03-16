import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { AudioButton } from '../components/AudioButton';
import { ProgressBar } from '../components/ProgressBar';
import { UserProgress, SRSRating } from '../types';
import { getDueCards, getMasteryLevel, MASTERY_LABELS, MASTERY_COLORS, getRetentionRate } from '../store/srsEngine';
import { getVocabById } from '../data/spanishVocabulary';

interface Props {
  progress: UserProgress;
  onRate: (cardId: string, rating: SRSRating) => void;
  onFinish: () => void;
  onBack: () => void;
}

export function ReviewScreen({ progress, onRate, onFinish, onBack }: Props) {
  const dueCards = useMemo(() => getDueCards(progress.srsCards), [progress.srsCards]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionResults, setSessionResults] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);

  if (dueCards.length === 0) {
    return (
      <LinearGradient colors={[Colors.primaryDark, Colors.background]} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyTitle}>All Clear</Text>
            <Text style={styles.emptyDesc}>No cards due for review. Come back later.</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={onBack}>
              <LinearGradient colors={[Colors.accent, Colors.accentDark]} style={styles.btnGradient}>
                <Text style={styles.btnText}>Return to Base →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (sessionComplete) {
    const accuracy = sessionResults.total > 0
      ? Math.round((sessionResults.correct / sessionResults.total) * 100)
      : 0;
    return (
      <LinearGradient colors={[Colors.primaryDark, Colors.background]} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>{accuracy >= 80 ? '🏆' : accuracy >= 60 ? '👍' : '📚'}</Text>
            <Text style={styles.emptyTitle}>Review Complete</Text>
            <View style={styles.summaryCard}>
              <SummaryRow label="Cards Reviewed" value={String(sessionResults.total)} />
              <SummaryRow label="Correct" value={String(sessionResults.correct)} color={Colors.success} />
              <SummaryRow label="Accuracy" value={`${accuracy}%`} color={accuracy >= 80 ? Colors.success : Colors.warning} />
            </View>
            <Text style={styles.summaryNote}>
              {accuracy >= 80
                ? 'Excellent retention! Your training is paying off.'
                : accuracy >= 60
                ? 'Good progress. Keep reviewing consistently.'
                : 'Needs work. Review these cards again tomorrow.'}
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={onFinish}>
              <LinearGradient colors={[Colors.accent, Colors.accentDark]} style={styles.btnGradient}>
                <Text style={styles.btnText}>Return to Base →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const srsCard = dueCards[currentIndex];
  const vocab = getVocabById(srsCard.cardId);
  const mastery = getMasteryLevel(srsCard);
  const retention = getRetentionRate(srsCard);

  const handleRate = (rating: SRSRating) => {
    const isCorrect = rating >= 3;
    setSessionResults(r => ({
      correct: r.correct + (isCorrect ? 1 : 0),
      total: r.total + 1,
    }));
    onRate(srsCard.cardId, rating);

    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(i => i + 1);
      setRevealed(false);
    } else {
      setSessionComplete(true);
    }
  };

  if (!vocab) {
    // Skip unknown vocab
    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setSessionComplete(true);
    }
    return null;
  }

  return (
    <LinearGradient colors={[Colors.primaryDark, Colors.background]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>SRS Review</Text>
            <Text style={styles.headerSub}>{currentIndex + 1} / {dueCards.length}</Text>
          </View>
        </View>

        <ProgressBar
          progress={(currentIndex) / dueCards.length}
          color={Colors.accent}
          height={4}
        />

        <ScrollView contentContainerStyle={styles.content}>
          {/* Card stats */}
          <View style={styles.cardStats}>
            <View style={[styles.masteryBadge, { backgroundColor: MASTERY_COLORS[mastery] + '20', borderColor: MASTERY_COLORS[mastery] + '60' }]}>
              <Text style={[styles.masteryText, { color: MASTERY_COLORS[mastery] }]}>
                {MASTERY_LABELS[mastery]}
              </Text>
            </View>
            {srsCard.totalReviews > 0 && (
              <Text style={styles.retentionText}>
                {retention}% retention ({srsCard.totalReviews} reviews)
              </Text>
            )}
          </View>

          {/* Flash Card */}
          <TouchableOpacity
            style={styles.flashCard}
            onPress={() => setRevealed(true)}
            activeOpacity={0.95}
          >
            <LinearGradient colors={['#1E3A56', '#152B45']} style={styles.flashCardGradient}>
              {/* Front */}
              <View style={styles.flashFront}>
                <Text style={styles.categoryText}>{vocab.category.replace('_', ' ').toUpperCase()}</Text>
                <Text style={styles.flashSpanish}>{vocab.spanish}</Text>
                <Text style={styles.flashPhonetic}>{vocab.phonetic}</Text>
                <AudioButton text={vocab.spanish} />
              </View>

              {/* Back (revealed) */}
              {revealed && (
                <View style={styles.flashBack}>
                  <View style={styles.divider} />
                  <Text style={styles.flashEnglish}>{vocab.english}</Text>
                  {vocab.exampleSentence && (
                    <View style={styles.exampleBox}>
                      <Text style={styles.exampleSpanish}>{vocab.exampleSentence}</Text>
                      <Text style={styles.exampleEnglish}>{vocab.exampleTranslation}</Text>
                    </View>
                  )}
                  {vocab.notes && (
                    <Text style={styles.noteText}>📌 {vocab.notes}</Text>
                  )}
                </View>
              )}

              {!revealed && (
                <Text style={styles.tapHint}>Tap to reveal</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Rating buttons */}
          {revealed && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>How well did you remember?</Text>
              <View style={styles.ratingButtons}>
                <RatingButton
                  label="Again"
                  sublabel="Forgot"
                  color={Colors.error}
                  onPress={() => handleRate(0)}
                />
                <RatingButton
                  label="Hard"
                  sublabel="Difficult"
                  color={Colors.warning}
                  onPress={() => handleRate(2)}
                />
                <RatingButton
                  label="Good"
                  sublabel="Recalled"
                  color={Colors.success}
                  onPress={() => handleRate(4)}
                />
                <RatingButton
                  label="Easy"
                  sublabel="Perfect"
                  color={Colors.accent}
                  onPress={() => handleRate(5)}
                />
              </View>
              <Text style={styles.ratingNote}>
                "Again" = review again today • "Easy" = long interval next
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function RatingButton({ label, sublabel, color, onPress }: {
  label: string; sublabel: string; color: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.ratingBtn, { borderColor: color + '60', backgroundColor: color + '15' }]}
      onPress={onPress}
    >
      <Text style={[styles.ratingBtnLabel, { color }]}>{label}</Text>
      <Text style={styles.ratingBtnSub}>{sublabel}</Text>
    </TouchableOpacity>
  );
}

function SummaryRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, color ? { color } : {}]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 12,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: Colors.backgroundCard,
    justifyContent: 'center', alignItems: 'center',
  },
  headerInfo: { flex: 1 },
  headerTitle: { color: Colors.textPrimary, fontWeight: '700', fontSize: 17 },
  headerSub: { color: Colors.textMuted, fontSize: 13 },
  content: { padding: 20 },
  cardStats: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12,
  },
  masteryBadge: {
    borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1,
  },
  masteryText: { fontSize: 11, fontWeight: '700' },
  retentionText: { color: Colors.textMuted, fontSize: 12 },
  flashCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  flashCardGradient: { padding: 28, minHeight: 240 },
  flashFront: { alignItems: 'center', gap: 10 },
  categoryText: { color: Colors.textMuted, fontSize: 10, letterSpacing: 1.5 },
  flashSpanish: { color: Colors.textPrimary, fontSize: 38, fontWeight: '800', textAlign: 'center' },
  flashPhonetic: { color: Colors.textMuted, fontSize: 16, fontStyle: 'italic' },
  tapHint: { color: Colors.textMuted, fontSize: 13, textAlign: 'center', marginTop: 16 },
  flashBack: { marginTop: 16, gap: 10 },
  divider: { height: 1, backgroundColor: Colors.border },
  flashEnglish: { color: Colors.accent, fontSize: 26, fontWeight: '800' },
  exampleBox: { backgroundColor: Colors.backgroundLight, borderRadius: 10, padding: 10 },
  exampleSpanish: { color: Colors.textPrimary, fontSize: 13, fontStyle: 'italic', marginBottom: 4 },
  exampleEnglish: { color: Colors.textSecondary, fontSize: 12 },
  noteText: { color: Colors.warning, fontSize: 12, lineHeight: 18 },

  ratingContainer: { gap: 12 },
  ratingLabel: { color: Colors.textSecondary, fontSize: 13, textAlign: 'center' },
  ratingButtons: { flexDirection: 'row', gap: 8 },
  ratingBtn: {
    flex: 1, borderRadius: 12, borderWidth: 1.5,
    paddingVertical: 14, alignItems: 'center',
  },
  ratingBtnLabel: { fontWeight: '700', fontSize: 14 },
  ratingBtnSub: { color: Colors.textMuted, fontSize: 10, marginTop: 2 },
  ratingNote: { color: Colors.textMuted, fontSize: 11, textAlign: 'center' },

  emptyContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: 32, gap: 16,
  },
  emptyIcon: { fontSize: 64 },
  emptyTitle: { color: Colors.textPrimary, fontSize: 24, fontWeight: '800' },
  emptyDesc: { color: Colors.textSecondary, fontSize: 15, textAlign: 'center', lineHeight: 22 },
  primaryBtn: { borderRadius: 14, overflow: 'hidden', width: '100%' },
  btnGradient: { height: 52, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: Colors.textDark, fontWeight: '800', fontSize: 16 },

  summaryCard: {
    backgroundColor: Colors.backgroundCard, borderRadius: 14, padding: 16,
    width: '100%', gap: 12,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { color: Colors.textSecondary, fontSize: 14 },
  summaryValue: { color: Colors.textPrimary, fontWeight: '700', fontSize: 14 },
  summaryNote: {
    color: Colors.textSecondary, fontSize: 13, textAlign: 'center',
    lineHeight: 20, fontStyle: 'italic',
  },
});
