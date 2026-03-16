import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(hour = 9, minute = 0): Promise<string | null> {
  try {
    const granted = await requestNotificationPermission();
    if (!granted) return null;

    // Cancel any existing daily reminders first
    await cancelDailyReminder();

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔥 Keep your streak alive!',
        body: "Your Spanish lesson is waiting. Don't lose your streak!",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
    return id;
  } catch (e) {
    console.warn('Failed to schedule notification:', e);
    return null;
  }
}

const REMINDER_TAG = 'daily-spanish-reminder';

export async function cancelDailyReminder(): Promise<void> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of scheduled) {
      if (notif.content.title?.includes('streak')) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
    }
  } catch (e) {
    console.warn('Failed to cancel notifications:', e);
  }
}

export async function sendStreakWarning(streakDays: number): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🔥 ${streakDays}-day streak at risk!`,
        body: 'Complete a lesson today to keep your streak going.',
        sound: true,
      },
      trigger: null, // immediate
    });
  } catch (e) {
    console.warn('Failed to send streak warning:', e);
  }
}
