import type { SalaryCalculation } from '../domain/salary'
import { formatMoney } from '../lib/formatMoney'

interface CalculationBreakdownProps {
  result: SalaryCalculation
}

interface BreakdownRowProps {
  label: string
  value: number
  prefix?: string
  note?: string
  emphasis?: boolean
}

function BreakdownRow({ label, value, prefix = '', note, emphasis = false }: BreakdownRowProps) {
  return (
    <div className={`breakdown-row${emphasis ? ' breakdown-row--emphasis' : ''}`}>
      <div>
        <span>{label}</span>
        {note ? <small>{note}</small> : null}
      </div>
      <strong>{prefix}{formatMoney(value)}</strong>
    </div>
  )
}

export function CalculationBreakdown({ result }: CalculationBreakdownProps) {
  const hasAdditionalContribution = result.additionalContribution > 0
  const hasIrpefWedgeDeduction = result.taxWedgeDeduction > 0
  const hasAdditionalBenefits = result.taxWedgeExemptSum > 0 || result.integrativeTreatment > 0

  return (
    <section className="breakdown" aria-labelledby="breakdown-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Calcolo trasparente</p>
          <h3 id="breakdown-title">Come arriviamo al netto</h3>
        </div>
        <p>Ogni passaggio usa il risultato del precedente.</p>
      </div>

      <div className="breakdown__pipeline">
        <div className="breakdown-group">
          <BreakdownRow label="RAL" value={result.grossAnnualSalary} emphasis />
          <BreakdownRow label="Contributi previdenziali" value={result.totalContributions} prefix="− " />
          {hasAdditionalContribution ? (
            <p className="breakdown-detail">
              Inclusi {formatMoney(result.additionalContribution)} di contributo aggiuntivo.
            </p>
          ) : null}
          <BreakdownRow label="Imponibile fiscale" value={result.taxableIncome} emphasis />
        </div>

        <div className="breakdown-group">
          <h4>Calcolo dell’IRPEF</h4>
          <BreakdownRow label="IRPEF lorda" value={result.grossIrpef} />
          <BreakdownRow
            label="Detrazione da lavoro dipendente"
            value={result.employeeDeduction}
            prefix="− "
            note="Riduzione dell’imposta"
          />
          {hasIrpefWedgeDeduction ? (
            <BreakdownRow
              label="Riduzione del cuneo fiscale"
              value={result.taxWedgeDeduction}
              prefix="− "
              note="Riduzione dell’imposta"
            />
          ) : null}
          <BreakdownRow label="IRPEF netta" value={result.netIrpef} emphasis />
        </div>

        <div className="breakdown-group">
          <h4>Addizionali</h4>
          <BreakdownRow label="Regionale Lombardia" value={result.regionalTax} />
          <BreakdownRow label="Comunale Milano" value={result.municipalTax} />
        </div>

        {hasAdditionalBenefits ? (
          <div className="breakdown-group breakdown-group--benefits">
            <h4>Benefici aggiuntivi</h4>
            {result.taxWedgeExemptSum > 0 ? (
              <BreakdownRow label="Somma esente per cuneo fiscale" value={result.taxWedgeExemptSum} prefix="+ " />
            ) : null}
            {result.integrativeTreatment > 0 ? (
              <BreakdownRow label="Trattamento integrativo" value={result.integrativeTreatment} prefix="+ " />
            ) : null}
          </div>
        ) : null}

        <div className="breakdown-group breakdown-group--total">
          <BreakdownRow label="Netto annuale stimato" value={result.netAnnualSalary} emphasis />
        </div>
      </div>

      <details className="breakdown__details">
        <summary>Come leggere questa stima</summary>
        <p>
          Le detrazioni riducono l’imposta dovuta; non sono somme versate direttamente nello stipendio. Gli eventuali benefici aggiuntivi sono invece mostrati separatamente.
        </p>
      </details>
    </section>
  )
}
