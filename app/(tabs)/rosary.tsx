import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ROSARY_MYSTERIES } from "@/constants/content";
import { PrimaryButton, ProgressRing, ScreenHeader, SurfaceCard } from "@/components/palavra-viva-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useFaithJourney } from "@/hooks/use-faith-journey";

export default function RosaryScreen() {
  const colors = useColors();
  const { completed, rosaryStep, setRosaryStep, resetRosary, completeActivity } = useFaithJourney();
  const mystery = ROSARY_MYSTERIES[Math.min(rosaryStep, ROSARY_MYSTERIES.length - 1)];
  const isFinished = rosaryStep >= ROSARY_MYSTERIES.length;

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ScreenHeader eyebrow="Respirar e permanecer" title="Terço" subtitle="Um passo de cada vez, sem pressa." action={<MaterialIcons name="radio-button-checked" size={30} color={colors.gold} />} />
        <SurfaceCard style={[styles.rosaryCard, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
          <View style={styles.rosaryTop}><View><Text style={styles.rosaryLabel}>CAMINHO DE ORAÇÃO</Text><Text style={[styles.rosaryTitle, { color: colors.onPrimary }]}>{isFinished ? "Terço concluído" : mystery.title}</Text></View><ProgressRing progress={rosaryStep / ROSARY_MYSTERIES.length} size={74} /></View>
          <Text style={[styles.rosaryPrayer, { color: colors.onPrimary }]}>{isFinished ? "Que a paz desta oração acompanhe o restante do seu dia." : mystery.prayer}</Text>
          <View style={styles.stepTrack}>{ROSARY_MYSTERIES.map((step) => <View key={step.id} style={[styles.stepDot, { backgroundColor: step.id <= rosaryStep ? colors.gold : "#FFFFFF55" }]} />)}</View>
          <Text style={[styles.stepCaption, { color: colors.onPrimary }]}>{isFinished ? "6 de 6 momentos concluídos" : `${rosaryStep} de ${ROSARY_MYSTERIES.length} momentos concluídos`}</Text>
        </SurfaceCard>

        {!isFinished ? <SurfaceCard style={styles.intentionCard} accent={colors.gold}><Text style={[styles.intentionEyebrow, { color: colors.primary }]}>INTENÇÃO DE HOJE</Text><Text style={[styles.intentionText, { color: colors.foreground }]}>Por quem ou por qual situação você deseja rezar?</Text><View style={[styles.line, { borderBottomColor: colors.border }]} /></SurfaceCard> : null}

        <View style={styles.actions}>
          {!isFinished && rosaryStep > 0 ? <PrimaryButton variant="outline" icon="arrow-back" onPress={() => setRosaryStep(rosaryStep - 1)} accessibilityLabel="Voltar uma etapa">Voltar</PrimaryButton> : null}
          {!isFinished ? <PrimaryButton icon="arrow-forward" onPress={() => { const next = rosaryStep + 1; setRosaryStep(next); if (next >= ROSARY_MYSTERIES.length) completeActivity("rosary"); }} accessibilityLabel="Avançar no terço">{rosaryStep === 0 ? "Começar" : "Avançar"}</PrimaryButton> : null}
        </View>
        {isFinished || completed.rosary ? <View style={[styles.doneBanner, { backgroundColor: `${colors.success}20` }]}><MaterialIcons name="check-circle" size={23} color={colors.success} /><View style={{ flex: 1 }}><Text style={[styles.doneTitle, { color: colors.success }]}>Sua oração foi acolhida.</Text><Text style={[styles.doneCaption, { color: colors.muted }]}>O terço entrou na missão de hoje.</Text></View><Pressable onPress={resetRosary} accessibilityRole="button" accessibilityLabel="Rezar o terço novamente"><Text style={[styles.restart, { color: colors.primary }]}>Recomeçar</Text></Pressable></View> : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 32 },
  rosaryCard: { padding: 20, marginBottom: 13 },
  rosaryTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rosaryLabel: { color: "#E8C98B", fontSize: 10, fontWeight: "800", letterSpacing: 1.7 },
  rosaryTitle: { fontFamily: "serif", fontSize: 26, fontWeight: "700", marginTop: 10, maxWidth: 200 },
  rosaryPrayer: { fontSize: 15, lineHeight: 23, marginTop: 20 },
  stepTrack: { flexDirection: "row", gap: 6, marginTop: 22 },
  stepDot: { height: 6, borderRadius: 6, flex: 1 },
  stepCaption: { fontSize: 12, marginTop: 8 },
  intentionCard: { padding: 18, marginBottom: 17 },
  intentionEyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  intentionText: { fontFamily: "serif", fontSize: 18, lineHeight: 25, marginTop: 9 },
  line: { borderBottomWidth: 1, marginTop: 22 },
  actions: { flexDirection: "row", gap: 9, marginBottom: 15 },
  doneBanner: { padding: 14, borderRadius: 17, flexDirection: "row", alignItems: "center", gap: 10 },
  doneTitle: { fontSize: 14, fontWeight: "800" },
  doneCaption: { fontSize: 12, marginTop: 3 },
  restart: { fontSize: 12, fontWeight: "800" },
});
