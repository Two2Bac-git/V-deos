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
"$FFMPEG" -y -loglevel error -i build/$V.video.mp4 -i build/$V.audio.wav \
  -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart output/pt/$NAME.mp4
cp build/$V.srt output/pt/$NAME.srt
echo "pronto: output/pt/$NAME.mp4"
