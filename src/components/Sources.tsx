const SOURCES = [
  {
    label: 'Normattiva',
    href: 'https://www.normattiva.it/atto/caricaDettaglioAtto?atto.codiceRedazionale=26G00131&atto.dataPubblicazioneGazzetta=2026-07-03',
  },
  {
    label: 'Agenzia delle Entrate',
    href: 'https://infoprecompilata.agenziaentrate.gov.it/portale/semplificata-mod-lavoro-dipendente-e-pensioni',
  },
  {
    label: 'INPS',
    href: 'https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2026.01.circolare-numero-6-del-30-01-2026_15151.html',
  },
  {
    label: 'Regione Lombardia',
    href: 'https://www.regione.lombardia.it/bollo-auto-e-tributi-regionali/red-addizionale-regionale-irpef',
  },
  {
    label: 'Comune di Milano',
    href: 'https://www.comune.milano.it/argomenti/tributi/addizionale-comunale-irpef',
  },
]

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
          {SOURCES.map((source) => (
            <li key={source.label}>
              <a href={source.href} target="_blank" rel="noreferrer noopener">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="sources__note">La bibliografia completa è disponibile nella documentazione del progetto.</p>
      </div>
    </section>
  )
}
