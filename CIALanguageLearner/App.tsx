import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Colors } from './src/theme/colors';
import { UserProgress, SRSRating } from './src/types';
import {
  loadProgress,
  saveProgress,
  completeLesson,
  reviewVocabCard,
  addVocabCards,
  completeOnboarding,
  calculateILRLevel,
} from './src/store/progressStore';
import { getLessonById } from './src/data/curriculum';

import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { UnitScreen } from './src/screens/UnitScreen';
import { LessonScreen } from './src/screens/LessonScreen';
import { ReviewScreen } from './src/screens/ReviewScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

// ─── Navigation State ─────────────────────────────────────────
type Screen =
  | { name: 'home' }
  | { name: 'unit'; unitId: string }
  | { name: 'lesson'; lessonId: string }
  | { name: 'review' }
  | { name: 'profile' };

export default function App() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [screen, setScreen] = useState<Screen>({ name: 'home' });

  // Load saved progress on startup
  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  // Persist progress whenever it changes
  useEffect(() => {
    if (progress) {
      saveProgress(progress);
    }
  }, [progress]);

  const updateProgress = useCallback((updater: (p: UserProgress) => UserProgress) => {
    setProgress(prev => {
      if (!prev) return prev;
      const updated = updater(prev);
      // Recalculate ILR level whenever progress changes
      const newILR = calculateILRLevel(updated.completedLessons);
      return { ...updated, currentILRLevel: newILR };
    });
  }, []);

  // Show loading state
  if (!progress) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  // Show onboarding if not complete
  if (!progress.onboardingComplete) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <OnboardingScreen
            onComplete={() => updateProgress(completeOnboarding)}
          />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  // Main app navigation
  const renderScreen = () => {
    switch (screen.name) {
      case 'home':
        return (
          <HomeScreen
            progress={progress}
            onPressUnit={(unitId: string) => setScreen({ name: 'unit', unitId })}
            onPressReview={() => setScreen({ name: 'review' })}
            onPressProfile={() => setScreen({ name: 'profile' })}
          />
        );

      case 'unit':
        return (
          <UnitScreen
            unitId={screen.unitId}
            progress={progress}
            onPressLesson={(lessonId: string) => setScreen({ name: 'lesson', lessonId })}
            onBack={() => setScreen({ name: 'home' })}
          />
        );

      case 'lesson':
        return (
          <LessonScreen
            lessonId={screen.lessonId}
            progress={progress}
            onComplete={(lessonId: string, xpEarned: number, minutesSpent: number) => {
              const lesson = getLessonById(lessonId);
              updateProgress(prev => {
                let updated = completeLesson(prev, lessonId, xpEarned, minutesSpent);
                if (lesson) {
                  updated = addVocabCards(updated, lesson.vocabulary);
                }
                return updated;
              });
              if (screen.name === 'lesson') {
                const l = getLessonById(screen.lessonId);
                setScreen(l ? { name: 'unit', unitId: l.unitId } : { name: 'home' });
              }
            }}
            onBack={() => {
              if (screen.name === 'lesson') {
                const l = getLessonById(screen.lessonId);
                setScreen(l ? { name: 'unit', unitId: l.unitId } : { name: 'home' });
              }
            }}
          />
        );

      case 'review':
        return (
          <ReviewScreen
            progress={progress}
            onRate={(cardId: string, rating: SRSRating) => {
              updateProgress(prev => reviewVocabCard(prev, cardId, rating));
            }}
            onFinish={() => setScreen({ name: 'home' })}
            onBack={() => setScreen({ name: 'home' })}
          />
        );

      case 'profile':
        return (
          <ProfileScreen
            progress={progress}
            onBack={() => setScreen({ name: 'home' })}
            onReset={() => {
              loadProgress().then(p => {
                setProgress(p);
                setScreen({ name: 'home' });
              });
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {renderScreen()}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
