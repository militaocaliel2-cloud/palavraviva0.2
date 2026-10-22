import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import { ScreenHeader, SurfaceCard } from "@/components/palavra-viva-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useFaithJourney } from "@/hooks/use-faith-journey";
import { syncDailyLiturgyNotifications } from "@/lib/liturgy-notifications";

const DAYS = [{ label: "D", name: "Domingo", value: 0 }, { label: "S", name: "Segunda", value: 1 }, { label: "T", name: "Terça", value: 2 }, { label: "Q", name: "Quarta", value: 3 }, { label: "Q", name: "Quinta", value: 4 }, { label: "S", name: "Sexta", value: 5 }, { label: "S", name: "Sábado", value: 6 }];
const TIMES = ["06:30", "07:30", "12:00", "20:30"];

export default function RemindersScreen() {
  const colors = useColors();
  const { reminderEnabled, reminderTime, reminderDays, setReminderSettings } = useFaithJourney();
  const [savedMessage, setSavedMessage] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const savePreferences = async () => {
    const result = await syncDailyLiturgyNotifications({ enabled: reminderEnabled, time: reminderTime, days: reminderDays });
    setSavedMessage(true);
    setNotificationMessage(!result.supported ? "Salvo neste dispositivo. O agendamento do sistema funciona no app nativo." : result.granted ? "Notificação diária agendada." : "Permissão de notificação não concedida. Você pode ativá-la nos ajustes do aparelho.");
  };

  const toggleDay = (day: number) => {
    const nextDays = reminderDays.includes(day) ? reminderDays.filter((item) => item !== day) : [...reminderDays, day].sort();
    setReminderSettings({ reminderDays: nextDays });
    setSavedMessage(false);
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ScreenHeader eyebrow="Uma lembrança gentil" title="Lembretes" subtitle="Escolha quando a sua rotina pode encontrar você." action={<MaterialIcons name="notifications-none" size={30} color={colors.gold} />} />
        <SurfaceCard style={styles.statusCard}>
          <View style={styles.statusIcon}><MaterialIcons name={reminderEnabled ? "notifications-active" : "notifications-off"} size={24} color={reminderEnabled ? colors.primary : colors.muted} /></View>
          <View style={styles.statusText}><Text style={[styles.statusTitle, { color: colors.foreground }]}>{reminderEnabled ? "Lembrete ativo" : "Lembrete pausado"}</Text><Text style={[styles.statusCaption, { color: colors.muted }]}>{reminderEnabled ? `Todos os dias às ${reminderTime}` : "Ative quando quiser retomar seu ritmo."}</Text></View>
          <Switch value={reminderEnabled} onValueChange={(value) => { setReminderSettings({ reminderEnabled: value }); setSavedMessage(false); }} trackColor={{ false: colors.border, true: `${colors.primary}88` }} thumbColor={reminderEnabled ? colors.primary : colors.muted} accessibilityLabel="Ativar ou pausar lembrete" />
        </SurfaceCard>

        <Text style={[styles.sectionLabel, { color: colors.primary }]}>HORÁRIO</Text>
        <SurfaceCard style={styles.timeCard}>
          <View style={styles.timeIntro}><MaterialIcons name="schedule" size={22} color={colors.gold} /><Text style={[styles.timeIntroText, { color: colors.foreground }]}>Um toque para lembrar que hoje também pode ter espaço para oração.</Text></View>
          <View style={styles.timeOptions}>{TIMES.map((time) => <Pressable key={time} onPress={() => { setReminderSettings({ reminderTime: time }); setSavedMessage(false); }} accessibilityRole="radio" accessibilityState={{ selected: reminderTime === time }} accessibilityLabel={`Escolher ${time}`} style={[styles.timeOption, { backgroundColor: reminderTime === time ? colors.primary : colors.background, borderColor: reminderTime === time ? colors.primary : colors.border }]}><Text style={[styles.timeText, { color: reminderTime === time ? "#FFF9F1" : colors.foreground }]}>{time}</Text></Pressable>)}</View>
        </SurfaceCard>

        <Text style={[styles.sectionLabel, { color: colors.primary }]}>DIAS DA SEMANA</Text>
        <SurfaceCard style={styles.daysCard}>
          <View style={styles.daysRow}>{DAYS.map((day) => { const active = reminderDays.includes(day.value); return <Pressable key={day.value} onPress={() => toggleDay(day.value)} accessibilityRole="checkbox" accessibilityState={{ checked: active }} accessibilityLabel={day.name} style={[styles.dayItem, { backgroundColor: active ? colors.primarySoft : colors.background, borderColor: active ? colors.primary : colors.border }]}><Text style={[styles.dayLabel, { color: active ? colors.primary : colors.muted }]}>{day.label}</Text></Pressable>; })}</View>
          <Text style={[styles.daysCaption, { color: colors.muted }]}>{reminderDays.length === 7 ? "Todos os dias" : `${reminderDays.length} ${reminderDays.length === 1 ? "dia escolhido" : "dias escolhidos"}`}</Text>
        </SurfaceCard>

        <View style={[styles.note, { backgroundColor: colors.primarySoft }]}><MaterialIcons name="info-outline" size={18} color={colors.primary} /><Text style={[styles.noteText, { color: colors.foreground }]}>No Preview, sua preferência fica salva neste dispositivo. No app nativo, o botão abaixo pede permissão e agenda o aviso nos dias escolhidos.</Text></View>
        {notificationMessage ? <Text style={[styles.notificationMessage, { color: colors.primary }]}>{notificationMessage}</Text> : null}
        <Pressable onPress={() => void savePreferences()} accessibilityRole="button" accessibilityLabel="Salvar preferências e agendar notificações" style={({ pressed }) => [styles.saveButton, { backgroundColor: colors.primary, opacity: pressed ? 0.75 : 1 }]}><Text style={styles.saveText}>{savedMessage ? "Preferências salvas" : "Salvar preferências"}</Text><MaterialIcons name={savedMessage ? "check" : "arrow-forward"} size={20} color="#FFF9F1" /></Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 32 },
  statusCard: { flexDirection: "row", alignItems: "center", padding: 15, marginBottom: 24 },
  statusIcon: { width: 48, height: 48, borderRadius: 17, backgroundColor: "#F2E0D8", alignItems: "center", justifyContent: "center" },
  statusText: { flex: 1, marginHorizontal: 12 },
  statusTitle: { fontSize: 16, fontWeight: "800" },
  statusCaption: { fontSize: 12, marginTop: 4 },
  sectionLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1.6, marginBottom: 9 },
  timeCard: { marginBottom: 22 },
  timeIntro: { flexDirection: "row", alignItems: "flex-start", gap: 9 },
  timeIntroText: { flex: 1, fontFamily: "serif", fontSize: 16, lineHeight: 22 },
  timeOptions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 17 },
  timeOption: { borderWidth: 1, borderRadius: 13, paddingVertical: 11, paddingHorizontal: 17 },
  timeText: { fontSize: 14, fontWeight: "800" },
  daysCard: { marginBottom: 22 },
  daysRow: { flexDirection: "row", justifyContent: "space-between" },
  dayItem: { width: 36, height: 42, borderRadius: 13, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  dayLabel: { fontSize: 14, fontWeight: "800" },
  daysCaption: { fontSize: 12, marginTop: 13, textAlign: "center" },
  note: { flexDirection: "row", gap: 9, padding: 13, borderRadius: 15, marginBottom: 17 },
  noteText: { flex: 1, fontSize: 12, lineHeight: 18 },
  notificationMessage: { fontSize: 12, lineHeight: 18, textAlign: "center", marginBottom: 11 },
  saveButton: { minHeight: 52, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  saveText: { color: "#FFF9F1", fontSize: 15, fontWeight: "800" },
});
