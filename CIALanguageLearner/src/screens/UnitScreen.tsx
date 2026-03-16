import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../theme/colors';
import { ILRBadge } from '../components/ILRBadge';
import { ProgressBar } from '../components/ProgressBar';
import { UserProgress } from '../types';
import { getUnitById, getLessonsForUnit } from '../data/curriculum';

interface Props {
  unitId: string;
  progress: UserProgress;
  onPressLesson: (lessonId: string) => void;
  onBack: () => void;
}

export function UnitScreen({ unitId, progress, onPressLesson, onBack }: Props) {
  const unit = getUnitById(unitId);
  const lessons = getLessonsForUnit(unitId);

  if (!unit) return null;

  const completedCount = lessons.filter(l => progress.completedLessons.includes(l.id)).length;
  const unitProgress = lessons.length > 0 ? completedCount / lessons.length : 0;

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Colored header band ── */}
      <View style={[styles.header, { backgroundColor: unit.color }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{unit.title}</Text>
          <Text style={styles.headerSub}>{unit.subtitle}</Text>
        </View>
        <ILRBadge level={unit.ilrLevel} size="small" />
      </View>

      {/* ── Progress bar below header ── */}
      <View style={styles.progressStrip}>
        <ProgressBar progress={unitProgress} color={unit.color} height={6} />
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            {completedCount} / {lessons.length} lessons complete
          </Text>
          <Text style={[styles.progressPct, { color: unit.color }]}>
            {Math.round(unitProgress * 100)}%
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* ── Unit banner ── */}
        <View style={[styles.banner, { borderLeftColor: unit.color }]}>
          <Text style={styles.bannerIcon}>{unit.icon}</Text>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTheme}>{unit.theme}</Text>
            <Text style={styles.bannerIlr}>
              Target: ILR Level {unit.ilrLevel} proficiency
            </Text>
          </View>
        </View>

        {/* ── Lessons ── */}
        <Text style={styles.sectionTitle}>Lessons</Text>
        {lessons.map((lesson, index) => {
          const isCompleted = progress.completedLessons.includes(lesson.id);
          const isPreviousCompleted = index === 0 ||
            progress.completedLessons.includes(lessons[index - 1]?.id);
          const isAvailable = isPreviousCompleted;

          return (
            <TouchableOpacity
              key={lesson.id}
              style={[
                styles.lessonCard,
                isCompleted && styles.lessonCompleted,
                !isAvailable && styles.lessonLocked,
              ]}
              onPress={() => isAvailable && onPressLesson(lesson.id)}
              activeOpacity={isAvailable ? 0.82 : 1}
            >
              {/* Status circle */}
              <View style={[
                styles.statusCircle,
                isCompleted && { backgroundColor: Colors.success + '20', borderColor: Colors.success },
                !isAvailable && { backgroundColor: Colors.backgroundMuted, borderColor: Colors.border },
                isAvailable && !isCompleted && { backgroundColor: unit.color + '15', borderColor: unit.color },
              ]}>
                {isCompleted ? (
                  <Ionicons name="checkmark" size={18} color={Colors.success} />
                ) : !isAvailable ? (
                  <Ionicons name="lock-closed" size={14} color={Colors.textMuted} />
                ) : (
                  <Text style={[styles.statusNum, { color: unit.color }]}>{index + 1}</Text>
                )}
              </View>

              {/* Lesson info */}
              <View style={styles.lessonContent}>
                <View style={styles.lessonTitleRow}>
                  <Text style={[
                    styles.lessonTitle,
                    !isAvailable && styles.textMuted,
                    isCompleted && styles.textSuccess,
                  ]}>
                    {lesson.title}
                  </Text>
                  {isAvailable && !isCompleted && (
                    <View style={[styles.xpBadge, { backgroundColor: unit.color + '15', borderColor: unit.color + '50' }]}>
                      <Text style={[styles.xpText, { color: unit.color }]}>+{lesson.completionXP} XP</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.lessonObjective, !isAvailable && styles.textMuted]}>
                  {lesson.objective}
                </Text>
                <View style={styles.metaRow}>
                  <MetaItem icon="time-outline" text={`${lesson.estimatedMinutes} min`} />
                  <MetaItem icon="library-outline" text={`${lesson.vocabulary.length} words`} />
                  {lesson.drills.length > 0 && (
                    <MetaItem icon="repeat-outline" text={`${lesson.drills.length} drills`} />
                  )}
                  {lesson.dialogues.length > 0 && (
                    <MetaItem icon="chatbubbles-outline" text={`${lesson.dialogues.length} dialogues`} />
                  )}
                </View>
              </View>

              {isAvailable && !isCompleted && (
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              )}
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function MetaItem({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={12} color={Colors.textMuted} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.backgroundAlt },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16, gap: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { flex: 1 },
  headerTitle: { color: '#fff', fontWeight: '800', fontSize: 18 },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },

  progressStrip: {
    backgroundColor: Colors.backgroundCard,
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    gap: 6,
  },
  progressRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  progressText: { color: Colors.textMuted, fontSize: 12 },
  progressPct: { fontWeight: '700', fontSize: 12 },

  scroll: { paddingHorizontal: 16, paddingTop: 12, gap: 0 },

  banner: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderLeftWidth: 4, marginBottom: 16,
    ...Shadows.card,
  },
  bannerIcon: { fontSize: 36 },
  bannerText: { flex: 1 },
  bannerTheme: { color: Colors.textPrimary, fontWeight: '700', fontSize: 14 },
  bannerIlr: { color: Colors.textMuted, fontSize: 12, marginTop: 3 },

  sectionTitle: {
    color: Colors.textPrimary, fontWeight: '800', fontSize: 16,
    marginBottom: 10,
  },

  lessonCard: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14, padding: 14, marginBottom: 8,
    alignItems: 'center', gap: 12,
    borderWidth: 1.5, borderColor: Colors.border,
    ...Shadows.card,
  },
  lessonCompleted: {
    borderColor: Colors.success + '40',
    backgroundColor: Colors.successBg,
  },
  lessonLocked: { opacity: 0.5 },

  statusCircle: {
    width: 38, height: 38, borderRadius: 19,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, flexShrink: 0,
  },
  statusNum: { fontWeight: '800', fontSize: 15 },

  lessonContent: { flex: 1 },
  lessonTitleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 4, gap: 8,
  },
  lessonTitle: {
    color: Colors.textPrimary, fontWeight: '700', fontSize: 14,
    flex: 1,
  },
  lessonObjective: {
    color: Colors.textSecondary, fontSize: 12, marginBottom: 8, lineHeight: 17,
  },
  metaRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { color: Colors.textMuted, fontSize: 11 },

  xpBadge: {
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1,
  },
  xpText: { fontWeight: '800', fontSize: 11 },

  textMuted: { color: Colors.textMuted },
  textSuccess: { color: Colors.successDark },
});
