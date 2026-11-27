# GLOBAL BUSINESS ACADEMY 2.0 — 项目交接文档

> 本文档面向下一位接手开发的工程师 / AI 开发工具。所有结论基于对实际代码、数据文件与线上部署的核查，未做推测；确实无法从代码中确认的条目，一律标注 **【待确认】**。

| 项目 | 内容 |
|---|---|
| 项目名称 | GLOBAL BUSINESS ACADEMY 2.0 |
| 一句话定位 | 国际社交媒体运营与海外市场营销的自学平台：六平台运营方法 + 国际营销理论 + 国际贸易实务 + 真实案例库 + 实战训练中心 |
| 站点类型 | 纯静态单页应用（SPA，hash 路由），无后端 |
| 项目根目录 | `C:/Users/1/WorkBuddy/2026-11-19-15-12-08/gba`（该目录本身即 Git 仓库根） |
| Git 远程 | `https://github.com/x13502239474-oss/global-business-academy.git` |
| 当前分支 | `v2-social`（与 `main` 同一提交，二者内容一致） |
| 当前提交 | `0cbd69d 补 .gitignore，移除调试残留截图` |
| 线上地址 | `https://x13502239474-oss.github.io/global-business-academy/` |
| 部署方式 | GitHub Pages，从 `main` 分支根目录构建 |
| 代码规模 | Git 跟踪 86 个文件（不含本文档）；`js/data` 1.59 MB（其中 10 个讲义文件 1.47 MB） |
| 内容规模 | 10 模块 / 84 节讲义 / 约 38.3 万字正文 / 13 案例 / 8 实战项目 / 76 道检测题 |
| 文档生成日期 | 2026-11-27 |
| 核查方式 | 直接读取源码与数据；`node tools/validate.js` 全量校验通过；浏览器实测线上与本地全部路由 |

---

## 0. 一页速览

- **技术形态**：零依赖、零构建的原生 HTML + CSS + JS。`index.html` 按固定顺序加载 29 个 `<script>`，全部代码挂在全局命名空间 `window.GBA` 上。没有 npm、没有打包器、没有框架、没有运行时第三方库。
- **内容与代码分离**：课程结构在 `js/data/modules.js`（注册表），讲义正文在 10 个 `lessons_*.js`，案例/项目/题库/资料各一个数据文件。视图只负责渲染。新增一节课 = 注册表加一行 + 写一个讲义对象。
- **用户数据**：全部存浏览器 `localStorage` 的单一键 `gba_state`（schema 4），不上传、无账号体系。已有 1.x → 2.0 的同主题进度映射（13 条），迁移时不删旧记录。
- **最容易踩的坑**：① `index.html` 脚本顺序不可改动；② 讲义 7 个段落标题是逐字校验的硬契约；③ 路由名与视图函数名被测试脚本断言；④ 改动 store 的 schema 必须写迁移分支，否则老用户数据会丢；⑤ 本机环境的 HTTP 代理对 `github.com` 转发异常，推送需走 SOCKS5（见 8.5）。

---

## 1. 项目定位与现状

### 1.1 1.x 与 2.0 的关系

| | 1.x（已归档） | 2.0（当前线上） |
|---|---|---|
| 定位 | 商业通识学习平台 | 国际社媒运营 + 海外营销 + 贸易实务 |
| 课程 | 8 模块 91 课 + 455 题 + 29 个工具/模拟器 | 10 模块 84 节 + 76 题 + 8 个实战项目 |
| 视觉 | 深色赛博风（渐变、发光、装饰动画） | 科技蓝 + 白 + 浅灰，去装饰化 |
| 代码位置 | `_legacy/`（保留不删，站点不引用） | `js/`、`css/`、`index.html` |

1.x 的 37 个源码文件（另有 1 份 `README.md` 说明）已移入 `_legacy/`，合计 38 个文件。它们**不影响站点运行**，可以整目录删除，但删除后 `store.js` 里 `LEGACY_MAP` 的注释可读性会下降（映射本身不依赖这些文件）。

### 1.2 当前完成度

| 维度 | 状态 |
|---|---|
| 课程内容 | 84 节全部有正文，7 段结构完整，无占位文字 |
| 页面与路由 | 11 条路由全部可用，桌面与 390px 移动端均实测通过 |
| 学习记录 | 进度 / 笔记 / 收藏 / 实战成果 / 检测成绩 / 连续天数均可持久化 |
| 测试 | `validate.js` 内容与结构校验 0 错误；`browser_test.js` 65 项断言的冒烟测试全通过 |
| 部署 | 已上线 GitHub Pages，线上数据与本地一致（84 节 / 13 案例 / 8 项目 / 10 套题） |
| 后端 / 账号 | **完全没有**（见第 7 节「未实现」） |

---

## 2. 技术栈、框架、依赖与运行环境

### 2.1 技术栈总表

| 层 | 选型 | 说明 |
|---|---|---|
| 结构 | 原生 HTML5 | 单文件入口 `index.html`，仅 59 行，`#app` 为空壳 |
| 样式 | 原生 CSS3（自定义属性） | 4 个文件分层：tokens → base → components → views |
| 逻辑 | 原生 ES2017+ JavaScript | IIFE 模块，无 import/export，全局 `window.GBA` |
| 路由 | 自研 hash 路由 | `js/core/router.js`，支持 `:param` 与 `?query` |
| 状态 | 自研 store + LocalStorage | `js/core/store.js`，单键 JSON，带 schema 版本与迁移 |
| 模板 | 字符串模板 + `innerHTML` | 无虚拟 DOM，无 diff，每次整块重渲染 |
| 图标 | 自研内联 SVG | `js/core/icons.js`，36 个线性图标，`G.icon(name, size)` |
| 构建 | **无** | 源码即产物 |
| 测试 | Node 脚本 + Chrome（puppeteer-core） | 仅开发期使用，不进站点 |

**刻意不使用的技术**：React/Vue、TypeScript、Sass/Less、Tailwind、Webpack/Vite、jQuery、任何 CDN 资源、任何分析与埋点 SDK。这是设计决策——站点要求 `file://` 双击可运行、GitHub Pages 零配置部署、长期无维护风险。

### 2.2 站点运行时依赖

**零。** 已核查：

- `index.html` 中无任何 `http://` / `https://` 外部资源引用（仅 favicon 为内联 `data:image/svg+xml`）。
- `js/`、`css/` 中无 `fetch`、`XMLHttpRequest`、WebSocket、外部 API 调用。
- 无字体文件下载（使用系统字体栈）。
- 无图片资源（图标与图形全部为内联 SVG 或 CSS 绘制）。

因此站点在断网、内网、`file://` 协议下均可完整运行（`file://` 下 LocalStorage 可能被浏览器限制，建议用本地 HTTP 服务，见 8.1）。

### 2.3 开发与测试依赖

| 依赖 | 版本 | 用途 | 位置 |
|---|---|---|---|
| Node.js | 实测 v22.22.2 | 运行校验与测试脚本 | 系统环境 |
| `puppeteer-core` | 25.18.1 | 驱动本机 Chrome 做冒烟测试 | `../node_modules`（父目录） |
| `jsdom` | ^31.0.1 | **仅父目录旧脚本使用**，2.0 的 `validate.js` 未使用 | `../node_modules` |
| Google Chrome | 本机安装 | 冒烟测试的被驱动浏览器 | `C:\Program Files\Google\Chrome\Application\chrome.exe` |

> **重要**：站点根目录（`gba/`）**没有** `package.json`。上面这些依赖写在**父目录** `2026-11-19-15-12-08/package.json` 里。这意味着：
> - `node tools/validate.js` 零依赖，任何机器上直接可跑（只用 `fs`/`path`/`vm` 三个内置模块）；
> - `node tools/browser_test.js` **必须**能解析到 `puppeteer-core`，即必须在父目录环境下运行，或自行 `npm i puppeteer-core`。
> - 迁移仓库时（例如只 clone `gba/`），需要自行安装测试依赖。

### 2.4 运行环境要求

| 项 | 要求 |
|---|---|
| 浏览器 | 任何支持 ES2017、CSS 自定义属性、`IntersectionObserver` 的现代浏览器（Chrome / Edge / Safari / Firefox 近三年版本） |
| 本地服务 | Python 3（`python -m http.server`）或任何静态服务器；也可直接 `file://` 打开 |
| 屏幕 | 桌面 ≥ 1180px 有右侧目录；900–1180px 为单栏；≤ 900px 切移动布局（底部标签栏） |
| 服务端 | 无。GitHub Pages 静态托管即可 |
| 操作系统 | 无限制（开发机实测 Windows 11） |

### 2.5 版本与环境变量

- 站点无环境变量、无 `.env`、无配置文件。所有常量写在代码里（如 `store.js` 的 `SCHEMA = 4`、`browser_test.js` 的 `BASE` 与 Chrome 路径）。
- `index.html` 中声明 `<meta name="theme-color" content="#FFFFFF">`。
- 已提交 `.gitignore`，忽略 `node_modules/`、`dist/`、`.cache/`、`.DS_Store`、`Thumbs.db`、`.idea/`、`.vscode/`、`*.swp`、`shots/test_*.png`、`*.log`、`.env*`、`*.pem`。

---

## 3. 项目目录结构

```
gba/                              ← Git 仓库根
├── index.html                    入口：29 个 script 按固定顺序加载（见 3.2）
├── 使用说明.md                    面向学习者的使用说明（含课程表、数据保存、测试命令）
├── PROJECT_HANDOVER.md           本文档
├── .gitignore
│
├── css/
│   ├── tokens.css                (51 行) 设计令牌：颜色 / 圆角 / 字体 / 阴影 / 缓动 / 容器宽度
│   ├── base.css                  (123 行) reset、排版基准、应用骨架（侧栏/顶栏/视图/标签栏/操作条）、断点
│   ├── components.css            (233 行) 通用组件：卡片、按钮、芯片、进度条、表格、callout、prose、课时块、测验、搜索浮层、toast
│   └── views.css                 (197 行) 页面级：hero、stat、模块卡、章节行、案例、实战、个人中心、格栅
│
├── js/
│   ├── app.js                    启动：注册 11 条路由 + 首次访问 toast
│   ├── core/
│   │   ├── utils.js              (65 行) 转义/日期/数字/动画/文本规范化/debounce + 全局 G.toast
│   │   ├── icons.js              (48 行) 36 个内联 SVG 图标，G.icon(name,size)
│   │   ├── store.js              (245 行) 状态树 + LocalStorage 持久化 + schema 迁移 + 全部业务 API
│   │   └── router.js             (46 行) hash 路由：reg / go / start / parse
│   ├── data/
│   │   ├── modules.js            (217 行) ★课程注册表：10 模块 / 84 章节 / 学时配比 / 索引
│   │   ├── lessons_s0.js         S0 全球社媒运营基础  7 节
│   │   ├── lessons_x.js          SX X（Twitter）      8 节
│   │   ├── lessons_fb.js         SF Facebook          8 节
│   │   ├── lessons_yt.js         SY YouTube           8 节
│   │   ├── lessons_tk.js         ST TikTok            8 节
│   │   ├── lessons_ig.js         SI Instagram         8 节
│   │   ├── lessons_li.js         SL LinkedIn          9 节
│   │   ├── lessons_mk.js         MK 国际市场营销      13 节
│   │   ├── lessons_tr.js         TR 国际贸易          10 节
│   │   ├── lessons_cp.js         CP 综合实战          5 节
│   │   ├── cases.js              13 个案例（12 段结构 + 三级标注 + 来源）
│   │   ├── projects.js           8 个实战项目
│   │   ├── checks.js             10 套模块检测题（76 题）
│   │   └── sources.js            资料取舍 14 条 / 时效核查 16 条 / 冲突裁决 6 组 / 官方入口 6 平台 / 纪律 6 条
│   └── views/
│       ├── shell.js              (161 行) 应用外壳：侧栏、顶栏、移动 tabbar、全局搜索浮层、G.mount / G.setChrome
│       ├── home.js               (114 行) 首页：hero、统计、继续学习、配比条、模块网格、今日案例
│       ├── courses.js            (122 行) 课程总览（四分组）+ 模块详情
│       ├── lesson.js             (181 行) 课时页：目标 / 7 段正文 / 目录高亮 / 总结 / 术语 / 实操 / 笔记 / 操作条
│       ├── cases.js              (121 行) 案例列表（平台筛选 + 收藏）+ 案例详情（12 段 + 三级标记）
│       ├── practice.js           (140 行) 实战列表 + 项目详情（步骤 / 模板 / 交付物 / 成果编辑导出）
│       ├── check.js               (80 行) 模块检测：单选、交卷、解析、成绩、重做
│       ├── me.js                 (151 行) 我的学习：资料头、统计、学习计划、最近学习、笔记、收藏、导出/清空
│       └── sources.js             (87 行) 资料来源页渲染
│
├── docs/
│   ├── SOURCES.md                (96 行) 事实基线：14 份资料取舍总表、16 条平台规则时效核查、6 组观点冲突裁决、官方入口、内容纪律
│   └── CONTENT_SPEC.md           (124 行) 讲义写作规范：文件格式、7 段结构、深度验收线、事实纪律、风格、自检清单
│
├── tools/
│   ├── validate.js               (198 行) 内容与结构校验（Node + DOM 桩，无需浏览器）
│   └── browser_test.js           (275 行) 桌面/移动全路由冒烟 + 交互 + 1.x 迁移 + 截图（需 Chrome 与本地服务）
│
├── shots/                        测试产出的截图（9 张，约 1.2 MB，非站点资源）
├── _legacy/                      1.x 归档源码（37 个 js + README，共 38 文件，站点不引用）
└── .git/
```

