export const initialIssues = [
  {
    id: "ISS-001",
    title: "责任限制上限缺失",
    clause: "第 8.2 条",
    severity: "high",
    impact: "高",
    status: "pending",
    riskType: "责任限制",
    evidenceSummary: "约定赔偿责任上限缺失，可能导致无限责任风险。",
    evidence:
      "8.2 在适用法律允许的最大范围内，乙方不对因本协议引起或与本协议有关的任何间接、附带、特殊、惩罚性或后果性损害承担责任，包括但不限于利润损失、业务中断或数据丢失。",
    recommendation:
      "8.2 在适用法律允许的最大范围内，乙方对因本协议引起或与本协议有关的任何直接损害的累计责任总额不超过过去 12 个月内甲方向乙方支付的服务费用总额。本条款不限制或排除乙方因其重大过失、故意不当行为或违反数据保护法律应承担的责任。",
    rationale:
      "当前条款未设定赔偿责任上限，可能导致无限赔付风险。建议引入与合同价值挂钩的上限，并保留法定责任例外，以平衡风险并符合市场惯例。",
    confidence: 92,
    basis: "基于 128 份相似交易与 2026 年市场条款数据",
    source: "SaaS 服务采购合同 V3.docx · 第 7 页",
    preference: "团队偏好：责任上限不高于过去 12 个月服务费",
  },
  {
    id: "ISS-002",
    title: "数据泄露通知期限过长",
    clause: "第 10.4 条",
    severity: "high",
    impact: "高",
    status: "pending",
    riskType: "数据保护",
    evidenceSummary: "要求在 10 个工作日内通知，明显长于行业常见时限。",
    evidence:
      "10.4 如发生可能影响甲方数据安全的事件，乙方应在发现事件后十（10）个工作日内向甲方发出书面通知。",
    recommendation:
      "10.4 如发生可能影响甲方数据安全的事件，乙方应在发现后不迟于二十四（24）小时向甲方发出初步通知，并持续提供调查进展、影响范围及补救措施。",
    rationale:
      "数据安全事件的发现与处置具有明显时效性。十个工作日可能影响甲方履行监管通知义务和及时止损，建议缩短至 24 小时。",
    confidence: 96,
    basis: "基于企业数据安全模板及 67 份采购合同",
    source: "SaaS 服务采购合同 V3.docx · 第 9 页",
    preference: "客户红线：数据事件 24 小时内通知",
  },
  {
    id: "ISS-003",
    title: "自动续约缺少提醒窗口",
    clause: "第 4.3 条",
    severity: "medium",
    impact: "中",
    status: "accepted",
    riskType: "合同期限",
    evidenceSummary: "合同约定自动续约，但未提供提前提醒或终止窗口。",
    evidence:
      "4.3 初始服务期届满后，本协议将按相同期限自动续展，除非任一方书面通知不再续约。",
    recommendation:
      "4.3 初始服务期届满后，本协议将按相同期限自动续展。乙方应至少提前 60 日向甲方发出续约提醒，任一方可在届满前 30 日书面通知不再续约。",
    rationale:
      "增加续约提醒和明确退出窗口，有助于甲方完成预算和服务评估，避免非预期续费。",
    confidence: 89,
    basis: "基于甲方标准采购条款",
    source: "SaaS 服务采购合同 V3.docx · 第 4 页",
    preference: "个人偏好：自动续约必须有提醒窗口",
  },
  {
    id: "ISS-004",
    title: "知识产权归属表述不清",
    clause: "第 7.1 条",
    severity: "high",
    impact: "高",
    status: "edited",
    riskType: "知识产权",
    evidenceSummary: "未明确交付成果与乙方背景知识产权的边界和许可范围。",
    evidence:
      "7.1 与服务相关的全部知识产权归乙方所有，甲方获得本协议期限内的使用权。",
    recommendation:
      "7.1 双方各自保留其在本协议签署前已拥有的知识产权。甲方专属定制并已付费的交付成果归甲方所有；乙方背景技术仍归乙方所有，但乙方授予甲方永久、不可撤销的使用许可。",
    rationale:
      "现有表述可能使甲方付费定制成果仍完全归乙方所有。建议区分背景知识产权、通用能力与定制交付成果。",
    confidence: 86,
    basis: "基于 42 份软件开发与 SaaS 采购合同",
    source: "SaaS 服务采购合同 V3.docx · 第 6 页",
    preference: "已按 Leo 的修改保留乙方通用工具权利",
  },
  {
    id: "ISS-005",
    title: "付款验收条件不对等",
    clause: "第 5.2 条",
    severity: "medium",
    impact: "中",
    status: "accepted",
    riskType: "付款与验收",
    evidenceSummary: "验收标准模糊且由对方单方确认，不利于我方付款保障。",
    evidence:
      "5.2 甲方应在乙方通知服务上线后五（5）个工作日内完成付款，服务是否符合要求由乙方确认。",
    recommendation:
      "5.2 乙方完成上线并提交验收材料后，甲方在十（10）个工作日内按照附件二的验收标准进行验收；验收通过后支付相应款项。",
    rationale:
      "付款应以客观验收为前提，避免在服务未达到约定标准时产生无条件付款义务。",
    confidence: 91,
    basis: "基于甲方采购与验收模板",
    source: "SaaS 服务采购合同 V3.docx · 第 5 页",
    preference: "团队偏好：付款节点与书面验收绑定",
  },
  {
    id: "ISS-006",
    title: "争议解决地不利",
    clause: "第 12.1 条",
    severity: "high",
    impact: "低",
    status: "rejected",
    riskType: "争议解决",
    evidenceSummary: "约定争议解决地为对方所在地，需结合交易策略判断。",
    evidence:
      "12.1 因本协议引起的争议由乙方住所地有管辖权的人民法院专属管辖。",
    recommendation:
      "12.1 因本协议引起的争议由合同签署地有管辖权的人民法院管辖。",
    rationale:
      "对方所在地管辖会增加我方异地诉讼成本。考虑本交易规模，可协商中立地点或合同签署地。",
    confidence: 80,
    basis: "基于我方争议解决标准条款",
    source: "SaaS 服务采购合同 V3.docx · 第 11 页",
    preference: "驳回原因：本项目已接受对方所在地管辖",
  },
  {
    id: "ISS-007",
    title: "服务可用性指标不明确",
    clause: "第 3.2 条",
    severity: "medium",
    impact: "中",
    status: "pending",
    riskType: "服务水平",
    evidenceSummary: "未约定可用性百分比、测量方式及未达标补救。",
    evidence:
      "3.2 乙方应尽商业上合理努力保证服务持续、稳定运行，并及时处理服务故障。",
    recommendation:
      "3.2 乙方应确保月度服务可用性不低于 99.9%，具体测量口径、排除事项、故障等级、响应时间及服务抵扣见附件一。",
    rationale:
      "“商业上合理努力”缺乏可量化验收标准。建议约定 SLA、测量方法和未达标补救，以支持持续履约管理。",
    confidence: 94,
    basis: "基于 93 份 SaaS 采购合同",
    source: "SaaS 服务采购合同 V3.docx · 第 3 页",
    preference: "客户红线：核心系统月度可用性不低于 99.9%",
  },
  {
    id: "ISS-008",
    title: "违约金计算方式不合理",
    clause: "第 5.1 条",
    severity: "medium",
    impact: "中",
    status: "rejected",
    riskType: "违约责任",
    evidenceSummary: "违约金按未履行金额的 30% 计算，需评估实际损失。",
    evidence:
      "5.1 任一方违反本协议的，应向守约方支付未履行部分合同金额百分之三十（30%）的违约金。",
    recommendation:
      "5.1 任一方违反本协议的，应赔偿守约方因此遭受的直接、可证明损失，违约金以未履行部分合同金额的百分之十（10%）为上限。",
    rationale:
      "统一按 30% 计取可能与实际损失不匹配，建议引入合理上限并限定为直接损失。",
    confidence: 82,
    basis: "基于同类交易争议条款",
    source: "SaaS 服务采购合同 V3.docx · 第 5 页",
    preference: "驳回原因：商业团队已换取价格折扣",
  },
  {
    id: "ISS-009",
    title: "审计权利范围过宽",
    clause: "第 11.3 条",
    severity: "low",
    impact: "低",
    status: "deferred",
    riskType: "审计与合规",
    evidenceSummary: "审计可延伸至关联方及历史数据，范围和频率未受限制。",
    evidence:
      "11.3 甲方可在任何时间审计乙方及其关联方与本协议有关的全部系统、记录和历史数据。",
    recommendation:
      "11.3 甲方每年可提前十（10）个工作日书面通知，对与本协议直接相关的记录进行一次合理审计，并遵守乙方安全与保密要求。",
    rationale:
      "建议限定审计对象、频率、提前通知和信息安全边界，降低对乙方正常经营的干扰。",
    confidence: 88,
    basis: "基于供应商合规审计模板",
    source: "SaaS 服务采购合同 V3.docx · 第 10 页",
    preference: "搁置至安全团队复核，负责人：王宁",
  },
  {
    id: "ISS-010",
    title: "不可抗力定义过窄",
    clause: "第 13.1 条",
    severity: "low",
    impact: "低",
    status: "accepted",
    riskType: "不可抗力",
    evidenceSummary: "未包含供应链中断、网络攻击和公共卫生事件。",
    evidence:
      "13.1 不可抗力仅指地震、洪水、火灾等自然灾害。",
    recommendation:
      "13.1 不可抗力包括不可预见、不可避免且不可克服的事件，包括自然灾害、政府行为、重大公共卫生事件及非因受影响方过错导致的重大网络攻击。",
    rationale:
      "补充现代服务交易中的典型不可控事件，同时保留可预见性和减损义务边界。",
    confidence: 84,
    basis: "基于甲方标准不可抗力条款",
    source: "SaaS 服务采购合同 V3.docx · 第 12 页",
    preference: "团队偏好：不可抗力应覆盖重大网络攻击",
  },
  {
    id: "ISS-011",
    title: "通知方式单一",
    clause: "第 14.2 条",
    severity: "low",
    impact: "低",
    status: "deferred",
    riskType: "通知",
    evidenceSummary: "仅允许书面邮寄，缺少电子邮件等可追踪方式。",
    evidence:
      "14.2 本协议项下的通知应以专人递送或挂号信方式发送至双方注册地址。",
    recommendation:
      "14.2 通知可通过专人递送、挂号信或双方指定电子邮箱发送；电子邮件在未收到退信时视为下一个工作日送达。",
    rationale:
      "电子邮件是合同履行中的常用沟通方式，补充后可提高通知效率并保留送达记录。",
    confidence: 90,
    basis: "基于甲方合同通知模板",
    source: "SaaS 服务采购合同 V3.docx · 第 12 页",
    preference: "搁置至补充双方通知邮箱，负责人：Leo",
  },
];

