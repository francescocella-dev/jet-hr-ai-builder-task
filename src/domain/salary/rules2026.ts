export interface TaxBracket {
  upTo: number
  rate: number
}

export const MIN_GROSS_ANNUAL_SALARY = 10_000
export const MAX_GROSS_ANNUAL_SALARY = 100_000

export const SOCIAL_CONTRIBUTION_RATE = 0.0919
export const ADDITIONAL_CONTRIBUTION_RATE = 0.01
export const ADDITIONAL_CONTRIBUTION_THRESHOLD = 56_224

export const IRPEF_BRACKETS: readonly TaxBracket[] = [
  { upTo: 28_000, rate: 0.23 },
  { upTo: 50_000, rate: 0.33 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.43 },
]

export const EMPLOYEE_DEDUCTION_THRESHOLDS = {
  first: 15_000,
  second: 28_000,
  third: 50_000,
  bonusStart: 25_000,
  bonusEnd: 35_000,
} as const
export const EMPLOYEE_DEDUCTION_AMOUNTS = {
  lowestIncome: 1_955,
  base: 1_910,
  decreasingComponent: 1_190,
  bonus: 65,
} as const

export const TAX_WEDGE_THRESHOLDS = {
  first: 8_500,
  second: 15_000,
  exemptSumLimit: 20_000,
  fullDeductionLimit: 32_000,
  deductionLimit: 40_000,
} as const
export const TAX_WEDGE_EXEMPT_RATES = {
  first: 0.071,
  second: 0.053,
  third: 0.048,
} as const
export const TAX_WEDGE_MAX_DEDUCTION = 1_000

export const INTEGRATIVE_TREATMENT_LIMIT = 15_000
export const INTEGRATIVE_TREATMENT_AMOUNT = 1_200
export const INTEGRATIVE_TREATMENT_DEDUCTION_OFFSET = 75

export const LOMBARDY_TAX_BRACKETS: readonly TaxBracket[] = [
  { upTo: 15_000, rate: 0.0123 },
  { upTo: 28_000, rate: 0.0158 },
  { upTo: 50_000, rate: 0.0172 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.0173 },
]
export const LOCAL_TAX_NET_IRPEF_EXEMPTION = 10.33
export const MILAN_TAX_RATE = 0.008
export const MILAN_EXEMPTION_THRESHOLD = 23_000
