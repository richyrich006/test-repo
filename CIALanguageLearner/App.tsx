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
import { QuizResult } from './src/utils/quizEngine';

import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { UnitScreen } from './src/screens/UnitScreen';
import { LessonScreen } from './src/screens/LessonScreen';
import { QuizScreen } from './src/screens/QuizScreen';
import { ReviewScreen } from './src/screens/ReviewScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

type Screen =
  | { name: 'home' }
  | { name: 'unit'; unitId: string }
  | { name: 'lesson'; lessonId: string }
  | { name: 'quiz'; lessonId: string; cardIds: string[] }
  | { name: 'review' }
  | { name: 'profile' };

export default function App() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [screen, setScreen] = useState<Screen>({ name: 'home' });

  useEffect(() => { loadProgress().then(setProgress); }, []);
  useEffect(() => { if (progress) saveProgress(progress); }, [progress]);

  const updateProgress = useCallback((updater: (p: UserProgress) => UserProgress) => {
    setProgress(prev => {
      if (!prev) return prev;
      const updated = updater(prev);
      return { ...updated, currentILRLevel: calculateILRLevel(updated.completedLessons) };
    });
  }, []);

  if (!progress) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!progress.onboardingComplete) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <OnboardingScreen onComplete={() => updateProgress(completeOnboarding)} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  const goBackFromLesson = (lessonId: string) => {
    const l = getLessonById(lessonId);
    setScreen(l ? { name: 'unit', unitId: l.unitId } : { name: 'home' });
  };

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
              const completedLesson = getLessonById(lessonId);
              updateProgress(prev => {
                let updated = completeLesson(prev, lessonId, xpEarned, minutesSpent);
                if (completedLesson) updated = addVocabCards(updated, completedLesson.vocabulary);
                return updated;
              });
              // Go to quiz after lesson if there's vocabulary
              if (completedLesson && completedLesson.vocabulary.length >= 2) {
                setScreen({ name: 'quiz', lessonId, cardIds: completedLesson.vocabulary });
              } else {
                goBackFromLesson(lessonId);
              }
            }}
            onBack={() => goBackFromLesson(screen.lessonId)}
          />
        );

      case 'quiz':
        return (
          <QuizScreen
            cardIds={screen.cardIds}
            lessonTitle={getLessonById(screen.lessonId)?.title ?? 'Quiz'}
            onComplete={(results: QuizResult[], xp: number) => {
              updateProgress(prev => ({
                ...prev,
                totalXP: prev.totalXP + xp,
              }));
              goBackFromLesson(screen.lessonId);
            }}
            onBack={() => goBackFromLesson(screen.lessonId)}
          />
        );

      case 'review':
        return (
          <ReviewScreen
            progress={progress}
            onRate={(cardId: string, rating: SRSRating) =>
              updateProgress(prev => reviewVocabCard(prev, cardId, rating))
            }
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
              loadProgress().then(p => { setProgress(p); setScreen({ name: 'home' }); });
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
        <StatusBar style="dark" />
        {renderScreen()}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: {
    flex: 1, backgroundColor: Colors.background,
    justifyContent: 'center', alignItems: 'center',
  },
});
