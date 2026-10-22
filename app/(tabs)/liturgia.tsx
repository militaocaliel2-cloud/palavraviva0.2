import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "expo-router";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { LiturgyAudioPlayer } from "@/components/liturgy-audio-player";
import { PrimaryButton, ScreenHeader, SurfaceCard } from "@/components/palavra-viva-ui";
import { DatePicker } from "@/components/date-picker";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useFaithJourney } from "@/hooks/use-faith-journey";
import { useSpeechPlayer, type SpeechItem } from "@/hooks/use-speech-player";
import { fetchLiturgy, formatReadableDate, type LiturgyDay, type LiturgyReading } from "@/lib/liturgy-api";

const APP_URL = "https://palavra-viva-drab.vercel.app/";

type ReadingSection = { key: string; label: string; readings: LiturgyReading[] };

export default function LiturgyScreen() {
  const colors = useColors();
  const { completed, completeActivity } = useFaithJourney();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [liturgy, setLiturgy] = useState<LiturgyDay | null>(null);
  const [fontScale, setFontScale] = useState(1);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const cardRef = useRef<View>(null);

  const chooseDate = (date: Date) => {
    setLiturgy(null);
    setError("");
    setSelectedDate(date);
  };

  useEffect(() => {
    let active = true;
    // The request lifecycle intentionally resets these indicators when the selected date changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError("");
    fetchLiturgy(selectedDate)
      .then((data) => { if (active) setLiturgy(data); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Não foi possível carregar a liturgia desta data."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [selectedDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (selectedDate.toDateString() === new Date().toDateString() && now.toDateString() !== selectedDate.toDateString()) {
        // The open screen follows the new liturgical day after midnight.
        setLiturgy(null);
        setSelectedDate(now);
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [selectedDate]);

  const sections = useMemo<ReadingSection[]>(() => {
    const readings = liturgy?.leituras;
    return [
      { key: "primeira", label: "Primeira Leitura", readings: readings?.primeiraLeitura ?? [] },
      { key: "salmo", label: "Salmo", readings: readings?.salmo ?? [] },
      { key: "segunda", label: "Segunda Leitura", readings: readings?.segundaLeitura ?? [] },
      { key: "evangelho", label: "Evangelho", readings: readings?.evangelho ?? [] },
    ];
  }, [liturgy]);

  const speechItems = useMemo<SpeechItem[]>(() => sections.flatMap((section) => section.readings.map((reading, index) => ({
    id: `${section.key}-${index}`,
    label: section.label,
    text: [section.label, reading.titulo, reading.referencia, reading.refrao ? `Refrão: ${reading.refrao}` : "", reading.texto].filter(Boolean).join(". "),
  }))), [sections]);
  const audio = useSpeechPlayer(speechItems);
  const stopAudio = audio.stop;
  useFocusEffect(useCallback(() => () => stopAudio(), [stopAudio]));

  const gospel = sections.find((section) => section.key === "evangelho")?.readings[0];
  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const dateLabel = formatReadableDate(selectedDate);

  const moveDate = (amount: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + amount);
    chooseDate(next);
  };

  const shareReading = async (label: string, reading: LiturgyReading) => {
    const content = [
      `Palavra Viva — ${label}`,
      reading.referencia ? `Referência: ${reading.referencia}` : "",
      reading.refrao ? `Refrão: ${reading.refrao}` : "",
      reading.texto ?? "",
      `Leia a liturgia completa: ${APP_URL}`,
    ].filter(Boolean).join("\n\n");
    await Linking.openURL(`https://api.whatsapp.com/send?text=${encodeURIComponent(content)}`);
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    if (Platform.OS === "web") {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current as unknown as HTMLElement, { scale: 2, useCORS: true, backgroundColor: null });
      const link = document.createElement("a");
      link.download = "palavra-viva-evangelho.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      return;
    }
    const uri = await captureRef(cardRef, { format: "png", quality: 1, result: "tmpfile" });
    if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: "Salvar card da Palavra Viva" });
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ScreenHeader eyebrow={liturgy?.cor ? `Cor litúrgica: ${liturgy.cor}` : "Liturgia diária"} title="Liturgia diária" subtitle="A Palavra completa para acompanhar o seu dia." action={<MaterialIcons name="menu-book" size={30} color={colors.gold} />} />

        <SurfaceCard style={styles.dateCard}>
          <View style={styles.dateNavigation}>
            <TextIconButton icon="chevron-left" label="Dia anterior" onPress={() => moveDate(-1)} />
            <Pressable onPress={() => setPickerVisible(true)} accessibilityRole="button" accessibilityLabel="Escolher data da liturgia" style={styles.dateCenter}>
              <Text style={[styles.dateLabel, { color: colors.primary }]}>{isToday ? "HOJE" : "DATA CONSULTADA"}</Text>
              <Text style={[styles.dateTitle, { color: colors.foreground }]}>{dateLabel}</Text>
              <Text style={[styles.dateHint, { color: colors.muted }]}>Toque para escolher outra data</Text>
            </Pressable>
            <TextIconButton icon="chevron-right" label="Próximo dia" onPress={() => moveDate(1)} />
          </View>
          {!isToday ? <PrimaryButton variant="soft" icon="today" onPress={() => chooseDate(new Date())} accessibilityLabel="Voltar para a liturgia de hoje">Voltar para hoje</PrimaryButton> : null}
        </SurfaceCard>

        <DatePicker visible={pickerVisible} value={selectedDate} onChange={chooseDate} onClose={() => setPickerVisible(false)} />

        <LiturgyAudioPlayer supported={audio.supported} isPlaying={audio.isPlaying} isPaused={audio.isPaused} rate={audio.rate} currentLabel={audio.currentLabel} onPlay={audio.playAll} onPause={audio.togglePause} onStop={audio.stop} onRate={audio.setRate} />

        <View style={styles.readingHeader}>
          <Text style={[styles.readingEyebrow, { color: colors.primary }]}>LEITURAS COMPLETAS</Text>
          <View style={[styles.fontControls, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.fontLabel, { color: colors.muted }]}>Fonte</Text>
            <TextIconButton icon="text-decrease" label="Diminuir fonte" onPress={() => setFontScale((value) => Math.max(0.88, value - 0.08))} />
            <Text style={[styles.fontValue, { color: colors.foreground }]}>{fontScale === 1 ? "A" : fontScale > 1 ? "A+" : "A−"}</Text>
            <TextIconButton icon="text-increase" label="Aumentar fonte" onPress={() => setFontScale((value) => Math.min(1.2, value + 0.08))} />
          </View>
        </View>

        {loading ? <View style={styles.loading}><ActivityIndicator color={colors.primary} /><Text style={[styles.loadingText, { color: colors.muted }]}>Buscando a liturgia de {dateLabel}…</Text></View> : null}
        {error ? <SurfaceCard style={styles.errorCard}><MaterialIcons name="cloud-off" size={24} color={colors.error} /><Text style={[styles.errorText, { color: colors.foreground }]}>{error}</Text><PrimaryButton variant="soft" icon="refresh" onPress={() => chooseDate(new Date(selectedDate))}>Tentar novamente</PrimaryButton></SurfaceCard> : null}

        {liturgy ? <>
          <SurfaceCard style={styles.titleCard} accent={colors.gold}>
            <Text style={[styles.liturgyTitle, { color: colors.foreground }]}>{liturgy.liturgia}</Text>
            <Text style={[styles.liturgyReference, { color: colors.primary }]}>{liturgy.data}{liturgy.cor ? ` · ${liturgy.cor}` : ""}</Text>
          </SurfaceCard>

          <View style={styles.readings}>
            {sections.map((section) => {
              const readings = section.readings.length > 0 ? section.readings : [{ texto: "Não há segunda leitura hoje.", referencia: "" }];
              return <View key={section.key} style={styles.sectionGroup}>
                {readings.map((reading, index) => { const speechIndex = speechItems.findIndex((item) => item.id === `${section.key}-${index}`); return <ReadingCard key={`${section.key}-${index}`} section={section.label} reading={reading} fontScale={fontScale} colors={colors} onShare={() => shareReading(section.label, reading)} onListen={speechIndex >= 0 ? () => audio.playItem(speechIndex) : undefined} isListening={speechIndex >= 0 && audio.currentIndex === speechIndex && (audio.isPlaying || audio.isPaused)} onGenerateCard={section.key === "evangelho" ? () => setShareModalVisible(true) : undefined} />; })}
              </View>;
            })}
          </View>

          {liturgy.oracoes ? <SurfaceCard style={styles.prayersCard}><Text style={[styles.prayersTitle, { color: colors.foreground }]}>Orações da celebração</Text>{([['Coleta', liturgy.oracoes.coleta], ['Oferendas', liturgy.oracoes.oferendas], ['Comunhão', liturgy.oracoes.comunhao]] as [string, string | undefined][]).filter((item) => item[1]).map(([label, text]) => <View key={label} style={styles.prayerBlock}><Text style={[styles.prayerLabel, { color: colors.primary }]}>{label}</Text><Text style={[styles.prayerText, { color: colors.foreground, fontSize: 15 * fontScale, lineHeight: 23 * fontScale }]}>{text}</Text></View>)}</SurfaceCard> : null}
        </> : null}

        <PrimaryButton icon={completed.liturgy ? "check-circle" : "done"} onPress={() => completeActivity("liturgy")} accessibilityLabel={completed.liturgy ? "Liturgia marcada como lida" : "Marcar liturgia como lida"}>{completed.liturgy ? "Liturgia lida hoje" : "Marcar como lida"}</PrimaryButton>
      </ScrollView>

      <Modal visible={shareModalVisible} transparent animationType="fade" onRequestClose={() => setShareModalVisible(false)}>
        <View style={[styles.modalBackdrop, { backgroundColor: "#1E1014CC" }]}>
          <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}><View><Text style={[styles.modalEyebrow, { color: colors.primary }]}>PRONTO PARA COMPARTILHAR</Text><Text style={[styles.modalTitle, { color: colors.foreground }]}>Card para Status/Stories</Text></View><Pressable onPress={() => setShareModalVisible(false)} accessibilityRole="button" accessibilityLabel="Fechar prévia"><MaterialIcons name="close" size={24} color={colors.muted} /></Pressable></View>
            <View ref={cardRef} collapsable={false} style={[styles.shareCard, { backgroundColor: colors.primary }]}>
              <View style={styles.shareCardTop}><Text style={styles.shareBrand}>Palavra Viva</Text><Text style={styles.shareMark}>✦</Text></View>
              <Text style={styles.shareDate}>{dateLabel}</Text>
              <View style={styles.shareRule} />
              <Text style={styles.shareLabel}>EVANGELHO</Text>
              <Text style={styles.shareReference}>{gospel?.referencia ?? "Palavra do dia"}</Text>
              <Text style={styles.shareQuote}>{gospel?.texto ?? "A Palavra de Deus ilumina o caminho de hoje."}</Text>
              <View style={styles.shareFooter}><Text style={styles.shareFooterText}>Leia a liturgia completa em</Text><Text style={styles.shareUrl}>palavra-viva-drab.vercel.app</Text></View>
            </View>
            <View style={styles.modalActions}><PrimaryButton variant="outline" onPress={() => setShareModalVisible(false)}>Fechar</PrimaryButton><PrimaryButton icon="download" onPress={downloadCard}>Baixar Imagem</PrimaryButton></View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

