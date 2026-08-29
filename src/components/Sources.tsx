const SOURCES = ['Normattiva', 'Agenzia delle Entrate', 'INPS', 'Regione Lombardia', 'Comune di Milano']

export function Sources() {
  return (
    <section className="sources page-shell" id="metodo-fonti" aria-labelledby="sources-title">
      <div>
        <p className="eyebrow">Trasparenza</p>
        <h2 id="sources-title">Metodo e fonti</h2>
      </div>
      <div>
        <p className="sources__intro">
          Il calcolo è stato modellato a partire da fonti istituzionali e separato dalla UI in un motore TypeScript testabile. Le regole 2026 sono centralizzate e verificate attraverso test sui principali valori di soglia.
        </p>
        <ul className="source-list" aria-label="Fonti istituzionali principali">
          {SOURCES.map((source) => <li key={source}>{source}</li>)}
        </ul>
        <p className="sources__note">Bibliografia completa e link definitivi saranno aggiunti nella documentazione finale.</p>
      </div>
    </section>
  )
}
