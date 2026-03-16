import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface Props {
  text: string;
  language?: string;
  size?: number;
  color?: string;
}

export function AudioButton({ text, language = 'es-MX', size = 24, color = Colors.accent }: Props) {
  const [speaking, setSpeaking] = useState(false);

  const handlePress = async () => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }

    setSpeaking(true);
    Speech.speak(text, {
      language,
      rate: 0.85,       // Slightly slower for clarity — FSI standard
      pitch: 1.0,
      onDone: () => setSpeaking(false),
      onError: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.button, { borderColor: color }]}>
      {speaking ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Ionicons name="volume-high" size={size} color={color} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(200, 168, 75, 0.1)',
  },
});
