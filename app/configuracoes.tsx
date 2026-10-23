import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import { ScreenHeader, SurfaceCard } from "@/components/palavra-viva-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useFaithJourney, type ThemePreference } from "@/hooks/use-faith-journey";
import { useThemeContext } from "@/lib/theme-provider";

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: React.ComponentProps<typeof MaterialIcons>["name"] }[] = [
  { value: "system", label: "Sistema", icon: "brightness-auto" },
  { value: "light", label: "Claro", icon: "light-mode" },
  { value: "dark", label: "Escuro", icon: "dark-mode" },
];

export default function SettingsScreen() {
  const colors = useColors();
  const { colorScheme } = useThemeContext();
  const { themePreference, reminderEnabled, favorites, setThemePreference, setReminderSettings } = useFaithJourney();

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ScreenHeader
          eyebrow="Seu espaço pessoal"
          title="Configurações"
          subtitle="Ajuste o Palavra Viva para caber no seu ritmo."
          action={<Pressable onPress={() => router.canGoBack() ? router.back() : router.replace("/")} accessibilityRole="button" accessibilityLabel="Voltar" style={({ pressed }) => [styles.backButton, { backgroundColor: colors.primarySoft, opacity: pressed ? 0.68 : 1 }]}><MaterialIcons name="arrow-back" size={19} color={colors.primary} /><Text style={[styles.backText, { color: colors.primary }]}>Voltar</Text></Pressable>}
        />

        <Text style={[styles.sectionLabel, { color: colors.primary }]}>APARÊNCIA</Text>
        <SurfaceCard style={styles.card}>
          <View style={styles.cardHeading}>
            <View style={[styles.iconBox, { backgroundColor: colors.primarySoft }]}><MaterialIcons name="palette" size={21} color={colors.primary} /></View>
            <View style={styles.headingText}>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>Tema do aplicativo</Text>
              <Text style={[styles.cardCaption, { color: colors.muted }]}>Escolha como a Palavra Viva aparece para você.</Text>
            </View>
          </View>
          <View style={styles.themeOptions}>
            {THEME_OPTIONS.map((option) => {
              const selected = themePreference === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setThemePreference(option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`Tema ${option.label}`}
                  style={[styles.themeOption, { backgroundColor: selected ? colors.primary : colors.background, borderColor: selected ? colors.primary : colors.border }]}
                >
                  <MaterialIcons name={option.icon} size={18} color={selected ? colors.onPrimary : colors.muted} />
                  <Text style={[styles.themeLabel, { color: selected ? colors.onPrimary : colors.foreground }]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={[styles.currentTheme, { color: colors.muted }]}>Tema ativo: {colorScheme === "dark" ? "escuro" : "claro"}</Text>
        </SurfaceCard>

        <Text style={[styles.sectionLabel, { color: colors.primary }]}>ROTINA</Text>
        <SurfaceCard style={styles.card}>
          <SettingRow icon="notifications-none" title="Lembretes da Liturgia" caption={reminderEnabled ? "Avisos diários estão ativos" : "Avisos diários estão pausados"} colors={colors} trailing={<Switch value={reminderEnabled} onValueChange={(value) => setReminderSettings({ reminderEnabled: value })} trackColor={{ false: colors.border, true: `${colors.primary}88` }} thumbColor={reminderEnabled ? colors.primary : colors.muted} accessibilityLabel="Ativar lembretes da Liturgia" />} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow icon="schedule" title="Horário e dias" caption="Escolha quando receber seu lembrete" colors={colors} trailing={<MaterialIcons name="chevron-right" size={22} color={colors.muted} />} onPress={() => router.push("/(tabs)/reminders" as never)} />
        </SurfaceCard>

        <Text style={[styles.sectionLabel, { color: colors.primary }]}>SEU CAMINHO</Text>
        <SurfaceCard style={styles.card}>
          <SettingRow icon="bookmark-border" title="Favoritos" caption={`${favorites.length} ${favorites.length === 1 ? "leitura salva" : "leituras salvas"}`} colors={colors} trailing={<MaterialIcons name="chevron-right" size={22} color={colors.muted} />} onPress={() => router.push("/(tabs)/favorites" as never)} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow icon="menu-book" title="Liturgia diária" caption="Consultar a Palavra completa" colors={colors} trailing={<MaterialIcons name="chevron-right" size={22} color={colors.muted} />} onPress={() => router.push("/(tabs)/liturgia" as never)} />
        </SurfaceCard>

        <Text style={[styles.sectionLabel, { color: colors.primary }]}>INFORMAÇÕES</Text>
        <SurfaceCard style={styles.card}>
          <SettingRow icon="privacy-tip" title="Política de Privacidade" caption="Como cuidamos dos seus dados" colors={colors} trailing={<MaterialIcons name="open-in-new" size={19} color={colors.muted} />} onPress={() => router.push("/politica-de-privacidade" as never)} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow icon="description" title="Termos de Uso" caption="Condições para usar o aplicativo" colors={colors} trailing={<MaterialIcons name="open-in-new" size={19} color={colors.muted} />} onPress={() => router.push("/termos-de-uso" as never)} />
        </SurfaceCard>

        <Text style={[styles.version, { color: colors.muted }]}>Palavra Viva · seu caminho diário de fé</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

function SettingRow({ icon, title, caption, colors, trailing, onPress }: { icon: React.ComponentProps<typeof MaterialIcons>["name"]; title: string; caption: string; colors: ReturnType<typeof useColors>; trailing: React.ReactNode; onPress?: () => void }) {
  const content = <><View style={[styles.iconBox, { backgroundColor: colors.primarySoft }]}><MaterialIcons name={icon} size={20} color={colors.primary} /></View><View style={styles.rowText}><Text style={[styles.rowTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.rowCaption, { color: colors.muted }]}>{caption}</Text></View>{trailing}</>;
  if (!onPress) return <View style={styles.settingRow}>{content}</View>;
  return <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.settingRow, { opacity: pressed ? 0.68 : 1 }]}>{content}</Pressable>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 36 },
  backButton: { minHeight: 42, borderRadius: 14, paddingHorizontal: 11, flexDirection: "row", alignItems: "center", gap: 5 },
  backText: { fontSize: 12, fontWeight: "800" },
  sectionLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1.7, marginBottom: 9, marginTop: 6 },
  card: { padding: 16, marginBottom: 18 },
  cardHeading: { flexDirection: "row", alignItems: "center" },
  headingText: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 16, fontWeight: "800" },
  cardCaption: { fontSize: 12, lineHeight: 18, marginTop: 3 },
  iconBox: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  themeOptions: { flexDirection: "row", gap: 8, marginTop: 17 },
  themeOption: { flex: 1, minHeight: 45, borderWidth: 1, borderRadius: 13, alignItems: "center", justifyContent: "center", gap: 4 },
  themeLabel: { fontSize: 12, fontWeight: "800" },
  currentTheme: { fontSize: 11, textAlign: "center", marginTop: 12 },
  settingRow: { minHeight: 58, flexDirection: "row", alignItems: "center" },
  rowText: { flex: 1, marginHorizontal: 12 },
  rowTitle: { fontSize: 14, fontWeight: "800" },
  rowCaption: { fontSize: 11, marginTop: 3 },
  divider: { height: 1, marginVertical: 5 },
  version: { fontSize: 11, textAlign: "center", marginTop: 4 },
});
