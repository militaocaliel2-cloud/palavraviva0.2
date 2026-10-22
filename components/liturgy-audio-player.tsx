import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { SurfaceCard } from "@/components/palavra-viva-ui";
import { useColors } from "@/hooks/use-colors";

const SPEEDS = [0.75, 1, 1.25, 1.5];

type AudioPlayerProps = {
  supported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  rate: number;
  currentLabel: string;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onRate: (rate: number) => void;
};

export function LiturgyAudioPlayer({ supported, isPlaying, isPaused, rate, currentLabel, onPlay, onPause, onStop, onRate }: AudioPlayerProps) {
  const colors = useColors();
  return <SurfaceCard style={styles.card}>
    <View style={styles.header}><View style={[styles.podcastIcon, { backgroundColor: colors.primarySoft }]}><MaterialIcons name="headphones" size={21} color={colors.primary} /></View><View style={styles.titleBlock}><Text style={[styles.eyebrow, { color: colors.primary }]}>OUVIR COMO PODCAST</Text><Text style={[styles.title, { color: colors.foreground }]}>Liturgia em áudio</Text></View><View style={[styles.liveDot, { backgroundColor: isPlaying ? colors.success : colors.border }]} /></View>
    <Text style={[styles.indicator, { color: colors.muted }]} numberOfLines={1}>{supported ? `${isPlaying || isPaused ? "Lendo" : "Pronto"}: ${currentLabel}` : "Áudio disponível no navegador ou no app nativo"}</Text>
    <View style={styles.controls}><Pressable onPress={isPlaying ? onPause : onPlay} disabled={!supported} accessibilityRole="button" accessibilityLabel={isPlaying ? "Pausar liturgia em áudio" : "Ouvir liturgia em áudio"} style={({ pressed }) => [styles.playButton, { backgroundColor: supported ? colors.primary : colors.border, opacity: pressed ? 0.75 : 1 }]}><MaterialIcons name={isPlaying ? "pause" : "play-arrow"} size={25} color="#FFF9F1" /></Pressable><Pressable onPress={onStop} disabled={!supported} accessibilityRole="button" accessibilityLabel="Parar áudio da liturgia" style={({ pressed }) => [styles.stopButton, { borderColor: colors.border, opacity: pressed ? 0.65 : 1 }]}><MaterialIcons name="stop" size={21} color={colors.primary} /></Pressable><View style={styles.speedGroup}>{SPEEDS.map((speed) => <Pressable key={speed} onPress={() => onRate(speed)} accessibilityRole="button" accessibilityLabel={`Velocidade ${speed} vezes`} style={[styles.speed, { backgroundColor: rate === speed ? colors.primarySoft : "transparent", borderColor: rate === speed ? colors.primary : colors.border }]}><Text style={[styles.speedText, { color: rate === speed ? colors.primary : colors.muted }]}>{speed}x</Text></Pressable>)}</View></View>
  </SurfaceCard>;
}

const styles = StyleSheet.create({
  card: { padding: 15, marginBottom: 18 },
  header: { flexDirection: "row", alignItems: "center" },
  podcastIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  titleBlock: { flex: 1, marginLeft: 10 },
  eyebrow: { fontSize: 9, fontWeight: "800", letterSpacing: 1.3 },
  title: { fontSize: 17, fontWeight: "800", marginTop: 3 },
  liveDot: { width: 9, height: 9, borderRadius: 5 },
  indicator: { fontSize: 12, marginTop: 13 },
  controls: { flexDirection: "row", alignItems: "center", marginTop: 13, gap: 8 },
  playButton: { width: 43, height: 43, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  stopButton: { width: 40, height: 40, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  speedGroup: { flex: 1, flexDirection: "row", justifyContent: "flex-end", gap: 4 },
  speed: { minWidth: 37, borderRadius: 9, borderWidth: 1, paddingVertical: 7, alignItems: "center" },
  speedText: { fontSize: 10, fontWeight: "800" },
});
