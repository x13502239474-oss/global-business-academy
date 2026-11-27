/* ============================================================
   Global Social Media Control Center — 企业运营管理中心
   交互式学习与管理工具：六大平台资产、企业认证追踪、资料完善度、
   数字资产清单、内容排期、营销任务、数据记录（严格区分来源）、
   安全审计、API 接入状态、学习与实战进度同步。
   ============================================================ */
(function (G) {
  const D = G.data, S = G.store, U = G.utils;
  G.views = G.views || {};

  let activeTab = 'overview';

  function ensureData() {
    let cc = S.getControl();
    if (!cc) {
      cc = D.controlDefaults.createSample();
      S.replaceControl(cc);
    }
    return cc;
  }

  function profilePct(acc) {
    const fields = D.controlProfileFields || [];
    if (!fields.length || !acc || !acc.profile) return 0;
    const ok = fields.filter(f => acc.profile[f.key]).length;
    return Math.round(ok / fields.length * 100);
  }

  function securityScore(cc) {
    const items = D.controlSecurityItems || [];
    if (!items.length) return 0;
    const ok = items.filter(it => cc.security && cc.security[it.id]).length;
    return Math.round(ok / items.length * 100);
  }

  function badgeClassForSource(src) {
    if (src === '手动录入') return 'blue';
    if (src === '教学模拟') return 'warn';
    return 'line';
  }

  G.views.control = function () {
    G.setChrome('control', '企业运营管理中心');
    const cc = ensureData();
    const plats = D.controlPlatforms || [];
    const fields = D.controlProfileFields || [];
    const secItems = D.controlSecurityItems || [];

    // 汇总统计
    const avgProfile = Math.round(plats.reduce((sum, p) => sum + profilePct(cc.accounts[p.id]), 0) / Math.max(plats.length, 1));
    const secPct = securityScore(cc);
    const verifiedCount = plats.filter(p => {
      const st = (cc.accounts[p.id] && cc.accounts[p.id].verifyBiz) || '';
      return /已认证|已通过|已建品牌频道/.test(st);
    }).length;
    const taskDone = (cc.tasks || []).filter(t => t.done).length;

    // 同步课程与实战进度
    const infraIds = ['DI', 'DA'];
    const infraLessons = infraIds.flatMap(id => (D.moduleById[id] ? D.moduleById[id].chapters : []));
    const infraDone = infraLessons.filter(c => S.isDone(c.id)).length;
    const p9Sub = S.getProject('p9');
    const p9Proj = D.projectById && D.projectById['p9'];
    const p9Done = p9Sub ? Object.values(p9Sub.done || {}).filter(Boolean).length : 0;
    const p9Total = p9Proj ? p9Proj.deliver.length : 4;

    const tabs = [
      { id: 'overview', label: '资产与资料总览' },
      { id: 'verify', label: '企业认证追踪' },
      { id: 'assets', label: '数字资产与安全' },
      { id: 'ops', label: '发布计划与任务' },
      { id: 'metrics', label: '运营数据记录' },
      { id: 'api', label: 'API 接入状态' }
    ];

    function renderOverview() {
      return `
        <div class="sec-head"><h2>1. 六大平台账号资产总览</h2><span class="more">点击即可修改状态与 Handle，自动保存至本机</span></div>
        <div class="cc-grid">
          ${plats.map(p => {
            const a = cc.accounts[p.id] || {};
            const pct = profilePct(a);
            return `<div class="card cc-plat" style="--mc:${p.color}">
              <div class="row between" style="gap:8px;margin-bottom:8px">
                <div class="row" style="gap:8px">
                  <div class="cc-ic">${G.icon(p.icon, 17)}</div>
                  <div>
                    <b style="font-size:14.5px;display:block;line-height:1.25">${p.name}</b>
                    <span class="tiny dim">${p.accountType}</span>
                  </div>
                </div>
                <select class="cc-sel" data-acc-field="status" data-plat="${p.id}">
                  ${['未开始', '待完善', '进行中', '已建号', '正常运营'].map(o => `<option value="${o}" ${a.status === o ? 'selected' : ''}>${o}</option>`).join('')}
                </select>
              </div>
              <div class="grid2" style="gap:8px;margin-bottom:10px">
                <label class="cc-mini-field"><span>账号 Handle / ID</span>
                  <input class="input" data-acc-field="handle" data-plat="${p.id}" value="${U.esc(a.handle || '')}" placeholder="@brandname"/>
                </label>
                <label class="cc-mini-field"><span>负责团队/人员</span>
                  <input class="input" data-acc-field="owner" data-plat="${p.id}" value="${U.esc(a.owner || '')}" placeholder="例如：海外运营组"/>
                </label>
              </div>
              <div class="row between tiny" style="margin-bottom:4px">
                <span class="dim">资料完善度</span>
                <b class="num" style="color:${pct >= 80 ? 'var(--ok)' : 'var(--blue-700)'}">${pct}%</b>
              </div>
              <div class="bar-track thin" style="margin-bottom:10px"><div class="bar-fill" style="width:${pct}%;background:${p.color}"></div></div>
              <div class="cc-checks">
                ${fields.map(f => `<label class="cc-chk">
                  <input type="checkbox" data-prof-key="${f.key}" data-plat="${p.id}" ${a.profile && a.profile[f.key] ? 'checked' : ''}/>
                  <span>${f.label}</span>
                </label>`).join('')}
              </div>
              <div class="row between" style="margin-top:10px;padding-top:8px;border-top:1px solid var(--line)">
                <span class="tiny dim">认证：${U.esc(a.verifyBiz || '未开始')}</span>
                <a class="tiny" href="#/module?id=${p.modId}">复习 ${p.name} 课程 →</a>
              </div>
            </div>`;
          }).join('')}
        </div>

        <div class="sec-head"><h2>10. 学习与实战任务进度（与课程系统实时同步）</h2><span class="more"><a href="#/courses">进入课程体系</a></span></div>
        <div class="grid3">
          <a class="card" href="#/module?id=DI" style="display:block">
            <div class="tiny dim">数字化基础设施课程（DI + DA）</div>
            <b style="font-size:18px;display:block;margin:4px 0">${infraDone} / ${infraLessons.length} 节</b>
            <div class="bar-track thin" style="margin:6px 0"><div class="bar-fill" style="width:${Math.round(infraDone / Math.max(infraLessons.length, 1) * 100)}%"></div></div>
            <div class="tiny dim">企业身份认证与开发者 API 基础</div>
          </a>
          <a class="card" href="#/project?id=p9" style="display:block">
            <div class="tiny dim">贯穿实战：国际生鲜企业数字矩阵</div>
            <b style="font-size:18px;display:block;margin:4px 0">${p9Done} / ${p9Total} 项交付物</b>
            <div class="bar-track thin" style="margin:6px 0"><div class="bar-fill" style="width:${Math.round(p9Done / Math.max(p9Total, 1) * 100)}%;background:#15803D"></div></div>
            <div class="tiny dim">${p9Sub && p9Sub.text ? '已保存项目成果文档' : '去完成 10 阶段实战项目 →'}</div>
          </a>
          <a class="card" href="#/courses" style="display:block">
            <div class="tiny dim">全站课程总进度</div>
            <b style="font-size:18px;display:block;margin:4px 0">${S.completedCount()} / ${D.totalLessons} 节</b>
            <div class="bar-track thin" style="margin:6px 0"><div class="bar-fill" style="width:${Math.round(S.completedCount() / Math.max(D.totalLessons, 1) * 100)}%"></div></div>
            <div class="tiny dim">含六大平台运营与企业基建课程</div>
          </a>
        </div>
      `;
    }

    function renderVerify() {
      return `
        <div class="callout warn" style="margin-bottom:16px">
          <span class="ct">核心原则</span>
          <strong>企业资质认证（Business Verification）≠ 公众可见认证标识（蓝标 / 金标等）</strong>。前者核验企业合法主体、域名与商业权限；后者多为独立的订阅或资格审核机制，具体费用、资格与地区政策请一律以平台官方帮助中心当期公示为准。
        </div>
        <div class="sec-head"><h2>2. 六大平台企业认证对照与进度追踪</h2><span class="more"><a href="#/lesson?id=di-2">阅读认证专题讲义 →</a></span></div>
        <div class="card" style="padding:0;overflow:hidden">
          <div class="tbl-scroll">
            <table class="tbl">
              <tr>
                <th>平台</th>
                <th>企业认证体系</th>
                <th>公众认证标识说明</th>
                <th>企业资质认证进度</th>
                <th>公众标识状态</th>
              </tr>
              ${plats.map(p => {
                const a = cc.accounts[p.id] || {};
                return `<tr>
                  <td><b style="color:${p.color}">${p.name}</b></td>
                  <td>${p.verifySystem}</td>
                  <td class="small muted">${p.badgeType}</td>
                  <td>
                    <select class="cc-sel" data-acc-field="verifyBiz" data-plat="${p.id}">
                      ${['未开始', '准备材料', '已提交', '审核中', '已建品牌频道', '已认证', '需补件'].map(o => `<option value="${o}" ${a.verifyBiz === o ? 'selected' : ''}>${o}</option>`).join('')}
                    </select>
                  </td>
                  <td>
                    <select class="cc-sel" data-acc-field="verifyBadge" data-plat="${p.id}">
                      ${['未申请', '评估中', '暂不订阅', '未达条件', '待核验', '审核中', '已生效'].map(o => `<option value="${o}" ${a.verifyBadge === o ? 'selected' : ''}>${o}</option>`).join('')}
                    </select>
                  </td>
                </tr>`;
              }).join('')}
            </table>
          </div>
        </div>
      `;
    }

    function renderAssets() {
      return `
        <div class="sec-head"><h2>4. 企业数字资产清单</h2><span class="more">域名、官网、邮箱、执照核验件与商业后台</span></div>
        <div class="card" style="margin-bottom:16px">
          <div class="cc-form-row">
            <select class="input" id="assetCat" style="max-width:130px">
              <option value="数字身份">数字身份</option>
              <option value="资质文件">资质文件</option>
              <option value="品牌视觉">品牌视觉</option>
              <option value="商业后台">商业后台</option>
              <option value="其他资产">其他资产</option>
            </select>
            <input class="input" id="assetName" placeholder="资产名称（如：企业独立域名 / Brand Kit）"/>
            <input class="input" id="assetVal" placeholder="标识或存放说明（切勿填入明文密码）"/>
            <button class="btn primary sm" id="addAssetBtn">添加资产</button>
          </div>
          <div style="margin-top:12px">
            ${(cc.assets || []).length ? cc.assets.map(a => `
              <div class="list-row">
                <input type="checkbox" data-asset-toggle="${a.id}" ${a.ready ? 'checked' : ''} style="accent-color:var(--blue-600)"/>
                <span class="chip line">${U.esc(a.category)}</span>
                <div style="flex:1;min-width:0">
                  <b style="font-size:13.5px;${a.ready ? '' : 'color:var(--ink-700)'}">${U.esc(a.name)}</b>
                  <div class="tiny dim">${U.esc(a.value || '')}${a.owner ? ' · 负责：' + U.esc(a.owner) : ''}</div>
                </div>
                <span class="chip ${a.ready ? 'ok' : 'warn'}">${a.ready ? '已就绪' : '待补齐'}</span>
                <button class="icon-btn" data-asset-del="${a.id}" title="删除">${G.icon('trash', 15)}</button>
              </div>
            `).join('') : '<div class="empty">暂无资产记录，可在上方添加企业域名、邮箱、商业后台等数字资产。</div>'}
          </div>
        </div>

        <div class="sec-head"><h2>8. 企业账号安全检查（当前得分 ${secPct}%）</h2><span class="more"><a href="#/lesson?id=di-3">查看安全治理讲义 →</a></span></div>
        <div class="card">
          <div class="bar-track" style="height:8px;margin-bottom:14px"><div class="bar-fill" style="width:${secPct}%;background:${secPct >= 80 ? 'var(--ok)' : 'var(--blue-600)'}"></div></div>
          ${secItems.map(it => {
            const on = !!(cc.security && cc.security[it.id]);
            return `<label class="deliverable" style="display:block;cursor:pointer;border-style:solid;background:${on ? 'var(--ok-bg)' : 'var(--bg-sub)'}">
              <div class="row" style="align-items:flex-start;gap:10px">
                <input type="checkbox" data-sec-id="${it.id}" ${on ? 'checked' : ''} style="margin-top:4px;accent-color:var(--ok)"/>
                <div>
                  <b>${it.title}</b>
                  <div class="tiny dim" style="margin-top:2px">${it.tip}</div>
                </div>
              </div>
            </label>`;
          }).join('')}
        </div>
      `;
    }

    function renderOps() {
      return `
        <div class="sec-head"><h2>5. 多平台内容发布计划</h2><span class="more">点击状态按钮切换进度</span></div>
        <div class="card" style="margin-bottom:18px">
          <div class="cc-form-row">
            <select class="input" id="postPlat" style="max-width:130px">
              ${plats.map(p => `<option value="${p.name}">${p.name}</option>`).join('')}
            </select>
            <input class="input" id="postTitle" placeholder="内容主题（如：生鲜冷链预冷实拍 60 秒）"/>
            <input class="input" id="postDate" type="date" style="max-width:150px" value="${U.todayKey()}"/>
            <button class="btn primary sm" id="addPostBtn">加入排期</button>
          </div>
          <div style="margin-top:12px">
            ${(cc.posts || []).length ? cc.posts.map(p => `
              <div class="list-row">
                <span class="chip blue">${U.esc(p.platform)}</span>
                <div style="flex:1;min-width:0">
                  <b style="font-size:13.5px">${U.esc(p.title)}</b>
                  <div class="tiny dim">${U.esc(p.date || '')}${p.goal ? ' · 目标：' + U.esc(p.goal) : ''}</div>
                </div>
                <button class="btn sm" data-post-cycle="${p.id}">${U.esc(p.status)}</button>
                <button class="icon-btn" data-post-del="${p.id}" title="删除">${G.icon('trash', 15)}</button>
              </div>
            `).join('') : '<div class="empty">暂无内容排期，请在上方添加。</div>'}
          </div>
        </div>

        <div class="sec-head"><h2>6. 海外营销任务管理</h2><span class="more">已完成 ${taskDone} / ${(cc.tasks || []).length}</span></div>
        <div class="card">
          <div class="cc-form-row">
            <select class="input" id="taskPlat" style="max-width:120px">
              <option value="全平台">全平台</option>
              ${plats.map(p => `<option value="${p.name}">${p.name}</option>`).join('')}
            </select>
            <input class="input" id="taskTitle" placeholder="输入海外营销或基建待办任务…"/>
            <select class="input" id="taskPri" style="max-width:95px">
              <option value="高">高优先</option>
              <option value="中" selected>中优先</option>
              <option value="低">低优先</option>
            </select>
            <button class="btn primary sm" id="addTaskBtn">新增任务</button>
          </div>
          <div style="margin-top:12px">
            ${(cc.tasks || []).length ? cc.tasks.map(t => `
              <div class="list-row">
                <input type="checkbox" data-task-toggle="${t.id}" ${t.done ? 'checked' : ''} style="accent-color:var(--ok)"/>
                <span class="chip line">${U.esc(t.platform)}</span>
                <div style="flex:1;min-width:0;${t.done ? 'text-decoration:line-through;color:var(--ink-400)' : ''}">${U.esc(t.title)}</div>
                <span class="chip ${t.priority === '高' ? 'warn' : 'line'}">${U.esc(t.priority)}</span>
                <button class="icon-btn" data-task-del="${t.id}" title="删除">${G.icon('trash', 15)}</button>
              </div>
            `).join('') : '<div class="empty">暂无任务。</div>'}
          </div>
        </div>
      `;
    }

    function renderMetrics() {
      return `
        <div class="callout" style="margin-bottom:16px">
          <span class="ct">数据来源透明声明</span>
          本管理中心为纯静态本地工具，<strong>当前未接入任何平台官方实时 API</strong>。下表严格区分
          <span class="chip blue" style="vertical-align:0">手动录入</span>
          <span class="chip warn" style="vertical-align:0">教学模拟</span>
          与 <span class="chip line" style="vertical-align:0">API未接入</span>，绝不将模拟或手工数据伪装成实时同步数据。
        </div>
        <div class="sec-head"><h2>7. 各平台运营数据记录</h2><span class="more">手动录入真实运营周报，便于跨平台复盘</span></div>
        <div class="card" style="margin-bottom:16px">
          <div class="cc-form-row">
            <select class="input" id="metPlat" style="max-width:120px">
              ${plats.map(p => `<option value="${p.name}">${p.name}</option>`).join('')}
            </select>
            <input class="input" id="metPeriod" placeholder="周期（如 2026-W48）" style="max-width:130px"/>
            <input class="input" id="metReach" placeholder="曝光/播放" style="max-width:110px"/>
            <input class="input" id="metEng" placeholder="互动数" style="max-width:100px"/>
            <input class="input" id="metInq" placeholder="询盘/线索" style="max-width:100px"/>
            <button class="btn primary sm" id="addMetBtn">手动录入</button>
          </div>
        </div>
        <div class="card" style="padding:0;overflow:hidden">
          <div class="tbl-scroll">
            <table class="tbl">
              <tr><th>平台</th><th>统计周期</th><th>曝光/播放</th><th>互动量</th><th>有效询盘</th><th>数据来源</th><th>备注</th><th></th></tr>
              ${(cc.metrics || []).length ? cc.metrics.map(m => `<tr>
                <td><b>${U.esc(m.platform)}</b></td>
                <td class="mono">${U.esc(m.period)}</td>
                <td class="num">${U.esc(m.reach)}</td>
                <td class="num">${U.esc(m.engagement)}</td>
                <td class="num"><b>${U.esc(m.inquiries)}</b></td>
                <td><span class="chip ${badgeClassForSource(m.source)}">${U.esc(m.source)}</span></td>
                <td class="tiny dim">${U.esc(m.note || '')}</td>
                <td><button class="icon-btn" data-met-del="${m.id}" title="删除">${G.icon('trash', 14)}</button></td>
              </tr>`).join('') : '<tr><td colspan="8"><div class="empty">暂无记录，请在上方手动录入各平台官方后台导出的周报数据。</div></td></tr>'}
            </table>
          </div>
        </div>
      `;
    }

    function renderApi() {
      return `
        <div class="callout ok" style="margin-bottom:16px">
          <span class="ct">重要提醒</span>
          <strong>正常发布内容、投放广告与经营企业账号不需要申请开发者账号</strong>。API 与开发者体系属于企业规模化后的技术扩展（用于多平台统一发布、自动数据汇总与 CRM 整合）。
        </div>
        <div class="sec-head"><h2>9. 六大平台开发者生态与 API 接入状态</h2><span class="more"><a href="#/module?id=DA">学习开发者体系课程 →</a></span></div>
        <div class="card" style="padding:0;overflow:hidden">
          <div class="tbl-scroll">
            <table class="tbl">
              <tr><th>平台</th><th>官方开发者生态</th><th>主要能力与合规前提</th><th>当前接入状态</th></tr>
              ${plats.map(p => {
                const a = cc.accounts[p.id] || {};
                return `<tr>
                  <td><b style="color:${p.color}">${p.name}</b></td>
                  <td><b>${p.devPortal}</b></td>
                  <td class="small muted">${p.apiNotes}</td>
                  <td>
                    <select class="cc-sel" data-acc-field="apiStatus" data-plat="${p.id}">
                      ${['暂不需要', '未申请', '沙箱了解', '应用审核中', '已接入第三方授权工具', '自有应用已获授权'].map(o => `<option value="${o}" ${a.apiStatus === o ? 'selected' : ''}>${o}</option>`).join('')}
                    </select>
                  </td>
                </tr>`;
              }).join('')}
            </table>
          </div>
        </div>
      `;
    }

    const tabBody = {
      overview: renderOverview,
      verify: renderVerify,
      assets: renderAssets,
      ops: renderOps,
      metrics: renderMetrics,
      api: renderApi
    }[activeTab]();

    G.mount(`
      <div class="row between" style="align-items:flex-end;gap:12px;flex-wrap:wrap;margin-bottom:14px">
        <div>
          <div class="page-title" style="margin-bottom:2px">Global Social Media Control Center</div>
          <div class="page-sub" style="margin:0">国际企业社交媒体运营管理中心 · ${U.esc(cc.company.name)} ${cc.mode === 'sample' ? '<span class="chip warn" style="margin-left:6px">教学模拟样例</span>' : '<span class="chip blue" style="margin-left:6px">自定义企业台账</span>'}</div>
        </div>
        <div class="row" style="gap:8px;flex-wrap:wrap">
          <button class="btn sm" id="ccSampleBtn">载入生鲜企业样例</button>
          <button class="btn sm" id="ccBlankBtn">切换空白台账</button>
          <button class="btn sm" id="ccExportBtn">导出台账 JSON</button>
        </div>
      </div>

      <div class="stat-grid" style="margin:14px 0 18px">
        <div class="stat-card"><div class="k">账号资料平均完善度</div><div class="v">${avgProfile}%</div><div class="m">覆盖 6 大国际社媒平台</div></div>
        <div class="stat-card"><div class="k">企业资质认证进度</div><div class="v">${verifiedCount} / ${plats.length}</div><div class="m">区分资质核验与公众标识</div></div>
        <div class="stat-card"><div class="k">账号安全自检得分</div><div class="v">${secPct}%</div><div class="m">2FA / 权限隔离 / 交接备份</div></div>
        <div class="stat-card"><div class="k">海外营销待办完成</div><div class="v">${taskDone} / ${(cc.tasks || []).length}</div><div class="m">内容排期 ${(cc.posts || []).length} 条</div></div>
      </div>

      <div class="filter-bar" id="ccTabs">
        ${tabs.map(t => `<button class="${activeTab === t.id ? 'on' : ''}" data-cc-tab="${t.id}">${t.label}</button>`).join('')}
      </div>

      ${tabBody}
    `);

    // 顶部操作事件
    document.getElementById('ccSampleBtn').addEventListener('click', () => {
      S.replaceControl(D.controlDefaults.createSample());
      G.toast('已载入国际生鲜企业教学模拟样例');
      G.views.control();
    });
    document.getElementById('ccBlankBtn').addEventListener('click', () => {
      if (!confirm('将当前管理中心重置为空白自定义企业台账？（不会影响你的课程学习进度）')) return;
      S.replaceControl(D.controlDefaults.createBlank());
      G.toast('已切换为空白自定义台账');
      G.views.control();
    });
    document.getElementById('ccExportBtn').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(ensureData(), null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'gba-control-center-' + U.todayKey() + '.json';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 3000);
      G.toast('管理中心台账已导出');
    });

    // Tab 切换
    document.querySelectorAll('[data-cc-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.ccTab;
        G.views.control();
      });
    });

    // 账号字段修改（select / input）
    document.querySelectorAll('[data-acc-field]').forEach(el => {
      const ev = el.tagName === 'SELECT' ? 'change' : 'change';
      el.addEventListener(ev, () => {
        const pid = el.dataset.plat, f = el.dataset.accField, val = el.value;
        S.setControl(c => {
          if (!c.accounts[pid]) c.accounts[pid] = { profile: {} };
          c.accounts[pid][f] = val;
        });
        G.toast('已保存变更');
        if (el.tagName === 'SELECT') G.views.control();
      });
    });

    // 资料完善度勾选
    document.querySelectorAll('[data-prof-key]').forEach(cb => {
      cb.addEventListener('change', () => {
        const pid = cb.dataset.plat, k = cb.dataset.profKey, checked = cb.checked;
        S.setControl(c => {
          if (!c.accounts[pid].profile) c.accounts[pid].profile = {};
          c.accounts[pid].profile[k] = checked;
        });
        G.views.control();
      });
    });

    // 资产增删改
    const addAssetBtn = document.getElementById('addAssetBtn');
    if (addAssetBtn) {
      addAssetBtn.addEventListener('click', () => {
        const name = document.getElementById('assetName').value.trim();
        if (!name) { G.toast('请填写资产名称'); return; }
        const category = document.getElementById('assetCat').value;
        const value = document.getElementById('assetVal').value.trim();
        S.setControl(c => { c.assets.unshift({ id: 'a' + Date.now(), category, name, value, owner: '自定义', ready: false }); });
        G.toast('资产已添加到清单');
        G.views.control();
      });
    }
    document.querySelectorAll('[data-asset-toggle]').forEach(cb => {
      cb.addEventListener('change', () => {
        S.setControl(c => { const x = c.assets.find(a => a.id === cb.dataset.assetToggle); if (x) x.ready = cb.checked; });
        G.views.control();
      });
    });
    document.querySelectorAll('[data-asset-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        S.setControl(c => { c.assets = c.assets.filter(a => a.id !== btn.dataset.assetDel); });
        G.views.control();
      });
    });

    // 安全检查勾选
    document.querySelectorAll('[data-sec-id]').forEach(cb => {
      cb.addEventListener('change', () => {
        S.setControl(c => { c.security[cb.dataset.secId] = cb.checked; });
        G.views.control();
      });
    });

    // 内容排期
    const addPostBtn = document.getElementById('addPostBtn');
    if (addPostBtn) {
      addPostBtn.addEventListener('click', () => {
        const title = document.getElementById('postTitle').value.trim();
        if (!title) { G.toast('请填写内容主题'); return; }
        const platform = document.getElementById('postPlat').value;
        const date = document.getElementById('postDate').value;
        S.setControl(c => { c.posts.unshift({ id: 'cp' + Date.now(), platform, title, date, status: '待发布', goal: '' }); });
        G.toast('已加入内容发布计划');
        G.views.control();
      });
    }
    const postStates = ['制作中', '待发布', '已排期', '已发布'];
    document.querySelectorAll('[data-post-cycle]').forEach(btn => {
      btn.addEventListener('click', () => {
        S.setControl(c => {
          const p = c.posts.find(x => x.id === btn.dataset.postCycle);
          if (p) p.status = postStates[(postStates.indexOf(p.status) + 1) % postStates.length];
        });
        G.views.control();
      });
    });
    document.querySelectorAll('[data-post-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        S.setControl(c => { c.posts = c.posts.filter(x => x.id !== btn.dataset.postDel); });
        G.views.control();
      });
    });

    // 任务管理
    const addTaskBtn = document.getElementById('addTaskBtn');
    if (addTaskBtn) {
      addTaskBtn.addEventListener('click', () => {
        const title = document.getElementById('taskTitle').value.trim();
        if (!title) { G.toast('请输入任务内容'); return; }
        const platform = document.getElementById('taskPlat').value;
        const priority = document.getElementById('taskPri').value;
        S.setControl(c => { c.tasks.unshift({ id: 't' + Date.now(), platform, title, priority, done: false }); });
        G.toast('任务已添加');
        G.views.control();
      });
    }
    document.querySelectorAll('[data-task-toggle]').forEach(cb => {
      cb.addEventListener('change', () => {
        S.setControl(c => { const t = c.tasks.find(x => x.id === cb.dataset.taskToggle); if (t) t.done = cb.checked; });
        G.views.control();
      });
    });
    document.querySelectorAll('[data-task-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        S.setControl(c => { c.tasks = c.tasks.filter(x => x.id !== btn.dataset.taskDel); });
        G.views.control();
      });
    });

    // 数据手动录入
    const addMetBtn = document.getElementById('addMetBtn');
    if (addMetBtn) {
      addMetBtn.addEventListener('click', () => {
        const period = document.getElementById('metPeriod').value.trim() || U.todayKey();
        const reach = document.getElementById('metReach').value.trim() || '0';
        const engagement = document.getElementById('metEng').value.trim() || '0';
        const inquiries = document.getElementById('metInq').value.trim() || '0';
        const platform = document.getElementById('metPlat').value;
        S.setControl(c => {
          c.metrics.unshift({ id: 'm' + Date.now(), platform, period, reach, engagement, inquiries, source: '手动录入', note: '由运营人员手动录入' });
        });
        G.toast('已手动录入运营数据');
        G.views.control();
      });
    }
    document.querySelectorAll('[data-met-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        S.setControl(c => { c.metrics = c.metrics.filter(x => x.id !== btn.dataset.metDel); });
        G.views.control();
      });
    });
  };
})(window.GBA = window.GBA || {});
