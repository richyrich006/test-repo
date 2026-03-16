import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../theme/colors';

export type MayaMood = 'happy' | 'celebrating' | 'encouraging' | 'thinking' | 'neutral' | 'correct' | 'wrong';

interface Props {
  mood?: MayaMood;
  message?: string;
  size?: 'small' | 'medium' | 'large';
  showBubble?: boolean;
  animate?: boolean;
}

const MOOD_CONFIG: Record<MayaMood, { face: string; bubbleColor: string; borderColor: string }> = {
  happy:       { face: '😊', bubbleColor: Colors.primaryLight,  borderColor: Colors.primary },
  celebrating: { face: '🎉', bubbleColor: Colors.goldLight,      borderColor: Colors.gold },
  encouraging: { face: '💪', bubbleColor: Colors.successLight,   borderColor: Colors.success },
  thinking:    { face: '🤔', bubbleColor: Colors.backgroundAlt,  borderColor: Colors.border },
  neutral:     { face: '😐', bubbleColor: Colors.backgroundAlt,  borderColor: Colors.border },
  correct:     { face: '⭐', bubbleColor: Colors.successLight,   borderColor: Colors.success },
  wrong:       { face: '😅', bubbleColor: Colors.errorLight,     borderColor: Colors.error },
};

const DEFAULT_MESSAGES: Record<MayaMood, string[]> = {
  happy:       ['¡Hola! Ready to learn?', 'Let\'s practice your Spanish!', '¡Vamos! Let\'s get started!'],
  celebrating: ['¡Excelente! Outstanding!', 'Perfect score! You\'re amazing!', '¡Increíble! You nailed it!'],
  encouraging: ['Keep going, you\'ve got this!', 'Almost there — stay focused!', 'Every mistake is progress!'],
  thinking:    ['Take your time...', 'Think it through carefully.', 'What do you remember?'],
  neutral:     ['Ready when you are.', 'Focus and concentrate.', 'Let\'s continue the mission.'],
  correct:     ['¡Correcto! Well done!', 'That\'s right! ¡Muy bien!', '¡Perfecto! Keep it up!'],
  wrong:       ['Don\'t worry — review and retry!', 'Close! The answer was...', 'Learning from mistakes builds mastery.'],
};

function pickMessage(mood: MayaMood, message?: string): string {
  if (message) return message;
  const msgs = DEFAULT_MESSAGES[mood];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

export function AgentMaya({ mood = 'happy', message, size = 'medium', showBubble = true, animate = true }: Props) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const config = MOOD_CONFIG[mood];
  const displayMessage = pickMessage(mood, message);

  const avatarSize = { small: 56, medium: 72, large: 88 }[size];
  const faceSize = { small: 28, medium: 38, large: 48 }[size];

  useEffect(() => {
    if (!animate) {
      opacityAnim.setValue(1);
      return;
    }

    // Fade in + bounce on mount or mood change
    opacityAnim.setValue(0);
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, from: 0.7, useNativeDriver: true } as any),
    ]).start();

    if (mood === 'celebrating') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, { toValue: -8, duration: 200, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]),
        { iterations: 3 }
      ).start();
    } else if (mood === 'correct') {
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -6, duration: 150, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [mood]);

  return (
    <Animated.View style={[
      styles.wrapper,
      { opacity: opacityAnim, transform: [{ scale: scaleAnim }, { translateY: bounceAnim }] },
    ]}>
      {/* Speech bubble */}
      {showBubble && displayMessage ? (
        <View style={[styles.bubble, {
          backgroundColor: config.bubbleColor,
          borderColor: config.borderColor,
        }]}>
          <Text style={[styles.bubbleText, { color: Colors.textPrimary }]}>
            {displayMessage}
          </Text>
          {/* Bubble tail pointing down toward avatar */}
          <View style={[styles.bubbleTail, { borderTopColor: config.borderColor }]} />
          <View style={[styles.bubbleTailInner, { borderTopColor: config.bubbleColor }]} />
        </View>
      ) : null}

      {/* Avatar circle */}
      <View style={[styles.avatar, {
        width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2,
        backgroundColor: config.bubbleColor,
        borderColor: config.borderColor,
      }]}>
        <Text style={{ fontSize: faceSize }}>{config.face}</Text>
      </View>

      {/* Name tag */}
      {size !== 'small' && (
        <Text style={styles.nameTag}>Agent Maya</Text>
      )}
    </Animated.View>
  );
}

// Compact inline version — just the avatar + bubble side by side (for lesson headers)
export function AgentMayaInline({ mood = 'happy', message, animate = true }: {
  mood?: MayaMood;
  message?: string;
  animate?: boolean;
}) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const config = MOOD_CONFIG[mood];
  const displayMessage = pickMessage(mood, message);

  useEffect(() => {
    if (!animate) { scaleAnim.setValue(1); return; }
    Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, [mood]);

  return (
    <Animated.View style={[styles.inlineWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <View style={[styles.inlineAvatar, {
        backgroundColor: config.bubbleColor,
        borderColor: config.borderColor,
      }]}>
        <Text style={{ fontSize: 24 }}>{config.face}</Text>
      </View>
      <View style={[styles.inlineBubble, {
        backgroundColor: config.bubbleColor,
        borderColor: config.borderColor,
      }]}>
        <Text style={styles.inlineBubbleText}>{displayMessage}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 4,
  },
  bubble: {
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: 260,
    marginBottom: 8,
    position: 'relative',
  },
  bubbleText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -9,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  bubbleTailInner: {
    position: 'absolute',
    bottom: -7,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  avatar: {
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameTag: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2,
  },

  // Inline styles
  inlineWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inlineAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  inlineBubble: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inlineBubbleText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
});
