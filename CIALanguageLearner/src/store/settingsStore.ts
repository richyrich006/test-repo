import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@cia_learner_settings';

export interface AppSettings {
  notificationsEnabled: boolean;
  notificationHour: number;   // 0-23
  notificationMinute: number;
  speechRate: number;          // 0.7 | 0.85 | 1.0
  isPremium: boolean;
  dailyGoalMinutes: number;
}

const defaultSettings: AppSettings = {
  notificationsEnabled: false,
  notificationHour: 9,
  notificationMinute: 0,
  speechRate: 0.85,
  isPremium: false,
  dailyGoalMinutes: 15,
};

export async function loadSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    if (data) {
      return { ...defaultSettings, ...JSON.parse(data) };
    }
  } catch {}
  return { ...defaultSettings };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export async function updateSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K],
): Promise<AppSettings> {
  const current = await loadSettings();
  const updated = { ...current, [key]: value };
  await saveSettings(updated);
  return updated;
}
