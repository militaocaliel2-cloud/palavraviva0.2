import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { useColors } from "@/hooks/use-colors";

const tabs = [
  { name: "index", title: "Início", icon: "home" },
  { name: "liturgia", title: "Liturgia", icon: "menu-book" },
  { name: "prayers", title: "Orações", icon: "favorite-border" },
  { name: "favorites", title: "Favoritos", icon: "bookmark-border" },
  { name: "rosary", title: "Terço", icon: "radio-button-checked" },
  { name: "reminders", title: "Lembretes", icon: "notifications-none" },
] as const;

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarButton: HapticTab,
        tabBarLabelStyle: { fontSize: 9, fontWeight: "700", marginBottom: 2 },
        tabBarItemStyle: { paddingTop: 5 },
        tabBarStyle: { height: 62 + bottomPadding, paddingBottom: bottomPadding, paddingTop: 3, backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1 },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.title, tabBarIcon: ({ color, size }) => <MaterialIcons name={tab.icon} size={size ?? 21} color={color} /> }} />
      ))}
    </Tabs>
  );
}
