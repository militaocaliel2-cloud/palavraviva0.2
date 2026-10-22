# TODO — Palavra Viva Mobile

## Painel diário com Palavra do dia e missão de hoje

- [x] A tela inicial apresenta uma Palavra do dia em português do Brasil, uma saudação curta, progresso de hoje, dias seguidos e dias de oração.
- [x] A tela inicial apresenta uma missão diária com acesso direto para Liturgia, Orações e Terço.
- [x] A pessoa consegue marcar atividades como concluídas e o progresso visual do dia é atualizado imediatamente.
- [x] A interface prioriza orientação retrato, uso com uma mão, alvos de toque amplos e leitura confortável.

## Navegação móvel principal

- [x] A barra inferior oferece acesso direto a Início, Liturgia, Orações, Terço e Lembretes.
- [x] Cada destino tem título, ícone, estado ativo visível e rótulo acessível.
- [x] A navegação permanece utilizável em telas estreitas e respeita áreas seguras do dispositivo.

## Liturgia diária

- [x] A área de Liturgia apresenta o conteúdo em blocos de leitura clara e confortável no celular.
- [x] A pessoa consegue alternar o dia, voltar para Hoje e aumentar ou reduzir a fonte.
- [x] A pessoa consegue marcar a liturgia como lida, atualizando o progresso diário.

## Orações e acompanhamento

- [x] A área de Orações oferece acesso simples a orações conhecidas e orações da manhã/noite.
- [x] As orações são expansíveis sem navegação profunda e o texto usa largura e espaçamento adequados.
- [x] A ação “Rezei hoje” marca a prática e atualiza dias de oração e progresso quando aplicável.

## Terço guiado

- [x] A área de Terço indica claramente o mistério atual, o avanço da dezena e o total de etapas.
- [x] A pessoa consegue avançar, voltar e concluir o terço com controles acessíveis.
- [x] A conclusão do terço atualiza a missão diária sem exigir login.

## Lembretes e preferências

- [x] A área de Lembretes permite configurar horário, dias ativos e ativar/desativar a rotina.
- [x] No Preview Web, a configuração é persistida localmente sem prometer notificação de sistema.
- [x] O estado dos lembretes e preferências de tema continua entre sessões no mesmo dispositivo.

## Tema, acessibilidade e continuidade

- [x] Existe modo claro e escuro com contraste suficiente e identidade visual consistente.
- [x] Botões e controles possuem rótulos acessíveis, estados selecionados e feedback visual claro.
- [x] O progresso, sequência, dias de oração, itens concluídos e preferências são persistidos localmente e têm estrutura de dados pronta para sincronização no banco gerenciado.
- [x] Os ícones nativos e assets de marca usam uma identidade quadrada própria do Palavra Viva.


## Liturgia Diária dinâmica e completa

- [x] A Liturgia Diária é buscada dinamicamente da API pública `https://liturgia.up.railway.app/v2/` usando `new Date()` e os parâmetros `dia`, `mes` e `ano`, atualizando automaticamente o conteúdo a cada dia.
- [x] As leituras completas aparecem na tela, incluindo Primeira Leitura, Salmo com refrão, Segunda Leitura quando houver e Evangelho, suportando múltiplas formas retornadas pela API.
- [x] Quando a API do dia atual estiver temporariamente indisponível, o app mantém uma experiência de fallback sem quebrar a tela; datas consultadas sem conteúdo exibem uma mensagem clara.

## Compartilhamento da Liturgia

- [x] Cada card de leitura apresenta o botão “Compartilhar no WhatsApp”, abrindo `api.whatsapp.com/send` com título/referência, trecho ou refrão e o link do app no final.
- [x] O card do Evangelho apresenta “Gerar Imagem para Status/Stories” e abre um modal com prévia 9:16 contendo Palavra Viva, data, referência/trecho e URL do app.
- [x] O modal oferece “Baixar Imagem” para gerar um PNG no Web e abrir o compartilhamento/salvamento nativo no celular.

## UX, lojas e presença Web

- [x] A página `/liturgia` oferece controles A−/A+, seletor de data, navegação por dias e retorno para Hoje.
- [x] O app oferece modo claro/escuro persistente, com acessibilidade nos botões e estados selecionados visíveis.
- [x] Existem as páginas `/politica-de-privacidade` e `/termos-de-uso`, com links acessíveis a partir do app.
- [x] O Expo Web possui meta tags mobile, ícone de toque iOS/Android, `manifest.json`, modo standalone e orientação retrato.


## Player de áudio da Liturgia

- [x] A página `/liturgia` usa a Web Speech API no Web, com idioma `pt-BR`, e fallback `expo-speech` no app nativo.
- [x] O player lê em sequência Primeira Leitura, Salmo Responsorial, Segunda Leitura quando houver e Evangelho do Dia.
- [x] O player oferece Play/Pause, Stop, velocidades 0.75x, 1x, 1.25x e 1.5x e indicador do trecho atual.
- [x] Cada card de leitura oferece um botão individual “Ouvir”, com pausa/retomada do trecho selecionado.
- [x] O áudio é cancelado ao pausar, parar, trocar de leitura, trocar de data, sair da aba ou desmontar a tela.

## Palavra do Dia dinâmica

- [x] A tela Início escolhe a Palavra do Dia conforme a data local atual e atualiza automaticamente na virada do dia.


## Reflexão e comentários do Evangelho

- [x] A página `/liturgia` exibe uma reflexão diária contextual para o Evangelho, com uma pergunta de oração e campo de anotação pessoal por data.
- [x] As anotações da reflexão ficam persistidas localmente e reaparecem quando o usuário retorna à mesma data.

## Favoritos

- [x] Cada leitura da Liturgia possui ação “Salvar”/“Salvo” para guardar leituras e versículos preferidos.
- [x] A aba `/favorites` lista os favoritos persistidos, permite removê-los e oferece estado vazio orientando o usuário.

## Notificações diárias

- [x] A tela de Lembretes agenda notificações locais nativas da Liturgia nos dias e horário escolhidos, pedindo permissão ao salvar.
- [x] O app cancela e recria os agendamentos ao salvar novas preferências; quando a permissão é negada, exibe uma orientação para os ajustes do aparelho.
