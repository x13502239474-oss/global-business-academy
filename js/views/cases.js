/* 案例研究数据库 */
(function (G) {
  const D=G.data,U=G.utils;G.views=G.views||{};
  G.views.cases=function(){
    const v=G.mount(`<div class="page-title">全球商业案例</div>
      <div class="page-sub">从国际商业与营销理论角度系统分析 · 区分事实 / 分析 / 模拟</div>
      <div class="grid g2">
      ${D.cases.map(c=>`<div class="module-card t-${c.color}" data-go="case?id=${c.id}" style="min-height:120px">
        <div class="bg-num" style="font-size:40px">${c.name[0]}</div>
        <div style="font-size:26px;font-weight:850;color:var(--mc);letter-spacing:-.03em">${c.name}</div>
        <div><p style="color:var(--text);font-weight:600;margin-bottom:3px">${c.tag.slice(0,2).join(' · ')}</p>
          <p style="font-size:10.5px">${c.intro.slice(0,30)}…</p></div>
        <div class="arrow">→</div>
      </div>`).join('')}</div>
      <div class="callout" style="margin-top:18px"><span class="ct">阅读约定</span>每个案例标注 <span class="chip" style="font-size:9px">公开事实</span> 可核验信息、<span class="chip blue" style="font-size:9px">分析</span> 基于教材理论的推断、<span class="chip" style="font-size:9px">教学模拟</span> 练习设定。不虚构企业财务数据或营销成果。</div>
    `);
    v.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>G.router.go(el.dataset.go)));
  };

  G.views.caseView=function(params,query){
    const c=D.cases.find(x=>x.id===(params.id||query.id));
    if(!c){G.router.go('cases');return;}
    const tagLabel={f:'公开事实',a:'理论分析',s:'教学模拟'};
    const v=G.mount(`<div class="lesson-wrap">
      <div class="crumb" style="padding-top:6px"><button class="linkbtn" data-go="cases">案例库</button> / ${c.name}</div>
      <div class="case-hero t-${c.color}">
        <div class="case-logo">${c.name}</div>
        <h2>${c.tag.join(' · ')}</h2>
        <div>${c.tag.map(t=>`<span class="case-tag">${t}</span>`).join('')}</div>
      </div>
      <p class="small muted">${c.intro}</p>
      ${c.secs.map((s,i)=>`<div class="case-sec t-${c.color}">
        <h3><span class="cn">${i+1}</span>${s.t}</h3>
        <div class="row" style="margin-bottom:6px"><span class="chip ${s.k==='a'?'blue':''}" style="font-size:9px">${tagLabel[s.k]}</span></div>
        <p class="small" style="color:#C7D2E2">${U.esc(s.x)}</p>
      </div>`).join('')}
      <button class="btn block" style="margin-top:16px" data-go="cases">← 返回案例库</button>
    </div>`);
    v.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>G.router.go(el.dataset.go)));
  };
})(window.GBA = window.GBA || {});