export const statusMeta = {
  pending: { label: "待处理", tone: "blue" },
  accepted: { label: "已采纳", tone: "green" },
  edited: { label: "已编辑", tone: "amber" },
  rejected: { label: "已驳回", tone: "gray" },
  deferred: { label: "已搁置", tone: "slate" },
};

export const severityMeta = {
  high: { label: "高", tone: "red", rank: 3 },
  medium: { label: "中", tone: "orange", rank: 2 },
  low: { label: "低", tone: "green", rank: 1 },
};

export const rejectReasons = [
  "不构成风险",
  "已在其他条款解决",
  "AI 理解错误",
  "商业上已接受",
  "证据不足",
  "重复问题",
];

export const workbenchTasks = [
  {
    id: "TASK-001",
    title: "完成 SaaS 服务采购合同高风险条款确认",
    project: "云途科技 × 启明云服务",
    type: "合同审阅",
    priority: "high",
    deadline: "今天 18:00",
    progress: 73,
    owner: "L",
    issueId: "ISS-001",
  },
  {
    id: "TASK-002",
    title: "回复渠道合作协议解约咨询",
    project: "青禾零售 × 渠道合作",
    type: "法律咨询",
    priority: "high",
    deadline: "今天 16:30",
    progress: 42,
    owner: "L",
  },
  {
    id: "TASK-003",
    title: "核对数据跨境评估材料缺口",
    project: "峰岚智造 × 数据平台采购",
    type: "合规核查",
    priority: "medium",
    deadline: "明天 12:00",
    progress: 60,
    owner: "W",
  },
  {
    id: "TASK-004",
    title: "确认商标异议答辩证据目录",
    project: "墨山咖啡 × 品牌保护",
    type: "知识产权",
    priority: "normal",
    deadline: "8 月 2 日",
    progress: 20,
    owner: "C",
  },
];

