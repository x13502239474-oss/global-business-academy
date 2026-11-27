/* ============================================================
   Global Social Media Control Center — 默认数据与教学样例
   说明：本模块不包含实时官方 API 连接；所有样例指标均明确标注为
   「教学模拟」，用户新增指标标注为「手动录入」，绝不伪装实时 API。
   ============================================================ */
(function (G) {
  const PLATFORMS = [
    {
      id: 'tiktok', name: 'TikTok', icon: 'tiktok', color: '#111827', modId: 'ST',
      accountType: 'Business Account + Business Center',
      verifySystem: 'Business Verification（企业资质认证）',
      badgeType: '取决于具体认证类型（蓝标 Verified Badge 另行审核）',
      devPortal: 'TikTok for Developers',
      apiNotes: 'Content Posting API / Display API / Research & Commercial API（需应用审核与地区合规）'
    },
    {
      id: 'instagram', name: 'Instagram', icon: 'instagram', color: '#C13584', modId: 'SI',
      accountType: 'Business Account（归属 Meta Business Portfolio）',
      verifySystem: 'Meta Business Verification / Meta Verified for Business',
      badgeType: '蓝色勾选（订阅制，与企业资质审核分属不同流程）',
      devPortal: 'Meta for Developers（Instagram Graph API）',
      apiNotes: 'Instagram Graph API（需关联 Facebook Page 并通过 App Review）'
    },
    {
      id: 'facebook', name: 'Facebook', icon: 'facebook', color: '#1877F2', modId: 'SF',
      accountType: 'Facebook Page + Meta Business Portfolio',
      verifySystem: 'Meta Business Verification / Meta Verified for Business',
      badgeType: '蓝色勾选（订阅制，具体资格与价格以官方当期公示为准）',
      devPortal: 'Meta for Developers（Pages & Marketing API）',
      apiNotes: 'Graph API / Conversions API / Marketing API（需商业验证与权限审核）'
    },
    {
      id: 'x', name: 'X (Twitter)', icon: 'x', color: '#334155', modId: 'SX',
      accountType: 'Professional Account / Premium Business',
      verifySystem: 'Premium Business 企业认证体系',
      badgeType: '金色勾选（Gold Checkmark）+ 品牌关联子账号徽章',
      devPortal: 'X Developer Platform',
      apiNotes: 'X API v2（分级套餐与速率限制，具体额度以 X 官方当期文档为准）'
    },
    {
      id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', color: '#0A66C2', modId: 'SL',
      accountType: 'Company Page + Showcase Page',
      verifySystem: 'Company Page Verification（企业主页认证）',
      badgeType: '企业主页认证标识（与 Premium Company Page 订阅功能区分）',
      devPortal: 'LinkedIn Developer Platform',
      apiNotes: 'Community Management API / Marketing API（企业应用需单独申请权限）'
    },
    {
      id: 'youtube', name: 'YouTube', icon: 'youtube', color: '#DC2626', modId: 'SY',
      accountType: 'Brand Account（企业品牌频道）',
      verifySystem: 'Channel Verification（频道官方认证）',
      badgeType: '官方认证标识（达到官方条件后申请，区别于手机号基础验证）',
      devPortal: 'Google Cloud · YouTube Data API v3',
      apiNotes: 'YouTube Data API v3 / Analytics API（按配额单位计费与限流）'
    }
  ];

  const PROFILE_FIELDS = [
    { key: 'handle', label: '统一英文 Handle' },
    { key: 'logo', label: '高清企业 Logo' },
    { key: 'bio', label: '英文品牌简介' },
    { key: 'site', label: '官方网站链接' },
    { key: 'email', label: '企业邮箱/联系方式' },
    { key: 'role', label: '商业后台归属与权限' }
  ];

  const SECURITY_ITEMS = [
    { id: 'sec-2fa', title: '全部主账号与商业后台已开启双重身份验证（2FA）', tip: '优先使用认证器 App 或硬件密钥，避免仅依赖员工个人短信。' },
    { id: 'sec-email', title: '注册邮箱统一使用企业专属域名邮箱（非个人邮箱）', tip: '区分管理注册邮箱（admin@）与对外业务邮箱（sales@）。' },
    { id: 'sec-phone', title: '绑定手机号归属企业公用号码并登记保管人', tip: '防止员工离职后无法接收安全验证码。' },
    { id: 'sec-rbac', title: '按最小权限原则分配员工角色（禁止共享超级管理员密码）', tip: '内容运营只给编辑/发布权限，财务与资产归属由管理员控制。' },
    { id: 'sec-admin2', title: '核心商业后台至少配置 2 名企业超级管理员备份', tip: '避免单一管理员账号受限导致企业资产锁死。' },
    { id: 'sec-handover', title: '已建立员工入离职账号交接与权限撤销 SOP', tip: '离职当日撤销商业后台角色并清理已授权第三方应用。' },
    { id: 'sec-alert', title: '已开启异常登录提醒并核查第三方应用授权清单', tip: '每季度清理不再使用的旧工具与过期 API Token。' },
    { id: 'sec-backup', title: '企业数字资产台账与恢复码已离线加密备份', tip: '包含域名注册商、DNS、邮箱后台、各平台资产 ID 与营业执照核验件。' }
  ];

  function createSample() {
    return {
      mode: 'sample',
      company: {
        name: 'FreshBridge Global Produce Co., Ltd.',
        domain: 'freshbridgeglobal.com',
        email: 'ops@freshbridgeglobal.com',
        sector: '国际生鲜贸易与冷链出口（教学示例）',
        region: '欧洲 / 中东 / 东南亚'
      },
      accounts: {
        tiktok: { status: '进行中', handle: '@freshbridgeglobal', owner: '短视频运营组', verifyBiz: '准备材料', verifyBadge: '未申请', apiStatus: '暂不需要', profile: { handle: true, logo: true, bio: true, site: true, email: false, role: false } },
        instagram: { status: '已建号', handle: '@freshbridgeglobal', owner: '品牌视觉组', verifyBiz: '审核中', verifyBadge: '评估中', apiStatus: '未申请', profile: { handle: true, logo: true, bio: true, site: true, email: true, role: true } },
        facebook: { status: '已建号', handle: 'FreshBridgeGlobal', owner: '海外投放组', verifyBiz: '审核中', verifyBadge: '评估中', apiStatus: '未申请', profile: { handle: true, logo: true, bio: true, site: true, email: true, role: true } },
        x: { status: '待完善', handle: '@FreshBridgeCo', owner: '行业公关组', verifyBiz: '未开始', verifyBadge: '暂不订阅', apiStatus: '暂不需要', profile: { handle: true, logo: true, bio: false, site: true, email: false, role: false } },
        linkedin: { status: '已建号', handle: 'freshbridge-global-produce', owner: 'B2B 客户开发组', verifyBiz: '已提交', verifyBadge: '待核验', apiStatus: '暂不需要', profile: { handle: true, logo: true, bio: true, site: true, email: true, role: true } },
        youtube: { status: '已建号', handle: '@FreshBridgeGlobal', owner: '视频内容组', verifyBiz: '已建品牌频道', verifyBadge: '未达条件', apiStatus: '沙箱了解', profile: { handle: true, logo: true, bio: true, site: true, email: true, role: false } }
      },
      assets: [
        { id: 'a1', category: '数字身份', name: '企业官网与独立域名', value: 'https://freshbridgeglobal.com', owner: 'IT / 市场部', ready: true },
        { id: 'a2', category: '数字身份', name: '企业专属邮箱体系', value: 'admin@ / sales@ / media@freshbridgeglobal.com', owner: 'IT / 行政部', ready: true },
        { id: 'a3', category: '资质文件', name: '营业执照与英文翻译件（企业认证专用）', value: '内部加密档案，禁止公开上传', owner: '法务 / 财务', ready: true },
        { id: 'a4', category: '品牌视觉', name: '国际生鲜品牌视觉规范（Brand Kit）', value: 'Logo 矢量包 / 冷链色卡 / 字幕模板', owner: '设计组', ready: true },
        { id: 'a5', category: '商业后台', name: 'Meta Business Portfolio（含 FB Page + IG）', value: '双超级管理员已配置', owner: '海外营销负责人', ready: true },
        { id: 'a6', category: '商业后台', name: 'TikTok Business Center', value: '待补齐企业资质核验文件', owner: '短视频运营组', ready: false }
      ],
      posts: [
        { id: 'cp1', platform: 'YouTube', title: '冷链鲜果从产区采摘到预冷装柜 90 秒实拍', date: '2026-12-02', status: '制作中', goal: 'B2B 采购商信任背书' },
        { id: 'cp2', platform: 'LinkedIn', title: '2026 冬季鲜果冷链出口规格表与产季窗口说明', date: '2026-12-03', status: '待发布', goal: '获取欧洲进口商询盘' },
        { id: 'cp3', platform: 'Instagram', title: '轮播图：出口级生鲜农残检测与分级包装 5 步标准', date: '2026-12-04', status: '待发布', goal: '视觉品牌形象沉淀' },
        { id: 'cp4', platform: 'TikTok', title: '清晨果园实拍：这批出口鲜果为什么 2 小时内必须进预冷库', date: '2026-12-05', status: '已排期', goal: '自然流量冷启动测试' }
      ],
      tasks: [
        { id: 't1', platform: '全平台', title: '核对官网页脚英文主体名与营业执照完全一致', priority: '高', done: true },
        { id: 't2', platform: 'Facebook', title: '在 Meta Business Portfolio 中关联 Instagram 商业账号并验证域名', priority: '高', done: true },
        { id: 't3', platform: 'TikTok', title: '准备 TikTok Business Verification 所需营业执照与企业邮箱材料', priority: '高', done: false },
        { id: 't4', platform: 'YouTube', title: '确认频道已切换为 Brand Account 并添加第二位企业管理员', priority: '中', done: false },
        { id: 't5', platform: 'LinkedIn', title: '为海外采购商整理 20 家目标欧洲生鲜进口商决策人名单', priority: '中', done: false }
      ],
      metrics: [
        { id: 'm1', platform: 'YouTube', period: '2026-W47', reach: '1,240', engagement: '86', inquiries: '3', source: '教学模拟', note: '教学示例数据，非真实 API 同步' },
        { id: 'm2', platform: 'LinkedIn', period: '2026-W47', reach: '2,180', engagement: '112', inquiries: '5', source: '教学模拟', note: '教学示例数据，用于演练周度复盘' },
        { id: 'm3', platform: 'Instagram', period: '2026-W47', reach: '3,650', engagement: '204', inquiries: '2', source: '教学模拟', note: '教学示例数据，非实时抓取' }
      ],
      security: {
        'sec-2fa': true,
        'sec-email': true,
        'sec-phone': false,
        'sec-rbac': true,
        'sec-admin2': false,
        'sec-handover': false,
        'sec-alert': false,
        'sec-backup': true
      }
    };
  }

  function createBlank() {
    const accounts = {};
    PLATFORMS.forEach(p => {
      accounts[p.id] = {
        status: '未开始', handle: '', owner: '',
        verifyBiz: '未开始', verifyBadge: '未申请', apiStatus: '暂不需要',
        profile: { handle: false, logo: false, bio: false, site: false, email: false, role: false }
      };
    });
    const security = {};
    SECURITY_ITEMS.forEach(s => { security[s.id] = false; });
    return {
      mode: 'custom',
      company: { name: '我的国际企业（点击编辑）', domain: '', email: '', sector: '', region: '' },
      accounts,
      assets: [],
      posts: [],
      tasks: [],
      metrics: [],
      security
    };
  }

  G.data = G.data || {};
  G.data.controlPlatforms = PLATFORMS;
  G.data.controlProfileFields = PROFILE_FIELDS;
  G.data.controlSecurityItems = SECURITY_ITEMS;
  G.data.controlDefaults = { createSample, createBlank };
})(window.GBA = window.GBA || {});
