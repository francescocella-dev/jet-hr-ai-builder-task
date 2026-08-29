export const SUPPORTED_INSTALLMENTS = [12, 13, 14] as const

export type Installments = (typeof SUPPORTED_INSTALLMENTS)[number]

export interface SalaryInput {
  grossAnnualSalary: number
  installments: Installments
}

export interface SalaryCalculation {
  grossAnnualSalary: number
  installments: Installments
  ordinaryContributions: number
  additionalContribution: number
  totalContributions: number
  taxableIncome: number
  grossIrpef: number
  employeeDeduction: number
  taxWedgeDeduction: number
  netIrpef: number
  taxWedgeExemptSum: number
  integrativeTreatment: number
  regionalTax: number
  municipalTax: number
  totalTaxes: number
  totalWithholdings: number
  netAnnualSalary: number
  averageMonthlyNetSalary: number
}
