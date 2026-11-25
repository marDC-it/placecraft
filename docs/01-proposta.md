# 01 · La proposta

Prima versione consegnata il 20 novembre 2026; versione definitiva, aggiornata ai rilievi del
professore, del 25 novembre 2026 (testo in fondo).

**Esito (24 novembre 2026): accettata con condizioni.** Come le recepiamo è in
[07-decisioni.md](07-decisioni.md).

## Rilievi e condizione, in sintesi

- Il perimetro è molto ampio.
- `valida_proposta` (PL/pgSQL e PostGIS) è codice di back end: ammessa perché motivata, ma esiste solo su
  Supabase → si lavora su Supabase da subito, senza json-server.
- Autenticazione piccola: niente sistema di ruoli; il promotore è un campo della tabella degli utenti
  (es. `is_promoter`) letto dalle policy.
- Prezzario regionale: verificare e citare le condizioni di riuso dei dati.
- API: sono quelle generate automaticamente da Supabase (PostgREST), non API progettate da noi; non
  promettere di più.
- **Condizione**: nei requisiti del 15 dicembre separare il **nucleo** (una consultazione creata dal
  promotore; editor con aggiungi, sposta, rimuovi e costo; pubblicazione con validazione; voto;
  commento) dalle **estensioni** (rielaborazione con differenze, commenti su un elemento, sintesi per
  il promotore, più regioni).

## Che cosa è cambiato rispetto alla prima versione

- **Perimetro**: la proposta separa il nucleo dalle estensioni. Nel nucleo: consultazione creata dal
  promotore, liste filtrate e ordinate, editor (aggiungi, sposta, rimuovi, costo), bozze, pubblicazione con
  validazione, voto, commento sulla proposta. Annulla/ripeti, rielaborazione, commento su un elemento, sintesi,
  correzione dell'inventario, Wikidata/Commons, profilo e altre regioni sono estensioni.
- **Commenti**: nel nucleo un commento di testo sulla proposta, non più «su un punto della mappa».
- **Dati**: Supabase fin dallo sviluppo, niente json-server.
- **Autenticazione**: il promotore è un utente con `is_promoter`, senza sistema di ruoli.
- **API**: tolta la frase sulle «API REST riutilizzabili da altri team»; nessuna funzione RPC.
- **Prezzario**: indicata la base del riuso (D.Lgs. 36/2023, All. I.14) e il costo come stima, IVA esclusa.
- **Wikidata/Commons**: tolti dai dati esterni del nucleo (restano Nominatim, Overpass e prezzario).

## Il testo definitivo


**Il soggetto:** Placecraft è un editor nel browser con cui i cittadini ridisegnano uno spazio pubblico reale, un parco o una piazza, entro un budget. Un promotore (Comune, associazione, comitato di quartiere) apre una **consultazione** su uno spazio: il perimetro e gli elementi già presenti arrivano da OpenStreetMap. Ogni cittadino aggiunge, sposta e rimuove sulla mappa alberi, panchine, fontanelle, lampioni, giochi; il costo si aggiorna a ogni mossa con i **prezzi ufficiali del prezzario regionale** e la proposta riporta il computo metrico voce per voce. Gli altri cittadini votano le proposte e le commentano. Oggi le consultazioni raccolgono testo («più verde», «più panchine»); Placecraft dà al cittadino lo strumento per dire *che cosa* e *dove*, vedendo quanto costa ogni scelta dentro il budget fissato dal promotore.

**I 3 elementi principali**

1.  **Una collezione di cose:** le consultazioni (filtrate per comune e stato aperta/chiusa) e, dentro ciascuna, le proposte pubblicate: filtrate per costo, ordinate per voti, costo o data. Costo, avvisi e computo metrico sono stato derivato; i filtri stanno nell’URL.

2.  **Creare, modificare, eliminare:** il promotore crea la consultazione; i cittadini creano bozze nell’editor (useReducer), le modificano, le eliminano e le pubblicano; votano e commentano. Login con Supabase Auth; il promotore è un utente con **is_promoter** nel profilo, senza sistema di ruoli. Supabase fin dallo sviluppo, tutto attraverso **src/api.js**.

3.  **Dati dall’esterno (già verificati con dati reali): Nominatim** trova lo spazio per nome, **Overpass** (OpenStreetMap) dà il perimetro, comprese le aree escluse, e gli elementi già presenti, provati sui parchi dell’Aquila. Le API si chiamano alla creazione della consultazione e il risultato è copiato nel database, con stati di caricamento ed errore. I costi vengono dal **Prezzario Regione Abruzzo 2026** (DGR n. 434 del 22/07/2026, BURAT n. 31 del 05/08/2026), dato aperto ai sensi del D.Lgs. 36/2023 (All. I.14, art. 1, c. 2): da arredo urbano, verde e illuminazione pubblica abbiamo estratto le **490 voci** che compongono il catalogo degli elementi. Il costo mostrato è una stima indicativa, IVA esclusa.

