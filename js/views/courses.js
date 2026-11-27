/* 课程总览 + 模块详情 */
(function (G) {
  const D = G.data, S = G.store;

  function modPct(m) {
    const vals = m.chapters.map(c => S.get().progress[c.id]?.pct || 0);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  }
  function doneCount(m) { return m.chapters.filter(c => S.isDone(c.id)).length; }

  G.views = G.views || {};

  G.views.courses = function () {
    G.setChrome('courses', '课程体系');
    const total = D.totalLessons;
    const done = S.completedCount();
    const pct = total ? done / total * 100 : 0;
    const groups = [
      { key: 'social', label: '第一核心：国际社交媒体运营（Global Social Media Operations）', note: '六大平台各自独立成课，覆盖「认知 → 账号 → 内容 → 增长 → 商业 → 合规 → 企业认证与 API 基础」完整路径。', ids: ['S0', 'SX', 'SF', 'SY', 'ST', 'SI', 'SL'] },
      { key: 'infra', label: '企业数字化基础设施：认证、数字身份与开发者 API', note: 'International Business Digital Infrastructure：企业官网/域名/邮箱、六平台企业认证对照、账号安全与开发者 API 生态。', ids: ['DI', 'DA'] },
      { key: 'marketing', label: '第二核心：国际市场营销理论与实战', note: '社媒课程的理论底座：市场选择、文化差异、定位、内容、流量、衡量、转化。', ids: ['MK'] },
      { key: 'trade', label: '第三部分：国际贸易核心知识', note: '只保留能直接用于报价、收款、履约与合规的部分，不做理论推导。', ids: ['TR'] },
      { key: 'practice', label: '第四部分：实战与检测', note: '案例方法、账号诊断、方案撰写与结业全案。', ids: ['CP'] }
    ];

    G.mount(`
      <div class="page-title">课程体系</div>
      <div class="page-sub">${D.modules.length} 个模块 · ${total} 节 · 约 ${Math.round(D.totalMins / 60)} 小时 · 已完成 ${done} 节（${Math.round(pct)}%）</div>

      <div class="card" style="margin-bottom:24px">
        <div class="row between" style="margin-bottom:10px">
          <b style="font-size:13.5px">总体进度</b>
          <span class="num" style="color:var(--blue-700)">${pct.toFixed(1)}%</span>
        </div>
        <div class="bar-track" style="height:8px"><div class="bar-fill" style="width:${pct}%"></div></div>
        <div class="tiny dim" style="margin-top:9px">建议顺序：社媒基础 → 任选一个平台做透 → 市场营销理论 → 第二个平台 → 贸易实务 → 结业项目。不必按顺序刷完，但不要跳过「全球社媒运营基础」。</div>
      </div>

      ${groups.map(g => `
        <div class="sec-head"><h2>${g.label}</h2><span class="more">${g.ids.reduce((a, id) => a + D.moduleById[id].chapters.length, 0)} 节</span></div>
        <div class="tiny dim" style="margin:-6px 0 12px">${g.note}</div>
        ${g.ids.map(id => {
          const m = D.moduleById[id];
          const mp = modPct(m);
          return `<a class="course-row" style="--mc:${m.color}" href="#/module?id=${m.id}">
            <div class="ci">${G.icon(m.icon, 20)}</div>
            <div class="ct">
              <div class="cd">${m.code}</div>
              <b>${m.title}</b>
              <span>${m.desc}</span>
            </div>
            <div class="cp">
              <div class="p">${Math.round(mp)}%</div>
              <div class="tiny dim">${doneCount(m)}/${m.chapters.length} 节</div>
            </div>
          </a>`;
        }).join('')}
      `).join('')}

      <div class="section-gap"></div>
      <div class="card flat">
        <div class="small" style="color:var(--ink-600);line-height:1.85">
          <b>为什么是 ${total} 节而不是 300 节。</b>平台操作类内容平均 18 个月就会失效，堆知识点容易，但会让你学到一堆过期按钮。这里的取舍是：把机制、企业数字基建标准与操作框架写透，把会过期的界面细节留给官方文档——每节课都会告诉你该去官方核对什么。
        </div>
      </div>
    `);
  };

  G.views.module = function (params, query) {
    const m = D.moduleById[params.id || query.id];
    if (!m) { G.router.go('courses'); return; }
    G.setChrome('courses', m.title);
    const st = S.get();
    const mp = modPct(m);
    const chk = S.checkOf(m.id);
    const idx = D.modules.findIndex(x => x.id === m.id);

    const v = G.mount(`
      <div class="crumb"><a href="#/courses">课程体系</a> / <span>${m.code}</span></div>

      <div class="mod-banner" style="--mc:${m.color}">
        <div class="code">${m.code} · ${m.weight}</div>
        <h1>${m.title}</h1>
        <div class="en">${m.en}</div>
        <div class="goal">${m.goal}</div>
        <div class="mb-foot">
          <span class="chip">${m.chapters.length} 节</span>
          <span class="chip">约 ${m.chapters.reduce((a, c) => a + c.mins, 0)} 分钟</span>
          <span class="chip ${mp >= 100 ? 'ok' : ''}">进度 ${Math.round(mp)}%</span>
          ${chk ? `<span class="chip blue">检测 ${chk.score}/${chk.total}</span>` : ''}
          ${m.chapters.find(c => !S.isDone(c.id)) ? `<a class="btn primary sm" href="#/lesson?id=${(m.chapters.find(c => !S.isDone(c.id))).id}">继续本模块</a>` : ''}
        </div>
      </div>

      <div class="sec-head"><h2>章节目录</h2><span class="more">按建议顺序排列</span></div>
      ${m.chapters.map((c, i) => {
        const p = st.progress[c.id] || {};
        return `<a class="chapter-item ${p.done ? 'done' : ''}" href="#/lesson?id=${c.id}">
          <div class="ch-num">${p.done ? '✓' : String(i + 1).padStart(2, '0')}</div>
          <div class="ch-t">
            <b>${c.t}</b>
            <span>${c.en || ''} · ${c.mins} 分钟</span>
          </div>
          <div class="ch-status">${p.done ? '已完成' : (p.pct ? p.pct + '%' : '未开始')}</div>
        </a>`;
      }).join('')}

      <div class="check-cta">
        <div class="ck">
          <b>模块检测：${((D.checks && D.checks[m.id]) || []).length} 题 · 约 6 分钟</b>
          <span>${chk ? `上次得分 ${chk.score}/${chk.total}，可重测` : '学完本模块后做一次即可，不必逐节刷题'}</span>
        </div>
        <a class="btn" href="#/check?id=${m.id}">开始检测</a>
      </div>

      <div class="row between" style="margin-top:22px;gap:10px;flex-wrap:wrap">
        ${idx > 0 ? `<a class="btn sm" href="#/module?id=${D.modules[idx - 1].id}">${G.icon('back', 14)} ${D.modules[idx - 1].title}</a>` : '<span></span>'}
        ${idx < D.modules.length - 1 ? `<a class="btn sm" href="#/module?id=${D.modules[idx + 1].id}">${D.modules[idx + 1].title} ${G.icon('arrow', 14)}</a>` : ''}
      </div>
    `);
    void v;
  };
})(window.GBA = window.GBA || {});
