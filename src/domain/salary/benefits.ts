import {
  INTEGRATIVE_TREATMENT_AMOUNT,
  INTEGRATIVE_TREATMENT_DEDUCTION_OFFSET,
  INTEGRATIVE_TREATMENT_LIMIT,
  TAX_WEDGE_EXEMPT_RATES,
  TAX_WEDGE_MAX_DEDUCTION,
  TAX_WEDGE_THRESHOLDS,
} from './rules2026'

export interface TaxWedgeBenefit {
  taxWedgeExemptSum: number
  taxWedgeDeduction: number
}

export function calculateTaxWedgeBenefit(taxableIncome: number): TaxWedgeBenefit {
  const thresholds = TAX_WEDGE_THRESHOLDS

  if (taxableIncome <= thresholds.first) {
    return { taxWedgeExemptSum: taxableIncome * TAX_WEDGE_EXEMPT_RATES.first, taxWedgeDeduction: 0 }
  }
  if (taxableIncome <= thresholds.second) {
    return { taxWedgeExemptSum: taxableIncome * TAX_WEDGE_EXEMPT_RATES.second, taxWedgeDeduction: 0 }
  }
  if (taxableIncome <= thresholds.exemptSumLimit) {
    return { taxWedgeExemptSum: taxableIncome * TAX_WEDGE_EXEMPT_RATES.third, taxWedgeDeduction: 0 }
  }
  if (taxableIncome <= thresholds.fullDeductionLimit) {
    return { taxWedgeExemptSum: 0, taxWedgeDeduction: TAX_WEDGE_MAX_DEDUCTION }
  }
  if (taxableIncome <= thresholds.deductionLimit) {
    return {
      taxWedgeExemptSum: 0,
      taxWedgeDeduction:
        TAX_WEDGE_MAX_DEDUCTION *
        ((thresholds.deductionLimit - taxableIncome) /
          (thresholds.deductionLimit - thresholds.fullDeductionLimit)),
    }
  }
  return { taxWedgeExemptSum: 0, taxWedgeDeduction: 0 }
}

export function calculateIntegrativeTreatment(
  taxableIncome: number,
  grossIrpef: number,
  employeeDeduction: number,
): number {
  if (taxableIncome <= INTEGRATIVE_TREATMENT_LIMIT) {
    return grossIrpef > employeeDeduction - INTEGRATIVE_TREATMENT_DEDUCTION_OFFSET
      ? INTEGRATIVE_TREATMENT_AMOUNT
      : 0
  }

  // V1 scope: no additional personal deductions are modeled for incomes between €15k and €28k.
  return 0
}
