#!/usr/bin/env bash
# Prepara um MP4 do HeyGen para a edição.
#   ./tools/heygen_prep.sh entrada.mp4 assets/heygen/v2_lu   [--chroma]
# Gera <saida>.wav (voz, 48 kHz) e o vídeo: <saida>.mp4 (cópia) ou, com --chroma,
# <saida>.webm com transparência (fundo verde #00FF00 recortado) para compor sobre o cenário.
set -euo pipefail
cd "$(dirname "$0")/.."
IN=$1; OUT=$2; FF=$(.venv/bin/python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
mkdir -p "$(dirname "$OUT")"
"$FF" -y -loglevel error -i "$IN" -vn -ac 2 -ar 48000 -c:a pcm_s16le "$OUT.wav"
if [[ "$IN" == *.webm ]]; then
  # já vem com transparência do HeyGen (outputFormat webm): só copia
  cp "$IN" "$OUT.webm"; echo "ok $OUT.webm $OUT.wav"
elif [[ "${3:-}" == "--chroma" ]]; then
  "$FF" -y -loglevel error -i "$IN" -an -vf "chromakey=0x00FF00:0.16:0.08,despill=type=green" \
    -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 4M -auto-alt-ref 0 "$OUT.webm"
  echo "ok $OUT.webm $OUT.wav"
else
  "$FF" -y -loglevel error -i "$IN" -an -c:v libx264 -crf 16 -pix_fmt yuv420p "$OUT.mp4"
  echo "ok $OUT.mp4 $OUT.wav"
fi
