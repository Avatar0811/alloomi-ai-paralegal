import { useEffect, useMemo, useRef, useState } from "react";
import {
  initialIssues,
  recentDeliverables,
  rejectReasons,
  severityMeta,
  statusMeta,
  workbenchAgents,
  workbenchProjects,
  workbenchRiskAlerts,
  workbenchTasks,
} from "./mockData.js";

const navItems = [
  { id: "workbench", label: "工作台", icon: "ri-home-5-line" },
  { id: "review", label: "合同审阅", icon: "ri-file-list-3-line" },
  { id: "matter", label: "项目空间", icon: "ri-stack-line" },
  { id: "package", label: "成果包", icon: "ri-archive-stack-line" },
];

const iconButton = (icon, label, onClick, extraClass = "") => (
  <button
    className={`icon-button ${extraClass}`}
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
  >
    <i className={icon} aria-hidden="true" />
  </button>
);

function Tag({ children, tone = "gray", compact = false }) {
  return (
    <span className={`tag tag-${tone}${compact ? " tag-compact" : ""}`}>
      {children}
    </span>
  );
}

function RecommendationText({ issue }) {
  const emphasis =
    issue.id === "ISS-001"
      ? "过去 12 个月内甲方向乙方支付的服务费用总额"
      : "";

  if (!emphasis || !issue.recommendation.includes(emphasis)) {
    return issue.recommendation;
  }

  const [before, after] = issue.recommendation.split(emphasis);
  return (
    <>
      {before}
      <mark>{emphasis}</mark>
      {after}
    </>
  );
}

