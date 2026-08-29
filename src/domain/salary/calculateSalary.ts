import { calculateIntegrativeTreatment, calculateTaxWedgeBenefit } from './benefits'
import { calculateEmployeeDeduction } from './deductions'
import { calculateGrossIrpef, calculateNetIrpef } from './irpef'
import { calculateLombardyTax, calculateMilanTax } from './localTaxes'
import { MAX_GROSS_ANNUAL_SALARY, MIN_GROSS_ANNUAL_SALARY } from './rules2026'
import { calculateSocialContributions } from './socialContributions'
import { SUPPORTED_INSTALLMENTS, type SalaryCalculation, type SalaryInput } from './types'

function validateInput(input: SalaryInput): void {
  if (!Number.isFinite(input.grossAnnualSalary)) {
    throw new RangeError('grossAnnualSalary must be a finite number')
  }
  if (
    input.grossAnnualSalary < MIN_GROSS_ANNUAL_SALARY ||
    input.grossAnnualSalary > MAX_GROSS_ANNUAL_SALARY
  ) {
    throw new RangeError(
      `grossAnnualSalary must be between ${MIN_GROSS_ANNUAL_SALARY} and ${MAX_GROSS_ANNUAL_SALARY}`,
    )
  }
  if (!SUPPORTED_INSTALLMENTS.includes(input.installments)) {
    throw new RangeError('installments must be 12, 13, or 14')
  }
}

export function calculateSalary(input: SalaryInput): SalaryCalculation {
  validateInput(input)

  const contributions = calculateSocialContributions(input.grossAnnualSalary)
  const taxableIncome = input.grossAnnualSalary - contributions.totalContributions
  const grossIrpef = calculateGrossIrpef(taxableIncome)
  const employeeDeduction = calculateEmployeeDeduction(taxableIncome)
  const { taxWedgeExemptSum, taxWedgeDeduction } = calculateTaxWedgeBenefit(taxableIncome)
  const netIrpef = calculateNetIrpef(grossIrpef, employeeDeduction, taxWedgeDeduction)
  const integrativeTreatment = calculateIntegrativeTreatment(taxableIncome, grossIrpef, employeeDeduction)
  const regionalTax = calculateLombardyTax(taxableIncome, netIrpef)
  const municipalTax = calculateMilanTax(taxableIncome, netIrpef)
  const totalTaxes = netIrpef + regionalTax + municipalTax
  const totalWithholdings = contributions.totalContributions + totalTaxes
  const netAnnualSalary =
    input.grossAnnualSalary - totalWithholdings + taxWedgeExemptSum + integrativeTreatment

  return {
    ...input,
    ...contributions,
    taxableIncome,
    grossIrpef,
    employeeDeduction,
    taxWedgeDeduction,
    netIrpef,
    taxWedgeExemptSum,
    integrativeTreatment,
    regionalTax,
    municipalTax,
    totalTaxes,
    totalWithholdings,
    netAnnualSalary,
    averageMonthlyNetSalary: netAnnualSalary / input.installments,
  }
}
