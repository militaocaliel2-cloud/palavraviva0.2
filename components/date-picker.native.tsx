import DateTimePicker from "@react-native-community/datetimepicker";

export type DatePickerProps = { visible: boolean; value: Date; onChange: (date: Date) => void; onClose: () => void };

export function DatePicker({ visible, value, onChange, onClose }: DatePickerProps) {
  if (!visible) return null;
  return <DateTimePicker value={value} mode="date" display="default" maximumDate={new Date(2100, 11, 31)} onChange={(_event, date) => { if (date) onChange(date); onClose(); }} accessibilityLabel="Data da liturgia" />;
}
