# Palavra Viva Web

Aplicativo Web/PWA responsivo de liturgia diária, oração e jornada de fé. O projeto usa Expo Router com exportação estática para navegador. A versão Web preserva a base nativa Expo para uma etapa posterior.

## Executar localmente

```bash
pnpm install --frozen-lockfile
npx expo start --web --port 8081
```

## Gerar a versão de produção

```bash
pnpm install --frozen-lockfile
npx expo export --platform web
```

A saída pronta para hospedagem fica em `dist/`. O diretório `public/` é copiado automaticamente para essa saída e contém o manifesto PWA e o manifesto de rotas.

## Publicar na Vercel

Importe este repositório no painel da Vercel e use a branch `main`. O arquivo `vercel.json` já define as configurações necessárias:

- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `npx expo export --platform web`
- Output Directory: `dist`

Depois do primeiro deploy, cada push na branch `main` cria uma nova publicação automaticamente.

## Recursos Web

A aplicação inclui Liturgia diária completa consultada pela API pública, player de áudio, reflexão, anotações, favoritos, quiz diário, páginas legais, tema claro/escuro, compartilhamento e instalação como PWA. As notificações agendadas dependem do ambiente nativo Expo; no navegador, as preferências são preservadas.
