# 03 · Modello dei dati

> Bozza: nomi delle tabelle e delle colonne da confermare quando scriviamo lo schema in
> `supabase/migrations/`.

## Entità

| Entità | Che cos'è | Relazioni |
|---|---|---|
| **Utente** | account di Supabase Auth (`auth.users`); in `profiles` il nome e il campo **`is_promoter`** (boolean, impostato a mano) | promuove consultazioni (se `is_promoter`); scrive proposte, voti, commenti |
| **Consultazione** | uno spazio reale: perimetro (poligono PostGIS, con le aree escluse), budget, scadenza, stato, **regione e anno del prezzario**, fissati alla creazione | ha un promotore, un inventario, molte proposte |
| **Tipo di elemento** | il catalogo: albero, panchina, cestino, fontanella, rastrelliera, tavolo pic-nic, lampione, area giochi | composto da voci del prezzario |
| **Voce del prezzario** | codice, descrizione, unità, prezzo, regione, anno | entra nei tipi tramite la Composizione |
| **Composizione** | quante unità di una voce servono per un tipo (es. cestino = 2 voci) | molti a molti tra tipo e voce, con quantità |
| **Elemento esistente** | elemento già presente nello spazio (da OSM; corretto dal promotore come estensione), con posizione | appartiene a una consultazione; ha un tipo |
| **Proposta** | bozza o pubblicata; estensione: può rielaborarne un'altra (`rielabora_id`) | di un utente e di una consultazione; ha elementi, voti |
| **Elemento della proposta** | un elemento aggiunto, spostato o rimosso, con posizione | appartiene a una proposta; ha un tipo; ha commenti |
| **Voto** | un voto all'intera proposta | utente ↔ proposta, unico per coppia |
| **Commento** | nucleo: testo su una proposta; estensione: ancorato a un elemento | utente ↔ proposta; estensione: `elemento_id` facoltativo |

## Regole

| Regola | Dove si fa rispettare |
|---|---|
| Un voto per utente per proposta | vincolo `unique (utente_id, proposta_id)` |
| Non si vota la propria proposta | policy (o funzione) |
| Si vota solo a consultazione aperta | policy |
| Solo un promotore apre una consultazione | policy: `exists (select 1 from profiles where id = auth.uid() and is_promoter)` |
| Solo il promotore della consultazione modifica l'inventario (estensione) | policy |
| Inventario bloccato dopo la prima proposta pubblicata (estensione) | policy / trigger |
| Una proposta si modifica solo da bozza, e solo dall'autore | policy di `update`: `autore = auth.uid() and stato = 'bozza'` |
| Bozze visibili solo all'autore | policy di `select` |
| Una proposta pubblicata è dentro il budget e dentro il perimetro | **`valida_proposta`** (funzione del database): ricalcola il costo da composizioni e prezzario e controlla con `ST_Contains` ogni elemento |

## Decisioni aperte

- Eliminare una proposta pubblicata: proposta → solo se non ha voti né commenti, altrimenti «ritirata».
- Rimozioni di elementi esistenti senza una voce di prezzario corrispondente: come conteggiarle.
- Voci da confermare nel PDF (es. U.07.10.440: include la messa a dimora?).
