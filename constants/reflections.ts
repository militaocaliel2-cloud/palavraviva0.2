const REFLECTIONS = [
  { comment: "O Evangelho de hoje convida a desacelerar e perceber onde Deus já está presente no caminho que você percorre.", prompt: "Que pequeno gesto pode tornar sua fé mais concreta hoje?" },
  { comment: "A Palavra não pede uma resposta perfeita; ela abre um espaço de presença, confiança e recomeço.", prompt: "O que você gostaria de entregar a Deus neste momento?" },
  { comment: "Mesmo quando a rotina parece cheia, uma frase do Evangelho pode se tornar uma luz para a próxima decisão.", prompt: "Qual palavra do Evangelho você quer levar para o seu dia?" },
  { comment: "Jesus olha para a vida inteira, inclusive para aquilo que ainda está sendo curado. Permaneça com essa esperança.", prompt: "Onde você precisa praticar mais misericórdia consigo ou com alguém?" },
  { comment: "A leitura de hoje é um convite a transformar escuta em presença: menos pressa, mais atenção ao amor possível.", prompt: "Quem pode receber hoje uma palavra de cuidado através de você?" },
];

export function getGospelReflection(date: Date, reference = "o Evangelho de hoje") {
  const dayNumber = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  const reflection = REFLECTIONS[((dayNumber % REFLECTIONS.length) + REFLECTIONS.length) % REFLECTIONS.length];
  return { ...reflection, reference };
}
