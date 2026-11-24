/* 计算引擎 —— 真实计算逻辑，纯函数，便于单元测试 */
(function (G) {
  const E = {};

  // FOB 报价：采购成本+国内费用+报关+利润 → FOB
  E.fob = function (i) {
    const purchase = +i.purchase || 0, domestic = +i.domestic || 0, declaration = +i.declaration || 0;
    const profitRate = (+i.profitRate || 0) / 100, qty = +i.qty || 1;
    const cost = purchase + domestic + declaration;             // 每单位总成本
    const price = cost * (1 + profitRate);                       // 每单位 FOB 价
    return { unitCost: cost, unitPrice: price, total: price * qty, profit: (price - cost) * qty };
  };

  // CIF = FOB + 运费 + 保险；保险 = CIF×保险费率×投保加成 → 反解 CIF
  E.cif = function (i) {
    const fob = +i.fob || 0, freight = +i.freight || 0;
    const insRate = (+i.insRate || 0) / 100, surcharge = (+i.surcharge || 110) / 100;
    // CIF = (FOB + Freight) / (1 - insRate * surcharge)
    const denom = 1 - insRate * surcharge;
    const cif = denom > 0 ? (fob + freight) / denom : NaN;
    const insurance = cif * insRate * surcharge;
    return { cif, freight, insurance, denom };
  };

  // EXW 成本：出厂成本构成
  E.exw = function (i) {
    const material = +i.material || 0, labor = +i.labor || 0, overhead = +i.overhead || 0;
    const profitRate = (+i.profitRate || 0) / 100, qty = +i.qty || 1;
    const base = material + labor + overhead;
    const price = base * (1 + profitRate);
    return { base, price, total: price * qty };
  };

  // 汇率换算
  E.fx = function (i) { const amt = +i.amount || 0, rate = +i.rate || 0; return { converted: amt * rate }; };

  // 进出口利润
  E.tradeProfit = function (i) {
    const revenue = +i.revenue || 0, purchase = +i.purchase || 0, freight = +i.freight || 0;
    const insurance = +i.insurance || 0, tariff = +i.tariff || 0, fees = +i.fees || 0;
    const cost = purchase + freight + insurance + tariff + fees;
    const profit = revenue - cost;
    return { cost, profit, margin: revenue ? profit / revenue * 100 : 0 };
  };

  // 运输成本估算（按体积重与计费重）
  E.freight = function (i) {
    const cbm = +i.cbm || 0, kg = +i.kg || 0, ratePerCbm = +i.ratePerCbm || 0;
    // 海运常见计费：1CBM≈1000kg 取大（W/M），空运 1CBM≈167kg
    const mode = i.mode || 'sea';
    const divisor = mode === 'air' ? 167 : 1000;
    const chargeable = Math.max(cbm, kg / divisor);
    const cost = chargeable * ratePerCbm;
    return { chargeable, cost, mode };
  };

  // 集装箱装载（40HQ ≈ 67CBM，20GP ≈ 28CBM，实际受包装影响）
  E.container = function (i) {
    const cap = i.type === '40hq' ? 67 : i.type === '40gp' ? 58 : 28; // CBM 教学参考值
    const unitCbm = +i.unitCbm || 0, weightKg = +i.weightKg || 0, maxKg = i.type === '20gp' ? 21800 : 26500;
    const byVol = unitCbm ? Math.floor(cap / unitCbm) : 0;
    const byWt = weightKg ? Math.floor(maxKg / weightKg) : Infinity;
    return { cap, byVol, byWt, qty: Math.min(byVol, byWt), binding: byVol <= byWt ? 'volume' : 'weight' };
  };

  // 关税影响：从价税
  E.tariff = function (i) {
    const price = +i.price || 0, rate = (+i.rate || 0) / 100, qty = +i.qty || 1;
    const duty = price * rate * qty;
    return { unitDuty: price * rate, duty, landed: (price * (1 + rate)) * qty };
  };

  // 盈亏平衡
  E.breakeven = function (i) {
    const price = +i.price || 0, varCost = +i.varCost || 0, fixed = +i.fixed || 0;
    const cm = price - varCost; // 单位贡献毛利
    return { cm, units: cm > 0 ? Math.ceil(fixed / cm) : Infinity, revenue: cm > 0 ? Math.ceil(fixed / cm) * price : 0 };
  };

  // 跨境利润模型
  E.profitModel = function (i) {
    const price = +i.price || 0, qty = +i.qty || 0;
    const product = +i.product || 0, ship = +i.ship || 0, platformRate = (+i.platformRate || 0) / 100;
    const ad = +i.ad || 0, other = +i.other || 0, fixed = +i.fixed || 0;
    const revenue = price * qty;
    const platformFee = revenue * platformRate;
    const variable = (product + ship) * qty + platformFee + ad + other;
    const gross = revenue - (product + ship) * qty - platformFee;
    const net = revenue - variable - fixed;
    return { revenue, platformFee, variable, gross, net, margin: revenue ? net / revenue * 100 : 0, unitNet: qty ? net / qty : 0 };
  };

  // CAC / LTV
  E.cacLtv = function (i) {
    const spend = +i.spend || 0, customers = +i.customers || 0;
    const aov = +i.aov || 0, gm = (+i.gm || 0) / 100, purchases = +i.purchases || 1;
    const cac = customers ? spend / customers : 0;
    const ltv = aov * gm * purchases;
    return { cac, ltv, ratio: cac ? ltv / cac : 0, paybackOrders: aov * gm ? Math.ceil(cac / (aov * gm)) : 0 };
  };

  // ROI / ROAS
  E.roi = function (i) {
    const revenue = +i.revenue || 0, cost = +i.cost || 0, adSpend = +i.adSpend || 0;
    const profit = revenue - cost;
    return { profit, roi: cost ? profit / cost * 100 : 0, roas: adSpend ? revenue / adSpend : 0 };
  };

  // 现金流模拟（简版）：期初 + 各期流入流出
  E.cashflow = function (i) {
    const start = +i.start || 0, inflow = +i.inflow || 0, outflow = +i.outflow || 0, months = +i.months || 6;
    const net = inflow - outflow;
    const rows = []; let bal = start;
    for (let m = 1; m <= months; m++) { bal += net; rows.push({ m, inflow, outflow, net, bal }); }
    return { net, rows, end: bal, runway: net < 0 ? Math.floor(start / -net) : null };
  };

  // 库存周转
  E.inventory = function (i) {
    const cogs = +i.cogs || 0, begin = +i.begin || 0, end = +i.end || 0;
    const avg = (begin + end) / 2;
    const turns = avg ? cogs / avg : 0;
    return { avg, turns, days: turns ? 365 / turns : 0 };
  };

  // TCO 总拥有成本：采购价 + 物流关税 + 质量 + 库存持有 + 管理
  E.tco = function (i) {
    const price = +i.price || 0, qty = +i.qty || 0, logistics = +i.logistics || 0,
          defectRate = +i.defectRate || 0, defectCost = +i.defectCost || 0,
          inv = +i.inv || 0, holdRate = +i.holdRate || 0, mgmt = +i.mgmt || 0;
    const purchase = price * qty;
    const quality = qty * (defectRate / 100) * defectCost;
    const holding = inv * (holdRate / 100);
    const total = purchase + logistics + quality + holding + mgmt;
    return { purchase, logistics, quality, holding, mgmt, total, unit: qty ? total / qty : 0 };
  };

  // 比较优势模拟器：两国两产品单位劳动投入 → 机会成本与优势判定
  E.comparative = function (i) {
    const aX = +i.aX || 1, aY = +i.aY || 1, bX = +i.bX || 1, bY = +i.bY || 1;
    // 机会成本：A国 1单位X = aX/aY 单位Y；1单位Y = aY/aX 单位X
    const ocA_X = aX / aY, ocB_X = bX / bY;
    const ocA_Y = aY / aX, ocB_Y = bY / bX;
    const advX = ocA_X < ocB_X ? 'A' : ocB_X < ocA_X ? 'B' : 'equal';
    const advY = ocA_Y < ocB_Y ? 'A' : ocB_Y < ocA_Y ? 'B' : 'equal';
    const absX = aX < bX ? 'A' : bX < aX ? 'B' : 'equal';
    const absY = aY < bY ? 'A' : bY < aY ? 'B' : 'equal';
    return { ocA_X, ocB_X, ocA_Y, ocB_Y, advX, advY, absX, absY };
  };

  // 流量到订单链路
  E.chain = function (i) {
    const exposure = +i.exposure || 0;
    const rates = [i.r1, i.r2, i.r3, i.r4, i.r5].map(r => G.utils.clamp((+r || 0) / 100, 0, 1));
    const labels = ['内容曝光','潜在客户','询盘','报价','订单'];
    const vals = [exposure];
    for (let k = 0; k < rates.length; k++) vals.push(vals[k] * rates[k]);
    const aov = +i.aov || 0, gm = (+i.gm || 0) / 100, adCost = +i.adCost || 0;
    const orders = vals[5], revenue = orders * aov, grossProfit = revenue * gm;
    return {
      steps: labels.map((l, idx) => ({ label: l, value: vals[idx], note: idx ? '转化 ' + G.utils.num(rates[idx - 1] * 100, 1) + '%' : '流量入口' })),
      leads: vals[1], inquiries: vals[2], orders, revenue, grossProfit, roi: adCost ? (grossProfit - adCost) / adCost * 100 : 0
    };
  };

  G.engine = E;
})(window.GBA = window.GBA || {});
