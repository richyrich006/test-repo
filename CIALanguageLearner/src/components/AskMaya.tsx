import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors, Shadows } from '../theme/colors';
import { AgentMayaInline, MayaMood } from './AgentMaya';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  lessonTitle: string;
  lessonObjective?: string;
  currentPhase?: string;
  currentWord?: string;  // Vocab/drill word currently on screen
}

const API_KEY = (process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '').trim();

const SYSTEM_PROMPT = (lessonTitle: string, objective: string, phase: string) =>
  `You are Agent Maya, a friendly CIA/FSI Spanish language training assistant inside the app "CIA Language Learner".
You are currently helping a student in the lesson: "${lessonTitle}".
Lesson objective: ${objective || 'Learn Spanish vocabulary and phrases'}.
Current lesson phase: ${phase || 'vocabulary study'}.

Your role:
- Answer questions about Spanish vocabulary, grammar, pronunciation, and culture
- Explain words, phrases, or concepts from the lesson
- Give example sentences
- Offer memory tips and mnemonics
- Stay encouraging and concise (2-4 sentences unless more detail is needed)
- Occasionally say something in Spanish with an English translation
- Never break character — you are always Agent Maya

Keep responses SHORT and helpful. Use simple language since the student is a beginner.`;

export function AskMaya({ lessonTitle, lessonObjective, currentPhase, currentWord }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const mayaMood: MayaMood = loading ? 'thinking' : messages.length === 0 ? 'happy' : 'encouraging';

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || loading) return;

    if (!API_KEY) {
      setError('No API key set. Add EXPO_PUBLIC_ANTHROPIC_API_KEY to your .env file.');
      return;
    }

    setError(null);
    const userMsg: Message = { role: 'user', content: question };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    // Scroll to bottom
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    // Build context hint if a word is active
    const contextHint = currentWord
      ? `\n\n[The student is currently looking at the word/phrase: "${currentWord}"]`
      : '';

    try {
      const apiMessages = updatedMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));
      // Prepend context hint to first user message if this is the first question
      if (apiMessages.length === 1 && contextHint) {
        apiMessages[0].content = apiMessages[0].content + contextHint;
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-6',
          max_tokens: 512,
          system: SYSTEM_PROMPT(
            lessonTitle,
            lessonObjective ?? '',
            currentPhase ?? 'vocabulary'
          ),
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const msg = (errBody as any)?.error?.message ?? `HTTP ${response.status}`;
        throw new Error(msg);
      }

      const data = await response.json();
      const replyText: string =
        data?.content?.find((b: any) => b.type === 'text')?.text ?? '(no response)';

      setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <TouchableOpacity style={styles.toggleBtn} onPress={() => setIsOpen(true)} activeOpacity={0.85}>
        <Text style={styles.toggleIcon}>💬</Text>
        <View style={styles.toggleTextBlock}>
          <Text style={styles.toggleTitle}>Ask Agent Maya</Text>
          <Text style={styles.toggleSub}>Questions about this lesson?</Text>
        </View>
        <Text style={styles.toggleArrow}>›</Text>
      </TouchableOpacity>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>💬</Text>
          <Text style={styles.headerTitle}>Ask Agent Maya</Text>
        </View>
        <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Chat area */}
      <ScrollView
        ref={scrollRef}
        style={styles.chat}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Welcome message if no messages yet */}
        {messages.length === 0 && !loading && (
          <View style={styles.welcomeRow}>
            <AgentMayaInline
              mood="happy"
              message={`¡Hola! Ask me anything about "${lessonTitle}". I can explain words, grammar, or culture!`}
              animate
            />
          </View>
        )}

        {/* Message bubbles */}
        {messages.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.messageRow,
              msg.role === 'user' ? styles.messageRowUser : styles.messageRowAssistant,
            ]}
          >
            {msg.role === 'assistant' && (
              <View style={styles.avatarSmall}>
                <Text style={styles.avatarEmoji}>😊</Text>
              </View>
            )}
            <View style={[
              styles.bubble,
              msg.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant,
            ]}>
              <Text style={[
                styles.bubbleText,
                msg.role === 'user' ? styles.bubbleTextUser : styles.bubbleTextAssistant,
              ]}>
                {msg.content}
              </Text>
            </View>
          </View>
        ))}

        {/* Loading indicator */}
        {loading && (
          <View style={styles.messageRowAssistant}>
            <View style={styles.avatarSmall}>
              <Text style={styles.avatarEmoji}>🤔</Text>
            </View>
            <View style={[styles.bubble, styles.bubbleAssistant, styles.bubbleLoading]}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>Maya is thinking...</Text>
            </View>
          </View>
        )}

        {/* Error */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}
      </ScrollView>

      {/* Input row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask Maya anything..."
          placeholderTextColor={Colors.textMuted}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          editable={!loading}
          multiline={false}
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Collapsed toggle button
  toggleBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 14, padding: 14,
    borderWidth: 1.5, borderColor: Colors.primary + '30',
    ...Shadows.card,
  },
  toggleIcon: { fontSize: 22 },
  toggleTextBlock: { flex: 1 },
  toggleTitle: { fontWeight: '700', fontSize: 14, color: Colors.primary },
  toggleSub: { color: Colors.textMuted, fontSize: 12, marginTop: 1 },
  toggleArrow: { color: Colors.textMuted, fontSize: 22, fontWeight: '300' },

  // Expanded container
  container: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.primary + '30',
    overflow: 'hidden',
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.primary + '20',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerIcon: { fontSize: 18 },
  headerTitle: { fontWeight: '800', fontSize: 14, color: Colors.primary },
  closeBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center', alignItems: 'center',
  },
  closeText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },

  // Chat area
  chat: { maxHeight: 280 },
  chatContent: { padding: 12, gap: 10 },

  welcomeRow: { marginBottom: 4 },

  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, maxWidth: '90%' },
  messageRowUser: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  messageRowAssistant: { alignSelf: 'flex-start' },

  avatarSmall: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1.5, borderColor: Colors.primary + '40',
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  avatarEmoji: { fontSize: 16 },

  bubble: {
    borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8,
    maxWidth: 260, flexShrink: 1,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1, borderColor: Colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleLoading: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 10,
  },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTextUser: { color: Colors.textWhite, fontWeight: '500' },
  bubbleTextAssistant: { color: Colors.textPrimary },
  loadingText: { color: Colors.textMuted, fontSize: 13 },

  errorBox: {
    backgroundColor: Colors.errorLight, borderRadius: 10,
    padding: 10, borderWidth: 1, borderColor: Colors.error + '40',
  },
  errorText: { color: Colors.errorDark, fontSize: 13 },

  // Input row
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 10, borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.backgroundCard,
  },
  input: {
    flex: 1, backgroundColor: Colors.backgroundMuted,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    fontSize: 14, color: Colors.textPrimary,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.border },
  sendIcon: { color: Colors.textWhite, fontSize: 14, fontWeight: '700' },
});
