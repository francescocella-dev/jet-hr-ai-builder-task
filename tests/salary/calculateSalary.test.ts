import { describe, expect, it } from 'vitest'
import { calculateSalary } from '../../src/domain/salary'
import type { SalaryInput } from '../../src/domain/salary'

describe('calculateSalary', () => {
  it('matches the required €15,000 / 13 installments low-income fixture', () => {
    const result = calculateSalary({ grossAnnualSalary: 15_000, installments: 13 })

    expect(result.ordinaryContributions).toBeCloseTo(1_378.5, 8)
    expect(result.additionalContribution).toBe(0)
    expect(result.totalContributions).toBeCloseTo(1_378.5, 8)
    expect(result.taxableIncome).toBeCloseTo(13_621.5, 8)
    expect(result.grossIrpef).toBeCloseTo(3_132.945, 8)
    expect(result.employeeDeduction).toBeCloseTo(1_955, 8)
    expect(result.taxWedgeExemptSum).toBeCloseTo(721.9395, 8)
    expect(result.taxWedgeDeduction).toBe(0)
    expect(result.netIrpef).toBeCloseTo(1_177.945, 8)
    expect(result.integrativeTreatment).toBe(1_200)
    expect(result.regionalTax).toBeCloseTo(167.54445, 8)
    expect(result.municipalTax).toBe(0)
    expect(result.totalTaxes).toBeCloseTo(1_345.48945, 8)
    expect(result.totalWithholdings).toBeCloseTo(2_723.98945, 8)
    expect(result.netAnnualSalary).toBeCloseTo(14_197.95005, 8)
    expect(result.averageMonthlyNetSalary).toBeCloseTo(1_092.150003846, 8)
  })

  it('matches the required €35,000 / 13 installments fixture', () => {
    const result = calculateSalary({ grossAnnualSalary: 35_000, installments: 13 })

    expect(result.ordinaryContributions).toBeCloseTo(3_216.5, 8)
    expect(result.additionalContribution).toBe(0)
    expect(result.totalContributions).toBeCloseTo(3_216.5, 8)
    expect(result.taxableIncome).toBeCloseTo(31_783.5, 8)
    expect(result.grossIrpef).toBeCloseTo(7_688.555, 8)
    expect(result.employeeDeduction).toBeCloseTo(1_646.523409, 6)
    expect(result.taxWedgeDeduction).toBeCloseTo(1_000, 8)
    expect(result.netIrpef).toBeCloseTo(5_042.031591, 6)
    expect(result.regionalTax).toBeCloseTo(454.9762, 8)
    expect(result.municipalTax).toBeCloseTo(254.268, 8)
    expect(result.totalTaxes).toBeCloseTo(5_751.275791, 6)
    expect(result.totalWithholdings).toBeCloseTo(8_967.775791, 6)
    expect(result.netAnnualSalary).toBeCloseTo(26_032.224209, 6)
    expect(result.averageMonthlyNetSalary).toBeCloseTo(2_002.478785, 6)
  })

  it('matches the required €70,000 / 13 installments high-income fixture', () => {
    const result = calculateSalary({ grossAnnualSalary: 70_000, installments: 13 })

    expect(result.ordinaryContributions).toBeCloseTo(6_433, 8)
    expect(result.additionalContribution).toBeCloseTo(137.76, 8)
    expect(result.totalContributions).toBeCloseTo(6_570.76, 8)
    expect(result.taxableIncome).toBeCloseTo(63_429.24, 8)
    expect(result.grossIrpef).toBeCloseTo(19_474.5732, 8)
    expect(result.employeeDeduction).toBe(0)
    expect(result.taxWedgeExemptSum).toBe(0)
    expect(result.taxWedgeDeduction).toBe(0)
    expect(result.integrativeTreatment).toBe(0)
    expect(result.netIrpef).toBeCloseTo(19_474.5732, 8)
    expect(result.regionalTax).toBeCloseTo(1_000.625852, 8)
    expect(result.municipalTax).toBeCloseTo(507.43392, 8)
    expect(result.totalTaxes).toBeCloseTo(20_982.632972, 8)
    expect(result.totalWithholdings).toBeCloseTo(27_553.392972, 8)
    expect(result.netAnnualSalary).toBeCloseTo(42_446.607028, 8)
    expect(result.averageMonthlyNetSalary).toBeCloseTo(3_265.123617538, 8)
  })

  it('keeps annual net unchanged when only installments change', () => {
    const annualNets = ([12, 13, 14] as const).map((installments) =>
      calculateSalary({ grossAnnualSalary: 35_000, installments }).netAnnualSalary,
    )
    expect(new Set(annualNets).size).toBe(1)
  })

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'rejects non-finite salary %s',
    (grossAnnualSalary) => {
      expect(() => calculateSalary({ grossAnnualSalary, installments: 13 })).toThrow(
        'grossAnnualSalary must be a finite number',
      )
    },
  )

  it.each([9_999.99, 100_000.01])('rejects out-of-range salary %s', (grossAnnualSalary) => {
    expect(() => calculateSalary({ grossAnnualSalary, installments: 13 })).toThrow(
      'grossAnnualSalary must be between 10000 and 100000',
    )
  })

  it.each([0, 11, 15])('rejects unsupported installment count %s', (installments) => {
    const invalidInput = { grossAnnualSalary: 35_000, installments } as SalaryInput
    expect(() => calculateSalary(invalidInput)).toThrow('installments must be 12, 13, or 14')
  })
})
