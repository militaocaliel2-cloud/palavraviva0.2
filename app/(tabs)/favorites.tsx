import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";

import { ScreenHeader, SurfaceCard } from "@/components/palavra-viva-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useFaithJourney } from "@/hooks/use-faith-journey";

export default function FavoritesScreen() {
  const colors = useColors();
  const { favorites, toggleFavorite } = useFaithJourney();
  return <ScreenContainer>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <ScreenHeader eyebrow="Guardar para voltar" title="Favoritos" subtitle="Suas leituras e versículos que merecem mais um momento." action={<MaterialIcons name="bookmark" size={30} color={colors.gold} />} />
      {favorites.length === 0 ? <SurfaceCard style={styles.emptyCard}><View style={[styles.emptyIcon, { backgroundColor: colors.primarySoft }]}><MaterialIcons name="bookmark-border" size={27} color={colors.primary} /></View><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Sua coleção começa aqui</Text><Text style={[styles.emptyText, { color: colors.muted }]}>Toque em “Salvar” em uma leitura da Liturgia para criar um lugar de retorno para as palavras que tocaram você.</Text></SurfaceCard> : <View style={styles.list}>{favorites.map((favorite) => <SurfaceCard key={favorite.id} style={styles.favoriteCard}><View style={styles.cardTop}><View style={styles.cardHeading}><Text style={[styles.section, { color: colors.primary }]}>{favorite.section}</Text><Text style={[styles.reference, { color: colors.muted }]}>{favorite.reference || favorite.dateLabel}</Text></View><Pressable onPress={() => toggleFavorite(favorite)} accessibilityRole="button" accessibilityLabel={`Remover ${favorite.title} dos favoritos`}><MaterialIcons name="bookmark" size={22} color={colors.primary} /></Pressable></View><Text style={[styles.title, { color: colors.foreground }]}>{favorite.title}</Text><Text style={[styles.quote, { color: colors.foreground }]}>{favorite.text}</Text><Text style={[styles.date, { color: colors.muted }]}>{favorite.dateLabel}</Text></SurfaceCard>)}</View>}
    </ScrollView>
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 32 },
  emptyCard: { alignItems: "center", padding: 24, marginTop: 8 },
  emptyIcon: { width: 58, height: 58, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 15 },
  emptyTitle: { fontSize: 20, fontFamily: "serif", fontWeight: "700", textAlign: "center" },
  emptyText: { fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 8 },
  list: { gap: 10 },
  favoriteCard: { padding: 16 },
  cardTop: { flexDirection: "row", alignItems: "flex-start" },
  cardHeading: { flex: 1 },
  section: { fontSize: 10, fontWeight: "800", letterSpacing: 1.4, textTransform: "uppercase" },
  reference: { fontSize: 11, marginTop: 4 },
  title: { fontSize: 16, fontWeight: "800", marginTop: 12 },
  quote: { fontSize: 16, lineHeight: 24, fontFamily: "serif", marginTop: 8 },
  date: { fontSize: 11, marginTop: 12 },
});
