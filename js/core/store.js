/* ============================================================
   STORE — 版本化状态 + LocalStorage 持久化
   课程/题库更新时通过 schema 迁移保留用户已有学习数据。
   ============================================================ */
(function (G) {
  const KEY = 'gba_state';
  const SCHEMA = 3;

  function defaultState() {
    return {
      schema: SCHEMA,
      createdAt: Date.now(),
      progress: {},        // lessonId -> {done:bool, pct:0-100, lastPos:0, seconds:0, lastAt}
      noteBook: [],        // {id, lessonId, text, at}
      wrongBook: [],       // questionId -> stored wrong answers {qid, lessonId, lastAnswer, times, cleared}
      favorites: [],       // lessonId[]
      toolHistory: [],     // {id, tool, inputs, outputs, at}
      marketReports: {},   // regionKey -> report object
      sim: null,           // 跨境模拟器状态
      chain: null,         // 流量到订单链路状态
      exam: {},            // examId -> {score, at, answers}
      streak: { count: 0, lastDate: '', days: [] }, // days: ['2026-11-19',...]
      dailyGoal: { targetMin: 20, log: {} }, // log: date -> minutes
      settings: { name: '学习者', theme: 'dark', speech: true, reducedMotion: false },
      visited: []          // 最近访问 lessonId（用于继续学习）
    };
  }

  let state = load();

  function migrate(s) {
    // 逐版本补齐字段，不覆盖已有数据
    const d = defaultState();
    if (!s || typeof s !== 'object') return d;
    s.schema = SCHEMA;
    for (const k in d) {
      if (s[k] === undefined) s[k] = d[k];
      else if (d[k] && typeof d[k] === 'object' && !Array.isArray(d[k])) {
        s[k] = Object.assign({}, d[k], s[k]);
      }
    }
    if (s.settings) s.settings = Object.assign({}, d.settings, s.settings);
    if (s.streak) s.streak = Object.assign({}, d.streak, s.streak);
    if (s.dailyGoal) s.dailyGoal = Object.assign({}, d.dailyGoal, s.dailyGoal);
    return s;
  }

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
      G.toast && G.toast('保存失败：存储空间可能已满');
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
        p.pct = p.done ? 100 : Math.min(p.pct, 90);
        done = p.done;
      });
      return done;
    },
    completedCount() { return Object.values(state.progress).filter(p => p.done).length; },

    // ---- 连续学习 ----
    touchStreak() {
      const today = G.utils.todayKey();
      this.set(s => {
        const st = s.streak;
        if (st.lastDate === today) return;
        const yesterday = G.utils.dateKeyOffset(-1);
        if (st.lastDate === yesterday) st.count = (st.count || 0) + 1;
        else if (st.lastDate !== today) st.count = 1;
        st.lastDate = today;
        st.days = [today, ...st.days.filter(d => d !== today)].slice(0, 60);
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

    // ---- 错题 ----
    addWrong(qid, lessonId, answer) {
      this.set(s => {
        let w = s.wrongBook.find(x => x.qid === qid);
        if (!w) { w = { qid, lessonId, times: 0, cleared: false }; s.wrongBook.unshift(w); }
        w.lastAnswer = answer; w.times = (w.times || 0) + 1; w.cleared = false; w.at = Date.now();
      });
    },
    clearWrong(qid) { this.set(s => { const w = s.wrongBook.find(x => x.qid === qid); if (w) w.cleared = true; }); },
    activeWrong() { return state.wrongBook.filter(w => !w.cleared); },

    // ---- 收藏 ----
    toggleFav(lessonId) {
      let on = false;
      this.set(s => {
        const i = s.favorites.indexOf(lessonId);
        if (i >= 0) s.favorites.splice(i, 1); else { s.favorites.push(lessonId); on = true; }
      });
      return on;
    },
    isFav(lessonId) { return state.favorites.indexOf(lessonId) >= 0; },

    // ---- 工具历史 ----
    addToolHistory(tool, inputs, outputs) {
      this.set(s => {
        s.toolHistory.unshift({ id: 'h' + Date.now(), tool, inputs, outputs, at: Date.now() });
        s.toolHistory = s.toolHistory.slice(0, 200);
      });
    },
    clearToolHistory() { this.set(s => { s.toolHistory = []; }); },

    // ---- 市场报告 / 模拟器 / 链路 ----
    saveMarketReport(key, report) { this.set(s => { s.marketReports[key] = report; }); },
    saveSim(data) { this.set(s => { s.sim = data; }); },
    saveChain(data) { this.set(s => { s.chain = data; }); },

    // ---- 考试 ----
    saveExam(examId, score, answers) {
      this.set(s => { s.exam[examId] = { score, answers, at: Date.now() }; });
    },

    // ---- 设置 ----
    setSetting(k, v) { this.set(s => { s.settings[k] = v; }); },

    // ---- 重置 ----
    reset() { state = defaultState(); save(); }
  };

  G.store = S;
})(window.GBA = window.GBA || {});
