/* 地区市场研究专题 —— 地图的知识入口 */
(function (G) {
  const D=G.data,S=G.store,U=G.utils,C=G.charts;G.views=G.views||{};
  G.views.market=function(params,query){
    const key=params.key||query.key;
    const r=D.regions.find(x=>x.key===key);
    if(!r){G.router.go('home');return;}
    const cases=r.cases.map(n=>D.cases.find(c=>c.name===n)||null).filter(Boolean);
    const v=G.mount(`<div class="lesson-wrap">
      <div class="crumb" style="padding-top:6px"><button class="linkbtn" data-go="home">全球地图</button> / ${r.cn}</div>
      <div class="mod-banner t-blue">
        <div class="ic">${G.icons.globe(60)}</div>
        <div class="code">MARKET BRIEF · ${r.name.toUpperCase()}</div>
        <h2>${r.cn}市场研究</h2><div class="en">${r.name}</div>
      </div>

      <div class="card" style="margin-bottom:14px">
        <div class="row between"><b style="font-size:14px">市场概览</b><span class="chip blue" style="font-size:9px">结构性知识</span></div>
        <div class="divider" style="margin:10px 0"></div>
        ${infoRow('主要商业中心',r.hubs.join(' · '))}
        ${infoRow('主要港口',r.ports.join(' · '))}
        ${infoRow('消费市场特征',r.consumers)}
        ${infoRow('跨境电商环境',r.ecom)}
        ${infoRow('贸易与供应链',r.trade)}
        ${infoRow('文化与消费文化',r.culture)}
        ${infoRow('进入策略提示',r.entry)}
      </div>

      <div class="card" style="margin-bottom:14px">
        <b style="font-size:14px">我的市场研究笔记</b>
        <p class="tiny muted" style="margin:6px 0 10px">把 PEST / SWOT 分析结论记在这里，会自动保存。</p>
        <textarea class="input" id="mktNote" style="min-height:110px" placeholder="记录你对该市场的研究结论…">${U.esc((S.get().marketReports[key]||{}).note||'')}</textarea>
        <div class="row" style="gap:8px;margin-top:8px">
          <button class="btn sm primary" id="saveMkt">保存</button>
          <button class="btn sm" data-go="tool?id=pest">用 PEST 工具分析 →</button>
        </div>
      </div>

      ${cases.length?`<div class="sec-head"><h2><span class="bar"></span>相关案例</h2></div>
      ${cases.map(c=>`<div class="list-row" data-go="case?id=${c.id}"><div class="ic">${G.icons.case(18)}</div>
        <div class="t"><b>${c.name}</b><span>${c.tag.join(' · ')}</span></div><div class="dim">→</div></div>`).join('')}`:''}

      <div class="callout warn" style="margin-top:16px"><span class="ct">数据来源说明</span>${r.dataNote} 本页不使用任何伪装成实时的伪造数据；如引用动态信息将标注来源与更新时间。</div>
    </div>`);
    v.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>G.router.go(el.dataset.go)));
    function infoRow(k,val){return `<div style="margin-bottom:10px"><div class="tiny dim">${k}</div><div class="small" style="color:var(--text)">${U.esc(val)}</div></div>`;}
    v.querySelector('#saveMkt').addEventListener('click',()=>{
      const prev=S.get().marketReports[key]||{};prev.note=v.querySelector('#mktNote').value;
      S.saveMarketReport(key,prev);G.toast('研究笔记已保存');
    });
  };
})(window.GBA = window.GBA || {});
