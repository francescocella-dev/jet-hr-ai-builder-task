import type { TaxBracket } from './rules2026'

export function calculateProgressiveTax(income: number, brackets: readonly TaxBracket[]): number {
  let tax = 0
  let lowerBound = 0

  for (const bracket of brackets) {
    const taxableInBracket = Math.max(0, Math.min(income, bracket.upTo) - lowerBound)
    tax += taxableInBracket * bracket.rate

    if (income <= bracket.upTo) break
    lowerBound = bracket.upTo
  }

  return tax
}
