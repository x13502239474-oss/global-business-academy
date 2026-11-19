/* 特殊交互工具 —— Incoterms 比较器、分析画布等 */
(function (G) {
  const S=G.store,U=G.utils;
  G.specialTools=G.specialTools||{};

  function head(t){return `<div class="crumb" style="padding-top:6px"><button class="linkbtn" data-go="lab">实验室</button> / ${t.name}</div>
    <h1 class="page-title" style="font-size:22px">${t.name}</h1><div class="page-sub">${t.desc}</div>`;}
  function wireGo(v){v.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>G.router.go(el.dataset.go)));}

  // ---- Incoterms 比较器 ----
  const INCO = [
    {code:'EXW',cn:'工厂交货',mode:'多式',risk:'卖方所在地交货时',freight:'买方',ins:'买方',export:'买方',import:'买方'},
    {code:'FCA',cn:'货交承运人',mode:'多式',risk:'交承运人时',freight:'买方',ins:'买方',export:'卖方',import:'买方'},
    {code:'FAS',cn:'船边交货',mode:'海运',risk:'船边交货时',freight:'买方',ins:'买方',export:'卖方',import:'买方'},
    {code:'FOB',cn:'装运港船上交货',mode:'海运',risk:'装上船时',freight:'买方',ins:'买方',export:'卖方',import:'买方'},
    {code:'CFR',cn:'成本加运费',mode:'海运',risk:'装上船时',freight:'卖方',ins:'买方',export:'卖方',import:'买方'},
    {code:'CIF',cn:'成本保险加运费',mode:'海运',risk:'装上船时',freight:'卖方',ins:'卖方',export:'卖方',import:'买方'},
    {code:'CPT',cn:'运费付至',mode:'多式',risk:'交承运人时',freight:'卖方',ins:'买方',export:'卖方',import:'买方'},
    {code:'CIP',cn:'运费保险付至',mode:'多式',risk:'交承运人时',freight:'卖方',ins:'卖方',export:'卖方',import:'买方'},
    {code:'DAP',cn:'目的地交货',mode:'多式',risk:'目的地交买方处置时',freight:'卖方',ins:'卖方*',export:'卖方',import:'买方'},
    {code:'DPU',cn:'目的地卸货交货',mode:'多式',risk:'卸货后交买方时',freight:'卖方',ins:'卖方*',export:'卖方',import:'买方'},
    {code:'DDP',cn:'完税后交货',mode:'多式',risk:'目的地交买方时',freight:'卖方',ins:'卖方*',export:'卖方',import:'卖方'}
  ];
  G.specialTools.incoterms=function(t){
    let mode='all', sel=[];
    const v=G.mount(`<div class="lesson-wrap">${head(t)}
      <div class="seg" style="margin-bottom:14px">
        <button class="on" data-mode="all">全部</button><button data-mode="多式">多式联运</button><button data-mode="海运">海运专用</button>
      </div>
      <div class="card" style="margin-bottom:14px">
        <div class="small" style="margin-bottom:8px"><b>选择要对比的术语</b><span class="dim">（最多 4 个）</span></div>
        <div class="row wrap" id="chips"></div>
      </div>
      <div id="cmp"></div>
      <div class="callout" style="margin-top:14px"><span class="ct">易错提醒</span>CIF/CIP 卖方付保险费，但风险仍在装船/交承运人时转移；DAP 与 DDP 的区别在于进口清关与缴税由谁负责。带 * 表示保险非强制但实务中卖方通常会安排。</div>
    </div>`);
    wireGo(v);
    function renderChips(){
      const list=mode==='all'?INCO:INCO.filter(x=>x.mode===mode);
      v.querySelector('#chips').innerHTML=list.map(x=>`<button class="chip ${sel.includes(x.code)?'blue':''}" data-c="${x.code}" style="cursor:pointer">${x.code}</button>`).join('');
      v.querySelectorAll('[data-c]').forEach(b=>b.addEventListener('click',()=>{
        const c=b.dataset.c,i=sel.indexOf(c);
        if(i>=0)sel.splice(i,1);else{if(sel.length>=4){G.toast('最多对比 4 个');return;}sel.push(c);}
        renderChips();renderCmp();
      }));
    }
    function renderCmp(){
      const list=sel.map(c=>INCO.find(x=>x.code===c));
      if(!list.length){v.querySelector('#cmp').innerHTML='<div class="empty tiny">请先在上方选择术语</div>';return;}
      const rows=[['中文含义','cn'],['适用运输','mode'],['风险转移点','risk'],['主运费承担','freight'],['保险安排','ins'],['出口清关','export'],['进口清关','import']];
      v.querySelector('#cmp').innerHTML=`<div class="tbl-scroll"><table class="tbl">
        <tr><th>对比项</th>${list.map(x=>`<th style="color:var(--accent)">${x.code}</th>`).join('')}</tr>
        ${rows.map(r=>`<tr><td style="color:var(--text-2)">${r[0]}</td>${list.map(x=>`<td>${x[r[1]]}</td>`).join('')}</tr>`).join('')}
      </table></div>`;
    }
    v.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{
      mode=b.dataset.mode;sel=[];v.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('on',x===b));renderChips();renderCmp();
    }));
    renderChips();renderCmp();
  };

  // ---- 通用文本画布工具（PEST/SWOT/STP/ personas/brand/competitor/BMC） ----
  const CANVAS = {
    pest:{groups:['Political 政治','Economic 经济','Social 社会文化','Technological 技术'],tip:'每项填写目标国家的具体因素，并标注机会/风险。'},
    swot:{groups:['Strengths 优势','Weaknesses 劣势','Opportunities 机会','Threats 威胁'],tip:'S/W 是内部因素，O/T 是外部因素。'},
    stp:{groups:['Segmentation 细分','Targeting 目标市场','Positioning 定位'],tip:'先切分，再选择，最后占位。'},
    persona:{groups:['基本信息','需求与痛点','购买行为','触达渠道'],tip:'基于真实数据构建，避免凭空想象。'},
    brand:{groups:['目标消费者','参照框架','差异点','品牌本质'],tip:'差异点要清晰、可信、与竞品区隔。'},
    competitor:{groups:['竞品A','竞品B','竞品C','我们的优势'],tip:'从价格、品质、渠道、营销等维度逐项对比。'},
    bmc:{groups:['客户细分','价值主张','渠道通路','客户关系','收入来源','核心资源','关键业务','重要伙伴','成本结构'],tip:'商业模式画布九宫格（Osterwalder）。'}
  };
  ['pest','swot','stp','persona','brand','competitor','bmc'].forEach(key=>{
    G.specialTools[key]=function(t){
      const cfg=CANVAS[key], storeKey='canvas_'+key;
      const saved=S.get().marketReports['__canvas_'+key]||{};
      const v=G.mount(`<div class="lesson-wrap">${head(t)}
        <div class="callout"><span class="ct">使用提示</span>${cfg.tip}</div>
        <div class="row between" style="margin:14px 0 8px"><b style="font-size:13px">填写分析</b><span class="chip blue" id="saveState">自动保存</span></div>
        <div id="canvas"></div>
        <button class="btn primary block" style="margin-top:12px" id="exp">导出为笔记</button>
      </div>`);
      wireGo(v);
      v.querySelector('#canvas').innerHTML=cfg.groups.map((g,i)=>`<div class="field">
        <label>${g}</label><textarea class="input" data-cg="${i}" style="min-height:74px" placeholder="填写…">${U.esc(saved[i]||'')}</textarea></div>`).join('');
      const doSave=()=>{const data={};v.querySelectorAll('[data-cg]').forEach(el=>data[el.dataset.cg]=el.value);
        S.saveMarketReport('__canvas_'+key,data);};
      v.querySelectorAll('[data-cg]').forEach(el=>el.addEventListener('input',U.debounce(doSave,500)));
      v.querySelector('#exp').addEventListener('click',()=>{
        const data={};v.querySelectorAll('[data-cg]').forEach(el=>data[el.dataset.cg]=el.value);
        const text=cfg.groups.map((g,i)=>`【${g}】\n${data[i]||'（未填写）'}`).join('\n\n');
        S.addNote('tool_'+key, '《'+t.name+'》分析\n\n'+text);
        G.toast('已保存到我的笔记');
      });
    };
  });

  // ---- 内容日历 ----
  G.specialTools.calendar=function(t){
    const days=['周一','周二','周三','周四','周五','周六','周日'];
    const platforms=['Instagram','TikTok','YouTube','LinkedIn'];
    const v=G.mount(`<div class="lesson-wrap">${head(t)}
      <div class="callout"><span class="ct">方法</span>内容日历把"发什么、在哪发、何时发"排成节奏，保证持续输出与主题平衡。</div>
      <div class="tbl-scroll" style="margin-top:14px"><table class="tbl" style="min-width:600px">
        <tr><th>时段</th>${platforms.map(p=>`<th>${p}</th>`).join('')}</tr>
        ${days.map((d,di)=>`<tr><td style="color:var(--text-2)">${d}</td>${platforms.map((p,pi)=>`<td><input class="input" style="min-height:38px;padding:6px;font-size:11px" data-cell="${di}-${pi}" placeholder="内容主题"/></td>`).join('')}</tr>`).join('')}
      </table></div>
      <button class="btn primary block" style="margin-top:12px" id="saveCal">保存内容日历</button>
    </div>`);
    wireGo(v);
    const saved=S.get().marketReports['__calendar']||{};
    v.querySelectorAll('[data-cell]').forEach(el=>{if(saved[el.dataset.cell])el.value=saved[el.dataset.cell];el.addEventListener('input',U.debounce(()=>{
      const d={};v.querySelectorAll('[data-cell]').forEach(x=>d[x.dataset.cell]=x.value);S.saveMarketReport('__calendar',d);
    },500));});
    v.querySelector('#saveCal').addEventListener('click',()=>G.toast('内容日历已保存'));
  };

  // ---- 营销文案训练器 (AIDA) ----
  G.specialTools.copy=function(t){
    const steps=[['A','Attention 吸引注意','用钩子抓住眼球'],['I','Interest 激发兴趣','描述利益与场景'],['D','Desire 唤起欲望','强化价值与信任'],['A','Action 促成行动','明确下一步 CTA']];
    const v=G.mount(`<div class="lesson-wrap">${head(t)}
      <div class="callout"><span class="ct">AIDA 框架</span>经典文案结构：注意 → 兴趣 → 欲望 → 行动。逐段练写，最后合成一条完整文案。</div>
      ${steps.map((s,i)=>`<div class="field"><label>${s[0]} · ${s[1]}</label>
        <div class="tiny dim" style="margin-bottom:5px">${s[2]}</div>
        <textarea class="input" data-aida="${i}" placeholder="写下你的文案…" style="min-height:70px"></textarea></div>`).join('')}
      <button class="btn primary block" id="genCopy">生成完整文案</button>
      <div id="copyOut" style="margin-top:14px"></div>
    </div>`);
    wireGo(v);
    v.querySelector('#genCopy').addEventListener('click',()=>{
      const parts=[...v.querySelectorAll('[data-aida]')].map(x=>x.value.trim());
      if(parts.every(x=>!x)){G.toast('至少填写一段');return;}
      const text=parts.map((p,i)=>p?`【${steps[i][1]}】\n${p}`:'').filter(Boolean).join('\n\n');
      v.querySelector('#copyOut').innerHTML=`<div class="result-box"><b style="font-size:13px">你的文案</b><p class="small" style="margin-top:8px;white-space:pre-wrap">${U.esc(text)}</p>
        <button class="btn sm ghost block" id="saveCopy">保存到笔记</button></div>`;
      v.querySelector('#saveCopy').addEventListener('click',()=>{S.addNote('tool_copy','营销文案练习\n\n'+text);G.toast('已保存')});
    });
  };

  // ---- 信用证审核练习 ----
  G.specialTools.lc=function(t){
    const issues=[
      {text:'受益人名称：Shanghai Lumina Trading Co., Ltd.',ok:true},
      {text:'装运期：Latest shipment 2026-06-30',ok:true},
      {text:'分批装运：Partial shipments prohibited；但提交单据显示两批装运',ok:false,why:'单据显示分批装运，与信用证"禁止分批"不符。'},
      {text:'保险金额：CIF 发票金额的 110%',ok:true},
      {text:'提单抬头：To order of the buyer（而信用证要求 To order of issuing bank）',ok:false,why:'提单抬头与信用证要求不一致。'},
      {text:'交单期：15 days after B/L date',ok:true}
    ];
    const v=G.mount(`<div class="lesson-wrap">${head(t)}
      <div class="callout"><span class="ct">任务</span>找出下列信用证/单据条款中的<strong>不符点</strong>。点击每条进行判断，提交后查看解析。</div>
      <div id="lcList" style="margin:14px 0"></div>
      <button class="btn primary block" id="checkLc">提交审核</button><div id="lcOut" style="margin-top:14px"></div>
    </div>`);
    wireGo(v);
    v.querySelector('#lcList').innerHTML=issues.map((it,i)=>`<div class="quiz-q" data-lc="${i}" style="padding:12px">
      <div class="small" style="margin-bottom:8px">${U.esc(it.text)}</div>
      <div class="seg"><button data-j="${i}" data-v="ok">相符</button><button data-j="${i}" data-v="bad">不符点</button></div>
    </div>`).join('');
    const ans={};
    v.querySelectorAll('[data-j]').forEach(b=>b.addEventListener('click',()=>{const i=b.dataset.j;ans[i]=b.dataset.v==='bad';
      v.querySelectorAll(`[data-j="${i}"]`).forEach(x=>x.classList.toggle('on',x===b));}));
    v.querySelector('#checkLc').addEventListener('click',()=>{
      let score=0;issues.forEach((it,i)=>{if(ans[i]===!it.ok)score++;});
      v.querySelector('#lcOut').innerHTML=`<div class="result-box"><div class="val">${score} / ${issues.length}</div>
        <div class="tiny muted" style="margin-top:6px">识别出的相符/不符判断正确数</div>
        <div style="margin-top:12px">${issues.filter(x=>!x.ok).map(x=>`<div class="callout warn" style="font-size:12px"><b>不符点：</b>${x.why}</div>`).join('')}</div></div>`;
    });
  };

  // ---- 合同模拟 ----
  G.specialTools.contract=function(t){
    const fields=['品名与规格','数量','单价与贸易术语','付款条件','装运时间/地点','包装','保险','商检','不可抗力','争议解决'];
    const v=G.mount(`<div class="lesson-wrap">${head(t)}
      <div class="callout"><span class="ct">说明</span>按国际货物买卖合同的主要条款，填写你自己的交易条件，生成合同草稿框架。</div>
      ${fields.map((f,i)=>`<div class="field"><label>${i+1}. ${f}</label><input class="input" data-ct="${i}" placeholder="填写具体条款…"/></div>`).join('')}
      <button class="btn primary block" id="genCt">生成合同草稿</button><div id="ctOut" style="margin-top:14px"></div>
    </div>`);
    wireGo(v);
    v.querySelector('#genCt').addEventListener('click',()=>{
      const parts=[...v.querySelectorAll('[data-ct]')].map((x,i)=>`第${i+1}条 ${fields[i]}：${x.value.trim()||'（待填写）'}`);
      const text='国际货物买卖合同（教学草稿）\n\n'+parts.join('\n\n');
      v.querySelector('#ctOut').innerHTML=`<div class="result-box"><pre class="small" style="white-space:pre-wrap;font-family:var(--font)">${U.esc(text)}</pre>
        <button class="btn sm ghost block" id="saveCt" style="margin-top:10px">保存到笔记</button></div>`;
      v.querySelector('#saveCt').addEventListener('click',()=>{S.addNote('tool_contract',text);G.toast('已保存')});
    });
  };
})(window.GBA = window.GBA || {});
