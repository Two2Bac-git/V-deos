# Ficha de produção — avatares HeyGen

Status (30/09): **bloqueado pela rede do ambiente** (`*.heygen.ai`). Os vídeos já estão montados com
espaço reservado; quando os arquivos chegarem aqui, basta rodar `tools/heygen_prep.sh` e `tools/build.sh`.

Configuração comum a todos os clipes
- Formato vertical 9:16 (1080x1920), idioma português do Brasil, avatares públicas femininas de 30 a 45 anos.
- Tom: conversa de casa, sem ênfase de anúncio. Nada de "oferta imperdível", "corra" etc.
- Postagem: ativar o rótulo "Informação gerada por IA" no Instagram (P0.7). A tag já está queimada na tela.

## V1 — narradora (1 clipe)
Arquivo: `v1_narradora.mp4` → `./tools/heygen_prep.sh v1_narradora.mp4 assets/heygen/v1_narradora`
Fundo: qualquer (aparece recortado em janela). Enquadramento: busto.
Falas, na ordem, com pausas naturais (a edição reajusta os tempos ao áudio real):

| Tempo alvo | Fala |
|---|---|
| 0,2 s | Tá caro comprar picanha? |
| 4,0 s | Aí você volta pra casa com o carrinho vazio. |
| 7,5 s | E se, antes de sair de casa, |
| 10,0 s | você soubesse que o Mercado da Esquina costuma baixar a picanha às sextas? |
| 15,0 s | Aí, sim. |
| 17,0 s | Lê a nota, monta a sua cesta e avisa quando e onde vale comprar. |
| 19,5 s | É isso que a gente está construindo. |
| 23,0 s | Siga @gastepouco e acompanhe. |

## V2 — Ana e Lu (um clipe por fala)
Fundo: **verde chapado #00FF00** (recortado na edição e composto sobre o quintal ilustrado).
Enquadramento: plano médio, cabeça no terço superior. Prep: `./tools/heygen_prep.sh <arquivo> assets/heygen/<nome> --chroma`

| Nome | Quem | Fala |
|---|---|---|
| v2_01_lu | Lu | Nossa, que picanha boa! |
| v2_02_ana | Ana | Né? Quanto você pagou na sua? |
| v2_03_lu | Lu | R$ 139,90 o quilo, no mercado do centro. |
| v2_04_ana | Ana | Essa aqui foi R$ 99,90. |
| v2_05_lu | Lu | Sério? Onde? |
| v2_06_ana | Ana | No Mercado da Esquina. Na sexta costuma baixar. Eu leio o QR code da nota e o app monta a minha cesta. Aí ele compara os mercados que eu uso. |
| v2_07_lu | Lu | Me passa esse app! |
| v2_08_ana | Ana | Tá quase pronto. Segue o @gastepouco. |

Preços falados por extenso no roteiro de voz: "cento e trinta e nove e noventa", "noventa e nove e noventa".

## V3 — narração (só voz)
Mesma voz da narradora do V1 (text-to-speech). Arquivo: `v3_narracao.wav` (48 kHz).

| Tempo alvo | Fala |
|---|---|
| 1,2 s | O mesmo arroz de um quilo… |
| 3,4 s | …custava de quatro e quarenta e nove a oito e noventa e nove na mesma cidade. |
| 7,9 s | Toda compra gera uma nota. |
| 9,9 s | Leia o QR code da nota. |
| 11,9 s | O app monta a cesta que você compra todo mês… |
| 14,4 s | …e compara nos mercados que você usa, |
| 16,9 s | contando até a passagem de ônibus. |
| 19,4 s | Estamos construindo o Gaste Pouco. |
| 23,4 s | Siga @gastepouco e acompanhe. |
