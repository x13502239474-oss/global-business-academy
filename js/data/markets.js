/* 全球商业地图数据 —— 数据分两类：教学通用知识(结构性) + 明确标注的教学模拟数值 */
(function (G) {
  // 地图点位：x/y 为 16:9 viewBox(0 0 960 540) 上的近似坐标
  const REGIONS = [
    {
      key:'north-america', name:'North America', cn:'北美', x:190, y:170, hot:true,
      hubs:['New York','Los Angeles','Chicago','Toronto'], ports:['Los Angeles','New York','Vancouver'],
      consumers:'高消费、品牌意识强、重视评价与售后', ecom:'Amazon、Shopify 独立站成熟',
      trade:'全球最大消费市场之一，服务贸易与高科技产品出口强',
      culture:'个人主义、注重效率与合同约定、DTC 接受度高',
      entry:'市场大但竞争与合规（FTC、CPSC）要求高，建议差异化切入',
      cases:['Apple','Nike','Amazon','Shopify'],
      dataNote:'市场结构描述为教学通用知识；无实时数据。'
    },
    {
      key:'europe', name:'Europe', cn:'欧洲', x:495, y:150, hot:true,
      hubs:['London','Paris','Frankfurt','Amsterdam'], ports:['Rotterdam','Hamburg','Antwerp'],
      consumers:'注重品质、环保与隐私，理性消费', ecom:'多国分散，本地化支付方式重要',
      trade:'单一市场+关税同盟，REG GDPR/CE 等法规影响大',
      culture:'多语言多文化，环保与劳工标准高，本土化要求高',
      entry:'合规门槛高（GDPR、CE、EPR），但购买力强、客单价高',
      cases:['IKEA','Spotify','Nike','Apple'],
      dataNote:'法规与消费特征为教学通用知识；法规以官方最新文本为准。'
    },
    {
      key:'east-asia', name:'East Asia', cn:'东亚', x:790, y:185, hot:true,
      hubs:['Shanghai','Shenzhen','Tokyo','Seoul'], ports:['Shanghai','Shenzhen','Busan','Yokohama'],
      consumers:'数字化程度高、移动支付普及、迭代快', ecom:'电商与直播带货高度发达',
      trade:'全球制造与供应链核心，出口导向明显',
      culture:'集体主义与关系导向，重视口碑与平台信任',
      entry:'供应链效率高、制造能力强；Entry 需重视本地平台与社交生态',
      cases:['Alibaba','Uniqlo','Duolingo'],
      dataNote:'供应链与电商特征为教学通用知识；无实时数据。'
    },
    {
      key:'southeast-asia', name:'Southeast Asia', cn:'东南亚', x:770, y:290,
      hubs:['Singapore','Jakarta','Bangkok','Ho Chi Minh'], ports:['Singapore','Port Klang','Laem Chabang'],
      consumers:'年轻、移动优先、价格敏感、社交购物活跃', ecom:'Shopee、Lazada、TikTok Shop 增长快',
      trade:'RCEP 促进区域贸易，制造业转移承接地',
      culture:'多元宗教与语言，社群与 KOL 影响大',
      entry:'增长快、获客成本相对低；需重视社交商务与本地化支付',
      cases:['Shopee(教学示例)','TikTok Shop(教学示例)'],
      dataNote:'平台格局为教学通用知识；具体份额会变化，请以官方数据为准。'
    },
    {
      key:'middle-east', name:'Middle East', cn:'中东', x:585, y:235,
      hubs:['Dubai','Riyadh','Doha'], ports:['Jebel Ali','Dammam'],
      consumers:'高消费潜力、重视品牌与身份、宗教文化影响深', ecom:'社交电商与跨境电商活跃',
      trade:'能源出口与转口贸易枢纽，Dubai 是重要中转港',
      culture:'伊斯兰文化影响消费禁忌与营销节奏，重视关系',
      entry:'高客单与转口便利；需注意宗教合规与本地伙伴',
      cases:['IKEA(阿布扎比门店,据S4)'],
      dataNote:'文化特征为教学通用知识。'
    },
    {
      key:'latin-america', name:'Latin America', cn:'拉美', x:290, y:370,
      hubs:['São Paulo','Mexico City','Buenos Aires'], ports:['Santos','Manzanillo','Callao'],
      consumers:'价格敏感、社交活跃、分期支付常见', ecom:'Mercado Libre 等本地平台主导',
      trade:'大宗商品出口，进口替代与贸易政策波动较大',
      culture:'关系导向、家庭观念强、西语/葡语为主',
      entry:'市场潜力大但汇率与政策波动，需本地支付与物流方案',
      cases:['Netflix(区域案例,教学分析)'],
      dataNote:'区域特征为教学通用知识。'
    },
    {
      key:'africa', name:'Africa', cn:'非洲', x:500, y:330,
      hubs:['Lagos','Nairobi','Cape Town','Cairo'], ports:['Durban','Mombasa','Tangier'],
      consumers:'年轻人口、移动优先、价格敏感、现金与移动支付并存', ecom:'移动电商与社交商务增长',
      trade:'资源出口为主，区域内贸易与 AfCFTA 推进中',
      culture:'多语言多文化，社群与口碑重要',
      entry:'长期潜力大；基础设施与支付物流是主要约束',
      cases:['教学模拟案例'],
      dataNote:'区域特征为教学通用知识；AfCFTA 进展以官方信息为准。'
    }
  ];

  // 教学模拟数据：全球贸易航线（用于地图动画，明确标注为示意）
  const ROUTES = [
    'M190,170 Q420,60 495,150', 'M495,150 Q660,120 790,185',
    'M790,185 Q800,250 770,290', 'M290,370 Q180,270 190,170',
    'M500,330 Q560,260 585,235', 'M770,290 Q650,360 500,330'
  ];

  G.data = G.data || {};
  G.data.regions = REGIONS;
  G.data.routes = ROUTES;
})(window.GBA = window.GBA || {});
