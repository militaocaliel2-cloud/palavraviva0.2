import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { buildDailyQuiz, type QuizQuestion } from "@/constants/quiz";
import { PrimaryButton, ScreenHeader, SurfaceCard } from "@/components/palavra-viva-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useFaithJourney } from "@/hooks/use-faith-journey";
import { fetchLiturgy, formatReadableDate, type LiturgyDay } from "@/lib/liturgy-api";

type Colors = ReturnType<typeof useColors>;

export default function QuizScreen() {
  const colors = useColors();
  const { quizResults, saveQuizResult } = useFaithJourney();
  const [liturgy, setLiturgy] = useState<LiturgyDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [today] = useState(() => new Date());
  const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const questions = liturgy ? buildDailyQuiz(liturgy) : [];
  const currentQuestion: QuizQuestion | undefined = questions[questionIndex];
  const savedResult = quizResults[dateKey];

  useEffect(() => {
    let active = true;
    fetchLiturgy(today)
      .then((data) => { if (active) setLiturgy(data); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Não foi possível preparar o quiz de hoje."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [dateKey, today]);

  const answer = () => {
    if (selectedIndex === null || answered || !currentQuestion) return;
    setAnswered(true);
    if (selectedIndex === currentQuestion.correctIndex) setScore((value) => value + 1);
  };

  const next = () => {
    if (!currentQuestion) return;
    const nextScore = score + (selectedIndex === currentQuestion.correctIndex ? 1 : 0);
    if (questionIndex === questions.length - 1) {
      setScore(nextScore);
      saveQuizResult(dateKey, { score: nextScore, total: questions.length, completedAt: new Date().toISOString() });
      setFinished(true);
      return;
    }
    setQuestionIndex((value) => value + 1);
    setSelectedIndex(null);
    setAnswered(false);
  };

  const restart = () => {
    setHasStarted(true);
    setQuestionIndex(0);
    setSelectedIndex(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  const showSavedResult = Boolean(savedResult) && !finished && !hasStarted && questionIndex === 0 && !answered && score === 0;

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ScreenHeader
          eyebrow="Três minutos de presença"
          title="Quiz do dia"
          subtitle="Leia a Liturgia e veja o que ficou no coração."
          action={<Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" style={styles.backButton}><MaterialIcons name="arrow-back" size={24} color={colors.primary} /></Pressable>}
        />
        {loading ? <LoadingState colors={colors} /> : error ? <SurfaceCard style={styles.errorCard}><Text style={[styles.errorText, { color: colors.foreground }]}>{error}</Text></SurfaceCard> : finished || showSavedResult ? <ResultCard colors={colors} score={finished ? score : savedResult?.score ?? 0} total={finished ? questions.length : savedResult?.total ?? questions.length} onRestart={restart} /> : currentQuestion ? <View><View style={styles.progressLine}><Text style={[styles.progressText, { color: colors.primary }]}>PERGUNTA {questionIndex + 1} DE {questions.length}</Text><Text style={[styles.scoreText, { color: colors.muted }]}>Pontuação: {score}</Text></View><Text style={[styles.dateLabel, { color: colors.muted }]}>{formatReadableDate(today)}</Text><SurfaceCard style={styles.questionCard}><Text style={[styles.question, { color: colors.foreground }]}>{currentQuestion.prompt}</Text><View style={styles.options}>{currentQuestion.options.map((option, index) => <QuizOption key={option} option={option} index={index} selectedIndex={selectedIndex} answered={answered} correctIndex={currentQuestion.correctIndex} colors={colors} onSelect={setSelectedIndex} />)}</View>{answered ? <View style={[styles.explanation, { backgroundColor: colors.primarySoft }]}><Text style={[styles.explanationTitle, { color: colors.primary }]}>{selectedIndex === currentQuestion.correctIndex ? "Muito bem." : "Quase lá."}</Text><Text style={[styles.explanationText, { color: colors.foreground }]}>{currentQuestion.explanation}</Text></View> : null}</SurfaceCard><PrimaryButton disabled={selectedIndex === null} onPress={answered ? next : answer}>{answered ? questionIndex === questions.length - 1 ? "Ver meu resultado" : "Próxima pergunta" : "Responder"}</PrimaryButton></View> : null}
      </ScrollView>
    </ScreenContainer>
  );
}

function LoadingState({ colors }: { colors: Colors }) {
  return <View style={styles.loading}><ActivityIndicator color={colors.primary} /><Text style={[styles.loadingText, { color: colors.muted }]}>Preparando as perguntas…</Text></View>;
}

function QuizOption({ option, index, selectedIndex, answered, correctIndex, colors, onSelect }: { option: string; index: number; selectedIndex: number | null; answered: boolean; correctIndex: number; colors: Colors; onSelect: (index: number) => void }) {
  const selected = selectedIndex === index;
  const correct = answered && index === correctIndex;
  const wrong = answered && selected && !correct;
  const fill = correct ? colors.success : wrong ? colors.error : selected ? colors.primary : "transparent";
  const border = correct ? colors.success : wrong ? colors.error : selected ? colors.primary : colors.border;
  return <Pressable disabled={answered} onPress={() => onSelect(index)} accessibilityRole="radio" accessibilityState={{ selected }} style={[styles.option, { backgroundColor: correct ? `${colors.success}18` : wrong ? `${colors.error}18` : selected ? colors.primarySoft : colors.background, borderColor: border }]}><View style={[styles.optionDot, { borderColor: border, backgroundColor: fill }]} /><Text style={[styles.optionText, { color: colors.foreground }]}>{option}</Text></Pressable>;
}

function ResultCard({ colors, score, total, onRestart }: { colors: Colors; score: number; total: number; onRestart: () => void }) {
  return <SurfaceCard style={styles.resultCard}><View style={[styles.resultIcon, { backgroundColor: colors.primarySoft }]}><MaterialIcons name="emoji-events" size={30} color={colors.gold} /></View><Text style={[styles.resultEyebrow, { color: colors.primary }]}>QUIZ CONCLUÍDO</Text><Text style={[styles.resultTitle, { color: colors.foreground }]}>{score} de {total}</Text><Text style={[styles.resultText, { color: colors.muted }]}>Amanhã tem uma nova rodada. Enquanto isso, volte à Liturgia para permanecer com a Palavra.</Text><PrimaryButton icon="refresh" onPress={onRestart}>Refazer quiz</PrimaryButton></SurfaceCard>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 32 },
  backButton: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  loading: { alignItems: "center", paddingVertical: 60, gap: 10 },
  loadingText: { fontSize: 13 },
  errorCard: { padding: 20 },
  errorText: { fontSize: 14, lineHeight: 21, textAlign: "center" },
  progressLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  progressText: { fontSize: 10, fontWeight: "800", letterSpacing: 1.4 },
  scoreText: { fontSize: 12, fontWeight: "700" },
  dateLabel: { fontSize: 12, textTransform: "capitalize", marginBottom: 12 },
  questionCard: { padding: 17, marginBottom: 14 },
  question: { fontSize: 22, fontFamily: "serif", fontWeight: "700", lineHeight: 29, marginBottom: 18 },
  options: { gap: 9 },
  option: { minHeight: 49, borderRadius: 14, borderWidth: 1, paddingHorizontal: 13, flexDirection: "row", alignItems: "center" },
  optionDot: { width: 17, height: 17, borderRadius: 9, borderWidth: 2, marginRight: 10 },
  optionText: { flex: 1, fontSize: 14, lineHeight: 19 },
  explanation: { borderRadius: 13, padding: 12, marginTop: 15 },
  explanationTitle: { fontSize: 12, fontWeight: "800", marginBottom: 4 },
  explanationText: { fontSize: 13, lineHeight: 19 },
  resultCard: { alignItems: "center", padding: 24, marginTop: 12 },
  resultIcon: { width: 64, height: 64, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 15 },
  resultEyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  resultTitle: { fontSize: 34, fontFamily: "serif", fontWeight: "700", marginTop: 5 },
  resultText: { fontSize: 14, lineHeight: 21, textAlign: "center", marginVertical: 12 },
});
