import { Assumptions } from './components/Assumptions'
import { Header } from './components/Header'
import { SalaryCalculator } from './components/SalaryCalculator'
import { Sources } from './components/Sources'
import './styles.css'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <div className="hero-calculator-layout page-shell">
          <section className="hero" aria-labelledby="hero-title">
            <p className="eyebrow">Calcolatore RAL 2026</p>
            <h1 id="hero-title">Da RAL a netto, senza formule nascoste.</h1>
            <p className="hero__intro">
              Inserisci la tua RAL e ottieni una stima del netto 2026 per un dipendente standard
              residente a Milano, con le principali trattenute spiegate passo dopo passo.
            </p>
          </section>

          <SalaryCalculator />
        </div>
        <Assumptions />
        <Sources />
      </main>

      <footer className="footer">
        <div className="page-shell footer__inner">
          <p>Prototipo realizzato per la task AI Builder di Jet HR.</p>
          <p>Stima indicativa, non sostituisce un’elaborazione paghe.</p>
        </div>
      </footer>
    </>
  )
}
