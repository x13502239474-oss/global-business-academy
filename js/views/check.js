/* 模块检测：单选，提交后给解析，记录成绩 */
(function (G) {
  const D = G.data, S = G.store;
  G.views = G.views || {};

  G.views.check = function (params, query) {
    const id = params.id || query.id;
    const mod = D.moduleById[id];
    if (!mod) { G.router.go('courses'); return; }
    G.setChrome('courses', mod.title + ' · 检测');
    const qs = (D.checks || {})[id] || [];
    const last = S.checkOf(id);

    if (!qs.length) {
      G.mount(`<div class="crumb"><a href="#/module?id=${id}">${mod.title}</a> / 模块检测</div>
        <div class="empty"><b>本模块检测题尚未就绪</b>可先复习章节内容</div>`);
      return;
    }

    G.mount(`
      <div class="crumb"><a href="#/module?id=${id}">${mod.code} ${mod.title}</a> / 模块检测</div>
      <div class="page-title">模块检测 · ${mod.title}</div>
      <div class="page-sub">${qs.length} 题 · 单选 · 交卷后给解析${last ? ` · 上次 ${last.score}/${last.total}` : ''}</div>

      <div id="qbox">
        ${qs.map((q, i) => `<div class="quiz-q" data-q="${i}">
          <div class="qt"><span class="qn">Q${i + 1}</span><span>${q.stem}</span></div>
          <div class="opts">
            ${q.options.map((o, oi) => `<div class="opt" data-pick="${i}" data-val="${oi}"><span class="ok">${'ABCD'[oi]}</span><span>${o}</span></div>`).join('')}
          </div>
          <div class="explain" data-exp="${i}"><div class="eb">解析</div>${q.exp}</div>
        </div>`).join('')}
      </div>

      <div class="row" style="margin-top:18px;gap:10px">
        <button class="btn primary" id="submitAll">提交并查看解析</button>
        <a class="btn" href="#/module?id=${id}">返回模块</a>
      </div>
      <div id="score" style="margin-top:16px"></div>
    `);

    const answers = new Array(qs.length).fill(null);
    document.querySelectorAll('[data-pick]').forEach(el => el.addEventListener('click', () => {
      const i = +el.dataset.pick;
      document.querySelectorAll(`[data-pick="${i}"]`).forEach(x => x.classList.remove('sel'));
      el.classList.add('sel');
      answers[i] = +el.dataset.val;
    }));

    document.getElementById('submitAll').addEventListener('click', () => {
      if (answers.some(a => a === null)) { G.toast('还有题目没作答'); return; }
      let score = 0;
      qs.forEach((q, i) => {
        const right = answers[i] === q.answer;
        if (right) score++;
        document.querySelectorAll(`[data-pick="${i}"]`).forEach(x => {
          const v = +x.dataset.val;
          if (v === q.answer) x.classList.add('correct');
          else if (v === answers[i]) x.classList.add('wrong');
        });
        document.querySelector(`[data-exp="${i}"]`).classList.add('show');
      });
      S.saveCheck(id, score, qs.length);
      const pct = Math.round(score / qs.length * 100);
      document.getElementById('score').innerHTML = `<div class="result-box">
        <div class="row between">
          <div><div class="tiny dim">本次得分</div><div class="val">${score} / ${qs.length}</div>
          <div class="tiny ${pct >= 80 ? '' : 'muted'}" style="margin-top:2px">${pct >= 80 ? '掌握良好，可以进入下一模块' : '建议回看错题对应章节，再做一次'}</div></div>
          <button class="btn" onclick="location.reload()">重做</button>
        </div>
      </div>`;
      document.getElementById('submitAll').disabled = true;
      G.toast('已记录成绩');
    });
  };
})(window.GBA = window.GBA || {});
