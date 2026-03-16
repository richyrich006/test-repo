import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Colors, Shadows } from '../theme/colors';
import { ILRBadge } from '../components/ILRBadge';
import { ProgressBar } from '../components/ProgressBar';
import { UserProgress } from '../types';
import { getLevel, getDailyProgress } from '../store/progressStore';
import { getDeckStats, getDueCards } from '../store/srsEngine';
import { spanishUnits, spanishLessons } from '../data/curriculum';

interface Props {
  progress: UserProgress;
  onPressUnit: (unitId: string) => void;
  onPressReview: () => void;
  onPressProfile: () => void;
}

export function HomeScreen({ progress, onPressUnit, onPressReview, onPressProfile }: Props) {
  const levelInfo = getLevel(progress.totalXP);
  const dailyProgress = getDailyProgress(progress);
  const deckStats = getDeckStats(progress.srsCards);
  const dueCards = getDueCards(progress.srsCards);
  const nextLesson = spanishLessons.find(l => !progress.completedLessons.includes(l.id));

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.flagEmoji}>🇪🇸</Text>
          <View>
            <Text style={styles.headerTitle}>Spanish</Text>
            <Text style={styles.headerSub}>CIA/FSI Method</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onPressProfile} style={styles.avatarBtn}>
          <Text style={styles.avatarText}>{levelInfo.title.charAt(0)}</Text>
        </TouchableOpacity>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatChip icon="🔥" value={`${progress.streak}`} label="Streak" color={Colors.streak} />
        <StatChip icon="⭐" value={`${progress.totalXP}`} label="XP" color={Colors.gold} />
        <StatChip icon="💎" value={levelInfo.title} label="Rank" color={Colors.primary} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Daily goal */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardTitle}>Daily Goal</Text>
            <Text style={styles.cardMeta}>{progress.todayMinutes}/{progress.dailyGoalMinutes} min</Text>
          </View>
          <ProgressBar
            progress={dailyProgress}
            color={dailyProgress >= 1 ? Colors.success : Colors.primary}
            height={12}
          />
          {dailyProgress >= 1 && (
            <Text style={styles.goalDone}>✅ Goal complete for today!</Text>
          )}
        </View>

        {/* Review due */}
        {dueCards.length > 0 && (
          <TouchableOpacity style={styles.reviewCard} onPress={onPressReview} activeOpacity={0.85}>
            <Text style={styles.reviewEmoji}>🧠</Text>
            <View style={styles.reviewContent}>
              <Text style={styles.reviewTitle}>Review Due</Text>
              <Text style={styles.reviewSub}>{dueCards.length} vocab cards ready</Text>
            </View>
            <View style={styles.reviewBadge}>
              <Text style={styles.reviewBadgeText}>{dueCards.length}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Continue button */}
        {nextLesson && (
          <TouchableOpacity
            style={styles.continueCard}
            onPress={() => onPressUnit(nextLesson.unitId)}
            activeOpacity={0.85}
          >
            <View style={styles.continueLeft}>
              <Text style={styles.continueLabel}>CONTINUE</Text>
              <Text style={styles.continueTitle}>{nextLesson.title}</Text>
              <Text style={styles.continueSub}>{nextLesson.subtitle}</Text>
            </View>
            <Text style={styles.continueArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* Units */}
        <Text style={styles.sectionTitle}>Training Units</Text>
        {spanishUnits.map(unit => {
          const unitLessons = spanishLessons.filter(l => l.unitId === unit.id);
          const completedCount = unitLessons.filter(l =>
            progress.completedLessons.includes(l.id)
          ).length;
          const unitProgress = unitLessons.length > 0 ? completedCount / unitLessons.length : 0;
          const isLocked = unit.ilrLevel > progress.currentILRLevel + 1;

          return (
            <TouchableOpacity
              key={unit.id}
              style={[styles.unitCard, isLocked && styles.unitCardLocked]}
              onPress={() => !isLocked && onPressUnit(unit.id)}
              activeOpacity={isLocked ? 1 : 0.85}
            >
              <View style={[styles.unitIconBox, { backgroundColor: unit.color + '20' }]}>
                <Text style={styles.unitIcon}>{unit.icon}</Text>
              </View>
              <View style={styles.unitContent}>
                <View style={styles.unitTitleRow}>
                  <Text style={[styles.unitTitle, isLocked && { color: Colors.textMuted }]}>
                    {unit.title}
                  </Text>
                  <ILRBadge level={unit.ilrLevel} size="small" />
                </View>
                <Text style={[styles.unitSub, isLocked && { color: Colors.textMuted }]}>
                  {unit.subtitle}
                </Text>
                <ProgressBar
                  progress={unitProgress}
                  color={isLocked ? Colors.border : unit.color}
                  height={5}
                />
                <Text style={styles.unitMeta}>
                  {isLocked ? '🔒 Complete previous unit' : `${completedCount}/${unitLessons.length} lessons`}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Vocab stats */}
        {deckStats.total > 0 && (
          <View style={styles.vocabStats}>
            <Text style={styles.sectionTitle}>Vocabulary Progress</Text>
            <View style={styles.vocabGrid}>
              <VocabStat label="Total" value={deckStats.total} color={Colors.primary} />
              <VocabStat label="Due" value={deckStats.dueToday} color={Colors.streak} />
              <VocabStat label="Mature" value={deckStats.matureCards} color={Colors.success} />
              <VocabStat label="Retention" value={`${deckStats.overallRetention}%`} color={Colors.gold} />
            </View>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatChip({ icon, value, label, color }: {
  icon: string; value: string; label: string; color: string;
}) {
  return (
    <View style={[styles.statChip, { borderColor: color + '40' }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function VocabStat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <View style={[styles.vocabStatBox, { borderColor: color + '30' }]}>
      <Text style={[styles.vocabStatValue, { color }]}>{value}</Text>
      <Text style={styles.vocabStatLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20,
    paddingTop: 16, paddingBottom: 8,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  flagEmoji: { fontSize: 36 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  headerSub: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  avatarBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    ...Shadows.button,
  },
  avatarText: { color: Colors.textWhite, fontWeight: '800', fontSize: 18 },

  statsRow: {
    flexDirection: 'row', paddingHorizontal: 20,
    paddingBottom: 12, gap: 8,
  },
  statChip: {
    flex: 1, borderRadius: 12, borderWidth: 1.5,
    paddingVertical: 8, alignItems: 'center', gap: 2,
    backgroundColor: Colors.backgroundCard, ...Shadows.card,
  },
  statIcon: { fontSize: 16 },
  statValue: { fontWeight: '800', fontSize: 14 },
  statLabel: { color: Colors.textMuted, fontSize: 10 },

  scroll: { paddingHorizontal: 20, gap: 12 },

  card: {
    backgroundColor: Colors.backgroundCard, borderRadius: 16,
    padding: 16, gap: 10, ...Shadows.card,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontWeight: '700', fontSize: 15, color: Colors.textPrimary },
  cardMeta: { color: Colors.textMuted, fontSize: 13 },
  goalDone: { color: Colors.success, fontSize: 13, fontWeight: '600' },

  reviewCard: {
    backgroundColor: Colors.navyLight, borderRadius: 16,
    padding: 16, flexDirection: 'row', alignItems: 'center',
    gap: 12, borderWidth: 1.5, borderColor: Colors.navy + '30',
    ...Shadows.card,
  },
  reviewEmoji: { fontSize: 32 },
  reviewContent: { flex: 1 },
  reviewTitle: { fontWeight: '700', fontSize: 15, color: Colors.navy },
  reviewSub: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },
  reviewBadge: {
    backgroundColor: Colors.navy, borderRadius: 14,
    width: 28, height: 28, justifyContent: 'center', alignItems: 'center',
  },
  reviewBadgeText: { color: Colors.textWhite, fontWeight: '800', fontSize: 13 },

  continueCard: {
    backgroundColor: Colors.primary, borderRadius: 16,
    padding: 18, flexDirection: 'row', alignItems: 'center',
    ...Shadows.button,
  },
  continueLeft: { flex: 1 },
  continueLabel: {
    color: Colors.textWhite + 'AA', fontSize: 10,
    fontWeight: '700', letterSpacing: 1.5, marginBottom: 2,
  },
  continueTitle: { color: Colors.textWhite, fontSize: 17, fontWeight: '800' },
  continueSub: { color: Colors.textWhite + 'CC', fontSize: 12, marginTop: 3 },
  continueArrow: { color: Colors.textWhite, fontSize: 28, fontWeight: '300' },

  sectionTitle: {
    fontSize: 17, fontWeight: '800', color: Colors.textPrimary, marginTop: 4,
  },

  unitCard: {
    backgroundColor: Colors.backgroundCard, borderRadius: 16,
    padding: 14, flexDirection: 'row', alignItems: 'center',
    gap: 12, ...Shadows.card, borderWidth: 1, borderColor: Colors.border,
  },
  unitCardLocked: { opacity: 0.5 },
  unitIconBox: {
    width: 52, height: 52, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  unitIcon: { fontSize: 26 },
  unitContent: { flex: 1, gap: 4 },
  unitTitleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  unitTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, flex: 1, marginRight: 6 },
  unitSub: { fontSize: 12, color: Colors.textSecondary },
  unitMeta: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },

  vocabStats: { gap: 10 },
  vocabGrid: { flexDirection: 'row', gap: 8 },
  vocabStatBox: {
    flex: 1, borderRadius: 12, borderWidth: 1.5,
    paddingVertical: 12, alignItems: 'center',
    backgroundColor: Colors.backgroundCard, gap: 3, ...Shadows.card,
  },
  vocabStatValue: { fontSize: 20, fontWeight: '800' },
  vocabStatLabel: { fontSize: 11, color: Colors.textMuted },
});
