import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../theme/colors';
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

  // ── Empty State ──
  if (dueCards.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vocabulary Review</Text>
        </View>
        <View style={styles.centeredContainer}>
          <Text style={styles.bigIcon}>✅</Text>
          <Text style={styles.bigTitle}>All Clear, Agent</Text>
          <Text style={styles.bigDesc}>
            No cards due for review right now. Your retention is on track.
            Come back after completing more lessons.
          </Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={onBack}>
            <Text style={styles.primaryBtnText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Session Complete ──
  if (sessionComplete) {
    const accuracy = sessionResults.total > 0
      ? Math.round((sessionResults.correct / sessionResults.total) * 100)
      : 0;
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onFinish} style={styles.backBtn}>
            <Ionicons name="close" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Complete</Text>
        </View>
        <View style={styles.centeredContainer}>
          <Text style={styles.bigIcon}>{accuracy >= 80 ? '🏆' : accuracy >= 60 ? '👍' : '📚'}</Text>
          <Text style={styles.bigTitle}>Session Done</Text>

          <View style={styles.summaryCard}>
            <SummaryRow label="Cards Reviewed" value={String(sessionResults.total)} />
            <SummaryRow label="Correct" value={String(sessionResults.correct)} color={Colors.success} />
            <SummaryRow
              label="Accuracy"
              value={`${accuracy}%`}
              color={accuracy >= 80 ? Colors.success : accuracy >= 60 ? Colors.streak : Colors.error}
            />
          </View>

          <View style={[styles.tipCard, { borderLeftColor: Colors.brand }]}>
            <Text style={[styles.tipLabel, { color: Colors.brandDark }]}>FSI RETENTION SCIENCE</Text>
            <Text style={styles.tipBody}>
              {accuracy >= 80
                ? 'Excellent! At this rate your SRS intervals will extend — you\'re building long-term memory.'
                : accuracy >= 60
                ? 'Good progress. Consistent daily review sessions compound significantly over time.'
                : 'The FSI recommends re-reviewing weak cards within 24hrs. Keep at it — struggle drives retention.'}
            </Text>
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={onFinish}>
            <Text style={styles.primaryBtnText}>Return to Home →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setSessionComplete(true);
    }
    return null;
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>SRS Vocabulary Review</Text>
          <Text style={styles.headerSub}>{currentIndex + 1} of {dueCards.length} cards</Text>
        </View>
      </View>

      {/* ── Progress bar ── */}
      <ProgressBar
        progress={currentIndex / dueCards.length}
        color={Colors.brand}
        height={5}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── Card metadata ── */}
        <View style={styles.cardMeta}>
          <View style={[styles.masteryBadge, {
            backgroundColor: MASTERY_COLORS[mastery] + '20',
            borderColor: MASTERY_COLORS[mastery] + '60',
          }]}>
            <Text style={[styles.masteryText, { color: MASTERY_COLORS[mastery] }]}>
              {MASTERY_LABELS[mastery]}
            </Text>
          </View>
          {srsCard.totalReviews > 0 && (
            <Text style={styles.retentionText}>
              {retention}% retention · {srsCard.totalReviews} reviews
            </Text>
          )}
        </View>

        {/* ── Flash Card ── white, high contrast ── */}
        <TouchableOpacity
          style={styles.flashCard}
          onPress={() => setRevealed(true)}
          activeOpacity={0.92}
        >
          {/* Front face — always visible */}
          <View style={styles.flashFront}>
            <Text style={styles.categoryLabel}>
              {vocab.category.replace('_', ' ').toUpperCase()}
            </Text>
            <Text style={styles.flashSpanish}>{vocab.spanish}</Text>
            <Text style={styles.flashPhonetic}>{vocab.phonetic}</Text>
            <AudioButton text={vocab.spanish} />
          </View>

          {/* Back face — revealed on tap */}
          {revealed ? (
            <View style={styles.flashBack}>
              <View style={styles.divider} />
              <Text style={styles.flashEnglish}>{vocab.english}</Text>
              {vocab.exampleSentence && (
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleSpanish}>"{vocab.exampleSentence}"</Text>
                  <Text style={styles.exampleEnglish}>{vocab.exampleTranslation}</Text>
                </View>
              )}
              {vocab.notes && (
                <View style={styles.noteBox}>
                  <Text style={styles.noteText}>📌 {vocab.notes}</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.tapHintRow}>
              <Text style={styles.tapHint}>Tap to reveal translation</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* ── Rating buttons ── */}
        {revealed && (
          <View style={styles.ratingSection}>
            <Text style={styles.ratingPrompt}>How well did you recall this?</Text>
            <View style={styles.ratingButtons}>
              <RatingButton label="Again" sublabel="Forgot" color={Colors.error} onPress={() => handleRate(0)} />
              <RatingButton label="Hard" sublabel="Difficult" color={Colors.streak} onPress={() => handleRate(2)} />
              <RatingButton label="Good" sublabel="Recalled" color={Colors.success} onPress={() => handleRate(4)} />
              <RatingButton label="Easy" sublabel="Perfect" color={Colors.primary} onPress={() => handleRate(5)} />
            </View>
            <Text style={styles.ratingHint}>
              "Again" = review today · "Easy" = extended interval
            </Text>
          </View>
        )}

        {/* ── FSI Tip ── */}
        <View style={[styles.tipCard, { borderLeftColor: Colors.primary }]}>
          <Text style={[styles.tipLabel, { color: Colors.primary }]}>FSI SRS METHOD</Text>
          <Text style={styles.tipBody}>
            The CIA uses Spaced Repetition Science: optimal review intervals of 1hr, 1 day, 3 days, 1 week,
            2 weeks, 1 month. This mirrors the Ebbinghaus forgetting curve. Consistent daily review
            is more effective than long infrequent sessions.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-components ─────────────────────────────────────────────────

function RatingButton({ label, sublabel, color, onPress }: {
  label: string; sublabel: string; color: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.ratingBtn, { borderColor: color + '60', backgroundColor: color + '12' }]}
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

// ── Styles ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.backgroundAlt },

  header: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 12,
    backgroundColor: Colors.backgroundCard,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.backgroundMuted,
    justifyContent: 'center', alignItems: 'center',
  },
  headerInfo: { flex: 1 },
  headerTitle: { color: Colors.textPrimary, fontWeight: '800', fontSize: 16 },
  headerSub: { color: Colors.textMuted, fontSize: 12, marginTop: 1 },

  content: { padding: 16, gap: 14, paddingBottom: 40 },

  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  masteryBadge: {
    borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1.5,
  },
  masteryText: { fontSize: 11, fontWeight: '800' },
  retentionText: { color: Colors.textMuted, fontSize: 12 },

  // ── White flashcard ──
  flashCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20, borderWidth: 2, borderColor: Colors.border,
    overflow: 'hidden', ...Shadows.tile,
  },
  flashFront: { padding: 32, alignItems: 'center', gap: 12 },
  categoryLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.5,
    color: Colors.textMuted,
  },
  flashSpanish: {
    color: Colors.textPrimary, fontSize: 42, fontWeight: '800',
    textAlign: 'center', lineHeight: 50,
  },
  flashPhonetic: {
    color: Colors.textMuted, fontSize: 16, fontStyle: 'italic', textAlign: 'center',
  },
  tapHintRow: {
    paddingVertical: 14, alignItems: 'center',
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  tapHint: { color: Colors.textMuted, fontSize: 14 },

  flashBack: {
    padding: 24, gap: 12,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  divider: { height: 0 }, // kept for compat
  flashEnglish: {
    color: Colors.primary, fontSize: 30, fontWeight: '800',
  },
  exampleBox: {
    backgroundColor: Colors.backgroundMuted, borderRadius: 12, padding: 12, gap: 4,
  },
  exampleSpanish: { color: Colors.textPrimary, fontSize: 13, fontStyle: 'italic' },
  exampleEnglish: { color: Colors.textSecondary, fontSize: 12 },
  noteBox: {
    backgroundColor: Colors.brandLight, borderRadius: 10, padding: 10,
  },
  noteText: { color: Colors.brandDark, fontSize: 13, lineHeight: 18 },

  // ── Rating ──
  ratingSection: { gap: 10 },
  ratingPrompt: {
    color: Colors.textPrimary, fontSize: 15, fontWeight: '700', textAlign: 'center',
  },
  ratingButtons: { flexDirection: 'row', gap: 8 },
  ratingBtn: {
    flex: 1, borderRadius: 12, borderWidth: 2,
    paddingVertical: 14, alignItems: 'center', gap: 2,
  },
  ratingBtnLabel: { fontWeight: '800', fontSize: 14 },
  ratingBtnSub: { color: Colors.textMuted, fontSize: 10 },
  ratingHint: { color: Colors.textMuted, fontSize: 11, textAlign: 'center' },

  // ── Tip card ──
  tipCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12, padding: 14,
    borderLeftWidth: 4, gap: 6, ...Shadows.card,
  },
  tipLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  tipBody: { color: Colors.textSecondary, fontSize: 13, lineHeight: 19 },

  // ── Centered states ──
  centeredContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: 32, gap: 16,
  },
  bigIcon: { fontSize: 64 },
  bigTitle: { color: Colors.textPrimary, fontSize: 24, fontWeight: '800', textAlign: 'center' },
  bigDesc: {
    color: Colors.textSecondary, fontSize: 15,
    textAlign: 'center', lineHeight: 23,
  },
  primaryBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 16, paddingHorizontal: 40,
    alignItems: 'center', ...Shadows.button,
  },
  primaryBtnText: { color: Colors.textWhite, fontWeight: '800', fontSize: 16 },

  summaryCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14, padding: 16, width: '100%', gap: 12,
    borderWidth: 1.5, borderColor: Colors.border, ...Shadows.card,
  },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  summaryLabel: { color: Colors.textSecondary, fontSize: 14 },
  summaryValue: { color: Colors.textPrimary, fontWeight: '700', fontSize: 14 },
});
