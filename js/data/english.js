/* GLOBAL BUSINESS ENGLISH —— 专业词汇 + 商务邮件模板 */
(function (G) {
  const VOCAB = [
    {cat:'贸易术语', en:'Incoterms', cn:'国际贸易术语解释通则', def:'ICC 制定的规则，界定买卖双方在交付、费用与风险转移上的责任。', eg:'The contract specifies goods shipped <b>CIF Hamburg</b> under Incoterms 2020.'},
    {cat:'贸易术语', en:'FOB (Free On Board)', cn:'装运港船上交货', def:'卖方在指定装运港把货物装上买方指定船只，之后风险与费用由买方承担。', eg:'We quote <b>FOB Shenzhen</b>, USD 12.50 per unit.'},
    {cat:'贸易术语', en:'CIF (Cost, Insurance & Freight)', cn:'成本加保险费加运费', def:'卖方承担成本、保险与运费至目的港，但风险在装船时即转移给买方。', eg:'Please send us your best <b>CIF</b> price for 1,000 units.'},
    {cat:'客户开发', en:'Lead', cn:'潜在客户/销售线索', def:'有潜在采购意向、尚未成交的客户或联系人。', eg:'We generated 30 qualified <b>leads</b> from the trade show.'},
    {cat:'客户开发', en:'Inquiry / Enquiry', cn:'询盘', def:'买方就产品规格、价格、交期等发出的询价信息。', eg:'Thank you for your <b>inquiry</b> dated March 5.'},
    {cat:'报价谈判', en:'Quotation', cn:'报价单', def:'卖方向买方列明价格与交易条件的文件。', eg:'Please find attached our <b>quotation</b> No. 2026-018.'},
    {cat:'报价谈判', en:'Counter-offer', cn:'还盘/还价', def:'买方或卖方对对方报盘条件提出的修改意见。', eg:'We regret to say your price is too high; here is our <b>counter-offer</b>.'},
    {cat:'报价谈判', en:'FOB price, net of commission', cn:'不含佣金的FOB价', def:'报价中不含中介佣金的价格表述。', eg:'All prices are <b>net of commission</b>.'},
    {cat:'合同英语', en:'Force Majeure', cn:'不可抗力', def:'合同中约定的、无法预见或避免的免责事由条款。', eg:'Delivery delay caused by <b>force majeure</b> shall not be a breach.'},
    {cat:'合同英语', en:'Arbitration', cn:'仲裁', def:'双方约定由第三方裁决争议的方式。', eg:'Any dispute shall be settled by <b>arbitration</b> in Singapore.'},
    {cat:'合同英语', en:'L/C (Letter of Credit)', cn:'信用证', def:'银行出具的、在单证相符条件下付款的书面承诺。', eg:'Payment by irrevocable <b>L/C</b> at sight.'},
    {cat:'物流英语', en:'Bill of Lading (B/L)', cn:'提单', def:'承运人签发的运输凭证与物权凭证。', eg:'Please send us a copy of the <b>bill of lading</b>.'},
    {cat:'物流英语', en:'Lead time', cn:'交货周期/备货期', def:'从下单到交付所需的时间。', eg:'Our <b>lead time</b> is approximately 25 days.'},
    {cat:'营销英语', en:'Value proposition', cn:'价值主张', def:'品牌向顾客承诺的核心利益与差异点。', eg:'Our <b>value proposition</b> focuses on durability and design.'},
    {cat:'营销英语', en:'Positioning', cn:'市场定位', def:'在目标顾客心智中确立品牌差异化形象的过程。', eg:'We are <b>positioning</b> the product as premium and eco-friendly.'},
    {cat:'社媒英语', en:'Engagement rate', cn:'互动率', def:'互动量与曝光或触达量之比。', eg:'Our <b>engagement rate</b> improved after the UGC campaign.'},
    {cat:'社媒英语', en:'ROAS (Return on Ad Spend)', cn:'广告支出回报率', def:'广告带来的收入与广告花费之比。', eg:'The campaign delivered a <b>ROAS</b> of 4.2.'},
    {cat:'社媒英语', en:'Call to Action (CTA)', cn:'行动号召', def:'引导用户采取下一步行动的文字或按钮。', eg:'Add a clear <b>CTA</b> at the end of your post.'},
    {cat:'客户开发', en:'Follow-up', cn:'跟进', def:'在初次接触后持续与客户沟通以推进成交。', eg:'I am writing to <b>follow up</b> on our quotation.'},
    {cat:'商务会议', en:'Agenda', cn:'议程', def:'会议中拟讨论事项的清单。', eg:'Please find the <b>agenda</b> for tomorrow’s meeting attached.'}
  ];

  const EMAILS = [
    {
      id:'dev', title:'开发信 Cold Outreach', scene:'首次联系潜在海外客户，目标是获得回复与询盘。',
      body:`Subject: Sustainable Home Textiles for [Client Company]\n\nDear [Name],\n\nI hope this email finds you well. I am [Your Name] from [Company], a manufacturer of eco-friendly home textiles based in China.\n\nWe have supplied similar products to retailers in Europe and would love to explore whether there is a fit with [Client Company]. Our key strengths are consistent quality, flexible MOQ, and competitive lead times.\n\nI have attached a short catalogue for your reference. Would you be open to a brief call next week?\n\nBest regards,\n[Your Name]`,
      tips:['标题具体、提到对方公司名，避免群发感','开头不要长篇自我介绍，先说明与对方的相关性','给出明确、低门槛的下一步（简短通话/看目录）']
    },
    {
      id:'inquiry-reply', title:'询盘回复 Inquiry Reply', scene:'客户来函询价后，专业及时地回复。',
      body:`Subject: Re: Inquiry for [Product] – Quotation from [Company]\n\nDear [Name],\n\nThank you for your inquiry dated [date]. Please find below our offer:\n\n- Product: [Specification]\n- Price: USD [X] /unit, FOB [Port], Incoterms 2020\n- MOQ: [X] units\n- Lead time: [X] days after deposit\n- Payment: 30% T/T in advance, 70% against B/L copy\n- Validity: 15 days\n\nAttached is our detailed quotation. Please let me know if you need samples or further information.\n\nBest regards,\n[Your Name]`,
      tips:['逐项写清规格、价格术语、MOQ、交期、付款、有效期','价格术语必须标注 Incoterms 版本','报价要设有效期，避免价格长期被锁定']
    },
    {
      id:'quotation', title:'报价邮件 Quotation', scene:'正式发送报价单并推动客户确认。',
      body:`Subject: Quotation No. [XXX] – [Product] for [Client]\n\nDear [Name],\n\nFollowing our conversation, please find attached Quotation No. [XXX] for [Product].\n\nThe price is based on FOB [Port] for a quantity of [X] units, valid until [date]. Should you require CIF [Destination] pricing, I would be glad to provide it.\n\nWe look forward to your feedback and are happy to discuss any adjustments.\n\nBest regards,\n[Your Name]`,
      tips:['注明报价编号与有效期','主动提供替代术语价格（如 CIF）降低沟通成本','以开放态度邀请讨论，为谈判留空间']
    },
    {
      id:'payment', title:'催款邮件 Payment Reminder', scene:'货款到期未付，礼貌而坚定地催收。',
      body:`Subject: Friendly Reminder – Invoice [No.] Due on [Date]\n\nDear [Name],\n\nHope you are doing well. This is a friendly reminder that Invoice [No.] for USD [amount] was due on [date] and remains unpaid.\n\nCould you kindly confirm the payment status or let us know if there is any issue? Attached is the invoice for your convenience.\n\nThank you for your prompt attention.\n\nBest regards,\n[Your Name]`,
      tips:['语气专业克制，避免指责','附上发票与关键信息，降低对方操作成本','给出明确确认请求，便于推进']
    },
    {
      id:'complaint', title:'投诉处理 Complaint Handling', scene:'客户投诉质量问题时的标准回应。',
      body:`Subject: Re: Quality Issue with [Product]\n\nDear [Name],\n\nThank you for bringing this matter to our attention, and I am sorry for the inconvenience caused.\n\nWe take quality seriously. To resolve this quickly, could you please send us photos of the affected items and the order number? Our team will investigate immediately and propose a solution within [X] business days.\n\nWe value our partnership and will do our best to make this right.\n\nBest regards,\n[Your Name]`,
      tips:['先致歉与共情，不急于辩解','明确要求证据（照片/订单号）以便核查','给出处理时限，体现责任感']
    },
    {
      id:'negotiation', title:'商务谈判邮件 Negotiation', scene:'就价格或条件进行有策略的沟通。',
      body:`Subject: Regarding Pricing for [Product]\n\nDear [Name],\n\nThank you for your feedback on our quotation. I understand price is an important consideration.\n\nWhile our current price reflects the specified quality and service, we would be happy to explore options—for example, adjusting the order quantity, packaging, or payment terms—to arrive at a mutually beneficial arrangement.\n\nCould you share your target price and expected volume so we can see what flexibility is possible?\n\nBest regards,\n[Your Name]`,
      tips:['不直接降价，先探寻对方目标与数量','用非价格条件（数量/包装/付款）换取空间','把谈判变成共同解决问题']
    }
  ];

  G.data = G.data || {};
  G.data.vocab = VOCAB;
  G.data.emails = EMAILS;
})(window.GBA = window.GBA || {});
