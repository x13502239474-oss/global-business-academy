/* 课时页：目标 → 正文（7 段）→ 总结 → 术语 → 实操 → 笔记 */
(function (G) {
  const D = G.data, S = G.store, U = G.utils;

  G.views = G.views || {};

  G.views.lesson = function (params, query) {
    const id = params.id || query.id;
    const ch = D.lessonById[id];
    if (!ch) { G.router.go('courses'); return; }
    const mod = D.moduleById[ch.moduleId];
    G.setChrome('courses', ch.t);

    const L = (D.lessons || {})[id];
    const hasBody = !!(L && L.sections && L.sections.length);
    const st = S.get();

    const body = hasBody ? `
      <div class="learn-objectives">
        <div class="lt">学完这一节，你应当能够</div>
        <ul>${L.objectives.map(o => `<li>${o}</li>`).join('')}</ul>
      </div>

      <div class="lesson-layout">
        <article class="prose" id="prose">
          ${L.sections.map((s, i) => `<section id="sec-${i}">
            <h2><span class="n">${String(i + 1).padStart(2, '0')}</span>${s.h}</h2>
            ${s.html}
          </section>`).join('')}
        </article>
        <aside class="toc" id="toc">
          <div class="tt">本节目录</div>
          ${L.sections.map((s, i) => `<a href="#sec-${i}" data-toc="${i}">${s.h}</a>`).join('')}
        </aside>
      </div>

      ${(L.summary && L.summary.length) ? `<div class="summary-box">
        <div class="st">本节要点</div>
        <ol>${L.summary.map(s => `<li>${s}</li>`).join('')}</ol>
      </div>` : ''}

      ${L.terms ? `<div class="sec-head"><h2>关键术语</h2></div>
        <div class="terms-box">${Object.entries(L.terms).map(([k, v]) => `<div class="term-item"><b>${k}</b><span>${v}</span></div>`).join('')}</div>` : ''}

      ${L.practice ? `<div class="practice-card">
        <div class="pt">本节实操</div>
        <p>${L.practice}</p>
      </div>` : ''}

      ${(L.official && L.official.length) ? `<div class="source-note">
        <b>官方核对入口</b>（规则与功能以平台当期文档为准，核查日期 2026-11）：<br>
        ${L.official.map(o => '· ' + o).join('<br>')}
      </div>` : ''}
    ` : `<div class="notice"><div>本节的讲义正文尚未写入。课程结构、目标与来源已就绪，可先阅读同模块其他课时。</div></div>`;

    const notes = S.notesFor(id);

    const v = G.mount(`
      <div class="lesson-top">
        <div class="crumb">
          <a href="#/courses">课程体系</a> /
          <a href="#/module?id=${mod.id}">${mod.code}</a> /
          <span>第 ${ch.no} 节</span>
        </div>
        <h1 class="lesson-title">${ch.t}</h1>
        <div class="lesson-en">${ch.en || ''}</div>
        <div class="lesson-meta">
          <span class="chip tint" style="--mc:${mod.color}">${mod.title}</span>
          <span class="chip">${ch.mins} 分钟</span>
          <span class="chip line">依据 ${U.esc(ch.src || '')}</span>
          <span class="chip" id="statusChip">${S.isDone(id) ? '已完成' : (st.progress[id]?.pct ? '已读 ' + st.progress[id].pct + '%' : '未开始')}</span>
        </div>
      </div>

      ${body}

      <div class="sec-head"><h2>我的笔记</h2><span class="more">自动保存到本机</span></div>
      <div class="card">
        <div id="noteList"></div>
        <textarea class="input" id="noteInput" placeholder="写下你的理解、疑问，或一个可以马上试的动作…" style="margin-top:10px"></textarea>
        <div class="row between" style="margin-top:9px">
          <span class="tiny dim">笔记只存在这台设备的浏览器里</span>
          <button class="btn sm primary" id="addNote">保存笔记</button>
        </div>
      </div>

      <div class="row between" style="margin-top:20px;gap:8px;flex-wrap:wrap">
        <button class="btn sm" id="favBtn">${S.isFav(id) ? '★ 已收藏' : '☆ 收藏本节'}</button>
        <div class="row" style="gap:8px">
          <a class="btn sm" href="#/practice">去实战中心</a>
          <a class="btn sm" href="#/check?id=${mod.id}">模块检测</a>
        </div>
      </div>

      <div style="height:22px"></div>

      <div class="action-bar">
        <button class="btn" id="prevBtn">上一节</button>
        <button class="btn primary grow" id="doneBtn">${S.isDone(id) ? '标记为未完成' : '✓ 标记本节学完'}</button>
        <button class="btn" id="nextBtn">下一节</button>
      </div>
    `);

    /* 笔记 */
    function renderNotes() {
      const list = S.notesFor(id);
      v.querySelector('#noteList').innerHTML = list.length ? list.map(n => `
        <div style="border-bottom:1px solid var(--line);padding:8px 0">
          <div class="row between tiny dim" style="margin-bottom:3px">
            <span>${U.fmtDate(n.at)}</span>
            <button class="btn ghost sm" data-del="${n.id}" style="color:var(--danger);min-height:22px;padding:0 6px">删除</button>
          </div>
          <div style="font-size:13.5px;color:var(--ink-700);white-space:pre-wrap">${U.esc(n.text)}</div>
        </div>`).join('') : '<div class="tiny dim">还没有笔记。学完一节，写一句“我准备怎么用”比抄定义有用。</div>';
      v.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
        S.removeNote(b.dataset.del); renderNotes(); G.toast('已删除');
      }));
    }
    renderNotes();
    v.querySelector('#addNote').addEventListener('click', () => {
      const inp = v.querySelector('#noteInput');
      if (!inp.value.trim()) { G.toast('请先输入内容'); return; }
      S.addNote(id, inp.value.trim()); inp.value = ''; renderNotes(); G.toast('笔记已保存');
    });

    /* 收藏 */
    v.querySelector('#favBtn').addEventListener('click', e => {
      const on = S.toggleFav(id);
      e.currentTarget.textContent = on ? '★ 已收藏' : '☆ 收藏本节';
      G.toast(on ? '已收藏' : '已取消收藏');
    });

    /* 学完 */
    v.querySelector('#doneBtn').addEventListener('click', e => {
      const done = S.toggleDone(id);
      e.currentTarget.textContent = done ? '标记为未完成' : '✓ 标记本节学完';
      v.querySelector('#statusChip').textContent = done ? '已完成' : '未开始';
      G.toast(done ? '已标记学完' : '已取消');
      G.setChrome('courses', ch.t);
    });

    /* 上下节 */
    const all = D.allLessons, idx = all.findIndex(x => x.id === id);
    const prev = all[idx - 1], next = all[idx + 1];
    const pb = v.querySelector('#prevBtn'), nb = v.querySelector('#nextBtn');
    if (prev) pb.addEventListener('click', () => G.router.go('lesson?id=' + prev.id));
    else { pb.disabled = true; pb.style.opacity = '.4'; }
    if (next) nb.addEventListener('click', () => G.router.go('lesson?id=' + next.id));
    else { nb.disabled = true; nb.style.opacity = '.4'; }

    /* 目录高亮 */
    const toc = v.querySelector('#toc');
    if (toc) {
      toc.querySelectorAll('a[data-toc]').forEach(a => a.addEventListener('click', e => {
        e.preventDefault();
        const el = v.querySelector('#sec-' + a.dataset.toc);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
      }));
      const links = [...toc.querySelectorAll('a[data-toc]')];
      const obs = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            const i = en.target.id.replace('sec-', '');
            links.forEach(a => a.classList.toggle('active', a.dataset.toc === i));
          }
        });
      }, { rootMargin: '-80px 0px -70% 0px' });
      v.querySelectorAll('section[id^="sec-"]').forEach(s => obs.observe(s));
    }

    /* 状态与阅读进度 */
    S.markVisit(id);
    let maxPct = st.progress[id]?.pct || 0;
    const onScroll = U.debounce(() => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? U.clamp(window.scrollY / h * 100, 0, 100) : 100;
      if (pct > maxPct + 3) { maxPct = pct; S.updateProgress(id, { pct: Math.round(pct), lastPos: window.scrollY }); }
    }, 400);
    window.addEventListener('scroll', onScroll, { passive: true });
  };
})(window.GBA = window.GBA || {});
