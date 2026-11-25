# 02 · Requisiti e casi d'uso

> Bozza per la consegna del 15 dicembre (requisiti funzionali, non funzionali, mockup). I requisiti
> funzionali sono espressi come **casi d'uso**. Adottiamo uno **sviluppo incrementale**: il primo
> incremento è il nucleo, le estensioni vengono dopo.

## I tre requisiti del corso

| Requisito del professore | Come lo soddisfa Placecraft | Casi d'uso |
|---|---|---|
| Una collezione listata, filtrata e ordinata | consultazioni (per comune e stato); proposte pubblicate (per costo; ordinate per valutazione media, costo, data). Filtri nell'URL | UC2, UC3 |
| Creare, modificare, eliminare, con persistenza | consultazioni; bozze (create, modificate, eliminate); valutazioni (date, cambiate, ritirate); commenti (scritti, modificati, eliminati) | UC5, UC7, UC8, UC9 |
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
| UC3 | Vedere una consultazione e le sue proposte | Visitatore | perimetro, elementi esistenti, budget, scadenza; proposte pubblicate filtrabili per costo e ordinabili per valutazione media, costo, data |
| UC4 | Vedere una proposta | Visitatore | disegno sulla mappa, computo metrico voce per voce, valutazione media e numero di valutazioni, commenti |
| UC5 | Creare o modificare una proposta | Cittadino | editor che parte dallo stato attuale: aggiungere dal catalogo, spostare, rimuovere; costo e avvisi a ogni mossa; una sola bozza per consultazione, visibile solo all'autore, che può salvarla, riprenderla ed eliminarla |
| UC6 | Pubblicare una proposta | Cittadino | il database esegue `valida_proposta`; se passa, la proposta diventa pubblica: non si modifica e non si elimina più |
| UC7 | Valutare una proposta | Cittadino | da 1 a 5 stelle, a passi di mezza stella; una valutazione per proposta, non sulla propria; si può cambiare o ritirare finché la consultazione è aperta |
| UC8 | Commentare una proposta | Cittadino | scrivere un commento sulla proposta; modificare ed eliminare i propri finché la consultazione è aperta |
| UC9 | Aprire una consultazione | Promotore | ricerca con Nominatim, scelta da una lista; perimetro ed elementi da Overpass, copiati nel database; budget e scadenza; regione e anno del prezzario fissati ora |

Una consultazione è **aperta** fino alla scadenza fissata dal promotore; dopo, il database rifiuta
nuove pubblicazioni, valutazioni e commenti, e la modifica o eliminazione di valutazioni e commenti.

L'ordinamento per valutazione usa la media; a parità di media, prima la proposta con più
valutazioni. Accanto alle stelle si mostra sempre il numero di valutazioni (es. «4,5 ★ (12)»). Media e
ordinamento si calcolano nel front end.

## Estensioni

| ID | Estensione |
|---|---|
| E1 | Annulla/ripeti nell'editor |
| E2 | Moderazione: il promotore elimina i commenti inopportuni sulle proposte della propria consultazione |
| E3 | Ritirare una proposta pubblicata |
| E4 | Rielaborare una proposta altrui, con la differenza elemento per elemento |
| E5 | Commento ancorato a un elemento della proposta |
| E6 | Sintesi per il promotore (elementi più richiesti e dove, costo medio, proposte meglio valutate), calcolata nel front end |
| E7 | Correzione dell'inventario da parte del promotore, bloccata dopo la prima proposta pubblicata |
| E8 | Gestione della consultazione: modificare descrizione e scadenza, chiudere in anticipo |
| E9 | Descrizione e foto dello spazio da Wikidata e Wikimedia Commons |
| E10 | Proposte mostrate sulla mappa; filtri per elementi e autore |
| E11 | Profilo: le proprie bozze, proposte, valutazioni ricevute, commenti |
| E12 | Altre regioni (importazione di un altro prezzario) |

