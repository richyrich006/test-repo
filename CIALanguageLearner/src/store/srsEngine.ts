import { SRSCard, SRSRating } from '../types';

// ============================================================
// Spaced Repetition System (SRS) - SM-2 Algorithm
// Originally developed by Piotr Woźniak
// Used in Anki, SuperMemo, and CIA training systems
//
// The SM-2 algorithm calculates optimal review intervals
// based on how well you recalled each item.
// This maximizes retention while minimizing review time.
// ============================================================

const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;
const MAX_INTERVAL_DAYS = 365;

/**
 * Calculate new SRS parameters based on rating (0-5)
 *
 * Rating scale:
 * 5 = Perfect recall with ease
 * 4 = Correct with minor hesitation
 * 3 = Correct with significant difficulty
 * 2 = Incorrect, but answer felt familiar
 * 1 = Incorrect, some memory of answer
 * 0 = Complete blank — no memory
 */
export function calculateNextReview(card: SRSCard, rating: SRSRating): SRSCard {
  const now = new Date();
  const today = now.toISOString();

  let { easeFactor, interval, repetitions } = card;

  if (rating >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }

    interval = Math.min(interval, MAX_INTERVAL_DAYS);
    repetitions += 1;
  } else {
    // Incorrect — reset repetitions, but keep ease factor adjustment
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor based on rating
  // EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
  easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor);

  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    nextReview: nextReview.toISOString(),
    lastReview: today,
    totalReviews: card.totalReviews + 1,
    correctReviews: rating >= 3 ? card.correctReviews + 1 : card.correctReviews,
  };
}

/**
 * Create a new SRS card for a vocabulary item
 */
export function createSRSCard(cardId: string): SRSCard {
  return {
    cardId,
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: 0,
    repetitions: 0,
    nextReview: new Date().toISOString(),
    totalReviews: 0,
    correctReviews: 0,
  };
}

/**
 * Get cards due for review today
 */
export function getDueCards(cards: Record<string, SRSCard>): SRSCard[] {
  const now = new Date();
  return Object.values(cards).filter(card => {
    const reviewDate = new Date(card.nextReview);
    return reviewDate <= now;
  });
}

/**
 * Calculate retention rate for a card
 */
export function getRetentionRate(card: SRSCard): number {
  if (card.totalReviews === 0) return 0;
  return Math.round((card.correctReviews / card.totalReviews) * 100);
}

/**
 * Get mastery level of a card (0-4)
 * 0 = New, 1 = Learning, 2 = Young, 3 = Mature, 4 = Mastered
 */
export function getMasteryLevel(card: SRSCard): number {
  if (card.repetitions === 0) return 0;
  if (card.interval < 7) return 1;
  if (card.interval < 21) return 2;
  if (card.interval < 90) return 3;
  return 4;
}

export const MASTERY_LABELS = ['New', 'Learning', 'Young', 'Mature', 'Mastered'];
export const MASTERY_COLORS = ['#95A5A6', '#3498DB', '#F39C12', '#2ECC71', '#C8A84B'];

/**
 * Get a performance summary for the SRS deck
 */
export function getDeckStats(cards: Record<string, SRSCard>) {
  const allCards = Object.values(cards);
  const now = new Date();

  const dueToday = allCards.filter(c => new Date(c.nextReview) <= now).length;
  const newCards = allCards.filter(c => c.repetitions === 0).length;
  const learningCards = allCards.filter(c => getMasteryLevel(c) === 1).length;
  const matureCards = allCards.filter(c => getMasteryLevel(c) >= 3).length;

  const totalCorrect = allCards.reduce((sum, c) => sum + c.correctReviews, 0);
  const totalReviews = allCards.reduce((sum, c) => sum + c.totalReviews, 0);
  const overallRetention = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;

  return {
    total: allCards.length,
    dueToday,
    newCards,
    learningCards,
    matureCards,
    overallRetention,
  };
}
