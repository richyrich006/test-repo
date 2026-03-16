import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '../theme/colors';
import { scorePronunciation, getScoreLabel } from '../utils/quizEngine';

interface Props {
  expectedText: string;       // The word/phrase to pronounce
  expectedLanguage?: string;  // 'es-MX' for Spanish
  onScore?: (score: number) => void;
}

export function PronunciationChecker({
  expectedText,
  expectedLanguage = 'es-MX',
  onScore,
}: Props) {
  const [state, setState] = useState<'idle' | 'listening' | 'done' | 'unsupported'>('idle');
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  // Use ref so onend handler always reads current value (avoids stale closure)
  const stateRef = useRef<'idle' | 'listening' | 'done' | 'unsupported'>('idle');
  const setStateTracked = (s: typeof stateRef.current) => {
    stateRef.current = s;
    setState(s);
  };

  // Check Web Speech API support (works in Chrome on web)
  const isSupported = Platform.OS === 'web' && (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const startListening = () => {
    if (!isSupported) {
      setState('unsupported');
      return;
    }

    setErrorMsg(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    // Try the requested language; Chrome needs 'es' or 'es-MX' — both usually work
    recognition.lang = expectedLanguage;
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setErrorMsg(null);
      setStateTracked('listening');
    };

    recognition.onresult = (event: any) => {
      // Try all alternatives to get best match
      let bestTranscript = '';
      let bestScore = 0;
      for (let i = 0; i < event.results[0].length; i++) {
        const t = event.results[0][i].transcript;
        const s = scorePronunciation(t, expectedText);
        if (s > bestScore) {
          bestScore = s;
          bestTranscript = t;
        }
      }
      // If best score is very low, also try stripping non-alpha chars
      if (bestScore === 0 && bestTranscript) {
        bestScore = scorePronunciation(
          bestTranscript.replace(/[^a-záéíóúüñ ]/gi, ''),
          expectedText,
        );
      }
      setTranscript(bestTranscript);
      setScore(bestScore);
      onScore?.(bestScore);
      setStateTracked('done');
    };

    recognition.onerror = (event: any) => {
      const code: string = event?.error ?? '';
      const msgs: Record<string, string> = {
        'not-allowed':    '🚫 Microphone access denied. Click the 🔒 icon in your browser address bar and allow microphone.',
        'no-speech':      '🔇 No speech detected. Speak louder and closer to your mic, then try again.',
        'audio-capture':  '🎤 No microphone found. Make sure one is plugged in.',
        'network':        '🌐 Network error. Check your connection.',
        'aborted':        '',   // user cancelled — no message needed
        'service-not-allowed': '🚫 Speech service blocked. Try Chrome and make sure you\'re on a site (not file://).',
      };
      const msg = msgs[code] ?? `⚠️ Error: ${code || 'unknown'}. Try again.`;
      if (msg) setErrorMsg(msg);
      setStateTracked('idle');
    };

    // Use ref to avoid stale closure — reads current state value
    recognition.onend = () => {
      if (stateRef.current === 'listening') setStateTracked('idle');
    };

    setStateTracked('listening');
    try {
      recognition.start();
    } catch (e: any) {
      setErrorMsg('Could not start microphone. Try refreshing the page.');
      setStateTracked('idle');
    }
  };

  const reset = () => {
    recognitionRef.current?.stop();
    setTranscript('');
    setScore(null);
    setErrorMsg(null);
    setStateTracked('idle');
  };

  if (!isSupported && state !== 'unsupported') {
    return (
      <View style={styles.unsupported}>
        <Text style={styles.unsupportedText}>
          🎤 Pronunciation scoring requires Chrome browser
        </Text>
      </View>
    );
  }

  const scoreInfo = score !== null ? getScoreLabel(score) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Pronunciation Check</Text>
      <Text style={styles.targetWord}>{expectedText}</Text>

      {state === 'idle' && (
        <>
          <TouchableOpacity style={styles.micBtn} onPress={startListening}>
            <Text style={styles.micIcon}>🎤</Text>
            <Text style={styles.micText}>Tap & Speak</Text>
          </TouchableOpacity>
          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}
        </>
      )}

      {state === 'listening' && (
        <View style={styles.listeningContainer}>
          <View style={styles.pulse} />
          <Text style={styles.listeningText}>Listening...</Text>
          <TouchableOpacity style={styles.stopBtn} onPress={() => {
            recognitionRef.current?.stop();
            setState('idle');
          }}>
            <Text style={styles.stopText}>Stop</Text>
          </TouchableOpacity>
        </View>
      )}

      {state === 'done' && score !== null && scoreInfo && (
        <View style={styles.resultContainer}>
          {/* Score circle */}
          <View style={[styles.scoreCircle, {
            borderColor: scoreInfo.color,
            backgroundColor: scoreInfo.color + '15',
          }]}>
            <Text style={[styles.scoreNumber, { color: scoreInfo.color }]}>{score}</Text>
            <Text style={[styles.scoreMax, { color: scoreInfo.color }]}>/100</Text>
          </View>

          <Text style={[styles.scoreLabel, { color: scoreInfo.color }]}>
            {scoreInfo.label}
          </Text>

          {transcript ? (
            <View style={styles.transcriptBox}>
              <Text style={styles.transcriptLabel}>You said:</Text>
              <Text style={styles.transcriptText}>"{transcript}"</Text>
              {score < 75 && (
                <Text style={styles.transcriptHint}>
                  Expected: "{expectedText}"
                </Text>
              )}
            </View>
          ) : null}

          {/* Score bar */}
          <View style={styles.scoreBar}>
            <View style={[styles.scoreBarFill, {
              width: `${score}%` as any,
              backgroundColor: scoreInfo.color,
            }]} />
          </View>

          <TouchableOpacity style={styles.retryBtn} onPress={reset}>
            <Text style={styles.retryText}>🔄 Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundMuted,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  targetWord: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  micBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingHorizontal: 32,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  micIcon: { fontSize: 22 },
  micText: {
    color: Colors.textWhite,
    fontWeight: '700',
    fontSize: 16,
  },
  listeningContainer: { alignItems: 'center', gap: 10 },
  pulse: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.error + '40',
    borderWidth: 3,
    borderColor: Colors.error,
  },
  listeningText: {
    color: Colors.error,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  stopBtn: {
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 8, paddingHorizontal: 16, paddingVertical: 6,
  },
  stopText: { color: Colors.textSecondary, fontSize: 13 },

  errorBox: {
    backgroundColor: Colors.errorLight, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.error + '50',
    marginTop: 4,
  },
  errorText: { color: Colors.errorDark, fontSize: 12, textAlign: 'center', lineHeight: 17 },

  resultContainer: { alignItems: 'center', gap: 10, width: '100%' },
  scoreCircle: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 3,
    justifyContent: 'center', alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  scoreNumber: { fontSize: 32, fontWeight: '800' },
  scoreMax: { fontSize: 14, fontWeight: '600', marginTop: 8 },
  scoreLabel: { fontSize: 18, fontWeight: '700' },
  transcriptBox: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 10, padding: 12,
    width: '100%', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  transcriptLabel: { color: Colors.textMuted, fontSize: 11 },
  transcriptText: { color: Colors.textPrimary, fontSize: 15, fontWeight: '600', fontStyle: 'italic' },
  transcriptHint: { color: Colors.error, fontSize: 12, marginTop: 2 },
  scoreBar: {
    width: '100%', height: 8, borderRadius: 4,
    backgroundColor: Colors.border, overflow: 'hidden',
  },
  scoreBarFill: { height: '100%', borderRadius: 4 },
  retryBtn: {
    paddingHorizontal: 20, paddingVertical: 8,
    borderRadius: 8, borderWidth: 1.5, borderColor: Colors.border,
  },
  retryText: { color: Colors.textSecondary, fontWeight: '600', fontSize: 14 },
  unsupported: {
    backgroundColor: Colors.backgroundMuted,
    borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  unsupportedText: { color: Colors.textMuted, fontSize: 13, textAlign: 'center' },
});