function ReadingCard({ section, reading, fontScale, colors, onShare, onListen, isListening, onGenerateCard }: { section: string; reading: LiturgyReading; fontScale: number; colors: ReturnType<typeof useColors>; onShare: () => void; onListen?: () => void; isListening?: boolean; onGenerateCard?: () => void }) {
  return <SurfaceCard style={styles.readingCard}>
    <View style={styles.readingMeta}><View style={styles.readingMetaText}><Text style={[styles.readingLabel, { color: colors.primary }]}>{section}</Text>{reading.titulo ? <Text style={[styles.readingSubtitle, { color: colors.muted }]}>{reading.titulo}</Text> : null}</View><Text style={[styles.readingReference, { color: colors.muted }]}>{reading.referencia}</Text></View>
    {reading.refrao ? <View style={[styles.refrain, { backgroundColor: colors.primarySoft }]}><Text style={[styles.refrainLabel, { color: colors.primary }]}>REFRÃO</Text><Text style={[styles.refrainText, { color: colors.foreground, fontSize: 15 * fontScale, lineHeight: 23 * fontScale }]}>{reading.refrao}</Text></View> : null}
    <Text style={[styles.readingText, { color: colors.foreground, fontSize: 16 * fontScale, lineHeight: 25 * fontScale }]}>{reading.texto ?? "Conteúdo não disponível para esta leitura."}</Text>
    <View style={[styles.shareRow, { borderTopColor: colors.border }]}>{onListen ? <Pressable onPress={onListen} accessibilityRole="button" accessibilityLabel={`${isListening ? "Pausar" : "Ouvir"} ${section}`} style={({ pressed }) => [styles.listenButton, { backgroundColor: colors.primarySoft, opacity: pressed ? 0.7 : 1 }]}><MaterialIcons name={isListening ? "pause" : "volume-up"} size={17} color={colors.primary} /><Text style={[styles.listenButtonText, { color: colors.primary }]}>{isListening ? "Pausar" : "Ouvir"}</Text></Pressable> : null}<Pressable onPress={onShare} accessibilityRole="button" accessibilityLabel={`Compartilhar ${section} no WhatsApp`} style={({ pressed }) => [styles.shareButton, { backgroundColor: `${colors.success}1C`, opacity: pressed ? 0.7 : 1 }]}><MaterialIcons name="share" size={17} color={colors.success} /><Text style={[styles.shareButtonText, { color: colors.success }]}>Compartilhar no WhatsApp</Text></Pressable>{onGenerateCard ? <Pressable onPress={onGenerateCard} accessibilityRole="button" accessibilityLabel="Gerar imagem do Evangelho para Status ou Stories" style={({ pressed }) => [styles.cardButton, { opacity: pressed ? 0.7 : 1 }]}><MaterialIcons name="image" size={17} color={colors.primary} /><Text style={[styles.cardButtonText, { color: colors.primary }]}>Gerar Imagem para Status/Stories</Text></Pressable> : null}</View>
  </SurfaceCard>;
}

