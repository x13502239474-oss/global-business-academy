/* 跨境商业模拟器 + 流量到订单链路（平台三大重点之二、三） */
(function (G) {
  const D=G.data,S=G.store,U=G.utils,C=G.charts,E=G.engine;
  G.views=G.views||{};

  const PRODUCTS=[
    {id:'home',name:'家居收纳套装',cost:65,price:299,icon:'◧'},
    {id:'led',name:'智能 LED 灯',cost:42,price:199,icon:'☀'},
    {id:'bag',name:'环保帆布包',cost:18,price:99,icon:'◰'},
    {id:'kitchen',name:'厨房小工具套装',cost:38,price:169,icon:'◈'}
  ];
  const COUNTRIES=[
    {id:'de',name:'德国',ship:38,mult:1.0,tariff:0.04,icon:'🇩🇪'},
    {id:'us',name:'美国',ship:45,mult:1.1,tariff:0.05,icon:'🇺🇸'},
    {id:'sg',name:'新加坡',ship:28,mult:0.9,tariff:0,icon:'🇸🇬'},
    {id:'jp',name:'日本',ship:35,mult:1.05,tariff:0.03,icon:'🇯🇵'}
  ];
  const SHIPPING=[
    {id:'sea',name:'海运',perUnit:8,days:'25-35天',emoji:'🚢'},
    {id:'air',name:'空运',perUnit:24,days:'7-12天',emoji:'✈️'},
    {id:'warehouse',name:'海外仓',perUnit:14,days:'2-5天',emoji:'🏭'}
  ];

  G.views.simulator=function(){
    const saved=S.get().sim||{};
    const state={
      product:saved.product||'home', country:saved.country||'de', shipping:saved.shipping||'sea',
      qty:saved.qty||300, price:saved.price||null, ad:saved.ad||15000, platformRate:saved.platformRate||15
    };
    const v=G.mount(`<div class="lesson-wrap">
      <div class="crumb" style="padding-top:6px"><button class="linkbtn" data-go="home">指挥中心</button> / 跨境经营模拟器</div>
      <h1 class="page-title" style="font-size:22px">跨境商业经营模拟器</h1>
      <div class="page-sub">自己选择产品、成本、售价、目标国家与广告预算，经营一家跨境企业。<span class="chip blue" style="font-size:9px">教学模拟数据</span></div>

      <div class="sim-flow" id="simFlow"></div>

      <div class="card" style="margin-bottom:14px"><b style="font-size:13px">① 选择产品</b>
        <div class="grid g2" style="margin-top:10px">${PRODUCTS.map(p=>`<div class="tool-tile t-blue" data-p="${p.id}" style="min-height:80px">
          <div style="font-size:22px">${p.icon}</div><b style="font-size:12px">${p.name}</b><div class="tg">成本 ¥${p.cost} · 建议价 ¥${p.price}</div></div>`).join('')}</div>
      </div>
      <div class="card" style="margin-bottom:14px"><b style="font-size:13px">② 目标国家</b>
        <div class="grid g2" style="margin-top:10px">${COUNTRIES.map(c=>`<div class="chip" data-country="${c.id}" style="padding:12px;cursor:pointer;justify-content:flex-start;font-size:13px">
          <span style="font-size:18px">${c.icon}</span> ${c.name}</div>`).join('')}</div>
      </div>
      <div class="card" style="margin-bottom:14px"><b style="font-size:13px">③ 物流方式</b>
        <div class="grid g3" style="margin-top:10px">${SHIPPING.map(s=>`<div class="chip" data-ship="${s.id}" style="padding:12px;cursor:pointer;flex-direction:column;gap:4px;text-align:center">
          <span style="font-size:20px">${s.emoji}</span><span>${s.name}</span><span class="dim tiny">¥${s.perUnit}/单</span></div>`).join('')}</div>
      </div>
      <div class="card" style="margin-bottom:14px"><b style="font-size:13px">④ 经营参数</b>
        <div class="grid g2" style="margin-top:10px">
          <div class="field"><label>售价 (¥/件)</label><input class="input" type="number" id="sPrice" value="${state.price||''}" placeholder="留空用建议价"/></div>
          <div class="field"><label>预计销量 (件)</label><input class="input" type="number" id="sQty" value="${state.qty}"/></div>
          <div class="field"><label>广告预算 (¥)</label><input class="input" type="number" id="sAd" value="${state.ad}"/></div>
          <div class="field"><label>平台费率 %</label><input class="input" type="number" id="sPlat" value="${state.platformRate}"/></div>
        </div>
        <button class="btn primary block" id="runSim">运行模拟</button>
      </div>
      <div id="simOut"></div>
      <div class="callout warn" style="margin-top:14px"><span class="ct">数据说明</span>本模拟器所有成本、费率、售价与市场系数均为<strong>教学模拟设定</strong>，用于演示经营逻辑，不代表任何真实市场行情或企业数据。</div>
    </div>`);
    v.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>G.router.go(el.dataset.go)));

    function renderFlow(){
      const steps=['选产品','选市场','定物流','设参数','看结果'];
      const doneCount=[!!state.product,!!state.country,!!state.shipping,true,!!v.querySelector('#simOut').innerHTML].filter(Boolean).length;
      v.querySelector('#simFlow').innerHTML=steps.map((s,i)=>`<div class="sim-step ${i<doneCount?'done':''}">
        <div class="sd">${i<doneCount?'✓':i+1}</div><div class="sl">${s}</div></div>${i<steps.length-1?'<div class="sim-line"></div>':''}`).join('');
    }
    function mark(sel,key,val){v.querySelectorAll(sel).forEach(el=>el.classList.toggle('blue',el.dataset[key]===val));}
    v.querySelectorAll('[data-p]').forEach(el=>el.addEventListener('click',()=>{state.product=el.dataset.p;
      const p=PRODUCTS.find(x=>x.id===state.product);v.querySelector('#sPrice').value=p.price;state.price=p.price;mark('[data-p]','p',state.product);renderFlow();}));
    v.querySelectorAll('[data-country]').forEach(el=>el.addEventListener('click',()=>{state.country=el.dataset.country;mark('[data-country]','country',state.country);renderFlow();}));
    v.querySelectorAll('[data-ship]').forEach(el=>el.addEventListener('click',()=>{state.shipping=el.dataset.ship;mark('[data-ship]','ship',state.shipping);renderFlow();}));
    // 初始化选择
    const initP=PRODUCTS.find(x=>x.id===state.product);if(!state.price)v.querySelector('#sPrice').value=initP.price;
    mark('[data-p]','p',state.product);mark('[data-country]','country',state.country);mark('[data-ship]','ship',state.shipping);
    renderFlow();

    v.querySelector('#runSim').addEventListener('click',()=>{
      state.price=+v.querySelector('#sPrice').value||initP.price;
      state.qty=+v.querySelector('#sQty').value||1;state.ad=+v.querySelector('#sAd').value||0;state.platformRate=+v.querySelector('#sPlat').value||0;
      const p=PRODUCTS.find(x=>x.id===state.product),c=COUNTRIES.find(x=>x.id===state.country),sh=SHIPPING.find(x=>x.id===state.shipping);
      S.saveSim(state);
      // 计算（教学模型）
      const effPrice=state.price*c.mult;
      const revenue=effPrice*state.qty;
      const productCost=p.cost*state.qty;
      const shipCost=(sh.perUnit+c.ship)*state.qty;
      const tariff=revenue*c.tariff;
      const platformFee=revenue*state.platformRate/100;
      const variable=productCost+shipCost+tariff+platformFee+state.ad;
      const net=revenue-variable;
      const gross=revenue-productCost-shipCost-platformFee-tariff;
      const be=E.breakeven({price:effPrice,varCost:p.cost+sh.perUnit+c.ship+effPrice*c.platformRate/100+effPrice*c.tariff,fixed:state.ad});
      const roi=state.ad?(net/state.ad*100):0;
      v.querySelector('#simOut').innerHTML=`<div class="result-box" style="margin-top:6px">
        <div class="row between"><b style="font-size:14px">模拟经营结果</b><span class="chip blue">${p.name} → ${c.name}</span></div>
        <div class="result-grid" style="margin-top:12px">
          <div class="result-cell"><div class="k">销售收入</div><div class="v" style="color:var(--cyan)">¥${U.num(revenue,0)}</div></div>
          <div class="result-cell"><div class="k">毛利</div><div class="v" style="color:${gross>=0?'var(--down)':'var(--up)'}">¥${U.num(gross,0)}</div></div>
          <div class="result-cell"><div class="k">净利润</div><div class="v" style="color:${net>=0?'var(--down)':'var(--up)'}">¥${U.num(net,0)}</div></div>
          <div class="result-cell"><div class="k">广告 ROI</div><div class="v">${U.num(roi,0)}%</div></div>
        </div>
        <div class="divider"></div>
        <div class="tiny muted" style="line-height:1.9">
          单位售价(含市场系数)：¥${U.num(effPrice)}　产品成本：¥${U.num(productCost,0)}<br>
          物流费用：¥${U.num(shipCost,0)}　关税：¥${U.num(tariff,0)}　平台费：¥${U.num(platformFee,0)}　广告：¥${U.num(state.ad,0)}<br>
          盈亏平衡销量：<b style="color:var(--accent)">${isFinite(be.units)?be.units+' 件':'无法达到'}</b>（当前 ${state.qty} 件）
        </div>
        <div class="callout ${net>=0?'ok':'warn'}" style="margin-top:10px"><span class="ct">经营诊断</span>${net>=0?
          '这笔模拟生意是盈利的。可尝试提高销量或优化物流以扩大利润。':
          '这笔模拟生意是亏损的。考虑提高售价、降低广告预算、换用更经济的物流或提高销量。'}</div>
        <button class="btn sm block" style="margin-top:10px" data-go="chain">查看从流量到订单如何产生这些销量 →</button>
      </div>`;
      v.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>G.router.go(el.dataset.go)));
      renderFlow();
      v.querySelector('#simOut').scrollIntoView({behavior:'smooth',block:'start'});
    });
  };

  // ---- 流量到订单链路模拟器 ----
  G.views.chain=function(){
    const saved=S.get().chain||{};
    const defaults={exposure:100000,r1:5,r2:20,r3:30,r4:25,r5:80,aov:299,gm:55,adCost:15000};
    const s=Object.assign({},defaults,saved);
    const v=G.mount(`<div class="lesson-wrap">
      <div class="crumb" style="padding-top:6px"><button class="linkbtn" data-go="home">指挥中心</button> / 流量到订单链路</div>
      <h1 class="page-title" style="font-size:22px">从流量到订单</h1>
      <div class="page-sub">打通社媒营销与国际贸易：看曝光如何一步步变成收入。<span class="chip blue" style="font-size:9px">教学模拟</span></div>

      <div class="card" style="margin-bottom:14px">
        <b style="font-size:13px">各环节转化率</b>
        <p class="tiny muted" style="margin:6px 0 12px">调整每一环的转化率，观察最终订单与收入的变化。</p>
        ${rateField('exposure','内容曝光量',s.exposure,'',0)}
        ${rateField('r1','曝光 → 潜在客户',s.r1,'%',100)}
        ${rateField('r2','潜客 → 询盘',s.r2,'%',100)}
        ${rateField('r3','询盘 → 报价后成交意向',s.r3,'%',100)}
        ${rateField('r4','报价 → 谈判 → 订单',s.r4,'%',100)}
        ${rateField('r5','订单 → 成功收款',s.r5,'%',100)}
        <div class="grid g2">
          <div class="field"><label>客单价 ¥</label><input class="input" type="number" id="aov" value="${s.aov}"/></div>
          <div class="field"><label>毛利率 %</label><input class="input" type="number" id="gm" value="${s.gm}"/></div>
        </div>
        <div class="field"><label>广告/内容投入 ¥</label><input class="input" type="number" id="adCost" value="${s.adCost}"/></div>
        <button class="btn primary block" id="runChain">计算链路</button>
      </div>
      <div id="chainOut"></div>
      <div class="callout" style="margin-top:14px"><span class="ct">关键洞察</span>曝光、潜客、询盘、报价、订单、收款——每一环都有流失。改善中段与后段的转化率，往往比单纯买更多流量更划算。这条链路把 M06 社媒营销与 M04 贸易实务连成一体。</div>
    </div>`);
    v.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>G.router.go(el.dataset.go)));
    function rateField(k,label,val,unit,max){return `<div class="field"><label>${label}</label>
      <div class="row"><input class="input" type="number" id="${k}" value="${val}" style="flex:1"/>
      <input type="range" min="0" max="${max||100}" value="${val}" data-range="${k}" style="width:110px;accent-color:var(--accent)"/></div>
      <span class="tiny dim">${unit||''}</span></div>`;}
    v.querySelectorAll('[data-range]').forEach(r=>r.addEventListener('input',()=>{v.querySelector('#'+r.dataset.range).value=r.value;}));
    v.querySelector('#runChain').addEventListener('click',()=>{
      const i={};['exposure','r1','r2','r3','r4','r5','aov','gm','adCost'].forEach(k=>i[k]=+v.querySelector('#'+k).value||0);
      S.saveChain(i);
      const r=E.chain(i);
      v.querySelector('#chainOut').innerHTML=`<div class="result-box">
        <b style="font-size:14px">转化漏斗</b>
        <div style="margin-top:12px">${C.funnel(r.steps)}</div>
        <div class="divider"></div>
        <div class="result-grid">
          <div class="result-cell"><div class="k">最终订单</div><div class="v" style="color:var(--cyan)">${U.num(r.orders,0)} 单</div></div>
          <div class="result-cell"><div class="k">销售收入</div><div class="v">¥${U.num(r.revenue,0)}</div></div>
          <div class="result-cell"><div class="k">毛利</div><div class="v" style="color:var(--down)">¥${U.num(r.grossProfit,0)}</div></div>
          <div class="result-cell"><div class="k">营销 ROI</div><div class="v">${U.num(r.roi,0)}%</div></div>
        </div>
        <div class="callout ${r.grossProfit>=i.adCost?'ok':'warn'}" style="margin-top:10px"><span class="ct">诊断</span>${r.grossProfit>=i.adCost?
          '链路盈利：毛利已覆盖内容/广告投入。':
          '链路尚未回本：试着提升某项转化率，或降低获客投入，看看哪个杠杆最有效。'}</div>
      </div>`;
      v.querySelector('#chainOut').scrollIntoView({behavior:'smooth',block:'start'});
    });
    // 首屏自动算一次
    v.querySelector('#runChain').click();
  };
})(window.GBA = window.GBA || {});
