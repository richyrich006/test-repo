import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, SRSCard, SRSRating, ILRLevel } from '../types';
import { createSRSCard, calculateNextReview } from './srsEngine';

const PROGRESS_KEY = '@cia_learner_progress';

const defaultProgress: UserProgress = {
  userId: 'user_001',
  language: 'spanish',
  currentILRLevel: 0,
  skills: {
    reading: 0,
    writing: 0,
    listening: 0,
    speaking: 0,
  },
  totalXP: 0,
  streak: 0,
  completedLessons: [],
  completedUnits: [],
  srsCards: {},
  dailyGoalMinutes: 30,
  todayMinutes: 0,
  totalStudyMinutes: 0,
  achievements: [],
  onboardingComplete: false,
};

// ─── Storage Functions ────────────────────────────────────────

export async function loadProgress(): Promise<UserProgress> {
  try {
    const data = await AsyncStorage.getItem(PROGRESS_KEY);
    if (data) {
      const parsed = JSON.parse(data) as UserProgress;
      // Reset today's minutes if last study was a different day
      const lastStudy = parsed.lastStudyDate;
      if (lastStudy) {
        const lastDate = new Date(lastStudy).toDateString();
        const today = new Date().toDateString();
        if (lastDate !== today) {
          parsed.todayMinutes = 0;
          // Update streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (lastDate === yesterday.toDateString()) {
            // Studied yesterday — streak continues
          } else {
            parsed.streak = 0;
          }
        }
      }
      return parsed;
    }
    return { ...defaultProgress };
  } catch {
    return { ...defaultProgress };
  }
}

export async function saveProgress(progress: UserProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

export async function resetProgress(): Promise<void> {
  await AsyncStorage.removeItem(PROGRESS_KEY);
}

// ─── Progress Mutations ───────────────────────────────────────

export function completeLesson(
  progress: UserProgress,
  lessonId: string,
  xpEarned: number,
  minutesSpent: number,
): UserProgress {
  const today = new Date().toISOString();
  const todayStr = new Date().toDateString();
  const lastStudyStr = progress.lastStudyDate
    ? new Date(progress.lastStudyDate).toDateString()
    : null;

  let streak = progress.streak;
  if (lastStudyStr !== todayStr) {
    streak = streak + 1;
  }

  return {
    ...progress,
    completedLessons: progress.completedLessons.includes(lessonId)
      ? progress.completedLessons
      : [...progress.completedLessons, lessonId],
    totalXP: progress.totalXP + xpEarned,
    streak,
    lastStudyDate: today,
    todayMinutes: progress.todayMinutes + minutesSpent,
    totalStudyMinutes: progress.totalStudyMinutes + minutesSpent,
  };
}

export function reviewVocabCard(
  progress: UserProgress,
  cardId: string,
  rating: SRSRating,
): UserProgress {
  const existingCard = progress.srsCards[cardId] || createSRSCard(cardId);
  const updatedCard = calculateNextReview(existingCard, rating);

  return {
    ...progress,
    srsCards: {
      ...progress.srsCards,
      [cardId]: updatedCard,
    },
  };
}

export function addVocabCards(
  progress: UserProgress,
  cardIds: string[],
): UserProgress {
  const newCards: Record<string, SRSCard> = {};
  for (const id of cardIds) {
    if (!progress.srsCards[id]) {
      newCards[id] = createSRSCard(id);
    }
  }
  return {
    ...progress,
    srsCards: { ...progress.srsCards, ...newCards },
  };
}

export function completeOnboarding(progress: UserProgress): UserProgress {
  return { ...progress, onboardingComplete: true };
}

export function setDailyGoal(
  progress: UserProgress,
  minutes: number,
): UserProgress {
  return { ...progress, dailyGoalMinutes: minutes };
}

// ─── ILR Level Calculation ────────────────────────────────────

export function calculateILRLevel(completedLessons: string[]): ILRLevel {
  const count = completedLessons.length;
  if (count >= 10) return 2;
  if (count >= 6) return 1;
  if (count >= 3) return 0.5;
  return 0;
}

// ─── XP & Achievements ───────────────────────────────────────

export function getLevel(totalXP: number): { level: number; title: string; nextXP: number } {
  const levels = [
    { xp: 0, title: 'Recruit' },
    { xp: 300, title: 'Analyst' },
    { xp: 800, title: 'Field Agent' },
    { xp: 1500, title: 'Case Officer' },
    { xp: 3000, title: 'Station Chief' },
    { xp: 6000, title: 'Senior Officer' },
    { xp: 12000, title: 'Section Chief' },
    { xp: 25000, title: 'Director' },
  ];

  let currentLevel = 0;
  for (let i = 0; i < levels.length; i++) {
    if (totalXP >= levels[i].xp) {
      currentLevel = i;
    }
  }

  const nextLevel = levels[Math.min(currentLevel + 1, levels.length - 1)];

  return {
    level: currentLevel + 1,
    title: levels[currentLevel].title,
    nextXP: nextLevel.xp,
  };
}

export function getDailyProgress(progress: UserProgress): number {
  if (progress.dailyGoalMinutes === 0) return 0;
  return Math.min(1, progress.todayMinutes / progress.dailyGoalMinutes);
}
