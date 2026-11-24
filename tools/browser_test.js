/* GBA 2.0 冒烟测试：桌面 1280 / 移动 390 全路由 + 交互 + 旧数据迁移
   前置：在 gba/ 目录启动静态服务  python -m http.server 8099
   运行：node tools/browser_test.js
*/
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:8099/index.html';
const SHOTS = path.resolve(__dirname, '../shots');
if (!fs.existsSync(SHOTS)) fs.mkdirSync(SHOTS, { recursive: true });

const ROUTES = [
  'home', 'courses', 'module?id=S0', 'module?id=SX', 'module?id=SL',
  'lesson?id=s0-1', 'lesson?id=x-4', 'lesson?id=fb-3', 'lesson?id=yt-6',
  'lesson?id=tk-3', 'lesson?id=ig-5', 'lesson?id=li-6', 'lesson?id=mk-11',
  'lesson?id=tr-3', 'lesson?id=cp-4',
  'cases', 'case?id=duolingo', 'case?id=maersk',
  'practice', 'project?id=p1', 'project?id=p7',
  'check?id=SX', 'check?id=TR', 'me', 'sources'
];

let fails = 0;
const bad = m => { fails++; console.log('  ✗ ' + m); };
const good = m => console.log('  ✓ ' + m);

async function goto(page, route) {
  await page.evaluate(r => { location.hash = '#/' + r; }, route);
  try {
    await page.waitForFunction(
      r => location.hash === '#/' + r && document.getElementById('view') && document.getElementById('view').innerHTML.length > 300,
      { timeout: 5000 }, route
    );
  } catch (e) { /* 交给调用处判空 */ }
  await new Promise(r => setTimeout(r, 220));
}

/* 偶发的静态资源加载中断会让部分脚本缺失，导致 G.views.xxx 不存在。
   这里做一次加载完整性校验，不完整就重载（最多 3 次）。 */
