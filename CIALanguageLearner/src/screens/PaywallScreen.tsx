// TODO: Replace mock subscribe handler with RevenueCat SDK
// https://www.revenuecat.com/docs/getting-started/installation/reactnative

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Colors, Shadows } from '../theme/colors';

interface Props {
  onSubscribe: (plan: 'monthly' | 'annual') => void;
  onRestore: () => void;
  onClose: () => void;
}

const FEATURES = [
  'All 35+ lessons unlocked',
  'AI Conversation Practice with Agent Maya',
  'Unlimited pattern drills & dialogues',
  'Advanced ILR tracking & progress charts',
  'Daily streak reminders & coaching',
  'Offline access — learn anywhere',
];

export function PaywallScreen({ onSubscribe, onRestore, onClose }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  const handleSubscribe = () => {
    Alert.alert(
      'Coming Soon',
      'Subscription coming soon! RevenueCat integration required.',
      [{ text: 'OK' }]
    );
    onSubscribe(selectedPlan);
  };

  return (
    <View style={styles.container}>
      {/* Dark gradient background layers */}
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      <SafeAreaView style={styles.safe}>
        {/* Close button */}
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.8}>
          <Text style={styles.closeX}>✕</Text>
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero section */}
          <Text style={styles.heroEmoji}>🎯</Text>
          <Text style={styles.heroTitle}>Master Spanish Faster</Text>
          <Text style={styles.heroSubtitle}>
            The CIA/FSI methodology that trains diplomats and intelligence officers — now in your pocket.
          </Text>

          {/* Unlock badge */}
          <View style={styles.unlockBadge}>
            <Text style={styles.unlockBadgeText}>🔓 Unlock Premium</Text>
          </View>

          {/* Features list */}
          <View style={styles.featuresCard}>
            {FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <View style={styles.checkBadge}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Pricing cards */}
          <View style={styles.plansRow}>
            {/* Monthly */}
            <TouchableOpacity
              style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
              onPress={() => setSelectedPlan('monthly')}
              activeOpacity={0.8}
            >
              <View style={styles.planTagRow}>
                <View style={styles.flexibleTag}>
                  <Text style={styles.flexibleTagText}>Most Flexible</Text>
                </View>
              </View>
              <Text style={styles.planName}>Monthly</Text>
              <Text style={styles.planPrice}>$9.99</Text>
              <Text style={styles.planPeriod}>per month</Text>
              {selectedPlan === 'monthly' && (
                <View style={styles.selectedDot} />
              )}
            </TouchableOpacity>

            {/* Annual */}
            <TouchableOpacity
              style={[styles.planCard, styles.planCardAnnual, selectedPlan === 'annual' && styles.planCardSelected]}
              onPress={() => setSelectedPlan('annual')}
              activeOpacity={0.8}
            >
              <View style={styles.bestValueBanner}>
                <Text style={styles.bestValueText}>BEST VALUE — Save 50%</Text>
              </View>
              <Text style={[styles.planName, { marginTop: 8 }]}>Annual</Text>
              <Text style={styles.planPrice}>$59.99</Text>
              <Text style={styles.planPeriod}>per year</Text>
              <View style={styles.savePill}>
                <Text style={styles.savePillText}>=$5/mo</Text>
              </View>
              {selectedPlan === 'annual' && (
                <View style={[styles.selectedDot, { backgroundColor: Colors.brand }]} />
              )}
            </TouchableOpacity>
          </View>

          {/* Subscribe CTA */}
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleSubscribe}
            activeOpacity={0.88}
          >
            <Text style={styles.ctaText}>Start Free Trial — 7 Days Free</Text>
            <Text style={styles.ctaArrow}> →</Text>
          </TouchableOpacity>

          {/* Fine print */}
          <Text style={styles.finePrint}>
            Cancel anytime. Billed after free trial ends. Restore purchases below.
          </Text>
          <Text style={styles.finePrintSmall}>
            {selectedPlan === 'annual'
              ? 'After 7-day trial, $59.99/year billed annually. Cancel before trial ends to avoid charges.'
              : 'After 7-day trial, $9.99/month billed monthly. Cancel before trial ends to avoid charges.'}
          </Text>

          {/* Restore */}
          <TouchableOpacity style={styles.restoreBtn} onPress={onRestore} activeOpacity={0.7}>
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  bgTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: '#0D1B2A',
  },
  bgBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#0A1628',
  },
  safe: {
    flex: 1,
  },
  closeBtn: {
    position: 'absolute',
    top: 52,
    right: 18,
    zIndex: 20,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeX: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    paddingTop: 56,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  // Hero
  heroEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  heroTitle: {
    color: Colors.textWhite,
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  unlockBadge: {
    backgroundColor: Colors.brand + '28',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.brand + '55',
    marginBottom: 28,
  },
  unlockBadgeText: {
    color: Colors.brand,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Features card
  featuresCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    gap: 11,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  checkMark: {
    color: Colors.textWhite,
    fontSize: 12,
    fontWeight: '800',
  },
  featureText: {
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },

  // Plan cards
  plansRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  planCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.14)',
    minHeight: 140,
    gap: 4,
    overflow: 'hidden',
  },
  planCardAnnual: {
    backgroundColor: 'rgba(245,158,11,0.10)',
    borderColor: Colors.brand + '45',
    paddingTop: 0,
  },
  planCardSelected: {
    borderColor: Colors.brand,
    backgroundColor: 'rgba(245,158,11,0.18)',
  },
  planTagRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 6,
    minHeight: 20,
  },
  flexibleTag: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  flexibleTagText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  bestValueBanner: {
    backgroundColor: Colors.brand,
    width: '110%',
    paddingVertical: 5,
    alignItems: 'center',
    marginBottom: 8,
  },
  bestValueText: {
    color: Colors.textWhite,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  planName: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 13,
    fontWeight: '600',
  },
  planPrice: {
    color: Colors.textWhite,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  planPeriod: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
  },
  savePill: {
    backgroundColor: Colors.successLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
  },
  savePillText: {
    color: Colors.successDark,
    fontSize: 11,
    fontWeight: '700',
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },

  // CTA
  ctaButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 18,
    marginBottom: 14,
    ...Shadows.button,
  },
  ctaText: {
    color: Colors.textWhite,
    fontSize: 17,
    fontWeight: '800',
  },
  ctaArrow: {
    color: Colors.textWhite,
    fontSize: 17,
    fontWeight: '700',
  },

  // Fine print
  finePrint: {
    color: 'rgba(255,255,255,0.58)',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 6,
  },
  finePrintSmall: {
    color: 'rgba(255,255,255,0.32)',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: 12,
    marginBottom: 16,
  },

  // Restore
  restoreBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  restoreText: {
    color: 'rgba(255,255,255,0.48)',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
