import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { PRAYERS } from "@/constants/content";
import { PrimaryButton, ScreenHeader, SurfaceCard } from "@/components/palavra-viva-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useFaithJourney } from "@/hooks/use-faith-journey";

export default function PrayersScreen() {
  const colors = useColors();
  const { completed, completeActivity } = useFaithJourney();
  const [openPrayer, setOpenPrayer] = useState("pai-nosso");

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ScreenHeader eyebrow="Presença e confiança" title="Orações" subtitle="Escolha uma oração e converse com Deus." action={<MaterialIcons name="volunteer-activism" size={30} color={colors.gold} />} />
        <SurfaceCard style={styles.introCard}>
          <MaterialIcons name="lightbulb-outline" size={20} color={colors.gold} />
          <Text style={[styles.introText, { color: colors.foreground }]}>Não é preciso ter pressa. Permaneça alguns instantes com as palavras que fazem sentido para você.</Text>
        </SurfaceCard>
        <View style={styles.list}>
          {PRAYERS.map((prayer) => {
            const isOpen = openPrayer === prayer.id;
            return (
              <SurfaceCard key={prayer.id} style={styles.prayerCard}>
                <Pressable onPress={() => setOpenPrayer(isOpen ? "" : prayer.id)} accessibilityRole="button" accessibilityState={{ expanded: isOpen }} accessibilityLabel={`${prayer.title}. ${isOpen ? "Recolher" : "Abrir"}`} style={styles.prayerHeader}>
                  <View style={styles.prayerTitleWrap}>
                    <Text style={[styles.prayerTitle, { color: colors.foreground }]}>{prayer.title}</Text>
                    <Text style={[styles.prayerCategory, { color: colors.muted }]}>{prayer.category}</Text>
                  </View>
                  <MaterialIcons name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color={colors.primary} />
                </Pressable>
                {isOpen ? <View style={[styles.prayerBody, { borderTopColor: colors.border }]}><Text style={[styles.prayerText, { color: colors.foreground }]}>{prayer.text}</Text>{prayer.id === "pai-nosso" || prayer.id === "oracao-manha" || prayer.id === "oracao-noite" ? <Pressable onPress={() => completeActivity("prayer")} accessibilityRole="button" accessibilityLabel="Marcar oração como feita" style={({ pressed }) => [styles.inlineAction, { backgroundColor: completed.prayer ? `${colors.success}22` : colors.primarySoft, opacity: pressed ? 0.7 : 1 }]}><MaterialIcons name={completed.prayer ? "check-circle" : "favorite-border"} size={18} color={completed.prayer ? colors.success : colors.primary} /><Text style={[styles.inlineActionText, { color: completed.prayer ? colors.success : colors.primary }]}>{completed.prayer ? "Rezei hoje" : "Rezei esta oração"}</Text></Pressable> : null}</View> : null}
              </SurfaceCard>
            );
          })}
        </View>
        <PrimaryButton variant="soft" icon={completed.prayer ? "check-circle" : "favorite-border"} onPress={() => completeActivity("prayer")} accessibilityLabel="Registrar oração do dia">{completed.prayer ? "Oração registrada hoje" : "Registrar minha oração de hoje"}</PrimaryButton>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 32 },
  introCard: { flexDirection: "row", gap: 11, padding: 16, marginBottom: 15 },
  introText: { flex: 1, fontSize: 14, lineHeight: 21 },
  list: { gap: 9, marginBottom: 17 },
  prayerCard: { padding: 0, overflow: "hidden" },
  prayerHeader: { minHeight: 68, paddingHorizontal: 17, paddingVertical: 13, flexDirection: "row", alignItems: "center" },
  prayerTitleWrap: { flex: 1 },
  prayerTitle: { fontSize: 16, fontFamily: "serif", fontWeight: "700" },
  prayerCategory: { fontSize: 11, marginTop: 4 },
  prayerBody: { borderTopWidth: 1, paddingHorizontal: 17, paddingTop: 14, paddingBottom: 16 },
  prayerText: { fontSize: 15, lineHeight: 24, fontFamily: "serif" },
  inlineAction: { alignSelf: "flex-start", borderRadius: 13, paddingHorizontal: 12, paddingVertical: 9, marginTop: 14, flexDirection: "row", alignItems: "center", gap: 7 },
  inlineActionText: { fontSize: 12, fontWeight: "800" },
});