### 3.1 目录职责要点

- **`js/data/` 是纯数据层**：文件内只有数据字面量与极少量索引构建逻辑，不操作 DOM。修改内容不需要碰视图。
- **`js/views/` 是纯渲染层**：每个文件导出 1–2 个 `G.views.xxx` 函数，函数内 `G.mount(html)` 一次性写入 `#view`，然后绑定事件。视图之间不互相调用，只通过 `G.router.go()` 跳转。
- **`js/core/` 是基础设施**：`store` 是唯一的数据写入口，视图不直接读写 `localStorage`。
- **`docs/` 是给写作者看的，不参与运行**：`SOURCES.md` 是内容事实的唯一基线，`CONTENT_SPEC.md` 是并行写作时的统一标准。
- **`tools/` 是开发工具**：不随站点部署（但会被 Git 跟踪、被 Pages 一并发布为静态文件，可访问但无用）。

### 3.2 index.html 脚本加载顺序（不可乱）

顺序即依赖关系，改动会导致白屏或数据缺失：

1. `js/core/utils.js` → 定义 `G.utils`、`G.toast`
2. `js/core/icons.js` → 定义 `G.icon`
3. `js/core/store.js` → 定义 `G.store`（初始化时会读 LocalStorage 并迁移）
4. `js/core/router.js` → 定义 `G.router`
5. `js/data/modules.js` → 定义 `G.data.modules / lessonById / allLessons / totalLessons / curriculumWeights / groupOfModule / lessonsOfModule`
6. `js/data/lessons_*.js` ×10 → 往 `G.data.lessons` 里挂 `L['id'] = {...}`
7. `js/data/cases.js`、`projects.js`、`checks.js`、`sources.js` → 定义 `G.data.cases / projects / checks / sources`
8. `js/views/shell.js` → 定义 `G.renderShell`、`G.mount`、`G.setChrome`、`G.openSearch`
9. `js/views/*.js` ×8 → 注册各 `G.views.xxx`
10. `js/app.js` → 调 `G.renderShell()`，注册路由，`R.start()`

硬约束：`modules.js` 必须早于任何 `lessons_*.js`（讲义文件里写的是 `G.data.lessons = G.data.lessons || {}`，但 `lessonById` 索引由 `modules.js` 构建）；`shell.js` 必须早于其他视图（它们依赖 `G.mount`）。

---

## 4. 已完成的页面、功能与内容资产

### 4.1 路由与页面清单（11 条 + 兜底）

| 路由 | 视图函数 | 标题 | 用途 |
|---|---|---|---|
| `#/home` | `G.views.home` | 学习总览 | 首页仪表盘 |
| `#/courses` | `G.views.courses` | 课程体系 | 四分组课程总览 + 总进度 |
| `#/module?id=SX` | `G.views.module` | 模块 | 模块详情：banner + 目标 + 章节列表 + 检测入口 + 上下模块 |
| `#/lesson?id=s0-1` | `G.views.lesson` | 课时 | 讲义正文页（核心页） |
| `#/cases` | `G.views.cases` | 案例库 | 案例网格 + 平台筛选 + 收藏筛选 |
| `#/case?id=maersk` | `G.views.caseView` | 案例 | 案例详情（12 段） |
| `#/practice` | `G.views.practice` | 实战训练中心 | 8 个项目卡片 + 完成度 |
| `#/project?id=p7` | `G.views.project` | 实战项目 | 项目详情 + 成果提交 |
| `#/check?id=SX` | `G.views.check` | 模块检测 | 单选测验 |
| `#/me` | `G.views.me` | 我的学习 | 个人中心 |
| `#/sources` | `G.views.sources` | 资料来源与时效说明 | 内容可信度说明 |
| 其他任意哈希 | 兜底 → `home` | — | 不存在的路由回首页 |

路由实现说明：`router.js` 把 `:param` 编译成正则捕获组，同时解析 `?k=v`；`start()` 监听 `hashchange` 并在每次切换后把 `window.scrollTo(0,0)`、同步底部 tab 高亮。**参数既支持路径式也支持查询式**（如 `lesson?id=x` 与 `lesson/x` 都能命中，视图内用 `params.id || query.id` 取值）。

### 4.2 外壳与导航（shell.js）

- **桌面（> 900px）**：左侧固定侧栏（236px），含品牌标识、5 个主导航（首页/课程体系/案例库/实战中心/我的学习）、`REFERENCE` 分隔下的「资料来源」与「内容搜索」、底部实时进度（`已完成 N / 84 节 · X%`）。顶部 56px 顶栏：当前页标题 + 搜索按钮 + 连续天数 chip。
- **移动（≤ 900px）**：侧栏隐藏，底部固定 5 项 tabbar（首页/课程/案例/实战/我的），带 `env(safe-area-inset-bottom)` 适配 iPhone 底部安全区。
- **全局搜索**：`G.openSearch()` 打开浮层，索引 **课时标题 + 英文名、案例名 + 简介 + 平台、项目标题 + 简述**（不含讲义正文）。输入即时过滤，最多 24 条结果，支持 `/` 快捷键唤起、`Esc`/点遮罩关闭。索引在首次打开时构建并缓存在 `G._searchIndex`。

### 4.3 功能清单（按页面）

**首页**
- 四张统计卡：课程总进度、连续学习天数 + 今日分钟、笔记/收藏数、实战提交数
- 「继续学习 / 从这里开始」大卡：取最近访问且未完成的课时，否则取第一节未完成
- 课程配比条（四段色块 + 图例，数据源 `G.data.curriculumWeights`，按分钟实时计算）
- 10 个模块卡（含模块色、进度条、已完成节数）
- 今日案例（按 `Date.now()/86400000 % 13` 轮换）+ 实战入口
- 1.x 迁移提示条（仅当 `store.legacy.v1Completed > 0` 时出现）
- 内容口径说明 + 跳转资料来源

**课程体系**
- 总进度卡（百分比 + 进度条 + 建议学习顺序）
- 四个分组：第一核心社媒（7 模块）、第二核心营销（1）、贸易（1）、实战（1）
- 每模块一行：图标、模块号、标题、简介、完成百分比、已完成/总节数
- 模块详情页：模块色 banner、目标、章节列表（编号/标题/英文/分钟/来源/完成状态）、检测入口（显示上次成绩）、上下模块导航

**课时页（核心）**
- 面包屑（课程体系 / 模块号 / 第 N 节）、标题、英文标题、元信息芯片（模块、分钟、依据来源、状态）
- 学习目标卡（"学完这一节，你应当能够" + `objectives`）
- 正文：7 个 `<section>`，`h2` 带序号徽标；≥1180px 时右侧粘性目录，`IntersectionObserver` 高亮当前段
- 要点总结（`summary`）、关键术语网格（`terms`）、本节实操卡（`practice`）、官方核对入口（`official`）
- 笔记：增/删，按课时筛选，存 `noteBook`
- 收藏本节按钮、跳实战中心、跳模块检测
- 底部固定操作条：上一节 / 标记学完（可撤销）/ 下一节（首尾自动禁用）
- 阅读进度：滚动时按 `scrollY / (scrollHeight - innerHeight)` 记录 `pct`（超过上次 3% 才写盘，debounce 400ms）

**案例库**
- 平台筛选栏（全部 + 各主平台 + ★我的收藏）
- 案例卡：平台、主体类型、名称、简介、地区/行业芯片、收藏标记
- 详情页：hero（名称/平台/类型/地区/行业）、12 段正文，每段带三级标记 `公开事实 / 分析 / 教学推演`、「可复制的做法」、「不要照搬」、「来源说明」、关联课时入口、收藏按钮

**实战训练中心**
- 8 个项目卡（编号·平台、标题、简述、时长、难度、状态、交付物完成进度条）
- 项目详情：banner、任务说明、开始前准备（输入材料卡）、操作步骤（8–10 步）、参考示例与模板（可折叠 `<details>`）、交付物 checkbox（勾选即存）、成果 textarea（保存 / 导出为 `.txt`）、自检标准、返回与复习入口
- 结业标准说明卡

**模块检测**
- 每模块一套单选（S0–SL、MK 各 8 题，TR、CP 各 6 题，合计 76 题）
- 选项点击高亮；未答完不允许交卷；交卷后逐题标对错并展开解析；写入 `exam[moduleId] = {score,total,at}`
- 得分 ≥80% 提示"可以进入下一模块"，否则建议回看；「重做一遍」在当前视图内重渲染（不整页刷新）

**我的学习**
- 头像（昵称首字）+ 昵称 + 完成数/总进度/连续天数 + 修改昵称
- 四张统计卡；1.x 迁移提示条
- 学习计划：每周可投入（3/5/7/10/14 小时）× 周期（4/8/12/16 周），自动把未完成课时按建议时长排进周表
- 最近学习（最多 8 条，带完成状态/百分比）、全部笔记（最多 20 条，可跳回课时）、课时收藏与案例收藏两栏
- 数据与设置：资料来源入口、导出学习数据 JSON、清空本机数据（二次确认）

**资料来源**
- 三条判断原则、配比图例、14 份资料取舍表（A/B/C/剔除评级 + 采用什么/舍弃什么）
- 16 条平台规则时效核查表（旧说法 → 当前口径 → 依据类型）
- 6 组观点冲突裁决（问题、双方观点、适用条件）
- 六平台官方入口表、6 条内容纪律

### 4.4 课程体系：10 模块 84 节

总学时 2198 分钟（约 36.6 小时）。学时配比（`G.data.curriculumWeights`，按分钟）：社媒 1456（66.2%）、营销 352（16.0%）、贸易 248（11.3%）、实战 142（6.5%）。

| 模块 | ID | 节数 | 分钟 | 主题色 | 主题 |
|---|---|---|---|---|---|
| MODULE 01 | S0 | 7 | 186 | `#2563EB` | 全球社媒运营基础 |
| MODULE 02 | SX | 8 | 202 | `#334155` | X（原 Twitter）运营 |
| MODULE 03 | SF | 8 | 210 | `#1877F2` | Facebook 企业营销 |
| MODULE 04 | SY | 8 | 208 | `#DC2626` | YouTube 视频营销 |
| MODULE 05 | ST | 8 | 210 | `#111827` | TikTok 短视频运营 |
| MODULE 06 | SI | 8 | 206 | `#C13584` | Instagram 视觉营销 |
| MODULE 07 | SL | 9 | 234 | `#0A66C2` | LinkedIn B2B 客户开发 |
| MODULE 08 | MK | 13 | 352 | `#0D9488` | 国际市场营销理论与实战 |
| MODULE 09 | TR | 10 | 248 | `#B45309` | 国际贸易核心知识 |
| MODULE 10 | CP | 5 | 142 | `#15803D` | 综合实战与结业项目 |

