# 02 · Requisiti e casi d'uso

## I tre requisiti del corso

| Requisito del professore | Come lo soddisfa Placecraft | Casi d'uso |
|---|---|---|
| Una collezione listata, filtrata e ordinata | consultazioni (per comune e stato); proposte pubblicate (per costo; ordinate per voti, costo, data). Filtri nell'URL. Estensione: filtri per elementi e autore, proposte sulla mappa | UC1, UC3 |
| Creare, modificare, eliminare, con persistenza | consultazioni, bozze, proposte, voti, commenti (estensioni: inventario, rielaborazioni) | UC5, UC6, UC7, UC9, UC10, UC12 |
| Dati dall'esterno | Nominatim e Overpass (UC12), prezzario regionale (UC5, UC7); estensione: Wikidata e Commons (UC2) | UC5, UC7, UC12 |
| Regola che non può stare né nel client né nelle policy | `valida_proposta`: costo ricalcolato dal prezzario e perimetro controllato con PostGIS | UC7 |

## Nucleo ed estensioni

| Parte | Casi d'uso |
|---|---|
| **Nucleo** | UC12 (consultazione creata dal promotore, con Nominatim e Overpass), UC1 e UC3 (liste filtrate e ordinate), UC2 senza Wikidata/Commons, UC4 (login piccolo), UC5 (editor: aggiungi, sposta, rimuovi, costo), UC6 (bozze), UC7 (pubblicazione con validazione), UC9 (voto), UC10 (commento sulla proposta) |
| **Estensioni**, dopo il nucleo | annulla/ripeti nell'editor, UC8 (rielaborazione con differenze), commento ancorato a un elemento, UC15 (sintesi, calcolata nel front end), UC13 (correzione dell'inventario), UC2 con descrizione e foto da Wikidata/Commons, proposte sulla mappa, UC11 (profilo), UC14 (gestione della consultazione), più regioni |

La divisione segue la condizione del professore. Annulla/ripeti è fra le estensioni perché il
professore lo cita fra le cose che allargano il perimetro. Una sola voce che lui non nomina sta nel
nucleo: **UC1 e UC3**, perché la collezione filtrata e ordinata è un requisito del corso; la teniamo
con pochi filtri.

Non scriviamo funzioni RPC: costo e sintesi si calcolano nel front end ([05](05-api-rest.md)).

## Attori

- **Visitatore**: non autenticato.
- **Cittadino**: autenticato.
- **Promotore**: un utente con `is_promoter = true` nella tabella dei profili (impostato a mano, nessuna interfaccia per i ruoli). Nel diagramma UML, specializzazione di Cittadino.
- **Sistemi esterni**: OpenStreetMap (Overpass, Nominatim); come estensione Wikidata/Commons.

## Casi d'uso

### Visitatore

| ID | Nome | Descrizione | Varianti |
|---|---|---|---|
| UC1 | Esplorare le consultazioni | Elenco filtrabile per comune e stato; filtri nell'URL | nessun risultato; errore di caricamento |
| UC2 | Vedere una consultazione | Perimetro, elementi esistenti, budget, scadenza, proposte pubblicate. Estensione: descrizione e foto (Wikidata/Commons, con autore e licenza) | nessuna foto → segnaposto (estensione) |
| UC3 | Confrontare le proposte | Lista filtrabile per costo e ordinabile per voti, costo, data; dettaglio con disegno e computo metrico. Estensione: filtri per elementi e autore, vista su mappa | nessuna proposta |
| UC4 | Accedere | Supabase Auth con email e password, nient'altro; votare, commentare e proporre richiedono il login | credenziali errate |

### Cittadino

| ID | Nome | Descrizione | Varianti |
|---|---|---|---|
| UC5 | Creare una proposta | Editor che parte dallo stato attuale: aggiungere dal catalogo, spostare, rimuovere; costo e avvisi a ogni mossa. Estensione: annulla/ripeti | elemento fuori perimetro o in un'area esclusa → avviso; budget superato → costo in rosso, la bozza si salva comunque |
| UC6 | Gestire le bozze | Salvare, riprendere, modificare, eliminare; visibili solo all'autore | — |
| UC7 | Pubblicare una proposta | Il database esegue `valida_proposta`; se passa, la proposta diventa pubblica e immutabile | rifiutata (fuori budget, fuori spazio) con il motivo; consultazione scaduta |
| UC8 | Rielaborare una proposta (estensione) | Nuova bozza copiata da una pubblicata, collegata all'originale; differenza elemento per elemento | — |
| UC9 | Votare una proposta | Un voto per proposta; revocabile finché la consultazione è aperta (da decidere) | propria proposta, doppio voto, consultazione chiusa → rifiutato |
| UC10 | Commentare una proposta | Nucleo: un commento di testo sulla proposta. Estensione: il commento ancorato a un elemento, che mostra il numero di commenti | modificare / eliminare i propri commenti |
| UC11 | Consultare il profilo (estensione) | Proprie proposte (bozze e pubblicate), voti ricevuti, commenti | — |

### Promotore

| ID | Nome | Descrizione | Varianti |
|---|---|---|---|
| UC12 | Aprire una consultazione | Ricerca con Nominatim (scelta da una lista: lo stesso nome può indicare spazi in comuni diversi), budget, scadenza; regione e anno del prezzario fissati ora; perimetro ed elementi da Overpass copiati nel database | spazio senza perimetro in OSM; Overpass non risponde → errore con «riprova» |
| UC13 | Correggere l'inventario (estensione) | Aggiungere, spostare, togliere elementi esistenti quando OSM è incompleto | bloccato dopo la prima proposta pubblicata |
| UC14 | Gestire la consultazione (estensione) | Modificare descrizione e scadenza, chiudere in anticipo, eliminare | eliminabile solo senza proposte (da decidere) |
| UC15 | Vedere la sintesi (estensione) | Elementi più richiesti e dove, costo medio, proposte più votate, rimozioni più chieste | — |

Non c'è un caso d'uso per le API: sono quelle generate da PostgREST ([05](05-api-rest.md)).

## Casi d'uso da scrivere per esteso

Scenario principale e alternative per: **UC5, UC7, UC9, UC12** (tutti del nucleo). Gli altri bastano in tabella.

> Da scrivere.
