# RAL al Netto — Calcolatore 2026

Prototipo realizzato per la task AI Builder di Jet HR che stima la retribuzione netta annuale e il netto mensile medio a partire dalla RAL di un lavoratore dipendente standard residente a Milano nel 2026.

Il progetto privilegia la trasparenza delle assunzioni e la comprensibilità del calcolo rispetto alla copertura incompleta di tutte le casistiche payroll. Il percorso seguito è stato: ricerca delle regole, delimitazione del problema, modellazione del dominio, verifica tramite test e costruzione della web utility.

**Demo live:** [jet-hr-ai-builder-task.vercel.app](https://jet-hr-ai-builder-task.vercel.app/)

## Il problema

La task parte da un input intenzionalmente semplice, la Retribuzione Annua Lorda (RAL), e deve restituire:

- netto annuale stimato;
- netto mensile medio;
- principali trattenute che portano dal lordo al netto.

Il payroll reale comprende molte più variabili contrattuali, previdenziali e personali. La V1 sceglie deliberatamente un caso standard, così che ogni passaggio possa essere spiegato e verificato senza simulare una precisione che la sola RAL non consente.

## La soluzione

RAL al Netto è una web utility interamente client-side. L’utente inserisce la RAL, sceglie 12, 13 o 14 mensilità e avvia il calcolo. Il risultato distingue:

- netto annuale e netto mensile medio;
- contributi previdenziali;
- IRPEF lorda e netta;
- detrazione da lavoro e riduzione della pressione fiscale;
- addizionali regionale e comunale;
- eventuali benefici aggiuntivi;
- breakdown completo della pipeline.

Il numero di mensilità **non modifica il netto annuale**. Serve esclusivamente a calcolare la media:

```text
netto mensile medio = netto annuale / mensilità
```

## Scope e assunzioni

La persona fiscale V1 è definita in modo esplicito:

- dipendente privato con qualifica di impiegato;
- contratto a tempo indeterminato e full-time;
- attività per l’intero anno 2026;
- un solo datore di lavoro;
- residenza fiscale a Milano per tutto l’anno;
- nessun altro reddito;
- nessun familiare fiscalmente rilevante;
- nessuna deduzione personale;
- nessun regime fiscale particolare;
- RAL compresa tra €10.000 e €100.000.

Queste non sono casistiche dimenticate: sono decisioni deliberate di scope che rendono il prototipo leggibile e difendibile.

## Come funziona il calcolo

```text
RAL
→ contributi previdenziali
→ imponibile fiscale
→ IRPEF lorda
→ detrazioni / riduzione della pressione fiscale
→ IRPEF netta
→ addizionale Lombardia
→ addizionale Milano
→ eventuali benefici
→ netto annuale
→ netto mensile medio
```

Nel caso standard della V1, in assenza di altri redditi e ulteriori oneri deducibili, il reddito imponibile da lavoro viene utilizzato anche come reddito complessivo rilevante per le formule che dipendono da quest’ultimo. Questa equivalenza è un’assunzione esplicita dello scope e non vale necessariamente in casi reali più complessi.

Ogni fase usa il risultato della precedente. I valori intermedi conservano la precisione numerica; l’arrotondamento a due decimali avviene soltanto in presentazione.

### Contributi previdenziali

Ai fini della V1 assumiamo che l’intera RAL inserita costituisca retribuzione imponibile previdenziale ordinaria e applichiamo la quota IVS standard a carico del lavoratore del **9,19%**.

Sulla parte di RAL che supera **€56.224**, il modello applica inoltre il contributo aggiuntivo dell’**1%**. Il 9,19% è l’assunzione previdenziale standard della V1: settore, CCNL, datore di lavoro e altre caratteristiche possono comportare contribuzioni ulteriori.

### IRPEF 2026

L’IRPEF lorda è calcolata progressivamente:

| Fascia di imponibile | Aliquota |
| --- | ---: |
| Fino a €28.000 | 23% |
| Da €28.000 a €50.000 | 33% |
| Oltre €50.000 | 43% |

Superare una soglia **non** applica la nuova aliquota all’intero reddito: ciascuna aliquota riguarda soltanto la parte di imponibile compresa nel relativo scaglione.

### Detrazione da lavoro dipendente

La detrazione da lavoro dipendente riduce direttamente l’imposta lorda; non è una deduzione dal reddito imponibile. Nel modello è pari a €1.955 fino a €15.000, varia nella fascia €15.001–€28.000, decresce fino ad azzerarsi tra €28.001 e €50.000 ed è nulla oltre €50.000. Tra €25.001 e €35.000 si aggiungono €65, come previsto dalle regole modellate.

La detrazione utilizzata non può rendere negativa l’IRPEF netta.

### Riduzione della pressione fiscale

La V1 distingue due meccanismi:

- fino a €20.000, una somma che non concorre alla formazione del reddito, calcolata con aliquote del **7,1%**, **5,3%** o **4,8%** in base alla fascia;
- oltre €20.000 e fino a €40.000, un’ulteriore detrazione IRPEF: **€1.000** fino a €32.000, poi progressivamente ridotta fino a zero a €40.000.

Nel motore le fasce sono applicate all’imponibile fiscale calcolato. La somma per i redditi più bassi è mostrata come beneficio aggiuntivo e non come imposta negativa.

### Trattamento integrativo

La V1 modella soltanto la casistica determinabile dagli input disponibili. Fino a €15.000 verifica la condizione tra imposta lorda e detrazione da lavoro prevista dal modello.

Nella fascia €15.001–€28.000 la spettanza può dipendere anche da ulteriori detrazioni personali che non possono essere dedotte dalla sola RAL. Nel caso standard tali elementi sono assunti assenti: il prodotto non inventa dati mancanti.

### Addizionali

L’addizionale regionale della Lombardia è applicata progressivamente con aliquote dell’**1,23%**, **1,58%**, **1,72%** e **1,73%**.

Per Milano il modello applica un’aliquota unica dello **0,8%** quando l’imponibile supera €23.000. La soglia è un’esenzione, **non una franchigia**: una volta superata, l’aliquota si applica all’intero imponibile.

Nel modello le addizionali sono poste a zero quando l’IRPEF rilevante, dopo le detrazioni modellate, non supera €10,33.

## Esempio di riferimento

Input: **RAL €35.000**, **13 mensilità**.

| Passaggio | Importo |
| --- | ---: |
| RAL | €35.000,00 |
| Contributi | €3.216,50 |
| Imponibile | €31.783,50 |
| IRPEF lorda | €7.688,56 |
| Detrazione lavoro | €1.646,52 |
| Riduzione cuneo | €1.000,00 |
| IRPEF netta | €5.042,03 |
| Lombardia | €454,98 |
| Milano | €254,27 |
| **Netto annuale** | **€26.032,22** |
| **Netto mensile medio** | **€2.002,48** |

Questo caso è verificato automaticamente dai test e non è hardcoded nel motore.

## Decisioni di prodotto

### Proiezione annuale, non cedolino mensile

La RAL da sola non permette di ricostruire correttamente ciascun cedolino. La distribuzione effettiva può dipendere da tredicesima, quattordicesima, conguagli e trattenute distribuite nell’anno. Per questo il prodotto usa **“Netto mensile medio stimato”**, non “Busta paga mensile”.

### Caso standard invece di falsa precisione

La V1 non richiede decine di input perché il suo obiettivo è offrire un caso standard trasparente e difendibile, non presentarsi come un payroll engine incompleto. Le assunzioni sono visibili sia nell’interfaccia sia in questa documentazione.

### Imposte e contributi restano separati

Previdenza e tassazione sono fenomeni distinti. Possono essere aggregati nelle trattenute complessive, ma nel dominio e nella UI non sono mai presentati come sinonimi.

### Benefici separati dalla distribuzione della RAL

Per alcuni redditi il modello aggiunge benefici al netto. Di conseguenza non è sempre corretto rappresentare `netto finale + tasse + contributi = RAL`.

La barra usa invece l’identità:

```text
quota dopo trattenute + imposte + contributi = RAL
```

Gli eventuali benefici sono mostrati separatamente.

## Perché questo stack

### React

La UI gestisce pochi input e diversi output derivati, con aggiornamenti condizionati dal submit. Non era necessario un framework full-stack.

### TypeScript

Il dominio contiene grandezze diverse, soglie e risultati strutturati. Tipi espliciti aiutano a non confondere contributi, imponibile, imposte, detrazioni e benefici.

### Vite

L’applicazione è interamente client-side: non richiede SSR, funzioni server, API o persistenza. Vite mantiene sviluppo e build essenziali.

### Vitest

Il cuore del progetto è deterministico. Test delle singole regole, dei valori di soglia e della pipeline completa offrono più valore di infrastruttura server non necessaria.

### ESLint

ESLint rende automatico un controllo coerente del codice React e TypeScript e costituisce uno dei gate del progetto.

### CSS

CSS standard offre controllo visuale diretto e responsive senza introdurre un design system o un framework UI non richiesto.

### Cosa ho scelto di non introdurre

Non sono presenti backend, database, Next.js, state manager, API fiscali esterne o librerie UI. Non servono all’outcome della V1 e introdurrebbero complessità operativa senza migliorare la trasparenza del calcolo.

## Architettura

```text
src/
├── components/          # UI e composizione della product experience
├── domain/
│   └── salary/          # regole e funzioni fiscali pure
└── lib/                 # utility di presentazione

tests/
└── salary/              # unit, boundary ed end-to-end test
```

Il principio è semplice: **React presenta, il dominio calcola**.

- `rules2026.ts` centralizza soglie, aliquote e importi;
- `progressiveTax.ts` contiene l’algoritmo progressivo condiviso;
- `calculateSalary.ts` orchestra la pipeline e produce il risultato consumato dalla UI.

I componenti React non conoscono né replicano le formule fiscali.

## Strategia di test

La suite contiene **60 test**:

- unit test delle singole regole;
- boundary test sulle soglie principali;
- validazione degli input e dei valori non finiti;
- fixture end-to-end dell’orchestratore.

I boundary seguono, quando rilevante, il criterio:

```text
soglia - €0,01
soglia
soglia + €0,01
```

Le tre fixture principali coprono:

- **€15.000**: fascia bassa, benefici, trattamento integrativo e Milano esente;
- **€35.000**: caso centrale di riferimento;
- **€70.000**: contributo aggiuntivo, terzo scaglione IRPEF e fascia alta Lombardia.

## Limiti conosciuti

Il prototipo non simula:

- CCNL specifici e contributi minori;
- part-time o anno lavorato parzialmente;
- altri redditi o più rapporti di lavoro;
- familiari fiscalmente rilevanti e detrazioni personali;
- fringe benefit e premi di risultato;
- regimi fiscali speciali;
- TFR;
- singoli cedolini mensili;
- conguagli.

Un’evoluzione del prodotto potrebbe trasformare alcune di queste variabili in nuovi input, mantenendo esplicito l’impatto di ciascuna sul calcolo.

## Fonti istituzionali

Sono state utilizzate esclusivamente fonti istituzionali.

| Ente | Fonte | Cosa supporta |
| --- | --- | --- |
| Normattiva | [D.Lgs. 19 giugno 2026, n. 117 — Testo unico delle disposizioni legislative in materia di imposte sui redditi](https://www.normattiva.it/atto/caricaDettaglioAtto?atto.codiceRedazionale=26G00131&atto.dataPubblicazioneGazzetta=2026-07-03) | Quadro normativo vigente delle imposte sui redditi |
| Normattiva | [Legge 30 dicembre 2025, n. 199](https://www.normattiva.it/eli/stato/LEGGE/2025/12/30/199/CONSOLIDATED) | Modifica del secondo scaglione IRPEF dal 35% al 33% |
| INPS | [Circolare n. 101 del 29 novembre 2024](https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2024.11.circolare-numero-101-del-29-11-2024_14714.html) | IVS 33%: 23,81% datore e 9,19% lavoratore per la generalità dei soggetti FPLD |
| INPS | [Circolare n. 6 del 30 gennaio 2026](https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2026.01.circolare-numero-6-del-30-01-2026_15151.html) | Prima fascia pensionabile €56.224 e contributo aggiuntivo dell’1% |
| Agenzia delle Entrate | [Lavoro dipendente e pensioni](https://infoprecompilata.agenziaentrate.gov.it/portale/semplificata-mod-lavoro-dipendente-e-pensioni) | Somma del 7,1%, 5,3% e 4,8%; detrazione di €1.000 e riduzione fino a €40.000 |
| Agenzia delle Entrate | [Quadro C — Lavoro dipendente](https://infoprecompilata.agenziaentrate.gov.it/portale/quadro-c-lavoro-dipendente) | Trattamento integrativo e condizioni connesse |
| Agenzia delle Entrate | [Quadro RN — Quadro RV](https://infoprecompilata.agenziaentrate.gov.it/portale/quadro-rn-quadro-rv) | Criterio generale delle addizionali e soglia d’imposta di €10,33 |
| Regione Lombardia | [Addizionale regionale all’IRPEF](https://www.regione.lombardia.it/bollo-auto-e-tributi-regionali/red-addizionale-regionale-irpef) | Aliquote progressive 1,23%, 1,58%, 1,72% e 1,73% |
| Comune di Milano | [Addizionale comunale IRPEF](https://www.comune.milano.it/argomenti/tributi/addizionale-comunale-irpef) | Aliquota 0,8%, esenzione fino a €23.000 e applicazione sull’intero imponibile oltre soglia |

Dal 4 luglio 2026 è in vigore il D.Lgs. 117/2026, che riordina la disciplina delle imposte sui redditi. Alcune misure applicate dal prototipo sono state originariamente introdotte da provvedimenti precedenti e risultano oggi coordinate nel nuovo Testo unico.

Le pagine operative dell’Agenzia delle Entrate sopra indicate riguardano le dichiarazioni 2026 relative ai redditi 2025. Sono usate come fonti ufficiali operative per descrivere misure strutturali e meccanismi applicati dal modello; per il quadro normativo vigente nel 2026 il riferimento principale resta il D.Lgs. 117/2026, insieme alla Legge 199/2025 per la modifica del secondo scaglione.

## Avvio locale

Requisito: una versione corrente di Node.js compatibile con le dipendenze dichiarate.

```bash
npm install
npm run dev
```

## Gate tecnici

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Disclaimer

Il progetto produce una stima prototipale e non sostituisce un cedolino elaborato da un professionista o da un software paghe.
