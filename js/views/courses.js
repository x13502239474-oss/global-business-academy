/* 课程总览 + 模块详情 */
(function (G) {
  const D = G.data, S = G.store, U = G.utils;
  function modPct(m){
    const vals = m.chapters.map(c=>S.get().progress[c.id]?.pct||0);
    return vals.length? vals.reduce((a,b)=>a+b,0)/vals.length:0;
  }
  function doneCount(m){ return m.chapters.filter(c=>S.get().progress[c.id]?.done).length; }

  G.views = G.views || {};

  G.views.courses = function(){
    const st=S.get();
    const totalPct = D.totalLessons? S.completedCount()/D.totalLessons*100:0;
    const v = G.mount(`
      <div class="page-title">课程体系</div>
      <div class="page-sub">8 大模块 · ${D.totalLessons} 个知识点 · 从零基础到跨境经营</div>
      <div class="card" style="margin-bottom:18px">
        <div class="row between" style="margin-bottom:8px"><b style="font-size:13px">课程总进度</b><span class="num grad-text" style="font-size:15px">${totalPct.toFixed(1)}%</span></div>
        <div class="bar-track" style="height:8px"><div class="bar-fill" style="width:${totalPct}%"></div></div>
        <div class="row between tiny dim" style="margin-top:8px"><span>已完成 ${S.completedCount()} / ${D.totalLessons} 个知识点</span><span>约 ${D.totalMins} 分钟</span></div>
      </div>
      ${D.modules.map(m=>`<div class="course-mod t-${m.color}" data-go="module?id=${m.id}">
        <div class="cm-head">
          <div class="cm-ic">${G.icons[m.icon](22)}</div>
          <div class="cm-t"><div class="code">${m.code}</div><b>${m.title}</b><div class="en">${m.en}</div></div>
          <div class="cm-p"><div class="num" style="color:var(--mc);font-size:15px">${Math.round(modPct(m))}%</div></div>
        </div>
        <div class="cm-body">
          <div class="cm-meta"><span>${m.chapters.length} 节</span><span>已完成 ${doneCount(m)}</span><span>${m.desc}</span></div>
          <div class="bar-track" style="height:5px"><div class="bar-fill" style="width:${modPct(m)}%;background:var(--mc)"></div></div>
        </div>
      </div>`).join('')}
      <div style="height:8px"></div>
    `);
    v.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>G.router.go(el.dataset.go)));
  };

  G.views.module = function(params,query){
    const m = D.moduleById[params.id||query.id];
    if(!m){ G.router.go('courses'); return; }
    const st=S.get();
    const v = G.mount(`
      <div class="crumb" style="padding-top:6px"><button class="linkbtn" data-go="courses">课程</button> / ${m.code}</div>
      <div class="mod-banner t-${m.color}">
        <div class="ic">${G.icons[m.icon](60)}</div>
        <div class="code">${m.code}</div>
        <h2>${m.title}</h2>
        <div class="en">${m.en}</div>
      </div>
      <div class="card" style="margin-bottom:16px">
        <div class="small" style="color:var(--text)"><b>学习目标</b></div>
        <p class="small muted" style="margin:8px 0 12px">${m.goal}</p>
        <div class="row between tiny" style="margin-bottom:5px"><span class="muted">模块进度</span><span class="num" style="color:var(--mc,var(--accent))">${Math.round(modPct(m))}%</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${modPct(m)}%;background:var(--mc,var(--accent))"></div></div>
      </div>
      <div class="sec-head"><h2><span class="bar"></span>章节目录</h2><span class="more">${m.chapters.length} 节</span></div>
      ${m.chapters.map((c,i)=>{
        const p=st.progress[c.id]||{};
        return `<div class="chapter-item ${p.done?'done':''}" data-go="lesson?id=${c.id}">
          <div class="ch-num">${p.done?'✓':String(i+1).padStart(2,'0')}</div>
          <div class="ch-t"><b>${c.t}</b><span>${c.en} · ${c.mins} 分钟 · ${c.src}</span></div>
          <div class="ch-status">${c.lab?'🛠 ':''}${p.done?'已完成':'未开始'}</div>
        </div>`;
      }).join('')}
      <div class="card flat" style="margin-top:16px">
        <div class="tiny dim">教材来源：${[...new Set(m.chapters.flatMap(c=>c.src.split(/[ ·+]/)))].filter(Boolean).join(' / ')}</div>
      </div>
    `);
    v.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>G.router.go(el.dataset.go)));
  };
})(window.GBA = window.GBA || {});