export const workbenchAgents = [
  {
    id: "AGENT-001",
    name: "合同审阅助手",
    task: "SaaS 服务采购合同 V3",
    status: "waiting",
    statusLabel: "等待人工确认",
    icon: "ri-file-search-line",
    progress: 73,
  },
  {
    id: "AGENT-002",
    name: "法律检索助手",
    task: "渠道协议单方解约规则检索",
    status: "done",
    statusLabel: "已完成",
    icon: "ri-search-eye-line",
    progress: 100,
  },
  {
    id: "AGENT-003",
    name: "文书生成助手",
    task: "数据跨境评估意见初稿",
    status: "running",
    statusLabel: "生成中",
    icon: "ri-draft-line",
    progress: 48,
  },
];

export const workbenchProjects = [
  {
    id: "PROJECT-001",
    name: "云途科技 × 启明云服务",
    stage: "合同定稿",
    owner: "Leo",
    progress: 73,
    deadline: "07-31",
    risk: "2 项高风险",
    tone: "red",
  },
  {
    id: "PROJECT-002",
    name: "峰岚智造 × 数据平台采购",
    stage: "合规核查",
    owner: "王宁",
    progress: 58,
    deadline: "08-02",
    risk: "材料待补充",
    tone: "amber",
  },
  {
    id: "PROJECT-003",
    name: "青禾零售 × CRM 续约",
    stage: "商业确认",
    owner: "陈晨",
    progress: 86,
    deadline: "08-05",
    risk: "进展正常",
    tone: "green",
  },
];

