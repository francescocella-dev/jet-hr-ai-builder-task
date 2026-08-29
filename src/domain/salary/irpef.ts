import { IRPEF_BRACKETS } from './rules2026'
import { calculateProgressiveTax } from './progressiveTax'

export function calculateGrossIrpef(taxableIncome: number): number {
  return calculateProgressiveTax(taxableIncome, IRPEF_BRACKETS)
}

export function calculateNetIrpef(
  grossIrpef: number,
  employeeDeduction: number,
  taxWedgeDeduction: number,
): number {
  return Math.max(0, grossIrpef - employeeDeduction - taxWedgeDeduction)
}
