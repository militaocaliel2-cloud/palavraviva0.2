# Plano — Palavra Viva Mobile

## Escopo aprovado

Criar um aplicativo móvel em português do Brasil para tornar a rotina diária de fé do Palavra Viva mais clara, confortável e útil no celular. A experiência preserva a proposta do app publicado de oferecer Palavra do dia, Liturgia, Orações, Terço, Lembretes e acompanhamento da prática diária, com persistência da jornada no banco gerenciado.

## Abordagem de implementação

- Manter o starter Expo Router / React Native / TypeScript / NativeWind fornecido pelo Webdev.
- Usar a rota `(tabs)` como navegação principal com cinco destinos de uso diário: Início, Liturgia, Orações, Terço e Lembretes.
- Centralizar o estado local da jornada em um hook de progresso com `AsyncStorage`, permitindo que a interface seja funcional no Preview e que a estrutura fique pronta para sincronização futura com a tabela Drizzle de jornada.
- Modelar a persistência do servidor com uma tabela `faithJourney` associada a `users`, contendo data do dia, sequência, dias de oração, itens concluídos, preferências de tema e lembretes. O primeiro fluxo não exige login para funcionar localmente.
- Usar conteúdos curados e estáticos para que a navegação seja demonstrável mesmo quando o serviço de liturgia estiver indisponível; a camada de dados pode ser substituída por tRPC sem alterar as telas.
- Implementar controles grandes, `accessibilityRole`, `accessibilityLabel` e feedback visual claro para toque, mantendo orientação retrato e uso com uma mão.
- Usar `expo-notifications` apenas quando disponível no runtime nativo; no Preview Web, os lembretes serão configuráveis como preferências locais sem prometer notificação de sistema.

## Estrutura do projeto

- `app/(tabs)/_layout.tsx`: barra inferior móvel com cinco destinos e ícones.
- `app/(tabs)/index.tsx`: painel diário, Palavra do dia, progresso, sequência e missão do dia.
- `app/(tabs)/liturgia.tsx`: leitura guiada da liturgia com navegação de data e ajuste de fonte.
- `app/(tabs)/prayers.tsx`: lista de orações expansíveis com ação “Rezei hoje”.
- `app/(tabs)/rosary.tsx`: fluxo de terço com mistérios, contador de dezenas e conclusão.
- `app/(tabs)/reminders.tsx`: preferências de horário e dias ativos para lembretes.
- `components/`: cartões, botões, ícones e blocos de conteúdo reutilizáveis.
- `hooks/use-faith-journey.ts`: estado persistido do progresso e ações de conclusão.
- `constants/content.ts`: textos, orações e conteúdo demonstrativo de liturgia/terço.
- `drizzle/schema.ts`: tabelas do usuário e da jornada diária.
- `theme.config.js` e `global.css`: paleta quente do Palavra Viva e tokens de modo escuro.

## Design

### Movimento de design

Minimalismo editorial devocional: a sobriedade de um missal contemporâneo combinada com a clareza de um diário de hábitos mobile.

### Princípios centrais

1. **Acolher antes de instruir:** a primeira tela começa com uma saudação serena e um próximo passo evidente.
2. **Uma ação por vez:** cada cartão apresenta um verbo curto, um estado e um alvo de toque amplo.
3. **Leitura como pausa:** textos longos usam ritmo, largura confortável, contraste e hierarquia tipográfica de leitura.
4. **Progresso sem pressão:** a sequência aparece como incentivo gentil, nunca como gamificação agressiva.

### Filosofia de cor

O vinho profundo preserva a assinatura espiritual do app original e dá peso aos momentos de ação. Creme e areia funcionam como papel de leitura e reduzem a sensação de interface fria. O dourado antigo destaca progresso, ícones e pequenos sinais de presença. No modo escuro, o fundo vira ameixa quase preta e os cartões mantêm contraste quente para continuar parecendo uma página iluminada, não um painel técnico.

### Paradigma de layout

Fluxo vertical de leitura com cabeçalho compacto, um cartão-âncora de destaque e seções empilhadas. A navegação principal fica fixa na borda inferior para que a pessoa troque de área com o polegar sem voltar ao topo. Evitar grades densas; quando houver duas informações lado a lado, usar apenas para métricas curtas.

### Elementos de assinatura

- Cartão “Palavra do dia” com faixa vinho, citação em serif e pequeno marcador dourado.
- Indicador circular de progresso com aro dourado e microcopy de continuidade.
- Cartões de missão com ícones lineares, cantos generosos e estado concluído em verde-sálvia.

### Filosofia de interação

Toques devem responder com leve redução de opacidade e feedback háptico onde o starter permitir. A pessoa sempre deve saber o que foi concluído, o que falta e qual será o resultado do toque. Ações destrutivas não existem no primeiro fluxo; preferências podem ser alteradas sem confirmação.

### Animação

Usar apenas transições curtas e calmas: o progresso preenche em até 220 ms, cartões expansíveis deslizam em 180 ms e a troca de aba não deve criar deslocamentos dramáticos. Respeitar redução de movimento quando disponível e manter conteúdo legível mesmo sem animação.

### Tipografia

Usar sans-serif do sistema para navegação, labels e dados. Usar serif do sistema apenas em citações, títulos de oração e trechos contemplativos. A hierarquia é curta: título de tela 30/36, título de cartão 18/24, corpo 16/25, meta 12/16 em caixa alta com espaçamento.

### Essência da marca

**Palavra Viva é um companheiro diário de oração que transforma intenção em um pequeno caminho praticável.** Sereno, próximo e constante.

### Voz da marca

Headlines são contemplativas e diretas; CTAs usam verbos gentis e concretos. Exemplos: “Um pequeno passo para hoje.” e “Continue de onde você parou.”

### Marca e wordmark

O wordmark usa “Palavra” em serif editorial e “Viva” em vinho, acompanhado de um pequeno ponto dourado que representa a chama da prática diária. O ícone nativo será quadrado, com fundo vinho, uma abertura de vitral dourada e um símbolo de cruz abstrato sem cantos arredondados embutidos.

### Cor proprietária

**Vinho Palavra Viva — `#7B2635`**. É a cor de ação e reconhecimento da marca, usada com parcimônia para que cada chamada importante se destaque.

## Atualização — Liturgia dinâmica e publicação

- A tela canônica é `/liturgia` e consulta `https://liturgia.up.railway.app/v2/?dia=DD&mes=MM&ano=YYYY` com a data selecionada, usando `new Date()` como ponto de partida. A resposta v2 é normalizada para renderizar todas as formas de Primeira Leitura, Salmo, Segunda Leitura e Evangelho; o app preserva um fallback local apenas para indisponibilidade temporária do dia atual.
- Cada leitura possui compartilhamento via `https://api.whatsapp.com/send?text=...`. O Evangelho também abre um modal vertical 9:16; no Web o PNG é gerado com `html2canvas`, e no nativo a captura usa `react-native-view-shot` e o compartilhamento do sistema.
- As páginas `/politica-de-privacidade` e `/termos-de-uso` usam o mesmo componente editorial e ficam ligadas no rodapé da home. O Expo Web recebe `app/+html.tsx`, `public/manifest.json`, ícone de toque, metatags mobile e manifesto de rotas.
