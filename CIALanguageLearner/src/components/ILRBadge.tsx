import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ILRLevel } from '../types';
import { Colors } from '../theme/colors';

const ILR_INFO: Record<string, { color: string; shortLabel: string }> = {
  '0':   { color: Colors.ilr0, shortLabel: 'ILR 0' },
  '0.5': { color: Colors.ilr0, shortLabel: 'ILR 0+' },
  '1':   { color: Colors.ilr1, shortLabel: 'ILR 1' },
  '1.5': { color: Colors.ilr1, shortLabel: 'ILR 1+' },
  '2':   { color: Colors.ilr2, shortLabel: 'ILR 2' },
  '2.5': { color: Colors.ilr2, shortLabel: 'ILR 2+' },
  '3':   { color: Colors.ilr3, shortLabel: 'ILR 3' },
  '3.5': { color: Colors.ilr3, shortLabel: 'ILR 3+' },
  '4':   { color: Colors.ilr4, shortLabel: 'ILR 4' },
  '5':   { color: Colors.ilr5, shortLabel: 'ILR 5' },
};

interface Props {
  level: ILRLevel;
  size?: 'small' | 'medium' | 'large';
}

export function ILRBadge({ level, size = 'medium' }: Props) {
  const info = ILR_INFO[String(level)] || ILR_INFO['0'];
  const s = {
    small:  { pH: 7,  pV: 3,  fs: 10, r: 6 },
    medium: { pH: 10, pV: 4,  fs: 12, r: 8 },
    large:  { pH: 14, pV: 6,  fs: 14, r: 10 },
  }[size];

  return (
    <View style={[styles.badge, {
      backgroundColor: info.color + '18',
      borderColor: info.color + '70',
      paddingHorizontal: s.pH,
      paddingVertical: s.pV,
      borderRadius: s.r,
    }]}>
      <Text style={[styles.text, { color: info.color, fontSize: s.fs }]}>
        {info.shortLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderWidth: 1.5, alignSelf: 'flex-start' },
  text: { fontWeight: '700', letterSpacing: 0.3 },
});