#### MODULE 01 · 全球社媒运营基础（S0，7 节 / 186 分钟）

| # | 课时 ID | 标题 | 英文 | 分钟 | 正文来源标注 |
|---|---|---|---|---|---|
| 1 | `s0-1` | 全球社媒格局与平台选择 | The Global Social Landscape | 26 | 各平台官方资料 · Chaffey 数字营销框架 |
| 2 | `s0-2` | 推荐系统如何分发内容 | How Recommendation Systems Distribute Content | 28 | 平台官方排序说明 · Eves 推荐机制原理 |
| 3 | `s0-3` | 账号体系、资产归属与安全 | Account Systems, Asset Ownership & Security | 26 | 各平台帮助中心（核对 2026-11） |
| 4 | `s0-4` | 内容生产系统：从灵感到流水线 | Building a Content Production System | 28 | Flint 内容支柱与批产方法 · 平台官方最佳实践 |
| 5 | `s0-5` | 冷启动与增长路径 | Cold Start & Growth Paths | 26 | 平台官方创作者指南 · 行业公开实践 |
| 6 | `s0-6` | 指标树：从互动到商业结果 | Metric Trees: From Engagement to Revenue | 28 | Chaffey RACE 框架 · 平台分析文档 |
| 7 | `s0-7` | 合规边界：官方规则与行业经验的分界 | Compliance: Official Rules vs. Field Practice | 24 | 各平台社区准则与广告政策（核对 2026-11） |

字数（去标签去空白）：5610 / 5298 / 5216 / 5224 / 5206 / 5232 / 5207

#### MODULE 02 · X（原 Twitter）运营（SX，8 节 / 202 分钟）

| # | 课时 ID | 标题 | 英文 | 分钟 | 正文来源标注 |
|---|---|---|---|---|---|
| 1 | `x-1` | X 平台认知：从 Twitter 到 X | Understanding X | 24 | X Help Center · X Business（核对 2026-11） |
| 2 | `x-2` | 账号定位与专业主页建设 | Profile & Positioning | 24 | X Help Center 账号与验证规则 |
| 3 | `x-3` | 推文写作与英文表达 | Writing Posts in English | 26 | 平台格式规则 · 英文文案通识 |
| 4 | `x-4` | Thread 长推文与观点传播 | Threads & Idea Diffusion | 28 | 平台机制 · 公开传播学框架 |
| 5 | `x-5` | 增长：搜索、话题与行业互动 | Growth: Search, Topics & Community | 26 | X 搜索语法文档 · 公开运营实践 |
| 6 | `x-6` | B2B 获客与私信转化 | B2B Prospecting & DM Conversion | 28 | Hughes 社交销售框架 · X 私信规则 |
| 7 | `x-7` | X Ads 与付费推广基础 | X Ads Fundamentals | 24 | X Business 广告文档（核对 2026-11） |
| 8 | `x-8` | 规则、自动化与账号安全 | Rules, Automation & Account Safety | 22 | X Rules · 自动化与垃圾信息政策 |

字数：4573 / 4471 / 4316 / 4292 / 4735 / 4301 / 4153 / 4591

#### MODULE 03 · Facebook 企业营销（SF，8 节 / 210 分钟）

| # | 课时 ID | 标题 | 英文 | 分钟 | 正文来源标注 |
|---|---|---|---|---|---|
| 1 | `fb-1` | Facebook 与 Meta 生态认知 | The Meta Ecosystem | 24 | Meta Business Help Center（核对 2026-11） |
| 2 | `fb-2` | 主页与商业资产搭建 | Pages & Business Assets | 26 | Meta 商业资产与权限文档 |
| 3 | `fb-3` | 内容运营与 Reels | Content Operations & Reels | 26 | Meta 内容与 Reels 官方指南 |
| 4 | `fb-4` | 社群运营与 Messenger | Groups & Messenger | 26 | Meta 群组与消息政策 |
| 5 | `fb-5` | Meta 广告：结构、目标与预算 | Meta Ads Structure & Budget | 28 | Meta 广告管理文档 · Levitan 结构底本 |
| 6 | `fb-6` | 受众、素材与 Advantage+ | Audience, Creative & Advantage+ | 28 | Meta Advantage+ 与素材政策 |
| 7 | `fb-7` | 转化追踪：Pixel、CAPI 与再营销 | Pixel, CAPI & Retargeting | 26 | Meta 转化 API 文档 · 隐私合规说明 |
| 8 | `fb-8` | 独立站引流实战与广告政策风险 | Driving Traffic to DTC & Ad Policy Risk | 26 | Meta 广告政策 · 电商投放公开实践 |

字数：5595 / 4905 / 4953 / 4666 / 5138 / 4966 / 5249 / 4640

#### MODULE 04 · YouTube 视频营销（SY，8 节 / 208 分钟）

| # | 课时 ID | 标题 | 英文 | 分钟 | 正文来源标注 |
|---|---|---|---|---|---|
| 1 | `yt-1` | 平台认知：搜索与推荐双引擎 | Search + Recommendation | 26 | YouTube Help · Creator 官方文档（核对 2026-11） |
| 2 | `yt-2` | 频道定位与频道建设 | Channel Positioning & Setup | 24 | YouTube 频道与验证文档 |
| 3 | `yt-3` | 选题与英文视频脚本 | Topic Selection & Scripts | 28 | Eves 打包与选题方法 · 脚本通识 |
| 4 | `yt-4` | 拍摄、剪辑与缩略图设计 | Production, Editing & Thumbnails | 26 | YouTube 创作者最佳实践 |
| 5 | `yt-5` | YouTube SEO 与元数据 | YouTube SEO & Metadata | 26 | YouTube 搜索与元数据文档 |
| 6 | `yt-6` | 推荐流量与数据诊断 | Recommendation & Analytics | 28 | YouTube Analytics 指标文档 |
| 7 | `yt-7` | Shorts：短视频的独立逻辑 | Shorts: A Separate System | 24 | YouTube Shorts 官方说明（核对 2026-11） |
| 8 | `yt-8` | 变现、品牌合作与版权合规 | Monetization, Partnerships & Copyright | 26 | YouTube 合作伙伴计划 · 版权与 reused content 政策 |

字数：4335 / 3846 / 5286 / 3994 / 4051 / **3794（全站最短）** / 4238 / 4530

#### MODULE 05 · TikTok 短视频运营（ST，8 节 / 210 分钟）

| # | 课时 ID | 标题 | 英文 | 分钟 | 正文来源标注 |
|---|---|---|---|---|---|
| 1 | `tk-1` | 平台认知与全球市场结构 | TikTok & the Global Short-video Market | 26 | TikTok Newsroom · TikTok Academy（核对 2026-11） |
| 2 | `tk-2` | 账号定位与基础建设 | Account Setup & Positioning | 24 | TikTok 账号与专业账号文档 |
| 3 | `tk-3` | 前三秒与短视频脚本 | The First Three Seconds & Scripts | 28 | TikTok 创意最佳实践 · 公开创作方法 |
| 4 | `tk-4` | 拍摄、剪辑与发布运营 | Production & Publishing | 26 | TikTok 创作工具文档 |
| 5 | `tk-5` | 推荐机制与冷启动 | Distribution Mechanics & Cold Start | 28 | TikTok 官方分发说明 · 公开创作者经验 |
| 6 | `tk-6` | 数据诊断与内容迭代 | Analytics & Iteration | 26 | TikTok Analytics 指标文档 |
| 7 | `tk-7` | TikTok Shop、联盟与广告 | Shop, Affiliate & Ads | 28 | TikTok Shop 与 Ads 官方文档（按市场区分） |
| 8 | `tk-8` | 规则、地区合规与账号健康 | Policy, Regional Compliance & Account Health | 24 | TikTok 社区准则与商业内容政策 |

字数：4254 / 4061 / 3922 / 3955 / 4133 / 3877 / 3960 / 3887

#### MODULE 06 · Instagram 视觉营销（SI，8 节 / 206 分钟）

| # | 课时 ID | 标题 | 英文 | 分钟 | 正文来源标注 |
|---|---|---|---|---|---|
| 1 | `ig-1` | 平台认知：四个分发面与排序信号 | Four Surfaces & Ranking Signals | 26 | Instagram Help Center · Mosseri 公开说明（核对 2026-11） |
| 2 | `ig-2` | 专业账号与品牌主页 | Professional Account & Profile | 24 | Instagram 专业账号文档 |
| 3 | `ig-3` | Feed 与轮播的内容规划 | Feed & Carousel Planning | 26 | 平台格式规范 · 内容策略通识 |
| 4 | `ig-4` | Stories 与 Reels 的差异化用法 | Stories vs. Reels | 28 | Instagram 各面官方说明 |
| 5 | `ig-5` | 视觉体系与设计执行 | Visual System & Execution | 26 | 视觉设计通识 · 平台规格文档 |
| 6 | `ig-6` | 搜索可见性：关键词、标签与替代文本 | Search Visibility | 24 | Instagram 搜索与标签政策（2025-12 变更） |
| 7 | `ig-7` | 创作者合作与私信转化 | Creator Partnerships & DM Conversion | 26 | 品牌内容工具文档 · Flint 私信框架 |
| 8 | `ig-8` | Insights、投放与原创性合规 | Insights, Ads & Originality | 26 | Instagram Insights 文档 · 原创性与 AI 标注政策 |

字数：4849 / 4863 / 4430 / 4767 / 4451 / 4704 / 4738 / 4629

#### MODULE 07 · LinkedIn B2B 客户开发（SL，9 节 / 234 分钟）

| # | 课时 ID | 标题 | 英文 | 分钟 | 正文来源标注 |
|---|---|---|---|---|---|
| 1 | `li-1` | 平台认知：B2B 生态与内容分发 | The B2B Ecosystem | 26 | LinkedIn Help · 工程博客排序说明（2026-03） |
| 2 | `li-2` | 个人专业主页建设 | Building a Professional Profile | 28 | LinkedIn 主页与搜索优化文档 |
| 3 | `li-3` | Company Page 与组织内容 | Company Pages & Brand Content | 24 | LinkedIn 公司主页文档 |
| 4 | `li-4` | B2B 内容营销与个人品牌 | B2B Content & Personal Brand | 26 | Hughes 社交销售 · 平台内容政策 |
| 5 | `li-5` | 客户搜索：企业与决策人定位 | Searching Companies & Decision Makers | 28 | LinkedIn 搜索语法文档 |
| 6 | `li-6` | 连接邀请、InMail 与开发信 | Invitations, InMail & Outreach | 28 | LinkedIn 消息与邀请限制政策 |
| 7 | `li-7` | Sales Navigator 与线索管理 | Sales Navigator & Pipeline | 26 | Sales Navigator 官方功能文档 |
| 8 | `li-8` | LinkedIn Ads 基础 | LinkedIn Ads Fundamentals | 24 | LinkedIn Marketing Solutions 文档 |
| 9 | `li-9` | 国际商务合作、规则与合规 | Partnerships, Rules & Compliance | 24 | LinkedIn 用户协议与自动化限制 |

字数：4687 / 4784 / 4067 / 4529 / 4690 / 4812 / 4525 / 4602 / 4822

#### MODULE 08 · 国际市场营销理论与实战（MK，13 节 / 352 分钟）

