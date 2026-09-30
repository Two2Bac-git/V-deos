# Ficha de produção — avatares HeyGen

Status (30/09): **gerado no HeyGen pelo MCP**; o download direto segue bloqueado pela rede do ambiente
(`*.heygen.ai`). Os arquivos devem ser baixados no HeyGen, renomeados como abaixo e enviados ao Drive;
daqui eles são puxados pelo conector do Drive, tratados com `tools/heygen_prep.sh` e montados com `tools/build.sh`.

Elenco: V1 narradora = Stephanie (voz Sofia Brazil – Friendly) · V2 Ana = Jeyla (voz Ana Carvalho – Friendly),
V2 Lu = Stephanie (voz Sofia Brazil – Friendly) · V3 = voz Aida (sem personagem em tela).

**Versão atual: Avatar V** (motor `avatar_v`, direção de atuação por fala em `motionPrompt`, WebM transparente).
A geração anterior (Avatar IV, sorriso fixo) foi descartada.

| Arquivo final | Título no HeyGen | video_id | Direção |
|---|---|---|---|
| v1_narradora.webm | Gaste Pouco — V1 narradora (Stephanie) — Avatar V | eae6bc84f2ebf1700a3174211435eff1 | conversa natural, rosto neutro nas pausas, preocupação → curiosidade → sorriso só no fim |
| v2_01_lu.webm | Gaste Pouco — V2 01 Lu (Stephanie) — Avatar V | 9c851797f12807f00636d485476a2391 | provou a picanha: olhos fecham de prazer, aceno |
| v2_02_ana.webm | Gaste Pouco — V2 02 Ana (Jeyla) — Avatar V | ec0cf75f3b8688cac4bfc9441e076264 | concorda e pergunta, cabeça inclinada |
| v2_03_lu.webm | Gaste Pouco — V2 03 Lu (Stephanie) — Avatar V | 2103dd4b917062c863f34c3fd271096b | resignada, dá de ombros, sem sorriso |
| v2_04_ana.webm | Gaste Pouco — V2 04 Ana (Jeyla) — Avatar V | 29e76b8c90d8a51e4ef58d0f4bd485ca | modesta, sorriso contido, sem se gabar |
| v2_05_lu.webm | Gaste Pouco — V2 05 Lu (Stephanie) — Avatar V | da1c1e835dd0b24363c1f3eabb0c6a33 | surpresa: sobrancelhas altas, inclina para frente |
| v2_06_ana.webm | Gaste Pouco — V2 06 Ana (Jeyla) — Avatar V | c2764b9176738c5cffc4aaa8851223ac | explica com calma, pausas, gestos leves |
| v2_07_lu.webm | Gaste Pouco — V2 07 Lu (Stephanie) — Avatar V | cb368dd0f1ca8ac2c54f6dc3f931aec0 | animada, ri, estende a mão pedindo o celular |
| v2_08_ana.webm | Gaste Pouco — V2 08 Ana (Jeyla) — Avatar V | 42808f0bc93dc007e5327f7707c0e676 | calorosa, sorriso genuíno que assenta |
| v3_narracao.wav | (text-to-speech; link em `v3_narracao.timing.json`) | — | voz Aida |

Os clipes do V2 saem em WebM com transparência (sem fundo): entram direto sobre o quintal ilustrado.

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