function TextIconButton({ icon, label, onPress }: { icon: React.ComponentProps<typeof MaterialIcons>["name"]; label: string; onPress: () => void }) {
  const colors = useColors();
  return <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => [styles.iconButton, { opacity: pressed ? 0.55 : 1 }]}><MaterialIcons name={icon} size={21} color={colors.primary} /></Pressable>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 32 },
  dateCard: { paddingVertical: 13, marginBottom: 22 },
  dateNavigation: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dateCenter: { alignItems: "center", flex: 1, paddingHorizontal: 5 },
  dateLabel: { fontSize: 10, letterSpacing: 1.5, fontWeight: "800" },
  dateTitle: { fontSize: 13, fontWeight: "700", textTransform: "capitalize", marginTop: 5, textAlign: "center" },
  dateHint: { fontSize: 10, marginTop: 3 },
  iconButton: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  readingHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  readingEyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.6 },
  fontControls: { flexDirection: "row", alignItems: "center", borderRadius: 15, borderWidth: 1, paddingVertical: 1, paddingHorizontal: 5 },
  fontLabel: { fontSize: 11, marginHorizontal: 5 },
  fontValue: { fontSize: 14, fontWeight: "800", marginHorizontal: 2 },
  loading: { alignItems: "center", paddingVertical: 26, gap: 10 },
  loadingText: { fontSize: 13 },
  errorCard: { alignItems: "center", gap: 10, marginBottom: 14 },
  errorText: { fontSize: 14, lineHeight: 21, textAlign: "center" },
  titleCard: { padding: 20, marginBottom: 12 },
  liturgyTitle: { fontSize: 24, fontFamily: "serif", fontWeight: "700" },
  liturgyReference: { fontSize: 13, fontWeight: "700", marginTop: 7 },
  readings: { gap: 11, marginBottom: 18 },
  sectionGroup: { gap: 11 },
  readingCard: { padding: 17 },
  readingMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  readingMetaText: { flex: 1, paddingRight: 8 },
  readingLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6 },
  readingSubtitle: { fontSize: 12, marginTop: 4, lineHeight: 17 },
  readingReference: { fontSize: 12, textAlign: "right" },
  readingText: { fontFamily: "serif" },
  refrain: { padding: 12, borderRadius: 13, marginBottom: 12 },
  refrainLabel: { fontSize: 9, fontWeight: "800", letterSpacing: 1.2, marginBottom: 5 },
  refrainText: { fontFamily: "serif", fontWeight: "700" },
  shareRow: { borderTopWidth: 1, marginTop: 16, paddingTop: 12, flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  listenButton: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 9, flexDirection: "row", alignItems: "center", gap: 5 },
  listenButtonText: { fontSize: 11, fontWeight: "800" },
  shareButton: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 9, flexDirection: "row", alignItems: "center", gap: 6 },
  shareButtonText: { fontSize: 11, fontWeight: "800" },
  cardButton: { paddingHorizontal: 9, paddingVertical: 9, flexDirection: "row", alignItems: "center", gap: 5, flexShrink: 1 },
  cardButtonText: { fontSize: 11, fontWeight: "800", flexShrink: 1 },
  prayersCard: { marginBottom: 18 },
  prayersTitle: { fontFamily: "serif", fontSize: 19, fontWeight: "700", marginBottom: 4 },
  prayerBlock: { borderTopWidth: 1, borderTopColor: "#E7DCD0", paddingTop: 13, marginTop: 13 },
  prayerLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 0.7, marginBottom: 6 },
  prayerText: { fontFamily: "serif" },
  modalBackdrop: { flex: 1, justifyContent: "center", padding: 16 },
  modalSheet: { borderRadius: 25, padding: 17, maxHeight: "94%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  modalEyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.3 },
  modalTitle: { fontSize: 21, fontFamily: "serif", fontWeight: "700", marginTop: 4 },
  shareCard: { width: "100%", aspectRatio: 9 / 16, borderRadius: 16, padding: 22, justifyContent: "space-between", overflow: "hidden" },
  shareCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  shareBrand: { color: "#FFF9F1", fontFamily: "serif", fontSize: 20, fontWeight: "700" },
  shareMark: { color: "#E7BC6A", fontSize: 24 },
  shareDate: { color: "#F0D7B7", fontSize: 11, textTransform: "capitalize", marginTop: 12 },
  shareRule: { height: 1, backgroundColor: "#FFFFFF44", marginVertical: 18 },
  shareLabel: { color: "#E7BC6A", fontSize: 10, letterSpacing: 1.7, fontWeight: "800" },
  shareReference: { color: "#FFF9F1", fontFamily: "serif", fontSize: 23, fontWeight: "700", marginTop: 9 },
  shareQuote: { color: "#F9EBDD", fontFamily: "serif", fontSize: 17, lineHeight: 25, marginTop: 16 },
  shareFooter: { borderTopWidth: 1, borderTopColor: "#FFFFFF44", paddingTop: 12 },
  shareFooterText: { color: "#F0D7B7", fontSize: 10 },
  shareUrl: { color: "#FFF9F1", fontSize: 10, fontWeight: "700", marginTop: 3 },
  modalActions: { flexDirection: "row", gap: 9, marginTop: 14 },
});
