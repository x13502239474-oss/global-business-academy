/* ============================================================
   STORE — 版本化状态 + LocalStorage 持久化
   2.0（schema 4）：新增实战项目提交、案例收藏、学习计划、模块检测成绩；
   并对 1.x 的学习进度做「同主题映射」，保证改版不丢历史。
   ============================================================ */
(function (G) {
  const KEY = 'gba_state';
  const SCHEMA = 4;

  /* 1.x → 2.0 同主题课时映射：只在语义确实对应时映射，避免虚增进度 */
  const LEGACY_MAP = {
    'm06-1': 's0-1',   // 社媒环境与理论 → 全球社媒格局
    'm06-3': 's0-2',   // 四大社交区域 → 推荐系统如何分发
    'm06-10': 's0-6',  // 社媒数据分析 → 指标树
    'm06-9': 'mk-12',  // 社媒广告与 A/B → 广告指标与测试
    'm05-1': 'mk-1',   // 国际营销基础 → 全球市场与框架
    'm05-2': 'mk-7',   // 全球品牌战略 → 品牌定位
    'm05-3': 'mk-3',   // 跨文化营销 → 文化差异
    'm05-8': 'mk-11',  // 数字营销与流量 → 流量结构
    'm07-1': 'tr-2',   // B2B 与 B2C 商业模式
    'm04-3': 'tr-6',   // 询盘处理与报价
    'm04-4': 'tr-3',   // Incoterms
    'm04-7': 'tr-5',   // 国际结算
    'm08-1': 'cp-1'    // 案例分析方法
  };

  function defaultState() {
    return {
      schema: SCHEMA,
      createdAt: Date.now(),
      progress: {},     // lessonId -> {done, pct, lastPos, seconds, lastAt, quizScore}
      noteBook: [],     // {id, lessonId, text, at}
      wrongBook: [],    // {qid, lessonId, lastAnswer, times, cleared}
      favorites: [],    // lessonId[]
      toolHistory: [],
      exam: {},         // moduleId -> {score, total, at}
      streak: { count: 0, lastDate: '', days: [] },
      dailyGoal: { targetMin: 20, log: {} },
      settings: { name: '学习者', theme: 'light', speech: true, reducedMotion: false },
      visited: [],
      /* 2.0 新增 */
      projectSubs: {},  // projectId -> {text, at, done:{taskIdx:bool}, status}
      caseFav: [],      // caseId[]
      plan: { weeklyMin: 420, weeks: 8, start: null, weeksDone: [] },
      legacy: { v1Completed: 0, mapped: 0, at: 0 }
    };
  }

  let state = load();

  function migrate(s) {
    const d = defaultState();
    if (!s || typeof s !== 'object') return d;

    // 1.x → 2.0：映射同主题进度（原记录保留在 progress 内，不删除）
    if (!s.schema || s.schema < 4) {
      const prog = s.progress || {};
      const doneOld = Object.keys(prog).filter(k => prog[k] && prog[k].done);
      let mapped = 0;
      LEGACY_MAP_KEYS().forEach(([oldId, newId]) => {
        if (prog[oldId] && prog[oldId].done && !prog[newId]) {
          prog[newId] = Object.assign({}, prog[oldId], { done: true, pct: 100, migratedFrom: oldId });
          mapped++;
        }
      });
      s.legacy = { v1Completed: doneOld.length, mapped, at: Date.now() };
    }

    s.schema = SCHEMA;
    for (const k in d) {
      if (s[k] === undefined) s[k] = d[k];
      else if (d[k] && typeof d[k] === 'object' && !Array.isArray(d[k])) {
        s[k] = Object.assign({}, d[k], s[k]);
      }
    }
    if (s.settings) s.settings = Object.assign({}, d.settings, s.settings, { theme: 'light' });
    if (s.streak) s.streak = Object.assign({}, d.streak, s.streak);
    if (s.dailyGoal) s.dailyGoal = Object.assign({}, d.dailyGoal, s.dailyGoal);
    if (s.plan) s.plan = Object.assign({}, d.plan, s.plan);
    return s;
  }
  function LEGACY_MAP_KEYS() { return Object.entries(LEGACY_MAP); }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      return migrate(JSON.parse(raw));
    } catch (e) {
      console.warn('[GBA] load state failed', e);
      return defaultState();
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      window.dispatchEvent(new CustomEvent('gba:state', { detail: state }));
    } catch (e) {
      console.warn('[GBA] save state failed', e);
      G.toast && G.toast('保存失败：浏览器存储空间可能已满');
    }
  }

  const S = {
    get() { return state; },
    set(mutator) { mutator(state); save(); },
    save,

    // ---- 进度 ----
    markVisit(lessonId) {
      this.set(s => {
        s.visited = [lessonId, ...s.visited.filter(x => x !== lessonId)].slice(0, 20);
        if (!s.progress[lessonId]) s.progress[lessonId] = { done: false, pct: 0, lastPos: 0, seconds: 0, lastAt: 0 };
        s.progress[lessonId].lastAt = Date.now();
      });
      this.touchStreak();
    },
    updateProgress(lessonId, patch) {
      this.set(s => {
        if (!s.progress[lessonId]) s.progress[lessonId] = { done: false, pct: 0, lastPos: 0, seconds: 0, lastAt: 0 };
        Object.assign(s.progress[lessonId], patch, { lastAt: Date.now() });
      });
      this.logMinutes(1);
    },
    toggleDone(lessonId) {
      let done = false;
      this.set(s => {
        if (!s.progress[lessonId]) s.progress[lessonId] = { done: false, pct: 0, lastPos: 0, seconds: 0, lastAt: 0 };
        const p = s.progress[lessonId];
        p.done = !p.done;
        p.pct = p.done ? 100 : Math.min(p.pct || 0, 90);
        done = p.done;
      });
      return done;
    },
    isDone(id) { return !!(state.progress[id] && state.progress[id].done); },
    /* 只统计当前课程表里存在的课时：1.x 的旧 id 会保留在 progress 中，
       若一并计入，会出现「已完成 95 / 84 节」这种越界数字。 */
    completedCount() {
      const known = (G.data && G.data.lessonById) || null;
      return Object.keys(state.progress).filter(k => {
        if (known && !known[k]) return false;
        return state.progress[k] && state.progress[k].done;
      }).length;
    },

    // ---- 连续学习 ----
    touchStreak() {
      const today = G.utils.todayKey();
      this.set(s => {
        const st = s.streak;
        if (st.lastDate === today) return;
        const yesterday = G.utils.dateKeyOffset(-1);
        if (st.lastDate === yesterday) st.count = (st.count || 0) + 1;
        else st.count = 1;
        st.lastDate = today;
        st.days = [today, ...st.days.filter(d => d !== today)].slice(0, 90);
      });
    },
    logMinutes(m) {
      const today = G.utils.todayKey();
      this.set(s => { s.dailyGoal.log[today] = (s.dailyGoal.log[today] || 0) + m; });
    },

    // ---- 笔记 ----
    addNote(lessonId, text) {
      const note = { id: 'n' + Date.now(), lessonId, text, at: Date.now() };
      this.set(s => { s.noteBook.unshift(note); });
      return note;
    },
    removeNote(id) { this.set(s => { s.noteBook = s.noteBook.filter(n => n.id !== id); }); },
    notesFor(lessonId) { return state.noteBook.filter(n => n.lessonId === lessonId); },

    // ---- 错题（用于模块检测） ----
    addWrong(qid, lessonId, answer) {
      this.set(s => {
        let w = s.wrongBook.find(x => x.qid === qid);
        if (!w) { w = { qid, lessonId, times: 0, cleared: false }; s.wrongBook.unshift(w); }
        w.lastAnswer = answer; w.times = (w.times || 0) + 1; w.cleared = false; w.at = Date.now();
      });
    },
    clearWrong(qid) { this.set(s => { const w = s.wrongBook.find(x => x.qid === qid); if (w) w.cleared = true; }); },
    activeWrong() { return state.wrongBook.filter(w => !w.cleared); },

    // ---- 收藏课时 ----
    toggleFav(lessonId) {
      let on = false;
      this.set(s => {
        const i = s.favorites.indexOf(lessonId);
        if (i >= 0) s.favorites.splice(i, 1); else { s.favorites.push(lessonId); on = true; }
      });
      return on;
    },
    isFav(lessonId) { return state.favorites.indexOf(lessonId) >= 0; },

    // ---- 收藏案例 ----
    toggleCaseFav(caseId) {
      let on = false;
      this.set(s => {
        const i = s.caseFav.indexOf(caseId);
        if (i >= 0) s.caseFav.splice(i, 1); else { s.caseFav.push(caseId); on = true; }
      });
      return on;
    },
    isCaseFav(id) { return state.caseFav.indexOf(id) >= 0; },

    // ---- 实战项目 ----
    getProject(id) { return state.projectSubs[id] || null; },
    saveProject(id, patch) {
      this.set(s => {
        const cur = s.projectSubs[id] || { text: '', at: 0, done: {}, status: 'draft' };
        s.projectSubs[id] = Object.assign({}, cur, patch, { at: Date.now() });
      });
    },
    toggleTask(projectId, idx) {
      this.set(s => {
        const cur = s.projectSubs[projectId] || { text: '', at: 0, done: {}, status: 'draft' };
        cur.done[idx] = !cur.done[idx];
        const vals = Object.values(cur.done).filter(Boolean).length;
        cur.status = vals >= 1 ? 'progress' : 'draft';
        s.projectSubs[projectId] = cur;
      });
    },
    projectCount() { return Object.keys(state.projectSubs).length; },

    // ---- 学习计划 ----
    setPlan(patch) { this.set(s => { Object.assign(s.plan, patch); }); },

    // ---- 模块检测 ----
    saveCheck(moduleId, score, total) {
      this.set(s => { s.exam[moduleId] = { score, total, at: Date.now() }; });
    },
    checkOf(moduleId) { return state.exam[moduleId] || null; },

    // ---- 设置 ----
    setSetting(k, v) { this.set(s => { s.settings[k] = v; }); },

    // ---- 导出 / 重置 ----
    exportJSON() { return JSON.stringify(state, null, 2); },
    reset() { state = defaultState(); save(); }
  };

  G.store = S;
})(window.GBA = window.GBA || {});
