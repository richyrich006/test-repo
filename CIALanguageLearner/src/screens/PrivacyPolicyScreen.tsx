import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Colors, Shadows } from '../theme/colors';

interface Props {
  onBack: () => void;
}

interface PolicySection {
  title: string;
  body: string;
}

const POLICY_SECTIONS: PolicySection[] = [
  {
    title: 'Data Collection',
    body:
      'CIA Language Learner collects only the data you generate while using the app — including lesson progress, XP earned, vocabulary review history, and daily study time. All learning data is stored locally on your device. We do not collect your name, email address, or any personally identifiable information unless you explicitly provide it.',
  },
  {
    title: 'How We Use Your Data',
    body:
      'Your data is used solely to power app features: tracking lesson progress, calculating your ILR proficiency level, scheduling spaced-repetition reviews, and displaying your study streak. We do not use your data for advertising, profiling, or any purpose beyond delivering the language learning experience. Your data is never sold or rented to third parties.',
  },
  {
    title: 'Data Storage',
    body:
      'All progress data is stored locally on your device using AsyncStorage. We do not operate servers that store your personal learning records. If you delete the app, all associated data is permanently removed from your device. Backups are your responsibility via your device\'s native backup systems.',
  },
  {
    title: 'Third-Party Services',
    body:
      'The premium version of this app integrates with RevenueCat to process subscription payments. RevenueCat may collect anonymized purchase data in accordance with their own privacy policy. If AI Conversation Practice is enabled, messages are processed by Anthropic\'s API and are subject to Anthropic\'s privacy policy. We recommend reviewing these policies before using those features.',
  },
  {
    title: "Children's Privacy",
    body:
      "CIA Language Learner is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided personal information through our app, please contact us immediately and we will take steps to remove such information from our systems.",
  },
  {
    title: 'Contact Us',
    body:
      'If you have questions, concerns, or requests regarding this Privacy Policy or your data, please contact us at:\n\nsupport@cialanguagelearner.com\n\nWe aim to respond to all privacy-related inquiries within 5 business days.',
  },
];

export function PrivacyPolicyScreen({ onBack }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Intro card */}
        <View style={styles.introCard}>
          <Text style={styles.shieldIcon}>🔒</Text>
          <Text style={styles.introTitle}>Your Privacy Matters</Text>
          <Text style={styles.introText}>
            CIA Language Learner is designed with privacy as a core principle. Your learning data belongs to you alone — we keep it on your device.
          </Text>
          <Text style={styles.lastUpdated}>Last updated: March 2025</Text>
        </View>

        {/* Policy sections */}
        {POLICY_SECTIONS.map((section, index) => (
          <View key={index} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        {/* Footer note */}
        <View style={styles.footerCard}>
          <Text style={styles.footerIcon}>✅</Text>
          <Text style={styles.footerText}>
            This policy may be updated periodically. Any significant changes will be reflected with a new "Last updated" date. Continued use of the app after changes constitutes acceptance of the revised policy.
          </Text>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
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
  headerTitle: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 18,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },

  // Intro
  introCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '28',
    ...Shadows.card,
  },
  shieldIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  introTitle: {
    color: Colors.primaryDark,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  introText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 10,
  },
  lastUpdated: {
    color: Colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
  },

  // Sections
  sectionCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    ...Shadows.card,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  sectionBody: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },

  // Footer
  footerCard: {
    backgroundColor: Colors.successBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.success + '28',
  },
  footerIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
});
