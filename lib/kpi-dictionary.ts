export const kpiDictionary = {
  timeSavedMinutesPerDay: {
    label: "1日あたり削減時間",
    unit: "分",
  },
  followLeakageRate: {
    label: "フォロー漏れ率",
    unit: "%",
  },
  proposalCycleHours: {
    label: "候補者提案までの平均時間",
    unit: "h",
  },
  knowledgeReuseRate: {
    label: "ナレッジ再利用率",
    unit: "%",
  },
  grossMarginImpactManYen: {
    label: "粗利インパクト",
    unit: "万円/月",
  },
} as const;

export type KpiKey = keyof typeof kpiDictionary;

export function getKpiMeta(key: KpiKey) {
  return kpiDictionary[key];
}

export const kpiKeyList = Object.keys(kpiDictionary) as KpiKey[];
