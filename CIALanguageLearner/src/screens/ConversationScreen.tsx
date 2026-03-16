import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as Speech from 'expo-speech';
import Anthropic from '@anthropic-ai/sdk';
import { Colors, Shadows } from '../theme/colors';

interface Props {
  topic?: string;
  onBack: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const STARTER_PROMPTS = [
  'Introduce yourself',
  'Talk about your day',
  'Ask for directions',
  'Order food at a restaurant',
];

function buildSystemPrompt(topic: string): string {
  return (
    'You are Agent Maya, a friendly CIA language training AI. You are having a Spanish ' +
    'conversation practice session with a student. Always respond in Spanish first, then ' +
    'provide the English translation in parentheses. Keep responses to 1-3 sentences. ' +
    'Be encouraging and correct mistakes gently. If the user writes in English, gently ask ' +
    'them to try in Spanish. The current topic is: ' + topic
  );
}

const MOCK_RESPONSE =
  '¡Hola! Soy Maya. ¿Cómo estás hoy? (Hello! I\'m Maya. How are you today?)';

let messageIdCounter = 0;
function makeId(): string {
  messageIdCounter += 1;
  return String(messageIdCounter);
}

export function ConversationScreen({ topic, onBack }: Props) {
  const topicLabel = topic || 'Free Conversation Practice';
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  const hasApiKey = Boolean(apiKey);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { id: makeId(), role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      let replyContent: string;

      if (hasApiKey) {
        const client = new Anthropic({ apiKey });
        const response = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          system: buildSystemPrompt(topicLabel),
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        });
        const block = response.content[0];
        replyContent =
          block && block.type === 'text'
            ? block.text
            : 'Maya is unavailable right now.';
      } else {
        replyContent = MOCK_RESPONSE;
      }

      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: 'assistant', content: replyContent },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: 'assistant',
          content:
            'Lo siento, hubo un error. (Sorry, there was an error.) Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    sendMessage(inputText);
  };

  const handleStarterPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleSpeak = (text: string) => {
    Speech.speak(text, { language: 'es-ES', rate: 0.85 });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>💬 Speak with Agent Maya</Text>
        </View>
        <View style={styles.langChip}>
          <Text style={styles.langChipText}>🇪🇸 Spanish</Text>
        </View>
      </View>

      {/* Topic context card */}
      <View style={styles.contextCard}>
        <Text style={styles.contextLabel}>Current topic</Text>
        <Text style={styles.contextTopic}>{topicLabel}</Text>
        {!hasApiKey && (
          <View style={styles.mockBadge}>
            <Text style={styles.mockBadgeText}>Demo Mode — Add API key for live AI</Text>
          </View>
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Chat area */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
        >
          {/* Starter prompts when no messages */}
          {messages.length === 0 && !isLoading && (
            <View style={styles.starterSection}>
              <View style={styles.mayaIntro}>
                <Text style={styles.mayaAvatar}>🤖</Text>
                <View style={styles.mayaIntroBubble}>
                  <Text style={styles.mayaIntroText}>
                    ¡Hola! Soy Maya. Start a conversation below, or pick a topic to practice.
                    (Hello! I'm Maya.)
                  </Text>
                </View>
              </View>
              <Text style={styles.starterLabel}>Suggested topics</Text>
              <View style={styles.starterChips}>
                {STARTER_PROMPTS.map((prompt) => (
                  <TouchableOpacity
                    key={prompt}
                    style={styles.starterChip}
                    onPress={() => handleStarterPrompt(prompt)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.starterChipText}>{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Message bubbles */}
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                msg.role === 'user' ? styles.messageRowUser : styles.messageRowMaya,
              ]}
            >
              {msg.role === 'assistant' && (
                <Text style={styles.avatarEmoji}>🤖</Text>
              )}
              <View
                style={[
                  styles.bubble,
                  msg.role === 'user' ? styles.userBubble : styles.mayaBubble,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    msg.role === 'user' ? styles.userBubbleText : styles.mayaBubbleText,
                  ]}
                >
                  {msg.content}
                </Text>
                <TouchableOpacity
                  style={styles.speakerBtn}
                  onPress={() => handleSpeak(msg.content)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.speakerIcon}>🔊</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <View style={[styles.messageRow, styles.messageRowMaya]}>
              <Text style={styles.avatarEmoji}>🤖</Text>
              <View style={[styles.bubble, styles.mayaBubble, styles.loadingBubble]}>
                <ActivityIndicator size="small" color={Colors.textMuted} />
                <Text style={styles.loadingText}>Maya is typing…</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Write in Spanish or English…"
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              (!inputText.trim() || isLoading) && styles.sendBtnDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
            activeOpacity={0.85}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
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
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  langChip: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  langChipText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },

  // Context card
  contextCard: {
    backgroundColor: Colors.brandLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.brandBorder,
    gap: 2,
  },
  contextLabel: {
    color: Colors.brandDark,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  contextTopic: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  mockBadge: {
    backgroundColor: Colors.warningLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  mockBadgeText: {
    color: Colors.warning,
    fontSize: 10,
    fontWeight: '600',
  },

  // Layout
  keyboardView: {
    flex: 1,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 14,
    gap: 10,
    flexGrow: 1,
  },

  // Starter prompts
  starterSection: {
    gap: 14,
    paddingTop: 8,
  },
  mayaIntro: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  mayaAvatar: {
    fontSize: 28,
    marginBottom: 4,
  },
  mayaIntroBubble: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  mayaIntroText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  starterLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  starterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  starterChip: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  starterChipText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  // Message rows
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowMaya: {
    justifyContent: 'flex-start',
  },
  avatarEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },

  // Bubbles
  bubble: {
    maxWidth: '78%',
    borderRadius: 16,
    padding: 12,
    gap: 6,
    ...Shadows.card,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  mayaBubble: {
    backgroundColor: Colors.backgroundCard,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userBubbleText: {
    color: Colors.textWhite,
  },
  mayaBubbleText: {
    color: Colors.textPrimary,
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
  },
  speakerBtn: {
    alignSelf: 'flex-end',
    paddingTop: 2,
  },
  speakerIcon: {
    fontSize: 13,
    opacity: 0.7,
  },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 10,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.backgroundMuted,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: 15,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.button,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.backgroundMuted,
  },
  sendIcon: {
    color: Colors.textWhite,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
});
