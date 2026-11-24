/* 实战训练中心：项目列表 + 项目详情 + 成果提交 */
(function (G) {
  const D = G.data, S = G.store, U = G.utils;
  G.views = G.views || {};

  G.views.practice = function () {
    G.setChrome('practice', '实战训练中心');
    const list = D.projects || [];
    const subs = S.get().projectSubs || {};

    G.mount(`
      <div class="page-title">实战训练中心</div>
      <div class="page-sub">${list.length} 个项目 · 以作品为成果，不以分数为成果 · 每个项目都有任务说明、操作步骤、参考示例与完成标准</div>

      <div class="card" style="margin-bottom:22px">
        <div class="small" style="color:var(--ink-600);line-height:1.85">
          <b>怎么用这套项目：</b>不要等"学完再做"。每个模块学完后，挑一个对应项目做到能交付为止——做不出来的地方，就是你需要回去补的课。
          八个项目串起来，就是一份完整的海外社媒营销方案。
        </div>
      </div>

      <div class="proj-grid">
        ${list.map(p => {
          const sub = subs[p.id];
          const doneN = sub ? Object.values(sub.done || {}).filter(Boolean).length : 0;
          return `<a class="proj-card" href="#/project?id=${p.id}">
            <div class="pn">${p.code} · ${p.platform}</div>
            <b>${p.title}</b>
            <p>${p.brief}</p>
            <div class="pf">
              <span class="chip line">${p.hours}</span>
              <span class="chip line">${p.level}</span>
              <span class="grow"></span>
              <span>${sub ? (sub.text ? '已提交' : '进行中') : '未开始'}</span>
            </div>
            <div class="bar-track thin" style="margin-top:9px"><div class="bar-fill" style="width:${Math.round(doneN / Math.max(p.deliver.length, 1) * 100)}%"></div></div>
          </a>`;
        }).join('')}
      </div>

      <div class="section-gap"></div>
      <div class="card flat">
        <b style="font-size:13.5px">结业标准</b>
        <div class="small muted" style="margin-top:6px;line-height:1.85">
          完成项目一（账号规划）+ 至少三个平台专项项目 + 项目八（完整海外营销项目），并提交可执行文档，视为结业。
          不设统一考试：能否把方案交给别人执行，是唯一的验收标准。
        </div>
      </div>
    `);
  };

  G.views.project = function (params, query) {
    const id = params.id || query.id;
    const p = (D.projects || []).find(x => x.id === id);
    if (!p) { G.router.go('practice'); return; }
    G.setChrome('practice', p.title);
    const sub = S.getProject(id) || { text: '', done: {}, at: 0 };

    G.mount(`
      <div class="crumb"><a href="#/practice">实战训练中心</a> / <span>${p.code}</span></div>

      <div class="mod-banner" style="--mc:#15803D">
        <div class="code">${p.code} · ${p.platform} · ${p.hours}</div>
        <h1>${p.title}</h1>
        <div class="goal">${p.brief}</div>
        <div class="mb-foot">
          <span class="chip">${p.level}</span>
          <span class="chip">${p.deliver.length} 项交付物</span>
          ${sub.text ? '<span class="chip ok">已提交成果</span>' : ''}
        </div>
      </div>

      <div class="sec-head"><h2>任务说明</h2></div>
      <div class="prose" style="font-size:14.5px">
        ${p.scene.split('\n').map(t => `<p>${t}</p>`).join('')}
      </div>

      <div class="sec-head"><h2>开始前准备</h2></div>
      <div class="grid2">
        ${p.inputs.map(x => `<div class="card pad-s"><b style="font-size:13px">${x.name}</b><div class="small muted" style="margin-top:4px;line-height:1.7">${x.tip}</div></div>`).join('')}
      </div>

      <div class="sec-head"><h2>操作步骤</h2></div>
      <ul class="step-list">
        ${p.steps.map(s => `<li><b>${s.t}</b><span>${s.d}</span></li>`).join('')}
      </ul>

      ${(p.templates || []).length ? `<div class="sec-head"><h2>参考示例与模板</h2></div>
        ${p.templates.map((t, i) => `<details class="accordion" style="border:1px solid var(--line);border-radius:10px;margin-bottom:8px;background:#fff">
          <summary style="padding:13px 15px;font-weight:600;font-size:13.5px;cursor:pointer;display:flex;align-items:center;gap:8px">${t.t}<span class="grow"></span><span class="tiny dim">展开</span></summary>
          <div style="padding:0 15px 15px;font-size:13.5px;color:var(--ink-600);line-height:1.8">${t.body}</div>
        </details>`).join('')}` : ''}

      <div class="sec-head"><h2>交付物与完成标准</h2></div>
      ${p.deliver.map((d, i) => `<label class="deliverable" style="display:block;cursor:pointer">
        <div class="row" style="align-items:flex-start;gap:9px">
          <input type="checkbox" data-task="${i}" ${sub.done && sub.done[i] ? 'checked' : ''} style="margin-top:5px;accent-color:#15803D"/>
          <div><b>${d.t}</b><div style="margin-top:3px">${d.d}</div></div>
        </div>
      </label>`).join('')}

      <div class="sec-head"><h2>我的成果</h2><span class="more">本地保存 · 可随时回来补充</span></div>
      <div class="card">
        <textarea class="input" id="subText" placeholder="把成果写在这里：定位陈述、内容日历、脚本、开发信原文…（建议同时存一份到自己的文档里）" style="min-height:180px">${U.esc(sub.text || '')}</textarea>
        <div class="row between" style="margin-top:10px">
          <span class="tiny dim">${sub.at ? '上次保存：' + U.fmtDate(sub.at) : '尚未保存'}</span>
          <div class="row" style="gap:8px">
            <button class="btn sm" id="exportOne">导出文本</button>
            <button class="btn sm primary" id="saveSub">保存成果</button>
          </div>
        </div>
      </div>

      <div class="sec-head"><h2>自检标准</h2></div>
      <div class="card flat"><ul style="margin:0;padding-left:20px">${(p.criteria || []).map(c => `<li style="font-size:13.5px;color:var(--ink-600);margin-bottom:6px">${c}</li>`).join('')}</ul></div>

      <div class="row between" style="margin-top:22px">
        <a class="btn sm" href="#/practice">${G.icon('back', 14)} 返回项目列表</a>
        <a class="btn sm" href="#/lesson?id=${p.learn || D.allLessons[0].id}">复习对应课时</a>
      </div>
    `);

    const ta = document.getElementById('subText');
    document.querySelectorAll('[data-task]').forEach(cb => cb.addEventListener('change', () => {
      S.toggleTask(id, +cb.dataset.task);
    }));
    document.getElementById('saveSub').addEventListener('click', () => {
      S.saveProject(id, { text: ta.value });
      G.toast('成果已保存到本机');
    });
    document.getElementById('exportOne').addEventListener('click', () => {
      const blob = new Blob([`${p.title}\n\n${ta.value}`], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = p.id + '-成果.txt';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    });
  };
})(window.GBA = window.GBA || {});
