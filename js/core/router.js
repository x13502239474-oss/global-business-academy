/* Hash 路由 — 支持 /path?query */
(function (G) {
  const routes = [];
  let notFound = null;

  const R = {
    reg(pattern, handler) {
      // pattern 支持 :param
      const keys = [];
      const rx = pattern.replace(/:[A-Za-z0-9_]+/g, m => { keys.push(m.slice(1)); return '([^/]+)'; });
      routes.push({ rx: new RegExp('^' + rx + '$'), keys, handler });
    },
    setNotFound(fn) { notFound = fn; },
    parse() {
      const raw = location.hash.replace(/^#\/?/, '') || 'home';
      const [path, qs] = raw.split('?');
      const query = {};
      if (qs) qs.split('&').forEach(kv => { const [k, v] = kv.split('='); query[decodeURIComponent(k)] = decodeURIComponent(v || ''); });
      return { path, query };
    },
    go(path) { location.hash = '#/' + path; },
    start() {
      const dispatch = () => {
        const { path, query } = R.parse();
        let handled = false;
        for (const r of routes) {
          const m = r.rx.exec(path);
          if (m) {
            const params = {};
            r.keys.forEach((k, i) => params[k] = decodeURIComponent(m[i + 1]));
            r.handler(params, query);
            handled = true; break;
          }
        }
        if (!handled && notFound) notFound({ path, query });
        // 更新 tab 高亮
        const base = path.split('/')[0];
        document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.base === base));
        window.scrollTo(0, 0);
      };
      window.addEventListener('hashchange', dispatch);
      dispatch();
    }
  };
  G.router = R;
})(window.GBA = window.GBA || {});
