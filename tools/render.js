// Renderiza um vídeo HTML (render/vN.html) quadro a quadro e grava vídeo + metadados.
// Uso: node tools/render.js render/v3.html build/v3 [--fps 30] [--from 0] [--to 28] [--stills 1,5.2]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const [src, outBase] = args;
const fps = +opt('fps', 30);
const FF = process.env.FFMPEG;

(async () => {
  fs.mkdirSync(path.dirname(outBase), { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(src));
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => window.__clipsReady ? window.__clipsReady() : null);
  await p.waitForTimeout(200);
  const meta = await p.evaluate(() => window.__meta());
  fs.writeFileSync(outBase + '.meta.json', JSON.stringify(meta, null, 1));

  const stills = opt('stills');
  if (stills) {
    for (const t of stills.split(',').map(Number)) {
      await p.evaluate(t => window.__seek(t), t);
      await p.screenshot({ path: `${outBase}_t${t.toFixed(2)}.png` });
    }
    await b.close(); return;
  }

  const t0 = +opt('from', 0), t1 = +opt('to', meta.duration);
  const n = Math.round((t1 - t0) * fps);
  const ff = spawn(FF, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', String(fps), outBase + '.video.mp4'],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const started = Date.now();
  for (let i = 0; i < n; i++) {
    await p.evaluate(t => window.__seek(t), t0 + i / fps);
    const buf = await p.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 90 === 0) process.stdout.write(`  quadro ${i}/${n} (${((Date.now() - started) / 1000).toFixed(0)}s)\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await b.close();
  console.log('ok', outBase + '.video.mp4', n, 'quadros');
})();
