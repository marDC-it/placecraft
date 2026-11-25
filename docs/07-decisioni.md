# 07 · Decisioni e punti aperti

## Condizioni del professore

La proposta è stata **accettata con condizioni** il 24 novembre 2026 (sintesi dei rilievi in
[01-proposta.md](01-proposta.md)).

| Rilievo / condizione | Come lo recepiamo |
|---|---|
| Perimetro molto ampio | requisiti divisi in nucleo ed estensioni ([02](02-requisiti-e-casi-d-uso.md)) |
| `valida_proposta` esiste solo su Supabase | Supabase da subito, niente json-server |
| Autenticazione piccola, niente ruoli | email e password; `is_promoter` in `profiles`, impostato a mano, letto dalle policy |
| Riuso del prezzario | verificato il 25/11: dato aperto per D.Lgs. 36/2023, All. I.14; fonte citata ([06](06-fonti-dati.md)) |
| API: solo quelle di PostgREST | [05](05-api-rest.md) riscritto; nessuna funzione RPC: costo e sintesi nel front end |
| **Condizione**: nucleo separato dalle estensioni nei requisiti del 15/12 | divisione fatta in [02](02-requisiti-e-casi-d-uso.md) e nella proposta definitiva (25/11); documento dei requisiti da scrivere |

## Decisioni prese

| Data | Decisione | Motivo |
|---|---|---|
| 20/11/2026 | Nome: **Placecraft** (una maiuscola; `placecraft` nei percorsi) | nome libero su GitHub, Play Store, dominio `.it` |
| 20/11/2026 | Demo sull'Aquila, funziona in tutto l'Abruzzo, estendibile ad altre regioni | dati OSM ovunque; prezzario per regione |
| 20/11/2026 | Il budget lo fissa il promotore; il cittadino sceglie che cosa e dove | — |
| 20/11/2026 | Voto all'intera proposta | — |
| 25/11/2026 | Commento sulla proposta nel nucleo; commento ancorato a un elemento come estensione | condizione del professore |
| 25/11/2026 | Annulla/ripeti fra le estensioni | il professore lo cita fra le cose che allargano il perimetro |
| 25/11/2026 | Nessuna funzione RPC; costo e sintesi calcolati nel front end | rilievo sulle API; più lavoro sugli argomenti del corso |
| 25/11/2026 | Nucleo: consultazione, liste, editor, bozze, pubblicazione validata, voto, commento sulla proposta; il resto è estensione | rilievo sul perimetro troppo ampio |
| 25/11/2026 | Proposta definitiva aggiornata e ricaricata | coerenza con i rilievi |
| 25/11/2026 | Registrazione, accesso e logout nel nucleo (email e password); niente recupero password | autenticazione piccola, come chiesto |
| 25/11/2026 | Voto come valutazione da 1 a 5 stelle, a passi di mezza stella; una per proposta, modificabile o ritirabile finché la consultazione è aperta; ordinamento per media, a parità per numero di valutazioni; media calcolata nel front end | niente funzioni nel database |
| 25/11/2026 | Commenti: modificabili ed eliminabili dal proprio autore finché la consultazione è aperta; moderazione del promotore come estensione | perimetro |
| 25/11/2026 | Si eliminano solo le bozze; una proposta pubblicata non si elimina (ritiro come estensione) | perimetro; voti e commenti ricevuti |
| 25/11/2026 | Consultazione chiusa automaticamente alla scadenza | la chiusura anticipata è un'estensione |
| 25/11/2026 | Editor e bozze in un solo caso d'uso; casi d'uso rinumerati: UC1–UC9 nucleo, E1–E12 estensioni | requisiti del 15/12 |
| 25/11/2026 | Una sola bozza per consultazione; sezione «Le tue bozze» nella pagina della consultazione; salvataggio con il pulsante «Salva bozza»; titolo e descrizione obbligatori | il profilo è un'estensione |
| 25/11/2026 | Elementi esistenti: rimuovibili e spostabili a costo zero; il budget copre solo gli elementi nuovi (ipotesi: il promotore riserva a parte una somma per rimozioni e spostamenti) | evita di modellare i costi di rimozione e spostamento |
| 25/11/2026 | Prezzario usato come dato aperto, con la fonte citata; costo mostrato come «stima indicativa, IVA esclusa» | D.Lgs. 36/2023, All. I.14, art. 1 c. 2; verifica in [06](06-fonti-dati.md) |
| 20/11/2026 | Una proposta pubblicata non si modifica: si rielabora | voti e commenti si riferiscono a quel disegno |
| 20/11/2026 | La validità di una proposta la controlla il database (`valida_proposta`) | il client si può falsificare; le policy vedono una riga alla volta |
| 20/11/2026 | Prezzi dal prezzario ufficiale, non indicativi | credibilità del computo |
| 20/11/2026 | Script di estrazione del prezzario in JavaScript | coerenza con le tecnologie del corso |

## Punti aperti

- [ ] Requisiti del 15 dicembre con nucleo ed estensioni
- [x] Licenza del prezzario (25/11, vedi [06](06-fonti-dati.md)); conferma della Regione solo se la chiede il professore
- [x] Annulla/ripeti e Wikidata/Commons fra le estensioni (25/11)
- [x] Una proposta pubblicata non si elimina; ritiro come estensione E3 (25/11)
- [x] Rimozioni e spostamenti di elementi esistenti: costo zero, fuori budget (25/11)
- [ ] Esclusioni da mostrare nel computo (es. allaccio idrico, pavimentazione antitrauma)
- [ ] Voce U.07.10.440: include la messa a dimora?
- [ ] `fetch` a mano o supabase-js in `src/api.js`
- [ ] Un progetto Supabase condiviso per lo sviluppo, o uno per ciascuno
- [ ] Interesse per la CINI: conferma dell'ateneo (manifestazione d'interesse entro il 27/03/2027)
