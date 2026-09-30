// Motor de animação determinístico: cada quadro é calculado a partir do tempo t (s).
// Um vídeo define window.VIDEO = {duration, scenes, captions, sfx, overlays}; o renderizador chama __seek(t).
(function () {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  const E = {
    lin: p => p,
    out: p => 1 - Math.pow(1 - p, 3),
    in: p => p * p * p,
    io: p => (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    back: p => { const c = 1.9; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); },
  };
  // progresso de t entre t0 e t1, com easing
  const k = (t, t0, t1, e = E.out) => e(clamp((t - t0) / (t1 - t0)));
  // tremida curta e amortecida (reveal de preço)
  const shake = (t, t0, dur = .35, amp = 14) => {
    const p = (t - t0) / dur; if (p < 0 || p > 1) return [0, 0];
    const a = amp * (1 - p);
    return [a * Math.sin(t * 97), a * Math.cos(t * 83)];
  };
  const $ = s => document.querySelector(s);
  const css = (el, o) => { if (typeof el === 'string') el = $(el); if (el) Object.assign(el.style, o); return el; };
  window.A = { clamp, lerp, E, k, shake, $, css };

  // Clipes de vídeo (avatares HeyGen): <video class="clip" data-start="s" src="...">.
  // Cada quadro posiciona o clipe no tempo exato e espera o 'seeked' — render determinístico.
  // Se o arquivo não existir, o elemento vizinho .clip-ph (espaço reservado) continua visível.
  function seekClips(t) {
    const waits = [];
    document.querySelectorAll('video.clip').forEach(v => {
      if (v.dataset.ok !== '1') return;
      const lt = Math.max(0, Math.min(v.duration - .01, t - parseFloat(v.dataset.start || 0)));
      if (Math.abs(v.currentTime - lt) < 1e-3) return;
      waits.push(new Promise(r => { v.addEventListener('seeked', r, { once: true }); v.currentTime = lt; }));
    });
    return Promise.all(waits);
  }
  window.__clipsReady = () => Promise.all([...document.querySelectorAll('video.clip')].map(v => new Promise(r => {
    const ok = () => { v.dataset.ok = '1'; v.muted = true; const ph = v.parentElement.querySelector('.clip-ph'); if (ph) ph.style.display = 'none'; r(); };
    const fail = () => { v.style.display = 'none'; r(); };
    if (v.readyState >= 1) return ok();
    if (v.error || v.networkState === 3) return fail();  // arquivo ausente: fica o espaço reservado
    v.addEventListener('loadedmetadata', ok, { once: true });
    v.addEventListener('error', fail, { once: true });
    setTimeout(() => (v.readyState >= 1 ? ok() : fail()), 3000);
  })));

  window.__seek = function (t) {
    const V = window.VIDEO;
    for (const s of V.scenes) {
      const el = document.getElementById(s.id);
      const on = t >= s.start && t < s.end;
      el.classList.toggle('on', on);
      if (on && s.render) s.render(t - s.start, s.end - s.start, t);
    }
    (V.overlays || []).forEach(o => o(t));
    const cap = V.captions.find(c => t >= c.s && t < c.e);
    const box = document.getElementById('cap');
    const txt = cap ? cap.text : '';
    if (box.dataset.txt !== txt) { box.dataset.txt = txt; box.innerHTML = txt ? '<span>' + txt + '</span>' : ''; }
    return seekClips(t);
  };
  window.__meta = () => {
    const V = window.VIDEO;
    return { duration: V.duration, captions: V.captions, sfx: V.sfx || [], vo: V.vo || [] };
  };
})();
