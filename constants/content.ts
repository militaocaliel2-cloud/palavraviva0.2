export const DAILY_WORD = {
  quote: "Eu sou o caminho, a verdade e a vida.",
  reference: "Jo 14,6",
  reflection: "Hoje, escolha um pequeno passo que aproxime seu coração do que é essencial.",
};

export const LITURGY = {
  dateLabel: "quinta-feira, 22 de outubro de 2026",
  season: "Tempo comum",
  title: "Permanecei em mim",
  gospel: "João 15, 1–8",
  readings: [
    {
      label: "Primeira leitura",
      reference: "Ef 3, 14–21",
      text: "Que Cristo habite pela fé em vossos corações, para que, enraizados e alicerçados no amor, possais compreender a largura, o comprimento, a altura e a profundidade.",
    },
    {
      label: "Salmo",
      reference: "Sl 32(33)",
      text: "Alegrai-vos, justos, no Senhor; aos retos fica bem glorificá-lo. Dai graças ao Senhor ao som da harpa.",
    },
    {
      label: "Evangelho",
      reference: "Jo 15, 1–8",
      text: "Eu sou a videira verdadeira e meu Pai é o agricultor. Permanecei em mim e eu permanecerei em vós. Quem permanece em mim, esse dá muito fruto.",
    },
  ],
};

export type Prayer = {
  id: string;
  title: string;
  category: string;
  text: string;
};

export const PRAYERS: Prayer[] = [
  {
    id: "sinal",
    title: "Sinal da Cruz",
    category: "Para começar",
    text: "Em nome do Pai, do Filho e do Espírito Santo. Amém.",
  },
  {
    id: "creio",
    title: "Creio",
    category: "Profissão de fé",
    text: "Creio em Deus Pai todo-poderoso, criador do céu e da terra; e em Jesus Cristo, seu único Filho, nosso Senhor.",
  },
  {
    id: "pai-nosso",
    title: "Pai Nosso",
    category: "Oração central",
    text: "Pai nosso que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.",
  },
  {
    id: "ave-maria",
    title: "Ave Maria",
    category: "Devoção mariana",
    text: "Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora da nossa morte. Amém.",
  },
  {
    id: "gloria",
    title: "Glória ao Pai",
    category: "Louvor",
    text: "Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.",
  },
  {
    id: "oracao-manha",
    title: "Oração da manhã",
    category: "Começar o dia",
    text: "Senhor, entrego este novo dia em tuas mãos. Dá-me presença para reconhecer o bem, coragem para fazer o que é certo e serenidade para acolher cada encontro.",
  },
  {
    id: "oracao-noite",
    title: "Oração da noite",
    category: "Encerrar o dia",
    text: "Obrigado, Senhor, por tudo o que vivi hoje. Guarda minha noite, acalma meu coração e renova em mim a esperança para amanhã.",
  },
];

export const ROSARY_MYSTERIES = [
  { id: 1, title: "Mistério de abertura", prayer: "Sinal da Cruz e oferecimento do terço." },
  { id: 2, title: "Primeira dezena", prayer: "Contemple este mistério com calma e repita a Ave Maria." },
  { id: 3, title: "Segunda dezena", prayer: "Permaneça na presença de Deus e leve uma intenção." },
  { id: 4, title: "Terceira dezena", prayer: "Respire devagar e deixe a oração encontrar seu ritmo." },
  { id: 5, title: "Quarta dezena", prayer: "Agradeça por uma graça recebida nesta semana." },
  { id: 6, title: "Quinta dezena", prayer: "Conclua com confiança e entregue o dia ao Senhor." },
];
