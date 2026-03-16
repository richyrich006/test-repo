import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Colors, Shadows } from '../theme/colors';
import { UserProgress } from '../types';

interface Props {
  progress: UserProgress;
  onUpdateGoal: (minutes: number) => void;
  onToggleNotifications: (enabled: boolean) => void;
  onPrivacyPolicy: () => void;
  onReset: () => void;
  onBack: () => void;
  speechRate: number;
  onSpeechRateChange: (rate: number) => void;
  notificationsEnabled: boolean;
}

const GOAL_OPTIONS = [5, 10, 15, 20];

const TTS_OPTIONS: { label: string; value: number }[] = [
  { label: 'Slow', value: 0.7 },
  { label: 'Normal', value: 0.85 },
  { label: 'Fast', value: 1.0 },
];

export function SettingsScreen({
  progress,
  onUpdateGoal,
  onToggleNotifications,
  onPrivacyPolicy,
  onReset,
  onBack,
  speechRate,
  onSpeechRateChange,
  notificationsEnabled,
}: Props) {
  const handleToggleNotifications = () => {
    onToggleNotifications(!notificationsEnabled);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Progress?',
      'This will permanently delete all your lesson progress, XP, streak data, and vocabulary cards. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: onReset,
        },
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert('Rate the App', 'Thank you for your support! App Store rating coming soon.');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Daily Goal ─────────────────────────────────── */}
        <Text style={styles.sectionLabel}>DAILY GOAL</Text>
        <View style={styles.card}>
          <View style={styles.cardInner}>
            <Text style={styles.rowTitle}>Minutes per day</Text>
            <Text style={styles.rowSubtitle}>How long do you want to study each day?</Text>
            <View style={styles.optionRow}>
              {GOAL_OPTIONS.map((minutes) => {
                const selected = progress.dailyGoalMinutes === minutes;
                return (
                  <TouchableOpacity
                    key={minutes}
                    style={[styles.goalOption, selected && styles.goalOptionSelected]}
                    onPress={() => onUpdateGoal(minutes)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.goalOptionText, selected && styles.goalOptionTextSelected]}>
                      {minutes}
                    </Text>
                    <Text style={[styles.goalOptionSub, selected && styles.goalOptionSubSelected]}>
                      min
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* ── Notifications ──────────────────────────────── */}
        <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}>🔔</Text>
              <View>
                <Text style={styles.rowTitle}>Daily Reminders</Text>
                <Text style={styles.rowSubtitle}>Get nudged to keep your streak</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleToggleNotifications}
              style={[styles.toggleTrack, notificationsEnabled && styles.toggleTrackOn]}
              activeOpacity={0.8}
            >
              <View style={[styles.toggleThumb, notificationsEnabled && styles.toggleThumbOn]} />
            </TouchableOpacity>
          </View>

          {notificationsEnabled && (
            <>
              <View style={styles.divider} />
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={styles.rowIcon}>⏰</Text>
                  <View>
                    <Text style={styles.rowTitle}>Reminder Time</Text>
                    <Text style={styles.rowSubtitle}>Adjust in your phone's Settings app</Text>
                  </View>
                </View>
                <Text style={styles.rowValue}>9:00 AM</Text>
              </View>
            </>
          )}
        </View>

        {/* ── TTS Speed ──────────────────────────────────── */}
        <Text style={styles.sectionLabel}>TTS SPEED</Text>
        <View style={styles.card}>
          <View style={styles.cardInner}>
            <Text style={styles.rowTitle}>Speech Rate</Text>
            <Text style={styles.rowSubtitle}>How fast Agent Maya speaks Spanish</Text>
            <View style={styles.optionRow}>
              {TTS_OPTIONS.map((opt) => {
                const selected = speechRate === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.label}
                    style={[styles.ttsOption, selected && styles.ttsOptionSelected]}
                    onPress={() => onSpeechRateChange(opt.value)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.ttsOptionLabel, selected && styles.ttsOptionLabelSelected]}>
                      {opt.label}
                    </Text>
                    <Text style={[styles.ttsOptionVal, selected && styles.ttsOptionValSelected]}>
                      {opt.value}×
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* ── App Info ───────────────────────────────────── */}
        <Text style={styles.sectionLabel}>APP INFO</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}>ℹ️</Text>
              <Text style={styles.rowTitle}>Version</Text>
            </View>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row} onPress={onPrivacyPolicy} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}>🔒</Text>
              <Text style={styles.rowTitle}>Privacy Policy</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row} onPress={handleRateApp} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}>⭐</Text>
              <Text style={styles.rowTitle}>Rate the App</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ── Danger Zone ────────────────────────────────── */}
        <Text style={styles.sectionLabel}>DANGER ZONE</Text>
        <View style={[styles.card, styles.dangerCard]}>
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.8}>
            <Text style={styles.resetIcon}>🗑</Text>
            <Text style={styles.resetText}>Reset All Progress</Text>
          </TouchableOpacity>
          <Text style={styles.dangerNote}>
            Permanently deletes all XP, streaks, and lesson history.
          </Text>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.backgroundMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 26,
    color: Colors.textPrimary,
    lineHeight: 30,
    marginTop: -2,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 18,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    marginBottom: 20,
    overflow: 'hidden',
    ...Shadows.card,
  },
  cardInner: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: Colors.error + '30',
    backgroundColor: Colors.errorBg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  rowIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  rowTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  rowSubtitle: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  rowValue: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 22,
    color: Colors.textMuted,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },

  // Goal pill options
  optionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  goalOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.backgroundMuted,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalOptionSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  goalOptionText: {
    color: Colors.textSecondary,
    fontSize: 18,
    fontWeight: '700',
  },
  goalOptionTextSelected: {
    color: Colors.primary,
  },
  goalOptionSub: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  goalOptionSubSelected: {
    color: Colors.primary,
  },

  // TTS options
  ttsOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.backgroundMuted,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 2,
  },
  ttsOptionSelected: {
    backgroundColor: Colors.brandLight,
    borderColor: Colors.brand,
  },
  ttsOptionLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  ttsOptionLabelSelected: {
    color: Colors.brandDark,
  },
  ttsOptionVal: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  ttsOptionValSelected: {
    color: Colors.brandDark,
  },

  // Toggle
  toggleTrack: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleTrackOn: {
    backgroundColor: Colors.success,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.textWhite,
    alignSelf: 'flex-start',
    ...Shadows.card,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },

  // Danger
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  resetIcon: {
    fontSize: 18,
  },
  resetText: {
    color: Colors.error,
    fontWeight: '700',
    fontSize: 15,
  },
  dangerNote: {
    color: Colors.error,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    opacity: 0.75,
  },
});
