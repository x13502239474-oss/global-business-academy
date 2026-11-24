/* GLOBAL BUSINESS ENGLISH —— 专业词汇 + 邮件写作训练 */
(function (G) {
  const D=G.data,S=G.store,U=G.utils;G.views=G.views||{};
  G.views.english=function(){
    let cat='all',tab='vocab';
    const cats=[...new Set(D.vocab.map(v=>v.cat))];
    const v=G.mount(`<div class="page-title">商业专业英语</div>
      <div class="page-sub">Global Business English · 真正用得上的贸易与营销英语</div>
      <div class="seg" style="margin-bottom:14px"><button class="on" data-tab="vocab">专业词汇</button><button data-tab="email">邮件写作</button></div>
      <div id="enBody"></div>`);
    function render(){
      if(tab==='vocab'){
        const list=cat==='all'?D.vocab:D.vocab.filter(v=>v.cat===cat);
        v.querySelector('#enBody').innerHTML=`
          <div class="lab-cat" style="margin-bottom:12px"><button class="${cat==='all'?'on':''}" data-cat="all">全部</button>
            ${cats.map(c=>`<button class="${cat===c?'on':''}" data-cat="${c}">${c}</button>`).join('')}</div>
          ${list.map(x=>`<div class="vocab-card">
            <div class="row between"><div class="en">${U.esc(x.en)}<span class="speaker" data-say="${U.esc(x.en)}">🔊</span></div>
              <button class="chip ${S.isFav('vocab_'+x.en)?'blue':''}" data-vfav="${U.esc(x.en)}" style="font-size:9px">${S.isFav('vocab_'+x.en)?'★':'☆'}</button></div>
            <div class="cn">${x.cn}</div>
            <div class="def">${x.def}</div>
            <div class="eg">${x.eg}</div>
          </div>`).join('')}`;
        v.querySelectorAll('[data-cat]').forEach(b=>b.addEventListener('click',()=>{cat=b.dataset.cat;render();}));
        v.querySelectorAll('[data-vfav]').forEach(b=>b.addEventListener('click',()=>{S.toggleFav('vocab_'+b.dataset.vfav);render();}));
        v.querySelectorAll('[data-say]').forEach(b=>b.addEventListener('click',()=>{
          if(!S.get().settings.speech){G.toast('语音已在设置中关闭');return;}
          if('speechSynthesis' in window){const u=new SpeechSynthesisUtterance(b.dataset.say);u.lang='en-US';u.rate=.85;speechSynthesis.speak(u);}
          else G.toast('当前浏览器不支持语音');
        }));
      } else {
        v.querySelector('#enBody').innerHTML=D.emails.map(e=>`<details class="accordion">
          <summary><span class="ic" style="color:var(--accent)">${G.icons.email(18)}</span>${e.title}<span class="chev">⌄</span></summary>
          <div class="body"><p class="tiny muted" style="margin:0 0 10px">场景：${e.scene}</p>
            <pre style="white-space:pre-wrap;font-family:var(--mono);font-size:11.5px;line-height:1.7;background:rgba(8,12,22,.5);padding:14px;border-radius:10px;border:1px solid var(--line)">${U.esc(e.body)}</pre>
            <div style="margin-top:10px"><b class="small" style="color:var(--accent)">写作要点</b>
              <ul style="padding-left:18px;margin-top:6px">${e.tips.map(t=>`<li class="small" style="color:var(--text-2);margin-bottom:4px">${t}</li>`).join('')}</ul></div>
            <button class="btn sm" data-practice="${e.id}">✎ 模仿练习</button>
          </div></details>`).join('');
        v.querySelectorAll('[data-practice]').forEach(b=>b.addEventListener('click',()=>{
          const e=D.emails.find(x=>x.id===b.dataset.practice);
          S.addNote('email_'+e.id,'《'+e.title+'》模仿练习\n\n'+e.body);
          G.toast('模板已存入笔记，可在「我的」中编辑练习');
        }));
      }
    }
    v.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{tab=b.dataset.tab;v.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('on',x===b));render();}));
    render();
  };
})(window.GBA = window.GBA || {});
