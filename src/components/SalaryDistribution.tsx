import type { SalaryCalculation } from '../domain/salary'
import { formatMoney } from '../lib/formatMoney'

interface SalaryDistributionProps {
  result: SalaryCalculation
}

const percentageFormatter = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 1 })

export function SalaryDistribution({ result }: SalaryDistributionProps) {
  const amountAfterWithholdings =
    result.grossAnnualSalary - result.totalTaxes - result.totalContributions
  const benefitsTotal = result.taxWedgeExemptSum + result.integrativeTreatment
  const segments = [
    { label: 'Quota dopo trattenute', value: amountAfterWithholdings, className: 'distribution__net' },
    { label: 'Imposte', value: result.totalTaxes, className: 'distribution__taxes' },
    { label: 'Contributi', value: result.totalContributions, className: 'distribution__contributions' },
  ]

  return (
    <section className="distribution" aria-labelledby="distribution-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Prima dei benefici</p>
          <h3 id="distribution-title">Come si distribuisce la RAL</h3>
        </div>
        <p>Quota disponibile e trattenute, ricondotte esattamente alla RAL.</p>
      </div>

      <div className="distribution__bar" aria-hidden="true">
        {segments.map((segment) => (
          <span
            key={segment.label}
            className={segment.className}
            style={{ width: `${(segment.value / result.grossAnnualSalary) * 100}%` }}
          />
        ))}
      </div>

      <ul className="distribution__legend">
        {segments.map((segment) => (
          <li key={segment.label}>
            <span className={`legend-marker ${segment.className}`} aria-hidden="true" />
            <span>{segment.label}</span>
            <strong>{formatMoney(segment.value)}</strong>
            <small>{percentageFormatter.format((segment.value / result.grossAnnualSalary) * 100)}%</small>
          </li>
        ))}
      </ul>

      {benefitsTotal > 0 ? (
        <aside className="benefit-callout">
          <div>
            <span>Benefici applicati</span>
            <strong>+ {formatMoney(benefitsTotal)}</strong>
          </div>
          <p>
            Somme aggiuntive che aumentano il netto finale e non fanno parte della distribuzione della RAL mostrata sopra.
          </p>
        </aside>
      ) : null}
    </section>
  )
}
