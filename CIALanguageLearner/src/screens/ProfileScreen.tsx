import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { ProgressBar } from '../components/ProgressBar';
import { ILRBadge } from '../components/ILRBadge';
import { UserProgress } from '../types';
import { getLevel, getDailyProgress, resetProgress } from '../store/progressStore';
import { getDeckStats } from '../store/srsEngine';
import { ILR_LEVELS } from '../data/curriculum';

interface Props {
  progress: UserProgress;
  onBack: () => void;
  onReset: () => void;
}

export function ProfileScreen({ progress, onBack, onReset }: Props) {
  const levelInfo = getLevel(progress.totalXP);
  const deckStats = getDeckStats(progress.srsCards);
  const currentILR = ILR_LEVELS.find(l => l.level === progress.currentILRLevel) || ILR_LEVELS[0];

  const xpToNext = levelInfo.nextXP - progress.totalXP;
  const currentLevelXP = progress.totalXP - (levelInfo.level > 1 ? getLevel(progress.totalXP - 1).nextXP : 0);
  const levelProgress = levelInfo.nextXP > 0
    ? Math.min(1, progress.totalXP / levelInfo.nextXP)
    : 1;

  const handleReset = () => {
    Alert.alert(
      'Reset All Progress?',
      'This will delete all your lesson progress, XP, and vocabulary data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetProgress();
            onReset();
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={[Colors.primaryDark, Colors.background]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agent Profile</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Rank Card */}
          <View style={styles.rankCard}>
            <LinearGradient colors={['#1E3A56', '#152B45']} style={styles.rankGradient}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankBadgeText}>{levelInfo.title.charAt(0)}</Text>
              </View>
              <Text style={styles.rankTitle}>{levelInfo.title}</Text>
              <Text style={styles.rankLevel}>Level {levelInfo.level}</Text>

              <View style={styles.xpRow}>
                <Text style={styles.xpTotal}>{progress.totalXP.toLocaleString()} XP</Text>
                <Text style={styles.xpNext}>{xpToNext > 0 ? `${xpToNext} to next rank` : 'Max rank!'}</Text>
              </View>
              <ProgressBar progress={levelProgress} color={Colors.accent} height={6} />
            </LinearGradient>
          </View>

          {/* ILR Progress */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Language Proficiency (ILR)</Text>
            <View style={styles.ilrCard}>
              <View style={styles.ilrHeader}>
                <ILRBadge level={progress.currentILRLevel} size="large" />
                <View style={styles.ilrInfo}>
                  <Text style={styles.ilrLabel}>{currentILR.label}</Text>
                  <Text style={styles.ilrCap}>{currentILR.operationalCapability}</Text>
                </View>
              </View>
              <View style={styles.ilrScale}>
                {[0, 1, 2, 3, 4, 5].map(level => (
                  <View key={level} style={styles.ilrScaleItem}>
                    <View style={[
                      styles.ilrScaleDot,
                      progress.currentILRLevel >= level && styles.ilrScaleDotActive,
                    ]} />
                    <Text style={[
                      styles.ilrScaleLabel,
                      progress.currentILRLevel >= level && styles.ilrScaleLabelActive,
                    ]}>
                      {level}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={styles.ciaNote}>★ CIA operational minimum: ILR 3</Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Training Statistics</Text>
            <View style={styles.statsGrid}>
              <StatCard icon="🔥" label="Day Streak" value={`${progress.streak} days`} color={Colors.error} />
              <StatCard icon="📚" label="Lessons Done" value={String(progress.completedLessons.length)} color={Colors.info} />
              <StatCard icon="⏱️" title="Total Study" label="Study Time" value={`${Math.round(progress.totalStudyMinutes / 60)}h ${progress.totalStudyMinutes % 60}m`} color={Colors.success} />
              <StatCard icon="🧠" label="Vocab Cards" value={String(deckStats.total)} color={Colors.primaryLight} />
              <StatCard icon="✅" label="Mature Cards" value={String(deckStats.matureCards)} color={Colors.success} />
              <StatCard icon="📊" label="Retention" value={`${deckStats.overallRetention}%`} color={Colors.accent} />
            </View>
          </View>

          {/* Skill Breakdown */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Skill Breakdown</Text>
            {(['reading', 'listening', 'speaking', 'writing'] as const).map(skill => (
              <View key={skill} style={styles.skillRow}>
                <Text style={styles.skillLabel}>{skill.charAt(0).toUpperCase() + skill.slice(1)}</Text>
                <ProgressBar
                  progress={progress.skills[skill] / 5}
                  color={Colors.primaryLight}
                  height={6}
                />
                <Text style={styles.skillILR}>ILR {progress.skills[skill]}</Text>
              </View>
            ))}
            <Text style={styles.skillNote}>Skills improve as you complete lessons and reviews.</Text>
          </View>

          {/* FSI Method Info */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>About This Method</Text>
            <Text style={styles.aboutText}>
              This app uses the FSI (Foreign Service Institute) Programmatic Course methodology — the same approach used to train CIA officers, diplomats, and intelligence analysts.
            </Text>
            <View style={styles.fsiStat}>
              <Text style={styles.fsiStatValue}>600</Text>
              <Text style={styles.fsiStatLabel}>classroom hours to ILR 3 (FSI estimate for Spanish)</Text>
            </View>
            <Text style={styles.aboutText}>
              Research shows spaced repetition (SRS) combined with structured pattern drills achieves 2-3x better retention than traditional study. Consistency beats intensity — 30 minutes daily beats 3-hour weekend sessions.
            </Text>
          </View>

          {/* Danger Zone */}
          <View style={styles.dangerZone}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Ionicons name="trash-outline" size={18} color={Colors.error} />
              <Text style={styles.resetText}>Reset All Progress</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function StatCard({ icon, label, value, color, title }: {
  icon: string; label: string; value: string; color: string; title?: string;
}) {
  return (
    <View style={[styles.statCard, { borderColor: color + '30' }]}>
      <Text style={styles.statCardIcon}>{icon}</Text>
      <Text style={[styles.statCardValue, { color }]}>{value}</Text>
      <Text style={styles.statCardLabel}>{label}</Text>
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
  headerTitle: { color: Colors.textPrimary, fontWeight: '700', fontSize: 18 },

  rankCard: { margin: 16, borderRadius: 16, overflow: 'hidden' },
  rankGradient: { padding: 24, alignItems: 'center', gap: 8 },
  rankBadge: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.accent,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 8,
  },
  rankBadgeText: { color: Colors.textDark, fontSize: 28, fontWeight: '800' },
  rankTitle: { color: Colors.textPrimary, fontSize: 22, fontWeight: '800' },
  rankLevel: { color: Colors.textSecondary, fontSize: 14 },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 8, marginBottom: 6 },
  xpTotal: { color: Colors.accent, fontWeight: '700', fontSize: 15 },
  xpNext: { color: Colors.textMuted, fontSize: 13 },

  section: { paddingHorizontal: 16, marginBottom: 12 },
  sectionCard: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14, padding: 16,
  },
  sectionTitle: { color: Colors.textPrimary, fontWeight: '700', fontSize: 16, marginBottom: 12 },

  ilrCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14, padding: 16, gap: 14,
  },
  ilrHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ilrInfo: { flex: 1 },
  ilrLabel: { color: Colors.textPrimary, fontWeight: '700', fontSize: 15 },
  ilrCap: { color: Colors.textSecondary, fontSize: 12, marginTop: 2, lineHeight: 17 },
  ilrScale: { flexDirection: 'row', justifyContent: 'space-between' },
  ilrScaleItem: { alignItems: 'center', gap: 4 },
  ilrScaleDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: Colors.border,
  },
  ilrScaleDotActive: { backgroundColor: Colors.accent },
  ilrScaleLabel: { color: Colors.textMuted, fontSize: 12 },
  ilrScaleLabelActive: { color: Colors.accent, fontWeight: '700' },
  ciaNote: { color: Colors.accent, fontSize: 12, textAlign: 'center', fontWeight: '600' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statCard: {
    flex: 1, minWidth: '30%',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12, padding: 12,
    borderWidth: 1, alignItems: 'center', gap: 4,
  },
  statCardIcon: { fontSize: 22 },
  statCardValue: { fontSize: 18, fontWeight: '800' },
  statCardLabel: { color: Colors.textMuted, fontSize: 11, textAlign: 'center' },

  skillRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  skillLabel: { color: Colors.textSecondary, fontSize: 13, width: 75 },
  skillILR: { color: Colors.textMuted, fontSize: 12, width: 40, textAlign: 'right' },
  skillNote: { color: Colors.textMuted, fontSize: 11, fontStyle: 'italic', marginTop: 4 },

  aboutText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 20, marginBottom: 12 },
  fsiStat: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 10, padding: 12, marginVertical: 8,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  fsiStatValue: { color: Colors.accent, fontSize: 28, fontWeight: '800' },
  fsiStatLabel: { color: Colors.textSecondary, fontSize: 12, flex: 1, lineHeight: 17 },

  dangerZone: { marginHorizontal: 16, marginBottom: 12 },
  resetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 12, borderWidth: 1, borderColor: Colors.error + '40',
    paddingVertical: 14, backgroundColor: Colors.error + '10',
  },
  resetText: { color: Colors.error, fontWeight: '600', fontSize: 14 },
});
