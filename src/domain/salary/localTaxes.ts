import {
  LOCAL_TAX_NET_IRPEF_EXEMPTION,
  LOMBARDY_TAX_BRACKETS,
  MILAN_EXEMPTION_THRESHOLD,
  MILAN_TAX_RATE,
} from './rules2026'
import { calculateProgressiveTax } from './progressiveTax'

function localTaxesApply(netIrpef: number): boolean {
  // In V1 this is the relevant IRPEF after modeled deductions; no other personal deductions or tax credits apply.
  return netIrpef > LOCAL_TAX_NET_IRPEF_EXEMPTION
}

export function calculateLombardyTax(taxableIncome: number, netIrpef: number): number {
  return localTaxesApply(netIrpef) ? calculateProgressiveTax(taxableIncome, LOMBARDY_TAX_BRACKETS) : 0
}

export function calculateMilanTax(taxableIncome: number, netIrpef: number): number {
  if (!localTaxesApply(netIrpef) || taxableIncome <= MILAN_EXEMPTION_THRESHOLD) return 0
  return taxableIncome * MILAN_TAX_RATE
}
