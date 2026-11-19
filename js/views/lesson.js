/* 课时页：统一 9 段结构 + 模型图示 + 练习 + 笔记 */
(function (G) {
  const D=G.data, S=G.store, U=G.utils;

  // 通用模型图示（按知识点关键词选图）
  function figureFor(id){
    const figs = {
      'm01-4': {t:'比较优势：机会成本示意（教学模拟数据）', svg:comparativeFig},
      'm02-3': {t:'STP：细分 → 目标 → 定位', svg:stpFig},
      'm06-3': {t:'Tuten 四大社交区域框架（依 S3）', svg:zonesFig},
      'm08-5': {t:'从流量到订单的完整链路', svg:chainFig}
    };
    const f=figs[id];
    if(!f) return '';
    return `<div class="fig"><div class="fig-t">图 · ${f.t}</div><div class="fig-b">${f.svg()}</div></div>`;
  }

  function comparativeFig(){
    return `<svg viewBox="0 0 320 150" style="width:100%;height:auto">
      <text x="10" y="20" fill="#929FB2" font-size="11">A国机会成本</text>
      <rect x="10" y="28" width="120" height="30" rx="7" fill="rgba(54,169,255,.2)" stroke="#36A9FF"/>
      <text x="20" y="48" fill="#EDF2FA" font-size="12">1布 = 0.5酒</text>
      <text x="170" y="20" fill="#929FB2" font-size="11">B国机会成本</text>
      <rect x="170" y="28" width="140" height="30" rx="7" fill="rgba(138,114,255,.2)" stroke="#8A72FF"/>
      <text x="180" y="48" fill="#EDF2FA" font-size="12">1布 = 1酒</text>
      <text x="10" y="95" fill="#42D8D0" font-size="12">→ A国在布上有比较优势（放弃更少）</text>
      <text x="10" y="120" fill="#929FB2" font-size="11">分工后总产出增加，双方交换都获益</text>
    </svg>`;
  }
  function stpFig(){
    const boxes=[['细分','Segmentation','按变量切分市场'],['目标','Targeting','选择最有吸引力群组'],['定位','Positioning','占据清晰差异位置']];
    return `<svg viewBox="0 0 320 110" style="width:100%;height:auto">${boxes.map((b,i)=>`
      <rect x="${8+i*106}" y="20" width="96" height="60" rx="10" fill="rgba(54,169,255,.12)" stroke="#36A9FF"/>
      <text x="${56+i*106}" y="45" fill="#EDF2FA" font-size="13" text-anchor="middle">${b[0]}</text>
      <text x="${56+i*106}" y="62" fill="#929FB2" font-size="8" text-anchor="middle">${b[1]}</text>
      ${i<2?`<text x="${105+i*106}" y="55" fill="#42D8D0" font-size="16">→</text>`:''}
    `).join('')}<text x="160" y="100" fill="#5E6C82" font-size="10" text-anchor="middle">先切分 · 再选择 · 后占位</text></svg>`;
  }
  function zonesFig(){
    const z=[['社交社区','关系','#36A9FF'],['社交发布','内容','#42D8D0'],['社交娱乐','体验','#8A72FF'],['社交商务','交易','#FF7BB0']];
    return `<svg viewBox="0 0 320 130" style="width:100%;height:auto"><text x="160" y="16" fill="#929FB2" font-size="10" text-anchor="middle">按目标选区域，再落到平台</text>
      ${z.map((b,i)=>{const x=8+(i%2)*156,y=28+Math.floor(i/2)*50;return `
        <rect x="${x}" y="${y}" width="148" height="42" rx="10" fill="rgba(255,255,255,.03)" stroke="${b[2]}"/>
        <text x="${x+12}" y="${y+26}" fill="#EDF2FA" font-size="12">${b[0]}</text>
        <text x="${x+136}" y="${y+26}" fill="${b[2]}" font-size="11" text-anchor="end">${b[1]}</text>`;}).join('')}</svg>`;
  }
  function chainFig(){
    const steps=['曝光','潜客','询盘','报价','谈判','订单','收款'];
    const colors=['#36A9FF','#42D8D0','#8A72FF','#FF7BB0'];
    return `<svg viewBox="0 0 320 90" style="width:100%;height:auto">${steps.map((s,i)=>`
      <rect x="${4+i*45}" y="30" width="38" height="30" rx="8" fill="rgba(255,255,255,.04)" stroke="${colors[i%4]}"/>
      <text x="${23+i*45}" y="49" fill="#EDF2FA" font-size="10" text-anchor="middle">${s}</text>
      ${i<6?`<text x="${43+i*45}" y="49" fill="#5E6C82" font-size="11">›</text>`:''}
    `).join('')}</svg>`;
  }

  G.views = G.views || {};
  G.views.lesson = function(params, query){
    const id = params.id || query.id;
    const ch = D.lessonById[id];
    if(!ch){ G.router.go('courses'); return; }
    const mod = D.moduleById[ch.moduleId];
    const L = D.lessons[id] || {objectives:['理解本节核心概念'],sections:[{h:'内容',html:'<p>本节内容整理中。请参考教材来源学习：'+U.esc(ch.src)+'</p>'}],summary:[],terms:{}};
    const questions = D.getQuestions(id);
    const st=S.get();

    const v=G.mount(`<div class="lesson-wrap">
      <div class="lesson-top">
        <div class="crumb"><button class="linkbtn" data-go="courses">课程</button> / <button class="linkbtn" data-go="module?id=${mod.id}">${mod.code}</button></div>
        <h1 class="lesson-title">${ch.t}</h1>
        <div class="lesson-en">${ch.en}</div>
        <div class="lesson-meta">
          <span class="chip blue">${ch.mins} 分钟</span>
          <span class="chip">来源 ${U.esc(ch.src)}</span>
          <span class="chip" id="statusChip">${st.progress[id]?.done?'✓ 已完成':'未开始'}</span>
        </div>
      </div>

      <div class="learn-objectives">
        <div class="lt">◎ 学完你能</div>
        <ul>${L.objectives.map(o=>`<li>${o}</li>`).join('')}</ul>
      </div>

      <div class="prose">
        ${L.sections.map((s,i)=>`<section><h2><span class="n">0${i+1}</span>${s.h}</h2>${s.html}</section>`).join('')}
        ${figureFor(id)}
      </div>

      <div class="card" style="margin:18px 0">
        <div class="row between" style="margin-bottom:10px"><b style="font-size:14px">◎ 重点总结</b></div>
        <ul style="padding-left:18px;margin:0;font-size:13.5px;color:#C7D2E2">
          ${(L.summary||[]).map(s=>`<li style="margin-bottom:6px">${s}</li>`).join('')}
        </ul>
      </div>

      ${L.terms && Object.keys(L.terms).length?`<div class="card flat" style="margin-bottom:18px">
        <b style="font-size:13px">专业术语</b>
        <div style="margin-top:8px">${Object.entries(L.terms).map(([k,v])=>`<div style="font-size:12.5px;margin-bottom:5px"><span class="term">${k}</span> — <span class="muted">${v}</span></div>`).join('')}</div>
      </div>`:''}

      <div class="row wrap" style="gap:8px;margin-bottom:8px">
        ${L.lab?`<button class="btn sm" data-go="tool?id=${L.lab}">🛠 打开配套工具</button>`:''}
        ${L.sim?`<button class="btn sm" data-go="simulator">🎮 进入实战模拟</button>`:''}
        <button class="btn sm" id="favBtn">${S.isFav(id)?'★ 已收藏':'☆ 收藏'}</button>
      </div>

      <div id="quizArea"></div>

      <div class="card" style="margin-top:18px">
        <div class="row between" style="margin-bottom:8px"><b style="font-size:14px">我的笔记</b><span class="tiny dim">自动保存</span></div>
        <div id="noteList"></div>
        <textarea class="input" id="noteInput" placeholder="记下你的理解、疑问或联想…" style="margin-top:8px"></textarea>
        <button class="btn sm primary" id="addNote" style="margin-top:8px">保存笔记</button>
      </div>

      <div class="row between tiny dim" style="margin-top:18px">
        <span>延伸阅读：${U.esc(ch.src)} · 原书对应章节</span>
      </div>

      <div class="action-bar">
        <button class="btn" id="prevBtn">← 上一节</button>
        <button class="btn primary" id="doneBtn" style="flex:1">${st.progress[id]?.done?'标记未完成':'✓ 标记学完'}</button>
        <button class="btn" id="nextBtn">下一节 →</button>
      </div>
    </div>`);

    v.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>G.router.go(el.dataset.go)));

    // 答题（先练后讲：答案仅在提交后显示）
    G.renderQuiz(v.querySelector('#quizArea'), id, questions);

    // 笔记
    function renderNotes(){
      const notes=S.notesFor(id);
      v.querySelector('#noteList').innerHTML = notes.length? notes.map(n=>`
        <div class="hist-item"><div class="ht"><span>${U.fmtDate(n.at)}</span><button class="linkbtn" data-del="${n.id}" style="color:var(--up)">删除</button></div><div>${U.esc(n.text)}</div></div>`).join('')
        : '<div class="tiny dim">还没有笔记，写下第一条吧。</div>';
      v.querySelectorAll('[data-del]').forEach(b=>b.addEventListener('click',()=>{S.removeNote(b.dataset.del);renderNotes();G.toast('已删除')}));
    }
    renderNotes();
    v.querySelector('#addNote').addEventListener('click',()=>{
      const inp=v.querySelector('#noteInput');
      if(!inp.value.trim()){G.toast('请输入笔记内容');return;}
      S.addNote(id,inp.value.trim());inp.value='';renderNotes();G.toast('笔记已保存');
    });

    // 状态
    S.markVisit(id);
    v.querySelector('#favBtn').addEventListener('click',(e)=>{const on=S.toggleFav(id);e.target.textContent=on?'★ 已收藏':'☆ 收藏';G.toast(on?'已收藏':'已取消收藏');});
    v.querySelector('#doneBtn').addEventListener('click',(e)=>{
      const done=S.toggleDone(id);
      e.target.textContent=done?'标记未完成':'✓ 标记学完';
      e.target.classList.toggle('primary',!done);
      v.querySelector('#statusChip').textContent=done?'✓ 已完成':'未开始';
      G.toast(done?'已标记学完':'已取消完成');
    });

    // 上下节
    const all=D.allLessons, idx=all.findIndex(x=>x.id===id);
    const setNav=(sel,target,label)=>{const b=v.querySelector(sel);if(!target){b.disabled=true;b.style.opacity='.4';return;}b.addEventListener('click',()=>G.router.go('lesson?id='+target.id));b.title=label;};
    setNav('#prevBtn',all[idx-1]); setNav('#nextBtn',all[idx+1]);

    // 滚动进度记录
    let maxPct=st.progress[id]?.pct||0;
    const onScroll=U.debounce(()=>{
      const h=document.documentElement.scrollHeight-window.innerHeight;
      const pct=h>0?U.clamp(window.scrollY/h*100,0,100):100;
      if(pct>maxPct){maxPct=pct;S.updateProgress(id,{pct:Math.round(pct),lastPos:window.scrollY});}
    },300);
    window.addEventListener('scroll',onScroll,{passive:true});
  };
})(window.GBA = window.GBA || {});
