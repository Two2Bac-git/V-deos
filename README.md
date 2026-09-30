# Gaste Pouco — Reels/TikTok (campanha orgânica)

Vídeos 9:16 (1080x1920, 30 fps, H.264 + AAC) feitos em código: cada quadro é uma página HTML/CSS
na identidade da marca, capturada no Chromium e codificada no ffmpeg. Sem plataforma paga de motion.

## Estrutura
- `scripts/` — roteiros (v1, v2, v3…) e quadros de estilo
- `render/` — composição de cada vídeo (`v1.html`, `v2.html`, `v3.html`), CSS da marca e motor de animação
- `tools/` — `build.sh` (render + áudio + mux), `render.js`, `audio.py` (SFX sintetizados e .srt), `sheet.py`
- `assets/brand/` — logo (vetor reconstruído da referência), fontes Inter e Familjen Grotesk (OFL)
- `assets/sfx/` — SFX gerados por código (sem licença de terceiros)
- `assets/heygen/` — vídeos/vozes dos avatares (quando baixados)
- `output/pt/` — MP4 finais + legenda .srt

## Build
```
python3 -m venv .venv && .venv/bin/pip install numpy pillow imageio-ffmpeg
./tools/build.sh v3            # gera output/pt/gastepouco_v3_nota-vira-cesta.mp4 e .srt
./tools/build.sh v1 --vo assets/heygen/v1_vo.wav --vo-at 0   # com narração (48 kHz)
```
Requer Node com `playwright` global e Chromium.

## Regras P0 aplicadas
Sem valor/percentual de economia atribuído ao app; selo SIMULAÇÃO / TELA ILUSTRATIVA em toda tela do app;
número real só com fonte na tela; só mercados fictícios; sem Trivago e sem Colosseum; nota fiscal ilustrativa
com QR, CNPJ e CPF borrados; vídeos com avatar HeyGen levam tag de IA na tela e rótulo de IA ao postar.
