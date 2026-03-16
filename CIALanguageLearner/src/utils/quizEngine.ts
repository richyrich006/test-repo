import { VocabCard } from '../types';
import { spanishVocabulary } from '../data/spanishVocabulary';

// ============================================================
// Quiz Engine — generates question sets from vocabulary
// Supports 4 question types: multiple choice, type answer,
// flashcard, listening
// ============================================================

export type QuizType = 'multiple_choice' | 'type_answer' | 'flashcard' | 'listening';

export interface QuizQuestion {
  id: string;
  type: QuizType;
  card: VocabCard;
  // Multiple choice
  options?: string[];
  correctOption?: string;
  // Direction: spanish->english or english->spanish
  direction: 'es_to_en' | 'en_to_es';
}

export interface QuizResult {
  questionId: string;
  correct: boolean;
  userAnswer: string;
  timeTaken: number; // ms
}

export interface QuizSession {
  questions: QuizQuestion[];
  results: QuizResult[];
  startedAt: number;
}

// Shuffle array
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Get 3 wrong options that are not the correct answer
function getDistractors(correct: string, pool: string[], count = 3): string[] {
  const others = pool.filter(p => p !== correct);
  return shuffle(others).slice(0, count);
}

// Generate a set of quiz questions from a list of vocab card IDs
export function generateQuiz(
  cardIds: string[],
  types: QuizType[] = ['multiple_choice', 'type_answer', 'flashcard', 'listening'],
  questionsPerCard = 1,
): QuizQuestion[] {
  const cards = cardIds
    .map(id => spanishVocabulary.find(v => v.id === id))
    .filter(Boolean) as VocabCard[];

  if (cards.length === 0) return [];

  const allEnglish = spanishVocabulary.map(v => v.english);
  const allSpanish = spanishVocabulary.map(v => v.spanish);

  const questions: QuizQuestion[] = [];

  for (const card of cards) {
    // Rotate through types
    for (let i = 0; i < questionsPerCard; i++) {
      const type = types[questions.length % types.length];
      const direction: 'es_to_en' | 'en_to_es' =
        questions.length % 2 === 0 ? 'es_to_en' : 'en_to_es';

      const q: QuizQuestion = {
        id: `${card.id}_${type}_${i}`,
        type,
        card,
        direction,
      };

      if (type === 'multiple_choice' || type === 'listening') {
        if (direction === 'es_to_en') {
          const distractors = getDistractors(card.english, allEnglish);
          q.options = shuffle([card.english, ...distractors]);
          q.correctOption = card.english;
        } else {
          const distractors = getDistractors(card.spanish, allSpanish);
          q.options = shuffle([card.spanish, ...distractors]);
          q.correctOption = card.spanish;
        }
      }

      questions.push(q);
    }
  }

  return shuffle(questions);
}

// Score a type-answer response (fuzzy match)
export function scoreTextAnswer(userAnswer: string, correct: string): boolean {
  const normalize = (s: string) =>
    s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const a = normalize(userAnswer);

  // Support slash-separated alternatives e.g. "Excuse me / Sorry"
  const alternatives = correct.split('/').map(normalize).filter(Boolean);

  for (const b of alternatives) {
    if (a === b) return true;

    // Allow up to 1 character edit distance (typo forgiveness)
    if (Math.abs(a.length - b.length) <= 2) {
      let diff = 0;
      const longer = a.length > b.length ? a : b;
      const shorter = a.length > b.length ? b : a;
      for (let i = 0; i < shorter.length; i++) {
        if (shorter[i] !== longer[i]) diff++;
      }
      diff += longer.length - shorter.length;
      if (diff <= 1) return true;
    }
  }
  return false;
}

// Score a pronunciation attempt (0-100)
export function scorePronunciation(spoken: string, expected: string): number {
  if (!spoken) return 0;

  const a = spoken.trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const b = expected.trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (a === b) return 100;

  // Levenshtein distance based score
  const dist = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 100;

  const score = Math.round(((maxLen - dist) / maxLen) * 100);
  return Math.max(0, score);
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Excellent! 🎯', color: '#58CC02' };
  if (score >= 75) return { label: 'Good! 👍', color: '#58CC02' };
  if (score >= 55) return { label: 'Almost! 💪', color: '#FF9600' };
  return { label: 'Keep practicing', color: '#FF4B4B' };
}
