import type { LiturgyDay } from "@/lib/liturgy-api";

export type QuizQuestion = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };

export function buildDailyQuiz(liturgy: LiturgyDay): QuizQuestion[] {
  const gospel = liturgy.leituras.evangelho[0];
  const gospelReference = gospel?.referencia || "Evangelho do dia";
  const firstReference = liturgy.leituras.primeiraLeitura[0]?.referencia || "Primeira leitura";
  const color = liturgy.cor || "Tempo comum";
  const colorOptions = [color, "Roxo", "Branco", "Vermelho"].filter((option, index, list) => list.indexOf(option) === index).slice(0, 4);
  while (colorOptions.length < 4) colorOptions.push(["Verde", "Dourado", "Rosa", "Preto"][colorOptions.length - 1]);
  return [
    { id: "gospel-reference", prompt: "Qual é a referência do Evangelho de hoje?", options: [gospelReference, firstReference, "Mt 5, 1-12", "Sl 22(23)"], correctIndex: 0, explanation: `O Evangelho de hoje é apresentado na referência ${gospelReference}.` },
    { id: "liturgical-color", prompt: "Qual é a cor litúrgica celebrada hoje?", options: colorOptions, correctIndex: 0, explanation: `A liturgia de hoje usa a cor ${color}.` },
    { id: "reading-order", prompt: "Qual leitura costuma vir depois da Primeira Leitura?", options: ["Salmo Responsorial", "Evangelho", "Oração da Comunhão", "Reflexão pessoal"], correctIndex: 0, explanation: "O Salmo Responsorial é a resposta orante entre a Primeira Leitura e as leituras seguintes." },
  ];
}
