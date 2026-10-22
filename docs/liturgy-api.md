# Integração da Liturgia Diária

A fonte pública usada pelo app é a API v2 do projeto `Dancrf/liturgia-diaria`.

- Base diária: `https://liturgia.up.railway.app/v2/`
- Consulta por data: `https://liturgia.up.railway.app/v2/?dia=DD&mes=MM&ano=YYYY`
- Documentação estável v2: `https://github.com/Dancrf/liturgia-diaria/blob/main/docs/v2/README.md`
- README bruto consultado: `https://raw.githubusercontent.com/Dancrf/liturgia-diaria/main/docs/v2/README.md`

A resposta v2 retorna `data`, `liturgia`, `cor`, `oracoes`, `leituras`, `antifonas`. As leituras são arrays e podem conter mais de uma forma ou celebração. O app renderiza todas as entradas de `primeiraLeitura`, `salmo`, `segundaLeitura` e `evangelho`, incluindo `referencia`, `titulo`, `texto` e `refrao`. Quando uma data não possui segunda leitura, a API retorna uma lista vazia ou uma mensagem equivalente.

A API v1 no endpoint raiz foi testada e retornou o dia atual mesmo quando recebeu parâmetros arbitrários. Por isso o app usa v2 para que o seletor de data funcione de fato. O fallback local é usado somente se a consulta do dia atual falhar temporariamente.
