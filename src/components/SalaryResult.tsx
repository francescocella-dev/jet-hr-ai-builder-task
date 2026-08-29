import { forwardRef } from 'react'
import type { SalaryCalculation } from '../domain/salary'
import { formatMoney } from '../lib/formatMoney'
import { CalculationBreakdown } from './CalculationBreakdown'
import { SalaryDistribution } from './SalaryDistribution'

interface SalaryResultProps {
  result: SalaryCalculation
}

const percentageFormatter = new Intl.NumberFormat('it-IT', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export const SalaryResult = forwardRef<HTMLDivElement, SalaryResultProps>(function SalaryResult(
  { result },
  ref,
) {
  const netPercentage = (result.netAnnualSalary / result.grossAnnualSalary) * 100
  const benefitsTotal = result.taxWedgeExemptSum + result.integrativeTreatment

  return (
    <section
      className="results page-shell"
      aria-labelledby="result-title"
      aria-live="polite"
    >
      <div className="result-hero" aria-labelledby="result-title" ref={ref} tabIndex={-1}>
        <div>
          <p className="eyebrow">Il tuo netto stimato</p>
          <h2 id="result-title" className="result-hero__value">
            {formatMoney(result.netAnnualSalary, 'rounded')}
          </h2>
          <p className="result-hero__label">netti all’anno</p>
        </div>
        <div className="result-hero__monthly">
          <strong>{formatMoney(result.averageMonthlyNetSalary)}</strong>
          <span>netti al mese × {result.installments}</span>
          <small>Netto mensile medio stimato</small>
        </div>
        <p className="result-hero__percentage">
          Il netto finale equivale al <strong>{percentageFormatter.format(netPercentage)}%</strong> della RAL.
        </p>
      </div>

      <SalaryDistribution result={result} />

      <div className="macro-grid" aria-label="Riepilogo del calcolo">
        <article className="macro-card macro-card--featured">
          <span>Netto annuale</span>
          <strong>{formatMoney(result.netAnnualSalary, 'rounded')}</strong>
        </article>
        <article className="macro-card">
          <span>Imposte</span>
          <strong>{formatMoney(result.totalTaxes, 'rounded')}</strong>
        </article>
        <article className="macro-card">
          <span>Contributi</span>
          <strong>{formatMoney(result.totalContributions, 'rounded')}</strong>
        </article>
        {benefitsTotal > 0 ? (
          <article className="macro-card macro-card--benefit">
            <span>Benefici applicati</span>
            <strong>+ {formatMoney(benefitsTotal, 'rounded')}</strong>
          </article>
        ) : null}
      </div>

      <CalculationBreakdown result={result} />
    </section>
  )
})
