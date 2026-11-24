/* 资料来源与时效核查（核查日期 2026-11-24）
   详见 docs/SOURCES.md */
(function (G) {
  const S = {
    books: [
      { name: 'Digital Marketing', author: 'Dave Chaffey 等', year: '2019（第 7 版）', rating: 'A',
        use: '数字营销整体框架：RACE 客户生命周期、线上价值主张（OVP）、环境分析、媒介组合、转化路径设计',
        skip: '全部平台章节（2019 年生态：无短视频、无第一方数据、无生成式 AI 语境）' },
      { name: 'Facebook und Instagram Ads für Dummies', author: 'Daniel Levitan', year: '2024（德文）', rating: 'A',
        use: '覆盖现行 Meta 广告结构的底本：目标体系、Advantage+ 自动化、Pixel 与 Conversions API 配合、再营销、素材与版位',
        skip: '德文语境的法务税务段落、具体后台按钮路径、德国市场渠道判断' },
      { name: 'The YouTube Formula', author: 'Derral Eves', year: '2021', rating: 'A',
        use: '推荐系统的原理级解释：分发面差异、点击率与观看时长双轮、"打包"（标题+封面）思维、数据读法与纠偏',
        skip: 'Shorts 策略（2021 年尚未成形，全书未涉及）；创作者收益的具体门槛数字' },
      { name: 'International Marketing, 18ed', author: 'Cateora 等', year: '2020', rating: 'B',
        use: '跨文化消费者洞察、市场进入与标准化/适应化之争、国际调研与谈判差异、STP 与品牌决策体系',
        skip: '非数字化的传统分销与贸易章节；以拉美为主的大量案例（作对照，不作主线）' },
      { name: 'Social Selling', author: 'Tim Hughes', year: '2020', rating: 'B',
        use: 'B2B 采购已转向"先自我研究、后接触销售"；社会邻近度；个人专业形象作为销售资产；内容—互动—商机关系链',
        skip: 'LinkedIn 当年的界面操作与算法特征（排序已重建）；Twitter 时代的话术' },
      { name: 'The Ultimate SMM Workbook for Business Owners', author: 'Zara Flint', year: '2026（自助出版）', rating: 'B',
        use: '内容支柱映射、周批量生产、跨平台改写链条、私信三段式应答、月度利润复盘表',
        skip: '"算法信号权重清单"（民间经验，已降格为待验证假设）；各类"最佳发布时间"结论' },
      { name: 'Ultimate Guide to Social Media Marketing', author: 'Eric Butow', year: '2020', rating: 'B',
        use: '社媒策略规划顺序（目标—受众—平台—内容—衡量）、账号人格与社区治理、危机应对原则',
        skip: 'IGTV（2022 年已下线）、Twitter 时代操作、各平台后台路径、2020 年人口数据' },
      { name: 'Instagram For Dummies', author: 'Butow / Walker / Herman', year: '较新版本', rating: 'B',
        use: '作为操作参考手册：账号设置、专业账号与洞察入口、Reels 与 Stories 的功能边界、私信礼仪',
        skip: '逐步点击式教学（UI 变动快，须当期核对）；未覆盖 Trial Reels 等新功能' },
      { name: 'Instagram: Smart Content Strategies Using AI', author: 'Anthony Pringle', year: '2026（自助出版）', rating: 'B',
        use: '把算法讲成零基础语言（分发是分阶段测试、奖励表现而非努力）；垂类选择与内容人格表达',
        skip: '作为权威来源引用（无出处）；任何具体数字与"30 天起号"承诺' },
      { name: 'How to Get Traffic to Your Digital Products', author: 'Xohir', year: '2026（自助出版）', rating: 'C',
        use: '两个观念：流量必须在产品设计阶段规划；数字产品四类购买动机（省时／省钱／解题／情绪）',
        skip: '十几渠道各写一章的清单式结构；Etsy / KDP / Gumroad 的规则细节' },
      { name: 'Menghasilkan Uang dari TikTok', author: 'Ahdiana Wahyu D.K.', year: '2026（印尼文）', rating: 'C',
        use: '"变现形态地图"：创作者激励、联盟、直播带货、广告（含 Spark Ads）的分类方式',
        skip: '印尼市场具体政策、佣金比例、平台准入；操作步骤' },
      { name: 'International Marketing: An Introductory Study', author: '—', year: '2008（2023 重印）', rating: 'C',
        use: '基本不用：扫描版可提取文本极少，内容与 Cateora 高度重叠且体系与案例质量更低',
        skip: '全部（如需国际营销理论，直接用 Cateora）' },
      { name: 'Social Media Marketing Mastery', author: 'Gary Clyne', year: '2019', rating: 'X',
        use: '无',
        skip: 'IGTV、Twitter 运营与广告、"最佳发布时间"表、批量涨粉技巧——多数失效或违规' },
      { name: 'Stolen Nights（小说）', author: 'A. B. Jackson', year: '2026', rating: 'X',
        use: '无（与课程目标无关）',
        skip: '全部' }
    ],
    checks: [
      { topic: 'Instagram 标签数量', old: '每帖 30 个，越多曝光越好', now: '2025-12-18 起每条内容最多 5 个；官方理由为"更少、更精准"。超限后无法发布。', basis: 'official' },
      { topic: '标签的作用', old: '标签是主要发现渠道，堆标签能提升触达', now: '标签只承担"分类"作用，不直接带来触达；发现更依赖正文关键词、屏幕文字与音频。', basis: 'multi' },
      { topic: 'Instagram 排序信号', old: '点赞、评论、收藏都是核心信号', now: '官方口径三项为观看时长、按触达计的点赞、按触达计的转发；Feed / Reels / Stories / Explore 各自独立排序。', basis: 'multi' },
      { topic: '转发权重倍数', old: '转发权重是点赞的 3–5 倍', now: '官方从未公布任何权重倍数，所有倍数为第三方推演。', basis: 'unv' },
      { topic: '"前 90 分钟定生死"', old: '首小时数据决定是否继续推流', now: '官方无此表述；短视频分发会在数天内逐步展开。', basis: 'unv' },
      { topic: '跨平台搬运', old: '多平台同步、搬运热门内容是增长技巧', now: '原创性政策收紧：带其他平台水印内容降权；一定期限内多次发布非原创内容可被移出推荐。', basis: 'multi' },
      { topic: 'Meta 广告结构', old: '按兴趣/人群拆多个广告组，精细定向逐组优化', now: '转化类目标默认倾向 Advantage+ 结构；定向在多数目标下退化为"建议"，仅地区、语言、最低年龄、排除名单为硬约束。', basis: 'multi' },
      { topic: 'Meta 检索与排序', old: '（旧教材无此概念）', now: '2024-12 起检索系统先从海量候选广告中筛出少量进入排序——素材不够多样就没有被选中机会。', basis: 'multi' },
      { topic: '学习期阈值', old: '广告组一周约需 50 次转化', now: '数值仍是行业经验，官方未以统一数字承诺；不同目标阈值不同。', basis: 'est' },
      { topic: '线索广告数据回传', old: '（旧教材无此要求）', now: '特定线索目标须接入 Conversions API；离线转化 API 已停用，数据统一经 CAPI 上传。', basis: 'multi' },
      { topic: 'YouTube 变现门槛', old: '1000 订阅 + 4000 小时观看即可开通', now: '双档制：500 订阅 +（3000 小时／3M Shorts 观看）与 1000 订阅 +（4000 小时／10M Shorts 观看）；门槛历史上多次调整，且将继续上调。', basis: 'official' },
      { topic: 'Shorts', old: '（YouTube 类教材基本未涉及）', now: 'Shorts 已是独立分发面与独立分成池，与长视频是两套逻辑。', basis: 'official' },
      { topic: 'TikTok 美国政策', old: '面临禁令、前景不明', now: '2026-01 美国业务重组完成，成立合资实体运营数据保护、算法安全与内容审核；2026-08 美方撤销联邦设备使用禁令。风险从"是否被封"转为"运营主体与数据治理变化"。', basis: 'official' },
      { topic: 'X（原 Twitter）', old: 'Twitter 广告类型与话题标签打法', now: '平台已更名 X；广告平台按新的检索与排序体系重建；AI 辅助进入广告后台并用于品牌安全判定；同时收紧对搬运内容与"互动诱导"的政策。', basis: 'multi' },
      { topic: 'LinkedIn 排序', old: '按人脉关系与关键词匹配分发', now: '检索改为语义匹配，排序读取用户历史互动序列；官方点名降权互动诱导、互赞群组、自动化评论与"缺乏观点的通用 AI 内容"。', basis: 'multi' },
      { topic: '第三方 Cookie 与衡量', old: 'Cookie 将消失，需全面转向新方案', now: '浏览器侧并未全面弃用，但信号流失未停止（浏览器限制、ATT、拦截、同意率）；同意模式在欧盟/英国已强制。衡量应做第一方数据 + 服务端回传 + 建模转化三层。', basis: 'multi' }
    ],
    conflicts: [
      { q: '冲突一：标签到底有没有用？', detail: '三种立场并存：策略性标签派、"标签已死"派、官方"帮助被找到但不提升触达"。三者并不矛盾，只是描述不同层面。', use: '标签决定你"有资格被搜到"，内容表现决定"被推给多少人"。课程采用 5 个以内精准标签 + 正文写清关键词。' },
      { q: '冲突二：发布频率与最佳时间', detail: '旧书给出具体时段表；官方主张"一致性优先于数量"。时段表既无官方依据，也无法跨时区、跨行业迁移。', use: '产能决定频率，一致性优先；用自己的 8 周数据做发布时间—触达散点，而不是背别人的表。' },
      { q: '冲突三：算法是信号清单还是表现竞赛？', detail: '民间给出权重排序清单；官方只确认信号类型，不公布权重。', use: '清单只能作假设，不能作知识。教学顺序：先讲机制（小范围测试→观察→扩大），再讲被观察的表现类型。' },
      { q: '冲突四：先涨粉还是先成交？', detail: '粉丝增长派、触达转化派、B2B 精准派各有适用场景。', use: '取决于商业模式：内容电商走触达→转化；B2B 走精准触达→信任→商机；个人 IP 才需要粉丝量作资产。粉丝数在部分模式下是虚荣指标。' },
      { q: '冲突五：单平台深耕还是全平台铺开？', detail: '多平台铺开的前提是已有稳定内容生产线与分工；个人或小团队同时运营四个平台会全部达不到分发门槛。', use: '"1 主 + 1 辅"：主平台承担策略与产能，辅平台只做改写分发。' },
      { q: '冲突六：AI 是加速器还是减分项？', detail: '新书把 AI 当默认工具；平台侧在收紧，降权"缺乏观点的通用 AI 内容"，并要求合成内容标注。', use: 'AI 用于扩写、改写、变体、字幕、初稿，不代替判断与经验；合成内容按平台规则披露。' }
    ],
    official: [
      { platform: 'X', entries: 'Help Center 的账号、验证与安全条目；Rules and Policies（含垃圾信息与自动化）；X Business 的广告产品文档' },
      { platform: 'Facebook / Meta', entries: 'Meta Business Help Center 的资产与权限、广告结构与 Advantage+ 说明；广告政策；开发者文档中的 Conversions API' },
      { platform: 'YouTube', entries: 'YouTube Help 的频道、元数据与 Shorts 说明；创作者文档中的点击率与观看时长；合作伙伴计划门槛页；版权与 reused content 政策' },
      { platform: 'TikTok', entries: 'TikTok Newsroom 的政策公告；TikTok Academy 的创作与广告课程；Business Help Center；社区准则与商业内容政策' },
      { platform: 'Instagram', entries: 'Instagram Help Center 的标签、排序与搜索说明；专业账号与洞察；品牌内容工具；合成内容标注政策' },
      { platform: 'LinkedIn', entries: 'LinkedIn Help 的主页与搜索说明；Marketing Solutions 的广告文档；工程博客的排序机制说明；用户协议中的自动化限制' }
    ],
    discipline: [
      '区分三类陈述：官方规则（可核对）／行业经验（标注"非官方规则"）／教学示例（标注"教学示例"）。',
      '不编造数据：不写未经核实的粉丝数、增长率、营收、转化率倍数、算法权重系数。',
      '不写死会过期的界面路径：写"入口位置 + 判断标准"，不写"点第几个按钮"。',
      '平台参数统一呈现为三件套：当前值 + 查询入口 + 变更史。',
      '经典理论长期有效（RACE、STP、4P、霍夫斯泰德、AIDA、社会证明），不因出版早而弃用。',
      '不搬运教材原文：用自己的话重组，标注来源，不大段照抄。'
    ]
  };

  G.data = G.data || {};
  G.data.sources = S;
})(window.GBA = window.GBA || {});
