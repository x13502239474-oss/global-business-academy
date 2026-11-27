// GBA 2.0 内容与结构校验（Node 环境，无需浏览器）
// 用法: node tools/validate.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

// --- 极简 DOM 桩：只为了让视图文件能在 Node 里被加载而不报错 ---
const noop = () => {};
const fakeEl = () => ({ addEventListener: noop, removeEventListener: noop, classList: { add: noop, remove: noop, toggle: noop }, style: {}, setAttribute: noop, querySelectorAll: () => [], appendChild: noop, innerHTML: '', textContent: '' });
const sandbox = {
  console,
  setTimeout: noop, clearTimeout: noop, setInterval: noop,
  document: {
    readyState: 'complete',
    addEventListener: noop, removeEventListener: noop,
    getElementById: () => fakeEl(),
    querySelector: () => fakeEl(),
    querySelectorAll: () => [],
    createElement: () => fakeEl(),
    body: fakeEl(),
    documentElement: fakeEl()
  },
  localStorage: null,
  IntersectionObserver: class { observe() {} unobserve() {} disconnect() {} },
  HashChangeEvent: class {},
  CustomEvent: class { constructor(t, o) { this.type = t; Object.assign(this, o); } },
  location: { hash: '', href: '', reload: noop },
  history: { replaceState: noop, pushState: noop },
  window: {}
};
sandbox.window.GBA = {
  data: {}, views: {}, core: {},
  icon: () => '', toast: noop, mount: noop, setChrome: noop
};
sandbox.window.addEventListener = noop;
sandbox.window.removeEventListener = noop;
sandbox.window.dispatchEvent = noop;
sandbox.window.scrollTo = noop;
sandbox.window.matchMedia = () => ({ matches: false, addEventListener: noop, addListener: noop });
sandbox.window.location = { hash: '', reload: noop };
sandbox.window.localStorage = null;
sandbox.GBA = sandbox.window.GBA;
const ctx = vm.createContext(sandbox);

// localStorage 桩（store.js 会读写）
const mem = {};
sandbox.localStorage = {
  getItem: k => (k in mem ? mem[k] : null),
  setItem: (k, v) => { mem[k] = String(v); },
  removeItem: k => { delete mem[k]; }
};
sandbox.window.localStorage = sandbox.localStorage;

const CORE = ['js/core/utils.js', 'js/core/icons.js', 'js/core/store.js', 'js/core/router.js'];
const DATA = ['js/data/modules.js',
  'js/data/lessons_s0.js', 'js/data/lessons_x.js', 'js/data/lessons_fb.js',
  'js/data/lessons_yt.js', 'js/data/lessons_tk.js', 'js/data/lessons_ig.js',
  'js/data/lessons_li.js', 'js/data/lessons_mk.js', 'js/data/lessons_tr.js',
  'js/data/lessons_cp.js', 'js/data/lessons_di.js', 'js/data/lessons_da.js', 'js/data/lessons_infra_platforms.js',
  'js/data/cases.js', 'js/data/projects.js', 'js/data/checks.js', 'js/data/sources.js', 'js/data/control.js'];
const VIEWS = ['js/views/shell.js', 'js/views/home.js', 'js/views/courses.js', 'js/views/lesson.js',
  'js/views/cases.js', 'js/views/practice.js', 'js/views/control.js', 'js/views/check.js', 'js/views/me.js', 'js/views/sources.js'];

let errs = 0, warns = 0;
const err = m => { errs++; console.log('  \u2717 ' + m); };
const warn = m => { warns++; console.log('  ! ' + m); };
const ok = m => console.log('  \u2713 ' + m);

console.log('\n[1] 语法与加载');
let loaded = 0;
for (const f of [...CORE, ...DATA, ...VIEWS, 'js/app.js']) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) { err(f + ' 不存在'); continue; }
  const code = fs.readFileSync(p, 'utf8');
  try { vm.runInContext(code, ctx, { filename: f }); loaded++; }
  catch (e) {
    if (f === 'js/app.js' && /renderShell|insertBefore|null/.test(e.message)) { loaded++; }
    else err(f + ' \u2192 ' + e.message);
  }
}
if (!errs) ok(loaded + ' 个脚本全部解析并加载成功');

const G = sandbox.window.GBA;
const D = G.data || {};

console.log('\n[2] 课程结构与覆盖');
const mods = D.modules || [];
const allIds = [];
mods.forEach(m => (m.chapters || []).forEach(c => allIds.push({ id: c.id, mod: m.id, t: c.t })));
const lessons = D.lessons || {};
console.log('  模块 ' + mods.length + '，章节 ' + allIds.length + '，有正文 ' + Object.keys(lessons).length);
const missing = allIds.filter(x => !lessons[x.id]);
if (missing.length) missing.forEach(x => err('缺正文: ' + x.id + ' (' + x.mod + ') ' + x.t));
else ok(allIds.length + ' 个章节全部有正文');

const extra = Object.keys(lessons).filter(id => !allIds.some(x => x.id === id));
if (extra.length) warn('多余正文 id: ' + extra.join(', '));

// 模块占比
if (D.curriculumWeights) console.log('  学时配比: ' + JSON.stringify(D.curriculumWeights));

