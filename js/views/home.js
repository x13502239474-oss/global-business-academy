/* 首页：学习总览 */
(function (G) {
  const D = G.data, S = G.store, U = G.utils;

  const GROUP_COLOR = { social: '#2563EB', infra: '#4F46E5', marketing: '#0D9488', trade: '#B45309', practice: '#15803D' };
  const GROUP_LABEL = { social: '国际社媒运营', infra: '企业数字基建', marketing: '国际市场营销', trade: '国际贸易核心', practice: '检测与实战' };

  function nextLesson() {
    const st = S.get();
    const recent = (st.visited || []).find(id => D.lessonById[id] && !S.isDone(id));
    if (recent) return D.lessonById[recent];
    return D.allLessons.find(l => !S.isDone(l.id)) || D.allLessons[0];
  }

  G.views = G.views || {};
  G.views.home = function () {
    G.setChrome('home', '学习总览');
    const st = S.get();
    const done = S.completedCount();
    const total = D.totalLessons;
    const pct = total ? done / total * 100 : 0;
    const nx = nextLesson();
    const nxMod = D.moduleById[nx.moduleId];
    const w = D.curriculumWeights || { social: 1, marketing: 1, trade: 1, practice: 1 };
    const wSum = Object.values(w).reduce((a, b) => a + b, 0) || 1;
    const todayMin = st.dailyGoal.log[U.todayKey()] || 0;
    const cases = D.cases || [];
    const caseOfDay = cases[Math.floor(Date.now() / 86400000) % Math.max(cases.length, 1)];
    const projCount = Object.keys(st.projectSubs || {}).length;

    G.mount(`
      <section class="hero">
        <div class="eyebrow">GLOBAL BUSINESS ACADEMY 2.0</div>
        <h1>把国际社媒，做成能带来客户的经营能力</h1>
        <p>六个平台的完整运营方法 · 国际市场营销理论底座 · 国际贸易实务衔接。目标不是刷完课程，而是你能独立跑通一次从内容到询盘的完整链路。</p>
      </section>

      ${st.legacy && st.legacy.v1Completed > 0 ? `<div class="notice">
        <div>旧版学习记录已保留：改版前完成 <b>${st.legacy.v1Completed}</b> 节，其中 <b>${st.legacy.mapped || 0}</b> 节按同主题对应到新课程。原始记录未删除，可在「我的学习 → 学习记录」查看。</div>
      </div>` : ''}

      <div class="stat-grid">
        <div class="stat-card"><div class="k">课程总进度</div><div class="v">${Math.round(pct)}%</div><div class="m">已完成 ${done} / ${total} 节</div></div>
        <div class="stat-card"><div class="k">连续学习</div><div class="v">${st.streak.count || 0} 天</div><div class="m">今日 ${todayMin} 分钟</div></div>
        <div class="stat-card"><div class="k">笔记 / 收藏</div><div class="v">${st.noteBook.length} / ${st.favorites.length}</div><div class="m">案例收藏 ${st.caseFav.length}</div></div>
        <div class="stat-card"><div class="k">实战项目</div><div class="v">${projCount} / ${(D.projects || []).length}</div><div class="m">已提交成果</div></div>
      </div>

      <a class="continue" href="#/lesson?id=${nx.id}">
        <div class="cc">
          <div class="lb">${done ? '继续学习' : '从这里开始'}</div>
          <b>${nx.t}</b>
          <span>${nxMod.title} · 第 ${nx.no} 节 · 约 ${nx.mins} 分钟</span>
        </div>
        <span class="btn primary">进入课时 ${G.icon('arrow', 15)}</span>
      </a>

      <div class="sec-head"><h2>课程结构</h2><span class="more">${D.modules.length} 模块 · ${total} 节 · 约 ${Math.round(D.totalMins / 60)} 小时</span></div>
      <div class="card">
        <div class="mix">
          ${['social', 'infra', 'marketing', 'trade', 'practice'].map(k => `<i style="width:${(w[k] || 0) / wSum * 100}%;background:${GROUP_COLOR[k]}"></i>`).join('')}
        </div>
        <div class="mix-legend">
          ${['social', 'infra', 'marketing', 'trade', 'practice'].map(k => `<span><i style="background:${GROUP_COLOR[k]}"></i>${GROUP_LABEL[k]} ${Math.round((w[k] || 0) / wSum * 100)}%</span>`).join('')}
        </div>
        <div class="tiny dim" style="margin-top:10px">按建议学时统计。六大平台运营与企业数字基建是主线，营销理论是判断依据，贸易知识只保留能直接用于接单与履约的部分。</div>
      </div>

      <div class="sec-head"><h2>课程模块</h2><span class="more"><a href="#/courses">查看全部</a></span></div>
      <div class="mod-grid">
        ${D.modules.map(m => {
          const mc = m.chapters.filter(c => S.isDone(c.id)).length;
          const mp = Math.round(mc / m.chapters.length * 100);
          return `<a class="mod-card" style="--mc:${m.color}" href="#/module?id=${m.id}">
            <div class="mc-top">
              <div class="mc-ic">${G.icon(m.icon, 18)}</div>
              <div class="mc-code">${m.code}</div>
            </div>
            <b>${m.title}</b>
            <div class="mc-desc">${m.desc}</div>
            <div class="mc-foot">
              <span>${m.chapters.length} 节</span>
              <span class="grow"></span>
              <span>${mc ? '已完成 ' + mc : '未开始'}</span>
            </div>
            <div class="bar-track thin" style="margin-top:8px"><div class="bar-fill" style="width:${mp}%;background:${m.color}"></div></div>
          </a>`;
        }).join('')}
      </div>

      <div class="sec-head"><h2>接下来做什么</h2></div>
      <div class="grid3">
        ${caseOfDay ? `<a class="card" href="#/case?id=${caseOfDay.id}" style="display:block">
          <div class="tiny dim" style="margin-bottom:6px">今日案例</div>
          <b style="font-size:15px;display:block;margin-bottom:4px">${caseOfDay.name}</b>
          <div class="small muted" style="line-height:1.65">${caseOfDay.intro || ''}</div>
        </a>` : ''}
        <a class="card" href="#/practice" style="display:block">
          <div class="tiny dim" style="margin-bottom:6px">实战训练中心</div>
          <b style="font-size:15px;display:block;margin-bottom:4px">${(D.projects || []).length} 个可交付的运营项目</b>
          <div class="small muted" style="line-height:1.65">含国际生鲜企业 10 阶段全矩阵实战、账号规划、内容日历、投放方案与 B2B 开发信。</div>
        </a>
        <a class="card" href="#/control" style="display:block">
          <div class="tiny dim" style="margin-bottom:6px">企业运营管理中心</div>
          <b style="font-size:15px;display:block;margin-bottom:4px">Global Social Media Control Center</b>
          <div class="small muted" style="line-height:1.65">六大平台资产总览、企业认证对照追踪、安全自检、内容排期与 API 接入状态管理。</div>
        </a>
      </div>

      <div class="section-gap"></div>
      <div class="card flat">
        <div class="small" style="color:var(--ink-600);line-height:1.8">
          <b>内容口径：</b>平台规则与功能以官方帮助中心为准（核查日期 2026-11），行业经验一律标注为经验而非规则；案例只使用公开可查的信息，不编造数据。
          <a href="#/sources">查看资料来源与时效说明</a>
        </div>
      </div>
    `);
  };
})(window.GBA = window.GBA || {});
