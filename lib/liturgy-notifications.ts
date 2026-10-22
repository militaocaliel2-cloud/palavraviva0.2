import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
  });
}

export type NotificationSchedule = { enabled: boolean; time: string; days: number[] };

export async function syncDailyLiturgyNotifications({ enabled, time, days }: NotificationSchedule) {
  if (Platform.OS === "web") return { supported: false, granted: false };

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("daily-liturgy", { name: "Liturgia diária", importance: Notifications.AndroidImportance.DEFAULT, sound: undefined });
  }

  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!enabled || days.length === 0) return { supported: true, granted: true };

  const permission = await Notifications.getPermissionsAsync();
  const finalPermission = permission.granted ? permission : await Notifications.requestPermissionsAsync();
  if (!finalPermission.granted) return { supported: true, granted: false };

  const [hour, minute] = time.split(":").map(Number);
  await Promise.all(days.map((day) => Notifications.scheduleNotificationAsync({
    content: { title: "A Liturgia do dia está pronta", body: "Reserve alguns minutos para caminhar com a Palavra Viva.", data: { route: "/liturgia" } },
    trigger: Platform.OS === "ios"
      ? { type: Notifications.SchedulableTriggerInputTypes.CALENDAR, weekday: day === 0 ? 1 : day + 1, hour, minute, repeats: true }
      : { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday: day === 0 ? 1 : day + 1, hour, minute, channelId: "daily-liturgy" },
  })));
  return { supported: true, granted: true };
}
