import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface Props {
  progress: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({ progress, color = Colors.primary, height = 8, showLabel = false, label }: Props) {
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <View>
      {(showLabel || label) && (
        <View style={styles.row}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showLabel && <Text style={[styles.label, { color }]}>{Math.round(pct * 100)}%</Text>}
        </View>
      )}
      <View style={[styles.track, { height, borderRadius: height / 2, backgroundColor: Colors.border }]}>
        <View style={[styles.fill, { width: `${pct * 100}%` as any, backgroundColor: color, height, borderRadius: height / 2 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { overflow: 'hidden' },
  fill: {},
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { color: Colors.textSecondary, fontSize: 12 },
});
