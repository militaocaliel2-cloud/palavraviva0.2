import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { PrimaryButton, SurfaceCard } from "@/components/palavra-viva-ui";

type LegalSection = { title: string; body: string };

export function LegalPage({ eyebrow, title, updatedAt, sections }: { eyebrow: string; title: string; updatedAt: string; sections: LegalSection[] }) {
  const colors = useColors();
  return <ScreenContainer>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <PrimaryButton variant="soft" icon="arrow-back" onPress={() => router.back()} accessibilityLabel="Voltar">Voltar</PrimaryButton>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.updated, { color: colors.muted }]}>Atualizado em {updatedAt}</Text>
      <SurfaceCard style={styles.notice}><Text style={[styles.noticeText, { color: colors.foreground }]}>Estas informações explicam como o Palavra Viva funciona. O app foi criado para apoiar a oração e a leitura da liturgia, não para substituir orientação pastoral, médica ou jurídica.</Text></SurfaceCard>
      <View style={styles.sections}>{sections.map((section) => <View key={section.title} style={[styles.section, { borderTopColor: colors.border }]}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>{section.title}</Text><Text style={[styles.body, { color: colors.foreground }]}>{section.body}</Text></View>)}</View>
      <Text style={[styles.footer, { color: colors.muted }]}>Palavra Viva · seu caminho diário de fé</Text>
    </ScrollView>
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 34 },
  eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginTop: 26 },
  title: { fontSize: 30, fontFamily: "serif", fontWeight: "700", marginTop: 8 },
  updated: { fontSize: 12, marginTop: 7, marginBottom: 18 },
  notice: { padding: 16, marginBottom: 22 },
  noticeText: { fontSize: 14, lineHeight: 21 },
  sections: { gap: 17 },
  section: { borderTopWidth: 1, paddingTop: 16 },
  sectionTitle: { fontSize: 17, fontWeight: "800", marginBottom: 7 },
  body: { fontSize: 14, lineHeight: 22 },
  footer: { textAlign: "center", fontSize: 12, marginTop: 28 },
});
