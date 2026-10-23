import { useColors } from "@/hooks/use-colors";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { createElement, type ChangeEvent } from "react";

export type DatePickerProps = { visible: boolean; value: Date; onChange: (date: Date) => void; onClose: () => void };

function toInputDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function DatePicker({ visible, value, onChange, onClose }: DatePickerProps) {
  const colors = useColors();
  const input = createElement("input", {
    type: "date",
    value: toInputDate(value),
    max: "2100-12-31",
    "aria-label": "Data da liturgia",
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      const [year, month, day] = event.target.value.split("-").map(Number);
      if (year && month && day) onChange(new Date(year, month - 1, day, 12));
    },
    style: { width: "100%", border: `1px solid ${colors.border}`, borderRadius: 12, padding: "12px 13px", fontSize: 16, color: colors.foreground, background: colors.surface } as React.CSSProperties,
  });
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.backdrop}>
      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>ESCOLHER DATA</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Consultar outra liturgia</Text>
        <View style={styles.inputWrap}>{input}</View>
        <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Concluir escolha da data" style={[styles.done, { backgroundColor: colors.primary }]}><Text style={[styles.doneText, { color: colors.onPrimary }]}>Concluído</Text></Pressable>
      </View>
    </View>
  </Modal>;
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "center", padding: 18, backgroundColor: "#1E101488" },
  sheet: { borderRadius: 24, padding: 20 },
  eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  title: { fontSize: 22, fontFamily: "serif", fontWeight: "700", marginTop: 6, marginBottom: 18 },
  inputWrap: { marginBottom: 14 },
  done: { borderRadius: 13, paddingVertical: 13, alignItems: "center" },
  doneText: { fontSize: 14, fontWeight: "800" },
});
