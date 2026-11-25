# 02 · Requisiti e casi d'uso

> Bozza per la consegna del 15 dicembre (requisiti funzionali, non funzionali, mockup). I requisiti
> funzionali sono espressi come **casi d'uso**. Adottiamo uno **sviluppo incrementale**: il primo
> incremento è il nucleo, le estensioni vengono dopo.

## I tre requisiti del corso

| Requisito del professore | Come lo soddisfa Placecraft | Casi d'uso |
|---|---|---|
| Una collezione listata, filtrata e ordinata | consultazioni (per comune e stato); proposte pubblicate (per costo; ordinate per voti, costo, data). Filtri nell'URL | UC2, UC3 |
| Creare, modificare, eliminare, con persistenza | consultazioni; bozze (create, modificate, eliminate); voti (dati e ritirati); commenti (scritti, modificati, eliminati) | UC5, UC7, UC8, UC9 |
| Dati dall'esterno | Nominatim e Overpass (UC9), prezzario regionale (UC5, UC6) | UC5, UC6, UC9 |
| Regola che non può stare né nel client né nelle policy | `valida_proposta`: costo ricalcolato dal prezzario e perimetro controllato con PostGIS | UC6 |

## Attori

- **Visitatore**: non autenticato. Può vedere consultazioni e proposte pubblicate.
- **Cittadino**: autenticato.
- **Promotore**: un cittadino con `is_promoter = true` nel profilo (impostato a mano, nessuna
  interfaccia per i ruoli). Nel diagramma UML, specializzazione di Cittadino: può fare tutto ciò che fa
  un cittadino.
- **Sistemi esterni**: OpenStreetMap (Nominatim, Overpass).

## Nucleo: casi d'uso

| ID | Caso d'uso | Attore | In breve |
|---|---|---|---|
| UC1 | Registrarsi, accedere, uscire | Visitatore / Cittadino | email e password con Supabase Auth; niente recupero password |
| UC2 | Esplorare le consultazioni | Visitatore | elenco filtrabile per comune e stato (aperta/chiusa); filtri nell'URL |
| UC3 | Vedere una consultazione e le sue proposte | Visitatore | perimetro, elementi esistenti, budget, scadenza; proposte pubblicate filtrabili per costo e ordinabili per voti, costo, data |
| UC4 | Vedere una proposta | Visitatore | disegno sulla mappa, computo metrico voce per voce, numero di voti, commenti |
| UC5 | Creare o modificare una proposta | Cittadino | editor che parte dallo stato attuale: aggiungere dal catalogo, spostare, rimuovere; costo e avvisi a ogni mossa; la proposta resta una bozza, visibile solo all'autore, che può salvarla, riprenderla ed eliminarla |
| UC6 | Pubblicare una proposta | Cittadino | il database esegue `valida_proposta`; se passa, la proposta diventa pubblica: non si modifica e non si elimina più |
| UC7 | Votare una proposta | Cittadino | un voto per ogni proposta, non sulla propria; si può ritirare finché la consultazione è aperta |
| UC8 | Commentare una proposta | Cittadino | scrivere un commento sulla proposta; modificare ed eliminare i propri finché la consultazione è aperta |
| UC9 | Aprire una consultazione | Promotore | ricerca con Nominatim, scelta da una lista; perimetro ed elementi da Overpass, copiati nel database; budget e scadenza; regione e anno del prezzario fissati ora |

Una consultazione è **aperta** fino alla scadenza fissata dal promotore; dopo, il database rifiuta
nuove pubblicazioni, voti e commenti (e la modifica o eliminazione dei commenti).

## Estensioni

| ID | Estensione |
|---|---|
| E1 | Annulla/ripeti nell'editor |
| E2 | Moderazione: il promotore elimina i commenti inopportuni sulle proposte della propria consultazione |
| E3 | Ritirare una proposta pubblicata |
| E4 | Rielaborare una proposta altrui, con la differenza elemento per elemento |
| E5 | Commento ancorato a un elemento della proposta |
| E6 | Sintesi per il promotore (elementi più richiesti e dove, costo medio, proposte più votate), calcolata nel front end |
| E7 | Correzione dell'inventario da parte del promotore, bloccata dopo la prima proposta pubblicata |
| E8 | Gestione della consultazione: modificare descrizione e scadenza, chiudere in anticipo |
| E9 | Descrizione e foto dello spazio da Wikidata e Wikimedia Commons |
| E10 | Proposte mostrate sulla mappa; filtri per elementi e autore |
| E11 | Profilo: le proprie bozze, proposte, voti ricevuti, commenti |
| E12 | Altre regioni (importazione di un altro prezzario) |

La divisione segue la condizione del professore. Annulla/ripeti è un'estensione perché il professore
lo cita fra le cose che allargano il perimetro. Nel nucleo ci sono due voci che lui non nomina:
**UC2 e UC3**, perché la collezione filtrata e ordinata è un requisito del corso, con pochi filtri; e
**UC1**, perché voto, commento e proposte richiedono un utente.

Non scriviamo funzioni RPC: costo e sintesi si calcolano nel front end ([05](05-api-rest.md)).

## Schede dei casi d'uso del nucleo

Per ogni caso: attore, precondizioni, scenario principale, scenari alternativi, postcondizioni,
criteri di accettazione. I criteri di accettazione li scriviamo noi.

> Da scrivere, a partire da UC5.
