import { useEffect, useRef, useState, type FormEvent } from 'react'
import { calculateSalary } from '../domain/salary'
import type { Installments, SalaryCalculation } from '../domain/salary'
import { SalaryResult } from './SalaryResult'

const QUICK_SALARIES = [25_000, 35_000, 50_000, 70_000]
const INSTALLMENT_OPTIONS: Installments[] = [12, 13, 14]

export function SalaryCalculator() {
  const [salary, setSalary] = useState('35000')
  const [installments, setInstallments] = useState<Installments>(13)
  const [result, setResult] = useState<SalaryCalculation | null>(null)
  const [error, setError] = useState('')
  const resultHeroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!result) return

    const resultHero = resultHeroRef.current
    if (!resultHero) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    resultHero.focus({ preventScroll: true })
    resultHero.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }, [result])

  function resetResult() {
    setResult(null)
    setError('')
  }

  function updateSalary(value: string) {
    setSalary(value)
    resetResult()
  }

  function updateInstallments(value: Installments) {
    setInstallments(value)
    resetResult()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const grossAnnualSalary = Number(salary)

    if (salary.trim() === '' || !Number.isFinite(grossAnnualSalary)) {
      setError('Inserisci una RAL valida.')
      setResult(null)
      return
    }

    try {
      setResult(calculateSalary({ grossAnnualSalary, installments }))
      setError('')
    } catch {
      setError('Inserisci una RAL compresa tra €10.000 e €100.000.')
      setResult(null)
    }
  }

  return (
    <>
      <section className="calculator-section" aria-labelledby="calculator-title">
        <form className="calculator" onSubmit={handleSubmit} noValidate>
          <div className="calculator__heading">
            <div>
              <p className="eyebrow">Calcolatore</p>
              <h2 id="calculator-title">Parti dalla tua RAL</h2>
            </div>
            <p className="calculator__note">Bastano due dati. Il calcolo resta tutto qui.</p>
          </div>

          <div className="calculator__grid">
            <div className="field-group">
              <label htmlFor="gross-salary">Retribuzione Annua Lorda</label>
              <div className={`money-input${error ? ' money-input--error' : ''}`}>
                <span aria-hidden="true">€</span>
                <input
                  id="gross-salary"
                  name="grossAnnualSalary"
                  type="number"
                  inputMode="decimal"
                  min="10000"
                  max="100000"
                  step="100"
                  value={salary}
                  onChange={(event) => updateSalary(event.target.value)}
                  aria-describedby={`salary-help${error ? ' salary-error' : ''}`}
                  aria-invalid={Boolean(error)}
                />
              </div>
              <p className="field-help" id="salary-help">
                Inserisci una RAL compresa tra €10.000 e €100.000.
              </p>
              <p className="field-error" id="salary-error" aria-live="polite">
                {error}
              </p>
              <div className="quick-values" aria-label="Valori RAL rapidi">
                {QUICK_SALARIES.map((value) => (
                  <button key={value} type="button" onClick={() => updateSalary(String(value))}>
                    {value / 1_000}k
                  </button>
                ))}
              </div>
            </div>

            <fieldset className="field-group installments">
              <legend>Mensilità</legend>
              <div className="segmented-control">
                {INSTALLMENT_OPTIONS.map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="installments"
                      value={value}
                      checked={installments === value}
                      onChange={() => updateInstallments(value)}
                    />
                    <span>{value}</span>
                  </label>
                ))}
              </div>
              <p className="field-help">Influisce solo sulla media mensile, non sul netto annuale.</p>
            </fieldset>
          </div>

          <button className="primary-button" type="submit">
            Calcola il netto <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>

      {result ? <SalaryResult ref={resultHeroRef} result={result} /> : null}
    </>
  )
}
