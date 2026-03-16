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
  onPressConversation: () => void;
  onPressSettings: () => void;
  onPressLesson?: (lessonId: string) => void;
}

// Map unit index to a tile color
const UNIT_TILE_COLORS = [
  Colors.unit1, Colors.unit2, Colors.unit3, Colors.unit4,
  Colors.unit5, Colors.unit6, Colors.unit7, Colors.unit8, Colors.unit9,
];

export function HomeScreen({ progress, onPressUnit, onPressReview, onPressProfile, onPressConversation, onPressSettings, onPressLesson }: Props) {
  const levelInfo = getLevel(progress.totalXP);
  const dailyProgress = getDailyProgress(progress);
  const deckStats = getDeckStats(progress.srsCards);
  const dueCards = getDueCards(progress.srsCards);
  const nextLesson = spanishLessons.find(l => !progress.completedLessons.includes(l.id));

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Yellow brand header ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.flagEmoji}>🇪🇸</Text>
            <View>
              <Text style={styles.headerTitle}>Spanish</Text>
              <Text style={styles.headerSub}>Latin America • FSI Method</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={onPressSettings} style={styles.settingsBtn}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressProfile} style={styles.avatarBtn}>
              <Text style={styles.avatarText}>{levelInfo.title.charAt(0)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stat row inside yellow header */}
        <View style={styles.statsRow}>
          <StatChip icon="🔥" value={`${progress.streak}`} label="Streak" />
          <StatChip icon="⭐" value={`${progress.totalXP}`} label="XP" />
          <StatChip icon="💎" value={levelInfo.title} label="Rank" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Today's Mission Card ── */}
        <View style={styles.missionCard}>
          <Text style={styles.missionLabel}>TODAY'S MISSION</Text>
          {nextLesson ? (
            <>
              <Text style={styles.missionTitle}>{nextLesson.title}</Text>
              <Text style={styles.missionSub}>{nextLesson.subtitle}</Text>
              <View style={styles.missionMeta}>
                <Text style={styles.missionMinutes}>⏱ {nextLesson.estimatedMinutes ?? 15} min</Text>
              </View>
              <TouchableOpacity
                style={styles.missionBtn}
                onPress={() => onPressLesson ? onPressLesson(nextLesson.id) : onPressUnit(nextLesson.unitId)}
                activeOpacity={0.85}
              >
                <Text style={styles.missionBtnText}>Start Lesson →</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.missionComplete}>🎖️ All lessons complete! Review vocabulary below.</Text>
          )}
        </View>

        {/* ── Daily Goal ── */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardTitle}>Daily Goal</Text>
            <Text style={styles.cardMeta}>{progress.todayMinutes}/{progress.dailyGoalMinutes} min</Text>
          </View>
          <ProgressBar
            progress={dailyProgress}
            color={dailyProgress >= 1 ? Colors.success : Colors.brand}
            height={10}
          />
          {dailyProgress >= 1
            ? <Text style={styles.goalDone}>✅ Goal complete for today!</Text>
            : <Text style={styles.goalHint}>Keep going — you're doing great!</Text>
          }
        </View>

        {/* ── Practice Conversation Button ── */}
        <TouchableOpacity style={styles.conversationBtn} onPress={onPressConversation} activeOpacity={0.85}>
          <Text style={styles.conversationIcon}>🤖</Text>
          <Text style={styles.conversationText}>Practice Conversation</Text>
          <Text style={styles.conversationArrow}>›</Text>
        </TouchableOpacity>

        {/* ── Review due ── */}
        {dueCards.length > 0 && (
          <TouchableOpacity style={styles.reviewCard} onPress={onPressReview} activeOpacity={0.85}>
            <View style={styles.reviewIconBox}>
              <Text style={styles.reviewEmoji}>🧠</Text>
            </View>
            <View style={styles.reviewContent}>
              <Text style={styles.reviewTitle}>Words to Review</Text>
              <Text style={styles.reviewSub}>{dueCards.length} vocabulary cards ready</Text>
            </View>
            <View style={styles.reviewBadge}>
              <Text style={styles.reviewBadgeText}>{dueCards.length}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* ── Continue button ── */}
        {nextLesson && (
          <TouchableOpacity
            style={styles.continueCard}
            onPress={() => onPressUnit(nextLesson.unitId)}
            activeOpacity={0.85}
          >
            <View style={styles.continueLeft}>
              <Text style={styles.continueLabel}>CONTINUE WHERE YOU LEFT OFF</Text>
              <Text style={styles.continueTitle}>{nextLesson.title}</Text>
              <Text style={styles.continueSub}>{nextLesson.subtitle}</Text>
            </View>
            <View style={styles.continueArrowBox}>
              <Text style={styles.continueArrow}>›</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* ── Units section title ── */}
        <Text style={styles.sectionTitle}>All Courses</Text>

        {/* ── 2-column Unit Grid ── */}
        <View style={styles.unitGrid}>
          {spanishUnits.map((unit, idx) => {
            const tileColor = UNIT_TILE_COLORS[idx % UNIT_TILE_COLORS.length];
            const unitLessons = spanishLessons.filter(l => l.unitId === unit.id);
            const completedCount = unitLessons.filter(l =>
              progress.completedLessons.includes(l.id)
            ).length;
            const unitProgress = unitLessons.length > 0 ? completedCount / unitLessons.length : 0;
            const isLocked = unit.ilrLevel > progress.currentILRLevel + 1;

            return (
              <TouchableOpacity
                key={unit.id}
                style={[styles.unitTile, { backgroundColor: isLocked ? '#C8CDD6' : tileColor }]}
                onPress={() => !isLocked && onPressUnit(unit.id)}
                activeOpacity={isLocked ? 1 : 0.82}
              >
                {isLocked && (
                  <View style={styles.lockOverlay}>
                    <Text style={styles.lockIcon}>🔒</Text>
                  </View>
                )}
                <Text style={styles.tileUnitLabel}>
                  {unit.title.split(':')[0].trim()}
                </Text>
                <Text style={styles.tileIcon}>{unit.icon}</Text>
                <Text style={styles.tileTitle} numberOfLines={2}>
                  {unit.title.includes(':') ? unit.title.split(':')[1].trim() : unit.title}
                </Text>
                <Text style={styles.tileMeta}>
                  {isLocked ? 'Locked' : `${completedCount}/${unitLessons.length} lessons`}
                </Text>
                {!isLocked && unitProgress > 0 && (
                  <View style={styles.tileProgressTrack}>
                    <View style={[styles.tileProgressFill, { width: `${unitProgress * 100}%` as any }]} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Vocabulary Stats ── */}
        {deckStats.total > 0 && (
          <View style={styles.vocabSection}>
            <Text style={styles.sectionTitle}>Vocabulary Progress</Text>
            <View style={styles.vocabGrid}>
              <VocabStat label="Total" value={deckStats.total} color={Colors.primary} />
              <VocabStat label="Due" value={deckStats.dueToday} color={Colors.streak} />
              <VocabStat label="Mature" value={deckStats.matureCards} color={Colors.success} />
              <VocabStat label="Retention" value={`${deckStats.overallRetention}%`} color={Colors.gold} />
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-components ─────────────────────────────────────────────────

function StatChip({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <View style={styles.statChip}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function VocabStat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <View style={styles.vocabStatBox}>
      <Text style={[styles.vocabStatValue, { color }]}>{value}</Text>
      <Text style={styles.vocabStatLabel}>{label}</Text>
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.backgroundAlt },

  // ── Yellow Header ──
  header: {
    backgroundColor: Colors.brand,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    gap: 16,
  },
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  flagEmoji: { fontSize: 34 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textBrand },
  headerSub: { fontSize: 12, color: Colors.textBrand + 'BB', marginTop: 1 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingsBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.10)',
    justifyContent: 'center', alignItems: 'center',
  },
  settingsIcon: { fontSize: 20 },
  avatarBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: Colors.textBrand, fontWeight: '800', fontSize: 18 },

  statsRow: { flexDirection: 'row', gap: 8 },
  statChip: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12, paddingVertical: 8,
    alignItems: 'center', gap: 2,
  },
  statIcon: { fontSize: 15 },
  statValue: { fontWeight: '800', fontSize: 14, color: Colors.textBrand },
  statLabel: { color: Colors.textBrand + 'CC', fontSize: 10 },

  // ── Scroll Content ──
  scroll: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },

  // ── Today's Mission Card ──
  missionCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    gap: 6,
    ...Shadows.card,
  },
  missionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  missionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  missionSub: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  missionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  missionMinutes: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  missionBtn: {
    backgroundColor: Colors.success,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  missionBtnText: {
    color: Colors.textWhite,
    fontWeight: '800',
    fontSize: 15,
  },
  missionComplete: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 8,
  },

  // ── Daily Goal Card ──
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16, padding: 16, gap: 10,
    ...Shadows.card,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontWeight: '700', fontSize: 15, color: Colors.textPrimary },
  cardMeta: { color: Colors.textMuted, fontSize: 13 },
  goalDone: { color: Colors.success, fontSize: 13, fontWeight: '600' },
  goalHint: { color: Colors.textMuted, fontSize: 12 },

  // ── Conversation Button ──
  conversationBtn: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  conversationIcon: { fontSize: 22 },
  conversationText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  conversationArrow: {
    fontSize: 26,
    color: Colors.textMuted,
    fontWeight: '300',
  },

  // ── Review Card ──
  reviewCard: {
    backgroundColor: Colors.backgroundCard, borderRadius: 16,
    padding: 14, flexDirection: 'row', alignItems: 'center',
    gap: 12, ...Shadows.card,
    borderLeftWidth: 4, borderLeftColor: Colors.primary,
  },
  reviewIconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center',
  },
  reviewEmoji: { fontSize: 22 },
  reviewContent: { flex: 1 },
  reviewTitle: { fontWeight: '700', fontSize: 15, color: Colors.textPrimary },
  reviewSub: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },
  reviewBadge: {
    backgroundColor: Colors.primary, borderRadius: 14,
    width: 30, height: 30, justifyContent: 'center', alignItems: 'center',
  },
  reviewBadgeText: { color: Colors.textWhite, fontWeight: '800', fontSize: 13 },

  // ── Continue Card ──
  continueCard: {
    backgroundColor: Colors.primary, borderRadius: 16,
    padding: 18, flexDirection: 'row', alignItems: 'center',
    ...Shadows.button,
  },
  continueLeft: { flex: 1 },
  continueLabel: {
    color: 'rgba(255,255,255,0.75)', fontSize: 10,
    fontWeight: '700', letterSpacing: 1.2, marginBottom: 4,
  },
  continueTitle: { color: Colors.textWhite, fontSize: 17, fontWeight: '800' },
  continueSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 3 },
  continueArrowBox: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  continueArrow: { color: Colors.textWhite, fontSize: 26, fontWeight: '300', marginTop: -2 },

  // ── Section Title ──
  sectionTitle: {
    fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginTop: 4,
  },

  // ── 2-column Unit Grid ──
  unitGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
  },
  unitTile: {
    width: '47.5%', borderRadius: 16, padding: 16,
    minHeight: 160, justifyContent: 'space-between',
    ...Shadows.tile, overflow: 'hidden',
  },
  lockOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'flex-end', alignItems: 'flex-end',
    padding: 12,
  },
  lockIcon: { fontSize: 20 },
  tileUnitLabel: {
    fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.8, textTransform: 'uppercase',
  },
  tileIcon: { fontSize: 36, marginVertical: 4 },
  tileTitle: {
    fontSize: 14, fontWeight: '800', color: Colors.textWhite, lineHeight: 19,
  },
  tileMeta: {
    fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 4,
  },
  tileProgressTrack: {
    height: 4, backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2, marginTop: 6, overflow: 'hidden',
  },
  tileProgressFill: {
    height: '100%', backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 2,
  },

  // ── Vocab Stats ──
  vocabSection: { gap: 10 },
  vocabGrid: { flexDirection: 'row', gap: 8 },
  vocabStatBox: {
    flex: 1, borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
    backgroundColor: Colors.backgroundCard, gap: 3,
    ...Shadows.card,
  },
  vocabStatValue: { fontSize: 20, fontWeight: '800' },
  vocabStatLabel: { fontSize: 11, color: Colors.textMuted },
});
