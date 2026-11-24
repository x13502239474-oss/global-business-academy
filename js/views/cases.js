/* 案例库：列表 + 详情 */
(function (G) {
  const D = G.data, S = G.store, U = G.utils;
  G.views = G.views || {};

  const K_LABEL = { f: '公开事实', a: '分析', s: '教学推演' };

  G.views.cases = function (params, query) {
    G.setChrome('cases', '案例库');
    const all = D.cases || [];
    const plats = ['全部', ...Array.from(new Set(all.map(c => c.platform)))];
    const cur = query.p || '全部';

    function list() {
      const items = cur === '全部' ? all : all.filter(c => c.platform === cur || (c.platforms || []).includes(cur));
      return items.map(c => `<a class="case-card" style="--mc:${c.color || '#2563EB'}" href="#/case?id=${c.id}">
        <div class="ch"><span class="plat">${c.platform}</span><span class="tiny dim">${c.type}</span></div>
        <b>${c.name}</b>
        <p>${c.intro}</p>
        <div class="cf">
          <span class="chip line">${c.region}</span>
          <span class="chip line">${c.sector}</span>
          ${S.isCaseFav(c.id) ? '<span class="chip">★ 已收藏</span>' : ''}
        </div>
      </a>`).join('');
    }

    G.mount(`
      <div class="page-title">真实案例库</div>
      <div class="page-sub">${all.length} 个案例 · 覆盖六个平台与 B2B / B2C / 中国出海 / 创作者四类主体 · 只使用公开可查信息，不编造数据</div>

      <div class="filter-bar" id="fbar">
        ${plats.map(p => `<button data-p="${p}" class="${p === cur ? 'on' : ''}">${p}</button>`).join('')}
        <button data-p="__fav">★ 我的收藏</button>
      </div>

      <div class="case-grid" id="clist">${list()}</div>

      <div class="section-gap"></div>
      <div class="card flat">
        <div class="small muted" style="line-height:1.85">
          案例的写法说明：每条内容都标注了 <span class="k-mark k-f">公开事实</span>
          <span class="k-mark k-a">分析</span> <span class="k-mark k-s">教学推演</span> 三类。
          品牌名与公开做法属于事实；策略解读属于分析；具体数字推演属教学推演，不代表企业真实经营数据。
          案例的价值不在"复制成功"，而在"看懂它的约束条件"。
        </div>
      </div>
    `);

    document.getElementById('fbar').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const p = b.dataset.p;
      document.querySelectorAll('#fbar button').forEach(x => x.classList.toggle('on', x === b));
      const box = document.getElementById('clist');
      if (p === '__fav') {
        const favs = all.filter(c => S.isCaseFav(c.id));
        box.innerHTML = favs.length ? favs.map(c => `<a class="case-card" href="#/case?id=${c.id}"><div class="ch"><span class="plat">${c.platform}</span></div><b>${c.name}</b><p>${c.intro}</p></a>`).join('') : '<div class="empty"><b>还没有收藏案例</b>在案例详情页点“收藏”即可</div>';
      } else {
        const items = p === '全部' ? all : all.filter(c => c.platform === p || (c.platforms || []).includes(p));
        box.innerHTML = items.map(c => `<a class="case-card" style="--mc:${c.color || '#2563EB'}" href="#/case?id=${c.id}">
          <div class="ch"><span class="plat">${c.platform}</span><span class="tiny dim">${c.type}</span></div>
          <b>${c.name}</b><p>${c.intro}</p>
          <div class="cf"><span class="chip line">${c.region}</span><span class="chip line">${c.sector}</span></div></a>`).join('');
      }
    });
  };

  G.views.caseView = function (params, query) {
    const id = params.id || query.id;
    const c = (D.cases || []).find(x => x.id === id);
    if (!c) { G.router.go('cases'); return; }
    G.setChrome('cases', c.name);

    G.mount(`
      <div class="crumb"><a href="#/cases">案例库</a> / <span>${c.name}</span></div>

      <div class="case-hero" style="--mc:${c.color || '#2563EB'}">
        <div class="ch-top">
          <span class="chip tint" style="--mc:${c.color || '#2563EB'}">${(c.platforms || [c.platform]).join(' · ')}</span>
          <span class="chip line">${c.type}</span>
          <span class="chip line">${c.region}</span>
          <span class="chip line">${c.sector}</span>
        </div>
        <h1>${c.name}</h1>
        <div class="sub">${c.intro}</div>
        <div class="row" style="margin-top:14px;gap:8px">
          <button class="btn sm" id="favCase">${S.isCaseFav(c.id) ? '★ 已收藏' : '☆ 收藏案例'}</button>
          ${c.learn ? `<a class="btn sm" href="#/lesson?id=${c.learn}">关联课时</a>` : ''}
        </div>
      </div>

      ${c.secs.map((s, i) => `<div class="case-sec">
        <h2><span class="cn">${String(i + 1).padStart(2, '0')}</span>${s.t} <span class="k-mark k-${s.k}">${K_LABEL[s.k]}</span></h2>
        <p>${s.x}</p>
      </div>`).join('')}

      <div class="sec-head"><h2>可复制的做法</h2></div>
      <div class="card"><ul style="margin:0;padding-left:20px">${(c.copy || []).map(x => `<li style="font-size:13.5px;color:var(--ink-700);margin-bottom:7px">${x}</li>`).join('')}</ul></div>

      <div class="sec-head"><h2>不要照搬的部分</h2></div>
      <div class="card flat"><ul style="margin:0;padding-left:20px">${(c.warn || []).map(x => `<li style="font-size:13.5px;color:var(--ink-600);margin-bottom:7px">${x}</li>`).join('')}</ul></div>

      <div class="source-note">
        <b>来源说明：</b>${c.src || '本案例基于公开可查的品牌内容与媒体报道整理，未使用非公开数据。'}
        案例中的描述分三级：公开事实（品牌名、公开做法）、分析（策略解读）、教学推演（推演数字，不代表企业真实经营数据）。
        平台做法会随规则变化，具体操作请以官方文档当期口径为准。
      </div>

      <div class="row between" style="margin-top:22px">
        <a class="btn sm" href="#/cases">${G.icon('back', 14)} 返回案例库</a>
        <a class="btn sm" href="#/practice">做一个实战项目</a>
      </div>
    `);

    document.getElementById('favCase').addEventListener('click', e => {
      const on = S.toggleCaseFav(c.id);
      e.currentTarget.textContent = on ? '★ 已收藏' : '☆ 收藏案例';
      G.toast(on ? '已收藏' : '已取消');
    });
  };
})(window.GBA = window.GBA || {});