| # | 课时 ID | 标题 | 英文 | 分钟 | 正文来源标注 |
|---|---|---|---|---|---|
| 1 | `mk-1` | 全球市场格局与国际营销框架 | Global Markets & the Marketing Framework | 26 | Cateora 第 18 版 Ch1 · Chaffey RACE |
| 2 | `mk-2` | 国际市场环境与国别差异 | Market Environments & Country Differences | 26 | Cateora Ch2–3 · 公开统计数据 |
| 3 | `mk-3` | 文化差异与消费行为 | Culture & Consumer Behavior | 28 | Cateora Ch4–5 · 霍夫斯泰德框架 |
| 4 | `mk-4` | 目标市场选择 | Selecting Target Markets | 26 | Cateora Ch8 · 公开评估方法 |
| 5 | `mk-5` | 市场研究：数据源与趋势工具 | Market Research & Trend Tools | 28 | Google Trends 官方说明 · 行业报告方法 |
| 6 | `mk-6` | 竞争对手与目标客户研究 | Competitor & Customer Research | 26 | Cateora Ch8 · 竞争分析通识 |
| 7 | `mk-7` | 品牌定位与差异化 | Brand Positioning & Differentiation | 28 | Cateora Ch12–13 · STP 框架 |
| 8 | `mk-8` | 用户画像与品牌价值 | Personas & Brand Value | 26 | Cateora Ch11–13 |
| 9 | `mk-9` | 消费者决策与信任建立 | Decision Making & Trust | 26 | Cateora Ch5 · 消费者行为通识 |
| 10 | `mk-10` | 内容营销与品牌叙事 | Content Marketing & Storytelling | 28 | Chaffey Ch6 · 内容策略通识 |
| 11 | `mk-11` | 数字营销与流量结构 | Digital Marketing & Traffic Structure | 28 | Chaffey Ch8–9 · 平台官方文档 |
| 12 | `mk-12` | 广告指标与 A/B 测试 | Ad Metrics & A/B Testing | 28 | Chaffey Ch10 · Meta/Google 指标定义 |
| 13 | `mk-13` | 从流量到转化与客户经营 | From Traffic to Conversion & Retention | 28 | Chaffey RACE · Flint 私信与复盘框架 |

字数：5046 / 4430 / 4139 / 3937 / 4311 / 3900 / 3918 / 4101 / 3961 / 3977 / 4000 / 4129 / 4091

#### MODULE 09 · 国际贸易核心知识（TR，10 节 / 248 分钟）

| # | 课时 ID | 标题 | 英文 | 分钟 | 正文来源标注 |
|---|---|---|---|---|---|
| 1 | `tr-1` | 国际贸易基本流程与参与方 | Trade Flow & Parties | 22 | S1/S2 教材结构 · 公开实务资料 |
| 2 | `tr-2` | B2B 与 B2C 商业模式 | B2B vs. B2C Models | 22 | S1 Ch4 · Cateora Ch14 |
| 3 | `tr-3` | Incoterms 2020：EXW/FOB/CIF/DDP | Incoterms 2020 | 28 | ICC Incoterms 2020 官方框架 |
| 4 | `tr-4` | 国际报价与成本核算 | Quotation & Costing | 26 | S2 Ch5 · 公开实务方法 |
| 5 | `tr-5` | 国际支付与结算方式 | International Payment | 26 | S2 Ch6–7 · UCP600 框架 |
| 6 | `tr-6` | 外贸询盘与报价谈判 | Inquiries & Quotation | 24 | S2 Ch5 · Ch10 |
| 7 | `tr-7` | 国际贸易合同基础 | Contracts Fundamentals | 24 | S2 Ch10 · 公开合同实务 |
| 8 | `tr-8` | 国际物流与单证 | Logistics & Documents | 26 | S2 Ch3–4 · Ch11 |
| 9 | `tr-9` | 进出口合规与风险 | Compliance & Risk | 24 | 公开海关与出口管制框架 |
| 10 | `tr-10` | 从社媒询盘到订单成交 | From Social Inquiry to Order | 26 | 综合 S2 + 社媒运营方法 |

字数：5363 / 4245 / 5482 / 4485 / 4652 / 4198 / 4807 / 4615 / 4747 / 4442

#### MODULE 10 · 综合实战与结业项目（CP，5 节 / 142 分钟）

| # | 课时 ID | 标题 | 英文 | 分钟 | 正文来源标注 |
|---|---|---|---|---|---|
| 1 | `cp-1` | 案例分析方法：如何读一个账号 | How to Read a Case | 24 | 案例库方法 · 公开分析框架 |
| 2 | `cp-2` | 账号诊断：从数据到结论 | Account Diagnostics | 26 | 平台分析指标 · 诊断方法 |
| 3 | `cp-3` | 海外社媒营销计划撰写 | Writing the Social Media Plan | 28 | 综合 S0–MK |
| 4 | `cp-4` | 结业项目：六平台营销全案 | Capstone: Six-platform Plan | 40 | 综合全部模块 |
| 5 | `cp-5` | 复盘与迭代：把项目跑起来 | Review & Iteration | 24 | 综合 · 数据复盘方法 |

字数：5183 / 4904 / 4929 / 4862 / 4909

**全站正文合计 383,372 字**（去标签去空白口径），最短 `yt-6` 3794 字，最长 `s0-1` 5610 字。

### 4.5 案例库（13 个，`js/data/cases.js`）

| ID | 品牌 | 平台 | 行业 | 地区 | 关联课时 |
|---|---|---|---|---|---|
| `duolingo` | Duolingo | TikTok/Instagram/X | 教育科技 / 订阅应用 | 全球（英语市场为主） | `x-4` |
| `ryanair` | Ryanair | TikTok/X | 航空 / 低价出行 | 欧洲 | `tk-3` |
| `liquid-death` | Liquid Death | TikTok/Instagram/YouTube | 快消 / 罐装水 | 美国 | `ig-4` |
| `gymshark` | Gymshark | Instagram/YouTube/TikTok | 运动服饰 / DTC | 欧美为主 | `ig-7` |
| `nike` | Nike | Instagram/YouTube/TikTok | 运动服饰 | 全球 | `mk-10` |
| `apple` | Apple | YouTube/Instagram | 消费电子 | 全球 | `yt-4` |
| `anker` | Anker | YouTube/Instagram | 消费电子 / 充电配件 | 欧美为主 | `yt-5` |
| `shein` | SHEIN | TikTok/Instagram | 快时尚 / 跨境电商 | 欧美 / 中东 / 拉美 | `tk-7` |
| `xiaomi` | Xiaomi | Facebook/YouTube/X | 消费电子 | 印度 / 东南亚 / 欧洲 | `fb-4` |
| `notion` | Notion | YouTube/TikTok/X | SaaS / 效率工具 | 全球（英语为主） | `li-4` |
| `hubspot` | HubSpot | LinkedIn/YouTube | SaaS / 营销与 CRM | 全球（英语为主） | `li-4` |
| `maersk` | Maersk | LinkedIn/YouTube | 航运 / 物流 | 全球 | `li-3` |
| `buffer` | Buffer | X/LinkedIn | SaaS / 社媒管理工具 | 全球（远程团队） | `x-6` |

每个案例字段：`id, name, platform, platforms[], type, region, sector, color, learn, intro, secs[], copy[], warn[], src`。
- `secs[]` 固定 12 段，每段 `{t: 段标题, k: 'f'|'a'|'s', x: 正文}`，`k` 分别代表 `公开事实 / 分析 / 教学推演`，详情页按此渲染三级标记。
- `copy[]` = 可复制的做法（≥2 条），`warn[]` = 不要照搬的部分，`src` = 逐案例来源说明（含核查日期）。

### 4.6 实战项目（8 个，`js/data/projects.js`）

| ID | 编号 | 标题 | 平台 | 难度 | 时长 | 步骤 | 交付物 | 模板 | 关联课时 |
|---|---|---|---|---|---|---|---|---|---|
| `p1` | 项目一 | 海外品牌账号搭建 | 六平台规划 | 入门 | 3–4 小时 | 8 | 4 | 2 | `s0-1` |
| `p2` | 项目二 | X 运营实战 | X | 进阶 | 4–5 小时 | 8 | 4 | 2 | `x-4` |
| `p3` | 项目三 | Facebook 企业营销 | Facebook / Meta | 进阶 | 5–6 小时 | 8 | 4 | 2 | `fb-5` |
| `p4` | 项目四 | YouTube 频道建设 | YouTube | 进阶 | 5–6 小时 | 8 | 4 | 2 | `yt-3` |
| `p5` | 项目五 | TikTok 短视频运营 | TikTok | 进阶 | 4–5 小时 | 8 | 4 | 2 | `tk-3` |
| `p6` | 项目六 | Instagram 品牌营销 | Instagram | 进阶 | 5–6 小时 | 8 | 4 | 2 | `ig-5` |
| `p7` | 项目七 | LinkedIn B2B 客户开发 | LinkedIn | 实战 | 5–6 小时 | 8 | 4 | 2 | `li-6` |
| `p8` | 项目八 | 完整海外营销项目 | 全案 | 结业 | 8–10 小时 | 10 | 4 | 2 | `cp-4` |

字段：`id, code, title, platform, level, hours, learn, brief, scene, inputs[{name,tip}], steps[{t,d}], templates[{t,body}], deliver[{t,d}], criteria[]`。

### 4.7 模块检测（10 套 / 76 题，`js/data/checks.js`）

S0/SX/SF/SY/ST/SI/SL/MK 各 8 题，TR/CP 各 6 题。字段 `{stem, options[], answer(0-based), exp}`。校验脚本要求每模块 ≥6 题、每题 ≥3 选项、`answer` 为数字、有解析。

### 4.8 资料来源页数据（`js/data/sources.js`）

`books` 14 条（13 本营销书 + 1 本不相关小说，评级 A/B/C/剔除）、`checks` 16 条平台规则时效核查、`conflicts` 6 组观点冲突裁决、`official` 6 个平台官方入口、`discipline` 6 条内容纪律。

---

## 5. UI 设计规范

### 5.1 设计原则（写进 `css/tokens.css` 头注释）

科技蓝 + 白 + 浅灰，专业商务，高信息密度。**明确禁止**：深色大底、渐变背景、发光边框、装饰性动画、无意义的卡片堆叠、图标风格混用、营销腔文案。

### 5.2 颜色令牌（`css/tokens.css`）

| 分类 | 变量 | 值 | 用途 |
|---|---|---|---|
| 品牌蓝 | `--blue-50` | `#EFF6FF` | 导航选中底、callout 底、序号徽标底 |
| | `--blue-100` | `#DBEAFE` | 文本选区 |
| | `--blue-200` | `#BFDBFE` | 备用 |
| | `--blue-500` | `#2563EB` | callout 左边线、配比条社媒色 |
| | `--blue-600` | `#1D4ED8` | **主色**：主按钮、品牌块、链接、tab 选中 |
| | `--blue-700` | `#1E40AF` | 主按钮 hover、深色强调文字 |
| 中性 | `--ink-900` | `#0F172A` | 标题 |
| | `--ink-800` | `#1E293B` | 正文主色 |
| | `--ink-700` | `#334155` | prose 正文、次按钮文字 |
| | `--ink-600` | `#475569` | 导航文字、表头 |
| | `--ink-500` | `#64748B` | 次要说明 |
| | `--ink-400` | `#94A3B8` | 极次要、placeholder、图标默认 |
| | `--ink-300` | `#CBD5E1` | 滚动条、hover 边框 |
| 面 | `--bg` | `#FFFFFF` | 卡片、侧栏、顶栏 |
| | `--bg-sub` | `#F8FAFC` | **页面底色** |
| | `--bg-alt` | `#F1F5F9` | hover 底、code 底 |
| | `--line` | `#E2E8F0` | 主分割线 |
| | `--line-strong` | `#CBD5E1` | 按钮边框 |
| 语义 | `--ok` / `--ok-bg` | `#0F766E` / `#F0FDFA` | 成功、已完成 |
| | `--warn` / `--warn-bg` | `#B45309` / `#FFFBEB` | 警示 |
| | `--danger` / `--danger-bg` | `#B91C1C` / `#FEF2F2` | 删除、错误 |

模块主题色不走令牌，直接写在 `modules.js` 的 `color` 字段，通过内联 `--mc` 变量注入（`style="--mc:${m.color}"`）。课程分组色在 `home.js` 硬编码：社媒 `#2563EB`、营销 `#0D9488`、贸易 `#B45309`、实战 `#15803D`。

### 5.3 字体与排版

```css
--font: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB",
        "Microsoft YaHei", Roboto, Helvetica, Arial, sans-serif;
--mono: "SF Mono", ui-monospace, "Cascadia Code", Menlo, Consolas, monospace;
```

