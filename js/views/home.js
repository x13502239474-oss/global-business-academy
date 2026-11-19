/* 首页：全球商业指挥中心 */
(function (G) {
  const D = G.data, S = G.store, U = G.utils, C = G.charts;

  // 简化的世界地图轮廓（装饰性 path，教学示意，非精确地理数据）
  function mapSVG() {
    const land = 'rgba(54,169,255,.07)';
    const stroke = 'rgba(96,140,190,.28)';
    return `<svg class="world" viewBox="0 0 960 540" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#36A9FF"/><stop offset=".5" stop-color="#42D8D0"/><stop offset="1" stop-color="#8A72FF"/>
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="rgba(146,159,178,.05)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="960" height="540" fill="url(#grid)"/>
      <!-- 装饰性大陆轮廓（示意） -->
      <g fill="${land}" stroke="${stroke}" stroke-width="1">
        <path d="M120 130 Q160 90 240 100 Q300 110 305 150 Q290 200 250 210 Q240 260 200 270 Q170 240 160 200 Q120 180 120 130Z"/>
        <path d="M250 280 Q290 270 310 300 Q330 360 300 440 Q280 490 260 470 Q240 400 235 340Z"/>
        <path d="M440 110 Q520 85 610 105 Q660 120 650 160 Q620 190 560 185 Q520 210 480 195 Q440 175 440 110Z"/>
        <path d="M480 210 Q540 200 570 230 Q590 290 560 340 Q520 370 490 340 Q470 290 480 210Z"/>
        <path d="M620 130 Q720 95 830 130 Q890 160 860 210 Q800 250 720 235 Q660 220 620 130Z"/>
        <path d="M740 265 Q810 250 850 280 Q870 320 820 330 Q770 330 740 265Z"/>
      </g>
      <!-- 航线（教学模拟示意） -->
      ${D.routes.map(d=>`<path class="route" d="${d}"/>`).join('')}
      <!-- 区域点位 -->
      ${D.regions.map(r=>`<g class="map-dot ${r.hot?'hot':''}" data-region="${r.key}" transform="translate(${r.x},${r.y})">
        <circle class="halo" r="11"/><circle class="core" r="4.5"/>
        <circle r="16" fill="transparent"/>
      </g>`).join('')}
    </svg>`;
  }

  function dashboard(st) {
    const total = D.totalLessons;
    const done = S.completedCount();
    const pct = total ? done / total * 100 : 0;
    const secs = Object.values(st.progress).reduce((a,p)=>a+(p.seconds||0),0);
    const hours = secs / 3600;
    const streak = st.streak.count || 0;
    const todayMin = st.dailyGoal.log[U.todayKey()] || 0;
    const goalPct = U.clamp(todayMin / st.dailyGoal.targetMin * 100, 0, 100);
    const last7 = Array.from({length:7},(_,i)=>st.streak.days.includes(U.dateKeyOffset(-i)));
    return `<div class="card pad-s">
      <div class="row between" style="margin-bottom:6px"><b style="font-size:14px">学习仪表盘</b><span class="tiny dim">DASHBOARD</span></div>
      <div class="stat">
        <div class="donut-wrap" id="dashDonut"></div>
        <div class="info">
          <div class="v"><span id="doneNum" class="num">0</span><span class="dim" style="font-size:13px">/${total}</span></div>
          <div class="l">已完成知识点</div>
          <div style="margin-top:6px"><span class="chip blue dot" style="font-size:10px">当前阶段 · ${currentStage(done)}</span></div>
        </div>
      </div>
      <div class="divider" style="margin:12px 0"></div>
      <div class="kpi-row">
        <div class="kpi"><div class="k">${G.icons.clock(13)} 累计学习</div><div class="v"><span id="hoursNum">0</span><span style="font-size:11px"> 小时</span></div></div>
        <div class="kpi"><div class="k">${G.icons.fire(13)} 连续学习</div><div class="v">${streak}<span style="font-size:11px"> 天</span></div>
          <div class="streak-dots">${last7.map(on=>`<i class="${on?'on':''}"></i>`).join('')}</div></div>
      </div>
      <div style="margin-top:12px">
        <div class="row between tiny" style="margin-bottom:5px"><span class="muted">本周学习目标 · 今日 ${todayMin}/${st.dailyGoal.targetMin} 分钟</span><span class="num" style="color:var(--accent)">${Math.round(goalPct)}%</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${goalPct}%"></div></div>
      </div>
    </div>`;
  }
  function currentStage(done){
    if(done===0) return '启程';
    if(done<10) return '基础构建';
    if(done<25) return '理论进阶';
    if(done<40) return '实务掌握';
    return '综合经营';
  }

  function continueCard(st){
    const last = st.visited.find(id=>D.lessonById[id]);
    if(!last){
      return `<div class="card"><div class="row" style="gap:12px">
        <div class="ic" style="width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:var(--mc-soft,rgba(54,169,255,.14));color:var(--accent);font-size:20px">${G.icons.play(22)}</div>
        <div style="flex:1"><b style="font-size:14px">开始你的学习之旅</b><div class="tiny muted">从模块 01 · 全球商业基础开始</div></div>
      </div><button class="btn primary block" style="margin-top:14px" data-go="lesson?id=m01-1">进入第一课 →</button></div>`;
    }
    const ch = D.lessonById[last];
    const mod = D.moduleById[ch.moduleId];
    const p = st.progress[last] || {pct:0};
    return `<div class="card">
      <div class="row between" style="margin-bottom:10px"><b style="font-size:14px">继续学习</b><span class="tiny dim">CONTINUE</span></div>
      <div class="row" style="gap:12px">
        <div class="ic" style="width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:var(--mc-soft);color:var(--mc);font-size:20px">${G.icons.play(22)}</div>
        <div style="flex:1;min-width:0"><b style="font-size:14px">${U.esc(ch.t)}</b><div class="tiny muted">${mod.code} · ${U.esc(mod.title)}</div></div>
      </div>
      <div class="row between tiny" style="margin:14px 0 5px"><span class="muted">章节进度</span><span class="num" style="color:var(--accent)">${Math.round(p.pct||0)}%</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${p.pct||0}%"></div></div>
      <button class="btn primary block" style="margin-top:14px" data-go="lesson?id=${last}">继续学习 →</button>
    </div>`;
  }

  function dailyCase(){
    // 按日期确定性选择一个案例
    const day = Math.floor(Date.now()/86400000);
    const c = D.cases[day % D.cases.length];
    return `<div class="card" style="border-color:rgba(138,114,255,.22)">
      <div class="row between" style="margin-bottom:10px"><b style="font-size:14px">每日商业案例</b><span class="chip" style="color:var(--accent-2)">DAILY CASE</span></div>
      <div class="row" style="gap:12px">
        <div style="width:48px;height:48px;border-radius:13px;display:grid;place-items:center;font-size:18px;font-weight:850;background:rgba(138,114,255,.14);color:var(--accent-2)">${c.name[0]}</div>
        <div style="flex:1"><b style="font-size:16px">${c.name}</b><div class="tiny muted">${c.tag.join(' · ')}</div></div>
      </div>
      <p class="small muted" style="margin:12px 0">${U.esc(c.intro)}</p>
      <button class="btn sm block" data-go="case?id=${c.id}">查看深度分析 →</button>
    </div>`;
  }

  G.views = G.views || {};
  G.views.home = function(){
    const st = S.get();
    const v = G.mount(`
      <div class="hero">
        <div class="en">GLOBAL BUSINESS INTELLIGENCE</div>
        <h1>理解市场，构建企业，<br><span class="grad-text">走向全球。</span></h1>
        <div class="tagline">Understand Markets. Build Businesses. Expand Globally.</div>
      </div>

      <div class="sec-head"><h2><span class="bar"></span>全球商业地图</h2><span class="more">点击市场 · 进入研究</span></div>
      <div class="card map-card">
        <div class="map-head"><div><h2>Global Trade Network</h2><div class="sub">七大商业区域 · 贸易航线示意</div></div>
          <span class="chip blue dot" style="font-size:10px">教学模拟</span></div>
        <div class="map-stage" id="mapStage">${mapSVG()}<div class="map-tip" id="mapTip"></div></div>
        <div class="map-foot">
          <span class="map-legend"><i style="background:var(--accent)"></i>核心市场</span>
          <span class="map-legend"><i style="background:var(--cyan)"></i>新兴市场</span>
          <span class="map-legend" style="opacity:.6">航线为示意，非实时数据</span>
        </div>
      </div>
      <div class="region-strip" style="margin-top:12px">
        ${D.regions.map(r=>`<button class="region-pill" data-go="market?key=${r.key}">${r.cn} · ${r.name}</button>`).join('')}
      </div>

      <div class="sec-head"><h2><span class="bar"></span>学习总览</h2></div>
      <div class="grid g2">${dashboard(st)}${continueCard(st)}</div>

      <div class="sec-head"><h2><span class="bar"></span>核心专业模块</h2><span class="more">8 MODULES</span></div>
      <div class="grid g2">
        ${D.modules.slice(0,6).map(m=>`<div class="module-card t-${m.color}" data-go="module?id=${m.id}">
          <div class="bg-num">${m.id.slice(-2)}</div>
          <div class="mi">${G.icons[m.icon](20)}</div>
          <div><h3>${m.title}</h3><p>${m.desc}</p></div>
          <div class="arrow">→</div>
        </div>`).join('')}
      </div>

      <div class="sec-head"><h2><span class="bar"></span>今日聚焦</h2></div>
      <div class="grid g2">${dailyCase()}
        <div class="card" style="display:flex;flex-direction:column;justify-content:space-between">
          <div><div class="row between" style="margin-bottom:8px"><b style="font-size:14px">跨境经营模拟器</b><span class="tiny dim">SIM</span></div>
          <p class="small muted">选产品、定成本、设售价，模拟经营一家跨境企业，看利润如何变化。</p></div>
          <button class="btn cyan block" style="margin-top:10px" data-go="simulator">启动模拟 →</button>
        </div>
      </div>
    `);

    v.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>G.router.go(el.dataset.go)));
    // 动画数字
    U.animateNumber(document.getElementById('doneNum'), S.completedCount(), 0);
    const secs = Object.values(st.progress).reduce((a,p)=>a+(p.seconds||0),0);
    U.animateNumber(document.getElementById('hoursNum'), secs/3600, 1);
    const donut = document.getElementById('dashDonut');
    if(donut){ donut.outerHTML = C.donut(D.totalLessons?S.completedCount()/D.totalLessons*100:0,{size:74,stroke:8,label:'总完成率'}); }

    // 地图交互
    const tip = document.getElementById('mapTip'), stage = document.getElementById('mapStage');
    v.querySelectorAll('.map-dot').forEach(dot=>{
      const key = dot.dataset.region, r = D.regions.find(x=>x.key===key);
      const show = ()=>{
        tip.innerHTML=`<b>${r.cn} · ${r.name}</b><br><span class="dim">${r.hubs.slice(0,3).join(' / ')}</span>`;
        tip.style.left = (r.x/960*100)+'%'; tip.style.top=(r.y/540*100)+'%';
        tip.classList.add('show');
      };
      dot.addEventListener('mouseenter',show); dot.addEventListener('mouseleave',()=>tip.classList.remove('show'));
      dot.addEventListener('click',()=>G.router.go('market?key='+key));
    });
  };
})(window.GBA = window.GBA || {});
