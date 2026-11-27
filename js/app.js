/* 启动：注册路由 */
(function (G) {
  const R = G.router;

  function boot() {
    G.renderShell();
    R.reg('home', () => G.views.home());
    R.reg('courses', () => G.views.courses());
    R.reg('module', (p, q) => G.views.module(p, q));
    R.reg('lesson', (p, q) => G.views.lesson(p, q));
    R.reg('cases', (p, q) => G.views.cases(p, q));
    R.reg('case', (p, q) => G.views.caseView(p, q));
    R.reg('practice', () => G.views.practice());
    R.reg('project', (p, q) => G.views.project(p, q));
    R.reg('control', () => G.views.control());
    R.reg('check', (p, q) => G.views.check(p, q));
    R.reg('me', () => G.views.me());
    R.reg('sources', () => G.views.sources());
    R.setNotFound(() => G.views.home());
    R.start();

    if (!localStorage.getItem('gba_welcomed_v2')) {
      localStorage.setItem('gba_welcomed_v2', '1');
      setTimeout(() => G.toast('GLOBAL BUSINESS ACADEMY 2.0 已更新'), 700);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.GBA = window.GBA || {});
