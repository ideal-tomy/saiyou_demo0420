import type {
  Candidate,
  CandidatePipelineStatus,
  ClientCompany,
  DemoDataBundle,
} from "@data/types";

function avatar(seed: string) {
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}`;
}

function jlptOrder(j: Candidate["jlpt"]): number {
  const o: Record<string, number> = { N5: 1, N4: 2, N3: 3, N2: 4, N1: 5 };
  return o[j] ?? 0;
}

const statusLabelMap: Record<
  string,
  { pipelineStatus: CandidatePipelineStatus; pipelineStatusLabelJa: string }
> = {
  応募受付: { pipelineStatus: "awaiting_entry", pipelineStatusLabelJa: "応募受付" },
  書類選考: { pipelineStatus: "interview_coordination", pipelineStatusLabelJa: "書類選考" },
  一次面談: { pipelineStatus: "training", pipelineStatusLabelJa: "一次面談" },
  最終面談: { pipelineStatus: "offer_accepted", pipelineStatusLabelJa: "最終面談" },
  内定: { pipelineStatus: "visa_applying", pipelineStatusLabelJa: "内定" },
  辞退保留: { pipelineStatus: "document_blocked", pipelineStatusLabelJa: "辞退・保留" },
  入社調整: { pipelineStatus: "document_prep", pipelineStatusLabelJa: "入社調整" },
};

function statusMap(label: keyof typeof statusLabelMap) {
  return statusLabelMap[label];
}

const baseClients: ClientCompany[] = [
  {
    id: "client-cloudflow",
    legalNameJa: "株式会社クラウドフロー",
    tradeNameJa: "クラウドフロー",
    industryJa: "B2B SaaS",
    prefectureJa: "東京都",
    cityJa: "渋谷区",
    cultureJa: "自走型。仮説検証を高速で回す文化。",
    aiTargetProfileJa: "SaaS営業経験とKPI運用経験を重視。",
    representative: { nameJa: "田口 健太", age: 41, noteJa: "成果と再現性を重視する経営方針。" },
    workplaceEnvironmentJa: "ハイブリッド勤務。CRM運用が標準化されている。",
    currentChallengesJa: "SMB向け新規案件の初回商談化率が低下。",
    recruitmentJa: "インサイドセールス 2名（SaaS商談経験、KPI管理、ABM施策）。",
    operations: { currentAssignees: 10, openSlots: 2, retentionRatePct: 86, satisfactionScore: 4.3 },
    ltMonthlyProfitPerHeadJpy: 150000,
    contact: {
      email: "recruit@cloudflow.example.com",
      phone: "03-7000-1001",
      contactPersonJa: "採用責任者 斉藤",
    },
    matchingHintTags: ["SaaS", "新規開拓", "KPI運用", "提案力"],
  },
  {
    id: "client-finboard",
    legalNameJa: "FinBoard株式会社",
    tradeNameJa: "FinBoard",
    industryJa: "FinTech",
    prefectureJa: "東京都",
    cityJa: "千代田区",
    cultureJa: "正確性とスピードの両立。ドキュメント品質を重視。",
    aiTargetProfileJa: "金融業界知見とB2B提案経験を重視。",
    workplaceEnvironmentJa: "エンタープライズ案件中心。複数部署の合意形成が必要。",
    currentChallengesJa: "提案から契約までのリードタイムが長い。",
    recruitmentJa: "アカウントエグゼクティブ 2名（金融業界知識、エンプラ交渉、提案書作成）。",
    operations: { currentAssignees: 8, openSlots: 2, retentionRatePct: 84, satisfactionScore: 4.2 },
    ltMonthlyProfitPerHeadJpy: 180000,
    contact: {
      email: "ta@finboard.example.com",
      phone: "03-7000-1002",
      contactPersonJa: "人事マネージャー 森",
    },
    matchingHintTags: ["金融知識", "エンタープライズ営業", "提案書", "交渉力"],
  },
  {
    id: "client-workmate",
    legalNameJa: "WorkMate株式会社",
    tradeNameJa: "WorkMate",
    industryJa: "HR Tech",
    prefectureJa: "東京都",
    cityJa: "港区",
    cultureJa: "顧客課題への共感を重視。伴走型サクセス。",
    aiTargetProfileJa: "採用領域の知見とカスタマーサクセス経験。",
    workplaceEnvironmentJa: "顧客オンボーディングと利用定着支援が中心。",
    currentChallengesJa: "導入後90日以内の定着率にバラつき。",
    recruitmentJa: "カスタマーサクセス 2名（採用業務理解、オンボーディング、データ活用）。",
    operations: { currentAssignees: 7, openSlots: 2, retentionRatePct: 88, satisfactionScore: 4.5 },
    ltMonthlyProfitPerHeadJpy: 130000,
    contact: {
      email: "hr@workmate.example.com",
      phone: "03-7000-1003",
      contactPersonJa: "採用担当 福田",
    },
    matchingHintTags: ["カスタマーサクセス", "採用業務理解", "オンボーディング", "データ活用"],
  },
  {
    id: "client-peakconsulting",
    legalNameJa: "ピークコンサルティング株式会社",
    tradeNameJa: "ピークコンサルティング",
    industryJa: "ITコンサル",
    prefectureJa: "大阪府",
    cityJa: "大阪市",
    cultureJa: "論点整理とクライアント折衝の精度を重視。",
    aiTargetProfileJa: "課題整理力と提案設計力を重視。",
    workplaceEnvironmentJa: "プロジェクト横断。ドキュメント主導で進行。",
    currentChallengesJa: "提案フェーズでの人員不足。",
    recruitmentJa: "プリセールス 2名（課題整理、提案設計、ステークホルダー調整）。",
    operations: { currentAssignees: 9, openSlots: 2, retentionRatePct: 82, satisfactionScore: 4.1 },
    ltMonthlyProfitPerHeadJpy: 170000,
    contact: {
      email: "career@peakconsulting.example.com",
      phone: "06-7000-1004",
      contactPersonJa: "採用責任者 橋本",
    },
    matchingHintTags: ["課題整理", "提案設計", "ファシリテーション", "プリセールス"],
  },
  {
    id: "client-logix",
    legalNameJa: "Logix Dynamics株式会社",
    tradeNameJa: "Logix Dynamics",
    industryJa: "物流DX",
    prefectureJa: "愛知県",
    cityJa: "名古屋市",
    cultureJa: "現場理解を最優先。PoCを短期間で回す。",
    aiTargetProfileJa: "物流業務理解と業務改善提案経験。",
    workplaceEnvironmentJa: "現場訪問とオンライン会議のハイブリッド。",
    currentChallengesJa: "案件増加に対して提案人員が不足。",
    recruitmentJa: "ソリューション営業 2名（物流業務知識、PoC推進、業務改善）。",
    operations: { currentAssignees: 6, openSlots: 2, retentionRatePct: 80, satisfactionScore: 4.0 },
    ltMonthlyProfitPerHeadJpy: 145000,
    contact: {
      email: "recruit@logix.example.com",
      phone: "052-700-1005",
      contactPersonJa: "採用担当 三浦",
    },
    matchingHintTags: ["物流業務知識", "PoC", "業務改善", "顧客折衝"],
  },
  {
    id: "client-zenithmedia",
    legalNameJa: "Zenith Media Partners株式会社",
    tradeNameJa: "Zenith Media",
    industryJa: "デジタルマーケティング",
    prefectureJa: "東京都",
    cityJa: "新宿区",
    cultureJa: "データドリブン。提案の実行力を重視。",
    aiTargetProfileJa: "広告運用知識と提案営業の両立。",
    workplaceEnvironmentJa: "マーケ/営業の横断チームで提案。",
    currentChallengesJa: "新規案件の提案精度向上。",
    recruitmentJa: "アカウントプランナー 2名（広告運用理解、提案営業、分析力）。",
    operations: { currentAssignees: 8, openSlots: 2, retentionRatePct: 83, satisfactionScore: 4.2 },
    ltMonthlyProfitPerHeadJpy: 140000,
    contact: {
      email: "jobs@zenithmedia.example.com",
      phone: "03-7000-1006",
      contactPersonJa: "人事 佐久間",
    },
    matchingHintTags: ["提案営業", "分析力", "広告運用", "顧客理解"],
  },
  {
    id: "client-blueorbit",
    legalNameJa: "BlueOrbit株式会社",
    tradeNameJa: "BlueOrbit",
    industryJa: "クラウドインテグレーション",
    prefectureJa: "神奈川県",
    cityJa: "横浜市",
    cultureJa: "技術理解を持つビジネス職を重視。",
    aiTargetProfileJa: "IT知識と顧客提案の橋渡し経験。",
    workplaceEnvironmentJa: "プリセールス主導で案件推進。",
    currentChallengesJa: "案件難易度に対する提案品質の平準化。",
    recruitmentJa: "ITソリューション営業 2名（クラウド基礎、提案設計、要件整理）。",
    operations: { currentAssignees: 11, openSlots: 2, retentionRatePct: 85, satisfactionScore: 4.4 },
    ltMonthlyProfitPerHeadJpy: 165000,
    contact: {
      email: "talent@blueorbit.example.com",
      phone: "045-700-1007",
      contactPersonJa: "採用責任者 大野",
    },
    matchingHintTags: ["クラウド基礎", "要件整理", "IT提案", "プリセールス"],
  },
  {
    id: "client-neostaff",
    legalNameJa: "NeoStaff株式会社",
    tradeNameJa: "NeoStaff",
    industryJa: "人材プラットフォーム",
    prefectureJa: "福岡県",
    cityJa: "福岡市",
    cultureJa: "候補者体験を重視。スピード採用を志向。",
    aiTargetProfileJa: "採用知見とB2B営業の両方を持つ人材。",
    workplaceEnvironmentJa: "採用データと営業データを横断して提案。",
    currentChallengesJa: "エンプラ採用案件への提案強化。",
    recruitmentJa: "採用コンサル営業 2名（採用知見、B2B提案、KPI設計）。",
    operations: { currentAssignees: 9, openSlots: 2, retentionRatePct: 87, satisfactionScore: 4.5 },
    ltMonthlyProfitPerHeadJpy: 155000,
    contact: {
      email: "careers@neostaff.example.com",
      phone: "092-700-1008",
      contactPersonJa: "採用担当 井上",
    },
    matchingHintTags: ["採用知見", "B2B提案", "KPI設計", "関係構築"],
  },
];

const clientEnhancements: Record<string, Partial<ClientCompany>> = {
  "client-cloudflow": {
    companySummaryJa:
      "中堅B2B向けに営業DXを提供。インサイドセールス起点で商談創出を行うSaaS企業。",
    hiringContextJa:
      "SMBセグメントの商談化率が低下しており、初回接触品質の底上げが急務。",
    teamStructureJa: "営業本部20名（インサイド8/フィールド7/CS5）",
    selectionProcessJa: ["書類選考", "一次面接（営業Mgr）", "最終面接（事業責任者）"],
    offerConditionJa: "想定年収 520-700万円 / ハイブリッド勤務 / フレックス",
    hiringPriority: "high",
    urgencyLabelJa: "最優先",
    roleRequirements: {
      must: ["SaaS", "新規開拓", "KPI運用"],
      want: ["ABM", "HubSpot", "提案資料作成"],
      ng: ["受け身営業", "数値管理の経験不足"],
    },
  },
  "client-finboard": {
    companySummaryJa: "金融機関向けの与信・審査支援プロダクトを提供するFinTech企業。",
    hiringContextJa: "エンタープライズ案件増に伴い、提案フェーズの交渉リソースが不足。",
    teamStructureJa: "Biz部門16名（AE9/SC4/CS3）",
    selectionProcessJa: ["書類選考", "一次面接（AE責任者）", "ケース面接", "最終面接"],
    offerConditionJa: "想定年収 600-820万円 / 固定+インセンティブ",
    hiringPriority: "high",
    urgencyLabelJa: "最優先",
    roleRequirements: {
      must: ["金融知識", "エンタープライズ営業", "交渉力"],
      want: ["提案書", "複数部署調整", "受注管理"],
      ng: ["短期離職傾向", "ドキュメント品質が低い"],
    },
  },
  "client-workmate": {
    companySummaryJa: "採用管理クラウドを提供し、導入後の運用定着まで伴走するHR Tech企業。",
    hiringContextJa: "導入顧客は増加しているが、90日定着フェーズの支援体制を強化したい。",
    teamStructureJa: "CS組織12名（オンボード6/運用支援6）",
    selectionProcessJa: ["書類選考", "一次面接（CS責任者）", "最終面接"],
    offerConditionJa: "想定年収 500-680万円 / フルリモート可",
    hiringPriority: "medium",
    urgencyLabelJa: "今月採用",
    roleRequirements: {
      must: ["カスタマーサクセス", "採用業務理解", "オンボーディング"],
      want: ["データ活用", "SaaS運用設計", "研修設計"],
      ng: ["顧客折衝経験なし", "受け身姿勢"],
    },
  },
  "client-peakconsulting": {
    companySummaryJa: "業務改革・IT導入を支援するコンサルファーム。",
    hiringContextJa: "提案案件増加により、課題整理と提案設計を担える人材を増員。",
    teamStructureJa: "提案組織14名（プリセールス7/コンサル7）",
    selectionProcessJa: ["書類選考", "ケース面接", "最終面接"],
    offerConditionJa: "想定年収 620-860万円 / リモート併用",
    hiringPriority: "medium",
    urgencyLabelJa: "四半期内",
    roleRequirements: {
      must: ["課題整理", "提案設計", "ファシリテーション"],
      want: ["エグゼクティブ折衝", "要件定義", "プロジェクト推進"],
      ng: ["抽象化が苦手", "顧客折衝経験不足"],
    },
  },
  "client-logix": {
    companySummaryJa: "物流事業者向けにWMS/TMS導入を推進する物流DX企業。",
    hiringContextJa: "PoC案件の増加で現場ヒアリングから提案化までの人員が不足。",
    teamStructureJa: "営業組織10名（提案6/導入4）",
    selectionProcessJa: ["書類選考", "一次面接", "最終面接"],
    offerConditionJa: "想定年収 540-720万円 / 出張あり",
    hiringPriority: "high",
    urgencyLabelJa: "最優先",
    roleRequirements: {
      must: ["物流業務知識", "PoC", "業務改善"],
      want: ["顧客折衝", "現場観察", "導入支援"],
      ng: ["現場訪問不可", "業務理解不足"],
    },
  },
  "client-zenithmedia": {
    companySummaryJa: "企業のデジタルマーケ施策を支援する広告運用会社。",
    hiringContextJa: "提案数増に対して分析から提案まで担う人員を増強。",
    teamStructureJa: "アカウント部門11名（運用6/営業5）",
    selectionProcessJa: ["書類選考", "一次面接", "最終面接"],
    offerConditionJa: "想定年収 500-650万円 / 出社3日",
    hiringPriority: "medium",
    urgencyLabelJa: "来月まで",
    roleRequirements: {
      must: ["提案営業", "分析力", "広告運用"],
      want: ["顧客理解", "レポーティング", "KPI設計"],
      ng: ["数値アレルギー", "提案経験不足"],
    },
  },
  "client-blueorbit": {
    companySummaryJa: "クラウド導入と内製化支援を行うSI企業。",
    hiringContextJa: "技術要件を理解しつつ顧客提案を前進させる人材が不足。",
    teamStructureJa: "プリセールス部門15名",
    selectionProcessJa: ["書類選考", "一次面接", "技術理解面接", "最終面接"],
    offerConditionJa: "想定年収 580-760万円 / リモート併用",
    hiringPriority: "medium",
    urgencyLabelJa: "四半期内",
    roleRequirements: {
      must: ["クラウド基礎", "IT提案", "要件整理"],
      want: ["プリセールス", "提案設計", "顧客調整"],
      ng: ["IT用語理解不足", "要件整理経験なし"],
    },
  },
  "client-neostaff": {
    companySummaryJa: "採用プラットフォームを提供し、企業の採用成功を支援する企業。",
    hiringContextJa: "採用コンサル案件増で、提案と運用設計の両方を担える人材を増員。",
    teamStructureJa: "採用コンサル部門13名",
    selectionProcessJa: ["書類選考", "一次面接", "最終面接"],
    offerConditionJa: "想定年収 520-700万円 / ハイブリッド",
    hiringPriority: "high",
    urgencyLabelJa: "最優先",
    roleRequirements: {
      must: ["採用知見", "B2B提案", "KPI設計"],
      want: ["関係構築", "運用改善", "CS経験"],
      ng: ["採用業務未経験", "提案型営業の経験不足"],
    },
  },
};

export const clients: ClientCompany[] = baseClients.map((client) => ({
  ...client,
  ...clientEnhancements[client.id],
}));

const baseContact = {
  email: "candidate@example.com",
  phone: "090-0000-0000",
};

function cand(
  partial: Omit<Candidate, "contact" | "registeredAt"> & { contact?: Partial<Candidate["contact"]> },
): Candidate {
  return {
    ...partial,
    contact: { ...baseContact, ...partial.contact },
    registeredAt: "2026-04-01",
  };
}

const candidateSeeds = [
  { id: "cand-001", score: 95, status: "最終面談", skills: ["SaaS", "新規開拓", "KPI運用"], summary: "SaaS企業で法人営業5年。インサイドからフィールドまで一貫経験。", career: "B2B SaaSでSMB〜Mid市場の提案営業を担当。年間目標120%達成。", clientId: "client-cloudflow" },
  { id: "cand-002", score: 92, status: "内定", skills: ["エンタープライズ営業", "提案書", "交渉力"], summary: "金融向けIT提案を4年。複数部門調整に強み。", career: "FinTech領域でエンプラ商談を担当。稟議支援と提案書作成に実績。", clientId: "client-finboard" },
  { id: "cand-003", score: 90, status: "最終面談", skills: ["カスタマーサクセス", "オンボーディング", "データ活用"], summary: "導入後の定着支援を中心に3年経験。", career: "HR Techプロダクトで活用定着PJを推進。解約率改善を担当。", clientId: "client-workmate" },
  { id: "cand-004", score: 88, status: "一次面談", skills: ["課題整理", "提案設計", "ファシリテーション"], summary: "ITコンサルで提案フェーズを担当。", career: "業務改革PJの提案・要件整理を担当。クライアント折衝経験が豊富。", clientId: "client-peakconsulting" },
  { id: "cand-005", score: 86, status: "書類選考", skills: ["物流業務知識", "PoC", "業務改善"], summary: "物流システム営業経験4年。", career: "WMS導入案件のPoCを複数担当。現場ヒアリングに強み。", clientId: "client-logix" },
  { id: "cand-006", score: 84, status: "応募受付", skills: ["提案営業", "分析力", "広告運用"], summary: "広告代理店でアカウントプランナー経験。", career: "広告運用と営業提案を横断。分析レポート作成にも対応。", clientId: "client-zenithmedia" },
  { id: "cand-007", score: 83, status: "一次面談", skills: ["クラウド基礎", "IT提案", "要件整理"], summary: "SIerプリセールス経験3年。", career: "クラウド移行提案を担当。技術部門と営業部門の橋渡しを経験。", clientId: "client-blueorbit" },
  { id: "cand-008", score: 82, status: "書類選考", skills: ["採用知見", "B2B提案", "関係構築"], summary: "採用支援サービス営業経験。", career: "採用課題ヒアリングから運用定着まで伴走。継続率改善を担当。", clientId: "client-neostaff" },
  { id: "cand-009", score: 80, status: "最終面談", skills: ["SaaS", "提案力", "顧客折衝"], summary: "法人営業6年。アカウント深耕に強み。", career: "既存顧客へのアップセル・クロスセルを担当し、年間売上を拡大。", clientId: "client-cloudflow" },
  { id: "cand-010", score: 79, status: "内定", skills: ["金融知識", "ドキュメント品質", "交渉力"], summary: "金融業界向けソリューション営業。", career: "稟議支援・提案ドキュメントの標準化で案件成約率を向上。", clientId: "client-finboard" },
  { id: "cand-011", score: 78, status: "一次面談", skills: ["採用業務理解", "データ活用", "オンボーディング"], summary: "採用管理SaaSのCS経験。", career: "導入企業の活用率改善を担当。採用プロセス設計の提案経験。", clientId: "client-workmate" },
  { id: "cand-012", score: 77, status: "応募受付", skills: ["課題整理", "顧客折衝", "提案設計"], summary: "業務系コンサル出身。", career: "課題定義から提案までを一気通貫で担当。複数ステークホルダー調整経験。", clientId: "client-peakconsulting" },
  { id: "cand-013", score: 76, status: "辞退保留", skills: ["物流業務知識", "業務改善", "顧客理解"], summary: "物流業界の業務改善提案を経験。", career: "現場改善提案を3年担当。提案内容の実行支援まで実施。", clientId: "client-logix" },
  { id: "cand-014", score: 75, status: "入社調整", skills: ["提案営業", "広告運用", "KPI設計"], summary: "マーケ領域の提案営業経験。", career: "広告効果の可視化と改善提案を担当。定例提案の運用経験あり。", clientId: "client-zenithmedia" },
  { id: "cand-015", score: 74, status: "書類選考", skills: ["クラウド基礎", "要件整理", "ドキュメント"], summary: "IT営業アシスタント経験。", career: "技術資料作成と要件整理を担当。顧客ヒアリングの同席経験あり。", clientId: "client-blueorbit" },
  { id: "cand-016", score: 73, status: "一次面談", skills: ["採用知見", "KPI設計", "関係構築"], summary: "採用代行会社で法人対応を経験。", career: "採用KPIの見直しと運用改善を担当。採用担当との関係構築に強み。", clientId: "client-neostaff" },
  { id: "cand-017", score: 71, status: "応募受付", skills: ["新規開拓", "提案力", "ヒアリング"], summary: "無形商材営業2年。", career: "新規商談の開拓に従事。ヒアリング品質の改善で商談化率を向上。", clientId: "client-cloudflow" },
  { id: "cand-018", score: 70, status: "書類選考", skills: ["金融知識", "資料作成", "顧客折衝"], summary: "金融系法人営業3年。", career: "提案資料作成と顧客折衝を担当。業務理解は高いがSaaS経験は浅い。", clientId: "client-finboard" },
  { id: "cand-019", score: 69, status: "辞退保留", skills: ["カスタマーサクセス", "顧客理解", "課題整理"], summary: "CS経験2年。", career: "利用定着支援を担当。複数案件並行の運用は要フォロー。", clientId: "client-workmate" },
  { id: "cand-020", score: 68, status: "入社調整", skills: ["提案設計", "ファシリテーション", "分析力"], summary: "業務改善提案の経験あり。", career: "社内向け改善PJを推進。顧客提案はこれから強化予定。", clientId: "client-peakconsulting" },
];

export const candidates: Candidate[] = candidateSeeds.map((seed, index) =>
  cand({
    id: seed.id,
    displayName: `候補者A${String(index + 1).padStart(2, "0")}`,
    legalNameFull: `候補者A${String(index + 1).padStart(2, "0")} 正式名`,
    nameKatakana: `コウホシャA${String(index + 1).padStart(2, "0")}`,
    age: 24 + (index % 10),
    gender: index % 3 === 0 ? "female" : "male",
    nationality: "日本",
    birthDate: `199${index % 10}-0${(index % 8) + 1}-15`,
    birthPlace: `東京都`,
    residence: { country: "日本", city: `東京都`, note: index % 2 === 0 ? "リモート可" : undefined },
    jlpt: index % 5 === 0 ? "N1" : index % 3 === 0 ? "N2" : "N3",
    jlptNote: "ビジネス文書・面接コミュニケーション対応可",
    backgroundSummary: seed.summary,
    educationWorkHistory: seed.career,
    skillTags: seed.skills,
    tokuteiGinoFoodManufacturing: false,
    driversLicenseLk: index % 4 === 0,
    aiScore: seed.score,
    aiScoreRationale: `${seed.skills[0]} と ${seed.skills[1]} の経験が求人要件に一致。`,
    ...statusMap(seed.status as keyof typeof statusLabelMap),
    passportNumber: `R-${String(index + 1).padStart(4, "0")}`,
    passportExpiry: "2028-12-31",
    coeStatusJa: "職務経歴書レビュー済み",
    documentAlertJa: seed.status === "辞退保留" ? "選考停滞のためフォロー連絡が必要。" : undefined,
    plannedAssignment:
      seed.status === "最終面談" || seed.status === "内定" || seed.status === "入社調整"
        ? {
            clientId: seed.clientId,
            jobTitleJa: "法人営業",
            monthlySalaryJpy: 420000 + (index % 5) * 20000,
          }
        : undefined,
    personaHeadline: `${seed.skills[0]}を軸に成果を出す${index % 2 === 0 ? "提案型" : "伴走型"}人材`,
    yearsOfExperience: 3 + (index % 6),
    currentRoleJa:
      seed.skills.includes("カスタマーサクセス") || seed.skills.includes("オンボーディング")
        ? "カスタマーサクセス"
        : seed.skills.includes("プリセールス") || seed.skills.includes("要件整理")
          ? "プリセールス"
          : "法人営業",
    achievementHighlights: [
      `直近年度で目標達成率 ${108 + (index % 5) * 4}%`,
      `担当案件の成約率 ${24 + (index % 4) * 6}%`,
      `継続率 ${82 + (index % 5) * 3}% の運用実績`,
    ],
    careerTimeline: [
      {
        period: `20${16 + (index % 4)}-20${18 + (index % 4)}`,
        companyJa: "新卒入社企業（匿名）",
        roleJa: "インサイドセールス",
        summaryJa: "新規架電と商談化を担当。顧客課題のヒアリング品質を改善。",
      },
      {
        period: `20${19 + (index % 3)}-20${21 + (index % 3)}`,
        companyJa: "前職企業（匿名）",
        roleJa: "フィールドセールス",
        summaryJa: "提案資料作成とクロージングを担当。複数部署調整を経験。",
      },
      {
        period: `20${22 + (index % 2)}-現在`,
        companyJa: "現職企業（匿名）",
        roleJa:
          seed.skills.includes("カスタマーサクセス") || seed.skills.includes("オンボーディング")
            ? "カスタマーサクセス"
            : "アカウント営業",
        summaryJa: seed.career,
      },
    ],
    preferredConditions: {
      desiredAnnualIncomeManYen: 520 + (index % 6) * 40,
      preferredWorkStyle: index % 2 === 0 ? "ハイブリッド希望" : "出社中心も可",
      preferredLocationJa: index % 3 === 0 ? "東京都内" : "首都圏",
      availableFrom: `2026-0${(index % 6) + 5}-01`,
    },
    riskNotes:
      seed.status === "辞退保留"
        ? ["選考停滞による温度感低下リスク", "年収条件の再確認が必要"]
        : seed.status === "応募受付"
          ? ["職種理解の深掘りが必要"]
          : ["特記事項なし"],
    recommendationCommentJa: `求人の必須要件（${seed.skills[0]}）に対する再現性が高く、初回90日で成果期待が持てます。`,
    screeningTimeline: [
      { step: "応募受付", at: "2026-04-10", status: "done" },
      { step: "書類選考", at: "2026-04-12", status: "done" },
      {
        step: "一次面談",
        at: "2026-04-15",
        status:
          seed.status === "応募受付" || seed.status === "書類選考"
            ? "todo"
            : "done",
      },
      {
        step: "最終面談",
        at: "2026-04-18",
        status:
          seed.status === "最終面談" || seed.status === "内定" || seed.status === "入社調整"
            ? "in_progress"
            : "todo",
      },
    ],
    actionPlan: {
      primaryAction:
        seed.status === "応募受付"
          ? "書類通過を判定"
          : seed.status === "書類選考"
            ? "一次面談を調整"
            : seed.status === "一次面談"
              ? "評価入力を確定"
              : seed.status === "最終面談"
                ? "内定条件を提示"
                : seed.status === "内定"
                  ? "入社日を確定"
                  : "フォロー連絡を実施",
      owner:
        seed.status === "応募受付" || seed.status === "書類選考"
          ? "agent"
          : seed.status === "最終面談" || seed.status === "内定"
            ? "company"
            : "candidate",
      dueDate: `2026-04-${String(20 + (index % 7)).padStart(2, "0")}`,
      candidateTask: "希望条件の最終確認と面談可能日時の提出",
      companyTask: "評価コメント入力と次回選考枠の確定",
    },
    photoUrl: avatar(seed.id),
  }),
);

export const demoBundle: DemoDataBundle = {
  meta: {
    version: "2.0.0",
    locale: "ja-JP",
    referenceDate: "2026-04-21",
    descriptionJa: "採用管理デモ用ダミーデータ（ビジネス系企業8社・候補者20名）",
  },
  candidates,
  clients,
};

export function getClientById(id: string): ClientCompany | undefined {
  return clients.find((c) => c.id === id);
}

export function getCandidateById(id: string): Candidate | undefined {
  return candidates.find((c) => c.id === id);
}

export function getPipelineCounts(): Record<CandidatePipelineStatus, number> {
  const init: Record<CandidatePipelineStatus, number> = {
    awaiting_entry: 0,
    interview_coordination: 0,
    training: 0,
    offer_accepted: 0,
    visa_applying: 0,
    document_blocked: 0,
    document_prep: 0,
  };
  for (const c of candidates) init[c.pipelineStatus] += 1;
  return init;
}

export function countN3OrAbove(): number {
  return candidates.filter((c) => jlptOrder(c.jlpt) >= 3).length;
}

export function getTopCandidatesByAiScore(limit: number): Candidate[] {
  return [...candidates].sort((a, b) => b.aiScore - a.aiScore).slice(0, limit);
}

export function countDocumentAlerts(): number {
  return candidates.filter((c) => c.pipelineStatus === "document_blocked" || c.pipelineStatus === "document_prep" || Boolean(c.documentAlertJa)).length;
}

export function totalOpenSlots(): number {
  return clients.reduce((sum, c) => sum + c.operations.openSlots, 0);
}

export function monthlyRevenueTrend(): { month: string; amountManYen: number }[] {
  return [
    { month: "2025-11", amountManYen: 96 },
    { month: "2025-12", amountManYen: 101 },
    { month: "2026-01", amountManYen: 108 },
    { month: "2026-02", amountManYen: 112 },
    { month: "2026-03", amountManYen: 120 },
    { month: "2026-04", amountManYen: 126 },
  ];
}

export function scoreCandidateForClient(
  candidate: Candidate,
  client: ClientCompany,
): { pct: number; reason: string } {
  const hit = candidate.skillTags.filter((t) =>
    client.matchingHintTags.some((h) => h.includes(t) || t.includes(h)),
  ).length;
  const pct = Math.min(98, 56 + hit * 9 + Math.floor((candidate.aiScore - 60) / 2));
  const reason = `${client.tradeNameJa}の必須要件（${client.matchingHintTags.slice(0, 2).join("・")}）と、候補者の実務経験（${candidate.skillTags.slice(0, 3).join("・")}）が一致しています。`;
  return { pct, reason };
}

export function getMatchesForClient(clientId: string) {
  const client = getClientById(clientId);
  if (!client) return [];
  return [...candidates]
    .map((c) => ({ candidate: c, ...scoreCandidateForClient(c, client) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);
}
