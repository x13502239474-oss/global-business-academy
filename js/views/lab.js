/* BUSINESS LAB —— 工具实验室：目录 + 通用计算器 + 特殊交互工具 */
(function (G) {
  const D=G.data, S=G.store, U=G.utils, E=G.engine;
  G.views=G.views||{};

  G.views.lab = function(){
    let cat='all';
    const v=G.mount(`
      <div class="page-title">商业实验室</div>
      <div class="page-sub">真实计算逻辑 · 输入与结果自动保存</div>
      <div class="lab-cat">
        <button class="on" data-cat="all">全部</button>
        ${D.toolCats.map(c=>`<button data-cat="${c.k}">${c.name}</button>`).join('')}
      </div>
      <div id="toolGrid"></div>
      <div class="sec-head"><h2><span class="bar"></span>计算记录</h2><span class="more" id="histCount"></span></div>
      <div id="toolHistory"></div>
      <button class="btn sm ghost block" id="clearHist" style="margin-top:8px">清空计算记录</button>
    `);
    function renderGrid(){
      const list = cat==='all'?D.tools:D.tools.filter(t=>t.cat===cat);
      // 按分类分组
      v.querySelector('#toolGrid').innerHTML = D.toolCats.filter(c=>cat==='all'||c.k===cat).map(c=>{
        const items=list.filter(t=>t.cat===c.k);
        if(!items.length) return '';
        return `<div class="sec-head" style="margin-top:8px"><h2><span class="bar"></span>${c.name}</h2><span class="more">${items.length} 个工具</span></div>
        <div class="tool-grid">${items.map(t=>`<div class="tool-tile t-${t.color}" data-tool="${t.id}">
          <div class="ti">${G.icons[t.icon]?G.icons[t.icon](18):'◈'}</div>
          <div><b>${t.name}</b><div class="tg">${t.desc.slice(0,20)}…</div></div>
          <div class="go">→</div>
        </div>`).join('')}</div>`;
      }).join('');
      v.querySelectorAll('[data-tool]').forEach(el=>el.addEventListener('click',()=>G.router.go('tool?id='+el.dataset.tool)));
    }
    function renderHist(){
      const h=S.get().toolHistory;
      v.querySelector('#histCount').textContent=h.length+' 条';
      v.querySelector('#toolHistory').innerHTML = h.length? h.slice(0,8).map(x=>`
        <div class="hist-item"><div class="ht"><span>${D.toolById[x.tool]?.name||x.tool} · ${U.fmtDate(x.at)}</span><button class="linkbtn" data-reuse="${x.id}" style="font-size:10px">复用参数</button></div>
        <div class="hv">${(x.outputs.rows||[]).slice(0,2).map(r=>r[0]+': '+r[1]).join(' · ')}</div></div>`).join('')
        :'<div class="empty"><div class="e-ic">◷</div><div class="tiny">还没有计算记录</div></div>';
      v.querySelectorAll('[data-reuse]').forEach(b=>b.addEventListener('click',()=>{
        const rec=S.get().toolHistory.find(x=>x.id===b.dataset.reuse);
        G.router.go('tool?id='+rec.tool+'&reuse='+rec.id);
      }));
    }
    v.querySelectorAll('[data-cat]').forEach(b=>b.addEventListener('click',()=>{
      cat=b.dataset.cat;v.querySelectorAll('[data-cat]').forEach(x=>x.classList.toggle('on',x===b));renderGrid();
    }));
    v.querySelector('#clearHist').addEventListener('click',()=>{S.clearToolHistory();renderHist();G.toast('已清空');});
    renderGrid();renderHist();
  };

  G.views.tool = function(params,query){
    const t=D.toolById[params.id||query.id];
    if(!t){G.router.go('lab');return;}
    // 特殊工具分派
    if(t.special) return G.specialTools[t.special](t,query);

    const reuse = query.reuse? S.get().toolHistory.find(x=>x.id===query.reuse):null;
    const vals={};(t.fields||[]).forEach(f=>vals[f.k]= reuse&&reuse.inputs[f.k]!=null?reuse.inputs[f.k]:f.def);

    const v=G.mount(`<div class="lesson-wrap">
      <div class="crumb" style="padding-top:6px"><button class="linkbtn" data-go="lab">实验室</button> / ${t.name}</div>
      <h1 class="page-title" style="font-size:22px">${t.name}</h1>
      <div class="page-sub">${t.desc}</div>
      <div class="card">
        ${(t.fields||[]).map(f=>fieldHTML(f,vals[f.k])).join('')}
        <button class="btn primary block" id="calcBtn">开始计算</button>
      </div>
      <div id="resultArea" style="margin-top:16px"></div>
    </div>`);
    v.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>G.router.go(el.dataset.go)));
    v.querySelector('#calcBtn').addEventListener('click',()=>{
      const inputs={};
      (t.fields||[]).forEach(f=>{const el=v.querySelector('[data-field="'+f.k+'"]');inputs[f.k]=el.value;});
      const fn=E[t.fn];
      if(!fn){G.toast('计算逻辑未就绪');return;}
      const r=fn(inputs);
      const out=t.calc(r);
      G.renderResult(v.querySelector('#resultArea'),t,inputs,out);
      S.addToolHistory(t.id,inputs,out);
    });
  };

  function fieldHTML(f,val){
    let ctrl;
    if(f.type==='select'){
      ctrl=`<select class="input" data-field="${f.k}">${f.opts.map(o=>`<option value="${o[0]}" ${String(val)===o[0]?'selected':''}>${o[1]}</option>`).join('')}</select>`;
    } else {
      ctrl=`<input class="input" type="number" inputmode="decimal" data-field="${f.k}" value="${U.esc(val)}" ${f.min!=null?'min="'+f.min+'"':''}/>`;
    }
    return `<div class="field"><label>${f.label}${f.unit?' ('+f.unit+')':''}</label>${ctrl}</div>`;
  }

  G.renderResult = function(el,t,inputs,out){
    el.innerHTML=`<div class="result-box">
      <div class="row between" style="margin-bottom:12px"><b style="font-size:14px">计算结果</b><span class="chip blue" style="font-size:10px">已保存</span></div>
      <div class="result-grid">${out.rows.map(r=>`<div class="result-cell"><div class="k">${r[0]}</div><div class="v">${r[1]}</div></div>`).join('')}</div>
      ${out.table?`<div class="divider"></div><div class="tbl-scroll"><table class="tbl"><tr><th>期数</th><th>流入</th><th>流出</th><th>净流</th><th>余额</th></tr>${out.table.map(r=>`<tr><td>${r.m}</td><td>${U.num(r.inflow,0)}</td><td>${U.num(r.outflow,0)}</td><td style="color:${r.net>=0?'var(--down)':'var(--up)'}">${U.num(r.net,0)}</td><td class="hi">${U.num(r.bal,0)}</td></tr>`).join('')}</table></div>`:''}
      <div class="divider"></div>
      <div class="tiny dim">公式：${out.formula||''}</div>
      ${out.note?`<div class="callout warn" style="margin-top:8px;font-size:12px">${out.note}</div>`:''}
      <button class="btn sm ghost block" style="margin-top:12px" id="backLab">← 返回实验室</button>
    </div>`;
    el.querySelector('#backLab').addEventListener('click',()=>G.router.go('lab'));
  };
})(window.GBA = window.GBA || {});
