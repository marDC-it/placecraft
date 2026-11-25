# 08 · Come abbiamo usato l'AI (dossier)

Il corso chiede un dossier tenuto mentre si lavora, non ricostruito alla fine. Non è un elenco dei
prompt: registra i punti di decisione, cioè dove l'assistente ha proposto qualcosa e noi l'abbiamo
rifiutato, dove ha sbagliato e come ce ne siamo accorti, dove non potevamo verificare il suo lavoro e
che cosa abbiamo fatto.

Strumento usato finora: Claude.

## A che cosa è servito

| Data | Per che cosa |
|---|---|
| nov 2026 | analisi delle idee di progetto e dei concorrenti; stesura della proposta e della versione definitiva |
| nov 2026 | script `scripts/estrai-prezzario.mjs` (generato) e i JSON in `data/` |
| nov 2026 | prima stesura di questa documentazione e del repository |
| 25/11/2026 | ricerca sulle condizioni di riuso del prezzario |

## Dove l'assistente ha sbagliato, e come ce ne siamo accorti

| Data | Che cosa | Come ce ne siamo accorti | Che cosa abbiamo fatto |
|---|---|---|---|
| 25/11/2026 | Ha consigliato di mettere annulla/ripeti nel nucleo, sostenendo che il professore non lo nominasse | rileggendo il giudizio: il rilievo sul perimetro cita proprio «annulla/ripeti» | spostato fra le estensioni, nella proposta e in [02](02-requisiti-e-casi-d-uso.md) |
| 25/11/2026 | Sul riuso del prezzario aveva concluso «nessuna licenza, quindi dati aperti (CAD, art. 52)» | abbiamo letto noi le note legali del sito della Regione: dicono «diritti riservati» | ricerca ripresa: la base è il D.Lgs. 36/2023, All. I.14 ([06](06-fonti-dati.md)) |
| nov 2026 | Nella prima versione del repository aveva messo le matricole, che non vanno in un repository pubblico | controllo nostro prima di pubblicare | tolte |
| nov 2026 | Nella prima versione del `.gitignore` aveva escluso tutti i PDF, che avrebbe nascosto anche quelli della documentazione | rilettura del repository | esclusa solo la cartella dei PDF del prezzario |
| nov 2026 | Nella prima versione di questo file aveva scritto come fatte da noi verifiche che non avevamo ancora fatto | rilettura del file | riscritto: le verifiche si scrivono solo dopo averle fatte |

## Dove abbiamo rifiutato o cambiato una sua proposta

| Data | Proposta | Decisione nostra e motivo |
|---|---|---|
| nov 2026 | Nella proposta, una frase su «dove, quanto e a quale costo» decide il cittadino | il budget lo fissa il promotore: il cittadino decide *che cosa* e *dove* |
| nov 2026 | Dati precisi sui parchi dell'Aquila (quanti mappati, con nome, quali) | basta dire che i dati ci sono e sono verificati, senza numeri |
| 25/11/2026 | Funzioni RPC nel database (calcolo del costo, sintesi, GeoJSON) | niente RPC: costo e sintesi nel front end, come chiesto dal professore sulle API |

## Dove non potevamo verificare, e che cosa abbiamo fatto

| Data | Che cosa | Che cosa abbiamo fatto |
|---|---|---|
| nov 2026 | Lo script di estrazione del prezzario | l'assistente ha controllato che le voci estratte (490) siano quante le righe di prezzo del PDF. _Da fare da noi: confrontare a campione codici e prezzi con il PDF._ |
| 25/11/2026 | L'interpretazione di «formato open data» nell'All. I.14: è una questione giuridica | citiamo la norma da Normattiva; se il professore vuole una conferma ufficiale scriviamo alla Regione |
| 25/11/2026 | Le note legali del sito del BURA: l'assistente non riusciva ad aprire la pagina | non bloccano la conclusione, che si basa sulla legge |

## Regole che ci diamo

- Il codice generato si legge e si capisce prima di entrare nel repository: alla discussione va
  spiegato riga per riga.
- Ogni dato (prezzi, codici, fonti, norme) si verifica sulla fonte originale.
- Credenziali, chiavi e dati personali non si incollano mai nell'assistente.
- Restano nostri: il disegno dello stato dell'applicazione, dove vive lo stato, il modello dei
  guasti, i criteri di accettazione.
