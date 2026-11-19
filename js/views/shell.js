/* 应用外壳：header + 底部导航 */
(function (G) {
  const TABS = [
    {base:'home', icon:'home', label:'指挥中心', path:'home'},
    {base:'courses', icon:'book', label:'课程', path:'courses'},
    {base:'lab', icon:'lab', label:'实验室', path:'lab'},
    {base:'cases', icon:'case', label:'案例', path:'cases'},
    {base:'me', icon:'me', label:'我的', path:'me'}
  ];

  G.renderShell = function () {
    const app = document.getElementById('app');
    app.innerHTML = `
      <header class="app-header">
        <div class="brand">
          <div class="brand-mark">◈</div>
          <div class="brand-text"><b>GLOBAL BUSINESS</b><br><span class="tiny dim" style="letter-spacing:.18em">ACADEMY</span></div>
        </div>
        <div class="header-actions">
          <button class="icon-btn" data-go="english" title="专业英语">文</button>
          <button class="icon-btn" data-go="me" title="我的">${G.icons.me(18)}</button>
        </div>
      </header>
      <main id="view" class="view"></main>
      <nav class="tabbar">
        ${TABS.map(t=>`<button class="tab" data-base="${t.base}" data-go="${t.path}">
          ${G.icons[t.icon](22)}<span>${t.label}</span></button>`).join('')}
      </nav>
      <div id="toast"></div>`;
    app.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>G.router.go(el.dataset.go)));
  };

  G.mount = function (html) {
    const v = document.getElementById('view');
    v.innerHTML = html;
    return v;
  };
})(window.GBA = window.GBA || {});
