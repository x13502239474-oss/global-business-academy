/* 我的学习：进度 / 笔记 / 收藏 / 计划 / 数据 */
(function (G) {
  const D = G.data, S = G.store, U = G.utils;
  G.views = G.views || {};

  function planSchedule(weeklyMin, weeks) {
    const out = [];
    let cur = { mins: 0, items: [] };
    const push = () => { if (cur.items.length) { out.push(cur); cur = { mins: 0, items: [] }; } };
    D.allLessons.forEach(l => {
      if (S.isDone(l.id)) return;
      cur.items.push(l); cur.mins += l.mins;
      if (cur.mins >= weeklyMin) push();
      if (out.length >= weeks) return;
    });
    push();
    return out.slice(0, weeks);
  }

  G.views.me = function () {
    G.setChrome('me', '我的学习');
    const st = S.get();
    const done = S.completedCount();
    const pct = Math.round(done / D.totalLessons * 100);
    const recent = (st.visited || []).map(id => D.lessonById[id]).filter(Boolean).slice(0, 8);
    const favLessons = st.favorites.map(id => D.lessonById[id]).filter(Boolean);
    const favCases = (D.cases || []).filter(c => (st.caseFav || []).includes(c.id));
    const subs = st.projectSubs || {};
    const planRows = planSchedule(st.plan.weeklyMin || 420, st.plan.weeks || 8);

    G.mount(`
      <div class="profile-head">
        <div class="avatar">${(st.settings.name || '学').slice(0, 1)}</div>
        <div class="grow">
          <div class="nm">${U.esc(st.settings.name || '学习者')}</div>
          <div class="lv">已完成 ${done} 节 · 总进度 ${pct}% · 连续 ${st.streak.count || 0} 天</div>
        </div>
        <button class="btn sm" id="renameBtn">修改昵称</button>
      </div>

      <div class="stat-grid">
        <div class="stat-card"><div class="k">课时完成</div><div class="v">${done}</div><div class="m">共 ${D.totalLessons} 节</div></div>
        <div class="stat-card"><div class="k">笔记</div><div class="v">${st.noteBook.length}</div><div class="m">条</div></div>
        <div class="stat-card"><div class="k">收藏</div><div class="v">${favLessons.length} / ${favCases.length}</div><div class="m">课时 / 案例</div></div>
        <div class="stat-card"><div class="k">实战提交</div><div class="v">${Object.keys(subs).filter(k => subs[k].text).length}</div><div class="m">共 ${(D.projects || []).length} 个项目</div></div>
      </div>

      ${st.legacy && st.legacy.v1Completed ? `<div class="notice">
        <div><b>旧版记录：</b>改版前完成 ${st.legacy.v1Completed} 节，已按同主题映射 ${st.legacy.mapped || 0} 节到新课程，原始数据完整保留（未删除任何记录）。</div>
      </div>` : ''}

      <div class="sec-head"><h2>学习计划</h2><span class="more"><button class="btn ghost sm" id="mkPlan">重新生成</button></span></div>
      <div class="card">
        <div class="row wrap" style="gap:14px;margin-bottom:12px">
          <label class="row" style="gap:6px;font-size:13px">每周可投入
            <select class="input" id="planMin" style="width:auto;min-height:34px;padding:4px 8px">
              ${[180, 300, 420, 600, 840].map(m => `<option value="${m}" ${m === (st.plan.weeklyMin || 420) ? 'selected' : ''}>${m / 60} 小时</option>`).join('')}
            </select>
          </label>
          <label class="row" style="gap:6px;font-size:13px">计划周期
            <select class="input" id="planWeeks" style="width:auto;min-height:34px;padding:4px 8px">
              ${[4, 8, 12, 16].map(w => `<option value="${w}" ${w === (st.plan.weeks || 8) ? 'selected' : ''}>${w} 周</option>`).join('')}
            </select>
          </label>
        </div>
        <div class="tbl-scroll" style="margin:0">
          <table class="week-table">
            <tr><th style="width:70px">周次</th><th>建议完成</th><th style="width:70px">时长</th></tr>
            ${planRows.length ? planRows.map((w, i) => `<tr>
              <td>第 ${i + 1} 周</td>
              <td>${w.items.map(x => x.t).join('；')}</td>
              <td class="nowrap">${w.mins} 分</td>
            </tr>`).join('') : '<tr><td colspan="3" style="padding:16px;color:var(--ink-400)">全部课时已完成，可以去做结业项目了。</td></tr>'}
          </table>
        </div>
        <div class="tiny dim" style="margin-top:9px">计划按剩余课时的建议时长自动排布，只作节奏参考；平台课程建议按模块整块学，不要跨模块跳。</div>
      </div>

      <div class="sec-head"><h2>最近学习</h2><span class="more">${recent.length} 条</span></div>
      ${recent.length ? recent.map(l => `<a class="list-row" href="#/lesson?id=${l.id}">
        <div class="ic">${S.isDone(l.id) ? '✓' : '·'}</div>
        <div class="t"><b>${l.t}</b><span>${D.moduleById[l.moduleId].title}</span></div>
        <div class="r">${S.isDone(l.id) ? '已完成' : (st.progress[l.id]?.pct || 0) + '%'}</div>
      </a>`).join('') : '<div class="empty"><b>还没有学习记录</b>从首页任意一节开始</div>'}

      <div class="sec-head"><h2>我的笔记</h2><span class="more">${st.noteBook.length} 条</span></div>
      <div class="card">
        ${st.noteBook.length ? st.noteBook.slice(0, 20).map(n => {
          const l = D.lessonById[n.lessonId];
          return `<div style="border-bottom:1px solid var(--line);padding:9px 0">
            <div class="row between tiny dim" style="margin-bottom:3px">
              <a href="#/lesson?id=${n.lessonId}" style="color:var(--blue-700)">${l ? l.t : n.lessonId}</a>
              <span>${U.fmtDate(n.at)}</span>
            </div>
            <div style="font-size:13px;color:var(--ink-600);white-space:pre-wrap">${U.esc(n.text)}</div>
          </div>`;
        }).join('') : '<div class="tiny dim">还没有笔记。建议每节只记一句：“我准备怎么用”。</div>'}
      </div>

      <div class="sec-head"><h2>收藏</h2></div>
      <div class="grid2">
        <div class="card">
          <b style="font-size:13.5px">课时（${favLessons.length}）</b>
          <div style="margin-top:8px">${favLessons.length ? favLessons.map(l => `<a href="#/lesson?id=${l.id}" style="display:block;font-size:13px;padding:5px 0;color:var(--ink-700)">${l.t}</a>`).join('') : '<div class="tiny dim">暂无</div>'}</div>
        </div>
        <div class="card">
          <b style="font-size:13.5px">案例（${favCases.length}）</b>
          <div style="margin-top:8px">${favCases.length ? favCases.map(c => `<a href="#/case?id=${c.id}" style="display:block;font-size:13px;padding:5px 0;color:var(--ink-700)">${c.name}</a>`).join('') : '<div class="tiny dim">暂无</div>'}</div>
        </div>
      </div>

      <div class="sec-head"><h2>数据与设置</h2></div>
      <div class="menu-list">
        <a class="menu-item" href="#/sources"><span class="mi">${G.icon('library', 17)}</span>资料来源与时效说明<span class="mv">${G.icon('arrow', 14)}</span></a>
        <button class="menu-item" id="exportAll"><span class="mi">${G.icon('doc', 17)}</span>导出学习数据（JSON）<span class="mv">${G.icon('arrow', 14)}</span></button>
        <button class="menu-item" id="resetAll"><span class="mi">${G.icon('trash', 17)}</span>清空本机学习数据<span class="mv" style="color:var(--danger)">不可恢复</span></button>
      </div>
      <div class="source-note">
        所有进度、笔记与成果都保存在这台设备的浏览器（LocalStorage）中，不上传服务器。换设备或清理浏览器数据会丢失，重要成果请用上面的导出功能备份。
      </div>
    `);

    document.getElementById('renameBtn').addEventListener('click', () => {
      const name = prompt('输入你的昵称', st.settings.name || '学习者');
      if (name && name.trim()) { S.setSetting('name', name.trim().slice(0, 16)); G.views.me(); }
    });
    const regenerate = () => {
      const weeklyMin = +document.getElementById('planMin').value;
      const weeks = +document.getElementById('planWeeks').value;
      S.setPlan({ weeklyMin, weeks });
      G.views.me();
    };
    document.getElementById('planMin').addEventListener('change', regenerate);
    document.getElementById('planWeeks').addEventListener('change', regenerate);
    document.getElementById('mkPlan').addEventListener('click', regenerate);

    document.getElementById('exportAll').addEventListener('click', () => {
      const blob = new Blob([S.exportJSON()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'gba-learning-data-' + U.todayKey() + '.json';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    });
    document.getElementById('resetAll').addEventListener('click', () => {
      if (confirm('确定清空本机所有学习记录、笔记与成果？此操作不可恢复。建议先导出备份。')) {
        S.reset(); G.toast('已清空'); G.views.me();
      }
    });
  };
})(window.GBA = window.GBA || {});