| 元素 | 规格 |
|---|---|
| body | 15px / 1.72 / `--ink-800` / `--bg-sub` |
| h1–h5 | `font-weight: 650`，`letter-spacing: -.012em`，`line-height: 1.38` |
| 页标题 `.page-title` | 25px，`-.02em` |
| 页副标题 `.page-sub` | 13.5px，`--ink-500` |
| 讲义正文 `.prose` | 15.2px / **1.9**，`--ink-700`（刻意比正文行高更大，长文阅读） |
| 讲义段标题 `.prose h2` | 17px，上边框分隔 + 序号徽标（`.n`，11px 等宽，蓝底蓝字） |
| 表格 | 13px，表头 12px 且不换行 |
| 辅助字号 | `.tiny` 11.5px / `.small` 13px |
| 数字 | `.num` / `.mono` 用 `tabular-nums` 对齐 |

### 5.4 布局与栅格

| 项 | 值 |
|---|---|
| 内容最大宽度 | `--maxw: 1080px`，`.view` 居中 |
| 侧栏 | 236px 固定，`position: sticky`，`height: 100vh` |
| 顶栏 | 56px（移动 52px），sticky，半透明白底 + `backdrop-filter: blur(8px)` |
| 视图内边距 | 桌面 `26px 24px 96px`；移动 `18px 14px 96px`（底部 96px 是给固定操作条/标签栏留位） |
| 圆角 | `--r-s: 6px`（按钮/小卡）、`--r-m: 10px`（卡片）、`--r-l: 14px`（大面板） |
| 阴影 | `--shadow-sm: 0 1px 2px rgba(15,23,42,.05)`、`--shadow-md: 0 4px 16px rgba(15,23,42,.06)` |
| 缓动 | `--ease: cubic-bezier(.2,.6,.3,1)`，过渡时长 0.14s（按钮/导航）、0.1s（位移） |

**断点（共 3 类，出现位置已核实）**

| 断点 | 作用 |
|---|---|
| `max-width: 900px` | 主断点：隐藏侧栏、显示底部 5 项 tabbar、顶栏 52px、视图内边距收窄、`.action-bar` 从 `left:236px` 改为 `left:0` 并抬到 tabbar 之上 |
| `min-width: 1180px` | 显示课时页右侧目录 `.toc`（1180px 以下不渲染占位，直接单栏） |
| `max-width: 860 / 760 / 600px` | 局部栅格塌缩：`grid3`→1 列（860）、模块卡/案例/项目/`grid2`→1 列（760）、统计分析→2 列（760）、`continue` 卡纵向排列（600） |
| `prefers-reduced-motion: reduce` | 全局关闭 animation 与 transition |

### 5.5 组件清单

**`components.css`（通用）**
`.card`（+`.flat` 无阴影灰底 / `.pad-s` 小内距 / `.accent` 左蓝边）、`.btn`（+`.primary .ghost .sm .block .danger`）、`.icon-btn`、`.chip`（+`.line .blue .ok .warn .tint`）、`.dot-chip`、`.bar-track` / `.bar-fill`（+`.thin`）、`.donut-wrap` / `.donut-center`、`.input` / `.field` / `.seg` / `.checkline`、`.tbl` / `.tbl-scroll`、`.list-row`、`.sec-head`、`.callout`（+`.ok .warn`，左侧 3px 色条）、`.crumb`、`.empty`、`.source-note`、`.result-box`、`.quiz-q` / `.opt`（+`.sel .correct .wrong`）/ `.explain`（+`.show`）、`.search-panel` / `.search-box` / `.sr`、`#toast`

**课时专用**：`.lesson-top` / `.lesson-title` / `.lesson-en` / `.lesson-meta`、`.learn-objectives`、`.lesson-layout` + `.toc`、`.prose`（讲义正文全套：h2/h3/table/ul/ol/li/blockquote/code/`.term`/`em`）、`.summary-box`、`.terms-box` / `.term-item`、`.practice-card`

**`views.css`（页面级）**：`.hero`、`.stat-grid` / `.stat-card`、`.continue`、`.mix` / `.mix-legend`、`.mod-grid` / `.mod-card`、`.course-row`、`.mod-banner`、`.chapter-item` / `.ch-num` / `.ch-status`、`.filter-bar`、`.case-grid` / `.case-card`、`.case-hero` / `.case-sec`、`.k-mark` / `.k-f` / `.k-a` / `.k-s`（三级事实标记）、`.proj-grid` / `.proj-card`、`.step-list`、`.deliverable`、`.profile-head` / `.avatar`、`.menu-list` / `.menu-item`、`.week-table`、`.notice`、`.rating` / `.rating.A/.B/.C/.X`、`.eta`（四档时效标记）、`.grid2` / `.grid3`、`.check-cta`

### 5.6 交互与动效

- **几乎无动效**：只有按钮 `background/border-color` 0.14s 过渡、`active` 位移 1px、进度条宽度变化、toast 淡入淡出。`utils.animateNumber`（数字缓动）是 1.x 遗留函数，2.0 的视图**均未调用**，仅保留在 `utils.js` 中。
- **滚动行为**：`html { scroll-behavior: smooth }`；课时目录点击平滑滚动并偏移 70px（避开 sticky 顶栏）；路由切换后 `scrollTo(0,0)`。
- **反馈**：所有写操作给 `G.toast('…')` 文案反馈（如"笔记已保存""已记录成绩"）。
- **危险操作**：清空数据用原生 `confirm()`；改昵称用原生 `prompt()`（`me.js`）。
- **键盘**：`/` 唤起搜索、`Esc` 关闭搜索浮层。
- **无障碍**：图标 SVG 带 `aria-hidden="true"`；主内容为语义化 `h1/h2/section`；未做完整 keyboard focus 管理与 `aria-live` 支持 **【待确认是否要达到 WCAG 级别】**。

---

## 6. 数据存储与数据结构

### 6.1 两类数据

| 类型 | 载体 | 读写方式 | 可变性 |
|---|---|---|---|
| **内容数据**（课程/案例/项目/题库/资料） | 代码内的 JS 对象（`js/data/*.js`） | 页面加载时随脚本进入内存 | 只读，改内容 = 改代码 + 发版 |
| **用户数据**（进度/笔记/收藏/成果/成绩） | 浏览器 `localStorage` 单键 `gba_state` | 只经 `G.store` API 写入 | 可读写，仅存本机 |

### 6.2 内容数据结构

**模块（`G.data.modules[]`）**

```js
{
  id: 'SX',                                  // 模块 id（大写），课时 id 前缀小写
  code: 'MODULE 02',
  icon: 'x',                                 // 对应 icons.js 中的图标名
  color: '#334155',                          // 模块主题色，注入 CSS 变量 --mc
  title: 'X（原 Twitter）运营',
  en: 'Operating on X',
  desc: '一句话简介（首页模块卡用）',
  weight: '社媒 55%',                         // 展示文案，★为原始规划比例，与实测值不一致（见 7.3-17）
  goal: '模块学习目标（模块页 banner 用）',
  chapters: [ /* 见下 */ ]
}
```

**章节（`module.chapters[]`，构建时被补齐 3 个字段）**

```js
{
  id: 'x-1',            // ★全局唯一课时 id
  t: 'X 平台认知：从 Twitter 到 X',
  en: 'Understanding X',
  src: 'X Help Center · X Business（核对 2026-11）',  // 依据来源，课时页芯片与章节列表展示
  mins: 24,             // 建议时长，用于学时统计与学习计划排布
  moduleId: 'SX',       // ← modules.js 自动补
  no: 1,                // ← modules.js 自动补（模块内序号）
  moduleColor: '#334155'// ← modules.js 自动补
}
```

**讲义（`G.data.lessons['x-1']`）**

```js
{
  objectives: [ '…', '…', '…' ],          // 学习目标，≥3 条
  sections: [                              // ★固定 7 段，h 必须逐字匹配
    { h: '本节要解决的问题', html: '<p>…</p>' },
    { h: '核心概念',        html: '<table>…</table><div class="callout">…</div>' },
    { h: '机制与原理',      html: '…' },
    { h: '操作步骤',        html: '<ol><li>…</li></ol>' },   // ≥7 条 li
    { h: '商业场景',        html: '…' },
    { h: '案例',            html: '…' },
    { h: '常见问题与风险',  html: '<ul><li><b>问题：…</b>原因：…应对：…</li></ul>' }  // ≥5 条
  ],
  summary: [ '…', '…', '…' ],             // 要点总结，≥3 条
  terms: { '术语': '解释', … },            // 关键术语，≥3 个
  official: [ '官方核对入口 1', '…' ],     // ≥1 条
  practice: '本节实操任务一句话'
}
```

硬约束（`validate.js` 强制执行）：7 段标题逐字一致、纯文本 ≥3600 字、`<table>` ≥2、`class="callout"` ≥1、`objectives`/`summary` ≥3、`terms` ≥3、`official` ≥1、`practice` 非空、正文内不得出现 `TODO`/`待补充`/`Lorem ipsum`/`占位符`/`此处省略`/`见上文XXX`，不得残留未转义的 `${`。

**`modules.js` 构建后导出的索引与派生值**

| 导出 | 说明 |
|---|---|
| `G.data.modules` | 模块数组（10 项，有序） |
| `G.data.moduleById[id]` | 模块 id → 模块对象 |
| `G.data.lessonById[id]` | **课时 id → 章节对象**（store 统计完成数时用它过滤旧 id） |
| `G.data.allLessons` | 84 个章节的扁平数组（顺序 = 模块顺序 × 章内顺序，用于上下节导航） |
| `G.data.totalLessons` | 84 |
| `G.data.totalMins` | 2198 |
| `G.data.curriculumWeights` | `{social:1456, marketing:352, trade:248, practice:142}` |
| `G.data.groupOfModule` | `{S0:'social', SX:'social', …, MK:'marketing', TR:'trade', CP:'practice'}`（**是对象，不是函数**） |
| `G.data.lessonsOfModule(id)` | 返回模块章节数组 |

### 6.3 用户数据（`localStorage['gba_state']`，schema 4）

`store.js` 的 `defaultState()` 定义完整结构：

```js
{
  schema: 4,
  createdAt: 1690000000000,

  progress: {                    // 课时学习记录。★同时保存 1.x 旧 id（不清理）
    's0-1': {
      done: true,                // 是否标记学完
      pct: 100,                  // 阅读进度百分比（0–100，滚动驱动）
      lastPos: 0,                // 上次滚动位置 px
      seconds: 0,                // 预留：停留秒数（当前未累计）
      lastAt: 1690000000000,     // 最后访问时间戳
      migratedFrom: 'm06-1'      // 仅迁移条目有：来自 1.x 哪个课时 id
    }
  },

  noteBook: [                    // 笔记（新的在前）
    { id: 'n1690000000000', lessonId: 's0-1', text: '…', at: 1690000000000 }
  ],

  wrongBook: [],                 // ★ 错题本。store 有 addWrong/clearWrong/activeWrong，但当前无 UI 调用（见 7.3-3）
  // 结构：{ qid, lessonId, lastAnswer, times, cleared, at }

  favorites: [ 's0-1' ],         // 收藏的课时 id 数组
  toolHistory: [],               // ★ 1.x 遗留字段，2.0 未使用

  exam: {                        // 模块检测成绩
    'SX': { score: 6, total: 8, at: 1690000000000 }
  },

  streak: {                      // 连续学习
    count: 3,                    // 连续天数
    lastDate: '2026-11-27',      // 最后打卡日期（YYYY-MM-DD）
    days: ['2026-11-27', …]      // 最近 90 天以内有学习的日期
  },

  dailyGoal: {                   // 每日学习时长
    targetMin: 20,               // 目标（当前 UI 未使用该字段做进度环）
    log: { '2026-11-27': 12 }    // 日期 → 分钟（每次 updateProgress 记 1 分钟）
  },

  settings: {                    // 设置
    name: '学习者',              // 昵称（我的学习页可改，最长 16 字）
    theme: 'light',              // ★ 被 migrate 强制写成 'light'
    speech: true,                // ★ 1.x 遗留，未使用
    reducedMotion: false         // 影响 utils.animateNumber 是否缓动
  },

  visited: [ 's0-1', 'x-2' ],    // 最近访问的课时 id（最多 20，新的在前）

  /* ---- 2.0 新增 ---- */
  projectSubs: {                 // 实战项目提交
    'p1': {
      text: '我的成果…',          // 成果正文（纯文本）
      at: 1690000000000,        // 最后保存时间
      done: { '0': true, '2': true }, // 交付物勾选：taskIndex → bool
      status: 'progress'        // 'draft' | 'progress'
    }
  },

  caseFav: [ 'maersk' ],         // 收藏的案例 id 数组

  plan: {                        // 学习计划
    weeklyMin: 420,              // 每周可投入分钟（180/300/420/600/840）
    weeks: 8,                    // 计划周期（4/8/12/16）
    start: null,                 // ★ 预留，未写入
    weeksDone: []                // ★ 预留，未使用
  },

  legacy: {                      // 1.x 迁移结果（仅在发生过迁移时写入）
    v1Completed: 12,             // 迁移前已完成的旧课时数
    mapped: 3,                   // 实际映射到新课程的条数
    at: 1690000000000
  }
}
```

