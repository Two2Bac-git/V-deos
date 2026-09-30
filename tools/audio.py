"""SFX sintetizados (sem licença de terceiros), mixagem da trilha e legenda .srt.

Uso: python tools/audio.py build/v3.meta.json build/v3 [--vo arquivo.wav --vo-at 0.0]
Gera build/v3.audio.wav e build/v3.srt. Também exporta os SFX avulsos em assets/sfx/.
"""
import json, sys, wave, re
from pathlib import Path
import numpy as np

SR = 48000
rng = np.random.default_rng(7)


def env(n, a=0.005, r=0.08):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e


def lowpass(x, cutoff):
    # filtro de um polo, cutoff pode variar no tempo (array)
    cutoff = np.broadcast_to(cutoff, x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def t_(d): return np.arange(int(d * SR)) / SR


def whoosh(d=0.45):
    n = int(d * SR); x = rng.standard_normal(n)
    sweep = np.geomspace(300, 5000, n) * np.sin(np.linspace(0, np.pi, n)) + 200
    y = lowpass(x, sweep) - lowpass(x, sweep * .25)
    return y * np.sin(np.linspace(0, np.pi, n)) ** 1.5 * 1.6


def bipe(f=2350, d=0.11):
    t = t_(d)
    return (np.sin(2 * np.pi * f * t) + .25 * np.sin(2 * np.pi * 2 * f * t)) * env(len(t), .003, .02) * .5


def bipe_grave(): return bipe(880, .16)


def tump():
    t = t_(.25); f = 140 * np.exp(-t * 18) + 45
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 16) * .9


def impressora(d=1.3):
    t = t_(d); n = len(t)
    motor = np.sign(np.sin(2 * np.pi * 38 * t)) * .5 + lowpass(rng.standard_normal(n), 2500) * .8
    passo = (np.sin(2 * np.pi * 14 * t) > .2).astype(float)
    return motor * (.35 + .65 * passo) * env(n, .02, .1) * .45


def cha_ching():
    out = np.zeros(int(1.3 * SR))
    click = lowpass(rng.standard_normal(int(.03 * SR)), 6000) * np.exp(-np.arange(int(.03 * SR)) / 200)
    out[:len(click)] += click * .8
    for start, base in ((0.0, 1318.5), (0.12, 1760.0)):
        t = t_(1.1); s = int(start * SR)
        tone = sum(a * np.sin(2 * np.pi * base * m * t) for m, a in ((1, 1), (2.76, .45), (5.4, .25), (8.9, .1)))
        seg = tone * np.exp(-t * 4.5) * .35
        out[s:s + len(seg)] += seg[:len(out) - s]
    return out


def notificacao():
    a = bipe(988, .09); b = bipe(1319, .14)
    return np.concatenate([a, np.zeros(int(.03 * SR)), b]) * .8


def rodinhas(d=1.2):
    t = t_(d); n = len(t)
    return lowpass(rng.standard_normal(n), 700) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t)) * env(n, .1, .3) * .6


def acorde(d=2.8):
    t = t_(d)
    notas = (261.63, 329.63, 392.0, 523.25)  # dó maior aberto
    y = sum(np.sin(2 * np.pi * f * t) * (0.6 + 0.4 * np.sin(2 * np.pi * .7 * t + i)) for i, f in enumerate(notas))
    return y * env(len(t), .25, 1.2) * .16


def brasa(d=12.0):
    n = int(d * SR); x = rng.standard_normal(n)
    y = lowpass(x, 1800) - lowpass(x, 300)
    estalo = (rng.random(n) > .9996) * rng.standard_normal(n) * 4
    return (y * .25 + lowpass(estalo, 3000)) * env(n, .5, .8) * .35


SFX = dict(whoosh=whoosh, bipe=bipe, bipe_grave=bipe_grave, tump=tump, impressora=impressora,
           cha_ching=cha_ching, notificacao=notificacao, rodinhas=rodinhas, acorde=acorde, brasa=brasa)


def write_wav(path, x):
    x = np.clip(x, -1, 1)
    data = (x * 32767).astype('<i2')
    if data.ndim == 1: data = np.stack([data, data], 1)
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())


def read_wav(path):
    with wave.open(str(path), 'rb') as w:
        assert w.getframerate() == SR, 'VO precisa estar em 48 kHz'
        x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float) / 32768
        return x.reshape(-1, w.getnchannels()).mean(1)


def srt_time(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{sec:02d},{ms:03d}'


def main():
    meta_path, out = sys.argv[1], sys.argv[2]
    meta = json.loads(Path(meta_path).read_text())
    total = np.zeros(int(meta['duration'] * SR) + SR)
    cache = {}
    for ev in meta['sfx']:
        name = ev['name']
        if name not in cache: cache[name] = SFX[name]()
        s = cache[name] * ev.get('gain', 1.0); i = int(ev['t'] * SR)
        total[i:i + len(s)] += s[:len(total) - i]
    if '--vo' in sys.argv:
        vo = read_wav(sys.argv[sys.argv.index('--vo') + 1])
        at = float(sys.argv[sys.argv.index('--vo-at') + 1]) if '--vo-at' in sys.argv else 0.0
        i = int(at * SR); total *= 0.7; total[i:i + len(vo)] += vo[:len(total) - i]
    # falas das avatares declaradas no vídeo (WAV 48 kHz extraído dos MP4 do HeyGen); ausentes são ignoradas
    root = Path(__file__).resolve().parent.parent
    vos = [v for v in meta.get('vo', []) if (root / v['file']).exists()]
    if vos:
        total *= 0.7
        for v in vos:
            x = read_wav(root / v['file']) * v.get('gain', 1.0); i = int(v['t'] * SR)
            if 'from' in v:  # recorte de um trecho do arquivo (frase), com fade curto nas pontas
                x = x[int(v['from'] * SR):int(v['to'] * SR)].copy(); f = min(len(x) // 2, int(.03 * SR))
                x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
            total[i:i + len(x)] += x[:len(total) - i]
    total = total[:int(meta['duration'] * SR)]
    peak = np.abs(total).max() or 1
    write_wav(out + '.audio.wav', total * (0.89 / peak))

    lines = []
    for n, c in enumerate(meta['captions'], 1):
        txt = re.sub('<[^>]+>', '', c['text'])
        lines += [str(n), f"{srt_time(c['s'])} --> {srt_time(c['e'])}", txt, '']
    Path(out + '.srt').write_text('\n'.join(lines), encoding='utf-8')

    sfx_dir = Path(__file__).resolve().parent.parent / 'assets' / 'sfx'
    sfx_dir.mkdir(parents=True, exist_ok=True)
    for name, x in cache.items():
        p = sfx_dir / f'{name}.wav'
        if not p.exists(): write_wav(p, x / (np.abs(x).max() or 1) * .89)
    print('ok', out + '.audio.wav', out + '.srt')


if __name__ == '__main__':
    main()
