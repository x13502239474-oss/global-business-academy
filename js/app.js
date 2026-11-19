/* 启动：注册路由 */
(function (G) {
  const R=G.router;
  function boot(){
    G.renderShell();
    R.reg('home',()=>G.views.home());
    R.reg('courses',()=>G.views.courses());
    R.reg('module',(p,q)=>G.views.module(p,q));
    R.reg('lesson',(p,q)=>G.views.lesson(p,q));
    R.reg('lab',()=>G.views.lab());
    R.reg('tool',(p,q)=>G.views.tool(p,q));
    R.reg('simulator',()=>G.views.simulator());
    R.reg('chain',()=>G.views.chain());
    R.reg('cases',()=>G.views.cases());
    R.reg('case',(p,q)=>G.views.caseView(p,q));
    R.reg('market',(p,q)=>G.views.market(p,q));
    R.reg('english',()=>G.views.english());
    R.reg('me',()=>G.views.me());
    R.reg('sub',(p,q)=>G.views.sub(p,q));
    R.reg('exam',(p,q)=>G.views.exam(p,q));
    R.setNotFound(()=>G.views.home());
    R.start();
    // 首次访问引导
    if(!localStorage.getItem('gba_welcomed')){
      localStorage.setItem('gba_welcomed','1');
      setTimeout(()=>G.toast('欢迎来到 GLOBAL BUSINESS ACADEMY'),600);
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})(window.GBA = window.GBA || {});