另有独立键 `localStorage['gba_welcomed_v2'] = '1'`，仅用于判断是否首次访问（决定是否弹更新 toast）。

### 6.4 schema 迁移机制（`store.js`）

```js
const KEY = 'gba_state';
const SCHEMA = 4;

const LEGACY_MAP = {        // 1.x 课时 id → 2.0 课时 id，共 13 条
  'm06-1': 's0-1',  'm06-3': 's0-2',  'm06-10': 's0-6', 'm06-9': 'mk-12',
  'm05-1': 'mk-1',  'm05-2': 'mk-7',  'm05-3': 'mk-3',  'm05-8': 'mk-11',
  'm07-1': 'tr-2',  'm04-3': 'tr-6',  'm04-4': 'tr-3',  'm04-7': 'tr-5',
  'm08-1': 'cp-1'
};
```

`migrate(s)` 的行为：
1. 若 `s.schema < 4`：遍历 `LEGACY_MAP`，当旧课时 `done === true` 且新课时尚无记录时，复制一条 `{...旧记录, done:true, pct:100, migratedFrom:旧id}` 到新 id；统计 `mapped`；写 `s.legacy = {v1Completed, mapped, at}`。
2. **不删除任何旧 `progress` 记录**（这是"不丢进度"的关键约定）。
3. 补齐 `defaultState()` 中缺失的顶层字段（浅合并）；对 `settings / streak / dailyGoal / plan` 做对象级合并；`settings.theme` 强制为 `'light'`。
4. 无法解析 JSON 或读写异常时 `console.warn` 并回落 `defaultState()`（数据不静默丢失，但也不恢复）。

`completedCount()` 的特殊处理：只统计 `G.data.lessonById` 中存在的 id。原因：1.x 的 `m01-1` 等旧记录保留在 `progress` 里，若一并计数会出现「已完成 95 / 84 节」的越界数字。

### 6.5 读写路径（唯一入口）

`view → G.store.<method>() → state（内存对象）→ save() → localStorage.setItem('gba_state', JSON.stringify(state)) → dispatch CustomEvent('gba:state')`

**`G.store` 全部 API**

| 分组 | 方法 |
|---|---|
| 基础 | `get()`, `set(fn)`, `save()` |
| 进度 | `markVisit(id)`, `updateProgress(id, patch)`, `toggleDone(id)` → bool, `isDone(id)`, `completedCount()` |
| 连续学习 | `touchStreak()`, `logMinutes(m)` |
| 笔记 | `addNote(lessonId, text)`, `removeNote(id)`, `notesFor(lessonId)` |
| 错题（未接入 UI） | `addWrong(qid, lessonId, answer)`, `clearWrong(qid)`, `activeWrong()` |
| 收藏课时 | `toggleFav(id)` → bool, `isFav(id)` |
| 收藏案例 | `toggleCaseFav(id)` → bool, `isCaseFav(id)` |
| 实战 | `getProject(id)`, `saveProject(id, patch)`, `toggleTask(projectId, idx)`, `projectCount()` |
| 计划 | `setPlan(patch)` |
| 检测 | `saveCheck(moduleId, score, total)`, `checkOf(moduleId)` |
| 设置 | `setSetting(k, v)` |
| 数据 | `exportJSON()`, `reset()` |

注意：`store` 内部 `state` 是模块级闭包变量，`get()` 返回的是**引用**（视图读取时不要修改它）。所有写入必须走 `set()` 或上述封装方法，否则不会持久化。

### 6.6 数据边界与风险

- 单设备单浏览器。换设备、清缓存、隐私模式退出都会丢数据；UI 已提示并提供了 JSON 导出（`我的学习 → 导出学习数据`）。
- 单键存储，整个状态树序列化后写入。当前状态量级很小（几十 KB），但若未来加入大量笔记或长文本，需注意 LocalStorage 常见 5 MB 上限（`save()` 已捕获异常并提示"存储空间可能已满"）。
- 无版本校验失败的回滚机制：若未来把 `SCHEMA` 提到 5 而迁移代码写错，老用户数据可能被写坏。**改动此处必须先用真实旧数据做一次迁移演练**。

---

## 7. 功能状态：已实现 / 未实现 / 存在问题

### 7.1 已实现且可交付

| 功能 | 入口 | 数据落地 |
|---|---|---|
| 课程浏览（四分组 → 模块 → 章节） | 课程体系 | `modules.js` |
| 讲义阅读（7 段 + 目录 + 术语 + 实操 + 官方入口） | 课时页 | 10 个 `lessons_*.js` |
| 标记学完 / 撤销 | 课时页底部操作条 | `progress[id].done` |
| 阅读进度记录 | 课时页滚动 | `progress[id].pct / lastPos` |
| 上下节连续导航 | 课时页底部 | — |
| 笔记增删（按课时） | 课时页 / 我的学习 | `noteBook[]` |
| 收藏课时 | 课时页 | `favorites[]` |
| 连续学习天数 | 顶栏 chip / 我的学习 | `streak` |
| 今日学习分钟 | 首页统计卡 | `dailyGoal.log` |
| 案例浏览 + 平台筛选 + 收藏筛选 | 案例库 | `cases.js` / `caseFav[]` |
| 案例收藏 | 案例详情 | `caseFav[]` |
| 实战项目 8 个（步骤/模板/交付物/成果） | 实战中心 | `projects.js` / `projectSubs` |
| 项目成果导出 `.txt` | 项目详情 | 前端 Blob |
| 模块检测（单选/解析/成绩/重做） | 模块页 / 课时页 | `checks.js` / `exam` |
| 全局搜索（课时/案例/项目） | 侧栏 / 顶栏 / `/` | 内存索引 |
| 学习计划自动排周 | 我的学习 | `plan` |
| 数据导出 JSON | 我的学习 | `exportJSON()` |
| 清空数据（二次确认） | 我的学习 | `reset()` |
| 1.x 进度迁移 | 自动（首次打开） | `legacy` |
| 双端响应式（桌面/移动） | 全局 | CSS 断点 |
| 资料来源与时效说明 | 侧栏 REFERENCE | `sources.js` |

### 7.2 未实现 / 缺失

| 项 | 说明 |
|---|---|
| 账号体系 | 无注册/登录，无用户身份 |
| 云端同步 | 数据不跨设备，无服务端 |
| 后端 / API | 完全没有服务端代码 |
| 讲义正文全文搜索 | 搜索只覆盖标题与简介（`shell.js` `buildIndex()`） |
| 错题本 UI | `store` 已有 API 与数据结构，`check.js` 未调用，无页面展示 |
| 学习报告 / 证书 | 只有原始 JSON 导出与单项目文本导出，无汇总报告或结业证书 |
| 站内通知 / 复习提醒 | 无（无 Service Worker、无推送） |
| PWA / 离线安装 | 无 manifest、无 Service Worker（但页面本身可离线打开） |
| 深色主题 | 已被移除，`settings.theme` 强制 `light`，令牌只有浅色一套 |
| 打印样式 | 无 `@media print`，打印讲义会带上导航与固定操作条 |
| 多语言 | 内容中英混排，界面文案仅中文 |
| 埋点 / 数据分析 | 无任何统计脚本 |
| 内容管理后台 | 改内容需改代码并发版 |
| 课程搜索过滤（按模块/难度筛选） | 课程页无筛选器 |
| 我的学习页展示检测成绩汇总 | 单模块成绩只在模块页显示上次分数 |

### 7.3 已知问题（按影响排序，均已在代码中定位）

| # | 问题 | 位置 | 影响 | 建议 |
|---|---|---|---|---|
| 1 | **课时页滚动监听不注销**：`window.addEventListener('scroll', onScroll)` 每次进入课时都新增一个监听，从未 `removeEventListener` | `js/views/lesson.js:179` | 反复进出课时后监听器累积，滚动时重复计算与写盘，长时间使用会变卡并放大 LocalStorage 写入频率 | 在路由切换时卸载；或改用 `{ once:false }` + 视图销毁钩子；router 增加 `beforeLeave` 回调 |
| 2 | **IntersectionObserver 未 disconnect** | `js/views/lesson.js:160-168` | 同上的观察者泄漏，旧 DOM 被闭包引用无法回收 | 存引用并在切页时 `disconnect()` |
| 3 | **错题本未接入**：`store.addWrong/clearWrong/activeWrong` 与 `wrongBook` 字段存在，但 `check.js` 交卷时没有调用，也没有任何页面展示 | `js/core/store.js:176-184`、`js/views/check.js:50-78` | 有数据结构和 API 却无功能，属半成品 dead code；`validate.js` 不检查此项 | 交卷时对错题调用 `addWrong`，在「我的学习」加错题列表，或删掉这套 API 避免误导 |
| 4 | **首页文案与入口名不一致**：提示"可在「我的学习 → 学习记录」查看"，但该页区块实际叫「最近学习」 | `js/views/home.js:39` vs `js/views/me.js:79` | 用户按文案找不到入口 | 改文案或改区块标题，二选一 |
| 5 | **移动端固定操作条遮挡正文**：`.action-bar` 常驻底部（`bottom: 56px + safe-area`），视图底部留白 96px 仅够首屏，长文滚动中操作条会压住最后一行内容 | `css/base.css:108-116`、`js/views/lesson.js:97` | 移动端阅读体验受损，用户需额外滚动才能看到被遮内容 | 改为滚动到底部才浮现，或增大 `.view` 的 `padding-bottom` 到 `130px` |
| 6 | **路由无错误边界**：视图函数抛错时 `#view` 保持空白，用户只看到空页面 | `js/core/router.js:22-40` | 单个数据错误导致整页白屏且无提示 | `dispatch()` 内 try/catch，失败时渲染错误卡片 + 控制台详情 |
| 7 | **主题切换失效是硬编码结果**：`migrate()` 无条件 `settings.theme = 'light'` | `js/core/store.js:76` | 若未来加暗色主题，此处会覆盖用户选择 | 加主题时改成尊重已有值，并补深色令牌 |
| 8 | **案例筛选栏平台列表不完整**：筛选按钮由 `c.platform`（单值）生成，跨平台案例只以主平台出现 | `js/views/cases.js:11` | 例如 Duolingo（主 TikTok，另含 IG/X）不会让 IG 单独成为筛选项，但点 IG 仍能筛到它（filter 用 `platforms`） | 用 `platforms` 的并集生成筛选项 |
| 9 | **搜索不覆盖正文** | `js/views/shell.js:98-113` | 找"漏斗""Incoterms"等术语只能靠标题命中 | 见 11.3 建议 |
| 10 | **测试脚本硬编码环境**：Chrome 路径 `C:\Program Files\Google\Chrome\Application\chrome.exe`、服务地址 `http://localhost:8099/index.html` | `tools/browser_test.js:9-10` | 换机器/换端口需改代码 | 改为读 `process.env.CHROME_PATH` / `BASE_URL`，带默认值 |
| 11 | **测试依赖不在站点仓库内**：`puppeteer-core` 装在父目录 `node_modules`，`gba/` 无 `package.json` | `../package.json` | 单独 clone `gba/` 后 `browser_test.js` 直接报 `Cannot find module` | 在 `gba/` 加 `package.json`（仅 devDependencies）或改脚本容错 |
| 12 | **29 个串行 `<script>`**：无 `defer`/`async`，首屏需等全部数据文件下载完 | `index.html:19-57` | 首屏 JS 载荷约 1.6 MB，慢网络下白屏时间偏长 | 见 11.5 |
| 13 | **`yt-6` 正文 3794 字**，为全站最低，距 3600 校验线仅 194 字 | `js/data/lessons_yt.js` | 校验收紧时最先失败 | 补一张表或一段机制说明 |
| 14 | **`progress[id].seconds` 与 `dailyGoal.targetMin` 未实际使用** | `js/core/store.js:114,120-125` | `logMinutes(1)` 固定每次 +1 分钟，实际时长统计不准确 | 若要真实统计，用进入/离开时间差累计 |
| 15 | **学时配比与原始规划不一致**：实测社媒 66% / 营销 16% / 贸易 11% / 实战 6%，原规划 55/30/10/5 | `js/data/modules.js` `curriculumWeights` | 已在首页与 `使用说明.md` 明示原因（六平台各成一课占 57 节），页面按真实学时显示，**不是 bug** | 若要对齐规划，需把 MK 从 13 节扩到约 20 节（新增品牌资产、渠道管理、定价与促销、营销组织与预算等） |
| 16 | 原生 `prompt()` / `confirm()` 用于改昵称与清空数据 | `js/views/me.js:124,146` | 移动端样式不可控、部分内嵌浏览器会屏蔽 | 换成自有模态框 |
| 17 | **`weight` 文案显示的是规划比例而非实测比例**：所有社媒模块的 `weight` 都写着 `社媒 55%`，而 `curriculumWeights` 算出来是 66%；该字段在模块详情页 banner 上会显示（`courses.js:81`） | `js/data/modules.js` 各模块 `weight`；`js/views/courses.js:81` | 首页配比条（66%）与模块页 banner（55%）数字互相矛盾，细心用户会发现 | 把 `weight` 改为实测值，或直接删掉该字段、改用 `curriculumWeights` 动态生成 |

