/* ============================================================
   课程注册表 v2 —— 国际社交媒体运营与海外市场营销
   结构：10 模块 / 84 节
   教学配比（按建议学时）：社媒 55% · 国际营销 30% · 国际贸易 10% · 检测与实战 5%
   教材映射与时效核查见 docs/SOURCES.md
   ============================================================ */
(function (G) {
  // 每条 chapter: {id, t(标题), en, src(内容依据), mins, tag(教学方向)}
  const M = [
    {
      id: 'S0', code: 'MODULE 01', icon: 'compass', color: '#2563EB',
      title: '全球社媒运营基础', en: 'Foundations of Global Social Media Operations',
      desc: '在进入六个平台之前，先建立可迁移的判断力',
      weight: '公共基础',
      goal: '建立平台运营的通用底层认知：不同平台的生态位与适配条件、推荐系统如何决定分发、账号与资产如何搭建、内容如何形成可持续的生产系统、冷启动的增长路径、指标如何映射到商业结果、以及合规边界在哪里。学完后你应当能够为任一品类选择主辅平台，并解释"为什么这样选"。',
      chapters: [
        { id: 's0-1', t: '全球社媒格局与平台选择', en: 'The Global Social Landscape', src: '各平台官方资料 · Chaffey 数字营销框架', mins: 26 },
        { id: 's0-2', t: '推荐系统如何分发内容', en: 'How Recommendation Systems Distribute Content', src: '平台官方排序说明 · Eves 推荐机制原理', mins: 28 },
        { id: 's0-3', t: '账号体系、资产归属与安全', en: 'Account Systems, Asset Ownership & Security', src: '各平台帮助中心（核对 2026-11）', mins: 26 },
        { id: 's0-4', t: '内容生产系统：从灵感到流水线', en: 'Building a Content Production System', src: 'Flint 内容支柱与批产方法 · 平台官方最佳实践', mins: 28 },
        { id: 's0-5', t: '冷启动与增长路径', en: 'Cold Start & Growth Paths', src: '平台官方创作者指南 · 行业公开实践', mins: 26 },
        { id: 's0-6', t: '指标树：从互动到商业结果', en: 'Metric Trees: From Engagement to Revenue', src: 'Chaffey RACE 框架 · 平台分析文档', mins: 28 },
        { id: 's0-7', t: '合规边界：官方规则与行业经验的分界', en: 'Compliance: Official Rules vs. Field Practice', src: '各平台社区准则与广告政策（核对 2026-11）', mins: 24 }
      ]
    },
    {
      id: 'SX', code: 'MODULE 02', icon: 'x', color: '#334155',
      title: 'X（原 Twitter）运营', en: 'Operating on X',
      desc: '国际信息传播、行业话语权与 B2B 获客',
      weight: '社媒 55%',
      goal: '掌握 X 的信息传播逻辑：用短帖与 Thread 建立行业观点、用搜索与列表找到决策人、用私信完成从公开触达到一对一沟通的过渡。学完能独立运营一个面向海外行业的专业账号，并解释每条内容为什么这样写。',
      chapters: [
        { id: 'x-1', t: 'X 平台认知：从 Twitter 到 X', en: 'Understanding X', src: 'X Help Center · X Business（核对 2026-11）', mins: 24 },
        { id: 'x-2', t: '账号定位与专业主页建设', en: 'Profile & Positioning', src: 'X Help Center 账号与验证规则', mins: 24 },
        { id: 'x-3', t: '推文写作与英文表达', en: 'Writing Posts in English', src: '平台格式规则 · 英文文案通识', mins: 26 },
        { id: 'x-4', t: 'Thread 长推文与观点传播', en: 'Threads & Idea Diffusion', src: '平台机制 · 公开传播学框架', mins: 28 },
        { id: 'x-5', t: '增长：搜索、话题与行业互动', en: 'Growth: Search, Topics & Community', src: 'X 搜索语法文档 · 公开运营实践', mins: 26 },
        { id: 'x-6', t: 'B2B 获客与私信转化', en: 'B2B Prospecting & DM Conversion', src: 'Hughes 社交销售框架 · X 私信规则', mins: 28 },
        { id: 'x-7', t: 'X Ads 与付费推广基础', en: 'X Ads Fundamentals', src: 'X Business 广告文档（核对 2026-11）', mins: 24 },
        { id: 'x-8', t: '规则、自动化与账号安全', en: 'Rules, Automation & Account Safety', src: 'X Rules · 自动化与垃圾信息政策', mins: 22 }
      ]
    },
    {
      id: 'SF', code: 'MODULE 03', icon: 'facebook', color: '#1877F2',
      title: 'Facebook 企业营销', en: 'Facebook for Business',
      desc: '企业主页、社群运营与 Meta 广告的完整链路',
      weight: '社媒 55%',
      goal: '掌握 Meta 生态的企业侧运营：主页与商业资产的正确搭建、内容与社群的双轮驱动、以及从广告结构到转化追踪的完整投放链路。学完能独立搭建一个合规的企业主页，并写出可执行的 Meta 投放方案。',
      chapters: [
        { id: 'fb-1', t: 'Facebook 与 Meta 生态认知', en: 'The Meta Ecosystem', src: 'Meta Business Help Center（核对 2026-11）', mins: 24 },
        { id: 'fb-2', t: '主页与商业资产搭建', en: 'Pages & Business Assets', src: 'Meta 商业资产与权限文档', mins: 26 },
        { id: 'fb-3', t: '内容运营与 Reels', en: 'Content Operations & Reels', src: 'Meta 内容与 Reels 官方指南', mins: 26 },
        { id: 'fb-4', t: '社群运营与 Messenger', en: 'Groups & Messenger', src: 'Meta 群组与消息政策', mins: 26 },
        { id: 'fb-5', t: 'Meta 广告：结构、目标与预算', en: 'Meta Ads Structure & Budget', src: 'Meta 广告管理文档 · Levitan 结构底本', mins: 28 },
        { id: 'fb-6', t: '受众、素材与 Advantage+', en: 'Audience, Creative & Advantage+', src: 'Meta Advantage+ 与素材政策', mins: 28 },
        { id: 'fb-7', t: '转化追踪：Pixel、CAPI 与再营销', en: 'Pixel, CAPI & Retargeting', src: 'Meta 转化 API 文档 · 隐私合规说明', mins: 26 },
        { id: 'fb-8', t: '独立站引流实战与广告政策风险', en: 'Driving Traffic to DTC & Ad Policy Risk', src: 'Meta 广告政策 · 电商投放公开实践', mins: 26 }
      ]
    },
    {
      id: 'SY', code: 'MODULE 04', icon: 'youtube', color: '#DC2626',
      title: 'YouTube 视频营销', en: 'YouTube Marketing & Channel Growth',
      desc: '搜索与推荐双引擎下的长视频与 Shorts',
      weight: '社媒 55%',
      goal: '理解 YouTube 的两套分发逻辑：搜索意图与推荐流的差别、点击率与观看时长的双轮机制、长视频与 Shorts 的不同考核标准。学完能完成频道定位、英文脚本、缩略图与元数据设计，并用 Studio 数据做诊断。',
      chapters: [
        { id: 'yt-1', t: '平台认知：搜索与推荐双引擎', en: 'Search + Recommendation', src: 'YouTube Help · Creator 官方文档（核对 2026-11）', mins: 26 },
        { id: 'yt-2', t: '频道定位与频道建设', en: 'Channel Positioning & Setup', src: 'YouTube 频道与验证文档', mins: 24 },
        { id: 'yt-3', t: '选题与英文视频脚本', en: 'Topic Selection & Scripts', src: 'Eves 打包与选题方法 · 脚本通识', mins: 28 },
        { id: 'yt-4', t: '拍摄、剪辑与缩略图设计', en: 'Production, Editing & Thumbnails', src: 'YouTube 创作者最佳实践', mins: 26 },
        { id: 'yt-5', t: 'YouTube SEO 与元数据', en: 'YouTube SEO & Metadata', src: 'YouTube 搜索与元数据文档', mins: 26 },
        { id: 'yt-6', t: '推荐流量与数据诊断', en: 'Recommendation & Analytics', src: 'YouTube Analytics 指标文档', mins: 28 },
        { id: 'yt-7', t: 'Shorts：短视频的独立逻辑', en: 'Shorts: A Separate System', src: 'YouTube Shorts 官方说明（核对 2026-11）', mins: 24 },
        { id: 'yt-8', t: '变现、品牌合作与版权合规', en: 'Monetization, Partnerships & Copyright', src: 'YouTube 合作伙伴计划 · 版权与 reused content 政策', mins: 26 }
      ]
    },
    {
      id: 'ST', code: 'MODULE 05', icon: 'tiktok', color: '#111827',
      title: 'TikTok 短视频运营', en: 'TikTok Operations & Growth',
      desc: '短视频推荐机制、内容工程与电商变现',
      weight: '社媒 55%',
      goal: '掌握 TikTok 的内容工程方法：如何设计前三秒、如何用测试机制理解分发、如何用数据判断一条视频死在哪一秒。学完能规划一个可持续的选题库与发布节奏，并清楚 TikTok Shop 与广告在各市场的适用条件。',
      chapters: [
        { id: 'tk-1', t: '平台认知与全球市场结构', en: 'TikTok & the Global Short-video Market', src: 'TikTok Newsroom · TikTok Academy（核对 2026-11）', mins: 26 },
        { id: 'tk-2', t: '账号定位与基础建设', en: 'Account Setup & Positioning', src: 'TikTok 账号与专业账号文档', mins: 24 },
        { id: 'tk-3', t: '前三秒与短视频脚本', en: 'The First Three Seconds & Scripts', src: 'TikTok 创意最佳实践 · 公开创作方法', mins: 28 },
        { id: 'tk-4', t: '拍摄、剪辑与发布运营', en: 'Production & Publishing', src: 'TikTok 创作工具文档', mins: 26 },
        { id: 'tk-5', t: '推荐机制与冷启动', en: 'Distribution Mechanics & Cold Start', src: 'TikTok 官方分发说明 · 公开创作者经验', mins: 28 },
        { id: 'tk-6', t: '数据诊断与内容迭代', en: 'Analytics & Iteration', src: 'TikTok Analytics 指标文档', mins: 26 },
        { id: 'tk-7', t: 'TikTok Shop、联盟与广告', en: 'Shop, Affiliate & Ads', src: 'TikTok Shop 与 Ads 官方文档（按市场区分）', mins: 28 },
        { id: 'tk-8', t: '规则、地区合规与账号健康', en: 'Policy, Regional Compliance & Account Health', src: 'TikTok 社区准则与商业内容政策', mins: 24 }
      ]
    },
    {
      id: 'SI', code: 'MODULE 06', icon: 'instagram', color: '#C13584',
      title: 'Instagram 视觉营销', en: 'Instagram Visual Marketing',
      desc: '四个分发面、视觉体系与创作者合作',
      weight: '社媒 55%',
      goal: '掌握 Instagram 的分面思维：Feed、Stories、Reels、Explore 各有独立排序，内容必须按面设计。学完能建立一套可复用的视觉体系、设计 Reels 选题、用关键词而非堆标签做搜索可见性，并把互动转化为私信与成交。',
      chapters: [
        { id: 'ig-1', t: '平台认知：四个分发面与排序信号', en: 'Four Surfaces & Ranking Signals', src: 'Instagram Help Center · Mosseri 公开说明（核对 2026-11）', mins: 26 },
        { id: 'ig-2', t: '专业账号与品牌主页', en: 'Professional Account & Profile', src: 'Instagram 专业账号文档', mins: 24 },
        { id: 'ig-3', t: 'Feed 与轮播的内容规划', en: 'Feed & Carousel Planning', src: '平台格式规范 · 内容策略通识', mins: 26 },
        { id: 'ig-4', t: 'Stories 与 Reels 的差异化用法', en: 'Stories vs. Reels', src: 'Instagram 各面官方说明', mins: 28 },
        { id: 'ig-5', t: '视觉体系与设计执行', en: 'Visual System & Execution', src: '视觉设计通识 · 平台规格文档', mins: 26 },
        { id: 'ig-6', t: '搜索可见性：关键词、标签与替代文本', en: 'Search Visibility', src: 'Instagram 搜索与标签政策（2025-12 变更）', mins: 24 },
        { id: 'ig-7', t: '创作者合作与私信转化', en: 'Creator Partnerships & DM Conversion', src: '品牌内容工具文档 · Flint 私信框架', mins: 26 },
        { id: 'ig-8', t: 'Insights、投放与原创性合规', en: 'Insights, Ads & Originality', src: 'Instagram Insights 文档 · 原创性与 AI 标注政策', mins: 26 }
      ]
    },
    {
      id: 'SL', code: 'MODULE 07', icon: 'linkedin', color: '#0A66C2',
      title: 'LinkedIn B2B 客户开发', en: 'LinkedIn for B2B Business Development',
      desc: '专业主页、精准搜索、开发信与商机管理',
      weight: '社媒 55%',
      goal: '把 LinkedIn 当成一套 B2B 客户开发系统：主页是信任资产、搜索是名单入口、内容是预热、私信是推进。学完能独立完成"目标企业定位 → 决策人筛选 → 连接与开发信 → 商机跟进"的完整流程，并知道哪些动作会被平台降权。',
      chapters: [
        { id: 'li-1', t: '平台认知：B2B 生态与内容分发', en: 'The B2B Ecosystem', src: 'LinkedIn Help · 工程博客排序说明（2026-03）', mins: 26 },
        { id: 'li-2', t: '个人专业主页建设', en: 'Building a Professional Profile', src: 'LinkedIn 主页与搜索优化文档', mins: 28 },
        { id: 'li-3', t: 'Company Page 与组织内容', en: 'Company Pages & Brand Content', src: 'LinkedIn 公司主页文档', mins: 24 },
        { id: 'li-4', t: 'B2B 内容营销与个人品牌', en: 'B2B Content & Personal Brand', src: 'Hughes 社交销售 · 平台内容政策', mins: 26 },
        { id: 'li-5', t: '客户搜索：企业与决策人定位', en: 'Searching Companies & Decision Makers', src: 'LinkedIn 搜索语法文档', mins: 28 },
        { id: 'li-6', t: '连接邀请、InMail 与开发信', en: 'Invitations, InMail & Outreach', src: 'LinkedIn 消息与邀请限制政策', mins: 28 },
        { id: 'li-7', t: 'Sales Navigator 与线索管理', en: 'Sales Navigator & Pipeline', src: 'Sales Navigator 官方功能文档', mins: 26 },
        { id: 'li-8', t: 'LinkedIn Ads 基础', en: 'LinkedIn Ads Fundamentals', src: 'LinkedIn Marketing Solutions 文档', mins: 24 },
        { id: 'li-9', t: '国际商务合作、规则与合规', en: 'Partnerships, Rules & Compliance', src: 'LinkedIn 用户协议与自动化限制', mins: 24 }
      ]
    },
    {
      id: 'MK', code: 'MODULE 08', icon: 'target', color: '#0D9488',
      title: '国际市场营销理论与实战', en: 'International Marketing Theory & Practice',
      desc: '六大平台课程的理论底座',
      weight: '国际营销 30%',
      goal: '建立国际市场经营的完整决策链：看懂全球市场环境、用研究而不是直觉选市场、用定位而不是价格做差异化、理解海外消费者的决策机制、设计内容与流量结构、用指标判断投放是否有效、最后把流量变成客户与复购。',
      chapters: [
        { id: 'mk-1', t: '全球市场格局与国际营销框架', en: 'Global Markets & the Marketing Framework', src: 'Cateora 第 18 版 Ch1 · Chaffey RACE', mins: 26 },
        { id: 'mk-2', t: '国际市场环境与国别差异', en: 'Market Environments & Country Differences', src: 'Cateora Ch2–3 · 公开统计数据', mins: 26 },
        { id: 'mk-3', t: '文化差异与消费行为', en: 'Culture & Consumer Behavior', src: 'Cateora Ch4–5 · 霍夫斯泰德框架', mins: 28 },
        { id: 'mk-4', t: '目标市场选择', en: 'Selecting Target Markets', src: 'Cateora Ch8 · 公开评估方法', mins: 26 },
        { id: 'mk-5', t: '市场研究：数据源与趋势工具', en: 'Market Research & Trend Tools', src: 'Google Trends 官方说明 · 行业报告方法', mins: 28 },
        { id: 'mk-6', t: '竞争对手与目标客户研究', en: 'Competitor & Customer Research', src: 'Cateora Ch8 · 竞争分析通识', mins: 26 },
        { id: 'mk-7', t: '品牌定位与差异化', en: 'Brand Positioning & Differentiation', src: 'Cateora Ch12–13 · STP 框架', mins: 28 },
        { id: 'mk-8', t: '用户画像与品牌价值', en: 'Personas & Brand Value', src: 'Cateora Ch11–13', mins: 26 },
        { id: 'mk-9', t: '消费者决策与信任建立', en: 'Decision Making & Trust', src: 'Cateora Ch5 · 消费者行为通识', mins: 26 },
        { id: 'mk-10', t: '内容营销与品牌叙事', en: 'Content Marketing & Storytelling', src: 'Chaffey Ch6 · 内容策略通识', mins: 28 },
        { id: 'mk-11', t: '数字营销与流量结构', en: 'Digital Marketing & Traffic Structure', src: 'Chaffey Ch8–9 · 平台官方文档', mins: 28 },
        { id: 'mk-12', t: '广告指标与 A/B 测试', en: 'Ad Metrics & A/B Testing', src: 'Chaffey Ch10 · Meta/Google 指标定义', mins: 28 },
        { id: 'mk-13', t: '从流量到转化与客户经营', en: 'From Traffic to Conversion & Retention', src: 'Chaffey RACE · Flint 私信与复盘框架', mins: 28 }
      ]
    },
    {
      id: 'TR', code: 'MODULE 09', icon: 'ship', color: '#B45309',
      title: '国际贸易核心知识', en: 'Essential International Trade',
      desc: '只保留能直接用于海外接单与履约的部分',
      weight: '国际贸易 10%',
      goal: '用最短路径掌握一单跨境生意真正会遇到的商业常识：贸易术语怎么划分责任、报价怎么算才不亏、收款怎么才安全、询盘怎么接、合同与物流有哪些坑、合规红线在哪。目标不是成为报关员，而是能听懂、能判断、能对接。',
      chapters: [
        { id: 'tr-1', t: '国际贸易基本流程与参与方', en: 'Trade Flow & Parties', src: 'S1/S2 教材结构 · 公开实务资料', mins: 22 },
        { id: 'tr-2', t: 'B2B 与 B2C 商业模式', en: 'B2B vs. B2C Models', src: 'S1 Ch4 · Cateora Ch14', mins: 22 },
        { id: 'tr-3', t: 'Incoterms 2020：EXW/FOB/CIF/DDP', en: 'Incoterms 2020', src: 'ICC Incoterms 2020 官方框架', mins: 28 },
        { id: 'tr-4', t: '国际报价与成本核算', en: 'Quotation & Costing', src: 'S2 Ch5 · 公开实务方法', mins: 26 },
        { id: 'tr-5', t: '国际支付与结算方式', en: 'International Payment', src: 'S2 Ch6–7 · UCP600 框架', mins: 26 },
        { id: 'tr-6', t: '外贸询盘与报价谈判', en: 'Inquiries & Quotation', src: 'S2 Ch5 · Ch10', mins: 24 },
        { id: 'tr-7', t: '国际贸易合同基础', en: 'Contracts Fundamentals', src: 'S2 Ch10 · 公开合同实务', mins: 24 },
        { id: 'tr-8', t: '国际物流与单证', en: 'Logistics & Documents', src: 'S2 Ch3–4 · Ch11', mins: 26 },
        { id: 'tr-9', t: '进出口合规与风险', en: 'Compliance & Risk', src: '公开海关与出口管制框架', mins: 24 },
        { id: 'tr-10', t: '从社媒询盘到订单成交', en: 'From Social Inquiry to Order', src: '综合 S2 + 社媒运营方法', mins: 26 }
      ]
    },
    {
      id: 'CP', code: 'MODULE 10', icon: 'flag', color: '#15803D',
      title: '综合实战与结业项目', en: 'Capstone & Practice',
      desc: '把十个模块收束成一份能执行的方案',
      weight: '检测与实战 5%',
      goal: '通过案例方法、账号诊断、计划撰写与结业全案四个台阶，把分散的知识整合成可交付的能力。结业标准不是考试分数，而是一份能被他人执行的海外社媒营销方案。',
      chapters: [
        { id: 'cp-1', t: '案例分析方法：如何读一个账号', en: 'How to Read a Case', src: '案例库方法 · 公开分析框架', mins: 24 },
        { id: 'cp-2', t: '账号诊断：从数据到结论', en: 'Account Diagnostics', src: '平台分析指标 · 诊断方法', mins: 26 },
        { id: 'cp-3', t: '海外社媒营销计划撰写', en: 'Writing the Social Media Plan', src: '综合 S0–MK', mins: 28 },
        { id: 'cp-4', t: '结业项目：六平台营销全案', en: 'Capstone: Six-platform Plan', src: '综合全部模块', mins: 40 },
        { id: 'cp-5', t: '复盘与迭代：把项目跑起来', en: 'Review & Iteration', src: '综合 · 数据复盘方法', mins: 24 }
      ]
    }
  ];

  // 索引
  const byId = {}, lessonById = {};
  M.forEach(mod => {
    byId[mod.id] = mod;
    mod.chapters.forEach((ch, i) => {
      ch.moduleId = mod.id;
      ch.no = i + 1;
      ch.moduleColor = mod.color;
      lessonById[ch.id] = ch;
    });
  });
  const allLessons = M.flatMap(m => m.chapters);
  const totalMins = allLessons.reduce((a, c) => a + (c.mins || 0), 0);

  // 教学配比（按学时统计，用于课程页说明）
  const groupOf = { S0: 'social', SX: 'social', SF: 'social', SY: 'social', ST: 'social', SI: 'social', SL: 'social', MK: 'marketing', TR: 'trade', CP: 'practice' };
  const weights = { social: 0, marketing: 0, trade: 0, practice: 0 };
  M.forEach(m => { weights[groupOf[m.id]] += m.chapters.reduce((a, c) => a + c.mins, 0); });

  G.data = G.data || {};
  G.data.modules = M;
  G.data.moduleById = byId;
  G.data.lessonById = lessonById;
  G.data.allLessons = allLessons;
  G.data.totalLessons = allLessons.length;
  G.data.totalMins = totalMins;
  G.data.curriculumWeights = weights;
  G.data.groupOfModule = groupOf;

  // 便捷查询
  G.data.lessonsOfModule = id => (byId[id] ? byId[id].chapters : []);
})(window.GBA = window.GBA || {});
