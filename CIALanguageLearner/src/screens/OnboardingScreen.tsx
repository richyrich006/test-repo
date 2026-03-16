import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { ILR_LEVELS } from '../data/curriculum';

const { width } = Dimensions.get('window');

interface Props {
  onComplete: () => void;
}

const SLIDES = [
  {
    id: 'welcome',
    title: 'Welcome to\nCIA Language\nTraining',
    subtitle: 'The same methodology used by intelligence professionals to achieve operational fluency.',
    detail: 'Developed from the FSI (Foreign Service Institute) Programmatic Course — the gold standard in accelerated language acquisition.',
    icon: '🔐',
  },
  {
    id: 'method',
    title: 'The CIA/FSI\nMethod',
    subtitle: 'Three pillars of professional language training.',
    points: [
      { icon: '🎯', title: 'Pattern Drills', desc: 'Grammatical patterns burned into muscle memory through structured repetition' },
      { icon: '🗣️', title: 'Situational Dialogues', desc: 'Real-world scenarios: airports, hotels, government offices, negotiations' },
      { icon: '🧠', title: 'Spaced Repetition', desc: 'SM-2 algorithm ensures you review vocabulary at scientifically optimal intervals' },
    ],
    icon: '⚙️',
  },
  {
    id: 'ilr',
    title: 'The ILR Scale',
    subtitle: 'How intelligence agencies measure language proficiency.',
    ilrInfo: true,
    icon: '📊',
  },
  {
    id: 'commitment',
    title: 'Set Your\nDaily Mission',
    subtitle: 'CIA analysts commit to daily practice. Consistency beats intensity.',
    goalOptions: [15, 30, 45, 60],
    icon: '⏱️',
  },
];

export function OnboardingScreen({ onComplete }: Props) {
  const [page, setPage] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(30);

  const slide = SLIDES[page];
  const isLast = page === SLIDES.length - 1;

  const next = () => {
    if (isLast) {
      onComplete();
    } else {
      setPage(p => p + 1);
    }
  };

  return (
    <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Progress dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === page && styles.dotActive]}
            />
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.icon}>{slide.icon}</Text>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>

          {/* Detail text */}
          {'detail' in slide && (
            <Text style={styles.detail}>{slide.detail}</Text>
          )}

          {/* Method points */}
          {'points' in slide && slide.points && (
            <View style={styles.pointsContainer}>
              {slide.points.map((point, i) => (
                <View key={i} style={styles.point}>
                  <Text style={styles.pointIcon}>{point.icon}</Text>
                  <View style={styles.pointText}>
                    <Text style={styles.pointTitle}>{point.title}</Text>
                    <Text style={styles.pointDesc}>{point.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ILR Scale */}
          {'ilrInfo' in slide && slide.ilrInfo && (
            <View style={styles.ilrContainer}>
              {ILR_LEVELS.filter(l => [0, 1, 2, 3, 4, 5].includes(l.level)).map(info => (
                <View key={info.level} style={styles.ilrRow}>
                  <View style={[styles.ilrBadge, info.level >= 3 && styles.ilrBadgeHighlight]}>
                    <Text style={styles.ilrLevel}>ILR {info.level}</Text>
                  </View>
                  <View style={styles.ilrInfo}>
                    <Text style={styles.ilrLabel}>{info.label}</Text>
                    <Text style={styles.ilrDesc}>{info.operationalCapability}</Text>
                  </View>
                </View>
              ))}
              <Text style={styles.ilrNote}>★ CIA operational minimum: ILR 3</Text>
            </View>
          )}

          {/* Goal selection */}
          {'goalOptions' in slide && slide.goalOptions && (
            <View style={styles.goalContainer}>
              {slide.goalOptions.map(mins => (
                <TouchableOpacity
                  key={mins}
                  style={[styles.goalOption, dailyGoal === mins && styles.goalOptionSelected]}
                  onPress={() => setDailyGoal(mins)}
                >
                  <Text style={[styles.goalMins, dailyGoal === mins && styles.goalMinsSelected]}>
                    {mins}
                  </Text>
                  <Text style={[styles.goalLabel, dailyGoal === mins && styles.goalLabelSelected]}>
                    min/day
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navContainer}>
          {page > 0 && (
            <TouchableOpacity style={styles.backBtn} onPress={() => setPage(p => p - 1)}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextBtn, page === 0 && styles.nextBtnFull]}
            onPress={next}
          >
            <LinearGradient
              colors={[Colors.accent, Colors.accentDark]}
              style={styles.nextGradient}
            >
              <Text style={styles.nextText}>
                {isLast ? 'Begin Training' : 'Continue →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
    gap: 8,
  },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.accent,
    width: 20,
  },
  content: {
    padding: 28,
    paddingTop: 20,
    flexGrow: 1,
  },
  icon: { fontSize: 56, textAlign: 'center', marginBottom: 16 },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  detail: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
    backgroundColor: Colors.backgroundCard,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  pointsContainer: { gap: 16 },
  point: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    gap: 12,
  },
  pointIcon: { fontSize: 24 },
  pointText: { flex: 1 },
  pointTitle: { color: Colors.textPrimary, fontWeight: '700', fontSize: 15, marginBottom: 4 },
  pointDesc: { color: Colors.textSecondary, fontSize: 13, lineHeight: 19 },

  ilrContainer: { gap: 8 },
  ilrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 10,
    padding: 10,
    gap: 12,
  },
  ilrBadge: {
    backgroundColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 52,
    alignItems: 'center',
  },
  ilrBadgeHighlight: { backgroundColor: Colors.accent + '30', borderWidth: 1, borderColor: Colors.accent },
  ilrLevel: { color: Colors.textPrimary, fontWeight: '700', fontSize: 11 },
  ilrInfo: { flex: 1 },
  ilrLabel: { color: Colors.textPrimary, fontWeight: '600', fontSize: 13 },
  ilrDesc: { color: Colors.textMuted, fontSize: 11, marginTop: 1 },
  ilrNote: {
    color: Colors.accent,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },

  goalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 20,
  },
  goalOption: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
  },
  goalOptionSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent + '20',
  },
  goalMins: { fontSize: 28, fontWeight: '800', color: Colors.textMuted },
  goalMinsSelected: { color: Colors.accent },
  goalLabel: { fontSize: 11, color: Colors.textMuted },
  goalLabelSelected: { color: Colors.accent },

  navContainer: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  backBtn: {
    flex: 1,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backText: { color: Colors.textSecondary, fontSize: 16 },
  nextBtn: { flex: 2 },
  nextBtnFull: { flex: 1 },
  nextGradient: {
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextText: { color: Colors.textDark, fontWeight: '800', fontSize: 16 },
});