---

## 8. 启动、调试、构建与部署

### 8.1 本地启动

```bash
cd "C:/Users/1/WorkBuddy/2026-11-19-15-12-08/gba"
python -m http.server 8099
# 浏览器打开 http://localhost:8099/index.html
```

手机预览（同一 Wi-Fi）：`http://<电脑局域网IP>:8099/index.html`。
也可直接双击 `index.html` 用 `file://` 打开 —— 功能基本可用，但部分浏览器对 `file://` 的 LocalStorage 有限制，**涉及进度保存的验证请用 HTTP 方式**。

### 8.2 调试

| 目的 | 方法 |
|---|---|
| 查看当前状态 | 控制台 `GBA.store.get()` |
| 查看课程数据 | `GBA.data.totalLessons`、`GBA.data.lessonById['s0-1']`、`GBA.data.lessons['s0-1']` |
| 校验学时配比 | `GBA.data.curriculumWeights` |
| 重置状态 | `GBA.store.reset()`，或控制台 `localStorage.removeItem('gba_state')` 后刷新 |
| 跳转页面 | `GBA.router.go('lesson?id=li-6')` 或直接改 `location.hash` |
| 打开搜索 | `GBA.openSearch()` |
| 状态变更监听 | `window.addEventListener('gba:state', e => console.log(e.detail))`（每次 `save()` 都会派发） |
| 排查数据未写入 | 确认走的是 `G.store` API；直接改 `GBA.store.get()` 返回的对象不会持久化 |

### 8.3 测试

```bash
# 1) 内容与结构校验（零依赖，任何机器可跑）
node tools/validate.js

# 2) 冒烟测试（需先启动本地服务 + 本机 Chrome + puppeteer-core）
python -m http.server 8099      # 另一个终端
node tools/browser_test.js
```

`tools/validate.js` 的 8 个检查段：
1. 语法与加载：把 29 个脚本按 `index.html` 顺序在 `vm` 沙箱里跑一遍（带 DOM 桩）
2. 课程结构与覆盖：10 模块 / 84 章 / 每章必须有正文 / 打印学时配比
3. 讲义深度：7 段标题逐字比对、字数 ≥3600、表格 ≥2、callout ≥1、objectives/summary ≥3、terms ≥3、official ≥1、practice 非空
4. 案例库：13 个、每案例段数 ≥12、`copy` ≥2、`warn` 非空、有 `src`、有 `learn`、每段 `k` ∈ {f,a,s}、六平台全覆盖
5. 实战项目：8 个、`brief/steps/deliver/criteria` 齐全、步骤 ≥5
6. 检测题库：每模块 ≥6 题、选项 ≥3、`answer` 为数字、有解析
7. 视图与路由：11 个视图函数存在、11 条路由已在 `app.js` 注册
8. 内容纪律：无占位词、无 `${` 残留

当前基线：**0 错误 0 提示**，正文合计 383,372 字，最短 `yt-6` 3794 字，最长 `s0-1` 5610 字。

`tools/browser_test.js` 的 5 个阶段：桌面 1280×900 全路由 → 移动 390×844 全路由（含 `scrollWidth` 零溢出断言）→ 交互与持久化（标记学完/笔记/课时收藏/案例收藏/交付物/交卷+解析/`/` 搜索/刷新保持）→ 1.x 迁移（注入旧 state，验证 schema 升 4、3 条映射、旧记录保留、完成数不越界）→ 截图输出到 `shots/`。当前基线：**65 项全通过，运行时错误 0**。

> 冒烟测试内含 `ensureLoaded()` 重试逻辑，用于对抗偶发的静态资源加载中断（此前出现过半数脚本未加载导致误报失败）。

### 8.4 构建

**没有构建步骤。** 源码即产物：仓库根目录就是站点根目录。

发布前唯一需要跑的是校验与冒烟测试，然后直接提交推送。

### 8.5 部署（GitHub Pages）

**当前配置**：Settings → Pages → Source = `Deploy from a branch`，Branch = `main`，目录 = `/ (root)`。仓库**未绑定自定义域名**（无 `CNAME` 文件）。

**发布流程**

```bash
cd "C:/Users/1/WorkBuddy/2026-11-19-15-12-08/gba"
node tools/validate.js                 # 必须 0 错误
git add -A && git commit -m "…"
git push origin v2-social
git push origin v2-social:main         # 让 Pages 分支跟上（或先合并到 main 再推 main）
```

Pages 构建约需 30–90 秒，可用 API 轮询状态：

```bash
curl -H "Authorization: Bearer <TOKEN>" \
  https://api.github.com/repos/x13502239474-oss/global-business-academy/pages
# 期望 status: built
```

**本机网络注意事项（重要，会浪费大量排查时间）**

该开发机的环境变量代理 `http_proxy/https_proxy = http://127.0.0.1:60314` 对 `github.com:443` 转发异常（返回 502 或直接超时），但对 `api.github.com` 正常——现象是 `curl api.github.com` 通、`git ls-remote` 失败，极易误判为 token 或仓库问题。实测可用通道是本机 SOCKS5 `127.0.0.1:10808`：

```bash
env -u http_proxy -u https_proxy -u HTTP_PROXY -u HTTPS_PROXY \
  git -c http.proxy=socks5h://127.0.0.1:10808 push origin main
```

若希望长期免参数，可写入仓库级配置（**不要**把 token 写进配置）：`git config http.proxy socks5h://127.0.0.1:10808`。

**回滚**

```bash
git log --oneline                    # 找到上一次正常提交
git revert <bad-commit>              # 推荐：生成反向提交，保留历史
git push origin main
```

也可在 GitHub Pages 设置里把 Branch 临时切到旧分支/tag。因站点无后端、无数据库，回滚不涉及数据迁移。

**凭据**：推送使用 GitHub Personal Access Token。**令牌不应写入任何文件**（本仓库未保存）。本次交接前提供过的 token 已在会话中暴露，**应视为已泄露并立即撤销重建**。

### 8.6 首次拉起项目需要做的事（给接手方）

1. `git clone https://github.com/x13502239474-oss/global-business-academy.git`（或在现有目录直接使用）
2. `python -m http.server 8099` 打开验证
3. `node tools/validate.js` 确认 0 错误
4. 若要跑冒烟测试：安装 Node 与 `npm i -D puppeteer-core`，并确认本机 Chrome 路径与 `tools/browser_test.js:9` 一致
5. 阅读 `docs/SOURCES.md` 与 `docs/CONTENT_SPEC.md`——**改内容前必读**，否则很容易写出违反事实纪律的段落

---

## 9. 第三方服务、API 与环境变量

### 9.1 运行时第三方服务

**无。** 站点不调用任何外部服务、API、CDN、字体服务、统计平台。已逐一核查 `index.html`、`css/*.css`、`js/**/*.js` 中的 `http(s)://` 与 `fetch`/`XMLHttpRequest`，除 SVG 命名空间声明外无任何网络请求。

### 9.2 内容中引用的外部地址

`js/data/sources.js` 的 `official[]` 与各课时 `official[]` 字段里保存了**供学习者人工核对**的官方入口（如 `X Help Center`、`Meta Business Help Center`、`YouTube Help`、`TikTok Academy`、`Instagram Help Center`、`LinkedIn Marketing Solutions`）。这些是**展示文本**，站点不会自动请求它们。

### 9.3 环境变量

**无。** 站点与测试脚本均未读取 `process.env`（`tools/*.js` 只用 `fs`/`path`/`vm`/`puppeteer-core`）。若后续改造测试脚本支持环境变量，建议命名 `CHROME_PATH`、`BASE_URL`。

### 9.4 密钥、密码、凭据

- 站点代码内**不含**任何密钥、token、密码、API Key、数据库连接串。
- 仓库内**不含** `.env`，`.gitignore` 已屏蔽 `.env*`、`*.pem`。
- 唯一涉及的凭据是 GitHub 推送用的 Personal Access Token，**不属于项目资产**，由维护者自行保管，不得写入代码或配置。
- **提醒**：此前会话中出现过一个明文 token，请立即在 GitHub → Settings → Developer settings → Personal access tokens 中撤销并重新生成。

### 9.5 其他外部依赖

| 项 | 性质 | 说明 |
|---|---|---|
| GitHub Pages | 托管 | 免费静态托管，受 GitHub 可用性影响；中国大陆访问速度不稳定 |
| Google Chrome | 开发期 | 仅冒烟测试使用 |
| 教材 PDF（14 份） | 写作资料 | **不在仓库内**，为项目启动时的桌面文件，已抽取的目录/章节文本存于父目录 `data/sources/`（`cateora_toc.txt`、`navtoc_*.txt`、`probe*.json` 等 10 个文件）。原始 PDF 的存放位置与版权归属 **【待确认】** |

---

## 10. 后续开发不能随意修改的部分

### 10.1 契约层：改动会直接破坏功能或用户数据（**禁止改动，除非同步改测试并做迁移**）

| 项 | 位置 | 为什么不能动 |
|---|---|---|
| **课时 ID 命名**（`s0-1`、`x-4`、`li-6`…） | `js/data/modules.js` | 被 `progress`、`noteBook`、`favorites`、`visited`、`projectSubs.learn`、`cases[].learn`、`projects[].learn`、`LEGACY_MAP` 的值、URL 参数共同引用。改 id = 用户进度全部失联。**只能新增，不能改名或复用** |
| **`localStorage` 键名 `gba_state`** | `js/core/store.js:7` | 改名等于清空所有用户数据 |
| **`SCHEMA` 版本与 `migrate()` 分支** | `js/core/store.js:8,51-81` | 升版本必须写迁移；直接把 `SCHEMA` 改成 5 而不写分支，会让老用户数据在新结构下错位 |
| **`LEGACY_MAP` 的 13 条映射** | `js/core/store.js:11-25` | 已在真实用户数据上生效；删除会丢失"升级不丢进度"的承诺 |
| **`completedCount()` 的过滤逻辑** | `js/core/store.js:140-146` | 去掉 `lessonById` 过滤会重新出现「已完成 95/84」越界 |
| **7 段讲义标题原文** | 全部 `lessons_*.js` 的 `sections[].h` | `validate.js:105` 的 `STD` 数组逐字比对：`本节要解决的问题` / `核心概念` / `机制与原理` / `操作步骤` / `商业场景` / `案例` / `常见问题与风险`。改一个字即校验失败，且课时页编号渲染依赖顺序 |
| **`index.html` 脚本加载顺序** | `index.html:19-57` | `core` 先于 `data`，`modules.js` 先于 `lessons_*`，`shell.js` 先于其他视图。乱序会白屏或 `G.mount is not a function` |
| **路由名与视图函数名** | `js/app.js` 的 `R.reg('…')` + `js/views/*.js` 的 `G.views.xxx` | `validate.js:178-183` 断言 11 个视图与 11 条路由必须存在；改名需同步改测试 |
| **`G.mount` / `G.setChrome` / `G.icon` / `G.toast` 签名** | `shell.js` / `icons.js` / `utils.js` | 全部视图依赖，改签名需全站改 |
| **案例 `secs[].k` 三级标记取值** `'f' \| 'a' \| 's'` | `cases.js` | `validate.js:149` 校验；`cases.js` 视图的 `K_LABEL` 映射依赖 |
| **案例/项目/题库必填字段** | 三个数据文件 | `validate.js` 第 4–6 段逐项断言（`copy≥2`、`warn` 非空、`src` 非空、`learn` 非空、`steps≥5`、每题 ≥3 选项等）；删字段会让校验失败 |
| **内容纪律** | `docs/SOURCES.md` 第五节 | 这是本项目的可信度基础：区分官方规则／行业经验（标注"非官方规则"）／教学示例（标注"教学示例，非真实数据"）。**不得编造平台规则、算法权重、案例数据、粉丝数、营收** |

