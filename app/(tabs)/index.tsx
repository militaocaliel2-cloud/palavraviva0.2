import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";

import { getDailyWord } from "@/constants/content";
import { IconCircle, ProgressRing, ScreenHeader, SurfaceCard } from "@/components/palavra-viva-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useFaithJourney, type JourneyKey } from "@/hooks/use-faith-journey";
import { useThemeContext } from "@/lib/theme-provider";

const MISSIONS: { key: JourneyKey; title: string; caption: string; icon: React.ComponentProps<typeof MaterialIcons>["name"]; route: "/liturgia" | "/prayers" | "/rosary" }[] = [
  { key: "liturgy", title: "Ler a liturgia", caption: "Um momento de escuta", icon: "menu-book", route: "/liturgia" },
  { key: "prayer", title: "Fazer uma oração", caption: "Converse com Deus", icon: "volunteer-activism", route: "/prayers" },
  { key: "rosary", title: "Rezar o terço", caption: "Caminhe em oração", icon: "radio-button-checked", route: "/rosary" },
];

export default function HomeScreen() {
  const colors = useColors();
  const { colorScheme } = useThemeContext();
  const { completed, completedCount, progress, streak, prayerDays, ready, setThemePreference } = useFaithJourney();
  const [today, setToday] = useState(() => new Date());
  const dailyWord = getDailyWord(today);
  const dateLabel = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(today);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setToday((current) => current.toDateString() === now.toDateString() ? current : now);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}><Text style={[styles.brandSymbol, { color: colors.gold }]}>✦</Text></View>
          <View>
            <Text style={[styles.brandName, { color: colors.foreground }]}>Palavra <Text style={{ color: colors.primary }}>Viva</Text></Text>
            <Text style={[styles.brandMeta, { color: colors.muted }]}>seu caminho diário de fé</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable onPress={() => router.push("/configuracoes" as never)} accessibilityRole="button" accessibilityLabel="Abrir configurações" style={[styles.settingsButton, { backgroundColor: colors.primarySoft }]}>
              <MaterialIcons name="tune" size={19} color={colors.primary} />
            </Pressable>
            <Pressable onPress={() => setThemePreference(colorScheme === "dark" ? "light" : "dark")} accessibilityRole="button" accessibilityLabel="Alternar modo claro e escuro" style={[styles.themeButton, { backgroundColor: colors.primarySoft }]}>
              <Text style={[styles.themeSymbol, { color: colors.primary }]}>{colorScheme === "dark" ? "☼" : "☾"}</Text>
            </Pressable>
          </View>
        </View>

        <ScreenHeader eyebrow={dateLabel} title="Um pequeno passo para hoje." subtitle="Que a sua presença encontre espaço entre as coisas do dia." />

        <SurfaceCard style={[styles.wordCard, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
          <View style={styles.wordLabelRow}>
            <Text style={styles.wordLabel}>PALAVRA DO DIA</Text>
            <MaterialIcons name="flare" size={18} color={colors.gold} />
          </View>
          <Text style={[styles.quote, { color: colors.onPrimary }]}>“{dailyWord.quote}”</Text>
          <Text style={[styles.reference, { color: colors.onPrimary }]}>— {dailyWord.reference}</Text>
          <View style={styles.wordDivider} />
          <Text style={[styles.wordReflection, { color: colors.onPrimary }]}>{dailyWord.reflection}</Text>
        </SurfaceCard>

        <Pressable onPress={() => router.push("/quiz" as never)} accessibilityRole="button" accessibilityLabel="Abrir Quiz do Dia" style={({ pressed }) => [styles.quizCard, { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.75 : 1 }]}>
          <View style={[styles.quizIcon, { backgroundColor: colors.primarySoft }]}><MaterialIcons name="quiz" size={22} color={colors.primary} /></View>
          <View style={styles.quizText}><Text style={[styles.quizEyebrow, { color: colors.primary }]}>DESAFIO DE HOJE</Text><Text style={[styles.quizTitle, { color: colors.foreground }]}>Quiz do Evangelho</Text><Text style={[styles.quizCaption, { color: colors.muted }]}>Três perguntas para guardar a Liturgia.</Text></View>
          <MaterialIcons name="arrow-forward-ios" size={16} color={colors.muted} />
        </Pressable>

        <SurfaceCard style={styles.progressCard}>
          <View style={styles.progressTopLine}>
            <View>
              <Text style={[styles.cardEyebrow, { color: colors.primary }]}>SUA JORNADA</Text>
              <Text style={[styles.progressTitle, { color: colors.foreground }]}>{ready ? "Continue de onde você parou" : "Preparando seu caminho"}</Text>
              <Text style={[styles.progressCaption, { color: colors.muted }]}>{completedCount} de 3 práticas concluídas hoje</Text>
            </View>
            <ProgressRing progress={progress} />
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.primarySoft }]}>
            <View style={[styles.progressFill, { width: `${Math.max(progress * 100, 3)}%`, backgroundColor: colors.gold }]} />
          </View>
          <View style={styles.statsRow}>
            <MiniStat icon="local-fire-department" value={String(streak)} label="dias seguidos" colors={colors} />
            <MiniStat icon="favorite-border" value={String(prayerDays)} label="dias de oração" colors={colors} />
            <MiniStat icon="check-circle-outline" value={`${completedCount}/3`} label="missão de hoje" colors={colors} />
          </View>
        </SurfaceCard>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Sua missão de hoje</Text>
            <Text style={[styles.sectionCaption, { color: colors.muted }]}>Três pausas que cabem no seu ritmo.</Text>
          </View>
          <MaterialIcons name="north-east" size={20} color={colors.gold} />
        </View>

        <View style={styles.missionList}>
          {MISSIONS.map((mission) => (
            <Pressable key={mission.key} onPress={() => router.push(mission.route)} accessibilityRole="button" accessibilityLabel={`${mission.title}. ${completed[mission.key] ? "Concluída" : mission.caption}`} style={({ pressed }) => [styles.missionRow, { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}>
              <IconCircle name={mission.icon} color={completed[mission.key] ? colors.success : colors.primary} backgroundColor={completed[mission.key] ? `${colors.success}22` : colors.primarySoft} />
              <View style={styles.missionText}>
                <Text style={[styles.missionTitle, { color: colors.foreground }]}>{mission.title}</Text>
                <Text style={[styles.missionCaption, { color: colors.muted }]}>{completed[mission.key] ? "Concluída hoje" : mission.caption}</Text>
              </View>
              <MaterialIcons name={completed[mission.key] ? "check-circle" : "arrow-forward-ios"} size={completed[mission.key] ? 22 : 16} color={completed[mission.key] ? colors.success : colors.muted} />
            </Pressable>
          ))}
        </View>

        <View style={[styles.quoteStrip, { borderTopColor: colors.border }]}>
          <MaterialIcons name="format-quote" size={22} color={colors.gold} />
          <Text style={[styles.quoteStripText, { color: colors.muted }]}>A constância nasce de um gesto simples repetido com intenção.</Text>
        </View>
        <View style={styles.legalFooter}>
          <Text style={[styles.legalLabel, { color: colors.muted }]}>Informações legais</Text>
          <View style={styles.legalLinks}>
            <Pressable onPress={() => router.push("/politica-de-privacidade" as never)} accessibilityRole="link"><Text style={[styles.legalLink, { color: colors.primary }]}>Privacidade</Text></Pressable>
            <Text style={[styles.legalDot, { color: colors.border }]}>·</Text>
            <Pressable onPress={() => router.push("/termos-de-uso" as never)} accessibilityRole="link"><Text style={[styles.legalLink, { color: colors.primary }]}>Termos de uso</Text></Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function MiniStat({ icon, value, label, colors }: { icon: React.ComponentProps<typeof MaterialIcons>["name"]; value: string; label: string; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.miniStat}>
      <MaterialIcons name={icon} size={17} color={colors.gold} />
      <Text style={[styles.miniValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.miniLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 32 },
  brandRow: { flexDirection: "row", alignItems: "center", marginBottom: 28 },
  brandMark: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "#7B2635", marginRight: 10 },
  brandSymbol: { fontSize: 20, fontWeight: "800" },
  brandName: { fontFamily: "serif", fontSize: 21, fontWeight: "700" },
  brandMeta: { fontSize: 10, letterSpacing: 0.4, marginTop: 1 },
  themeButton: { marginLeft: "auto", width: 42, height: 42, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  headerActions: { marginLeft: "auto", flexDirection: "row", gap: 8 },
  settingsButton: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  themeSymbol: { fontSize: 24, lineHeight: 27, fontWeight: "700" },
  wordCard: { padding: 20, marginBottom: 14 },
  wordLabelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  wordLabel: { color: "#E8C98B", fontSize: 10, fontWeight: "800", letterSpacing: 1.8 },
  quote: { fontFamily: "serif", fontSize: 27, lineHeight: 34, marginTop: 18 },
  reference: { fontSize: 15, marginTop: 8 },
  wordDivider: { height: 1, backgroundColor: "#FFFFFF33", marginVertical: 18 },
  wordReflection: { fontSize: 14, lineHeight: 21 },
  quizCard: { minHeight: 78, borderRadius: 19, borderWidth: 1, padding: 13, flexDirection: "row", alignItems: "center", marginBottom: 14 },
  quizIcon: { width: 48, height: 48, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  quizText: { flex: 1, marginHorizontal: 12 },
  quizEyebrow: { fontSize: 9, fontWeight: "800", letterSpacing: 1.4 },
  quizTitle: { fontSize: 16, fontWeight: "800", marginTop: 3 },
  quizCaption: { fontSize: 12, marginTop: 4 },
  progressCard: { marginBottom: 25 },
  progressTopLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardEyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.6 },
  progressTitle: { fontSize: 18, fontWeight: "700", marginTop: 7, maxWidth: 220 },
  progressCaption: { fontSize: 13, marginTop: 5 },
  progressTrack: { height: 8, borderRadius: 8, overflow: "hidden", marginTop: 20 },
  progressFill: { height: "100%", borderRadius: 8 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  miniStat: { flex: 1, alignItems: "center", gap: 2 },
  miniValue: { fontSize: 20, fontWeight: "800", marginTop: 3 },
  miniLabel: { fontSize: 10, textAlign: "center" },
  sectionHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 13 },
  sectionTitle: { fontSize: 21, fontFamily: "serif", fontWeight: "700" },
  sectionCaption: { fontSize: 13, marginTop: 3 },
  missionList: { gap: 10 },
  missionRow: { minHeight: 76, borderRadius: 19, borderWidth: 1, padding: 13, flexDirection: "row", alignItems: "center" },
  missionText: { flex: 1, marginHorizontal: 12 },
  missionTitle: { fontSize: 15, fontWeight: "700" },
  missionCaption: { fontSize: 12, marginTop: 4 },
  quoteStrip: { borderTopWidth: 1, marginTop: 28, paddingTop: 16, flexDirection: "row", gap: 8, alignItems: "flex-start" },
  quoteStripText: { flex: 1, fontFamily: "serif", fontSize: 14, lineHeight: 20 },
  legalFooter: { alignItems: "center", paddingTop: 24, paddingBottom: 8 },
  legalLabel: { fontSize: 11, marginBottom: 7 },
  legalLinks: { flexDirection: "row", alignItems: "center", gap: 8 },
  legalLink: { fontSize: 12, fontWeight: "700" },
  legalDot: { fontSize: 14 },
});
