import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
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

  return (
    <LinearGradient colors={[Colors.primaryDark, Colors.background]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{unit.title}</Text>
          </View>
          <ILRBadge level={unit.ilrLevel} size="small" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Unit Banner */}
          <View style={[styles.banner, { backgroundColor: unit.color + '20', borderColor: unit.color + '40' }]}>
            <Text style={styles.bannerIcon}>{unit.icon}</Text>
            <View style={styles.bannerText}>
              <Text style={styles.bannerSubtitle}>{unit.subtitle}</Text>
              <Text style={styles.bannerTheme}>{unit.theme}</Text>
            </View>
          </View>

          {/* Lessons */}
          <View style={styles.lessonsSection}>
            <Text style={styles.sectionTitle}>Lessons</Text>
            {lessons.map((lesson, index) => {
              const isCompleted = progress.completedLessons.includes(lesson.id);
              const isPreviousCompleted = index === 0 || progress.completedLessons.includes(lessons[index - 1]?.id);
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
                  activeOpacity={isAvailable ? 0.8 : 1}
                >
                  <View style={[
                    styles.lessonNumber,
                    isCompleted && styles.lessonNumberCompleted,
                    !isAvailable && styles.lessonNumberLocked,
                  ]}>
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={16} color={Colors.success} />
                    ) : !isAvailable ? (
                      <Ionicons name="lock-closed" size={14} color={Colors.textMuted} />
                    ) : (
                      <Text style={styles.lessonNumberText}>{index + 1}</Text>
                    )}
                  </View>

                  <View style={styles.lessonContent}>
                    <View style={styles.lessonTitleRow}>
                      <Text style={[styles.lessonTitle, !isAvailable && styles.textMuted]}>
                        {lesson.title}
                      </Text>
                      <ILRBadge level={lesson.ilrLevel} size="small" />
                    </View>
                    <Text style={[styles.lessonObjective, !isAvailable && styles.textMuted]}>
                      {lesson.objective}
                    </Text>
                    <View style={styles.lessonMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
                        <Text style={styles.metaText}>{lesson.estimatedMinutes} min</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="library-outline" size={12} color={Colors.textMuted} />
                        <Text style={styles.metaText}>{lesson.vocabulary.length} words</Text>
                      </View>
                      {lesson.drills.length > 0 && (
                        <View style={styles.metaItem}>
                          <Ionicons name="repeat-outline" size={12} color={Colors.textMuted} />
                          <Text style={styles.metaText}>{lesson.drills.length} drills</Text>
                        </View>
                      )}
                      {lesson.dialogues.length > 0 && (
                        <View style={styles.metaItem}>
                          <Ionicons name="chatbubbles-outline" size={12} color={Colors.textMuted} />
                          <Text style={styles.metaText}>{lesson.dialogues.length} dialogues</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {isAvailable && !isCompleted && (
                    <View style={styles.xpBadge}>
                      <Text style={styles.xpText}>+{lesson.completionXP}</Text>
                      <Text style={styles.xpLabel}>XP</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: Colors.backgroundCard,
    justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { flex: 1 },
  headerTitle: { color: Colors.textPrimary, fontWeight: '700', fontSize: 17 },

  banner: {
    margin: 16, borderRadius: 14, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1,
  },
  bannerIcon: { fontSize: 36 },
  bannerText: { flex: 1 },
  bannerSubtitle: { color: Colors.textPrimary, fontWeight: '700', fontSize: 15, marginBottom: 4 },
  bannerTheme: { color: Colors.textSecondary, fontSize: 13 },

  lessonsSection: { paddingHorizontal: 16 },
  sectionTitle: { color: Colors.textPrimary, fontWeight: '700', fontSize: 16, marginBottom: 12 },

  lessonCard: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14, padding: 14, marginBottom: 10,
    alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: 'transparent',
  },
  lessonCompleted: {
    borderColor: Colors.success + '30',
    backgroundColor: Colors.success + '08',
  },
  lessonLocked: { opacity: 0.5 },
  lessonNumber: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  lessonNumberCompleted: { borderColor: Colors.success + '60' },
  lessonNumberLocked: { borderColor: Colors.textMuted + '40' },
  lessonNumberText: { color: Colors.textPrimary, fontWeight: '700', fontSize: 14 },
  lessonContent: { flex: 1 },
  lessonTitleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 4,
  },
  lessonTitle: { color: Colors.textPrimary, fontWeight: '700', fontSize: 14, flex: 1, marginRight: 8 },
  lessonObjective: { color: Colors.textSecondary, fontSize: 12, marginBottom: 8, lineHeight: 17 },
  lessonMeta: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { color: Colors.textMuted, fontSize: 11 },
  xpBadge: {
    backgroundColor: Colors.accent + '20',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.accent + '60',
  },
  xpText: { color: Colors.accent, fontWeight: '800', fontSize: 13 },
  xpLabel: { color: Colors.accent, fontSize: 9, fontWeight: '600' },
  textMuted: { color: Colors.textMuted },
});