### 10.2 必须保留的现有功能（即便重构 UI，这些能力不能消失）

1. 学习进度记录与"升级不丢进度"（含 1.x 映射与旧记录保留）
2. 笔记、课时收藏、案例收藏
3. 实战项目的交付物勾选 + 成果文本保存 + 导出
4. 模块检测（含解析与重做）
5. 全局搜索（`/` 快捷键）
6. 学习计划自动排周
7. JSON 导出与清空数据
8. 双端响应式（桌面侧栏 / 移动 tabbar）
9. 资料来源与时效说明页（内容可信度的对外交代）

### 10.3 可以相对自由修改的部分

- 全部 CSS（只要保持令牌语义与双端断点，颜色可调整）
- 页面布局与信息组织（不改路由与数据结构的前提下）
- 讲义正文措辞（遵守 `CONTENT_SPEC.md` 与内容纪律）
- 案例、项目、题目的内容（遵守字段结构与事实纪律）
- `shell.js` 的导航项（新增加入口可以，删除现有入口需确认）
- 文案（除 `store` 迁移提示这类与逻辑耦合的句子）

---

## 11. 后续扩展的技术建议

### 11.1 加内容（最高频需求，成本最低）

**新增一节课 = 两步**：
1. 在 `js/data/modules.js` 对应模块的 `chapters` 数组里加 `{ id, t, en, src, mins }`（`id` 用小写模块前缀 + 序号，如 `x-9`）
2. 在对应 `lessons_*.js` 里写 `L['x-9'] = { objectives, sections(7段), summary, terms, official, practice }`

渲染、路由、搜索索引、进度统计、上下节导航、学时配比会自动跟上。**改完必须跑 `node tools/validate.js`** 确认 7 段标题与深度达标。

新增模块：在 `modules.js` 的 `M` 数组加一项，并同步 `groupOf` 映射与 `courses.js` 的分组 `ids` 列表；若有题库，在 `checks.js` 加对应 key。

### 11.2 内容规模增长后的首屏性能（**建议优先处理**）

现状：29 个脚本串行加载，`js/data` 共 1.59 MB，全部解析后才渲染首页。目前本地/Pages 首屏可接受，但内容继续增长会线性恶化。

建议路线（按投入从小到大）：
1. **低成本**：给 `lessons_*.js` 加 `defer`（它们不参与首屏渲染），把 `app.js` 保留为最后同步执行；或把讲义文件改为 `type="module"` 动态导入。
2. **中成本**：把 10 个讲义文件拆成"首屏不需要"的懒加载资源，在 `lesson` 视图渲染前 `await` 按需注入 `<script>`（注意注入后要重建 `G.data.lessons` 引用）。
3. **中高成本**：引入构建（Vite/esbuild）把数据打成分模块 chunk + gzip/brotli。**前提是必须保持 hash 路由与 `file://` 可运行能力**，否则违背项目初衷。
4. 无论哪种方案，都不要把内容搬进后端——静态托管是当前唯一零运维优势。

### 11.3 搜索增强

现状只搜标题与简介。低成本做法：
- 构建时（`tools/` 下加一个脚本）扫描全部讲义，导出"课时 id → 去标签正文"的 JSON 索引，前端按关键词 `includes` 或简单倒排检索；索引可分段按模块懒加载。
- 想更好但要控制成本，可用轻量客户端检索（如手写 bigram 倒排，中文无需分词）。
- 不建议引入第三方搜索服务（会破坏零依赖与离线可用）。

### 11.4 学习闭环增强（产品价值最高）

按投入产出排序：
1. **接入错题本**（现成 API，半天工作量）：`check.js` 交卷时 `S.addWrong(qid, lessonId, answer)`，在「我的学习」加错题列表并可跳回原课时。
2. **检测成绩汇总**：把 `exam` 全部模块成绩做成一张进度表，显示"哪些模块未测 / 分数分布"。
3. **复习提醒**：基于 `progress[id].lastAt` 与 `exam` 成绩，在首页推荐"N 天前学过、未做检测"的课时——纯前端可实现，无需推送。
4. **结业产出**：把 8 个项目的成果汇总导出为一份 Markdown/HTML 报告（当前只有单项目 `.txt`）。
5. **笔记与课时双向跳转**：已具备（笔记链接回课时），可补"课时页显示本节历史笔记数量"。

### 11.5 若要引入账号与云同步（谨慎）

结论先说：**只有在确有多设备/付费需求时才做这一步**，否则会把零运维项目变成需要运维的项目。

若要做，推荐路线：
1. 后端选型二选一：
   - **A｜托管 BaaS**（Supabase / Firebase 类）：几天可跑通登录 + 表同步，代价是引入外部依赖与供应商锁定。
   - **B｜自建轻后端**（Node/Go + PostgreSQL）：可控、可迁移，代价是运维、备份、安全全部自负。
2. 迁移策略必须是"本机优先 + 可选云同步"：`localStorage` 仍是唯一可信源，云端做备份与合并；否则老用户升级后数据会被空云端覆盖。
3. 冲突合并需要 `updatedAt` 版本字段，并对 `progress`（可合并取并集）与 `noteBook`（需保留双份）分别处理。
4. 引入账号即涉及个人信息，需要隐私政策与数据删除能力（**当前项目完全没有相关法务文本**）。

### 11.6 工程化与质量建议

| 建议 | 理由 |
|---|---|
| 在 `gba/` 加 `package.json`（仅 devDependencies: puppeteer-core），加 `"test": "node tools/validate.js"` | 当前 `browser_test.js` 依赖父目录，clone 后不可用 |
| 测试脚本改读环境变量（`CHROME_PATH`、`BASE_URL`），带默认值 | 消除硬编码 |
| 加 GitHub Actions：push 时跑 `validate.js`，失败阻断 | 内容型项目最容易出的错是结构破坏，此检查零成本 |
| 给 `router.dispatch()` 加 try/catch + 错误视图 | 避免单点数据错误导致白屏 |
| 修 `lesson.js` 的监听器泄漏 | 见 7.3-1，长期使用会累积 |
| 给讲义页补 `@media print` | 学习者打印/存 PDF 的常见需求，成本极低 |
| 不要引入 ESLint/Prettier 的强约束 | 代码量小（约 2000 行 JS），成本大于收益；但可加一份 `.editorconfig` 统一换行 |

### 11.7 内容时效维护（项目最大长期风险）

平台规则与界面变动极快，这是本项目的核心风险，也是它区别于"网上抄来的课程"的地方。维护机制已内建：

- `docs/SOURCES.md` 有 16 条平台规则时效核查表，每条含"旧说法 → 当前口径 → 依据类型"，核查日期 2026-11-24。
- 讲义中所有平台参数采用"当前值 + 查询入口 + 变更史"三件套，不写死界面路径。
- **建议每 6 个月做一次全量复核**：优先复核 IG 标签数量、Meta Advantage+ 结构、YouTube 变现门槛、TikTok 美国市场状态、LinkedIn 排序机制、Cookie/追踪现状这 6 项（变动最频繁）。复核后同步更新 `sources.js`（页面数据）与 `SOURCES.md`（文档基线）两处，避免不一致。
- 新增内容时，`src` 字段必须写清依据与核查月份，不能留空或写"经验"了事。

---

## 12. 待确认事项

| # | 事项 | 现状 | 需要谁确认 |
|---|---|---|---|
| 1 | 项目负责人 / 后续维护者 | 代码中无署名、无 LICENSE、无 CONTRIBUTORS | 项目所有者 |
| 2 | GitHub 仓库所有权与协作方式 | 现属个人账号 `x13502239474-oss`，public | 项目所有者（是否需要转组织、是否加协作者） |
| 3 | 是否需要自定义域名 | 当前无 `CNAME`，使用 `*.github.io` 子域 | 项目所有者 |
| 4 | 目标用户规模与是否要账号体系 | 完全无用户系统 | 产品决策 |
| 5 | 学时配比是否要对齐 55/30/10/5 | 现为 66/16/11/6，已在页面与文档说明原因 | 产品决策（若要对齐，需扩营销模块到约 20 节） |
| 6 | 14 份教材 PDF 的原件位置与授权 | 仓库内只有抽取的目录文本（父目录 `data/sources/`），PDF 原件不在仓库 | 项目所有者 |
| 7 | 移动端固定操作条的期望行为 | 当前常驻底部并遮挡内容（问题 5） | 产品/设计决策 |
| 8 | 课时页正文行宽是否需要收窄 | 现为 1080px 容器内约 40 字/行，曾讨论是否收窄 | 产品/设计决策 |
| 9 | 无障碍是否要达到 WCAG AA | 现仅做了图标 `aria-hidden` 与语义化标签 | 产品决策 |
| 10 | 是否需要深色主题 | 2.0 已移除，`settings.theme` 被强制 `light` | 产品决策 |
| 11 | 父目录里 1.x 遗留测试脚本是否保留 | `../tools/`（`smoke_test.js`、`mobile_test.js`、`live_check.js`、`validate_content.js`、`probe_*.py`）为 1.x 时代产物，已不适用 | 项目所有者 |
| 12 | 旧 token 是否已撤销 | 会话中曾明文出现 | 项目所有者（**务必处理**） |

---

## 13. 交接核对清单

接手方按此顺序验证环境是否可用：

- [ ] `python -m http.server 8099` 后打开首页，能看到「把国际社媒，做成能带给客户的经营能力」与 10 个模块卡
- [ ] `node tools/validate.js` 输出 `0 个错误，0 个提示`，正文合计 383,372 字
- [ ] 浏览器控制台 `GBA.data.totalLessons` === 84，`Object.keys(GBA.data.lessons).length` === 84
- [ ] 进入任一课时，7 个段落带 01–07 序号，右侧（≥1180px）有目录且滚动高亮
- [ ] 点「标记本节学完」后刷新页面，状态保持（说明 `gba_state` 正常写入）
- [ ] 案例库筛选、收藏；实战项目勾选交付物并保存成果；模块检测交卷看解析
- [ ] 窗口缩到 390px 宽，无横向滚动条，底部出现 5 项标签栏
- [ ] 线上地址可访问，标题为 `GLOBAL BUSINESS ACADEMY 2.0`
- [ ] 读懂 `js/data/modules.js` → 知道加一节课只需改两个文件
- [ ] 读过 `docs/SOURCES.md` 的内容纪律，知道写内容时的三级陈述要求

---

## 附：一句话结论

这是一个**内容驱动、零依赖、无后端、零构建**的静态学习平台：代码量很小（约 2000 行 JS + 600 行 CSS），复杂度集中在 38 万字的内容与一套事实纪律上。接手后要守住三件事——**课时 id 与 7 段结构不动、store 的 schema 迁移不破、内容不编造**；其余（样式、布局、搜索、闭环功能）都可以放心往前推。
