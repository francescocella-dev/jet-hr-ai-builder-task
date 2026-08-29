import { describe, expect, it } from 'vitest'
import {
  calculateAdditionalContribution,
  calculateEmployeeDeduction,
  calculateGrossIrpef,
  calculateIntegrativeTreatment,
  calculateLombardyTax,
  calculateMilanTax,
  calculateNetIrpef,
  calculateOrdinaryContributions,
  calculateTaxWedgeBenefit,
} from '../../src/domain/salary'

describe('ordinary social contributions', () => {
  it('applies the 9.19% rate', () => {
    expect(calculateOrdinaryContributions(35_000)).toBeCloseTo(3_216.5, 8)
  })
})

describe('additional social contribution', () => {
  it.each([
    [56_223.99, 0],
    [56_224, 0],
    [56_224.01, 0.0001],
  ])('calculates the amount at a salary of %s', (salary, expected) => {
    expect(calculateAdditionalContribution(salary)).toBeCloseTo(expected, 8)
  })
})

describe('gross IRPEF', () => {
  it.each([
    [27_999.99, 6_439.9977],
    [28_000, 6_440],
    [28_000.01, 6_440.0033],
    [49_999.99, 13_699.9967],
    [50_000, 13_700],
    [50_000.01, 13_700.0043],
  ])('applies progressive rates to an income of %s', (income, expected) => {
    expect(calculateGrossIrpef(income)).toBeCloseTo(expected, 8)
  })
})

describe('net IRPEF', () => {
  it('applies deductions without allowing a negative result', () => {
    expect(calculateNetIrpef(1_000, 1_200, 0)).toBe(0)
    expect(calculateNetIrpef(5_000, 1_500, 1_000)).toBe(2_500)
  })
})

describe('employee deduction', () => {
  const incomes = [
    14_999.99, 15_000, 15_000.01, 24_999.99, 25_000, 25_000.01, 27_999.99, 28_000, 28_000.01,
    34_999.99, 35_000, 35_000.01, 49_999.99, 50_000, 50_000.01,
  ]

  it.each(incomes)('matches the specified piecewise formula at %s', (income) => {
    let expected: number
    if (income <= 15_000) expected = 1_955
    else if (income <= 28_000) expected = 1_910 + 1_190 * ((28_000 - income) / 13_000)
    else if (income <= 50_000) expected = 1_910 * ((50_000 - income) / 22_000)
    else expected = 0
    if (income > 25_000 && income <= 35_000) expected += 65

    expect(calculateEmployeeDeduction(income)).toBeCloseTo(expected, 8)
  })
})

describe('tax wedge benefit', () => {
  const cases: Array<[number, number, number]> = [
    [8_499.99, 8_499.99 * 0.071, 0], [8_500, 8_500 * 0.071, 0], [8_500.01, 8_500.01 * 0.053, 0],
    [14_999.99, 14_999.99 * 0.053, 0], [15_000, 15_000 * 0.053, 0], [15_000.01, 15_000.01 * 0.048, 0],
    [19_999.99, 19_999.99 * 0.048, 0], [20_000, 20_000 * 0.048, 0], [20_000.01, 0, 1_000],
    [31_999.99, 0, 1_000], [32_000, 0, 1_000], [32_000.01, 0, 999.99875],
    [39_999.99, 0, 0.00125], [40_000, 0, 0], [40_000.01, 0, 0],
  ]

  it.each(cases)('returns the correct benefit at %s', (income, exemptSum, deduction) => {
    expect(calculateTaxWedgeBenefit(income).taxWedgeExemptSum).toBeCloseTo(exemptSum, 8)
    expect(calculateTaxWedgeBenefit(income).taxWedgeDeduction).toBeCloseTo(deduction, 8)
  })
})

describe('integrative treatment', () => {
  it('grants €1,200 within €15k only when the specified capacity condition holds', () => {
    expect(calculateIntegrativeTreatment(15_000, 1_881, 1_955)).toBe(1_200)
    expect(calculateIntegrativeTreatment(15_000, 1_880, 1_955)).toBe(0)
  })

  it('does not grant it above €15k in the V1 scope', () => {
    expect(calculateIntegrativeTreatment(15_000.01, 10_000, 0)).toBe(0)
    expect(calculateIntegrativeTreatment(28_000, 10_000, 0)).toBe(0)
  })
})

describe('local taxes', () => {
  it.each([
    [22_999.99, 0],
    [23_000, 0],
    [23_000.01, 184.00008],
  ])('applies Milan exemption at %s', (income, expected) => {
    expect(calculateMilanTax(income, 100)).toBeCloseTo(expected, 8)
  })

  it('sets both local taxes to zero when relevant net IRPEF is at most €10.33', () => {
    expect(calculateLombardyTax(35_000, 10.33)).toBe(0)
    expect(calculateMilanTax(35_000, 10.33)).toBe(0)
  })

  it('calculates Lombardy tax progressively', () => {
    expect(calculateLombardyTax(31_783.5, 100)).toBeCloseTo(454.9762, 8)
  })
})
