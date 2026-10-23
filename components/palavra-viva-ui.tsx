import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

import { useColors } from "@/hooks/use-colors";

export function ScreenHeader({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        {eyebrow ? <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text> : null}
        <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

export function SurfaceCard({ children, style, accent }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; accent?: string }) {
  const colors = useColors();
  return <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, accent ? { borderLeftColor: accent, borderLeftWidth: 3 } : null, style]}>{children}</View>;
}

export function PrimaryButton({ children, onPress, icon, variant = "primary", style, accessibilityLabel, disabled }: PressableProps & { children: React.ReactNode; icon?: React.ComponentProps<typeof MaterialIcons>["name"]; variant?: "primary" | "soft" | "outline"; style?: StyleProp<ViewStyle> }) {
  const colors = useColors();
  const backgroundColor = variant === "primary" ? colors.primary : variant === "soft" ? colors.primarySoft : "transparent";
  const foregroundColor = variant === "primary" ? colors.onPrimary : colors.primary;
  return (
    <Pressable
      {...{ onPress, disabled, accessibilityLabel }}
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, { backgroundColor, borderColor: colors.primary, opacity: pressed || disabled ? 0.72 : 1, shadowColor: colors.primary }, variant === "outline" ? { borderWidth: 1 } : null, style]}
    >
      {icon ? <MaterialIcons name={icon} size={19} color={foregroundColor} /> : null}
      <Text style={[styles.buttonText, { color: foregroundColor }]}>{children}</Text>
    </Pressable>
  );
}

export function ProgressRing({ progress, size = 82 }: { progress: number; size?: number }) {
  const colors = useColors();
  const percent = Math.round(progress * 100);
  return (
    <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2, borderColor: colors.border }]} accessibilityLabel={`${percent}% concluído`} accessibilityRole="progressbar">
      <View style={[styles.ringInner, { width: size - 12, height: size - 12, borderRadius: (size - 12) / 2, borderColor: percent > 0 ? colors.gold : colors.border }]}>
        <Text style={[styles.ringValue, { color: colors.foreground }]}>{percent}%</Text>
      </View>
    </View>
  );
}

export function IconCircle({ name, color, backgroundColor }: { name: React.ComponentProps<typeof MaterialIcons>["name"]; color: string; backgroundColor: string }) {
  return (
    <View style={[styles.iconCircle, { backgroundColor }]}>
      <MaterialIcons name={name} size={21} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 },
  headerText: { flex: 1, paddingRight: 12 },
  eyebrow: { fontSize: 11, fontWeight: "700", letterSpacing: 1.7, textTransform: "uppercase", marginBottom: 7 },
  title: { fontSize: 30, lineHeight: 36, fontWeight: "700", letterSpacing: -0.7 },
  subtitle: { fontSize: 15, lineHeight: 22, marginTop: 7 },
  card: { borderRadius: 22, borderWidth: 1, padding: 18, shadowColor: "#2E1B1F", shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  button: { minHeight: 48, borderRadius: 14, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, shadowOpacity: 0.14, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  buttonText: { fontSize: 15, fontWeight: "700" },
  ring: { alignItems: "center", justifyContent: "center", borderWidth: 7 },
  ringInner: { alignItems: "center", justifyContent: "center", borderWidth: 2 },
  ringValue: { fontSize: 17, fontWeight: "800" },
  iconCircle: { width: 44, height: 44, borderRadius: 15, alignItems: "center", justifyContent: "center" },
});

export const uiStyles = styles;
