/* 应用外壳：侧栏 + 顶栏 + 移动端标签栏 + 全局搜索 */
(function (G) {
  const NAV = [
    { key: 'home', icon: 'home', label: '首页', path: 'home' },
    { key: 'courses', icon: 'grid', label: '课程体系', path: 'courses' },
    { key: 'cases', icon: 'case', label: '案例库', path: 'cases' },
    { key: 'practice', icon: 'flag', label: '实战中心', path: 'practice' },
    { key: 'me', icon: 'me', label: '我的学习', path: 'me' },
    { key: 'sources', icon: 'library', label: '资料来源', path: 'sources' }
  ];
  const TABS = ['home', 'courses', 'cases', 'practice', 'me'];
  const TITLES = {
    home: '学习总览', courses: '课程体系', module: '模块', lesson: '课时',
    cases: '案例库', case: '案例', practice: '实战训练中心', project: '实战项目',
    me: '我的学习', sources: '资料来源与时效说明', check: '模块检测', search: '搜索'
  };

  G.renderShell = function () {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="app">
        <aside class="sidebar">
          <a class="brand" href="#/home">
            <div class="brand-mark">GB</div>
            <div class="brand-text"><b>GLOBAL BUSINESS</b><span>ACADEMY 2.0</span></div>
          </a>
          <nav class="nav">
            ${NAV.slice(0, 5).map(n => `<a class="nav-item" data-nav="${n.key}" href="#/${n.path}">
              <span class="ni">${G.icon(n.icon, 17)}</span><span>${n.label}</span></a>`).join('')}
            <div class="nav-sep">REFERENCE</div>
            ${NAV.slice(5).map(n => `<a class="nav-item" data-nav="${n.key}" href="#/${n.path}">
              <span class="ni">${G.icon(n.icon, 17)}</span><span>${n.label}</span></a>`).join('')}
            <a class="nav-item" data-nav="search" href="#" data-act="search">
              <span class="ni">${G.icon('search', 17)}</span><span>内容搜索</span></a>
          </nav>
          <div class="sidebar-foot">
            <div class="side-mini" id="sideProgress">—</div>
            <div class="side-mini" style="margin-top:6px">国际社媒运营 · 海外市场营销</div>
          </div>
        </aside>

        <div class="main">
          <header class="topbar">
            <div class="topbar-title" id="topTitle">学习总览</div>
            <div class="topbar-right">
              <button class="icon-btn" data-act="search" title="搜索（/）">${G.icon('search', 18)}</button>
              <a class="chip line" id="streakChip" href="#/me"></a>
            </div>
          </header>
          <main id="view" class="view"></main>
        </div>
      </div>

      <nav class="tabbar">
        ${TABS.map(k => {
          const n = NAV.find(x => x.key === k);
          return `<a class="tab" data-tab="${k}" href="#/${n.path}">${G.icon(n.icon, 21)}<span>${n.label}</span></a>`;
        }).join('')}
      </nav>
      <div id="toast"></div>`;

    app.querySelectorAll('[data-act="search"]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); G.openSearch(); }));
    updateChrome();
  };

  G.mount = function (html) {
    const v = document.getElementById('view');
    v.innerHTML = html;
    return v;
  };

  /* 顶栏 / 侧栏状态同步 */
  function updateChrome() {
    const st = G.store.get();
    const done = G.store.completedCount();
    const total = G.data.totalLessons || 1;
    const sp = document.getElementById('sideProgress');
    if (sp) sp.innerHTML = `已完成 <b style="color:var(--ink-900)">${done}</b> / ${total} 节 · ${Math.round(done / total * 100)}%`;
    const sc = document.getElementById('streakChip');
    if (sc) sc.innerHTML = `<span class="dot-chip" style="color:var(--blue-600)"></span>连续 ${st.streak.count || 0} 天`;
  }

  G.setChrome = function (key, title) {
    document.querySelectorAll('.nav-item[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === key));
    document.querySelectorAll('.tab').forEach(a => a.classList.toggle('active', a.dataset.tab === key));
    const t = document.getElementById('topTitle');
    if (t) t.textContent = title || TITLES[key] || 'GLOBAL BUSINESS ACADEMY';
    document.title = (title || TITLES[key] || '') + ' · GLOBAL BUSINESS ACADEMY';
    const st = G.store.get();
    const sc = document.getElementById('streakChip');
    if (sc) sc.innerHTML = `<span class="dot-chip" style="color:var(--blue-600)"></span>连续 ${st.streak.count || 0} 天`;
    updateChrome();
  };

  /* ---------------- 全局搜索 ---------------- */
  let panel = null;

  function buildIndex() {
    if (G._searchIndex) return G._searchIndex;
    const idx = [];
    (G.data.allLessons || []).forEach(l => {
      const mod = G.data.moduleById[l.moduleId];
      idx.push({ type: '课时', t: l.t, m: (mod ? mod.title : '') + ' · ' + (l.en || ''), go: 'lesson?id=' + l.id, text: l.t + ' ' + (l.en || '') });
    });
    (G.data.cases || []).forEach(c => {
      idx.push({ type: '案例', t: c.name, m: (c.platform || '') + ' · ' + (c.sector || ''), go: 'case?id=' + c.id, text: c.name + ' ' + (c.intro || '') + ' ' + (c.platform || '') });
    });
    (G.data.projects || []).forEach(p => {
      idx.push({ type: '实战', t: p.title, m: p.code + ' · ' + (p.platform || ''), go: 'project?id=' + p.id, text: p.title + ' ' + (p.brief || '') });
    });
    G._searchIndex = idx;
    return idx;
  }

  G.openSearch = function () {
    if (panel) return;
    panel = document.createElement('div');
    panel.className = 'search-panel';
    panel.innerHTML = `<div class="search-box">
      <input type="search" placeholder="搜索课时、案例、实战项目…" autocomplete="off"/>
      <div class="search-res" id="sres"></div>
    </div>`;
    document.body.appendChild(panel);
    const input = panel.querySelector('input');
    const res = panel.querySelector('#sres');
    const idx = buildIndex();

    function render(q) {
      q = q.trim().toLowerCase();
      if (!q) {
        const hot = (G.data.allLessons || []).slice(0, 6);
        res.innerHTML = `<div class="tiny dim" style="padding:10px 12px 4px">最近可学</div>` + hot.map(l =>
          `<a class="sr" href="#/lesson?id=${l.id}"><div class="sr-t">${l.t}</div><div class="sr-m">${G.data.moduleById[l.moduleId].title}</div></a>`).join('');
        return;
      }
      const hits = idx.filter(x => x.text.toLowerCase().includes(q)).slice(0, 24);
      res.innerHTML = hits.length ? hits.map(h =>
        `<a class="sr" href="#/${h.go}"><div class="sr-t">${G.utils.esc(h.t)}</div><div class="sr-m">${h.type} · ${G.utils.esc(h.m)}</div></a>`).join('')
        : `<div class="empty" style="padding:28px 10px">没有匹配内容，换个关键词试试</div>`;
    }
    render('');
    input.addEventListener('input', () => render(input.value));
    panel.addEventListener('click', e => { if (e.target === panel) close(); });
    res.addEventListener('click', () => close());
    document.addEventListener('keydown', escClose);
    setTimeout(() => input.focus(), 30);

    function escClose(e) { if (e.key === 'Escape') close(); }
    function close() {
      if (!panel) return;
      panel.remove(); panel = null;
      document.removeEventListener('keydown', escClose);
    }
  };

  document.addEventListener('keydown', e => {
    if (e.key === '/' && !/input|textarea/i.test((e.target.tagName || ''))) {
      e.preventDefault(); G.openSearch();
    }
  });
})(window.GBA = window.GBA || {});
