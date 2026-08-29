import { calculateSalary } from './domain/salary'
import { formatMoney } from './lib/formatMoney'

const example = calculateSalary({ grossAnnualSalary: 35_000, installments: 13 })

export default function App() {
  return (
    <main>
      <h1>Stima netto RAL 2026</h1>
      <p>Prototipo del motore di calcolo per un lavoratore dipendente residente a Milano.</p>
      <p>
        Esempio: da una RAL di {formatMoney(example.grossAnnualSalary)}, il netto medio su{' '}
        {example.installments} mensilità è {formatMoney(example.averageMonthlyNetSalary)}.
      </p>
    </main>
  )
}