**Interazione e aspetti social:** voto all’intera proposta (uno per utente, non sulla propria) e commenti sulla proposta. React Router, Context per l’utente corrente, useReducer per l’editor.

**Nucleo:** consultazione creata dal promotore (Nominatim e Overpass); lista filtrata e ordinata di consultazioni e proposte; editor con aggiungi, sposta, rimuovi e costo; bozze; pubblicazione con validazione; voto; commento sulla proposta. **Estensioni, dopo il nucleo:** annulla/ripeti nell’editor; rielaborazione di una proposta altrui con la differenza elemento per elemento; commento ancorato a un elemento; sintesi per il promotore (elementi più richiesti e dove, costo medio), calcolata nel front end; correzione dell’inventario; descrizione e foto da Wikidata e Wikimedia Commons; proposte sulla mappa; profilo; altre regioni.

**Entità e relazioni**

|                                     |                                                                                                          |                                                                        |
|-------------------------------------|----------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| **Entità**                          | **Che cos’è**                                                                                            | **Relazioni**                                                          |
| Utente                              | Account autenticato; is_promoter indica il promotore                                                     | Promuove consultazioni; scrive proposte, voti, commenti                |
| Consultazione                       | Uno spazio reale: perimetro OSM, budget, scadenza, regione e anno del prezzario (fissati alla creazione) | Ha un promotore, un inventario e molte proposte                        |
| Tipo di elemento                    | Il catalogo: albero, panchina, fontanella, lampione…                                                     | Composto da voci del prezzario; usato da elementi esistenti e proposti |
| Voce del prezzario                  | Codice, descrizione, unità, prezzo, regione, anno                                                        | Entra in molti tipi tramite la Composizione (con quantità)             |
| Composizione                        | Quante unità di una voce servono per un tipo (es. cestino = cestino + palo)                              | Collega tipo di elemento e voce del prezzario (molti a molti)          |
| Elemento esistente / della proposta | Un elemento con posizione: già presente (da OSM) o aggiunto, spostato, rimosso                           | Appartiene a una consultazione o a una proposta; ha un tipo            |
| Proposta                            | Bozza o pubblicata                                                                                       | Di un utente e una consultazione; ha elementi, voti, commenti          |
| Voto / Commento                     | Un voto all’intera proposta; un testo sulla proposta                                                     | Collegano un utente a una proposta                                     |

*<u>Le regole che il sistema fa rispettare:</u>* solo un promotore apre una consultazione; si vota una volta per proposta, non la propria, solo a consultazione aperta (vincolo unico e regole di accesso); le bozze le vede e le modifica solo l’autore; una proposta pubblicata non si modifica. **Che cosa non può stare né nel client né nelle regole:** la validità di una proposta pubblicata. Il costo calcolato dal browser si può falsificare e le regole di accesso vedono una riga alla volta: serve una funzione del database, **valida_proposta**, che ricalcola il costo dalle composizioni e dal prezzario e controlla con PostGIS che ogni elemento stia dentro il perimetro, aree escluse comprese, prima di accettare la pubblicazione.

**Applicazioni esistenti**

|                     |                                                                                                                                      |                                                                                                 |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| **Applicazione**    | **Che cosa fa**                                                                                                                      | **Che cosa non fa**                                                                             |
| Furban              | Progettazione partecipata in 3D, usata dai comuni nei Paesi Bassi: il comune allestisce lo spazio, fissa budget e oggetti sceglibili | Prodotto commerciale: ogni spazio va ricostruito a mano dal comune; non risulta usato in Italia |
| Streetmix           | Disegno della sezione di una strada, corsia per corsia                                                                               | Solo strade in sezione; niente mappa, budget, voti o consultazioni                              |
| ParteciPa / Decidim | Consultazioni pubbliche in Italia (Governo, Comune di Milano, Emilia-Romagna, Puglia)                                                | Proposte di testo, al più con un punto sulla mappa; nessun disegno dello spazio                 |

**Che cosa fa di diverso la nostra:** in Italia non esiste uno strumento in cui il cittadino disegna la proposta sullo spazio reale e ne vede subito il costo ufficiale; rispetto a Furban, lo spazio si costruisce da solo dai dati aperti e i costi sono quelli del prezzario regionale, voce per voce. Placecraft trasforma un parere in un progetto confrontabile e sostenibile, e dà al cittadino un potere decisionale concreto sugli spazi che vive. **Dove funziona:** il progetto è sviluppato e dimostrato sugli spazi pubblici dell’Aquila. Funziona in tutto l’Abruzzo; per un’altra regione basta importarne il prezzario e associarne le voci al catalogo. Per questo pensiamo possa essere adatto alla **CINI Smart City University Challenge**.
