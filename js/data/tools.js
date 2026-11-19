/* 工具目录 —— 声明式定义，由 lab 视图统一渲染
   字段: id,name,cat,icon,color,fn(引擎方法),fields[{k,label,type,def,unit,opts,min,max}],calc(i)->{rows:[{k,v}],note,formula}
*/
(function (G) {
  const T = [];
  const f = (k,label,def,opt) => Object.assign({k,label,def:def==null?'':def}, opt||{});

  // ---------- 国际贸易工具 ----------
  T.push({id:'fob',name:'FOB 报价计算器',cat:'trade',icon:'ship',color:'orange',
    desc:'从采购、国内费用、报关费与利润率推算 FOB 单价',
    fn:'fob',
    fields:[f('purchase','采购成本/单位',80,{unit:'¥'}),f('domestic','国内运输+仓储/单位',8,{unit:'¥'}),f('declaration','报关+杂费/单位',3,{unit:'¥'}),f('profitRate','利润率 %',15),f('qty','数量',1000)],
    calc:(r)=>({rows:[['单位成本',G.utils.num(r.unitCost)+' ¥'],['FOB 单价',G.utils.num(r.unitPrice)+' ¥'],['订单总额',G.utils.num(r.total)+' ¥'],['预计利润',G.utils.num(r.profit)+' ¥']],
      formula:'FOB单价 =(采购+国内费用+报关)×(1+利润率)',note:'示例参数为教学用途，请按实际报价填写。'})});

  T.push({id:'cif',name:'CIF 报价计算器',cat:'trade',icon:'ship',color:'blue',
    desc:'由 FOB + 运费 + 保险反解 CIF 报价',
    fn:'cif',
    fields:[f('fob','FOB 价/单位',95,{unit:'¥'}),f('freight','国际运费/单位',12,{unit:'¥'}),f('insRate','保险费率 %',0.3),f('surcharge','投保加成 %',110)],
    calc:(r)=>({rows:[['CIF 单价',G.utils.num(r.cif)+' ¥'],['运费',G.utils.num(r.freight)+' ¥'],['保险费',G.utils.num(r.insurance)+' ¥']],
      formula:'CIF =(FOB+运费)÷(1−保险费率×投保加成)',note:'注意：CIF 下风险仍在装船时转移，卖方买保险≠承担运输风险。'})});

  T.push({id:'exw',name:'EXW 成本计算器',cat:'trade',icon:'calc',color:'cyan',
    desc:'核算出厂价：材料+人工+制造费用+利润',
    fn:'exw',
    fields:[f('material','材料成本',45,{unit:'¥'}),f('labor','人工成本',12,{unit:'¥'}),f('overhead','制造费用',8,{unit:'¥'}),f('profitRate','利润率 %',12),f('qty','数量',1000)],
    calc:(r)=>({rows:[['出厂成本',G.utils.num(r.base)+' ¥'],['EXW 单价',G.utils.num(r.price)+' ¥'],['订单总额',G.utils.num(r.total)+' ¥']],formula:'EXW价 =(材料+人工+制造费用)×(1+利润率)'})});

  T.push({id:'fx',name:'国际汇率换算',cat:'trade',icon:'currency',color:'blue',
    desc:'按汇率换算金额（汇率为示例，请填实时值）',
    fn:'fx',
    fields:[f('amount','金额',1000),f('rate','汇率 (1单位外币=?)',7.2)],
    calc:(r)=>({rows:[['换算结果',G.utils.num(r.converted)+' ¥']],formula:'结果 = 金额 × 汇率',note:'汇率为教学示例值，非实时数据；实际操作请查询权威汇率并注意汇兑风险。'})});

  T.push({id:'tradeprofit',name:'进出口利润计算器',cat:'trade',icon:'chart',color:'green',
    desc:'综合收入与各项成本，计算贸易利润与利润率',
    fn:'tradeProfit',
    fields:[f('revenue','销售收入',150000,{unit:'¥'}),f('purchase','采购成本',95000,{unit:'¥'}),f('freight','国际运费',12000,{unit:'¥'}),f('insurance','保险费',1500,{unit:'¥'}),f('tariff','关税',8000,{unit:'¥'}),f('fees','其他费用',4000,{unit:'¥'})],
    calc:(r)=>({rows:[['总成本',G.utils.num(r.cost)+' ¥'],['利润',G.utils.num(r.profit)+' ¥'],['利润率',G.utils.num(r.margin,1)+'%']],formula:'利润 = 收入 − (采购+运费+保险+关税+费用)'})});

  T.push({id:'freight',name:'国际运输成本估算',cat:'trade',icon:'ship',color:'orange',
    desc:'按体积/重量计费重估算运费（W/M 原则）',
    fn:'freight',
    fields:[f('mode','运输方式','sea',{type:'select',opts:[['sea','海运 (1CBM≈1000kg)'],['air','空运 (1CBM≈167kg)']]}),f('cbm','体积 CBM',5),f('kg','重量 kg',3000),f('ratePerCbm','费率 (每计费单位)',400,{unit:'¥'})],
    calc:(r)=>({rows:[['计费重/体积',G.utils.num(r.chargeable,2)],['估算运费',G.utils.num(r.cost)+' ¥'],['方式',r.mode==='air'?'空运':'海运']],formula:'计费单位 = max(体积CBM, 重量÷换算系数)；费率与换算系数为教学示例。'})});

  T.push({id:'container',name:'集装箱装载基础计算',cat:'trade',icon:'calc',color:'cyan',
    desc:'估算可装数量（受体积与重量双重约束）',
    fn:'container',
    fields:[f('type','箱型','40hq',{type:'select',opts:[['20gp','20GP (~28CBM/21.8t)'],['40gp','40GP (~58CBM/26.5t)'],['40hq','40HQ (~67CBM/26.5t)']]}),f('unitCbm','单件体积 CBM',0.15),f('weightKg','单件重量 kg',12)],
    calc:(r)=>({rows:[['按体积可装',r.byVol+' 件'],['按重量可装',isFinite(r.byWt)?r.byWt+' 件':'不限'],['建议装载',r.qty+' 件'],['约束',r.binding==='volume'?'体积受限':'重量受限']],formula:'取体积与重量二者的较小值。箱型容量为教学参考值，实际以船公司数据为准。'})});

  T.push({id:'incoterms',name:'Incoterms 2020 比较器',cat:'trade',icon:'ax',color:'purple',special:'incoterms',
    desc:'逐项对照 11 种术语的费用、风险与义务',
    calc:null});

  T.push({id:'lc',name:'信用证审核练习',cat:'trade',icon:'note',color:'purple',special:'lc',
    desc:'找出信用证与单据中的不符点（interactive）',calc:null});

  T.push({id:'contract',name:'国际贸易合同模拟',cat:'trade',icon:'note',color:'blue',special:'contract',
    desc:'按条款清单生成一份合同草稿框架',calc:null});

  T.push({id:'tariff',name:'关税影响计算器',cat:'trade',icon:'chart',color:'orange',
    desc:'计算从价税额与含税到岸成本',fn:'tariff',
    fields:[f('price','单价',100,{unit:'¥'}),f('rate','关税税率 %',10),f('qty','数量',1000)],
    calc:(r)=>({rows:[['单位税额',G.utils.num(r.unitDuty)+' ¥'],['总税额',G.utils.num(r.duty)+' ¥'],['含税总额',G.utils.num(r.landed)+' ¥']],formula:'税额 = 单价 × 税率 × 数量'})});

  // ---------- 国际营销工具 ----------
  T.push({id:'pest',name:'PEST 分析器',cat:'marketing',icon:'globe',color:'blue',special:'pest',desc:'系统扫描目标国宏观环境并存档',calc:null});
  T.push({id:'swot',name:'SWOT 分析器',cat:'marketing',icon:'target',color:'purple',special:'swot',desc:'四象限分析并生成 SO/ST/WO/WT 策略',calc:null});
  T.push({id:'stp',name:'STP 市场定位工具',cat:'marketing',icon:'target',color:'pink',special:'stp',desc:'细分—目标—定位的结构化梳理',calc:null});
  T.push({id:'persona',name:'用户画像生成器',cat:'marketing',icon:'me',color:'cyan',special:'persona',desc:'构建目标用户的结构化画像',calc:null});
  T.push({id:'brandcanvas',name:'品牌定位画布',cat:'marketing',icon:'megaphone',color:'pink',special:'brand',desc:'目标/参照/差异点/品牌本质',calc:null});
  T.push({id:'contentcalendar',name:'内容日历',cat:'marketing',icon:'note',color:'green',special:'calendar',desc:'规划跨平台内容发布节奏',calc:null});
  T.push({id:'copy',name:'营销文案训练器',cat:'marketing',icon:'ax',color:'orange',special:'copy',desc:'按 AIDA 框架练写营销文案',calc:null});
  T.push({id:'competitor',name:'海外市场竞争分析',cat:'marketing',icon:'chart',color:'blue',special:'competitor',desc:'竞争对手对比画布',calc:null});
  T.push({id:'adbudget',name:'广告预算计算器',cat:'marketing',icon:'currency',color:'purple',
    desc:'按 CPA / 转化目标反推所需预算',fn:'adBudget',
    fields:[f('conversions','目标转化数',100),f('cpa','目标 CPA',50,{unit:'¥'}),f('days','投放天数',30)],
    calc:(r)=>({rows:[['总预算',G.utils.num(r.total)+' ¥'],['日均预算',G.utils.num(r.daily)+' ¥']],formula:'预算 = 目标转化数 × CPA'}),
    _fn:i=>{const c=+i.conversions||0,a=+i.cpa||0,d=+i.days||1,t=c*a;return{total:t,daily:t/d}}});

  T.push({id:'roi',name:'ROI 与 ROAS 计算器',cat:'marketing',icon:'trend',color:'green',
    desc:'计算营销投资回报率与广告支出回报率',fn:'roi',
    fields:[f('revenue','收入',8000,{unit:'¥'}),f('cost','总成本',5000,{unit:'¥'}),f('adSpend','广告花费',2000,{unit:'¥'})],
    calc:(r)=>({rows:[['利润',G.utils.num(r.profit)+' ¥'],['ROI',G.utils.num(r.roi,1)+'%'],['ROAS',G.utils.num(r.roas,2)]],formula:'ROI=(收入−成本)÷成本；ROAS=收入÷广告花费'})});

  // ---------- 商业经营工具 ----------
  T.push({id:'productcost',name:'产品成本核算',cat:'business',icon:'calc',color:'cyan',
    desc:'核算单品完整成本结构',fn:'exw',
    fields:[f('material','材料',45,{unit:'¥'}),f('labor','人工',12,{unit:'¥'}),f('overhead','制造费用',8,{unit:'¥'}),f('profitRate','利润率 %',0),f('qty','数量',1)],
    calc:(r)=>({rows:[['单位成本',G.utils.num(r.base)+' ¥'],['合计',G.utils.num(r.total)+' ¥']],formula:'成本 = 材料+人工+制造费用'})});

  T.push({id:'profit',name:'跨境利润计算',cat:'business',icon:'chart',color:'green',
    desc:'综合平台费、广告、物流计算净利',fn:'profitModel',
    fields:[f('price','售价',299,{unit:'¥'}),f('qty','销量',500),f('product','产品成本',90,{unit:'¥'}),f('ship','物流/单',30,{unit:'¥'}),f('platformRate','平台费率 %',15),f('ad','广告费',20000,{unit:'¥'}),f('other','其他变动成本',3000,{unit:'¥'}),f('fixed','固定成本',15000,{unit:'¥'})],
    calc:(r)=>({rows:[['销售收入',G.utils.num(r.revenue)+' ¥'],['平台费',G.utils.num(r.platformFee)+' ¥'],['毛利',G.utils.num(r.gross)+' ¥'],['净利润',G.utils.num(r.net)+' ¥'],['净利率',G.utils.num(r.margin,1)+'%'],['单件净利',G.utils.num(r.unitNet)+' ¥']],formula:'净利=收入−(产品+物流)×销量−平台费−广告−其他−固定成本'})});

  T.push({id:'breakeven',name:'盈亏平衡点计算',cat:'business',icon:'target',color:'orange',
    desc:'计算需要卖多少件才能不亏',fn:'breakeven',
    fields:[f('price','售价',199,{unit:'¥'}),f('varCost','单位变动成本',120,{unit:'¥'}),f('fixed','固定成本',50000,{unit:'¥'})],
    calc:(r)=>({rows:[['单位贡献毛利',G.utils.num(r.cm)+' ¥'],['盈亏平衡销量',isFinite(r.units)?r.units+' 件':'无法盈亏平衡'],['对应收入',G.utils.num(r.revenue)+' ¥']],formula:'平衡销量 = 固定成本 ÷ (售价−单位变动成本)'})});

  T.push({id:'cac-ltv',name:'CAC 与 LTV 计算器',cat:'business',icon:'trend',color:'purple',
    desc:'评估获客效率与客户长期价值',fn:'cacLtv',
    fields:[f('spend','营销总投入',30000,{unit:'¥'}),f('customers','新增客户数',300),f('aov','客单价',200,{unit:'¥'}),f('gm','毛利率 %',40),f('purchases','平均购买次数',5)],
    calc:(r)=>({rows:[['CAC 获客成本',G.utils.num(r.cac)+' ¥'],['LTV 客户终身价值',G.utils.num(r.ltv)+' ¥'],['LTV / CAC',G.utils.num(r.ratio,2)],['回本所需订单',r.paybackOrders+' 单']],formula:'CAC=投入÷新增客户；LTV≈客单价×毛利率×购买次数',note:'LTV/CAC≥3 常被视为较健康，具体标准因行业而异。'})});

  T.push({id:'inventory',name:'库存周转率计算',cat:'business',icon:'calc',color:'cyan',
    desc:'衡量库存周转效率与资金占用',fn:'inventory',
    fields:[f('cogs','销售成本',600000,{unit:'¥'}),f('begin','期初库存',80000,{unit:'¥'}),f('end','期末库存',120000,{unit:'¥'})],
    calc:(r)=>({rows:[['平均库存',G.utils.num(r.avg)+' ¥'],['周转率',G.utils.num(r.turns,2)+' 次'],['周转天数',G.utils.num(r.days,0)+' 天']],formula:'周转率=销售成本÷平均库存；周转天数≈365÷周转率'})});

  T.push({id:'cashflow',name:'现金流模拟',cat:'business',icon:'currency',color:'blue',
    desc:'预测现金余额与可支撑月数',fn:'cashflow',
    fields:[f('start','期初现金',100000,{unit:'¥'}),f('inflow','月流入',60000,{unit:'¥'}),f('outflow','月流出',75000,{unit:'¥'}),f('months','模拟月数',6)],
    calc:(r)=>({rows:[['每月净流',G.utils.num(r.net)+' ¥'],[r.months+'月后余额',G.utils.num(r.end)+' ¥'],['可支撑月数',r.runway!=null?r.runway+' 月':'现金流为正']],formula:'期末余额=期初+Σ(流入−流出)',table:r.rows,note:'利润不等于现金；此模拟为教学简化模型。'})});

  T.push({id:'bmcanvas',name:'商业模式画布',cat:'business',icon:'brain',color:'pink',special:'bmc',desc:'九宫格梳理商业模式',calc:null});

  // 特殊工具引擎补齐（未在 engine.js 定义的）
  G.engine.adBudget = T.find(x=>x.id==='adbudget')._fn;

  G.data = G.data || {};
  G.data.tools = T;
  G.data.toolById = Object.fromEntries(T.map(t=>[t.id,t]));
  G.data.toolCats = [
    {k:'trade',name:'国际贸易'},{k:'marketing',name:'国际营销'},{k:'business',name:'商业经营'}
  ];
})(window.GBA = window.GBA || {});