async function ensureLoaded(page) {
  for (let i = 0; i < 3; i++) {
    const okAll = await page.evaluate(() =>
      !!(window.GBA && GBA.views && GBA.views.courses && GBA.views.lesson && GBA.views.practice &&
         GBA.views.project && GBA.views.check && GBA.views.me && GBA.views.sources &&
         GBA.data && GBA.data.totalLessons === 84 &&
         Object.keys(GBA.data.lessons || {}).length === 84));
    if (okAll) return true;
    await page.goto(BASE, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 300));
  }
  return false;
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    protocolTimeout: 180000,
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars']
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

  /* ---------- 1. 桌面端全路由 ---------- */
  console.log('\n[1] 桌面端 1280×900 全路由');
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  if (!await ensureLoaded(page)) bad('首屏脚本未完整加载');
  for (const r of ROUTES) {
    const before = errors.length;
    await goto(page, r);
    const m = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
      len: (document.getElementById('view') || {}).innerHTML ? document.getElementById('view').innerHTML.length : 0,
      title: (document.querySelector('.topbar-title') || {}).textContent || ''
    }));
    const ov = m.sw > m.cw + 1;
    const empty = m.len < 400;
    if (ov) bad(r + ' 横向溢出 ' + m.sw + '>' + m.cw);
    if (empty) bad(r + ' 视图内容过少 ' + m.len);
    if (errors.length > before) bad(r + ' 报错: ' + errors.slice(before).join(' | ').slice(0, 160));
    if (!ov && !empty && errors.length === before) console.log('  ✓ ' + r.padEnd(22) + ' len=' + m.len);
  }

  /* ---------- 2. 移动端 390×844 ---------- */
  console.log('\n[2] 移动端 390×844 全路由');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  if (!await ensureLoaded(page)) bad('移动端首屏脚本未完整加载');
  for (const r of ROUTES) {
    await goto(page, r);
    const m = await page.evaluate(() => {
      const tb = document.querySelector('.tabbar');
      const sb = document.querySelector('.sidebar');
      const ab = document.querySelector('.action-bar');
      const cs = e => e ? getComputedStyle(e) : null;
      return {
        sw: document.documentElement.scrollWidth,
        cw: document.documentElement.clientWidth,
        tabDisp: tb ? cs(tb).display : 'none',
        sideDisp: sb ? cs(sb).display : 'none',
        abBottom: ab ? Math.round(ab.getBoundingClientRect().bottom) : null,
        tabTop: tb ? Math.round(tb.getBoundingClientRect().top) : null
      };
    });
    const ov = m.sw > m.cw + 1;
    if (ov) bad(r + ' 移动端横向溢出 ' + m.sw + '>' + m.cw);
    if (m.sideDisp !== 'none') bad(r + ' 移动端侧栏未隐藏');
    if (m.tabDisp === 'none') bad(r + ' 移动端标签栏未显示');
    if (m.abBottom !== null && m.tabTop !== null && m.abBottom > m.tabTop + 1) bad(r + ' 操作栏压住标签栏 ' + m.abBottom + '>' + m.tabTop);
    if (!ov) console.log('  ✓ ' + r.padEnd(22) + ' sw=' + m.sw + ' tab=' + m.tabDisp);
  }

  /* ---------- 3. 交互 ---------- */
  console.log('\n[3] 交互与持久化');
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.removeItem('gba_state'));
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await ensureLoaded(page);

  // 3.1 标记学完
  await goto(page, 'lesson?id=x-4');
  await page.click('#doneBtn');
  await new Promise(r => setTimeout(r, 120));
  let st = await page.evaluate(() => JSON.parse(localStorage.getItem('gba_state')));
  st.progress['x-4'] && st.progress['x-4'].done ? good('标记学完 → progress.x-4.done 持久化') : bad('标记学完未写入');

  // 3.2 笔记
  await page.type('#noteInput', '测试笔记：Thread 第一条要先给结论');
  await page.click('#addNote');
  await new Promise(r => setTimeout(r, 120));
  st = await page.evaluate(() => JSON.parse(localStorage.getItem('gba_state')));
  (st.noteBook.length === 1 && st.noteBook[0].lessonId === 'x-4') ? good('笔记写入并可回读') : bad('笔记未保存');

  // 3.3 收藏课时
  await page.click('#favBtn');
  await new Promise(r => setTimeout(r, 100));
  st = await page.evaluate(() => JSON.parse(localStorage.getItem('gba_state')));
  st.favorites.includes('x-4') ? good('课时收藏') : bad('课时收藏失败');

  // 3.4 案例收藏
  await goto(page, 'case?id=maersk');
  await page.waitForSelector('#favCase', { timeout: 4000 });
  await page.click('#favCase');
  await new Promise(r => setTimeout(r, 250));
  st = await page.evaluate(() => JSON.parse(localStorage.getItem('gba_state')));
  st.caseFav.includes('maersk') ? good('案例收藏') : bad('案例收藏失败');

  // 3.5 实战项目勾选
  await goto(page, 'project?id=p7');
  const hasTask = await page.evaluate(() => !!document.querySelector('.deliver input[type=checkbox], .deliver .checkline input, input[data-task]'));
  if (hasTask) {
    await page.evaluate(() => document.querySelector('input[data-task]') ? document.querySelector('input[data-task]').click() : document.querySelector('.deliver input').click());
    await new Promise(r => setTimeout(r, 120));
    st = await page.evaluate(() => JSON.parse(localStorage.getItem('gba_state')));
    (st.projectSubs.p7 && Object.keys(st.projectSubs.p7.done).length) ? good('实战交付物勾选持久化') : bad('实战勾选未保存');
  } else bad('实战页未找到可勾选项');

  // 3.6 模块检测
  await goto(page, 'check?id=SX');
  const quizInfo = await page.evaluate(() => ({ q: document.querySelectorAll('.quiz-q').length, opt: document.querySelectorAll('.quiz-q .opt').length }));
  if (quizInfo.q >= 6) {
    await page.evaluate(() => {
      document.querySelectorAll('.quiz-q').forEach(el => { const o = el.querySelector('.opt'); if (o) o.click(); });
    });
    const submit = await page.evaluate(() => !!document.getElementById('submitAll'));
    if (submit) {
      await page.click('#submitAll');
      await new Promise(r => setTimeout(r, 200));
      st = await page.evaluate(() => JSON.parse(localStorage.getItem('gba_state')));
      const shown = await page.evaluate(() => document.querySelectorAll('.explain.show').length);
      (st.exam.SX && shown >= 1) ? good('检测提交 → 成绩记录 + 解析展开 (' + st.exam.SX.score + '/' + st.exam.SX.total + ')') : bad('检测提交异常');
    } else bad('检测页无提交按钮');
  } else bad('检测页题目数异常 ' + quizInfo.q);

  // 3.7 全局搜索
  await goto(page, 'home');
  await page.keyboard.press('/');
  await new Promise(r => setTimeout(r, 200));
  const panelOpen = await page.evaluate(() => !!document.querySelector('.search-panel input'));
  if (panelOpen) {
    await page.type('.search-panel input', 'Thread');
    await new Promise(r => setTimeout(r, 200));
    const hits = await page.evaluate(() => document.querySelectorAll('.search-panel .sr').length);
    hits > 0 ? good('全局搜索命中 ' + hits + ' 条') : bad('搜索无结果');
  } else bad('搜索浮层未打开');
  await page.keyboard.press('Escape');

  // 3.8 刷新后状态保持
  await page.reload({ waitUntil: 'networkidle0' });
  const keep = await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('gba_state'));
    return { done: !!(s.progress['x-4'] && s.progress['x-4'].done), notes: s.noteBook.length, exam: !!s.exam.SX };
  });
  (keep.done && keep.notes >= 1 && keep.exam) ? good('刷新后进度/笔记/成绩保持') : bad('刷新后状态丢失 ' + JSON.stringify(keep));

  /* ---------- 4. 1.x 旧数据迁移 ---------- */
  console.log('\n[4] 1.x → 2.0 数据迁移');
  const p2 = await browser.newPage();
  p2.on('pageerror', e => console.log('  ! 迁移页报错 ' + e.message));
  await p2.setViewport({ width: 1280, height: 900 });
  await p2.evaluateOnNewDocument(() => {
    const old = {
      schema: 3,
      progress: {
        'm06-1': { done: true, pct: 100 },
        'm04-4': { done: true, pct: 100 },
        'm08-1': { done: true, pct: 100 },
        'm01-1': { done: true, pct: 100 },
        'm02-3': { done: true, pct: 100 },
        'm03-2': { done: false, pct: 40 }
      },
      noteBook: [{ id: 'n1', lessonId: 'm06-1', text: '旧笔记', at: 1 }],
      favorites: ['m04-4'],
      streak: { count: 12, lastDate: '2026-11-20', days: [] },
      settings: { name: '老用户', theme: 'dark' }
    };
    localStorage.setItem('gba_state', JSON.stringify(old));
  });
  await p2.goto(BASE, { waitUntil: 'networkidle0' });
  await ensureLoaded(p2);
  const mig = await p2.evaluate(() => {
    const s = GBA.store.get();
    return {
      schema: s.schema,
      mapped: s.legacy && s.legacy.mapped,
      v1: s.legacy && s.legacy.v1Completed,
      s01: !!(s.progress['s0-1'] && s.progress['s0-1'].done),
      tr3: !!(s.progress['tr-3'] && s.progress['tr-3'].done),
      cp1: !!(s.progress['cp-1'] && s.progress['cp-1'].done),
      oldKept: !!(s.progress['m01-1'] && s.progress['m01-1'].done),
      notes: s.noteBook.length,
      favs: s.favorites.length,
      streak: s.streak.count,
      name: s.settings.name,
      theme: s.settings.theme,
      done: GBA.store.completedCount(),
      total: GBA.data.totalLessons
    };
  });
  console.log('  ' + JSON.stringify(mig));
  mig.schema === 4 ? good('schema 升至 4') : bad('schema 未升级');
  (mig.mapped === 3 && mig.s01 && mig.tr3 && mig.cp1) ? good('同主题进度映射 3 条生效') : bad('迁移映射异常');
  mig.oldKept ? good('旧进度记录保留未删') : bad('旧进度被删除');
  (mig.notes === 1 && mig.streak === 12 && mig.name === '老用户') ? good('笔记/连续天数/昵称保留') : bad('用户数据丢失');
  mig.theme === 'light' ? good('主题强制回亮色') : bad('主题未重置');
  mig.done <= mig.total ? good('完成数不越界 ' + mig.done + '/' + mig.total) : bad('完成数越界 ' + mig.done + '/' + mig.total);

  /* ---------- 5. 截图（用全新标签页，避免交互测试残留的浮层影响渲染） ---------- */
  console.log('\n[5] 截图');
  const shot = await browser.newPage();
  await shot.setViewport({ width: 1280, height: 900 });
  for (const [r, name] of [['home', 'desk_home'], ['lesson?id=x-4', 'desk_lesson'], ['cases', 'desk_cases'], ['practice', 'desk_practice'], ['sources', 'desk_sources']]) {
    await shot.goto(BASE + '#/' + r, { waitUntil: 'networkidle0' });
    await new Promise(res => setTimeout(res, 300));
    await shot.screenshot({ path: path.join(SHOTS, name + '.png') });
  }
  await shot.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  for (const [r, name] of [['home', 'm_home'], ['lesson?id=li-6', 'm_lesson'], ['me', 'm_me']]) {
    await shot.goto(BASE + '#/' + r, { waitUntil: 'networkidle0' });
    await new Promise(res => setTimeout(res, 300));
    await shot.screenshot({ path: path.join(SHOTS, name + '.png') });
  }
  await shot.close();
  good('截图输出到 shots/');

  console.log('\n运行时错误: ' + (errors.length ? errors.slice(0, 8).join(' | ') : '无'));
  console.log('\n===== ' + (fails ? fails + ' 项失败' : '全部通过') + ' =====\n');
  await browser.close();
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
