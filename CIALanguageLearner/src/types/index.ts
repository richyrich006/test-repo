// ============================================================
// CIA Language Learner - Core Type Definitions
// Based on FSI (Foreign Service Institute) / ILR methodology
// ============================================================

// ILR (Interagency Language Roundtable) Scale
// Used by CIA, NSA, State Dept to measure language proficiency
export type ILRLevel = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

export interface ILRLevelInfo {
  level: ILRLevel;
  label: string;
  description: string;
  operationalCapability: string;
  targetWeeks: number; // FSI average weeks to reach from 0
}

// Language skills assessed
export type LanguageSkill = 'reading' | 'writing' | 'listening' | 'speaking';

// Vocabulary card for spaced repetition
export interface VocabCard {
  id: string;
  spanish: string;
  english: string;
  phonetic: string;         // Pronunciation guide
  category: VocabCategory;
  ilrLevel: ILRLevel;
  exampleSentence?: string;
  exampleTranslation?: string;
  notes?: string;           // Grammar notes, usage tips
  audio?: string;           // TTS hint for correct pronunciation
}

export type VocabCategory =
  | 'greetings'
  | 'numbers'
  | 'time'
  | 'family'
  | 'food'
  | 'travel'
  | 'work'
  | 'emergency'
  | 'interrogatives'
  | 'verbs_core'
  | 'adjectives'
  | 'places'
  | 'body'
  | 'government'
  | 'military'
  | 'surveillance'
  | 'negotiation'
  | 'culture';

// FSI-style pattern drill
export interface PatternDrill {
  id: string;
  title: string;
  instruction: string;       // What to do
  pattern: string;           // The grammatical pattern being drilled
  patternExplanation: string;
  ilrLevel: ILRLevel;
  exercises: DrillExercise[];
}

export interface DrillExercise {
  id: string;
  prompt: string;            // What student sees
  promptTranslation?: string;
  answer: string;            // Correct response
  alternatives?: string[];   // Also acceptable answers
  hint?: string;
  audioPrompt?: string;      // Text for TTS
}

// Situational dialogue (CIA/FSI situational training)
export interface Dialogue {
  id: string;
  title: string;
  scenario: string;          // Real-world situation
  situation: string;         // Context description
  ilrLevel: ILRLevel;
  characters: DialogueCharacter[];
  lines: DialogueLine[];
  culturalNotes?: string[];
  keyVocab: string[];        // vocab card IDs featured
}

export interface DialogueCharacter {
  id: string;
  name: string;
  role: string;
  isLearner: boolean;        // Which character the learner plays
}

export interface DialogueLine {
  characterId: string;
  spanish: string;
  english: string;
  phonetic?: string;
  isLearnerLine: boolean;
  notes?: string;
}

// Complete lesson module
export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  subtitle: string;
  objective: string;         // Learning objective (FSI-style)
  ilrLevel: ILRLevel;
  estimatedMinutes: number;
  vocabulary: string[];      // VocabCard IDs
  drills: string[];          // PatternDrill IDs
  dialogues: string[];       // Dialogue IDs
  culturalBriefing?: string; // Cultural context (CIA operational context)
  completionXP: number;
}

// Unit = collection of lessons around a theme
export interface Unit {
  id: string;
  title: string;
  subtitle: string;
  theme: string;
  ilrLevel: ILRLevel;
  lessons: string[];         // Lesson IDs
  icon: string;
  color: string;
}

// ============================================================
// SRS (Spaced Repetition System) - SM-2 Algorithm Types
// ============================================================

export interface SRSCard {
  cardId: string;
  easeFactor: number;        // 1.3 to 2.5, default 2.5
  interval: number;          // days until next review
  repetitions: number;       // successful repetitions in a row
  nextReview: string;        // ISO date string
  lastReview?: string;
  totalReviews: number;
  correctReviews: number;
}

export type SRSRating = 0 | 1 | 2 | 3 | 4 | 5;
// 0 = complete blackout, 1 = familiar but wrong, 2 = wrong with hint
// 3 = correct with difficulty, 4 = correct, 5 = perfect

// ============================================================
// Progress Tracking
// ============================================================

export interface UserProgress {
  userId: string;
  language: 'spanish';
  currentILRLevel: ILRLevel;
  skills: Record<LanguageSkill, ILRLevel>;
  totalXP: number;
  streak: number;             // consecutive days
  lastStudyDate?: string;
  completedLessons: string[]; // lesson IDs
  completedUnits: string[];
  srsCards: Record<string, SRSCard>; // cardId -> SRSCard
  dailyGoalMinutes: number;
  todayMinutes: number;
  totalStudyMinutes: number;
  achievements: string[];
  onboardingComplete: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  condition: (progress: UserProgress) => boolean;
}

// ============================================================
// Session tracking
// ============================================================

export interface StudySession {
  lessonId: string;
  startedAt: string;
  completedAt?: string;
  drillsCompleted: number;
  vocabReviewed: number;
  correctAnswers: number;
  totalAnswers: number;
  xpEarned: number;
}
