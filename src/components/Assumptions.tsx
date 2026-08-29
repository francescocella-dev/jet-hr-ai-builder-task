const ASSUMPTIONS = [
  'Lavoratore dipendente privato',
  'Impiegato a tempo indeterminato',
  'Full-time per tutto il 2026',
  'Residenza fiscale a Milano',
  'Un solo rapporto di lavoro',
  'Nessun altro reddito',
  'Nessun familiare fiscalmente rilevante',
  'Nessuna deduzione o agevolazione personale',
]

const LIMITS = [
  'CCNL specifici', 'Part-time', 'Anno lavorato parzialmente', 'Più rapporti di lavoro',
  'Altri redditi', 'Familiari a carico', 'Fringe benefit', 'Premi di risultato',
  'Regimi fiscali speciali', 'Detrazioni personali', 'TFR', 'Singolo cedolino', 'Conguagli',
]

export function Assumptions() {
  return (
    <section className="context-section page-shell" aria-labelledby="assumptions-title">
      <div className="context-card context-card--dark">
        <p className="eyebrow">Perimetro della stima</p>
        <h2 id="assumptions-title">Cosa stiamo assumendo</h2>
        <p>
          La fiscalità del lavoro dipende da molte variabili. Per questo prototipo abbiamo scelto intenzionalmente un caso standard, così da mantenere il calcolo comprensibile e verificabile.
        </p>
        <ul className="assumption-list">
          {ASSUMPTIONS.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>

      <div className="context-card">
        <p className="eyebrow">Limiti del prototipo</p>
        <h2>Cosa non simula</h2>
        <p>La stima non sostituisce un cedolino e non copre casistiche contrattuali o personali specifiche.</p>
        <ul className="tag-list">
          {LIMITS.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    </section>
  )
}
