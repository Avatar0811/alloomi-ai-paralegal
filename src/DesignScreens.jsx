import React, { useEffect, useMemo, useRef, useState } from "react";
import "./designScreens.css";

const requestedScreen =
  new URLSearchParams(window.location.search).get("screen") || "workbench";

const navItems = [
  ["ri-home-5-line", "工作台"],
  ["ri-file-list-3-line", "合同审阅"],
  ["ri-stack-line", "项目空间"],
  ["ri-archive-stack-line", "成果包"],
];

const issueSeed = [
  {
    id: "ISS-001",
    title: "责任限制上限缺失",
    clause: "第 8.2 条",
    section: "责任限制",
    severity: "高",
    status: "待处理",
    evidence:
      "8.2 在适用法律允许的最大范围内，乙方不对因本协议引起或与本协议有关的任何间接、附带、特殊、惩罚性或后果性损害承担责任。",
    recommendation:
      "8.2 乙方对因本协议引起或与本协议有关的任何直接损害的累计责任总额不超过过去 12 个月内甲方向乙方支付的服务费用总额。本条款不限制乙方因重大过失、故意不当行为或违反数据保护法律应承担的责任。",
    reason:
      "当前条款未设定赔偿责任上限，可能导致无限赔付风险。建议引入与合同价值挂钩的上限，并保留法定责任例外。",
    confidence: 92,
  },
  {
    id: "ISS-002",
    title: "数据泄露通知期限过长",
    clause: "第 9.2 条",
    section: "数据安全",
    severity: "高",
    status: "待处理",
    evidence:
      "9.2 如发生可能影响甲方数据安全的事件，乙方应在发现事件后十（10）个工作日内向甲方发出书面通知。",
    recommendation:
      "9.2 如发生实际或疑似数据安全事件，乙方应在发现后 24 小时内向甲方发出初步通知，并持续提供调查进展、影响范围与补救措施。",
    reason:
      "10 个工作日无法支持甲方及时履行监管和客户通知义务，建议与采购 Playbook 的 24 小时底线保持一致。",
    confidence: 95,
  },
  {
    id: "ISS-003",
    title: "服务可用性指标不明确",
    clause: "第 3.2 条",
    section: "服务水平",
    severity: "中",
    status: "待处理",
    evidence:
      "3.2 乙方应尽商业上合理努力保障服务稳定运行，并及时处理影响服务使用的问题。",
    recommendation:
      "3.2 乙方应保证每自然月服务可用性不低于 99.9%，并按附件 SLA 的测量口径提供服务抵扣及连续不达标时的解约权。",
    reason:
      "“商业上合理努力”无法形成可测量的交付标准，也未约定不达标后的补救机制。",
    confidence: 88,
  },
  {
    id: "ISS-004",
    title: "知识产权归属表述不清",
    clause: "第 7.1 条",
    section: "知识产权",
    severity: "高",
    status: "已编辑",
    evidence: "定制成果及相关知识产权的归属由双方另行协商确定。",
    recommendation: "甲方付费形成的定制交付成果归甲方所有，乙方保留其背景技术及通用能力。",
    reason: "需要明确交付成果与背景知识产权的边界。",
    confidence: 90,
  },
  {
    id: "ISS-005",
    title: "自动续约缺少提醒窗口",
    clause: "第 4.3 条",
    section: "期限与续约",
    severity: "中",
    status: "已采纳",
    evidence: "除非任一方提前通知，本协议将自动续展一年。",
    recommendation: "乙方应至少提前 60 日提醒甲方，甲方可在届满前 30 日书面终止续约。",
    reason: "避免无提醒自动续约造成预算和采购风险。",
    confidence: 91,
  },
  {
    id: "ISS-006",
    title: "付款验收条件不对等",
    clause: "第 5.2 条",
    section: "费用与付款",
    severity: "中",
    status: "已采纳",
    evidence: "服务上线即视为验收完成，甲方应支付全部费用。",
    recommendation: "甲方依据双方确认的验收标准完成书面验收后支付对应阶段费用。",
    reason: "上线不等同于符合约定标准。",
    confidence: 89,
  },
  {
    id: "ISS-007",
    title: "数据跨境授权过宽",
    clause: "第 9.5 条",
    section: "数据安全",
    severity: "高",
    status: "已采纳",
    evidence: "乙方可在全球范围内处理履约所需数据。",
    recommendation: "未经甲方书面同意，乙方不得将甲方数据转移至中国大陆境外。",
    reason: "需要控制跨境处理范围和合规路径。",
    confidence: 93,
  },
  {
    id: "ISS-008",
    title: "分包商责任未穿透",
    clause: "第 6.4 条",
    section: "保密义务",
    severity: "中",
    status: "已采纳",
    evidence: "乙方可委托第三方提供部分服务。",
    recommendation: "乙方应对分包商的行为承担与自身相同的合同责任。",
    reason: "避免分包安排削弱甲方的合同救济。",
    confidence: 87,
  },
  {
    id: "ISS-009",
    title: "终止后数据返还不完整",
    clause: "第 10.2 条",
    section: "终止",
    severity: "中",
    status: "已编辑",
    evidence: "协议终止后，乙方可删除相关数据。",
    recommendation: "乙方应提供不少于 30 日的数据导出窗口，并在甲方确认后安全删除副本。",
    reason: "确保业务连续性和数据可迁移性。",
    confidence: 90,
  },
  {
    id: "ISS-010",
    title: "审计权范围不足",
    clause: "第 9.6 条",
    section: "数据安全",
    severity: "低",
    status: "已采纳",
    evidence: "乙方可自行决定是否提供合规材料。",
    recommendation: "甲方有权每年一次获取独立审计报告并对重大风险开展专项审计。",
    reason: "为持续监督供应商控制措施提供依据。",
    confidence: 84,
  },
  {
    id: "ISS-011",
    title: "通知送达机制不完整",
    clause: "第 12.1 条",
    section: "其他",
    severity: "低",
    status: "已采纳",
    evidence: "双方通知可通过电子方式发送。",
    recommendation: "通知应发送至约定联系人，并明确电子邮件的送达时间与退信处理机制。",
    reason: "降低关键通知的送达争议。",
    confidence: 86,
  },
];

const tasks = [
  {
    title: "SaaS 服务采购合同 V3",
    counterparty: "启明云服务",
    type: "MSA",
    deadline: "今天 18:00",
    risk: "4 高风险",
    state: "Review Ready",
    score: 96,
    reason: "签署截止临近，存在责任上限与数据跨境风险",
  },
  {
    title: "渠道合作协议 V2",
    counterparty: "青禾零售",
    type: "合作协议",
    deadline: "明天 12:00",
    risk: "2 高风险",
    state: "Needs Info",
    score: 88,
    reason: "待业务确认排他范围与最低采购承诺",
  },
  {
    title: "数据处理协议 DPA",
    counterparty: "峰岚智造",
    type: "DPA",
    deadline: "8 月 1 日",
    risk: "1 高风险",
    state: "New Version",
    score: 82,
    reason: "对方回传新版本，检测到 7 处实质变化",
  },
  {
    title: "品牌联合营销协议",
    counterparty: "墨山咖啡",
    type: "营销",
    deadline: "8 月 3 日",
    risk: "中风险",
    state: "Ready to Review",
    score: 68,
    reason: "授权素材范围和终止后的使用权需确认",
  },
];

function Icon({ name }) {
  return <i className={name} aria-hidden="true" />;
}

function Tag({ tone = "blue", children }) {
  return <span className={`hf-tag hf-tag-${tone}`}>{children}</span>;
}

