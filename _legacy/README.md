# _legacy —— 1.x 版本的归档内容

这里的文件是 **GLOBAL BUSINESS ACADEMY 1.x**（8 模块 91 课，商业通识 + 工具 + 模拟器）的源码，
已经**不再被 `index.html` 引用**，也不会被 2.0 的任何视图调用。

保留原因：

1. 2.0 的「同主题进度映射」（`js/core/store.js` 中的 `LEGACY_MAP`）需要对照旧课时 id 才能说明迁移关系，改动时便于查证；
2. 旧版的 455 道题库与 29 个工具仍有参考价值，未来若要恢复某个工具，可直接取用；
3. 内容不删除，避免不可逆的操作。

目录对应关系：

```
_legacy/js/data/lessons_*.js     旧讲义（m01a~m08，另有更早的 a/b 两册）
_legacy/js/data/questions_*.js   旧题库与考试配置
_legacy/js/data/tools.js         工具注册表
_legacy/js/data/markets.js       地区市场数据
_legacy/js/data/english.js       商务英语词库
_legacy/js/views/*.js            lab / market / quiz / simulator / special_tools / english 视图
_legacy/js/core/charts.js        图表组件（旧深色主题配色，2.0 未使用）
_legacy/js/tools/engine.js       旧计算引擎
```

如需彻底清理，删除本目录即可，不影响站点运行。
