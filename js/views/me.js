/* 我的 —— 学习记录、笔记、错题、收藏、考试、知识关联、设置 */
(function (G) {
  const D=G.data,S=G.store,U=G.utils,C=G.charts;G.views=G.views||{};

  G.views.me=function(){
    const st=S.get();
    const done=S.completedCount(),pct=D.totalLessons?done/D.totalLessons*100:0;
    const wrong=S.activeWrong(),notes=st.noteBook.length,favs=st.favorites.length;
    const v=G.mount(`<div class="lesson-wrap">
      <div class="profile-head">
        <div class="avatar">${U.esc(st.settings.name[0]||'学')}</div>
        <div><div class="nm">${U.esc(st.settings.name)}</div><div class="lv">全球商业学习者 · 连续学习 ${st.streak.count||0} 天</div></div>
      </div>
      <div class="card" style="margin-bottom:16px">
        <div class="row" style="gap:16px">
          <div id="meDonut"></div>
          <div style="flex:1">
            <div class="tiny muted">课程总完成率</div>
            <div class="num" style="font-size:22px" id="mePct">0%</div>
            <div class="tiny dim" style="margin-top:4px">已完成 ${done} / ${D.totalLessons} 个知识点</div>
            <div class="row" style="gap:6px;margin-top:8px">
              <span class="chip blue">${notes} 笔记</span><span class="chip">${wrong.length} 错题</span><span class="chip">${favs} 收藏</span>
            </div>
          </div>
        </div>
      </div>

      <div class="menu-grid">
        <div class="menu-tile t-blue" data-go="sub?k=notes"><div class="mi">${G.icons.note(18)}</div><b>我的笔记</b><span>${notes} 条 · 含工具输出</span></div>
        <div class="menu-tile t-pink" data-go="sub?k=wrong"><div class="mi">✗</div><b>错题本</b><span>${wrong.length} 道待复习</span></div>
        <div class="menu-tile t-orange" data-go="sub?k=fav"><div class="mi">${G.icons.star(18)}</div><b>收藏夹</b><span>${favs} 个知识点</span></div>
        <div class="menu-tile t-purple" data-go="sub?k=exam"><div class="mi">${G.icons.check(18)}</div><b>阶段考试</b><span>阶段考 + 综合考</span></div>
        <div class="menu-tile t-cyan" data-go="sub?k=graph"><div class="mi">${G.icons.network(18)}</div><b>知识关联图</b><span>看见知识之间的关系</span></div>
        <div class="menu-tile t-green" data-go="sub?k=stats"><div class="mi">${G.icons.chart(18)}</div><b>学习统计</b><span>进度 · 时长 · 记录</span></div>
        <div class="menu-tile t-blue" data-go="english"><div class="mi">文</div><b>专业英语</b><span>词汇 + 邮件模板</span></div>
        <div class="menu-tile t-purple" data-go="sub?k=settings"><div class="mi">${G.icons.setting(18)}</div><b>设置</b><span>昵称 · 目标 · 数据</span></div>
      </div>
      <div class="callout" style="margin-top:18px"><span class="ct">数据持久化</span>学习进度、笔记、错题、收藏与计算记录都保存在本机浏览器，刷新页面不会丢失。课程更新时会保留你的学习数据。</div>
    </div>`);
    v.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>G.router.go(el.dataset.go)));
    const dn=v.querySelector('#meDonut');dn.outerHTML=C.donut(pct,{size:80,stroke:9,label:'完成'});
    U.animateNumber(v.querySelector('#mePct'),pct,1);

    // 子页面路由由 sub 视图处理
  };

  G.views.sub=function(params,query){
    const k=params.k||query.k;
    if(k==='notes') return subNotes();
    if(k==='wrong') return subWrong();
    if(k==='fav') return subFav();
    if(k==='exam') return subExam();
    if(k==='graph') return subGraph();
    if(k==='stats') return subStats();
    if(k==='settings') return subSettings();
    G.router.go('me');
  };

  function shell(title,body){
    const v=G.mount(`<div class="lesson-wrap"><div class="crumb" style="padding-top:6px"><button class="linkbtn" data-go="me">我的</button> / ${title}</div>
      <h1 class="page-title" style="font-size:22px">${title}</h1>${body}</div>`);
    v.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>G.router.go(el.dataset.go)));
    return v;
  }

  function subNotes(){
    const notes=S.get().noteBook;
    const v=shell('我的笔记', notes.length? notes.map(n=>{
      const ch=D.lessonById[n.lessonId];
      const ref=ch?ch.t:(n.lessonId.startsWith('tool_')?'工具输出':n.lessonId.startsWith('email_')?'邮件练习':'笔记');
      return `<div class="card" style="margin-bottom:10px"><div class="row between" style="margin-bottom:8px">
        <span class="chip blue" style="font-size:9px">${U.esc(ref)}</span><span class="tiny dim">${U.fmtDate(n.at)}</span></div>
        <div class="small" style="white-space:pre-wrap;color:#C7D2E2">${U.esc(n.text)}</div>
        ${ch?`<button class="btn sm ghost" style="margin-top:8px" data-go="lesson?id=${n.lessonId}">查看课程 →</button>`:''}
        <button class="btn sm ghost" data-delnote="${n.id}" style="margin-top:8px;color:var(--up)">删除</button></div>`;
    }).join(''):'<div class="empty"><div class="e-ic">✎</div><div class="tiny">还没有笔记</div></div>');
    v.querySelectorAll('[data-delnote]').forEach(b=>b.addEventListener('click',()=>{S.removeNote(b.dataset.delnote);G.views.sub({k:'notes'});G.toast('已删除')}));
  }

  function subWrong(){
    const wrong=S.activeWrong();
    const v=shell('错题本', wrong.length? wrong.map(w=>{
      const q=D.getQuestion(w.lessonId,w.qid.split('-').pop()) || (D.questions[w.lessonId]||[]).find(x=>x.order===+w.qid.split('-').pop());
      const ch=D.lessonById[w.lessonId];
      return `<div class="card" style="margin-bottom:10px"><div class="row between" style="margin-bottom:6px">
        <span class="chip" style="font-size:9px;color:var(--up)">错误 ${w.times} 次</span><span class="tiny dim">${ch?U.esc(ch.t):''}</span></div>
        <div class="small">${q?U.esc(q.stem):'题目 '+w.qid}</div>
        <div style="margin-top:8px"><button class="btn sm primary" data-go="lesson?id=${w.lessonId}">重做这道题 →</button>
        <button class="btn sm ghost" data-clear="${w.qid}">标记已掌握</button></div></div>`;
    }).join(''):'<div class="empty"><div class="e-ic">✓</div><div class="tiny">错题本是空的，继续保持！</div></div>');
    v.querySelectorAll('[data-clear]').forEach(b=>b.addEventListener('click',()=>{S.clearWrong(b.dataset.clear);G.views.sub({k:'wrong'});G.toast('已移出错题本')}));
  }

  function subFav(){
    const favs=S.get().favorites.map(id=>D.lessonById[id]).filter(Boolean);
    shell('收藏夹', favs.length? favs.map(ch=>`<div class="list-row" data-go="lesson?id=${ch.id}">
      <div class="ic">${G.icons.star(18)}</div><div class="t"><b>${ch.t}</b><span>${D.moduleById[ch.moduleId].title}</span></div><div class="dim">→</div></div>`).join('')
      :'<div class="empty"><div class="e-ic">☆</div><div class="tiny">还没有收藏的知识点</div></div>');
    // wire
    document.querySelectorAll('#view [data-go]').forEach(el=>el.addEventListener('click',()=>G.router.go(el.dataset.go)));
  }

  function subExam(){
    const exams=D.exams;
    const v=shell('阶段考试', Object.entries(exams).map(([id,e])=>{
      const rec=S.get().exam[id];
      return `<div class="card" style="margin-bottom:12px"><div class="row between">
        <div><b style="font-size:15px">${e.title}</b><div class="tiny muted" style="margin-top:4px">${e.desc}</div></div>
        ${rec?`<span class="chip blue">${rec.score}%</span>`:''}</div>
        <button class="btn primary block" style="margin-top:12px" data-exam="${id}">${rec?'重新考试':'开始考试'}</button></div>`;
    }).join(''));
    v.querySelectorAll('[data-exam]').forEach(b=>b.addEventListener('click',()=>G.router.go('exam?id='+b.dataset.exam)));
  }

  G.views.exam=function(params,query){
    const id=params.id||query.id,e=D.exams[id];
    if(!e){G.router.go('sub?k=exam');return;}
    const qs=e.ids.map(([lid,order])=>({lid,q:D.getQuestion(lid,order)})).filter(x=>x.q);
    const v=G.mount(`<div class="lesson-wrap">
      <div class="crumb" style="padding-top:6px"><button class="linkbtn" data-go="sub?k=exam">阶段考试</button> / ${e.title}</div>
      <h1 class="page-title" style="font-size:21px">${e.title}</h1>
      <div class="page-sub">${e.desc} · 提交后显示成绩（答案门控）</div>
      <div id="examQuiz"></div>
      <button class="btn primary block" id="submitExam" style="margin-top:8px">提交试卷</button>
      <div id="examOut" style="margin-top:14px"></div>
    </div>`);
    v.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>G.router.go(el.dataset.go)));
    const quiz=G.renderQuiz(v.querySelector('#examQuiz'),'exam_'+id,qs.map(x=>x.q),{examMode:true});
    v.querySelector('#submitExam').addEventListener('click',()=>{
      const answers={};
      qs.forEach((x,idx)=>{
        const ans = x.q.qtype==='single' ? x.q.options.findIndex((o,oi)=>{
          const sel=v.querySelector(`#examQuiz .quiz-q[data-qi="${idx}"] .opt.sel`);return sel&&+sel.dataset.val===oi;}) : null;
        // 详细判定交由 DOM 已检查状态较复杂，这里用简化：统计已提交且正确
      });
      // 用 quiz 内部状态不易取，改为读取每题已提交的正确标记
      let correct=0;
      v.querySelectorAll('#examQuiz .quiz-q').forEach(q=>{
        const btn=q.querySelector('[data-check]');
        if(btn&&btn.textContent.includes('已答对'))correct++;
      });
      const score=Math.round(correct/qs.length*100);
      S.saveExam(id,score,answers);
      v.querySelector('#examOut').innerHTML=`<div class="result-box center"><div class="tiny muted">本次成绩</div><div class="val" style="font-size:40px">${score}%</div>
        <div class="small" style="margin-top:6px">答对 ${correct} / ${qs.length} 题</div>
        <button class="btn sm" style="margin-top:12px" data-go="sub?k=exam">返回考试列表</button></div>`;
      v.querySelector('#examOut').querySelector('[data-go]').addEventListener('click',()=>G.router.go('sub?k=exam'));
      v.querySelector('#submitExam').style.display='none';
      G.toast('试卷已提交');
    });
  };

  function subGraph(){
    const nodes=[
      {id:'ca',t:'比较优势理论',x:40,y:40,c:'#36A9FF',to:'trade'},
      {id:'trade',t:'国际贸易',x:190,y:40,c:'#42D8D0',to:'product'},
      {id:'product',t:'产品选择',x:340,y:40,c:'#8A72FF',to:'cost'},
      {id:'cost',t:'成本核算',x:490,y:40,c:'#FF7BB0',to:'quote'},
      {id:'quote',t:'国际报价',x:40,y:130,c:'#FF9F5A',to:''},
      {id:'stp',t:'STP 理论',x:190,y:130,c:'#36A9FF',to:'persona'},
      {id:'persona',t:'用户画像',x:340,y:130,c:'#42D8D0',to:'content'},
      {id:'content',t:'社交内容策略',x:490,y:130,c:'#8A72FF',to:'convert'},
      {id:'convert',t:'客户转化',x:265,y:220,c:'#FF7BB0',to:''}
    ];
    const edges=[['ca','trade'],['trade','product'],['product','cost'],['cost','quote'],['stp','persona'],['persona','content'],['content','convert'],['quote','convert']];
    const map=Object.fromEntries(nodes.map(n=>[n.id,n]));
    const svg=`<svg viewBox="0 0 580 280" style="width:100%;min-width:520px;height:auto">
      ${edges.map(([a,b])=>{const A=map[a],B=map[b];return `<path class="kg-edge" d="M${A.x+60},${A.y+16} Q${(A.x+B.x)/2+30},${(A.y+B.y)/2} ${B.x},${B.y+16}"/>`;}).join('')}
      ${nodes.map(n=>`<g class="kg-node" data-node="${n.id}" style="--nc:${n.c};cursor:pointer">
        <rect x="${n.x}" y="${n.y}" width="120" height="34" rx="9"/>
        <text x="${n.x+60}" y="${n.y+21}" text-anchor="middle">${n.t}</text></g>`).join('')}
    </svg>`;
    const v=shell('知识关联图',`<div class="callout"><span class="ct">知识不是孤岛</span>点开任意节点，看看知识点如何串成一条链：从理论到一笔真实交易。</div>
      <div class="kg-wrap" style="margin-top:14px">${svg}</div>
      <div id="nodeInfo" class="card" style="margin-top:12px"><div class="small muted">点击上方节点查看详情</div></div>`);
    const info={ca:'比较优势 → 解释国际贸易为何发生（M01/M03）',trade:'国际贸易 → 决定产品选择与目标市场（M03）',product:'产品选择 → 基于市场调研与竞争优势（M02）',cost:'成本核算 → 为报价提供底座（M04）',quote:'国际报价 → 用 Incoterms 与成本生成（M04）',stp:'STP → 海外市场定位（M02）',persona:'用户画像 → 明确要触达谁（M02）',content:'社交内容策略 → 在目标平台触达用户（M06）',convert:'客户转化 → 营销最终变成订单（M06/M07）'};
    v.querySelectorAll('[data-node]').forEach(g=>g.addEventListener('click',()=>{v.querySelector('#nodeInfo').innerHTML=`<b style="color:var(--accent)">${map[g.dataset.node].t}</b><p class="small muted" style="margin-top:6px">${info[g.dataset.node]}</p>`;}));
  }

  function subStats(){
    const st=S.get(),done=S.completedCount();
    const hist=Object.entries(st.dailyGoal.log).sort().slice(-10);
    const v=shell('学习统计',`
      <div class="kpi-row" style="margin-bottom:16px">
        <div class="kpi"><div class="k">已完成知识点</div><div class="v">${done}</div></div>
        <div class="kpi"><div class="k">连续学习</div><div class="v">${st.streak.count||0} 天</div></div>
        <div class="kpi"><div class="k">累计学习日</div><div class="v">${st.streak.days.length}</div></div>
        <div class="kpi"><div class="k">笔记/错题</div><div class="v">${st.noteBook.length}/${S.activeWrong().length}</div></div>
      </div>
      <div class="card"><b style="font-size:13px">近 10 日学习分钟</b><div style="margin-top:12px">
        ${hist.length?C.bars(hist.map(([d,m])=>({label:d.slice(5),value:m,text:m+' 分'}))):'<div class="tiny dim">暂无记录</div>'}
      </div></div>`);
  }

  function subSettings(){
    const st=S.get();
    const v=shell('设置',`
      <div class="card" style="margin-bottom:14px">
        <div class="field"><label>昵称</label><input class="input" id="setName" value="${U.esc(st.settings.name)}"/></div>
        <div class="field"><label>每日学习目标（分钟）</label><input class="input" type="number" id="setGoal" value="${st.dailyGoal.targetMin}"/></div>
        <div class="row between" style="padding:10px 0"><span class="small">英文发音</span>
          <button class="chip ${st.settings.speech?'blue':''}" id="setSpeech">${st.settings.speech?'已开启':'已关闭'}</button></div>
        <div class="row between" style="padding:10px 0"><span class="small">减少动画</span>
          <button class="chip ${st.settings.reducedMotion?'blue':''}" id="setMotion">${st.settings.reducedMotion?'已开启':'已关闭'}</button></div>
        <button class="btn primary block" id="saveSet" style="margin-top:10px">保存设置</button>
      </div>
      <div class="card" style="border-color:rgba(255,92,108,.25)">
        <b style="font-size:13px;color:var(--up)">数据管理</b>
        <p class="tiny muted" style="margin:8px 0">重置将清空所有学习进度、笔记、错题与计算记录，且不可恢复。</p>
        <button class="btn sm block" id="resetAll">重置全部学习数据</button>
      </div>`);
    v.querySelector('#setSpeech').addEventListener('click',(e)=>{const on=!S.get().settings.speech;S.setSetting('speech',on);e.target.textContent=on?'已开启':'已关闭';e.target.classList.toggle('blue',on);});
    v.querySelector('#setMotion').addEventListener('click',(e)=>{const on=!S.get().settings.reducedMotion;S.setSetting('reducedMotion',on);e.target.textContent=on?'已开启':'已关闭';e.target.classList.toggle('blue',on);});
    v.querySelector('#saveSet').addEventListener('click',()=>{
      S.setSetting('name',v.querySelector('#setName').value.trim()||'学习者');
      S.set(s=>{s.dailyGoal.targetMin=+v.querySelector('#setGoal').value||20;});
      G.toast('设置已保存');
    });
    v.querySelector('#resetAll').addEventListener('click',()=>{
      if(confirm('确定重置全部学习数据吗？此操作不可恢复。')){S.reset();G.toast('已重置');G.router.go('home');}
    });
  }
})(window.GBA = window.GBA || {});