La divisione segue la condizione del professore. Annulla/ripeti è un'estensione perché il professore
lo cita fra le cose che allargano il perimetro. Nel nucleo ci sono due voci che lui non nomina:
**UC2 e UC3**, perché la collezione filtrata e ordinata è un requisito del corso, con pochi filtri; e
**UC1**, perché voto, commento e proposte richiedono un utente.

Non scriviamo funzioni RPC: costo e sintesi si calcolano nel front end ([05](05-api-rest.md)).

## Schede dei casi d'uso del nucleo

Per ogni caso: attore, precondizioni, scenario principale, scenari alternativi, postcondizioni,
criteri di accettazione. I criteri di accettazione li scriviamo noi.

### UC5 · Creare o modificare una proposta

**Attore:** Cittadino.

**Precondizioni:** il cittadino ha fatto l'accesso; la consultazione è aperta.

**Ipotesi di progetto:** il budget fissato dal promotore copre solo gli **elementi nuovi**. Rimuovere o
spostare elementi esistenti non costa nulla: si intende che il promotore abbia riservato a parte una
somma per questi lavori. Nel computo metrico rimozioni e spostamenti compaiono con la nota «non
conteggiati nel budget».

**Scenario principale**

1. Il cittadino, nella pagina della consultazione, preme «Crea una proposta».
2. Il sistema apre l'editor: la mappa con il perimetro, le aree escluse e gli elementi esistenti; il
   catalogo degli elementi; budget, costo (0 €) e computo metrico.
3. Il cittadino sceglie un tipo dal catalogo e clicca un punto della mappa.
4. Il sistema aggiunge l'elemento e aggiorna costo e computo metrico.
5. Il cittadino trascina un elemento, nuovo o esistente, in un altro punto.
6. Il sistema aggiorna la posizione. Il costo non cambia.
7. Il cittadino seleziona un elemento e lo rimuove.
8. Il sistema lo toglie dalla proposta: un elemento nuovo sparisce e il costo scende; un elemento
   esistente resta visibile come «da rimuovere», senza costo.
9. Il cittadino scrive titolo e descrizione, entrambi obbligatori, e preme «Salva bozza».
10. Il sistema salva la bozza, visibile solo a lui, e lo conferma.

**Scenari alternativi**

- **1a. La bozza esiste già.** Una sola bozza per consultazione: il pulsante è «Riprendi la tua bozza»
  e l'editor si riapre con gli elementi salvati (anche dalla sezione «Le tue bozze» della pagina della
  consultazione, visibile solo all'autore). Lo scenario prosegue dal punto 3.
- **3a / 5a. Punto fuori dal perimetro o in un'area esclusa.** L'elemento compare con un avviso. La
  bozza si può salvare, ma non pubblicare (UC6).
- **4a. Costo oltre il budget.** Il costo diventa rosso, con lo sforamento («+500 €»). La bozza si può
  salvare, ma non pubblicare.
- **9a. Titolo o descrizione mancanti.** Il pulsante «Salva bozza» resta disattivato e i campi vuoti
  sono segnalati.
- **9b. Eliminare la bozza.** Il cittadino preme «Elimina bozza» e conferma; il sistema la cancella.
- **10a. Errore di rete.** Messaggio con «Riprova»; le modifiche restano nell'editor.
- **10b. Consultazione scaduta nel frattempo.** Il sistema rifiuta il salvataggio e spiega perché.
- **Uscita con modifiche non salvate.** Il sistema chiede conferma prima di lasciare l'editor.

**Postcondizioni:** la bozza è salvata con titolo, descrizione e i suoi elementi: nuovi, spostati,
rimossi, ciascuno con la posizione. Il costo non si salva: si ricalcola sempre dal prezzario.

**Criteri di accettazione**

> Da scrivere da noi, in forma verificabile («Dato … quando … allora …»): aggiunta, spostamento,
> rimozione di un nuovo e di un esistente, sforamento del budget, elemento fuori perimetro, campi
> obbligatori, salvataggio, ripresa, eliminazione, uscita senza salvare.

### UC1–UC4, UC6–UC9

> Da scrivere.
