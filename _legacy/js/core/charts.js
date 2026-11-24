/* SVG 图表生成器（无依赖、适配手机） */
(function (G) {
  const C = {};

  // 环形进度
  C.donut = function (pct, opt) {
    opt = opt || {};
    const size = opt.size || 80, sw = opt.stroke || 8, r = (size - sw) / 2, cx = size / 2;
    const circ = 2 * Math.PI * r;
    const p = G.utils.clamp(pct, 0, 100);
    const dash = circ * p / 100;
    const color = opt.color || 'url(#dg)';
    return `<div class="donut-wrap" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <defs><linearGradient id="dg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#36A9FF"/><stop offset="1" stop-color="#8A72FF"/></linearGradient></defs>
        <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="${sw}"/>
        <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"
          stroke-dasharray="${dash} ${circ}" style="transition:stroke-dasharray .8s var(--ease)"/>
      </svg>
      <div class="donut-center"><div class="v">${opt.big != null ? opt.big : Math.round(p) + '%'}</div><div class="l">${opt.label || ''}</div></div>
    </div>`;
  };

  // 水平条形
  C.bars = function (items, opt) {
    opt = opt || {};
    const max = opt.max || Math.max(...items.map(i => i.value), 1);
    return `<div class="bars">${items.map(it => `
      <div style="margin-bottom:10px">
        <div class="row between" style="font-size:11.5px;margin-bottom:4px"><span>${G.utils.esc(it.label)}</span><span class="mono" style="color:var(--accent)">${it.text || it.value}</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${G.utils.clamp(it.value / max * 100, 0, 100)}%;${it.color ? 'background:' + it.color : ''}"></div></div>
      </div>`).join('')}</div>`;
  };

  // 折线/面积图
  C.line = function (data, opt) {
    opt = opt || {};
    const w = opt.w || 320, h = opt.h || 130, pad = 24;
    const max = Math.max(...data, 1), min = Math.min(...data, 0);
    const span = max - min || 1;
    const pts = data.map((v, i) => {
      const x = pad + i * (w - pad * 2) / Math.max(data.length - 1, 1);
      const y = h - pad - (v - min) / span * (h - pad * 2);
      return [x, y];
    });
    const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const area = line + ` L ${pts[pts.length - 1][0].toFixed(1)} ${h - pad} L ${pts[0][0].toFixed(1)} ${h - pad} Z`;
    return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto">
      <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#36A9FF" stop-opacity=".35"/><stop offset="1" stop-color="#36A9FF" stop-opacity="0"/></linearGradient></defs>
      ${[0, .5, 1].map(g => `<line x1="${pad}" x2="${w - pad}" y1="${pad + g * (h - 2 * pad)}" y2="${pad + g * (h - 2 * pad)}" stroke="rgba(255,255,255,.06)" stroke-dasharray="3 4"/>`).join('')}
      <path d="${area}" fill="url(#ag)"/><path d="${line}" fill="none" stroke="#36A9FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${pts.map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="#080C16" stroke="#42D8D0" stroke-width="2"/>`).join('')}
    </svg>`;
  };

  // 仪表盘（速度表）
  C.gauge = function (pct, opt) {
    opt = opt || {};
    const size = opt.size || 150, sw = 12, r = (size - sw) / 2 - 6, cx = size / 2, cy = size / 2;
    const arc = Math.PI * 0.75; // 270度
    const start = Math.PI * 0.75, end = Math.PI * 2.25;
    const p = G.utils.clamp(pct, 0, 100) / 100;
    function pt(a) { return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
    function arcPath(a0, a1) {
      const s = pt(a0), e = pt(a1);
      const large = (a1 - a0) > Math.PI ? 1 : 0;
      return `M ${s[0]} ${s[1]} A ${r} ${r} 0 ${large} 1 ${e[0]} ${e[1]}`;
    }
    return `<div class="donut-wrap" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <path d="${arcPath(start, end)}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="${sw}" stroke-linecap="round"/>
        <path d="${arcPath(start, start + arc * 2 * p)}" fill="none" stroke="url(#gg)" stroke-width="${sw}" stroke-linecap="round"/>
        <defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#42D8D0"/><stop offset="1" stop-color="#8A72FF"/></linearGradient></defs>
      </svg>
      <div class="donut-center"><div class="v" style="font-size:30px">${opt.big != null ? opt.big : Math.round(pct) + '%'}</div><div class="l">${opt.label || ''}</div></div>
    </div>`;
  };

  // 漏斗图（流量到订单）
  C.funnel = function (steps) {
    const max = steps[0].value || 1;
    return steps.map((s, i) => {
      const wPct = Math.max(s.value / max * 100, 16);
      const conv = i === 0 ? 100 : (s.value / steps[i - 1].value * 100);
      return `<div class="funnel-step">
        <div class="funnel-bar" style="width:${wPct}%;background:linear-gradient(90deg,rgba(54,169,255,${1 - i * .1}),rgba(138,114,255,${.9 - i * .1}))">${G.utils.esc(s.label)} · ${G.utils.num(s.value, 0)}</div>
        <div class="funnel-meta"><span>${s.note || ''}</span><span>${i === 0 ? '入口' : '转化 ' + G.utils.num(conv, 1) + '%'}</span></div>
      </div>`;
    }).join('');
  };

  G.charts = C;
})(window.GBA = window.GBA || {});