console.log('\n[3] 讲义深度（7 段 / 字数 / 表格 / callout）');
const STD = ['本节要解决的问题', '核心概念', '机制与原理', '操作步骤', '商业场景', '案例', '常见问题与风险'];
let depthFail = 0; const charList = [];
for (const x of allIds) {
  const L = lessons[x.id];
  if (!L) continue;
  const secs = L.sections || [];
  const hs = secs.map(s => (s.h || '').replace(/^\d+[\.、]\s*/, '').trim());
  const badH = STD.filter(h => !hs.includes(h));
  const html = secs.map(s => s.html || '').join('');
  const chars = html.replace(/<[^>]+>/g, '').replace(/\s+/g, '').length;
  charList.push({ id: x.id, chars });
  const tables = (html.match(/<table/g) || []).length;
  const calls = (html.match(/class="callout/g) || []).length;
  const probs = [];
  if (badH.length) probs.push('缺段:' + badH.join('/'));
  if (chars < 3600) probs.push('字数 ' + chars);
  if (tables < 2) probs.push('表格 ' + tables);
  if (calls < 1) probs.push('callout ' + calls);
  if (!L.objectives || L.objectives.length < 3) probs.push('学习目标不足');
  if (!L.summary || L.summary.length < 3) probs.push('总结不足');
  if (!L.terms || Object.keys(L.terms).length < 3) probs.push('术语不足');
  if (!L.official || !L.official.length) probs.push('缺官方核对入口');
  if (!L.practice) probs.push('无本节实操');
  if (probs.length) { depthFail++; err(x.id + ' \u2192 ' + probs.join(' | ')); }
}
charList.sort((a, b) => a.chars - b.chars);
if (!depthFail) {
  const sum = charList.reduce((a, b) => a + b.chars, 0);
  ok('全部达标：正文合计 ' + sum.toLocaleString() + ' 字，'
    + '最短 ' + charList[0].id + ' ' + charList[0].chars + ' 字，'
    + '最长 ' + charList[charList.length - 1].id + ' ' + charList[charList.length - 1].chars + ' 字');
} else {
  console.log('  （' + depthFail + ' 节未达标，最短 ' + charList[0].id + ' ' + charList[0].chars + ' 字）');
}

console.log('\n[4] 案例库');
const cases = D.cases || [];
console.log('  案例 ' + cases.length + ' 个');
cases.forEach(c => {
  if ((c.secs || []).length < 12) err('案例 ' + c.id + ' 段数 ' + (c.secs || []).length);
  if (!c.copy || c.copy.length < 2) err('案例 ' + c.id + ' 可复制做法不足');
  if (!c.warn || !c.warn.length) err('案例 ' + c.id + ' 缺「不要照搬」');
  if (!c.src) err('案例 ' + c.id + ' 缺来源说明');
  if (!c.learn) err('案例 ' + c.id + ' 未关联课时');
  if (!c.secs.every(s => s.k && 'fas'.includes(s.k))) err('案例 ' + c.id + ' 有段落缺三级标记');
});
const PLATS = ['X', 'Facebook', 'YouTube', 'TikTok', 'Instagram', 'LinkedIn'];
const covP = PLATS.filter(p => cases.some(c => c.platform === p || (c.platforms || []).includes(p)));
if (covP.length < 6) err('平台覆盖缺: ' + PLATS.filter(p => !covP.includes(p)).join(','));
else ok('六平台全覆盖');

console.log('\n[5] 实战项目');
const projs = D.projects || [];
console.log('  项目 ' + projs.length + ' 个');
projs.forEach(p => {
  ['brief', 'steps', 'deliver', 'criteria'].forEach(k => {
    if (!p[k] || !p[k].length) err('项目 ' + p.id + ' 缺 ' + k);
  });
  if ((p.steps || []).length < 5) err('项目 ' + p.id + ' 步骤仅 ' + (p.steps || []).length);
});

console.log('\n[6] 检测题库');
const checks = D.checks || {};
const needCheck = mods.map(m => m.id);
needCheck.forEach(id => {
  const q = checks[id] || checks[id.toLowerCase()];
  if (!q || !q.length) err('模块 ' + id + ' 无题目');
  else if (q.length < 6) err('模块 ' + id + ' 仅 ' + q.length + ' 题');
  else if (!q.every(x => x.options && x.options.length >= 3 && typeof x.answer === 'number' && x.exp)) err('模块 ' + id + ' 题目字段不全');
});

console.log('\n[7] 视图与路由');
const views = G.views || {};
['home', 'courses', 'module', 'lesson', 'cases', 'caseView', 'practice', 'project', 'control', 'check', 'me', 'sources']
  .forEach(v => { if (typeof views[v] !== 'function') err('视图缺失: ' + v); });
const appSrc = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
const routes = [...appSrc.matchAll(/R\.reg\('([a-z]+)'/g)].map(m => m[1]);
['home', 'courses', 'module', 'lesson', 'cases', 'case', 'practice', 'project', 'control', 'check', 'me', 'sources']
  .forEach(r => { if (!routes.includes(r)) err('路由缺失: ' + r); });
if (!errs) ok(routes.length + ' 条路由已注册');

console.log('\n[8] 内容纪律抽查');
const badWords = ['TODO', '待补充', 'Lorem ipsum', '占位符', '此处省略', '见上文XXX'];
let bad = 0;
for (const x of allIds) {
  const L = lessons[x.id]; if (!L) continue;
  const html = (L.sections || []).map(s => s.html || '').join('');
  badWords.forEach(w => { if (html.includes(w)) { err(x.id + ' 含占位词 "' + w + '"'); bad++; } });
  if (/\$\{/.test(html)) { err(x.id + ' 正文含未转义的模板插值'); bad++; }
}
if (!bad) ok('无占位词与模板插值残留');

console.log('\n===== 结果：' + errs + ' 个错误，' + warns + ' 个提示 =====\n');
process.exit(errs ? 1 : 0);
