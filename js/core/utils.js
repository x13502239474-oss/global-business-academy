/* 工具函数 + 全局 toast */
(function (G) {
  const U = {
    esc(s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    },
    todayKey() { return U.dateKeyOffset(0); },
    dateKeyOffset(off) {
      const d = new Date(); d.setDate(d.getDate() + off);
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    },
    fmtDate(ts) {
      const d = new Date(ts);
      return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    },
    num(n, d = 2) {
      if (!isFinite(n)) return '—';
      return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: d, maximumFractionDigits: d });
    },
    clamp(v, a, b) { return Math.max(a, Math.min(b, v)); },
    // 简单数字缓动动画
    animateNumber(el, to, opt) {
      opt = opt || {};
      const dur = opt.dur || 900, dec = opt.dec == null ? 0 : opt.dec, prefix = opt.prefix || '', suffix = opt.suffix || '';
      const from = 0, t0 = performance.now();
      const reduce = G.store.get().settings.reducedMotion;
      if (reduce) { el.textContent = prefix + U.num(to, dec) + suffix; return; }
      function step(t) {
        const p = U.clamp((t - t0) / dur, 0, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + U.num(from + (to - from) * ease, dec) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    },
    // 规范化文本（填空判分用）
    normalize(s) {
      return String(s || '').toLowerCase().replace(/[\s\u3000]/g, '')
        .replace(/[，。！？、；：""''（）()]/g, '')
        .replace(/[，,]/g, '').replace(/[。.]$/, '');
    },
    // 判断题宽口径
    isTrue(s) {
      const t = U.normalize(s);
      return ['对', '正确', '是', '√', 'true', 'yes', 'y', '1'].includes(t);
    },
    isFalse(s) {
      const t = U.normalize(s);
      return ['错', '错误', '否', '×', 'x', 'false', 'no', 'n', '0'].includes(t);
    },
    uid() { return 'id' + Date.now() + Math.floor(Math.random() * 1000); },
    debounce(fn, ms) { let t; return function (...a) { clearTimeout(t); t = setTimeout(() => fn.apply(this, a), ms); }; }
  };
  G.utils = U;

  let toastTimer;
  G.toast = function (msg, ms) {
    let el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), ms || 2000);
  };
})(window.GBA = window.GBA || {});
