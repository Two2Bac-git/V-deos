// Peças comuns aos 3 vídeos: tela final padrão, transição da seta, selos.
(function () {
  const { k, E, css, lerp } = window.A;

  // Tela final padrão: fundo verde-profundo, assinatura vertical, CTA + @gastepouco.
  // Respiro do logo = metade da altura do símbolo (180px → 90px).
  function endcardHTML() {
    return `
    <div class="safe ec" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
      <div class="logo-v ec-logo">
        <div class="disc" style="width:360px;height:360px"><img src="../assets/brand/logo-simbolo.svg" style="width:180px;height:180px"></div>
        <div class="wm" style="font-size:92px;margin-top:90px;color:var(--papel)">gastepouco</div>
      </div>
      <div class="ec-l1 tt-400" style="font-size:52px;margin-top:110px;max-width:860px;line-height:1.12">Estamos construindo o Gaste Pouco.</div>
      <div class="ec-l2 tt" style="font-size:64px;margin-top:26px">Siga <span style="color:var(--menta)">@gastepouco</span><br>e acompanhe.</div>
      <div class="ec-l3" style="font:500 34px/1.3 Inter;margin-top:80px;opacity:.85">O preço real, no bolso de quem paga.</div>
    </div>`;
  }
  function endcardRender(root, t) {
    const q = s => root.querySelector(s);
    const a = k(t, 0, .6, E.back);
    css(q('.ec-logo'), { transform: `translateY(${lerp(60, 0, a)}px)`, opacity: k(t, 0, .35) });
    css(q('.ec-l1'), { opacity: k(t, .5, .9), transform: `translateY(${lerp(30, 0, k(t, .5, .9))}px)` });
    css(q('.ec-l2'), { opacity: k(t, .8, 1.2), transform: `translateY(${lerp(30, 0, k(t, .8, 1.2))}px)` });
    css(q('.ec-l3'), { opacity: .85 * k(t, 1.3, 1.8) });
  }

  // Transição: a seta da marca desce e atravessa a tela (preço caindo).
  function setaHTML() {
    return `<div id="seta" style="position:absolute;left:0;top:0;width:1080px;height:1920px;pointer-events:none;display:none;z-index:50">
      <div class="seta-rastro" style="position:absolute;left:0;right:0;background:var(--verde)"></div>
      <svg class="seta-svg" viewBox="0 0 100 120" style="position:absolute;left:290px;width:500px;height:600px">
        <g fill="none" stroke="#77C9A5" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">
          <path d="M50 10 V100"/><path d="M18 68 L50 100 L82 68"/></g></svg></div>`;
  }
  // t0 = início; dura 0,5 s. Uma faixa verde com a seta na borda de baixo varre a tela;
  // em t0 + 0,25 s a faixa cobre a tela inteira — é ali que a cena troca por baixo.
  // t0 pode ser um número ou uma lista de inícios.
  function seta(t, t0) {
    const el = document.getElementById('seta'); if (!el) return;
    if (Array.isArray(t0)) t0 = t0.find(x => t >= x && t <= x + .5) ?? -99;
    const p = (t - t0) / .5;
    if (p < 0 || p > 1) { el.style.display = 'none'; return; }
    el.style.display = 'block';
    const H = 2600, B = lerp(-300, 1920 + H, E.io(p));
    css(el.querySelector('.seta-rastro'), { top: (B - H) + 'px', height: H + 'px' });
    css(el.querySelector('.seta-svg'), { top: (B - 640) + 'px' });
  }

  window.Shared = { endcardHTML, endcardRender, setaHTML, seta };
})();