function Modal({ title, description, icon, children, footer, onClose, wide = false }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="modal-layer" role="presentation">
      <button
        className="modal-backdrop"
        type="button"
        aria-label="关闭弹窗"
        onClick={onClose}
      />
      <section
        className={`modal-card${wide ? " modal-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="modal-header">
          <div className={`modal-icon ${icon?.tone || "blue"}`}>
            <i className={icon?.name || "ri-information-line"} aria-hidden="true" />
          </div>
          <div>
            <h2 id="modal-title">{title}</h2>
            {description && <p>{description}</p>}
          </div>
          {iconButton("ri-close-line", "关闭", onClose, "modal-close")}
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-footer">{footer}</footer>}
      </section>
    </div>
  );
}

function Toast({ message, tone, onClose }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 2600);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className={`toast toast-${tone || "success"}`} role="status">
      <i
        className={tone === "warning" ? "ri-alert-line" : "ri-checkbox-circle-line"}
        aria-hidden="true"
      />
      <span>{message}</span>
      <button type="button" aria-label="关闭通知" onClick={onClose}>
        <i className="ri-close-line" aria-hidden="true" />
      </button>
    </div>
  );
}

function Workbench({
  completedTasks,
  onCreateTask,
  onNavigate,
  onOpenTrace,
  onToggleTask,
  showToast,
}) {
  const [taskTab, setTaskTab] = useState("all");

  const visibleTasks = workbenchTasks.filter((task) => {
    if (completedTasks.includes(task.id)) return false;
    if (taskTab === "high") return task.priority === "high";
    if (taskTab === "due") return task.deadline.includes("今天");
    return true;
  });

  const pendingTaskCount = 8 - completedTasks.length;

  return (
    <main className="workbench-panel">
      <section className="workbench-hero">
        <div>
          <span className="workbench-eyebrow">法律助手工作台</span>
          <h1>早上好，Leo</h1>
          <p>
            今天有 <strong>{pendingTaskCount} 项任务</strong>需要关注，其中
            <strong> 2 项</strong>将在 24 小时内到期。
          </p>
        </div>
        <div className="workbench-hero-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => showToast("已切换到全部任务视图", "warning")}
          >
            <i className="ri-list-check-3" aria-hidden="true" />
            查看全部任务
          </button>
          <button type="button" className="primary-button" onClick={onCreateTask}>
            <i className="ri-add-line" aria-hidden="true" />
            新建法律任务
          </button>
        </div>
      </section>

      <section className="workbench-metrics" aria-label="工作台关键指标">
        {[
          {
            id: "pending",
            label: "待处理任务",
            value: pendingTaskCount,
            note: "2 项今日到期",
            icon: "ri-task-line",
            tone: "blue",
          },
          {
            id: "projects",
            label: "进行中项目",
            value: 5,
            note: "较上周新增 1 个",
            icon: "ri-folder-chart-line",
            tone: "violet",
          },
          {
            id: "risks",
            label: "高风险事项",
            value: 3,
            note: "1 项等待你确认",
            icon: "ri-error-warning-line",
            tone: "red",
          },
          {
            id: "done",
            label: "本周已完成",
            value: 12 + completedTasks.length,
            note: "自动化完成 9 项",
            icon: "ri-checkbox-circle-line",
            tone: "green",
          },
        ].map((metric) => (
          <button
            type="button"
            className="workbench-metric"
            key={metric.id}
            onClick={() => {
              if (metric.id === "risks") {
                onNavigate("review", "ISS-001");
              } else {
                showToast(`${metric.label}：${metric.value}`, "warning");
              }
            }}
          >
            <span className={`metric-icon metric-icon-${metric.tone}`}>
              <i className={metric.icon} aria-hidden="true" />
            </span>
            <span className="metric-copy">
              <small>{metric.label}</small>
              <strong>{metric.value}</strong>
              <em>{metric.note}</em>
            </span>
            <i className="ri-arrow-right-s-line metric-arrow" aria-hidden="true" />
          </button>
        ))}
      </section>

      <div className="workbench-primary-grid">
        <section className="workbench-card task-card">
          <header className="workbench-card-header">
            <div>
              <h2>今日待办</h2>
              <p>按优先级和截止时间为你排序</p>
            </div>
            <div className="mini-segmented" aria-label="待办筛选">
              {[
                ["all", "全部"],
                ["high", "高优"],
                ["due", "即将到期"],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={taskTab === value ? "active" : ""}
                  onClick={() => setTaskTab(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </header>
          <div className="workbench-task-list">
            {visibleTasks.length ? (
              visibleTasks.map((task) => (
                <article className="workbench-task" key={task.id}>
                  <button
                    className="task-checkbox"
                    type="button"
                    aria-label={`完成任务：${task.title}`}
                    onClick={() => onToggleTask(task.id)}
                  >
                    <i className="ri-check-line" aria-hidden="true" />
                  </button>
                  <button
                    className="task-main"
                    type="button"
                    onClick={() =>
                      task.issueId
                        ? onNavigate("review", task.issueId)
                        : showToast(`已打开任务：${task.title}`, "warning")
                    }
                  >
                    <span className="task-title-line">
                      <strong>{task.title}</strong>
                      <Tag
                        tone={
                          task.priority === "high"
                            ? "red"
                            : task.priority === "medium"
                              ? "amber"
                              : "gray"
                        }
                        compact
                      >
                        {task.type}
                      </Tag>
                    </span>
                    <span className="task-meta-line">
                      <span>{task.project}</span>
                      <span className={task.deadline.includes("今天") ? "urgent" : ""}>
                        <i className="ri-time-line" aria-hidden="true" />
                        {task.deadline}
                      </span>
                    </span>
                  </button>
                  <div className="task-progress">
                    <div>
                      <span style={{ width: `${task.progress}%` }} />
                    </div>
                    <small>{task.progress}%</small>
                  </div>
                  <span className="task-owner" aria-label={`负责人 ${task.owner}`}>
                    {task.owner}
                  </span>
                </article>
              ))
            ) : (
              <div className="workbench-empty">
                <i className="ri-checkbox-circle-line" aria-hidden="true" />
                <strong>当前筛选下没有待办</strong>
                <p>你可以切换筛选条件或新建任务。</p>
              </div>
            )}
          </div>
        </section>

        <section className="workbench-card agent-card">
          <header className="workbench-card-header">
            <div>
              <h2>数字员工动态</h2>
              <p>3 个助手正在协同执行</p>
            </div>
            <button type="button" className="text-button" onClick={onOpenTrace}>
              运行记录
            </button>
          </header>
          <div className="agent-list">
            {workbenchAgents.map((agent) => (
              <button
                type="button"
                className="agent-item"
                key={agent.id}
                onClick={() => {
                  if (agent.id === "AGENT-001") {
                    onNavigate("review", "ISS-001");
                  } else {
                    showToast(`${agent.name}：${agent.statusLabel}`, "warning");
                  }
                }}
              >
                <span className={`agent-icon agent-${agent.status}`}>
                  <i className={agent.icon} aria-hidden="true" />
                </span>
                <span className="agent-copy">
                  <span>
                    <strong>{agent.name}</strong>
                    <em className={`agent-status agent-status-${agent.status}`}>
                      {agent.statusLabel}
                    </em>
                  </span>
                  <small>{agent.task}</small>
                  <span className="agent-progress">
                    <span style={{ width: `${agent.progress}%` }} />
                  </span>
                </span>
              </button>
            ))}
          </div>
          <button type="button" className="agent-footer-action" onClick={onOpenTrace}>
            <i className="ri-route-line" aria-hidden="true" />
            查看全部执行链路
            <i className="ri-arrow-right-s-line" aria-hidden="true" />
          </button>
        </section>
      </div>

      <div className="workbench-secondary-grid">
        <section className="workbench-card project-card">
          <header className="workbench-card-header">
            <div>
              <h2>项目进展</h2>
              <p>聚合查看负责项目的关键节点</p>
            </div>
            <button
              type="button"
              className="text-button"
              onClick={() => showToast("已打开项目空间", "warning")}
            >
              全部项目
            </button>
          </header>
          <div className="project-table" role="table" aria-label="项目进展">
            <div className="project-table-head" role="row">
              <span>项目</span>
              <span>当前阶段</span>
              <span>负责人</span>
              <span>进度</span>
              <span>截止</span>
            </div>
            {workbenchProjects.map((project) => (
              <button
                type="button"
                className="project-row"
                key={project.id}
                onClick={() =>
                  project.id === "PROJECT-001"
                    ? onNavigate("review", "ISS-001")
                    : showToast(`已打开项目：${project.name}`, "warning")
                }
              >
                <span>
                  <strong>{project.name}</strong>
                  <small className={`project-risk project-risk-${project.tone}`}>
                    {project.risk}
                  </small>
                </span>
                <span>{project.stage}</span>
                <span>{project.owner}</span>
                <span className="project-progress-cell">
                  <span className="project-progress-bar">
                    <span style={{ width: `${project.progress}%` }} />
                  </span>
                  <small>{project.progress}%</small>
                </span>
                <span>{project.deadline}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="workbench-card risk-card">
          <header className="workbench-card-header">
            <div>
              <h2>风险与期限提醒</h2>
              <p>优先处理不可逆的法律节点</p>
            </div>
            <span className="risk-count">3</span>
          </header>
          <div className="risk-list">
            {workbenchRiskAlerts.map((risk) => (
              <button
                type="button"
                className="risk-item"
                key={risk.id}
                onClick={() =>
                  risk.issueId
                    ? onNavigate("review", risk.issueId)
                    : showToast(`已打开提醒：${risk.title}`, "warning")
                }
              >
                <span className={`risk-indicator risk-indicator-${risk.tone}`} />
                <span>
                  <strong>{risk.title}</strong>
                  <small>{risk.project}</small>
                  <em>{risk.meta}</em>
                </span>
                <i className="ri-arrow-right-s-line" aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      </div>

      <section className="workbench-card deliverable-card">
        <header className="workbench-card-header">
          <div>
            <h2>最近成果</h2>
            <p>数字员工生成并已归档的文件</p>
          </div>
          <button
            type="button"
            className="text-button"
            onClick={() => showToast("已打开成果包列表", "warning")}
          >
            查看成果包
          </button>
        </header>
        <div className="deliverable-list">
          {recentDeliverables.map((file) => (
            <button
              type="button"
              className="deliverable-item"
              key={file.id}
              onClick={() => showToast(`正在预览：${file.name}`)}
            >
              <span className={`deliverable-icon deliverable-icon-${file.tone}`}>
                <i className={file.icon} aria-hidden="true" />
              </span>
              <span>
                <strong>{file.name}</strong>
                <small>{file.project}</small>
              </span>
              <time>{file.time}</time>
              <i className="ri-download-2-line" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export function App() {
  const [activeView, setActiveView] = useState("workbench");
  const [issues, setIssues] = useState(initialIssues);
  const [selectedId, setSelectedId] = useState(initialIssues[0].id);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortMode, setSortMode] = useState("priority");
  const [filterOpen, setFilterOpen] = useState(false);
  const [matterMenuOpen, setMatterMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [matterName, setMatterName] = useState("云途科技 × 启明云服务");
  const [autosave, setAutosave] = useState("已自动保存  09:42");
  const [toast, setToast] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [draftRecommendation, setDraftRecommendation] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectNote, setRejectNote] = useState("");
  const [deferModalOpen, setDeferModalOpen] = useState(false);
  const [deferOwner, setDeferOwner] = useState("Leo");
  const [deferDate, setDeferDate] = useState("2026-08-03");
  const [deferReason, setDeferReason] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [exportStage, setExportStage] = useState("preview");
  const [exportOptions, setExportOptions] = useState({
    revised: true,
    comments: true,
    summary: true,
    issueList: true,
    trace: false,
  });
  const [traceOpen, setTraceOpen] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [quickTaskOpen, setQuickTaskOpen] = useState(false);
  const [quickTaskType, setQuickTaskType] = useState("contract");
  const [quickTaskTitle, setQuickTaskTitle] = useState("");
  const firstSavePass = useRef(true);

  const selectedIssue =
    issues.find((issue) => issue.id === selectedId) || issues[0];

  const counts = useMemo(() => {
    const pending = issues.filter((issue) => issue.status === "pending").length;
    const processed = issues.length - pending;
    const high = issues.filter((issue) => issue.severity === "high").length;
    return { all: issues.length, processed, pending, high };
  }, [issues]);

  const filteredIssues = useMemo(() => {
    const filtered = issues.filter((issue) => {
      const tabMatch =
        activeTab === "all" ||
        (activeTab === "high" && issue.severity === "high") ||
        (activeTab === "pending" && issue.status === "pending");
      const severityMatch =
        severityFilter === "all" || issue.severity === severityFilter;
      const statusMatch =
        statusFilter === "all" || issue.status === statusFilter;
      return tabMatch && severityMatch && statusMatch;
    });

    if (sortMode === "clause") {
      return [...filtered].sort((a, b) =>
        a.clause.localeCompare(b.clause, "zh-CN", { numeric: true }),
      );
    }
    if (sortMode === "status") {
      return [...filtered].sort((a, b) =>
        statusMeta[a.status].label.localeCompare(statusMeta[b.status].label, "zh-CN"),
      );
    }
    return filtered;
  }, [activeTab, issues, severityFilter, sortMode, statusFilter]);

  const completion = Math.round((counts.processed / counts.all) * 100);

  useEffect(() => {
    if (firstSavePass.current) {
      firstSavePass.current = false;
      return undefined;
    }
    setAutosave("保存中…");
    const timer = window.setTimeout(() => {
      setAutosave(
        `已自动保存  ${new Intl.DateTimeFormat("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date())}`,
      );
    }, 650);
    return () => window.clearTimeout(timer);
  }, [issues]);

  const closeToast = () => setToast(null);

  const showToast = (message, tone = "success") => {
    setToast({ message, tone, key: Date.now() });
  };

  const navigateTo = (view, issueId) => {
    setActiveView(view);
    setMatterMenuOpen(false);
    setMoreMenuOpen(false);
    if (view === "review") {
      setInspectorOpen(true);
      if (issueId) setSelectedId(issueId);
    }
  };

  const toggleWorkbenchTask = (taskId) => {
    setCompletedTasks((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId],
    );
    showToast("任务已完成，工作台统计已更新");
  };

  const createQuickTask = () => {
    const taskTypeLabel = {
      contract: "合同审阅",
      research: "法律检索",
      consultation: "法律咨询",
      document: "文书生成",
    }[quickTaskType];
    setQuickTaskOpen(false);
    setQuickTaskTitle("");
    if (quickTaskType === "contract") {
      navigateTo("review", "ISS-001");
      showToast(`已创建${taskTypeLabel}任务并进入审阅台`);
      return;
    }
    showToast(`已创建${taskTypeLabel}任务，数字员工开始处理`);
  };

  const selectIssue = (id) => {
    setSelectedId(id);
    setInspectorOpen(true);
    setEditMode(false);
  };

  const updateSelectedIssue = (changes, message) => {
    setIssues((current) =>
      current.map((issue) =>
        issue.id === selectedIssue.id ? { ...issue, ...changes } : issue,
      ),
    );
    if (message) showToast(message);
  };

  const continueReview = () => {
    const pending = issues.filter((issue) => issue.status === "pending");
    if (!pending.length) {
      setExportOpen(true);
      setExportStage("preview");
      return;
    }
    const currentIndex = pending.findIndex((issue) => issue.id === selectedId);
    const next = pending[(currentIndex + 1 + pending.length) % pending.length];
    selectIssue(next.id);
    showToast(`已定位到下一项待处理问题：${next.title}`);
  };

  const startEdit = () => {
    setDraftRecommendation(selectedIssue.recommendation);
    setEditMode(true);
  };

  const saveEdited = () => {
    if (!draftRecommendation.trim()) return;
    updateSelectedIssue(
      {
        recommendation: draftRecommendation.trim(),
        status: "edited",
        preference: "已记录本次人工编辑差异，默认仅用于当前任务",
      },
      "修改已采纳，并加入成果包",
    );
    setEditMode(false);
  };

  const confirmReject = () => {
    if (!rejectReason) return;
    updateSelectedIssue(
      {
        status: "rejected",
        preference: `驳回原因：${rejectReason}${rejectNote ? ` · ${rejectNote}` : ""}`,
      },
      "问题已驳回，不会写入修订版",
    );
    setRejectModalOpen(false);
    setRejectReason("");
    setRejectNote("");
  };

  const confirmDefer = () => {
    if (!deferReason.trim()) return;
    updateSelectedIssue(
      {
        status: "deferred",
        preference: `搁置至 ${deferDate}，负责人：${deferOwner} · ${deferReason.trim()}`,
      },
      "问题已搁置，并设置了负责人和截止日期",
    );
    setDeferModalOpen(false);
    setDeferReason("");
  };

  const beginExport = () => {
    setExportStage("generating");
    window.setTimeout(() => setExportStage("success"), 1200);
  };

  const resetFilters = () => {
    setSeverityFilter("all");
    setStatusFilter("all");
    setSortMode("priority");
  };

  const activeFilterCount =
    Number(severityFilter !== "all") +
    Number(statusFilter !== "all") +
    Number(sortMode !== "priority");

  return (
    <div
      className={[
        "app-shell",
        activeView === "workbench"
          ? "workbench-mode"
          : inspectorOpen
            ? ""
            : "inspector-collapsed",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <aside className="sidebar">
        <div className="brand-wrap">
          <img
            src={`${import.meta.env.BASE_URL}assets/alloomi-logo.svg`}
            alt="Alloomi"
            className="brand-logo"
          />
        </div>

        <nav className="primary-nav" aria-label="主导航">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === activeView ? "nav-item active" : "nav-item"}
              aria-current={item.id === activeView ? "page" : undefined}
              onClick={() => {
                if (item.id === "workbench" || item.id === "review") {
                  navigateTo(item.id);
                } else {
                  showToast(`${item.label}入口已保留，当前版本不展开`, "warning");
                }
              }}
            >
              <i className={item.icon} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="nav-item settings-link"
            onClick={() => showToast("设置入口已保留，当前原型不展开", "warning")}
          >
            <i className="ri-settings-3-line" aria-hidden="true" />
            <span>设置</span>
          </button>
          <button
            type="button"
            className="profile-card"
            onClick={() => showToast("当前操作人：Leo Zu · 项目法务", "warning")}
          >
            <span className="avatar">L</span>
            <span className="profile-copy">
              <strong>Leo Zu</strong>
              <small>leo@melandlabs.ai</small>
            </span>
            <i className="ri-arrow-down-s-line" aria-hidden="true" />
          </button>
        </div>
      </aside>

      <header className="topbar">
        {activeView === "workbench" ? (
          <>
            <div className="topbar-left">
              {iconButton("ri-menu-2-line", "展开菜单", () =>
                showToast("侧边栏已固定显示", "warning"),
              )}
              <div className="workbench-topbar-title">
                <strong>法律助手工作台</strong>
                <span>个人工作视图</span>
              </div>
            </div>
            <div className="topbar-right">
              <button
                type="button"
                className="topbar-search"
                onClick={() => showToast("搜索入口已打开", "warning")}
              >
                <i className="ri-search-line" aria-hidden="true" />
                <span>搜索任务、项目或成果</span>
                <kbd>⌘ K</kbd>
              </button>
              <span className="top-divider" />
              <div className="deadline">
                <i className="ri-calendar-line" aria-hidden="true" />
                <span>2026 年 7 月 30 日 · 星期四</span>
              </div>
              <div className="notification-anchor">
                {iconButton("ri-notification-3-line", "通知", () =>
                  showToast("2 条提醒：1 项今日到期，1 项等待人工确认", "warning"),
                )}
                <span className="notification-dot">2</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="topbar-left">
          {iconButton("ri-menu-2-line", "展开菜单", () =>
            showToast("侧边栏已固定显示", "warning"),
          )}
          <div className="matter-switcher">
            <button
              type="button"
              className="matter-button"
              aria-expanded={matterMenuOpen}
              onClick={() => setMatterMenuOpen((open) => !open)}
            >
              <span>{matterName}</span>
              <i className="ri-arrow-down-s-line" aria-hidden="true" />
            </button>
            {matterMenuOpen && (
              <div className="popover matter-popover">
                <p className="popover-label">切换项目</p>
                {[
                  "云途科技 × 启明云服务",
                  "峰岚智造 × 数据平台采购",
                  "青禾零售 × CRM 续约",
                ].map((name) => (
                  <button
                    type="button"
                    key={name}
                    className={name === matterName ? "selected" : ""}
                    onClick={() => {
                      setMatterName(name);
                      setMatterMenuOpen(false);
                      showToast(`已切换至：${name}`);
                    }}
                  >
                    <i
                      className={
                        name === matterName
                          ? "ri-checkbox-circle-fill"
                          : "ri-folder-3-line"
                      }
                      aria-hidden="true"
                    />
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="top-divider" />
          <div className="contract-title">
            <i className="ri-file-word-line" aria-hidden="true" />
            <strong>SaaS 服务采购合同 V3</strong>
            <i className="ri-file-copy-line" aria-hidden="true" />
            <Tag tone="blue" compact>
              采购方
            </Tag>
          </div>
            </div>

            <div className="topbar-right">
          <div className="deadline">
            <i className="ri-calendar-line" aria-hidden="true" />
            <span>截止日期 2026-07-31 18:00</span>
          </div>
          <span className="top-divider" />
          <div className={`autosave${autosave === "保存中…" ? " saving" : ""}`}>
            <i
              className={
                autosave === "保存中…" ? "ri-loader-4-line" : "ri-checkbox-circle-line"
              }
              aria-hidden="true"
            />
            <span>{autosave}</span>
          </div>
          <div className="menu-anchor">
            {iconButton("ri-more-fill", "更多操作", () =>
              setMoreMenuOpen((open) => !open),
            )}
            {moreMenuOpen && (
              <div className="popover top-more-popover">
                <button
                  type="button"
                  onClick={() => {
                    setTraceOpen(true);
                    setMoreMenuOpen(false);
                  }}
                >
                  <i className="ri-route-line" aria-hidden="true" />
                  查看执行记录
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExportOpen(true);
                    setExportStage("preview");
                    setMoreMenuOpen(false);
                  }}
                >
                  <i className="ri-download-cloud-2-line" aria-hidden="true" />
                  预览成果包
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast("原始合同未被修改，当前版本安全", "warning");
                    setMoreMenuOpen(false);
                  }}
                >
                  <i className="ri-shield-check-line" aria-hidden="true" />
                  检查原件状态
                </button>
              </div>
            )}
          </div>
            </div>
          </>
        )}
      </header>

      {activeView === "workbench" ? (
        <Workbench
          completedTasks={completedTasks}
          onCreateTask={() => setQuickTaskOpen(true)}
          onNavigate={navigateTo}
          onOpenTrace={() => setTraceOpen(true)}
          onToggleTask={toggleWorkbenchTask}
          showToast={showToast}
        />
      ) : (
        <>
          <main className="ledger-panel">
        <section className="overview">
          <div className="overview-heading">
            <div>
              <h1>审阅概览</h1>
              <p>更新于 2026-07-30 09:42</p>
            </div>
            <div className="overview-actions">
              <button className="primary-button" type="button" onClick={continueReview}>
                <i className="ri-play-circle-line" aria-hidden="true" />
                {counts.pending ? "继续处理" : "生成审阅包"}
              </button>
              <div className="menu-anchor">
                {iconButton("ri-more-fill", "审阅操作", () =>
                  setMoreMenuOpen((open) => !open),
                )}
              </div>
            </div>
          </div>

          <div className="stats">
            <button
              type="button"
              className={activeTab === "all" ? "stat active" : "stat"}
              onClick={() => setActiveTab("all")}
            >
              <strong>{counts.all}</strong>
              <span>全部问题</span>
            </button>
            <button
              type="button"
              className="stat"
              onClick={() => setStatusFilter(statusFilter === "all" ? "accepted" : "all")}
            >
              <strong>{counts.processed}</strong>
              <span>已处理</span>
            </button>
            <button
              type="button"
              className={activeTab === "pending" ? "stat pending active" : "stat pending"}
              onClick={() => setActiveTab("pending")}
            >
              <strong>{counts.pending}</strong>
              <span>待处理</span>
            </button>
          </div>
        </section>

        <section className="ledger-toolbar">
          <div className="segmented-control" aria-label="问题快速筛选">
            <button
              type="button"
              className={activeTab === "all" ? "active" : ""}
              onClick={() => setActiveTab("all")}
            >
              全部 <span>{counts.all}</span>
            </button>
            <button
              type="button"
              className={activeTab === "high" ? "active" : ""}
              onClick={() => setActiveTab("high")}
            >
              高风险 <span>{counts.high}</span>
            </button>
            <button
              type="button"
              className={activeTab === "pending" ? "active" : ""}
              onClick={() => setActiveTab("pending")}
            >
              待处理 <span>{counts.pending}</span>
            </button>
          </div>
          <div className="filter-anchor">
            <button
              type="button"
              className={`filter-button${activeFilterCount ? " filtered" : ""}`}
              aria-expanded={filterOpen}
              onClick={() => setFilterOpen((open) => !open)}
            >
              <i className="ri-filter-3-line" aria-hidden="true" />
              筛选
              {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
            </button>
            {filterOpen && (
              <div className="popover filter-popover">
                <div className="popover-head">
                  <strong>筛选与排序</strong>
                  <button type="button" onClick={resetFilters}>
                    重置
                  </button>
                </div>
                <label>
                  风险等级
                  <select
                    value={severityFilter}
                    onChange={(event) => setSeverityFilter(event.target.value)}
                  >
                    <option value="all">全部等级</option>
                    <option value="high">高风险</option>
                    <option value="medium">中风险</option>
                    <option value="low">低风险</option>
                  </select>
                </label>
                <label>
                  处理状态
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    <option value="all">全部状态</option>
                    <option value="pending">待处理</option>
                    <option value="accepted">已采纳</option>
                    <option value="edited">已编辑</option>
                    <option value="rejected">已驳回</option>
                    <option value="deferred">已搁置</option>
                  </select>
                </label>
                <label>
                  排序方式
                  <select
                    value={sortMode}
                    onChange={(event) => setSortMode(event.target.value)}
                  >
                    <option value="priority">风险优先</option>
                    <option value="clause">条款顺序</option>
                    <option value="status">状态顺序</option>
                  </select>
                </label>
              </div>
            )}
          </div>
        </section>

        <section className="issue-table-wrap" aria-label="合同审阅问题列表">
          <div className="issue-table-header" role="row">
            <span>问题</span>
            <span>关联条款</span>
            <span>严重级别</span>
            <span>业务影响</span>
            <span>状态</span>
            <span>证据摘要</span>
          </div>
          <div className="issue-list">
            {filteredIssues.length ? (
              filteredIssues.map((issue) => {
                const severity = severityMeta[issue.severity];
                const status = statusMeta[issue.status];
                return (
                  <button
                    type="button"
                    className={selectedId === issue.id ? "issue-row selected" : "issue-row"}
                    key={issue.id}
                    onClick={() => selectIssue(issue.id)}
                    aria-pressed={selectedId === issue.id}
                  >
                    <strong title={issue.title}>{issue.title}</strong>
                    <span>{issue.clause}</span>
                    <span className="severity-cell">
                      <i className={`ri-circle-fill severity-${severity.tone}`} />
                      {severity.label}
                    </span>
                    <span>{issue.impact}</span>
                    <span>
                      <Tag tone={status.tone} compact>
                        {status.label}
                      </Tag>
                    </span>
                    <span className="summary-cell" title={issue.evidenceSummary}>
                      {issue.evidenceSummary}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="empty-state">
                <i className="ri-search-eye-line" aria-hidden="true" />
                <strong>没有匹配的问题</strong>
                <p>调整筛选条件后再试。</p>
                <button type="button" onClick={resetFilters}>
                  清除筛选
                </button>
              </div>
            )}
          </div>
        </section>

        <footer className="ledger-footer">
          <span>
            共 {filteredIssues.length} 项问题
            {filteredIssues.length !== counts.all && `（全部 ${counts.all} 项）`}
          </span>
          <div className="pagination" aria-label="分页">
            <button type="button" disabled aria-label="上一页">
              <i className="ri-arrow-left-s-line" aria-hidden="true" />
            </button>
            <button type="button" className="current" aria-current="page">
              1
            </button>
            <button type="button" disabled aria-label="下一页">
              <i className="ri-arrow-right-s-line" aria-hidden="true" />
            </button>
          </div>
        </footer>
          </main>

          {inspectorOpen ? (
        <aside className="inspector" aria-label="问题详情">
          <header className="inspector-header">
            <div>
              <div className="issue-title-line">
                <h2>{selectedIssue.title}</h2>
                <Tag tone={severityMeta[selectedIssue.severity].tone}>
                  {severityMeta[selectedIssue.severity].label}风险
                </Tag>
              </div>
              <p>
                {selectedIssue.clause}
                <span>·</span>
                {selectedIssue.riskType}
                <Tag tone={statusMeta[selectedIssue.status].tone} compact>
                  {statusMeta[selectedIssue.status].label}
                </Tag>
              </p>
            </div>
            {iconButton("ri-close-line", "关闭详情", () => setInspectorOpen(false))}
          </header>

          <div className="inspector-scroll">
            <section className="detail-section">
              <div className="section-title">
                <h3>原文证据</h3>
                <button
                  type="button"
                  onClick={() =>
                    showToast(`已定位到 ${selectedIssue.source}`, "warning")
                  }
                >
                  <i className="ri-map-pin-line" aria-hidden="true" />
                  定位原文
                </button>
              </div>
              <div className="evidence-card">
                <p>{selectedIssue.evidence}</p>
                <footer>
                  <i className="ri-file-text-line" aria-hidden="true" />
                  {selectedIssue.source}
                </footer>
              </div>
            </section>

            <section className="detail-section">
              <div className="section-title">
                <h3>建议修改</h3>
                {selectedIssue.status !== "pending" && (
                  <button
                    type="button"
                    onClick={() =>
                      updateSelectedIssue(
                        { status: "pending" },
                        "该问题已恢复为待处理",
                      )
                    }
                  >
                    <i className="ri-reset-left-line" aria-hidden="true" />
                    重新处理
                  </button>
                )}
              </div>
              {editMode ? (
                <div className="edit-card">
                  <textarea
                    value={draftRecommendation}
                    onChange={(event) => setDraftRecommendation(event.target.value)}
                    aria-label="编辑建议修改"
                    autoFocus
                  />
                  <div className="edit-actions">
                    <span>{draftRecommendation.length} 字</span>
                    <button type="button" onClick={() => setEditMode(false)}>
                      取消
                    </button>
                    <button
                      type="button"
                      className="primary-small"
                      disabled={!draftRecommendation.trim()}
                      onClick={saveEdited}
                    >
                      保存并采纳
                    </button>
                  </div>
                </div>
              ) : (
                <div className="recommendation-card">
                  <p>
                    <RecommendationText issue={selectedIssue} />
                  </p>
                </div>
              )}
            </section>

            <section className="detail-section">
              <h3>修改理由（Change Rationale）</h3>
              <p className="rationale">{selectedIssue.rationale}</p>
            </section>

            <section className="detail-section confidence-section">
              <div className="confidence-head">
                <h3>置信度</h3>
                <strong>{selectedIssue.confidence}%</strong>
              </div>
              <progress max="100" value={selectedIssue.confidence}>
                {selectedIssue.confidence}%
              </progress>
              <p>{selectedIssue.basis}</p>
            </section>

            <section className="detail-section action-section">
              <h3>操作</h3>
              <div className="action-grid">
                <button
                  type="button"
                  className="primary-button accept"
                  disabled={editMode}
                  onClick={() =>
                    updateSelectedIssue(
                      { status: "accepted" },
                      "修改已采纳，并加入成果包",
                    )
                  }
                >
                  <i className="ri-check-line" aria-hidden="true" />
                  采纳修改
                </button>
                <button type="button" disabled={editMode} onClick={startEdit}>
                  <i className="ri-edit-line" aria-hidden="true" />
                  编辑后采纳
                </button>
                <button
                  type="button"
                  disabled={editMode}
                  onClick={() => setRejectModalOpen(true)}
                >
                  <i className="ri-close-circle-line" aria-hidden="true" />
                  驳回
                </button>
              </div>
              <button
                type="button"
                className="defer-link"
                disabled={editMode}
                onClick={() => setDeferModalOpen(true)}
              >
                <i className="ri-time-line" aria-hidden="true" />
                暂时搁置并设置负责人
              </button>
            </section>
          </div>

          <footer className="inspector-footer">
            <div className="progress-heading">
              <strong>审阅包导出进度</strong>
              <span>{completion}%</span>
            </div>
            <progress max="100" value={completion}>
              {completion}%
            </progress>
            <div className="progress-footer">
              <span>
                {counts.pending
                  ? `完成剩余 ${counts.pending} 项后即可导出审阅包`
                  : "全部问题已处理，可生成审阅包"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setExportOpen(true);
                  setExportStage("preview");
                }}
              >
                预览
              </button>
            </div>
          </footer>
        </aside>
      ) : (
        <button
          type="button"
          className="reopen-inspector"
          onClick={() => setInspectorOpen(true)}
        >
          <i className="ri-layout-right-line" aria-hidden="true" />
          查看问题详情
        </button>
          )}
        </>
      )}

      {quickTaskOpen && (
        <Modal
          title="新建法律任务"
          description="选择任务类型并描述目标，数字员工会自动拆解步骤。"
          icon={{ name: "ri-sparkling-line", tone: "blue" }}
          onClose={() => setQuickTaskOpen(false)}
          wide
          footer={
            <>
              <button type="button" onClick={() => setQuickTaskOpen(false)}>
                取消
              </button>
              <button
                type="button"
                className="primary-button"
                disabled={!quickTaskTitle.trim()}
                onClick={createQuickTask}
              >
                创建并开始
              </button>
            </>
          }
        >
          <fieldset className="quick-task-types">
            <legend>任务类型</legend>
            {[
              ["contract", "合同审阅", "识别风险并生成修订建议", "ri-file-search-line"],
              ["research", "法律检索", "检索法规、案例与监管口径", "ri-search-eye-line"],
              ["consultation", "法律咨询", "整理事实并形成答复意见", "ri-question-answer-line"],
              ["document", "文书生成", "基于材料生成法律文书初稿", "ri-draft-line"],
            ].map(([value, label, help, icon]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="quick-task-type"
                  value={value}
                  checked={quickTaskType === value}
                  onChange={(event) => setQuickTaskType(event.target.value)}
                />
                <span className="quick-task-icon">
                  <i className={icon} aria-hidden="true" />
                </span>
                <span>
                  <strong>{label}</strong>
                  <small>{help}</small>
                </span>
              </label>
            ))}
          </fieldset>
          <label className="field-label">
            任务目标
            <textarea
              value={quickTaskTitle}
              onChange={(event) => setQuickTaskTitle(event.target.value)}
              placeholder="例如：审阅供应商提供的 SaaS 服务合同，重点关注责任限制、数据安全和自动续约"
              autoFocus
            />
          </label>
          <div className="quick-task-note">
            <i className="ri-shield-check-line" aria-hidden="true" />
            <span>原始文件不会被覆盖；关键结论需要人工确认后才会进入成果包。</span>
          </div>
        </Modal>
      )}

      {rejectModalOpen && (
        <Modal
          title="驳回审阅问题"
          description="驳回原因将进入执行记录，默认仅用于本次任务。"
          icon={{ name: "ri-close-circle-line", tone: "red" }}
          onClose={() => setRejectModalOpen(false)}
          footer={
            <>
              <button type="button" onClick={() => setRejectModalOpen(false)}>
                取消
              </button>
              <button
                type="button"
                className="danger-button"
                disabled={!rejectReason}
                onClick={confirmReject}
              >
                确认驳回
              </button>
            </>
          }
        >
          <fieldset className="reason-list">
            <legend>选择驳回原因</legend>
            {rejectReasons.map((reason) => (
              <label key={reason}>
                <input
                  type="radio"
                  name="reject-reason"
                  value={reason}
                  checked={rejectReason === reason}
                  onChange={(event) => setRejectReason(event.target.value)}
                />
                <span>{reason}</span>
              </label>
            ))}
          </fieldset>
          <label className="field-label">
            补充说明（选填）
            <textarea
              value={rejectNote}
              onChange={(event) => setRejectNote(event.target.value)}
              placeholder="补充本项目中的具体判断依据"
            />
          </label>
        </Modal>
      )}

      {deferModalOpen && (
        <Modal
          title="暂时搁置问题"
          description="高风险问题搁置时必须设置负责人、截止日期和下一步。"
          icon={{ name: "ri-time-line", tone: "amber" }}
          onClose={() => setDeferModalOpen(false)}
          footer={
            <>
              <button type="button" onClick={() => setDeferModalOpen(false)}>
                取消
              </button>
              <button
                type="button"
                className="primary-button"
                disabled={!deferReason.trim()}
                onClick={confirmDefer}
              >
                确认搁置
              </button>
            </>
          }
        >
          <div className="form-grid">
            <label className="field-label">
              负责人
              <select
                value={deferOwner}
                onChange={(event) => setDeferOwner(event.target.value)}
              >
                <option>Leo</option>
                <option>王宁</option>
                <option>陈晨</option>
              </select>
            </label>
            <label className="field-label">
              截止日期
              <input
                type="date"
                value={deferDate}
                onChange={(event) => setDeferDate(event.target.value)}
              />
            </label>
          </div>
          <label className="field-label">
            原因与下一步
            <textarea
              value={deferReason}
              onChange={(event) => setDeferReason(event.target.value)}
              placeholder="例如：待安全团队确认审计范围，周五前补充意见"
            />
          </label>
        </Modal>
      )}

      {exportOpen && (
        <Modal
          title={
            exportStage === "success"
              ? "审阅包已生成"
              : exportStage === "generating"
                ? "正在生成审阅包"
                : "预览并生成审阅包"
          }
          description={
            exportStage === "preview"
              ? "将生成一个新版本，原始合同不会被覆盖。"
              : undefined
          }
          icon={{
            name: exportStage === "success" ? "ri-checkbox-circle-line" : "ri-archive-line",
            tone: exportStage === "success" ? "green" : "blue",
          }}
          onClose={() => setExportOpen(false)}
          wide
          footer={
            exportStage === "preview" ? (
              <>
                <button type="button" onClick={() => setExportOpen(false)}>
                  返回审阅
                </button>
                <button type="button" className="primary-button" onClick={beginExport}>
                  <i className="ri-file-download-line" aria-hidden="true" />
                  确认生成
                </button>
              </>
            ) : exportStage === "success" ? (
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  setExportOpen(false);
                  showToast("成果包已保存到项目空间");
                }}
              >
                完成
              </button>
            ) : null
          }
        >
          {exportStage === "preview" && (
            <div className="export-preview">
              <div className="export-summary">
                <div>
                  <strong>{counts.processed}</strong>
                  <span>已处理问题</span>
                </div>
                <div>
                  <strong className={counts.pending ? "warning-text" : ""}>
                    {counts.pending}
                  </strong>
                  <span>未解决问题</span>
                </div>
                <div>
                  <strong>{issues.filter((issue) => issue.status === "accepted").length}</strong>
                  <span>直接采纳</span>
                </div>
                <div>
                  <strong>{issues.filter((issue) => issue.status === "edited").length}</strong>
                  <span>编辑后采纳</span>
                </div>
              </div>
              {counts.pending > 0 && (
                <div className="export-warning">
                  <i className="ri-alert-line" aria-hidden="true" />
                  <div>
                    <strong>仍有 {counts.pending} 项待处理问题</strong>
                    <p>未解决的高风险问题会在审阅意见摘要中突出显示。</p>
                  </div>
                </div>
              )}
              <div className="export-file">
                <i className="ri-file-word-2-line" aria-hidden="true" />
                <div>
                  <strong>云途科技_SaaS服务采购合同_审阅包_V3.zip</strong>
                  <span>预计包含 4–5 个文件 · 生成新版本</span>
                </div>
                <Tag tone="green" compact>
                  原件受保护
                </Tag>
              </div>
              <fieldset className="export-options">
                <legend>成果包内容</legend>
                {[
                  ["revised", "修订版 Word", "包含已采纳和编辑后的修改"],
                  ["comments", "带批注 Word", "每条批注绑定原文与修改理由"],
                  ["summary", "审阅意见摘要", "突出重大风险和下一步"],
                  ["issueList", "问题清单", "导出全部问题、证据和状态"],
                  ["trace", "执行记录", "附带 AI 与人工操作 Trace"],
                ].map(([key, label, help]) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={exportOptions[key]}
                      onChange={() =>
                        setExportOptions((current) => ({
                          ...current,
                          [key]: !current[key],
                        }))
                      }
                    />
                    <span>
                      <strong>{label}</strong>
                      <small>{help}</small>
                    </span>
                  </label>
                ))}
              </fieldset>
            </div>
          )}
          {exportStage === "generating" && (
            <div className="generating-state">
              <i className="ri-loader-4-line" aria-hidden="true" />
              <strong>正在绑定条款锚点并生成 Word 文件…</strong>
              <p>已确认的问题状态会被保留，生成失败也可安全重试。</p>
              <progress />
            </div>
          )}
          {exportStage === "success" && (
            <div className="success-state">
              <div className="success-mark">
                <i className="ri-check-line" aria-hidden="true" />
              </div>
              <strong>Contract Review Package 已就绪</strong>
              <p>修订版、批注、问题清单和意见摘要已保存，原始合同保持不变。</p>
              <div className="success-file">
                <i className="ri-file-zip-line" aria-hidden="true" />
                <span>云途科技_SaaS服务采购合同_审阅包_V3.zip</span>
                <Tag tone="green" compact>
                  已完成
                </Tag>
              </div>
            </div>
          )}
        </Modal>
      )}

      {traceOpen && (
        <Modal
          title="执行记录"
          description="从输入、证据、AI 判断到人工确认的完整 Trace。"
          icon={{ name: "ri-route-line", tone: "blue" }}
          onClose={() => setTraceOpen(false)}
          wide
          footer={
            <button type="button" className="primary-button" onClick={() => setTraceOpen(false)}>
              关闭
            </button>
          }
        >
          <div className="trace-list">
            {[
              ["09:36", "合同解析完成", "识别 14 个条款、37 个证据锚点", "ri-file-search-line"],
              ["09:38", "风险分析完成", "生成 11 个 Review Issues，完成重复问题自检", "ri-sparkling-line"],
              ["09:39", "偏好排序完成", "应用个人、团队及客户红线，4 项高风险置顶", "ri-sort-desc"],
              ["09:42", "人工审阅进行中", `已处理 ${counts.processed} 项，待处理 ${counts.pending} 项`, "ri-user-follow-line"],
            ].map(([time, title, description, icon]) => (
              <div className="trace-item" key={title}>
                <time>{time}</time>
                <span className="trace-icon">
                  <i className={icon} aria-hidden="true" />
                </span>
                <div>
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="trace-note">
            <i className="ri-shield-check-line" aria-hidden="true" />
            <span>所有关键问题均已绑定条款证据，未检测到跨项目数据引用。</span>
          </div>
        </Modal>
      )}

      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          tone={toast.tone}
          onClose={closeToast}
        />
      )}
    </div>
  );
}
