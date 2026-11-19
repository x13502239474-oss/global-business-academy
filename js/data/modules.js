/* 八大模块 + 章节树（教材映射见 data/sources/SOURCES.md）*/
(function (G) {
  // 每条 lesson: {id, t(标题), en, src(来源), mins, body存在 lessons.js, quiz存在 questions.js}
  const M = [
    {
      id: 'M01', code: 'MODULE 01', icon: 'globe', color: 'blue',
      title: '全球商业基础与市场认知', en: 'Global Business Fundamentals',
      desc: '建立对全球商业环境的整体认识',
      goal: '理解全球商业运行的基本逻辑，掌握国际贸易为何发生、如何演进，以及全球价值链与供应链如何组织。',
      chapters: [
        { id: 'm01-1', t: '全球商业的概念与演进', en: 'The Concept of Global Business', src: 'S1 Ch1 · S4 Ch1', mins: 12 },
        { id: 'm01-2', t: '国际贸易的发展历史', en: 'History of International Trade', src: 'S1 Ch1', mins: 10 },
        { id: 'm01-3', t: '全球化与经济一体化', en: 'Globalization & Integration', src: 'S1 Ch10 · S4 Ch2', mins: 12 },
        { id: 'm01-4', t: '国际分工与比较优势', en: 'Division of Labor & Comparative Advantage', src: 'S1 Ch2 · S4 Ch2', mins: 16, lab: 'comparative-adv' },
        { id: 'm01-5', t: '全球价值链与供应链', en: 'Global Value Chains', src: 'S1 Ch1 · S4 Ch1', mins: 14 },
        { id: 'm01-6', t: '跨国企业与全球商业模式', en: 'MNCs & Global Business Models', src: 'S1 Ch4 · S4 Ch12', mins: 13 }
      ]
    },
    {
      id: 'M02', code: 'MODULE 02', icon: 'target', color: 'purple',
      title: '国际市场研究与商业战略', en: 'International Market Research & Strategy',
      desc: '判断一个海外市场是否值得进入',
      goal: '掌握从市场研究、宏观分析到 STP 定位与进入战略的完整决策链条，能独立完成一份海外市场研究报告。',
      chapters: [
        { id: 'm02-1', t: '国际市场研究基础', en: 'International Market Research', src: 'S4 Ch8', mins: 15 },
        { id: 'm02-2', t: 'PEST 宏观环境分析', en: 'PEST Analysis', src: 'S4 Ch2,Ch6,Ch7', mins: 14, lab: 'pest' },
        { id: 'm02-3', t: '全球市场细分与 STP', en: 'Segmentation, Targeting, Positioning', src: 'S4 Ch12,Ch16', mins: 16, lab: 'stp' },
        { id: 'm02-4', t: 'SWOT 与竞争环境分析', en: 'SWOT & Competitive Analysis', src: 'S4 Ch12', mins: 13, lab: 'swot' },
        { id: 'm02-5', t: '消费者购买行为与跨文化差异', en: 'Consumer Behavior & Culture', src: 'S4 Ch4,Ch5', mins: 15 },
        { id: 'm02-6', t: '国际市场进入战略', en: 'Market Entry Strategies', src: 'S4 Ch12', mins: 14 },
        { id: 'm02-7', t: '全球化与本土化', en: 'Globalization vs Localization', src: 'S4 Ch13', mins: 12 }
      ]
    },
    {
      id: 'M03', code: 'MODULE 03', icon: 'chart', color: 'cyan',
      title: '国际贸易理论与政策', en: 'International Trade Theory & Policy',
      desc: '理解国家为何贸易、政策如何影响贸易',
      goal: '掌握主流国际贸易理论，理解关税、非关税壁垒、WTO 与区域一体化的运作逻辑及现实影响。',
      chapters: [
        { id: 'm03-1', t: '国际贸易基本概念', en: 'Basic Concepts of Trade', src: 'S1 Ch1', mins: 11 },
        { id: 'm03-2', t: '绝对优势与比较优势理论', en: 'Absolute & Comparative Advantage', src: 'S1 Ch2', mins: 16, lab: 'comparative-adv' },
        { id: 'm03-3', t: '要素禀赋与新贸易理论', en: 'Factor Endowment & New Trade Theory', src: 'S1 Ch2', mins: 13 },
        { id: 'm03-4', t: '关税与非关税壁垒', en: 'Tariffs & Non-Tariff Barriers', src: 'S1 Ch6,Ch7', mins: 15, lab: 'tariff' },
        { id: 'm03-5', t: 'WTO 规则与区域经济一体化', en: 'WTO & Regional Integration', src: 'S1 Ch9,Ch10', mins: 14 },
        { id: 'm03-6', t: '国际贸易争端', en: 'Trade Disputes', src: 'S1 Ch9 · S4 Ch2', mins: 11 }
      ]
    },
    {
      id: 'M04', code: 'MODULE 04', icon: 'ship', color: 'orange',
      title: '国际贸易实务与跨境交易', en: 'International Trade Operations',
      desc: '完整掌握一笔国际贸易订单的生命周期',
      goal: '按真实交易顺序走通从出口准备、客户开发、报价谈判、签约、履约、结算到售后的全流程，重点掌握 Incoterms 2020。',
      chapters: [
        { id: 'm04-1', t: '出口前准备：产品、供应商与成本', en: 'Pre-export Preparation', src: 'S2 Introduction · S1 Ch12,Ch15', mins: 15 },
        { id: 'm04-2', t: '海外客户开发与询盘获取', en: 'Customer Development & Inquiry', src: 'S2 · S4 Ch19', mins: 14 },
        { id: 'm04-3', t: '询盘处理与报价策略', en: 'Inquiry Handling & Quotation', src: 'S2 Ch5 · S1 Ch15', mins: 16, lab: 'fob' },
        { id: 'm04-4', t: 'Incoterms 2020 全解', en: 'Incoterms 2020', src: 'S2 Ch1 · S1 Ch11', mins: 20, lab: 'incoterms' },
        { id: 'm04-5', t: '商务谈判与合同签订', en: 'Negotiation & Contract', src: 'S2 Ch10 · S4 Ch19', mins: 16 },
        { id: 'm04-6', t: '订单履行：运输、保险与单据', en: 'Order Fulfillment', src: 'S2 Ch3,Ch4,Ch11', mins: 17 },
        { id: 'm04-7', t: '国际结算：T/T、L/C、D/P、D/A', en: 'International Payment', src: 'S2 Ch6,Ch7', mins: 18, lab: 'lc' },
        { id: 'm04-8', t: '商品检验、索赔与争议处理', en: 'Inspection, Claims & Disputes', src: 'S2 Ch8,Ch9', mins: 13 }
      ]
    },
    {
      id: 'M05', code: 'MODULE 05', icon: 'megaphone', color: 'pink',
      title: '国际市场营销与品牌战略', en: 'International Marketing & Branding',
      desc: '在不同国家和文化环境下经营品牌与产品',
      goal: '掌握全球品牌战略、跨文化营销与国际 4P 决策，能分析品牌如何在不同国家定位与本土化。',
      chapters: [
        { id: 'm05-1', t: '国际营销基础', en: 'Foundations of International Marketing', src: 'S4 Ch1', mins: 12 },
        { id: 'm05-2', t: '全球品牌战略', en: 'Global Brand Strategy', src: 'S4 Ch13', mins: 14 },
        { id: 'm05-3', t: '跨文化营销与消费者心理', en: 'Cross-cultural Marketing', src: 'S4 Ch4,Ch5', mins: 15 },
        { id: 'm05-4', t: '国际产品与定价策略', en: 'Product & Pricing Strategy', src: 'S4 Ch13,Ch18', mins: 16, lab: 'roi' },
        { id: 'm05-5', t: '国际分销渠道', en: 'International Distribution', src: 'S4 Ch15', mins: 13 },
        { id: 'm05-6', t: '全球品牌传播与本土化', en: 'Global Communication & Localization', src: 'S4 Ch16', mins: 14 },
        { id: 'm05-7', t: '国际营销效果评估', en: 'Marketing Effectiveness', src: 'S4 Ch16 · S3 Ch11', mins: 12 }
      ]
    },
    {
      id: 'M06', code: 'MODULE 06', icon: 'network', color: 'purple',
      title: '海外社交媒体营销', en: 'Global Social Media Marketing',
      desc: '用海外社媒获取流量、建立品牌、开发客户',
      goal: '掌握以 Tuten 四大社交区域为骨架的社媒营销体系，能制定平台策略、内容计划、广告投放与数据评估方案。',
      chapters: [
        { id: 'm06-1', t: '社交媒体营销环境与理论', en: 'The Social Media Environment', src: 'S3 Ch1', mins: 14 },
        { id: 'm06-2', t: '社交消费者与用户行为', en: 'Social Consumers', src: 'S3 Ch2', mins: 13 },
        { id: 'm06-3', t: '四大社交区域框架', en: 'The Four Zones of Social Media', src: 'S3 Ch6-9', mins: 17 },
        { id: 'm06-4', t: '社交战略与战术规划', en: 'Strategy & Tactical Planning', src: 'S3 Ch4,Ch5', mins: 15 },
        { id: 'm06-5', t: '平台专题：Facebook / Instagram', en: 'Meta Platforms', src: 'S3 Ch6,Ch7', mins: 16 },
        { id: 'm06-6', t: '平台专题：TikTok / YouTube', en: 'TikTok & YouTube', src: 'S3 Ch7,Ch8', mins: 16 },
        { id: 'm06-7', t: '平台专题：LinkedIn B2B', en: 'LinkedIn for B2B', src: 'S3 Ch6', mins: 13 },
        { id: 'm06-8', t: '内容营销、UGC 与网红营销', en: 'Content, UGC & Influencers', src: 'S3 Ch3,Ch7', mins: 15 },
        { id: 'm06-9', t: '社交媒体广告与 A/B 测试', en: 'Social Ads & A/B Testing', src: 'S3 Ch5,Ch11', mins: 14 },
        { id: 'm06-10', t: '社媒数据分析与核心指标', en: 'Analytics & Metrics', src: 'S3 Ch10,Ch11', mins: 15, lab: 'roi' }
      ]
    },
    {
      id: 'M07', code: 'MODULE 07', icon: 'trend', color: 'green',
      title: '跨境商业增长与数字经营', en: 'Cross-border Business Growth',
      desc: '把贸易、营销与数字渠道整合为可持续经营',
      goal: '理解跨境电商模式、平台与独立站运营，掌握获客成本、客户生命周期价值、利润与现金流等核心经营指标。',
      chapters: [
        { id: 'm07-1', t: 'B2B 与 B2C 商业模式', en: 'B2B & B2C Models', src: 'S2 · S4 Ch14', mins: 12 },
        { id: 'm07-2', t: '跨境电商平台：Amazon / Alibaba', en: 'Marketplaces', src: 'S2 Ch12', mins: 14 },
        { id: 'm07-3', t: '独立站与 Shopify', en: 'DTC & Shopify', src: 'S2 Ch12', mins: 13 },
        { id: 'm07-4', t: '跨境支付、物流与海外仓', en: 'Payments, Logistics & Warehousing', src: 'S2 Ch3,Ch6,Ch12', mins: 15 },
        { id: 'm07-5', t: '获客成本与客户生命周期价值', en: 'CAC & LTV', src: 'S3 Ch11', mins: 14, lab: 'cac-ltv' },
        { id: 'm07-6', t: '跨境利润模型与盈亏平衡', en: 'Profit Model & Break-even', src: 'S1 Ch15 · 公开公式', mins: 16, lab: 'profit' },
        { id: 'm07-7', t: '现金流与库存周转', en: 'Cash Flow & Inventory', src: '公开公式', mins: 13, lab: 'cashflow' },
        { id: 'm07-8', t: '企业国际化经营', en: 'Internationalizing the Firm', src: 'S4 Ch12 · S1 Ch4', mins: 12 }
      ]
    },
    {
      id: 'M08', code: 'MODULE 08', icon: 'brain', color: 'cyan',
      title: '国际商业案例与综合实战', en: 'Global Business Case Studies & Practice',
      desc: '整合前七个模块的知识完成真实商业模拟',
      goal: '通过三个递进的综合项目，把市场研究、贸易实务、营销获客与经营管理整合为可落地的商业方案。',
      chapters: [
        { id: 'm08-1', t: '案例分析方法论', en: 'Case Analysis Method', src: 'S3 Ch12 · S4 Case', mins: 11 },
        { id: 'm08-2', t: '项目A：建立一家出口贸易公司', en: 'Project A: Export Trading Co.', src: '综合 M02+M03+M04', mins: 25, sim: 'export' },
        { id: 'm08-3', t: '项目B：建立一个海外品牌', en: 'Project B: Build a Global Brand', src: '综合 M05+M06', mins: 25, sim: 'brand' },
        { id: 'm08-4', t: '项目C：完整跨境商业经营模拟', en: 'Project C: Full Business Sim', src: '综合 M01-M07', mins: 35, sim: 'full' },
        { id: 'm08-5', t: '从流量到订单的完整链路', en: 'Traffic-to-Order Chain', src: '综合 M04+M06+M07', mins: 20, sim: 'chain' }
      ]
    }
  ];

  // 索引
  const byId = {}, lessonById = {};
  M.forEach(mod => {
    byId[mod.id] = mod;
    mod.chapters.forEach(ch => { ch.moduleId = mod.id; lessonById[ch.id] = ch; });
  });
  const allLessons = M.flatMap(m => m.chapters);
  const totalMins = allLessons.reduce((a, c) => a + (c.mins || 0), 0);

  G.data = G.data || {};
  G.data.modules = M;
  G.data.moduleById = byId;
  G.data.lessonById = lessonById;
  G.data.allLessons = allLessons;
  G.data.totalLessons = allLessons.length;
  G.data.totalMins = totalMins;
})(window.GBA = window.GBA || {});