function Button({
  tone = "secondary",
  icon,
  children,
  className = "",
  onClick,
  disabled = false,
}) {
  return (
    <button
      className={`hf-button hf-button-${tone} ${className}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <Icon name={icon} />}
      <span>{children}</span>
    </button>
  );
}

function Sidebar({ active = "合同审阅", onNavigate }) {
  return (
    <aside className="hf-sidebar">
      <div className="hf-brand">
        <img src={`${import.meta.env.BASE_URL}assets/alloomi-logo.svg`} alt="Alloomi" />
      </div>
      <nav>
        {navItems.map(([icon, label]) => (
          <button
            className={label === active ? "active" : ""}
            type="button"
            key={label}
            onClick={() => onNavigate?.(label)}
          >
            <Icon name={icon} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="hf-sidebar-bottom">
        <button type="button">
          <Icon name="ri-settings-3-line" />
          <span>设置</span>
        </button>
        <div className="hf-profile">
          <span className="hf-avatar">L</span>
          <span>
            <strong>Leo Zu</strong>
            <small>项目法务</small>
          </span>
          <Icon name="ri-arrow-down-s-line" />
        </div>
      </div>
    </aside>
  );
}

function Topbar({
  mode = "review",
  onMenu,
  onMore,
  moreIcon = "ri-more-fill",
  moreLabel = "更多操作",
}) {
  const dashboard = mode === "dashboard";

  return (
    <header className="hf-topbar">
      <div className="hf-topbar-left">
        <button className="hf-icon-button" type="button" onClick={onMenu} aria-label="打开导航">
          <Icon name="ri-menu-2-line" />
        </button>
        <button className="hf-project-switcher" type="button">
          <span>{dashboard ? "云途科技 · 法务工作区" : "云途科技 × 启明云服务"}</span>
          <Icon name="ri-arrow-down-s-line" />
        </button>
        <span className="hf-divider" />
        <div className="hf-contract-name">
          <Icon name={dashboard ? "ri-sparkling-line" : "ri-file-word-line"} />
          <strong>{dashboard ? "AI 法务运营中心" : "SaaS 服务采购合同 V3"}</strong>
          <Tag tone="blue">{dashboard ? "AI Paralegal" : "采购方"}</Tag>
          {mode === "compare" && <Tag tone="violet">版本对比</Tag>}
        </div>
      </div>
      <div className="hf-topbar-right">
        <span>
          <Icon name={dashboard ? "ri-calendar-check-line" : "ri-calendar-line"} />
          {dashboard ? "2026 年 7 月 30 日 · 周四" : "截止 2026-07-31 18:00"}
        </span>
        <span className="hf-divider" />
        <span>
          <Icon name={dashboard ? "ri-pulse-line" : "ri-checkbox-circle-line"} />
          {dashboard ? "AI 正常运行" : "已自动保存 11:30"}
        </span>
        <button className="hf-icon-button" type="button" onClick={onMore} aria-label={moreLabel}>
          <Icon name={moreIcon} />
        </button>
      </div>
    </header>
  );
}

function Shell({
  children,
  className = "",
  mode = "review",
  active = "合同审阅",
  onNavigate,
  onMenu,
  onMore,
  moreIcon,
  moreLabel,
}) {
  return (
    <div className={`hf-shell ${className}`}>
      <Sidebar active={active} onNavigate={onNavigate} />
      <Topbar
        mode={mode}
        onMenu={onMenu}
        onMore={onMore}
        moreIcon={moreIcon}
        moreLabel={moreLabel}
      />
      {children}
    </div>
  );
}

const initialWorkbenchReviewContext = {
  position: "采购方",
  amount: "¥ 680,000 / 年",
  jurisdiction: "中国大陆",
  depth: "标准审阅",
  baseline: "责任上限 ≤ 12 个月服务费；数据事件 24 小时通知",
};

function WorkbenchReviewDrawer({
  open,
  task,
  onClose,
  onSave,
  onIgnore,
  onConfirm,
}) {
  const [reviewContext, setReviewContext] = useState(initialWorkbenchReviewContext);
  const [draftContext, setDraftContext] = useState(initialWorkbenchReviewContext);
  const [editingContext, setEditingContext] = useState(false);

  useEffect(() => {
    if (!open) {
      setEditingContext(false);
      setDraftContext(reviewContext);
    }
  }, [open, reviewContext]);

  if (!open) return null;

  const updateDraft = (field, value) => {
    setDraftContext((current) => ({ ...current, [field]: value }));
  };

  const beginEditing = () => {
    setDraftContext(reviewContext);
    setEditingContext(true);
  };

  const cancelEditing = () => {
    setDraftContext(reviewContext);
    setEditingContext(false);
  };

  const saveContext = () => {
    const nextContext = {
      ...draftContext,
      amount: draftContext.amount.trim(),
      baseline: draftContext.baseline.trim(),
    };
    setReviewContext(nextContext);
    setDraftContext(nextContext);
    setEditingContext(false);
    onSave(nextContext);
  };

  const canSave =
    draftContext.amount.trim().length > 0 &&
    draftContext.baseline.trim().length > 0;

  return (
    <>
      <button
        className="hf-workbench-review-backdrop"
        type="button"
        aria-label="关闭合同审阅详情"
        onClick={onClose}
      />
      <aside
        className="hf-task-detail hf-workbench-review-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hf-workbench-review-title"
      >
        <header>
          <div>
            <span className="hf-eyebrow">TASK · {task.drawerTaskId}</span>
            <h2 id="hf-workbench-review-title">{task.drawerTitle}</h2>
            <p>{task.drawerSubtitle}</p>
          </div>
          <button
            className="hf-icon-button"
            type="button"
            onClick={onClose}
            aria-label="关闭合同审阅详情"
          >
            <Icon name="ri-close-line" />
          </button>
        </header>

        <div className="hf-detail-scroll">
          <section className="hf-reason-box">
            <span><Icon name="ri-sparkling-line" />AI 建议处理</span>
            <p>{task.drawerReason}</p>
          </section>

          <section>
            <div className="hf-section-title">
              <h3>Review Context</h3>
              {editingContext ? (
                <div className="hf-context-edit-actions">
                  <button type="button" onClick={cancelEditing}>取消</button>
                  <button
                    className="primary"
                    type="button"
                    disabled={!canSave}
                    onClick={saveContext}
                  >
                    保存
                  </button>
                </div>
              ) : (
                <button type="button" onClick={beginEditing}>编辑</button>
              )}
            </div>
            {editingContext ? (
              <div className="hf-context-grid editing">
                <label>
                  <span>我方立场</span>
                  <select
                    autoFocus
                    value={draftContext.position}
                    onChange={(event) => updateDraft("position", event.target.value)}
                  >
                    <option>采购方</option>
                    <option>供应商</option>
                    <option>中立审阅</option>
                  </select>
                </label>
                <label>
                  <span>交易金额</span>
                  <input
                    value={draftContext.amount}
                    onChange={(event) => updateDraft("amount", event.target.value)}
                  />
                </label>
                <label>
                  <span>适用法域</span>
                  <select
                    value={draftContext.jurisdiction}
                    onChange={(event) => updateDraft("jurisdiction", event.target.value)}
                  >
                    <option>中国大陆</option>
                    <option>中国香港</option>
                    <option>新加坡</option>
                  </select>
                </label>
                <label>
                  <span>审阅深度</span>
                  <select
                    value={draftContext.depth}
                    onChange={(event) => updateDraft("depth", event.target.value)}
                  >
                    <option>快速审阅</option>
                    <option>标准审阅</option>
                    <option>深度审阅</option>
                  </select>
                </label>
                <label className="wide">
                  <span>业务底线</span>
                  <textarea
                    value={draftContext.baseline}
                    onChange={(event) => updateDraft("baseline", event.target.value)}
                  />
                </label>
              </div>
            ) : (
              <dl className="hf-context-grid">
                <div><dt>我方立场</dt><dd>{reviewContext.position}</dd></div>
                <div><dt>交易金额</dt><dd>{reviewContext.amount}</dd></div>
                <div><dt>适用法域</dt><dd>{reviewContext.jurisdiction}</dd></div>
                <div><dt>审阅深度</dt><dd>{reviewContext.depth}</dd></div>
                <div className="wide"><dt>业务底线</dt><dd>{reviewContext.baseline}</dd></div>
              </dl>
            )}
          </section>

          <section>
            <div className="hf-section-title">
              <h3>风险概览</h3>
              <span>11 个问题</span>
            </div>
            <div className="hf-risk-summary">
              <div className="critical"><strong>0</strong><span>Critical</span></div>
              <div className="high"><strong>4</strong><span>High</span></div>
              <div className="medium"><strong>4</strong><span>Medium</span></div>
              <div className="low"><strong>3</strong><span>Low</span></div>
            </div>
          </section>

          <section>
            <div className="hf-section-title">
              <h3>版本链</h3>
              <span>3 个版本</span>
            </div>
            <div className="hf-version-line">
              <span className="done" />
              <div><strong>客户初稿 V1</strong><small>邮件 · 7 月 25 日</small></div>
              <span className="done" />
              <div><strong>我方红线 V2</strong><small>Leo · 7 月 27 日</small></div>
              <span className="active" />
              <div><strong>对方回传 V3</strong><small>邮件 · 今天 10:24</small></div>
            </div>
          </section>

          <section className="hf-safety-note">
            <Icon name="ri-shield-check-line" />
            <p>以下为 AI 初筛和修订建议，不构成最终法律意见，请由法务 owner 确认。</p>
          </section>
        </div>

        <footer>
          <Button icon="ri-chat-1-line" onClick={onIgnore}>忽略并反馈</Button>
          <Button tone="primary" icon="ri-play-circle-line" onClick={onConfirm}>
            确认开始审阅
          </Button>
        </footer>
      </aside>
    </>
  );
}

function Workbench({
  processed,
  onNavigate,
  onOpenContext,
  onOpenTasks,
  onSelectTask,
  onOpenWorkspace,
  onOpenCompare,
  onOpenExport,
  onUpload,
  onNotify,
  workspaceProps,
  exportModalProps,
}) {
  const [feedFilter, setFeedFilter] = useState("全部");
  const [goalRange, setGoalRange] = useState("今日");
  const [showAll, setShowAll] = useState(false);
  const [composer, setComposer] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(true);
  const [mobileActivityOpen, setMobileActivityOpen] = useState(false);
  const [reviewDrawerOpen, setReviewDrawerOpen] = useState(false);
  const [selectedReviewItemId, setSelectedReviewItemId] = useState("scan");
  const [workspaceDrawerOpen, setWorkspaceDrawerOpen] = useState(false);
  const [workspaceDrawerCompare, setWorkspaceDrawerCompare] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  useEffect(() => {
    if (!reviewDrawerOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setReviewDrawerOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [reviewDrawerOpen]);

  useEffect(() => {
    if (!workspaceDrawerOpen && !exportModalOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      if (exportModalOpen) {
        setExportModalOpen(false);
      } else {
        setWorkspaceDrawerOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [workspaceDrawerOpen, exportModalOpen]);

  const openReviewDrawer = (itemId) => {
    setSelectedReviewItemId(itemId);
    setReviewDrawerOpen(true);
  };

  const briefingItems = [
    {
      id: "scan",
      tone: "blue",
      title: "AI 完成 SaaS 服务采购合同 V3 初筛",
      description: "识别 11 个问题，其中 4 项高风险；责任限制与数据安全需要优先确认。",
      meta: "11:28 · AI 自动执行",
      status: "已处理",
      drawerTaskId: "CR-2026-0730-01",
      drawerTitle: "SaaS 服务采购合同 V3",
      drawerSubtitle: "启明云服务 · MSA · 当前版本 · V3",
      drawerReason: "签署截止临近，存在责任上限与数据跨境风险。建议优先确认审阅上下文并处理高风险条款。",
      action: () => openReviewDrawer("scan"),
    },
    {
      id: "compare",
      tone: "violet",
      title: "已对比 DPA V2 与对方回传版本",
      description: "检测到 7 处实质变化，责任上限与数据留存条款出现新的偏离。",
      meta: "10:46 · 版本监控",
      status: "已处理",
      drawerTaskId: "VM-2026-0803-02",
      drawerTitle: "DPA V2 版本对比",
      drawerSubtitle: "澄星数据 · DPA · 对方回传版本",
      drawerReason: "检测到 7 处实质变化，责任上限与数据留存条款出现新的偏离。建议确认审阅上下文后优先处理新增差异。",
      action: () => openReviewDrawer("compare"),
    },
    {
      id: "owner",
      tone: "red",
      title: "跟进采购 Owner：确认责任上限与数据跨境底线",
      description: "签署截止为今天 18:00，建议在 14:00 前完成业务取舍并回传法务。",
      meta: "SaaS 服务采购合同 V3 · Gmail",
      status: "待处理",
      proactive: true,
      drawerTaskId: "CO-2026-0803-03",
      drawerTitle: "责任上限与数据跨境确认",
      drawerSubtitle: "SaaS 服务采购合同 V3 · 采购 Owner",
      drawerReason: "签署截止为今天 18:00，业务取舍仍未确认。建议先核对责任上限和数据跨境底线，再向采购 Owner 发起确认。",
      action: () => openReviewDrawer("owner"),
    },
    {
      id: "breach",
      tone: "amber",
      title: "核验数据泄露通知时限与补救责任",
      description: "对方版本约定 10 个工作日通知，偏离团队 Playbook 的 24 小时底线。",
      meta: "第 9.2 条 · 数据安全",
      status: "待处理",
      proactive: true,
      drawerTaskId: "CR-2026-0803-04",
      drawerTitle: "数据泄露通知与补救责任",
      drawerSubtitle: "SaaS 服务采购合同 V3 · 第 9.2 条",
      drawerReason: "对方版本约定 10 个工作日通知，偏离团队 Playbook 的 24 小时底线。建议确认审阅上下文后生成替换条款。",
      action: () => openReviewDrawer("breach"),
    },
    {
      id: "minutes",
      tone: "blue",
      title: "会议纪要：每日法务采购同步",
      description: "需补充排他范围、最低采购承诺与上线验收标准，已生成 3 项跟进任务。",
      meta: "会议纪要 · 今天 09:32",
      status: "待处理",
      proactive: true,
      drawerTaskId: "MT-2026-0803-05",
      drawerTitle: "每日法务采购同步",
      drawerSubtitle: "会议纪要 · 今天 09:32 · 3 项跟进任务",
      drawerReason: "会议纪要已识别排他范围、最低采购承诺与上线验收标准三项待办。建议确认上下文后统一进入审阅处理。",
      action: () => openReviewDrawer("minutes"),
    },
    {
      id: "channel",
      tone: "amber",
      title: "核验渠道协议排他范围与最低采购承诺",
      description: "业务背景仍不完整，AI 已整理需要采购团队确认的 5 个问题。",
      meta: "渠道合作协议 V2 · 待补充信息",
      status: "待处理",
      proactive: true,
      drawerTaskId: "CR-2026-0803-06",
      drawerTitle: "渠道协议排他与采购承诺",
      drawerSubtitle: "渠道合作协议 V2 · 待补充业务信息",
      drawerReason: "业务背景仍不完整，AI 已整理 5 个待确认问题。建议先补齐排他范围和最低采购承诺，再开始正式审阅。",
      action: () => openReviewDrawer("channel"),
    },
    {
      id: "package",
      tone: "green",
      title: "SaaS 服务采购合同 V2 Review Package 已归档",
      description: "修订版、带批注版本、审查摘要和执行轨迹均已完成校验。",
      meta: "成果包 · 昨天 17:42",
      status: "已处理",
      drawerTaskId: "PK-2026-0802-07",
      drawerTitle: "SaaS 服务采购合同 V2 成果包",
      drawerSubtitle: "启明云服务 · Review Package · 已归档",
      drawerReason: "修订版、带批注版本、审查摘要和执行轨迹均已完成校验。可在确认上下文后继续查看审阅结果。",
      action: () => openReviewDrawer("package"),
    },
    {
      id: "nda",
      tone: "violet",
      title: "Marketing NDA 红线稿已生成",
      description: "保密期限、允许披露对象和信息返还义务已按标准模板调整。",
      meta: "成果包 · 7 月 28 日",
      status: "已处理",
      drawerTaskId: "CR-2026-0728-08",
      drawerTitle: "Marketing NDA 红线稿",
      drawerSubtitle: "Marketing NDA · 红线版本 · 已生成",
      drawerReason: "保密期限、允许披露对象和信息返还义务已按标准模板调整。建议确认上下文后复核红线结果。",
      action: () => openReviewDrawer("nda"),
    },
  ];

  const selectedReviewItem =
    briefingItems.find((item) => item.id === selectedReviewItemId) ??
    briefingItems[0];

  const visibleBriefingItems = briefingItems
    .filter((item) => feedFilter === "全部" || item.status === feedFilter)
    .slice(0, showAll ? briefingItems.length : 6);

  const recentActivity = [
    ["18:46", "聚焦本周高风险合同清零", "本周", "blue"],
    ["17:38", "生成每日法务采购同步纪要", "会议纪要", "blue"],
    ["16:23", "完成启明云服务合同 V3 初筛", "合同审阅", "green"],
    ["16:12", "检测 DPA 对方版本实质变化", "版本监控", "green"],
    ["15:26", "发送渠道协议补充信息请求", "协作", "blue"],
    ["14:21", "归档 Marketing NDA 红线稿", "成果包", "green"],
  ];

  const submitTask = () => {
    const value = composer.trim();
    if (!value) {
      onNotify("请输入需要 Lexi 执行的任务");
      return;
    }
    setComposer("");
    onNotify(`Lexi 已接收任务：${value}`);
  };

  return (
    <div className="hf-agent-workbench">
      <aside className="hf-agent-rail">
        <div className="hf-agent-brand">
          <img
            src={`${import.meta.env.BASE_URL}assets/alloomi-logo.svg`}
            alt="Alloomi"
          />
        </div>

        <section className="hf-employee-card">
          <header>
            <span>我的员工</span>
            <Icon name="ri-arrow-down-s-line" />
          </header>
          <button
            type="button"
            onClick={() => onNotify("Lexi 的数字员工档案已打开")}
          >
            <img
              src={`${import.meta.env.BASE_URL}assets/lexi-paralegal-avatar.png`}
              alt="AI 法务员工 Lexi"
            />
            <span>
              <strong>Lexi</strong>
              <small>AI 法务助手</small>
            </span>
            <Icon name="ri-id-card-line" />
          </button>
        </section>

        <nav className="hf-agent-nav" aria-label="工作台导航">
          {[
            ["ri-briefcase-4-line", "今日事项", () => setFeedFilter("全部")],
            ["ri-timer-flash-line", "自动任务", onOpenTasks],
            ["ri-history-line", "历史事项", onOpenExport],
            ["ri-building-4-line", "办公室", onOpenWorkspace],
          ].map(([icon, label, action], index) => (
            <button
              className={index === 0 ? "active" : ""}
              type="button"
              key={label}
              onClick={action}
            >
              <Icon name={icon} />
              <span>{label}</span>
              {index === 0 && <em>5</em>}
            </button>
          ))}
        </nav>

        <footer className="hf-agent-user">
          <button type="button" onClick={() => onNotify("个人设置已打开")}>
            <span className="hf-avatar">L</span>
            <span>
              <strong>Leo Zu</strong>
              <small>项目法务</small>
            </span>
            <Icon name="ri-settings-3-line" />
          </button>
        </footer>
      </aside>

      <main className="hf-agent-center">
        <header className="hf-agent-greeting">
          <img
            src={`${import.meta.env.BASE_URL}assets/lexi-paralegal-avatar.png`}
            alt=""
          />
          <div>
            <h1>我已完成今天的合同风险扫描。</h1>
            <p>
              今日已查看 <strong>120</strong> 条信息，
              <strong>3</strong> 个待处理
            </p>
          </div>
          <button
            className="hf-mobile-activity-button"
            type="button"
            onClick={() => setMobileActivityOpen(true)}
            aria-label="查看目标与最近动态"
          >
            <Icon name="ri-pulse-line" />
          </button>
        </header>

        <section className="hf-daily-brief">
          <header>
            <div>
              <h2>今日简报</h2>
              <span>{visibleBriefingItems.length} 条事项</span>
            </div>
            <div className="hf-brief-tools">
              <button
                type="button"
                aria-label="列表视图"
                title="列表视图"
              >
                <Icon name="ri-list-unordered" />
              </button>
              <button
                className={feedFilter === "待处理" ? "active" : ""}
                type="button"
                aria-label="只看待处理"
                title="只看待处理"
                onClick={() =>
                  setFeedFilter((current) =>
                    current === "待处理" ? "全部" : "待处理",
                  )
                }
              >
                <Icon name="ri-filter-3-line" />
              </button>
            </div>
          </header>

          <div className="hf-brief-list">
            {visibleBriefingItems.map((item) => (
              <button
                type="button"
                key={item.id}
                data-testid={`brief-item-${item.id}`}
                onClick={item.action}
              >
                <span className={`hf-brief-dot ${item.tone}`}>
                  <Icon
                    name={
                      item.status === "已处理"
                        ? "ri-checkbox-circle-fill"
                        : "ri-circle-fill"
                    }
                  />
                </span>
                <span className="hf-brief-copy">
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                  <em>{item.meta}</em>
                </span>
                <span className="hf-brief-tags">
                  <Tag tone={item.status === "已处理" ? "green" : "red"}>
                    {item.status}
                  </Tag>
                  {item.proactive && <Tag tone="blue">AI 主动式</Tag>}
                </span>
                <Icon name="ri-arrow-right-s-line" />
              </button>
            ))}
          </div>
          <button
            className="hf-show-more"
            type="button"
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? "收起事项" : "查看更多"}
            <Icon name={showAll ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} />
          </button>
        </section>

        <section className="hf-agent-composer">
          <textarea
            value={composer}
            placeholder="交代一个任务，或提出任何问题..."
            aria-label="向 Lexi 分配任务"
            onChange={(event) => setComposer(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submitTask();
              }
            }}
          />
          <div className="hf-composer-toolbar">
            <div>
              <button
                type="button"
                aria-label="添加附件"
                title="添加附件"
                onClick={onUpload}
              >
                <Icon name="ri-attachment-2" />
              </button>
              <button
                type="button"
                aria-label="安排定时任务"
                title="安排定时任务"
                onClick={() => onNotify("定时任务设置已打开")}
              >
                <Icon name="ri-calendar-schedule-line" />
              </button>
            </div>
            <button
              className="hf-composer-presence"
              type="button"
              aria-label="AI 在线"
              title="AI 在线"
            >
              <Icon name="ri-record-circle-line" />
            </button>
            <button
              type="button"
              aria-label="语音输入"
              title="语音输入"
              onClick={() => onNotify("语音输入已准备")}
            >
              <Icon name="ri-mic-line" />
            </button>
            <button
              className="hf-composer-send"
              type="button"
              aria-label="发送任务"
              onClick={submitTask}
            >
              <Icon name="ri-arrow-up-line" />
            </button>
          </div>
        </section>
      </main>

      <aside
        className={`hf-agent-activity-panel ${mobileActivityOpen ? "mobile-open" : ""}`}
      >
        <button
          className="hf-activity-close"
          type="button"
          aria-label="关闭动态面板"
          onClick={() => setMobileActivityOpen(false)}
        >
          <Icon name="ri-close-line" />
        </button>

        <section className="hf-goal-card">
          <header>
            <h2>目标</h2>
            <button
              type="button"
              aria-label="编辑目标"
              onClick={() => onNotify("目标编辑已打开")}
            >
              <Icon name="ri-edit-line" />
            </button>
          </header>
          <div className="hf-goal-overview">
            <span className="hf-goal-progress">
              <Icon name="ri-donut-chart-fill" />
              <strong>72%</strong>
            </span>
            <p>本周完成 18 份合同审阅，清零高风险待确认事项</p>
          </div>
          <div className="hf-goal-tabs" role="tablist" aria-label="目标周期">
            {["今日", "本周", "本月"].map((range) => (
              <button
                className={goalRange === range ? "active" : ""}
                type="button"
                role="tab"
                aria-selected={goalRange === range}
                key={range}
                onClick={() => setGoalRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
          <div className="hf-goal-metrics">
            {[
              ["审阅合同数", goalRange === "今日" ? "8" : goalRange === "本周" ? "14" : "42"],
              ["高风险关闭", goalRange === "今日" ? "5" : goalRange === "本周" ? "9" : "21"],
              ["更新版本数", goalRange === "今日" ? "3" : goalRange === "本周" ? "7" : "16"],
            ].map(([label, value]) => (
              <span key={label}>
                <small>{label}</small>
                <strong>{value}</strong>
              </span>
            ))}
          </div>
        </section>

        <section className="hf-activity-stream">
          <header>
            <h2>最近动态</h2>
            <button
              type="button"
              aria-label="刷新动态"
              onClick={() => onNotify("最近动态已刷新")}
            >
              <Icon name="ri-refresh-line" />
            </button>
          </header>
          <div>
            {recentActivity.map(([time, title, type, tone], index) => (
              <button
                type="button"
                key={`${time}-${title}`}
                onClick={
                  index === 2
                    ? onOpenWorkspace
                    : index === 3
                      ? onOpenCompare
                      : index === 5
                        ? onOpenExport
                        : () => onNotify(`${type}详情已打开`)
                }
              >
                <Icon
                  name={
                    tone === "green"
                      ? "ri-checkbox-circle-fill"
                      : "ri-radio-button-line"
                  }
                />
                <span>
                  <strong>{title}</strong>
                  <small>{type}</small>
                </span>
                <time>{time}</time>
              </button>
            ))}
          </div>
        </section>

        {notificationOpen && (
          <div className="hf-agent-notification" role="status">
            <Icon name="ri-checkbox-circle-line" />
            <span>
              <strong>审阅摘要已生成</strong>
              <small>SaaS 服务采购合同 V3</small>
            </span>
            <button
              type="button"
              aria-label="关闭通知"
              onClick={() => setNotificationOpen(false)}
            >
              <Icon name="ri-close-line" />
            </button>
          </div>
        )}
      </aside>

      {mobileActivityOpen && (
        <button
          className="hf-mobile-activity-backdrop"
          type="button"
          aria-label="关闭动态面板"
          onClick={() => setMobileActivityOpen(false)}
        />
      )}

      <WorkbenchReviewDrawer
        open={reviewDrawerOpen}
        task={selectedReviewItem}
        onClose={() => setReviewDrawerOpen(false)}
        onSave={() => onNotify("Review Context 已保存")}
        onIgnore={() => {
          setReviewDrawerOpen(false);
          onNotify("已记录反馈，任务保持在今日简报中");
        }}
        onConfirm={() => {
          setReviewDrawerOpen(false);
          setWorkspaceDrawerCompare(selectedReviewItemId === "compare");
          setWorkspaceDrawerOpen(true);
        }}
      />

      {workspaceDrawerOpen && (
        <>
          <button
            className="hf-workspace-review-backdrop"
            type="button"
            aria-label="关闭合同审阅工作区"
            onClick={() => setWorkspaceDrawerOpen(false)}
          />
          <section
            className="hf-workspace-review-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="SaaS 服务采购合同 V3 审阅工作区"
          >
            <Workspace
              {...workspaceProps}
              compare={workspaceDrawerCompare}
              embedded
              onCloseEmbedded={() => setWorkspaceDrawerOpen(false)}
              onOpenWorkspace={() => setWorkspaceDrawerCompare(false)}
              onOpenCompare={() => setWorkspaceDrawerCompare(true)}
              onOpenExport={() => setExportModalOpen(true)}
            />
          </section>
        </>
      )}

      {exportModalOpen && (
        <ExportModal
          {...exportModalProps}
          embedded
          onClose={() => setExportModalOpen(false)}
        />
      )}
    </div>
  );
}

function DecisionClass({
  selectedTask,
  onSelectTask,
  filter,
  onFilter,
  search,
  onSearch,
  filterMenuOpen,
  onToggleFilterMenu,
  onOpenContext,
  onUpload,
  onNavigate,
  detailOpen,
  onCloseDetail,
  onNotify,
}) {
  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !search ||
        `${task.title}${task.counterparty}${task.reason}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesFilter =
        filter === "全部" ||
        (filter === "高优" && task.risk.includes("高")) ||
        (filter === "新版本" && task.state === "New Version") ||
        (filter === "待协作" && task.state === "Needs Info");
      return matchesSearch && matchesFilter;
    });
  }, [filter, search]);
  const task = tasks[selectedTask];

  return (
    <Shell
      className="hf-decision-screen"
      onNavigate={onNavigate}
      onMenu={() => onNotify("导航已展开")}
      onMore={() => onNotify("更多任务操作")}
    >
      <main className="hf-decision-main">
        <section className="hf-page-heading">
          <div>
            <span className="hf-eyebrow">AI PARALEGAL · CONTRACT REVIEW</span>
            <h1>合同审阅任务</h1>
            <p>按截止时间、业务影响、风险与协作状态为你排序。</p>
          </div>
          <div className="hf-heading-actions">
            <Button icon="ri-upload-2-line" onClick={onUpload}>上传合同</Button>
            <Button tone="primary" icon="ri-add-line" onClick={onOpenContext}>
              新建审阅
            </Button>
          </div>
        </section>

        <section className="hf-metrics">
          <div>
            <span className="hf-metric-icon blue"><Icon name="ri-task-line" /></span>
            <span><small>待处理任务</small><strong>8</strong><em>2 项今日到期</em></span>
          </div>
          <div>
            <span className="hf-metric-icon red"><Icon name="ri-error-warning-line" /></span>
            <span><small>高风险任务</small><strong>3</strong><em>1 项等待确认</em></span>
          </div>
          <div>
            <span className="hf-metric-icon amber"><Icon name="ri-time-line" /></span>
            <span><small>等待协作</small><strong>4</strong><em>最早 4 小时后超时</em></span>
          </div>
          <div>
            <span className="hf-metric-icon green"><Icon name="ri-checkbox-circle-line" /></span>
            <span><small>本周完成</small><strong>12</strong><em>平均节省 38 分钟</em></span>
          </div>
        </section>

        <section className="hf-queue-section">
          <div className="hf-queue-toolbar">
            <div className="hf-segmented">
              {[
                ["全部", 8],
                ["高优", 3],
                ["新版本", 2],
                ["待协作", 4],
              ].map(([label, count]) => (
                <button
                  className={filter === label ? "active" : ""}
                  type="button"
                  key={label}
                  onClick={() => onFilter(label)}
                >
                  {label} <span>{count}</span>
                </button>
              ))}
            </div>
            <div className="hf-toolbar-actions">
              <label className="hf-inline-search">
                <Icon name="ri-search-line" />
                <input
                  value={search}
                  onChange={(event) => onSearch(event.target.value)}
                  placeholder="搜索合同"
                  aria-label="搜索合同"
                />
              </label>
              <button type="button" onClick={onToggleFilterMenu}>
                <Icon name="ri-filter-3-line" />筛选
              </button>
              {filterMenuOpen && (
                <div className="hf-filter-menu">
                  <strong>任务状态</strong>
                  {["全部", "高优", "新版本", "待协作"].map((label) => (
                    <button
                      className={filter === label ? "active" : ""}
                      type="button"
                      key={label}
                      onClick={() => {
                        onFilter(label);
                        onToggleFilterMenu();
                      }}
                    >
                      <Icon
                        name={
                          filter === label
                            ? "ri-radio-button-line"
                            : "ri-checkbox-blank-circle-line"
                        }
                      />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hf-task-table">
            <div className="hf-task-head">
              <span>合同 / 交易对手</span>
              <span>类型</span>
              <span>截止时间</span>
              <span>风险</span>
              <span>状态</span>
              <span>优先级</span>
            </div>
            {visibleTasks.map((item) => {
              const index = tasks.findIndex((candidate) => candidate.title === item.title);
              return (
              <article
                className={index === selectedTask ? "selected" : ""}
                key={item.title}
                tabIndex={0}
                role="button"
                onClick={() => onSelectTask(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    onSelectTask(index);
                  }
                }}
              >
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.counterparty} · {item.reason}</small>
                </div>
                <span>{item.type}</span>
                <span className={index === 0 ? "deadline-hot" : ""}>{item.deadline}</span>
                <span><Tag tone={item.risk.includes("高") ? "red" : "amber"}>{item.risk}</Tag></span>
                <span><Tag tone={item.state === "Needs Info" ? "amber" : item.state === "New Version" ? "violet" : "blue"}>{item.state}</Tag></span>
                <span className="hf-score">{item.score}</span>
              </article>
            );})}
            {!visibleTasks.length && (
              <div className="hf-empty-state">
                <Icon name="ri-file-search-line" />
                <strong>没有匹配的审阅任务</strong>
                <button type="button" onClick={() => onSearch("")}>清除搜索</button>
              </div>
            )}
          </div>
        </section>
      </main>

      <aside className={`hf-task-detail ${detailOpen ? "mobile-open" : ""}`}>
        <header>
          <div>
            <span className="hf-eyebrow">TASK · CR-2026-0730-0{selectedTask + 1}</span>
            <h2>{task.title}</h2>
            <p>{task.counterparty} · {task.type} · 当前版本 V3</p>
          </div>
          <button className="hf-icon-button" type="button" onClick={onCloseDetail} aria-label="关闭任务详情"><Icon name="ri-close-line" /></button>
        </header>
        <div className="hf-detail-scroll">
          <section className="hf-reason-box">
            <span><Icon name="ri-sparkling-line" />AI 建议处理</span>
            <p>{task.reason}。建议优先确认审阅上下文并处理高风险条款。</p>
          </section>

          <section>
            <div className="hf-section-title"><h3>Review Context</h3><button type="button">编辑</button></div>
            <dl className="hf-context-grid">
              <div><dt>我方立场</dt><dd>采购方</dd></div>
              <div><dt>交易金额</dt><dd>¥ 680,000 / 年</dd></div>
              <div><dt>适用法域</dt><dd>中国大陆</dd></div>
              <div><dt>审阅深度</dt><dd>标准审阅</dd></div>
              <div className="wide"><dt>业务底线</dt><dd>责任上限 ≤ 12 个月服务费；数据事件 24 小时通知</dd></div>
            </dl>
          </section>

          <section>
            <div className="hf-section-title"><h3>风险概览</h3><span>11 个问题</span></div>
            <div className="hf-risk-summary">
              <div className="critical"><strong>0</strong><span>Critical</span></div>
              <div className="high"><strong>4</strong><span>High</span></div>
              <div className="medium"><strong>4</strong><span>Medium</span></div>
              <div className="low"><strong>3</strong><span>Low</span></div>
            </div>
          </section>

          <section>
            <div className="hf-section-title"><h3>版本链</h3><span>3 个版本</span></div>
            <div className="hf-version-line">
              <span className="done" />
              <div><strong>客户初稿 V1</strong><small>邮件 · 7 月 25 日</small></div>
              <span className="done" />
              <div><strong>我方红线 V2</strong><small>Leo · 7 月 27 日</small></div>
              <span className="active" />
              <div><strong>对方回传 V3</strong><small>邮件 · 今天 10:24</small></div>
            </div>
          </section>

          <section className="hf-safety-note">
            <Icon name="ri-shield-check-line" />
            <p>以下为 AI 初筛和修订建议，不构成最终法律意见，请由法务 owner 确认。</p>
          </section>
        </div>
        <footer>
          <Button icon="ri-chat-1-line" onClick={() => onNotify("已记录反馈，任务保持在队列中")}>忽略并反馈</Button>
          <Button tone="primary" icon="ri-play-circle-line" onClick={onOpenContext}>
            {task.state === "Needs Info" ? "补充信息并审阅" : "确认开始审阅"}
          </Button>
        </footer>
      </aside>
    </Shell>
  );
}

function IssuePanel({
  issue,
  processed,
  total,
  onResolve,
  onPreviewPackage,
  onClose,
  mobileOpen,
  editing,
  editedText,
  onStartEdit,
  onEditText,
  onSaveEdit,
}) {
  const statusTone =
    issue.status === "待处理"
      ? "blue"
      : issue.status === "已驳回"
        ? "red"
        : issue.status === "协作中"
          ? "violet"
          : "green";

  return (
    <aside className={`hf-issue-panel ${mobileOpen ? "mobile-open" : ""}`}>
      <header>
        <div>
          <div className="hf-issue-heading">
            <h2>{issue.title}</h2>
            <Tag tone={issue.severity === "高" ? "red" : issue.severity === "中" ? "amber" : "blue"}>
              {issue.severity}风险
            </Tag>
          </div>
          <p>{issue.clause} · {issue.section} <Tag tone={statusTone}>{issue.status}</Tag></p>
        </div>
        <button className="hf-icon-button" type="button" onClick={onClose} aria-label="关闭问题面板"><Icon name="ri-close-line" /></button>
      </header>
      <div className="hf-issue-scroll">
        <section>
          <div className="hf-section-title">
            <h3>原文证据</h3>
            <button type="button" onClick={() => document.querySelector(".hf-clause-highlight")?.scrollIntoView({ behavior: "smooth", block: "center" })}>
              <Icon name="ri-map-pin-line" />定位原文
            </button>
          </div>
          <div className="hf-evidence">
            {issue.evidence}
            <footer><Icon name="ri-file-text-line" />SaaS 服务采购合同 V3.docx · {issue.clause}</footer>
          </div>
        </section>
        <section>
          <h3>建议修改</h3>
          {editing ? (
            <textarea
              className="hf-edit-recommendation"
              value={editedText}
              onChange={(event) => onEditText(event.target.value)}
              aria-label="编辑建议文本"
            />
          ) : (
            <div className="hf-recommendation">{issue.recommendation}</div>
          )}
        </section>
        <section>
          <h3>修改理由</h3>
          <p className="hf-body-copy">{issue.reason}</p>
        </section>
        <section>
          <div className="hf-confidence-head"><h3>置信度</h3><strong>{issue.confidence}%</strong></div>
          <div className="hf-progress"><span style={{ width: `${issue.confidence}%` }} /></div>
          <small className="hf-muted">基于 128 份相似交易与团队责任限制 Playbook</small>
        </section>
        <section>
          <h3>操作</h3>
          {editing ? (
            <div className="hf-action-grid hf-edit-actions">
              <Button tone="primary" icon="ri-check-line" onClick={onSaveEdit}>保存并采纳</Button>
              <Button icon="ri-close-line" onClick={onStartEdit}>取消编辑</Button>
            </div>
          ) : (
            <div className="hf-action-grid">
              <Button tone="primary" icon="ri-check-line" onClick={() => onResolve("已采纳")}>采纳修改</Button>
              <Button icon="ri-edit-line" onClick={onStartEdit}>编辑后采纳</Button>
              <Button icon="ri-close-circle-line" onClick={() => onResolve("已驳回")}>驳回</Button>
            </div>
          )}
        </section>
      </div>
      <footer className="hf-panel-footer">
        <span>已处理 {processed} / {total}</span>
        <div className="hf-progress"><span style={{ width: `${(processed / total) * 100}%` }} /></div>
        <button type="button" onClick={onPreviewPackage}>预览成果包</button>
      </footer>
    </aside>
  );
}

function Workspace({
  compare = false,
  issues,
  selectedIssue,
  onSelectIssue,
  onResolve,
  onOpenExport,
  onOpenCompare,
  onOpenWorkspace,
  onNavigate,
  onNotify,
  processed,
  mobileIssueOpen,
  onMobileIssueOpen,
  editing,
  editedText,
  onStartEdit,
  onEditText,
  onSaveEdit,
  documentView,
  onDocumentView,
  zoom,
  onZoom,
  navTab,
  onNavTab,
  materialOnly,
  onMaterialOnly,
  embedded = false,
  onCloseEmbedded,
}) {
  const issue = issues[selectedIssue];
  const outline = [
    ["1", "服务范围", ""],
    ["2", "服务期限", ""],
    ["3", "服务水平", "1"],
    ["4", "期限与续约", "1"],
    ["5", "费用与付款", "2"],
    ["6", "保密义务", ""],
    ["7", "知识产权", "1"],
    ["8", "责任限制", "2"],
    ["9", "数据安全", "2"],
    ["10", "终止", "1"],
  ];

  return (
    <Shell
      className={`hf-workspace-screen ${compare ? "hf-compare-screen" : ""} ${embedded ? "hf-workspace-embedded" : ""}`}
      mode={compare ? "compare" : "review"}
      onNavigate={onNavigate}
      onMenu={() => onNotify("使用左侧导航切换工作区")}
      onMore={
        embedded
          ? onCloseEmbedded
          : () => onNotify("合同操作菜单已就绪")
      }
      moreIcon={embedded ? "ri-close-line" : undefined}
      moreLabel={embedded ? "关闭合同审阅工作区" : undefined}
    >
      <main className="hf-workspace">
        <aside className="hf-clause-nav">
          <div className="hf-clause-search"><Icon name="ri-search-line" /><span>搜索条款或问题</span></div>
          <div className="hf-nav-tabs">
            <button className={navTab === "outline" ? "active" : ""} type="button" onClick={() => onNavTab("outline")}>目录</button>
            <button className={navTab === "issues" ? "active" : ""} type="button" onClick={() => onNavTab("issues")}>问题 {issues.length}</button>
          </div>
          {compare ? (
            <div className="hf-version-sidebar">
              <h3>版本链</h3>
              <article><span className="hf-version-dot" /><div><strong>客户初稿 V1</strong><small>7 月 25 日 · 邮件</small></div></article>
              <article><span className="hf-version-dot" /><div><strong>我方红线 V2</strong><small>7 月 27 日 · Leo</small></div></article>
              <article className="active"><span className="hf-version-dot" /><div><strong>对方回传 V3</strong><small>今天 10:24 · 邮件</small></div></article>
              <div className="hf-diff-stats">
                <span><strong>8</strong>实质变化</span>
                <span><strong>5</strong>问题已解决</span>
                <span><strong>1</strong>重新打开</span>
              </div>
            </div>
          ) : navTab === "outline" ? (
            <div className="hf-outline">
              {outline.map(([num, label, count]) => (
                <button
                  className={issue.section === label ? "active" : ""}
                  type="button"
                  key={num}
                  onClick={() => {
                    const nextIssue = issues.findIndex((item) => item.section === label);
                    if (nextIssue >= 0) onSelectIssue(nextIssue);
                  }}
                >
                  <span>{num}</span><strong>{label}</strong>{count && <em>{count}</em>}
                </button>
              ))}
            </div>
          ) : (
            <div className="hf-issue-list">
              {issues.map((item, index) => (
                <button
                  className={index === selectedIssue ? "active" : ""}
                  type="button"
                  key={item.id}
                  onClick={() => onSelectIssue(index)}
                >
                  <span className={`hf-issue-dot ${item.severity === "高" ? "red" : item.severity === "中" ? "amber" : "blue"}`} />
                  <span><strong>{item.title}</strong><small>{item.clause} · {item.status}</small></span>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="hf-document-area">
          <header className="hf-document-toolbar">
            <div className="hf-view-switch">
              <button className={!compare && documentView === "original" ? "active" : ""} type="button" onClick={() => { onOpenWorkspace(); onDocumentView("original"); }}>原文</button>
              <button className={!compare && documentView === "redline" ? "active blue" : ""} type="button" onClick={() => { onOpenWorkspace(); onDocumentView("redline"); }}>红线</button>
              <button className={compare ? "active violet" : ""} type="button" onClick={onOpenCompare}>版本对比</button>
              <button className={!compare && documentView === "summary" ? "active" : ""} type="button" onClick={() => { onOpenWorkspace(); onDocumentView("summary"); }}>审查摘要</button>
            </div>
            <div className="hf-doc-tools">
              <button type="button" onClick={() => onZoom(-4)} aria-label="缩小"><Icon name="ri-subtract-line" /></button>
              <span>{zoom}%</span>
              <button type="button" onClick={() => onZoom(4)} aria-label="放大"><Icon name="ri-add-line" /></button>
              <span className="hf-divider" />
              <button className="hf-mobile-only" type="button" onClick={() => onMobileIssueOpen(true)} aria-label="打开问题面板"><Icon name="ri-list-check-3" /></button>
              <Button tone="primary" icon="ri-download-2-line" onClick={onOpenExport}>导出</Button>
            </div>
          </header>
          {compare ? (
            <SemanticDiff
              materialOnly={materialOnly}
              onMaterialOnly={onMaterialOnly}
              onReopen={() => onResolve("待处理")}
            />
          ) : documentView === "summary" ? (
            <ReviewSummary issues={issues} processed={processed} onSelectIssue={onSelectIssue} />
          ) : (
            <DocumentPage issue={issue} showRedline={documentView === "redline"} zoom={zoom} />
          )}
        </section>
        <IssuePanel
          issue={issue}
          processed={processed}
          total={issues.length}
          onResolve={onResolve}
          onPreviewPackage={onOpenExport}
          onClose={() => onMobileIssueOpen(false)}
          mobileOpen={mobileIssueOpen}
          editing={editing}
          editedText={editedText}
          onStartEdit={onStartEdit}
          onEditText={onEditText}
          onSaveEdit={onSaveEdit}
        />
      </main>
    </Shell>
  );
}

function DocumentPage({ issue, showRedline, zoom }) {
  return (
    <div className="hf-document-scroll">
      <article className="hf-document-page" style={{ "--document-zoom": zoom / 100 }}>
        <div className="hf-document-meta">SaaS 服务采购合同</div>
        <h1>软件即服务采购与使用协议</h1>
        <p className="hf-doc-lead">本协议由云途科技有限公司（“甲方”）与启明云服务有限公司（“乙方”）于 2026 年 7 月 25 日签订。</p>
        <h2>{issue.clause.match(/\d+/)?.[0] || "8"}. {issue.section}</h2>
        <p>本节约定双方在{issue.section}事项下的权利、义务、处理标准与补救机制。</p>
        <div className="hf-clause-highlight">
          <span className="hf-clause-anchor">{issue.id} · {issue.severity}风险</span>
          <p>{issue.evidence}</p>
          {showRedline && (
            <div className="hf-redline-block">
              <span className="hf-change-label">AI 建议新增</span>
              <p>{issue.recommendation}</p>
            </div>
          )}
        </div>
        <p><strong>8.3</strong> 本条款不限制或排除任何一方因其重大过失、故意不当行为或违反数据保护法律应承担的责任。</p>
        <h2>9. 数据安全与合规</h2>
        <p><strong>9.1</strong> 乙方应采取与行业标准相符的技术与组织措施，保护甲方数据免受未经授权的访问、使用或披露。</p>
        <div className="hf-clause-medium">
          <span className="hf-clause-anchor">ISS-002 · 高风险</span>
          <p><strong>9.2</strong> 如发生可能影响甲方数据安全的事件，乙方应在发现事件后十（10）个工作日内向甲方发出书面通知。</p>
        </div>
        <p className="hf-page-number">7</p>
      </article>
    </div>
  );
}

function ReviewSummary({ issues, processed, onSelectIssue }) {
  const highRisk = issues.filter((issue) => issue.severity === "高").length;
  const pending = issues.filter((issue) => ["待处理", "协作中"].includes(issue.status)).length;

  return (
    <div className="hf-review-summary">
      <header>
        <span className="hf-eyebrow">AI REVIEW SUMMARY</span>
        <h1>合同审查摘要</h1>
        <p>采购方视角 · 标准审阅 · 团队 Playbook v4.2</p>
      </header>
      <div className="hf-summary-metrics">
        <div><span>整体风险</span><strong className="red">高</strong><small>{highRisk} 项高风险</small></div>
        <div><span>处理进度</span><strong>{processed}/{issues.length}</strong><small>{pending} 项需要确认</small></div>
        <div><span>版本状态</span><strong>V3</strong><small>对方回传版本</small></div>
        <div><span>建议结论</span><strong className="amber">有条件推进</strong><small>需解决责任与数据条款</small></div>
      </div>
      <section className="hf-summary-callout">
        <Icon name="ri-sparkling-line" />
        <div>
          <strong>执行摘要</strong>
          <p>合同主体结构完整，但责任上限、数据事件通知和服务水平仍偏离采购底线。建议完成 3 项待处理问题后再进入签署流程。</p>
        </div>
      </section>
      <section className="hf-summary-table">
        <header><strong>关键问题</strong><span>点击问题可回到逐条审阅</span></header>
        {issues.slice(0, 6).map((issue, index) => (
          <button type="button" key={issue.id} onClick={() => onSelectIssue(index)}>
            <span>{issue.id}</span>
            <strong>{issue.title}</strong>
            <span>{issue.clause}</span>
            <Tag tone={issue.severity === "高" ? "red" : "amber"}>{issue.severity}风险</Tag>
            <Tag tone={issue.status === "待处理" ? "blue" : "green"}>{issue.status}</Tag>
            <Icon name="ri-arrow-right-s-line" />
          </button>
        ))}
      </section>
    </div>
  );
}

function SemanticDiff({ materialOnly, onMaterialOnly, onReopen }) {
  return (
    <div className="hf-compare-wrap">
      <div className="hf-compare-header">
        <div><Tag tone="blue">我方红线 V2</Tag><span>7 月 27 日 · Leo</span></div>
        <Icon name="ri-arrow-left-right-line" />
        <div><Tag tone="violet">对方回传 V3</Tag><span>今天 10:24 · 邮件</span></div>
      </div>
      <div className="hf-diff-banner">
        <Icon name="ri-sparkling-line" />
        <p><strong>语义差异已生成。</strong>检测到 8 处实质变化，5 个原问题已解决，1 个问题需要重新确认。</p>
        <button className={materialOnly ? "active" : ""} type="button" onClick={onMaterialOnly}>
          <Icon name={materialOnly ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line"} />
          仅看实质变化
        </button>
      </div>
      <div className="hf-diff-columns">
        <article>
          <header>我方红线 V2 <span>第 8.2 条</span></header>
          <h2>8. 责任限制</h2>
          <p>8.2 乙方对因本协议引起或与本协议有关的任何直接损害的累计责任总额不超过</p>
          <p className="hf-diff-delete">过去 12 个月内甲方向乙方支付的服务费用总额。</p>
          <p>本条款不限制乙方因重大过失、故意不当行为或违反数据保护法律应承担的责任。</p>
        </article>
        <article>
          <header>对方回传 V3 <span>第 8.2 条</span></header>
          <h2>8. 责任限制</h2>
          <p>8.2 乙方对因本协议引起或与本协议有关的任何直接损害的累计责任总额不超过</p>
          <p className="hf-diff-insert">过去 6 个月内甲方向乙方实际支付的服务费用总额。</p>
          <p>本条款不限制乙方因重大过失、故意不当行为或违反数据保护法律应承担的责任。</p>
        </article>
      </div>
      <div className="hf-semantic-summary">
        <Tag tone="red">重新打开</Tag>
        <div><strong>责任上限从 12 个月服务费降至 6 个月实付费用</strong><p>可能降低可追偿金额，偏离团队 Playbook。建议恢复 V2 表述或由业务 owner 确认。</p></div>
        <Button tone="primary" onClick={onReopen}>确认重新打开</Button>
      </div>
      {!materialOnly && (
        <div className="hf-nonmaterial-diff">
          <Tag tone="green">非实质变化</Tag>
          <div><strong>签署日期格式调整</strong><p>“2026 年 7 月 25 日”调整为“2026/07/25”，不影响权利义务。</p></div>
        </div>
      )}
    </div>
  );
}

function ContextModal({
  context,
  onContextChange,
  onConfirm,
  onClose,
  selectedTask,
  onNavigate,
  onNotify,
}) {
  return (
    <div className="hf-overlay-screen">
      <DecisionClass
        selectedTask={selectedTask}
        onSelectTask={() => {}}
        filter="全部"
        onFilter={() => {}}
        search=""
        onSearch={() => {}}
        filterMenuOpen={false}
        onToggleFilterMenu={() => {}}
        onOpenContext={() => {}}
        onUpload={() => {}}
        onNavigate={onNavigate}
        detailOpen={false}
        onCloseDetail={() => {}}
        onNotify={onNotify}
      />
      <div className="hf-backdrop" />
      <section className="hf-modal hf-context-modal">
        <header>
          <div className="hf-modal-icon blue"><Icon name="ri-file-search-line" /></div>
          <div><h2>确认审阅上下文</h2><p>AI 将根据以下背景应用审阅规则。缺失信息不会被自动假设。</p></div>
          <button className="hf-icon-button" type="button" onClick={onClose} aria-label="关闭上下文确认"><Icon name="ri-close-line" /></button>
        </header>
        <div className="hf-modal-body">
          <section className="hf-source-summary">
            <Icon name="ri-file-word-line" />
            <div><strong>SaaS 服务采购合同 V3.docx</strong><span>14 页 · 识别 37 个条款锚点 · 文件可编辑</span></div>
            <Tag tone="green">校验通过</Tag>
          </section>
          <div className="hf-form-grid">
            <label><span>合同类型</span><select className="hf-input" value={context.type} onChange={(event) => onContextChange("type", event.target.value)}><option>MSA · SaaS 服务采购</option><option>DPA · 数据处理协议</option><option>渠道合作协议</option></select></label>
            <label><span>我方立场 <em>必填</em></span><select className="hf-input selected" value={context.position} onChange={(event) => onContextChange("position", event.target.value)}><option>采购方 / 客户</option><option>供应商 / 服务方</option><option>中立审阅</option></select></label>
            <label><span>交易对手</span><input className="hf-input" value={context.counterparty} onChange={(event) => onContextChange("counterparty", event.target.value)} /></label>
            <label><span>交易金额</span><input className="hf-input" value={context.amount} onChange={(event) => onContextChange("amount", event.target.value)} /></label>
            <label><span>适用法域</span><select className="hf-input" value={context.jurisdiction} onChange={(event) => onContextChange("jurisdiction", event.target.value)}><option>中国大陆 · 上海</option><option>中国香港</option><option>新加坡</option></select></label>
            <label><span>截止时间</span><input className="hf-input" type="datetime-local" value={context.deadline} onChange={(event) => onContextChange("deadline", event.target.value)} /></label>
          </div>
          <label className="hf-full-field"><span>交易背景</span><textarea className="hf-textarea" value={context.background} onChange={(event) => onContextChange("background", event.target.value)} /></label>
          <label className="hf-full-field"><span>业务底线</span><textarea className="hf-textarea" value={context.bottomLine} onChange={(event) => onContextChange("bottomLine", event.target.value)} /></label>
          <div className="hf-form-grid">
            <label><span>审阅深度</span><div className="hf-radio-group">{["快速", "标准", "深度"].map((depth) => <button className={context.depth === depth ? "active" : ""} type="button" key={depth} onClick={() => onContextChange("depth", depth)}>{depth}</button>)}</div></label>
            <label><span>Review Playbook</span><select className="hf-input" value={context.playbook} onChange={(event) => onContextChange("playbook", event.target.value)}><option>采购合同 · 团队标准 v4.2</option><option>数据合规 · 严格模式 v2.1</option><option>商业合同 · 平衡模式 v3.6</option></select></label>
          </div>
          <div className="hf-context-warning"><Icon name="ri-shield-check-line" /><p>原始合同保持只读。AI 生成的红线仅写入工作副本，Critical/High 问题需要逐条确认。</p></div>
        </div>
        <footer>
          <Button onClick={onClose}>返回任务</Button>
          <Button tone="primary" icon="ri-play-circle-line" onClick={onConfirm} disabled={!context.position || !context.counterparty}>确认并开始审阅</Button>
        </footer>
      </section>
    </div>
  );
}

function ExportModal({
  issues,
  processed,
  exportOptions,
  onToggleOption,
  onGenerate,
  onClose,
  generating,
  generated,
  workspaceProps,
  embedded = false,
}) {
  const unresolved = issues.length - processed;

  return (
    <div className={`hf-overlay-screen${embedded ? " hf-export-overlay-embedded" : ""}`}>
      {!embedded && <Workspace {...workspaceProps} />}
      <div className="hf-backdrop" />
      <section className="hf-modal hf-export-modal">
        <header>
          <div className="hf-modal-icon blue"><Icon name="ri-archive-stack-line" /></div>
          <div><h2>生成审阅包</h2><p>将基于当前版本 V3 创建交付文件，原始合同不会被覆盖。</p></div>
          <button className="hf-icon-button" type="button" onClick={onClose} aria-label="关闭成果包"><Icon name="ri-close-line" /></button>
        </header>
        <div className="hf-modal-body">
          <div className="hf-export-metrics">
            <div><strong>{processed}</strong><span>已确认建议</span></div>
            <div><strong>2</strong><span>人工编辑</span></div>
            <div className={unresolved ? "warning" : ""}><strong>{unresolved}</strong><span>未决问题</span></div>
            <div><strong>0</strong><span>结构校验错误</span></div>
          </div>
          {unresolved > 0 && (
            <div className="hf-export-warning">
              <Icon name="ri-alert-line" />
              <div><strong>仍有 {unresolved} 项未决问题</strong><p>允许导出内部草稿，但交付文件和审查摘要将标记“存在未决问题”。</p></div>
              <button type="button" onClick={onClose}>查看问题</button>
            </div>
          )}
          {generated && (
            <div className="hf-export-success">
              <Icon name="ri-checkbox-circle-fill" />
              <div><strong>Review Package 已生成</strong><p>下载已经开始，成果包同时保存在“成果包”工作区。</p></div>
            </div>
          )}
          <div className="hf-export-file">
            <span className="hf-word-icon"><Icon name="ri-file-word-2-line" /></span>
            <div><strong>云途科技_SaaS服务采购合同_Review_Package_V3</strong><small>预计 5 个文件 · 新 ContractVersion · Execution Trace 已启用</small></div>
            <Tag tone="green">原件受保护</Tag>
          </div>
          <fieldset className="hf-export-options">
            <legend>成果包内容</legend>
            {[
              ["redline", "修订版 Word", "已确认红线与用户编辑差异"],
              ["comments", "带批注 Word", "未写入的建议与协作问题"],
              ["summary", "审查意见摘要", "风险、业务影响和下一步"],
              ["issues", "完整问题清单", "证据、状态、owner 与置信度"],
              ["trace", "Execution Trace", "AI 处理与人工确认链路"],
            ].map(([key, label, help]) => (
              <label key={key}>
                <button
                  className={exportOptions[key] ? "hf-checkbox checked" : "hf-checkbox"}
                  type="button"
                  role="checkbox"
                  aria-checked={exportOptions[key]}
                  onClick={() => onToggleOption(key)}
                >
                  {exportOptions[key] && <Icon name="ri-check-line" />}
                </button>
                <span><strong>{label}</strong><small>{help}</small></span>
              </label>
            ))}
          </fieldset>
          <div className="hf-export-note"><Icon name="ri-information-line" />导出前将再次校验条款编号、定义、交叉引用与当前版本来源。</div>
        </div>
        <footer>
          <Button onClick={onClose}>返回审阅</Button>
          <Button
            tone="primary"
            icon={generating ? "ri-loader-4-line" : generated ? "ri-checkbox-circle-line" : "ri-file-download-line"}
            onClick={onGenerate}
            disabled={generating || !Object.values(exportOptions).some(Boolean)}
          >
            {generating ? "正在生成..." : generated ? "再次下载" : "确认生成文件"}
          </Button>
        </footer>
      </section>
    </div>
  );
}

export function DesignScreens() {
  const validScreens = [
    "workbench",
    "decision-class",
    "context",
    "workspace",
    "compare",
    "export",
  ];
  const [view, setView] = useState(
    validScreens.includes(requestedScreen) ? requestedScreen : "workbench",
  );
  const [selectedTask, setSelectedTask] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filter, setFilter] = useState("全部");
  const [search, setSearch] = useState("");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(0);
  const [issues, setIssues] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("alloomi-contract-review") || "null");
      if (!Array.isArray(stored)) return issueSeed;
      return issueSeed.map((issue) => ({
        ...issue,
        ...(stored.find((item) => item.id === issue.id) || {}),
      }));
    } catch {
      return issueSeed;
    }
  });
  const [context, setContext] = useState({
    type: "MSA · SaaS 服务采购",
    position: "采购方 / 客户",
    counterparty: "启明云服务有限公司",
    amount: "CNY 680,000 / 年",
    jurisdiction: "中国大陆 · 上海",
    deadline: "2026-07-31T18:00",
    background:
      "采购核心业务系统的三年期 SaaS 服务，预计 8 月 15 日上线；销售团队正在等待法务反馈。",
    bottomLine:
      "责任上限不高于过去 12 个月服务费；数据事件 24 小时通知；定制交付成果归我方。",
    depth: "标准",
    playbook: "采购合同 · 团队标准 v4.2",
  });
  const [documentView, setDocumentView] = useState("redline");
  const [zoom, setZoom] = useState(92);
  const [navTab, setNavTab] = useState("outline");
  const [materialOnly, setMaterialOnly] = useState(true);
  const [mobileIssueOpen, setMobileIssueOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(issueSeed[0].recommendation);
  const [toast, setToast] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    redline: true,
    comments: true,
    summary: true,
    issues: true,
    trace: false,
  });
  const fileInputRef = useRef(null);

  const processed = issues.filter(
    (issue) => !["待处理", "协作中"].includes(issue.status),
  ).length;

  useEffect(() => {
    localStorage.setItem("alloomi-contract-review", JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("screen", view);
    window.history.replaceState({}, "", nextUrl);
    document.title = `Alloomi · ${
      view === "workbench"
        ? "法务工作台"
        : view === "decision-class"
        ? "合同审阅任务"
        : view === "compare"
          ? "语义版本对比"
          : view === "export"
            ? "Review Package"
            : "合同审阅工作台"
    }`;
  }, [view]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = (message) => setToast(message);

  const navigateFromSidebar = (label) => {
    setMobileIssueOpen(false);
    if (label === "工作台") {
      setView("workbench");
    } else if (label === "项目空间") {
      setView("workspace");
      notify("已进入当前合同项目空间");
    } else if (label === "成果包") {
      setView("export");
    } else {
      setView("decision-class");
    }
  };

  const chooseTask = (index) => {
    setSelectedTask(index);
    setDetailOpen(true);
  };

  const openContext = () => {
    setDetailOpen(false);
    setView("context");
  };

  const chooseIssue = (index) => {
    setSelectedIssue(index);
    setEditing(false);
    setEditedText(issues[index].recommendation);
    setMobileIssueOpen(true);
    if (documentView === "summary") setDocumentView("redline");
  };

  const updateIssue = (status, recommendation) => {
    setIssues((current) =>
      current.map((issue, index) =>
        index === selectedIssue
          ? { ...issue, status, ...(recommendation ? { recommendation } : {}) }
          : issue,
      ),
    );
    setEditing(false);
    notify(
      status === "已采纳"
        ? "修改已写入工作副本"
        : status === "已编辑"
          ? "编辑后的条款已采纳"
          : status === "已驳回"
            ? "建议已驳回并保留审计记录"
            : "问题已重新打开",
    );
  };

  const startEditing = () => {
    if (!editing) setEditedText(issues[selectedIssue].recommendation);
    setEditing((current) => !current);
  };

  const generatePackage = () => {
    setGenerating(true);
    setGenerated(false);
    window.setTimeout(() => {
      const selectedFiles = Object.entries(exportOptions)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key)
        .join(", ");
      const body = [
        "# Alloomi Review Package",
        "",
        "合同：SaaS 服务采购合同 V3",
        `处理进度：${processed}/${issues.length}`,
        `包含内容：${selectedFiles}`,
        "",
        "## 问题清单",
        ...issues.map(
          (issue) =>
            `- ${issue.id} | ${issue.title} | ${issue.clause} | ${issue.severity}风险 | ${issue.status}`,
        ),
        "",
        "本文件由 Alloomi AI Paralegal 生成，请由法务 Owner 完成最终确认。",
      ].join("\n");
      const url = URL.createObjectURL(new Blob([body], { type: "text/markdown;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "Alloomi_Review_Package_V3.md";
      link.click();
      URL.revokeObjectURL(url);
      setGenerating(false);
      setGenerated(true);
      notify("Review Package 已生成并开始下载");
    }, 900);
  };

  const workspaceProps = {
    issues,
    selectedIssue,
    onSelectIssue: chooseIssue,
    onResolve: updateIssue,
    onOpenExport: () => setView("export"),
    onOpenCompare: () => setView("compare"),
    onOpenWorkspace: () => setView("workspace"),
    onNavigate: navigateFromSidebar,
    onNotify: notify,
    processed,
    mobileIssueOpen,
    onMobileIssueOpen: setMobileIssueOpen,
    editing,
    editedText,
    onStartEdit: startEditing,
    onEditText: setEditedText,
    onSaveEdit: () => updateIssue("已编辑", editedText),
    documentView,
    onDocumentView: setDocumentView,
    zoom,
    onZoom: (delta) => setZoom((current) => Math.min(112, Math.max(76, current + delta))),
    navTab,
    onNavTab: setNavTab,
    materialOnly,
    onMaterialOnly: () => setMaterialOnly((current) => !current),
  };

  let content;
  if (view === "workbench") {
    content = (
      <Workbench
        processed={processed}
        onNavigate={navigateFromSidebar}
        onOpenContext={openContext}
        onOpenTasks={() => setView("decision-class")}
        onSelectTask={(index) => {
          chooseTask(index);
          setView("decision-class");
        }}
        onOpenWorkspace={() => setView("workspace")}
        onOpenCompare={() => setView("compare")}
        onOpenExport={() => setView("export")}
        onUpload={() => fileInputRef.current?.click()}
        onNotify={notify}
        workspaceProps={workspaceProps}
        exportModalProps={{
          issues,
          processed,
          exportOptions,
          onToggleOption: (key) =>
            setExportOptions((current) => ({ ...current, [key]: !current[key] })),
          onGenerate: generatePackage,
          generating,
          generated,
          workspaceProps,
        }}
      />
    );
  } else if (view === "context") {
    content = (
      <ContextModal
        context={context}
        onContextChange={(key, value) =>
          setContext((current) => ({ ...current, [key]: value }))
        }
        onConfirm={() => {
          setView("workspace");
          notify("审阅上下文已锁定，AI 建议已加载");
        }}
        onClose={() => setView("decision-class")}
        selectedTask={selectedTask}
        onNavigate={navigateFromSidebar}
        onNotify={notify}
      />
    );
  } else if (view === "export") {
    content = (
      <ExportModal
        issues={issues}
        processed={processed}
        exportOptions={exportOptions}
        onToggleOption={(key) =>
          setExportOptions((current) => ({ ...current, [key]: !current[key] }))
        }
        onGenerate={generatePackage}
        onClose={() => setView("workspace")}
        generating={generating}
        generated={generated}
        workspaceProps={workspaceProps}
      />
    );
  } else if (view === "workspace" || view === "compare") {
    content = <Workspace {...workspaceProps} compare={view === "compare"} />;
  } else {
    content = (
      <DecisionClass
        selectedTask={selectedTask}
        onSelectTask={chooseTask}
        filter={filter}
        onFilter={setFilter}
        search={search}
        onSearch={setSearch}
        filterMenuOpen={filterMenuOpen}
        onToggleFilterMenu={() => setFilterMenuOpen((current) => !current)}
        onOpenContext={openContext}
        onUpload={() => fileInputRef.current?.click()}
        onNavigate={navigateFromSidebar}
        detailOpen={detailOpen}
        onCloseDetail={() => setDetailOpen(false)}
        onNotify={notify}
      />
    );
  }

  return (
    <div className="hf-design-root">
      {content}
      <input
        ref={fileInputRef}
        className="hf-hidden-file"
        type="file"
        accept=".doc,.docx,.pdf"
        onChange={(event) => {
          if (!event.target.files?.length) return;
          notify(`已读取 ${event.target.files[0].name}`);
          openContext();
        }}
      />
      {toast && (
        <div className="hf-toast" role="status">
          <Icon name="ri-checkbox-circle-fill" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
