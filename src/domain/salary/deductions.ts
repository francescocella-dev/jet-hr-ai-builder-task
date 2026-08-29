import {
  EMPLOYEE_DEDUCTION_AMOUNTS,
  EMPLOYEE_DEDUCTION_THRESHOLDS,
} from './rules2026'

export function calculateEmployeeDeduction(taxableIncome: number): number {
  const thresholds = EMPLOYEE_DEDUCTION_THRESHOLDS
  const amounts = EMPLOYEE_DEDUCTION_AMOUNTS
  let deduction: number

  if (taxableIncome <= thresholds.first) {
    deduction = amounts.lowestIncome
  } else if (taxableIncome <= thresholds.second) {
    deduction =
      amounts.base +
      amounts.decreasingComponent * ((thresholds.second - taxableIncome) / (thresholds.second - thresholds.first))
  } else if (taxableIncome <= thresholds.third) {
    deduction = amounts.base * ((thresholds.third - taxableIncome) / (thresholds.third - thresholds.second))
  } else {
    deduction = 0
  }

  if (taxableIncome > thresholds.bonusStart && taxableIncome <= thresholds.bonusEnd) {
    deduction += amounts.bonus
  }

  return deduction
}
