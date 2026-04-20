/**
 * ダッシュボードデモ用ダミーデータの型（JSON と同一形状）。
 * Next.js 等から import して利用可能。
 */

export type Gender = "male" | "female";

export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

/**
 * 採用プロセス向けステータス。
 * キー名は後方互換のため維持し、表示名は industry profile 側で採用ドメインに置換する。
 */
export type CandidatePipelineStatus =
  | "awaiting_entry"
  | "interview_coordination"
  | "training"
  | "offer_accepted"
  | "visa_applying"
  | "document_blocked"
  | "document_prep";

export interface Candidate {
  id: string;
  displayName: string;
  legalNameFull: string;
  nameKatakana: string;
  age: number;
  gender: Gender;
  /** 例: Sri Lanka */
  nationality: string;
  birthDate: string;
  birthPlace: string;
  residence: {
    country: string;
    city: string;
    note?: string;
  };
  jlpt: JlptLevel;
  jlptNote?: string;
  backgroundSummary: string;
  educationWorkHistory: string;
  skillTags: string[];
  tokuteiGinoFoodManufacturing: boolean;
  driversLicenseLk: boolean;
  aiScore: number;
  aiScoreRationale?: string;
  pipelineStatus: CandidatePipelineStatus;
  pipelineStatusLabelJa: string;
  /** 応募書類ID（旧 passportNumber 互換） */
  passportNumber: string;
  /** 応募書類の期限（旧 passportExpiry 互換） */
  passportExpiry: string;
  /** 職務経歴書ステータス（旧 coeStatusJa 互換） */
  coeStatusJa: string;
  documentAlertJa?: string;
  plannedAssignment?: {
    clientId: string;
    jobTitleJa: string;
    monthlySalaryJpy: number;
  };
  contact: {
    email: string;
    phone: string;
  };
  photoUrl: string;
  registeredAt: string;
}

export interface ClientCompany {
  id: string;
  legalNameJa: string;
  tradeNameJa: string;
  industryJa: string;
  prefectureJa: string;
  cityJa: string;
  addressLineJa?: string;
  cultureJa: string;
  aiTargetProfileJa: string;
  representative?: {
    nameJa: string;
    age?: number;
    noteJa: string;
  };
  workplaceEnvironmentJa: string;
  currentChallengesJa?: string;
  recruitmentJa: string;
  operations: {
    currentAssignees: number;
    openSlots: number;
    retentionRatePct: number;
    satisfactionScore: number;
  };
  ltMonthlyProfitPerHeadJpy?: number;
  contact: {
    email: string;
    phone: string;
    contactPersonJa: string;
  };
  matchingHintTags: string[];
}

export interface DemoDataBundle {
  meta: {
    version: string;
    locale: string;
    referenceDate: string;
    descriptionJa: string;
  };
  candidates: Candidate[];
  clients: ClientCompany[];
}
