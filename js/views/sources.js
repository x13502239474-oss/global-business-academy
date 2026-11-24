/* 资料来源与时效说明 */
(function (G) {
  const D = G.data, U = G.utils;
  G.views = G.views || {};

  const RATING_LABEL = { A: 'A 主干', B: 'B 局部', C: 'C 背景', X: '剔除' };
  const BASIS = { official: '官方确认', multi: '多源一致', est: '第三方估算', unv: '未证实' };

  G.views.sources = function () {
    G.setChrome('sources', '资料来源与时效说明');
    const s = D.sources || { books: [], checks: [], conflicts: [], official: [], discipline: [] };

    G.mount(`
      <div class="page-title">资料来源与时效说明</div>
      <div class="page-sub">核查日期 2026-11-24 · 平台规则与功能以官方帮助中心为准 · 不以出版年份判断知识价值</div>

      <div class="card" style="margin-bottom:22px">
        <div class="small" style="color:var(--ink-600);line-height:1.9">
          <b>三条判断原则。</b>
          第一，经典理论与平台操作必须分开评估——同一本书里，这两类内容的保质期差十倍。
          第二，书的"日期"不等于书的"版本"，要看正文特征而不是文件元数据。
          第三，"能用"不等于"该用"：课程按知识缺口取材，不按书本数量取材。
        </div>
        <div class="mix-legend" style="margin-top:14px">
          <span><i style="background:#1D4ED8"></i>官方文档 40%</span>
          <span><i style="background:#0D9488"></i>A 级教材 30%</span>
          <span><i style="background:#B45309"></i>B 级资料 20%</span>
          <span><i style="background:#15803D"></i>课程自有案例 10%</span>
        </div>
      </div>

      <div class="sec-head"><h2>参考资料取舍</h2><span class="more">${s.books.length} 份</span></div>
      <div class="tbl-scroll">
        <table class="tbl">
          <tr><th>资料</th><th style="width:74px">评级</th><th>采用什么</th><th>不用什么</th></tr>
          ${s.books.map(b => `<tr>
            <td><b>${b.name}</b><div class="tiny dim">${b.author}${b.year ? ' · ' + b.year : ''}</div></td>
            <td><span class="rating ${b.rating}">${RATING_LABEL[b.rating]}</span></td>
            <td>${b.use}</td>
            <td class="muted">${b.skip}</td>
          </tr>`).join('')}
        </table>
      </div>

      <div class="sec-head"><h2>平台规则的时效性核查</h2><span class="more">${s.checks.length} 条 · 核对 2026-11</span></div>
      <div class="tiny dim" style="margin:-6px 0 10px">依据强度：<span class="eta official">官方确认</span> <span class="eta multi">多源一致</span> <span class="eta est">第三方估算</span> <span class="eta unv">未证实</span></div>
      <div class="tbl-scroll">
        <table class="tbl">
          <tr><th style="width:120px">主题</th><th>常见过时说法</th><th>2026 年 11 月的实际情况</th><th style="width:80px">依据</th></tr>
          ${s.checks.map(c => `<tr>
            <td><b>${c.topic}</b></td>
            <td class="muted">${c.old}</td>
            <td>${c.now}</td>
            <td><span class="eta ${c.basis}">${BASIS[c.basis]}</span></td>
          </tr>`).join('')}
        </table>
      </div>

      <div class="callout warn">
        <span class="ct">这张表最重要的结论</span>
        结论本身会过期。任何写死数字的教材都会在 12–18 个月内出现错误。所以课程里所有平台参数统一呈现为三件套：<b>当前值 + 查询入口 + 变更史</b>。
      </div>

      <div class="sec-head"><h2>观点冲突如何裁决</h2></div>
      ${s.conflicts.map(c => `<div class="card" style="margin-bottom:10px">
        <b style="font-size:14px">${c.q}</b>
        <div class="small muted" style="margin-top:6px;line-height:1.8">${c.detail}</div>
        <div class="small" style="margin-top:8px;color:var(--ink-800)"><b>课程采用：</b>${c.use}</div>
      </div>`).join('')}

      <div class="sec-head"><h2>官方核对入口</h2></div>
      <div class="tbl-scroll">
        <table class="tbl">
          <tr><th style="width:130px">平台</th><th>建议核对的位置</th></tr>
          ${s.official.map(o => `<tr><td><b>${o.platform}</b></td><td>${o.entries}</td></tr>`).join('')}
        </table>
      </div>

      <div class="sec-head"><h2>内容纪律</h2></div>
      <div class="card flat">
        <ul style="margin:0;padding-left:20px">
          ${s.discipline.map(d => `<li style="font-size:13.5px;color:var(--ink-600);margin-bottom:7px">${d}</li>`).join('')}
        </ul>
      </div>
    `);
  };
})(window.GBA = window.GBA || {});
