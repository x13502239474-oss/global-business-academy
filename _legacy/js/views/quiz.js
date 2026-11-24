/* 答题组件：四题型 + 答案门控（先练后讲） */
(function (G) {
  const U = G.utils, S = G.store;

  function judgeAnswer(q, ans){
    switch(q.qtype){
      case 'single': return Number(ans)===Number(q.answer);
      case 'judge': {
        if(typeof q.answer==='boolean') return U.isTrue(ans)===q.answer;
        return U.normalize(ans)===U.normalize(q.answer);
      }
      case 'blank': {
        const a=U.normalize(ans);
        return (q.accepted||[]).some(x=>U.normalize(x)===a);
      }
      case 'short': {
        const txt=U.normalize(ans);
        const groups=q.keywords||[];
        const hit=groups.filter(g=>g.some(k=>txt.includes(U.normalize(k)))).length;
        return groups.length? hit/groups.length>=0.7 : false;
      }
    }
    return false;
  }

  function qtypeLabel(t){return {single:'单选题',judge:'判断题',blank:'填空题',short:'要点题'}[t]||'';}

  G.renderQuiz = function(container, lessonId, questions, opt){
    opt=opt||{};
    if(!questions || !questions.length){ container.innerHTML=''; return; }
    const state = questions.map(q=>({q, ans:null, checked:false, correct:false}));

    container.innerHTML = `
      <div class="sec-head"><h2><span class="bar"></span>章节练习</h2><span class="more" id="quizScore">0 / ${questions.length}</span></div>
      ${questions.map((q,i)=>`
        <div class="quiz-q" data-qi="${i}">
          <div class="qt"><span class="qn">Q${q.order}</span><span>${U.esc(q.stem)}</span></div>
          <span class="chip" style="font-size:9.5px;margin:-6px 0 10px 30px">${qtypeLabel(q.qtype)}</span>
          <div class="opts">${optsHTML(q,i)}</div>
          <button class="btn sm ${''}" data-check="${i}" style="margin-top:6px">提交答案</button>
          <div class="explain" data-exp="${i}">
            <div class="eb">练习详解</div>
            <div><b>答案：</b>${answerText(q)}</div>
            <div style="margin-top:5px"><b>解题思路：</b>${U.esc(q.explanation?.思路||'')}</div>
            <div style="margin-top:5px"><b>逐步演示：</b>${U.esc(q.explanation?.演示||'')}</div>
            <div style="margin-top:5px;color:var(--warn)"><b>易错提醒：</b>${U.esc(q.explanation?.易错||'')}</div>
          </div>
        </div>`).join('')}
      <div id="quizResult" class="result-box" style="display:none;margin-top:8px"></div>
    `;

    function optsHTML(q,i){
      if(q.qtype==='single') return (q.options||[]).map((o,oi)=>`<div class="opt" data-pick="${i}" data-val="${oi}"><span class="ok">${'ABCD'[oi]}</span><span>${U.esc(o)}</span></div>`).join('');
      if(q.qtype==='judge') return `<div class="seg" style="max-width:240px">
        <button data-pick="${i}" data-val="true">正确</button><button data-pick="${i}" data-val="false">错误</button></div>`;
      if(q.qtype==='blank') return `<input class="input" data-input="${i}" placeholder="输入答案"/>`;
      return `<textarea class="input" data-input="${i}" placeholder="写出你的要点（用逗号分隔）"></textarea>`;
    }

    // 选择交互
    container.querySelectorAll('[data-pick]').forEach(el=>el.addEventListener('click',()=>{
      const i=+el.dataset.pick, q=state[i].q;
      if(q.qtype==='single'){
        container.querySelectorAll(`[data-pick="${i}"]`).forEach(x=>x.classList.remove('sel'));
        el.classList.add('sel'); state[i].ans=+el.dataset.val;
      } else {
        container.querySelectorAll(`[data-pick="${i}"]`).forEach(x=>x.classList.remove('on'));
        el.classList.add('on'); state[i].ans=el.dataset.val;
      }
    }));
    container.querySelectorAll('[data-input]').forEach(el=>el.addEventListener('input',()=>{
      state[+el.dataset.input].ans=el.value;
    }));

    container.querySelectorAll('[data-check]').forEach(btn=>btn.addEventListener('click',()=>{
      const i=+btn.dataset.check, s=state[i];
      if(s.ans===null||s.ans===''||s.ans==undefined){ G.toast('请先作答'); return; }
      if(s.checked){ // 已提交，切换显示详解
        const ex=container.querySelector(`[data-exp="${i}"]`); ex.classList.toggle('show'); return;
      }
      s.checked=true; s.correct=judgeAnswer(s.q,s.ans);
      const q=s.q;
      // 反馈样式
      if(q.qtype==='single'){
        container.querySelectorAll(`[data-pick="${i}"]`).forEach(x=>{
          const val=+x.dataset.val;
          if(val===Number(q.answer)) x.classList.add('correct');
          if(val===Number(s.ans)&&!s.correct) x.classList.add('wrong');
        });
      } else if(q.qtype==='judge'){
        const correctVal = String(typeof q.answer==='boolean'?q.answer:U.isTrue(q.answer));
        container.querySelectorAll(`[data-pick="${i}"]`).forEach(x=>{
          if(x.dataset.val===correctVal) x.style.borderColor='var(--down)';
          if(x.dataset.val===String(s.ans)&&!s.correct) x.style.borderColor='var(--up)';
        });
      }
      // 答案门控：提交后才显示详解
      container.querySelector(`[data-exp="${i}"]`).classList.add('show');
      btn.textContent = s.correct?'✓ 已答对':'✗ 已答错（查看详解）';
      btn.classList.toggle('primary',s.correct);
      // 错题本
      if(s.correct){ if(!opt.examMode) S.clearWrong(`${lessonId}-${q.order}`); }
      else if(!opt.examMode){ S.addWrong(`${lessonId}-${q.order}`,lessonId,String(s.ans)); }
      updateScore();
    }));

    function answerText(q){
      if(q.qtype==='single') return `${'ABCD'[q.answer]} · ${q.options[q.answer]}`;
      if(q.qtype==='judge') return (typeof q.answer==='boolean'?q.answer:U.isTrue(q.answer))?'正确':'错误';
      if(q.qtype==='blank') return (q.accepted||[])[0];
      return (q.keywords||[]).map(g=>g[0]).join('、');
    }
    function updateScore(){
      const correct=state.filter(s=>s.correct).length;
      const el=container.querySelector('#quizScore'); if(el) el.textContent=`${correct} / ${questions.length}`;
      if(state.every(s=>s.checked)){
        const r=container.querySelector('#quizResult');
        r.style.display='block';
        const pct=correct/questions.length*100;
        r.innerHTML=`<div class="row between"><div><div class="k tiny muted">本节测验成绩</div><div class="val">${Math.round(pct)}%</div></div>
          <button class="btn sm" data-retry>重新作答</button></div>`;
        r.querySelector('[data-retry]').addEventListener('click',()=>G.views.lesson({id:lessonId}));
        S.updateProgress(lessonId,{quizScore:pct});
      }
    }
    return { judgeAnswer };
  };
})(window.GBA = window.GBA || {});
