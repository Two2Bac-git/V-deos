"""Folha de contato de stills: python tools/sheet.py saida.png a.png b.png ..."""
import sys
from PIL import Image, ImageDraw
out, fs = sys.argv[1], sys.argv[2:]
W, H, C = 360, 640, 4
rows = (len(fs) + C - 1) // C
sh = Image.new('RGB', (W * C, (H + 30) * rows), (80, 80, 80)); d = ImageDraw.Draw(sh)
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGB').resize((W, H)); x, y = (i % C) * W, (i // C) * (H + 30)
    sh.paste(im, (x, y)); d.rectangle([x, y, x + W, y + 28 * 0 + 150 * H // 1920], outline=(244, 123, 98))
    d.line([x, y + (1920 - 250) * H // 1920, x + W, y + (1920 - 250) * H // 1920], fill=(244, 123, 98), width=2)
    d.text((x + 6, y + H + 8), f.split('_t')[-1], fill='white')
sh.save(out)
