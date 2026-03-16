import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { ProgressBar } from '../components/ProgressBar';
import { ILRBadge } from '../components/ILRBadge';
import { UserProgress } from '../types';
import { getLevel, getDailyProgress } from '../store/progressStore';
import { getDeckStats, getDueCards } from '../store/srsEngine';
import { ILR_LEVELS, spanishUnits, spanishLessons } from '../data/curriculum';

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
  const currentILR = ILR_LEVELS.find(l => l.level === progress.currentILRLevel) || ILR_LEVELS[0];

  // Find next uncompleted lesson
  const nextLesson = spanishLessons.find(l => !progress.completedLessons.includes(l.id));

  return (
    <LinearGradient colors={[Colors.primaryDark, Colors.background]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Mission Briefing</Text>
              <Text style={styles.title}>Spanish Training</Text>
            </View>
            <TouchableOpacity onPress={onPressProfile} style={styles.profileBtn}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{levelInfo.title.charAt(0)}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* ILR Status Card */}
          <View style={styles.statusCard}>
            <LinearGradient colors={['#1E3A56', '#152B45']} style={styles.statusGradient}>
              <View style={styles.statusTop}>
                <View>
                  <Text style={styles.statusLabel}>Current Proficiency</Text>
                  <Text style={styles.statusILR}>ILR Level {progress.currentILRLevel}</Text>
                  <Text style={styles.statusDesc}>{currentILR.label}</Text>
                </View>
                <View style={styles.statusRight}>
                  <Text style={styles.xpValue}>{progress.totalXP.toLocaleString()}</Text>
                  <Text style={styles.xpLabel}>XP</Text>
                  <Text style={styles.rankTitle}>{levelInfo.title}</Text>
                </View>
              </View>

              <View style={styles.statusStats}>
                <StatPill icon="🔥" label="Streak" value={`${progress.streak}d`} />
                <StatPill icon="📚" label="Lessons" value={`${progress.completedLessons.length}/${spanishLessons.length}`} />
                <StatPill icon="⏱️" label="Today" value={`${progress.todayMinutes}m`} />
              </View>
            </LinearGradient>
          </View>

          {/* Daily Goal */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Daily Mission</Text>
              <Text style={styles.sectionMeta}>
                {progress.todayMinutes}/{progress.dailyGoalMinutes} min
              </Text>
            </View>
            <ProgressBar
              progress={dailyProgress}
              color={dailyProgress >= 1 ? Colors.success : Colors.accent}
              height={10}
            />
            {dailyProgress >= 1 && (
              <Text style={styles.goalComplete}>✓ Daily mission complete!</Text>
            )}
          </View>

          {/* SRS Review Card */}
          {dueCards.length > 0 && (
            <TouchableOpacity onPress={onPressReview} activeOpacity={0.8}>
              <LinearGradient
                colors={[Colors.accent + 'DD', Colors.accentDark]}
                style={styles.reviewCard}
              >
                <View style={styles.reviewLeft}>
                  <Text style={styles.reviewTitle}>SRS Review Due</Text>
                  <Text style={styles.reviewCount}>{dueCards.length} cards</Text>
                  <Text style={styles.reviewDesc}>Don't let your review pile up.</Text>
                </View>
                <Text style={styles.reviewIcon}>🧠</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Next Lesson */}
          {nextLesson && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Continue Training</Text>
              <TouchableOpacity
                style={styles.nextLesson}
                onPress={() => onPressUnit(nextLesson.unitId)}
                activeOpacity={0.8}
              >
                <View style={styles.nextLessonLeft}>
                  <ILRBadge level={nextLesson.ilrLevel} size="small" />
                  <Text style={styles.nextLessonTitle}>{nextLesson.title}</Text>
                  <Text style={styles.nextLessonSub}>{nextLesson.subtitle}</Text>
                  <Text style={styles.nextLessonTime}>
                    <Ionicons name="time-outline" size={12} color={Colors.textMuted} /> {nextLesson.estimatedMinutes} min
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.accent} />
              </TouchableOpacity>
            </View>
          )}

          {/* Units */}
          <View style={styles.section}>
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
                  activeOpacity={isLocked ? 1 : 0.8}
                >
                  <View style={[styles.unitIcon, { backgroundColor: unit.color + '30' }]}>
                    <Text style={styles.unitEmoji}>{unit.icon}</Text>
                  </View>
                  <View style={styles.unitContent}>
                    <View style={styles.unitTitleRow}>
                      <Text style={[styles.unitTitle, isLocked && styles.textLocked]}>
                        {unit.title}
                      </Text>
                      <ILRBadge level={unit.ilrLevel} size="small" />
                    </View>
                    <Text style={[styles.unitSubtitle, isLocked && styles.textLocked]}>
                      {unit.subtitle}
                    </Text>
                    <ProgressBar
                      progress={unitProgress}
                      color={isLocked ? Colors.textMuted : unit.color}
                      height={4}
                    />
                    <Text style={styles.unitProgress}>
                      {isLocked ? '🔒 Complete previous unit to unlock' : `${completedCount}/${unitLessons.length} lessons`}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* SRS Stats */}
          {deckStats.total > 0 && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Vocabulary Intelligence</Text>
              <View style={styles.statsGrid}>
                <StatBox label="Total Cards" value={String(deckStats.total)} color={Colors.info} />
                <StatBox label="Due Today" value={String(deckStats.dueToday)} color={Colors.warning} />
                <StatBox label="Mature" value={String(deckStats.matureCards)} color={Colors.success} />
                <StatBox label="Retention" value={`${deckStats.overallRetention}%`} color={Colors.accent} />
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function StatPill({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statPillIcon}>{icon}</Text>
      <Text style={styles.statPillValue}>{value}</Text>
      <Text style={styles.statPillLabel}>{label}</Text>
    </View>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.statBox, { borderColor: color + '40' }]}>
      <Text style={[styles.statBoxValue, { color }]}>{value}</Text>
      <Text style={styles.statBoxLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: { color: Colors.textMuted, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  title: { color: Colors.textPrimary, fontSize: 24, fontWeight: '800', marginTop: 2 },
  profileBtn: {},
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.accent,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: Colors.textDark, fontWeight: '800', fontSize: 18 },

  statusCard: { margin: 16, borderRadius: 16, overflow: 'hidden' },
  statusGradient: { padding: 20 },
  statusTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statusLabel: { color: Colors.textMuted, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  statusILR: { color: Colors.textPrimary, fontSize: 26, fontWeight: '800' },
  statusDesc: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },
  statusRight: { alignItems: 'flex-end' },
  xpValue: { color: Colors.accent, fontSize: 28, fontWeight: '800' },
  xpLabel: { color: Colors.textMuted, fontSize: 11, textTransform: 'uppercase' },
  rankTitle: { color: Colors.textSecondary, fontSize: 13, marginTop: 4, fontWeight: '600' },
  statusStats: { flexDirection: 'row', gap: 8 },
  statPill: {
    flex: 1, backgroundColor: Colors.overlay,
    borderRadius: 10, padding: 10, alignItems: 'center',
  },
  statPillIcon: { fontSize: 16 },
  statPillValue: { color: Colors.textPrimary, fontWeight: '700', fontSize: 15, marginTop: 2 },
  statPillLabel: { color: Colors.textMuted, fontSize: 10, marginTop: 1 },

  sectionCard: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14, padding: 16,
  },
  section: { paddingHorizontal: 16, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { color: Colors.textPrimary, fontWeight: '700', fontSize: 16, marginBottom: 10 },
  sectionMeta: { color: Colors.textMuted, fontSize: 13 },
  goalComplete: { color: Colors.success, fontSize: 13, marginTop: 8, fontWeight: '600' },

  reviewCard: {
    marginHorizontal: 16, marginBottom: 12,
    borderRadius: 14, padding: 18,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  reviewLeft: {},
  reviewTitle: { color: Colors.textDark, fontWeight: '800', fontSize: 16 },
  reviewCount: { color: Colors.textDark, fontSize: 28, fontWeight: '800', marginVertical: 4 },
  reviewDesc: { color: Colors.textDark + 'AA', fontSize: 12 },
  reviewIcon: { fontSize: 48 },

  nextLesson: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12, padding: 14, gap: 12,
  },
  nextLessonLeft: { flex: 1, gap: 4 },
  nextLessonTitle: { color: Colors.textPrimary, fontWeight: '700', fontSize: 14 },
  nextLessonSub: { color: Colors.textSecondary, fontSize: 12 },
  nextLessonTime: { color: Colors.textMuted, fontSize: 11 },

  unitCard: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14, padding: 14, marginBottom: 10,
    alignItems: 'center', gap: 14,
  },
  unitCardLocked: { opacity: 0.5 },
  unitIcon: {
    width: 52, height: 52, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  unitEmoji: { fontSize: 26 },
  unitContent: { flex: 1 },
  unitTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  unitTitle: { color: Colors.textPrimary, fontWeight: '700', fontSize: 14, flex: 1, marginRight: 8 },
  unitSubtitle: { color: Colors.textSecondary, fontSize: 12, marginBottom: 8 },
  unitProgress: { color: Colors.textMuted, fontSize: 11, marginTop: 4 },
  textLocked: { color: Colors.textMuted },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statBox: {
    flex: 1, minWidth: '45%',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 10, padding: 12,
    borderWidth: 1, alignItems: 'center',
  },
  statBoxValue: { fontSize: 22, fontWeight: '800' },
  statBoxLabel: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
});