export const workbenchRiskAlerts = [
  {
    id: "RISK-001",
    title: "责任限制条款仍未确认",
    project: "云途科技 × 启明云服务",
    meta: "高风险 · 今天到期",
    tone: "red",
    issueId: "ISS-001",
  },
  {
    id: "RISK-002",
    title: "数据跨境材料缺少处理活动清单",
    project: "峰岚智造 × 数据平台采购",
    meta: "需协作 · 明天到期",
    tone: "amber",
  },
  {
    id: "RISK-003",
    title: "商标答辩举证期剩余 4 天",
    project: "墨山咖啡 × 品牌保护",
    meta: "法定期限 · 8 月 3 日",
    tone: "blue",
  },
];

export const recentDeliverables = [
  {
    id: "FILE-001",
    name: "SaaS服务采购合同_审阅意见摘要.docx",
    project: "云途科技 × 启明云服务",
    time: "今天 09:42",
    icon: "ri-file-word-2-line",
    tone: "blue",
  },
  {
    id: "FILE-002",
    name: "渠道合作协议_法律检索报告.pdf",
    project: "青禾零售 × 渠道合作",
    time: "昨天 17:28",
    icon: "ri-file-pdf-2-line",
    tone: "red",
  },
  {
    id: "FILE-003",
    name: "数据跨境合规材料清单.xlsx",
    project: "峰岚智造 × 数据平台采购",
    time: "昨天 15:06",
    icon: "ri-file-excel-2-line",
    tone: "green",
  },
];
