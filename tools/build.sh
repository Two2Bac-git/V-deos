#!/usr/bin/env bash
# Build completo de um vídeo: ./tools/build.sh v3 [--vo assets/heygen/v3_vo.wav --vo-at 0]
set -euo pipefail
cd "$(dirname "$0")/.."
V=$1; shift
export NODE_PATH=$(npm root -g)
export FFMPEG=$(.venv/bin/python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
mkdir -p build output/pt
node tools/render.js render/$V.html build/$V
.venv/bin/python tools/audio.py build/$V.meta.json build/$V "$@"
NAME=$(.venv/bin/python -c "import json;print(json.load(open('render/names.json'))['$V'])")
# capa: o quadro mais forte (já assentado) vira o frame 0 — é a miniatura em todas as plataformas.
# Substitui o frame 0 em vez de acrescentar, para manter duração e sincronia de áudio.
POSTER=$(.venv/bin/python -c "import json;p=json.load(open('build/$V.meta.json')).get('poster');print('' if p is None else p)")
if [[ -n "$POSTER" ]]; then
  "$FFMPEG" -y -loglevel error -ss "$POSTER" -i build/$V.video.mp4 -frames:v 1 output/pt/$NAME.capa.jpg
  "$FFMPEG" -y -loglevel error -i build/$V.video.mp4 -i output/pt/$NAME.capa.jpg \
    -filter_complex "[0:v][1:v]overlay=enable='eq(n\,0)'" -c:v libx264 -crf 16 -preset medium -pix_fmt yuv420p build/$V.video.capa.mp4
  mv build/$V.video.capa.mp4 build/$V.video.mp4
fi
"$FFMPEG" -y -loglevel error -i build/$V.video.mp4 -i build/$V.audio.wav \
  -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart output/pt/$NAME.mp4
cp build/$V.srt output/pt/$NAME.srt
echo "pronto: output/pt/$NAME.mp4"
