import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ILRLevel } from '../types';
import { Colors } from '../theme/colors';

const ILR_INFO: Record<string, { color: string; shortLabel: string }> = {
  '0': { color: Colors.ilr0, shortLabel: 'ILR 0' },
  '0.5': { color: Colors.ilr0, shortLabel: 'ILR 0+' },
  '1': { color: Colors.ilr1, shortLabel: 'ILR 1' },
  '1.5': { color: Colors.ilr1, shortLabel: 'ILR 1+' },
  '2': { color: Colors.ilr2, shortLabel: 'ILR 2' },
  '2.5': { color: Colors.ilr2, shortLabel: 'ILR 2+' },
  '3': { color: Colors.ilr3, shortLabel: 'ILR 3' },
  '3.5': { color: Colors.ilr3, shortLabel: 'ILR 3+' },
  '4': { color: Colors.ilr4, shortLabel: 'ILR 4' },
  '5': { color: Colors.ilr5, shortLabel: 'ILR 5' },
};

interface Props {
  level: ILRLevel;
  size?: 'small' | 'medium' | 'large';
}

export function ILRBadge({ level, size = 'medium' }: Props) {
  const info = ILR_INFO[String(level)] || ILR_INFO['0'];
  const sizeStyles = {
    small: { paddingH: 6, paddingV: 2, fontSize: 10, borderRadius: 4 },
    medium: { paddingH: 10, paddingV: 4, fontSize: 12, borderRadius: 6 },
    large: { paddingH: 14, paddingV: 6, fontSize: 14, borderRadius: 8 },
  }[size];

  return (
    <View style={[
      styles.badge,
      {
        backgroundColor: info.color + '30',
        borderColor: info.color,
        paddingHorizontal: sizeStyles.paddingH,
        paddingVertical: sizeStyles.paddingV,
        borderRadius: sizeStyles.borderRadius,
      }
    ]}>
      <Text style={[styles.text, { color: info.color, fontSize: sizeStyles.fontSize }]}>
        {info.shortLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
