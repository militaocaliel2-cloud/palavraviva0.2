import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { LITURGY } from "@/constants/content";
import { PrimaryButton, ScreenHeader, SurfaceCard } from "@/components/palavra-viva-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useFaithJourney } from "@/hooks/use-faith-journey";

export default function LiturgyScreen() {
  const colors = useColors();
  const { completed, completeActivity } = useFaithJourney();
  const [fontScale, setFontScale] = useState(1);
  const [dayOffset, setDayOffset] = useState(0);
  const isRead = completed.liturgy;

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ScreenHeader eyebrow={LITURGY.season} title="Liturgia diária" subtitle="Uma pausa para escutar a Palavra com calma." action={<MaterialIcons name="menu-book" size={30} color={colors.gold} />} />

        <SurfaceCard style={styles.dateCard}>
          <View style={styles.dateNavigation}>
            <IconButton icon="chevron-left" label="Dia anterior" onPress={() => setDayOffset((value) => value - 1)} />
            <View style={styles.dateCenter}>
              <Text style={[styles.dateLabel, { color: colors.muted }]}>{dayOffset === 0 ? "HOJE" : `${Math.abs(dayOffset)} ${Math.abs(dayOffset) === 1 ? "DIA" : "DIAS"} ATRÁS`}</Text>
              <Text style={[styles.dateTitle, { color: colors.foreground }]}>{LITURGY.dateLabel}</Text>
            </View>
            <IconButton icon="chevron-right" label="Próximo dia" onPress={() => setDayOffset((value) => value + 1)} />
          </View>
          {dayOffset !== 0 ? <PrimaryButton variant="soft" icon="today" onPress={() => setDayOffset(0)} accessibilityLabel="Voltar para hoje">Voltar para hoje</PrimaryButton> : null}
        </SurfaceCard>

        <View style={styles.readingHeader}>
          <Text style={[styles.readingEyebrow, { color: colors.primary }]}>LEITURA DO DIA</Text>
          <View style={[styles.fontControls, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.fontLabel, { color: colors.muted }]}>Fonte</Text>
            <IconButton icon="text-decrease" label="Diminuir fonte" onPress={() => setFontScale((value) => Math.max(0.88, value - 0.08))} />
            <Text style={[styles.fontValue, { color: colors.foreground }]}>{fontScale === 1 ? "A" : fontScale > 1 ? "A+" : "A−"}</Text>
            <IconButton icon="text-increase" label="Aumentar fonte" onPress={() => setFontScale((value) => Math.min(1.2, value + 0.08))} />
          </View>
        </View>

        <SurfaceCard style={styles.titleCard} accent={colors.gold}>
          <Text style={[styles.liturgyTitle, { color: colors.foreground }]}>{LITURGY.title}</Text>
          <Text style={[styles.liturgyReference, { color: colors.primary }]}>{LITURGY.gospel}</Text>
        </SurfaceCard>

        <View style={styles.readings}>
          {LITURGY.readings.map((reading) => (
            <SurfaceCard key={reading.label} style={styles.readingCard}>
              <View style={styles.readingMeta}>
                <Text style={[styles.readingLabel, { color: colors.primary }]}>{reading.label}</Text>
                <Text style={[styles.readingReference, { color: colors.muted }]}>{reading.reference}</Text>
              </View>
              <Text style={[styles.readingText, { color: colors.foreground, fontSize: 16 * fontScale, lineHeight: 25 * fontScale }]}>{reading.text}</Text>
            </SurfaceCard>
          ))}
        </View>

        <PrimaryButton icon={isRead ? "check-circle" : "done"} onPress={() => completeActivity("liturgy")} accessibilityLabel={isRead ? "Liturgia marcada como lida" : "Marcar liturgia como lida"}>
          {isRead ? "Liturgia lida hoje" : "Marcar como lida"}
        </PrimaryButton>
      </ScrollView>
    </ScreenContainer>
  );
}

function IconButton({ icon, label, onPress }: { icon: React.ComponentProps<typeof MaterialIcons>["name"]; label: string; onPress: () => void }) {
  const colors = useColors();
  return (
    <MaterialIcons.Button name={icon} size={21} color={colors.primary} backgroundColor="transparent" underlayColor={colors.primarySoft} onPress={onPress} accessibilityLabel={label} style={{ margin: 0, padding: 0 }} />
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 32 },
  dateCard: { paddingVertical: 13, marginBottom: 22 },
  dateNavigation: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dateCenter: { alignItems: "center", flex: 1 },
  dateLabel: { fontSize: 10, letterSpacing: 1.5, fontWeight: "800" },
  dateTitle: { fontSize: 13, fontWeight: "700", textTransform: "capitalize", marginTop: 5, textAlign: "center" },
  readingHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  readingEyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.6 },
  fontControls: { flexDirection: "row", alignItems: "center", borderRadius: 15, borderWidth: 1, paddingVertical: 1, paddingHorizontal: 5 },
  fontLabel: { fontSize: 11, marginHorizontal: 5 },
  fontValue: { fontSize: 14, fontWeight: "800", marginHorizontal: 2 },
  titleCard: { padding: 20, marginBottom: 12 },
  liturgyTitle: { fontSize: 24, fontFamily: "serif", fontWeight: "700" },
  liturgyReference: { fontSize: 13, fontWeight: "700", marginTop: 7 },
  readings: { gap: 11, marginBottom: 18 },
  readingCard: { padding: 17 },
  readingMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  readingLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6 },
  readingReference: { fontSize: 12 },
  readingText: { fontFamily: "serif" },
});
