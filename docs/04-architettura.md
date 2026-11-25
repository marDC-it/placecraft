# 04 · Architettura

> Bozza da completare man mano che il codice prende forma.

## Stack (vincoli del corso)

- **React 19 + Vite**, React Router per le viste.
- **Stato**: Context + `useReducer` (niente Redux). L'editor usa `useReducer`; come estensione, `{ past, present, future }` per annulla/ripeti.
- **Dati**: tutte le chiamate passano da `src/api.js`, verso **Supabase fin dallo sviluppo** (PostgREST, Auth, policy RLS, PostGIS). Niente json-server: `valida_proposta` esiste solo nel database (indicazione del professore).
- **Deploy**: Vercel per il front end, Supabase per i dati.
- **Non usati** (esclusi dal corso): server nostro, Next.js, Docker, realtime multiplayer.

## Viste (prima ipotesi)

| Percorso | Vista |
|---|---|
| `/` | elenco delle consultazioni |
| `/consultazioni/:id` | una consultazione e le sue proposte |
| `/consultazioni/:id/proponi` | editor, nuova proposta |
| `/proposte/:id` | dettaglio di una proposta |
| `/proposte/:id/rielabora` | editor, rielaborazione (estensione) |
| `/nuova` | apertura di una consultazione (promotore) |
| `/profilo` | il proprio profilo (estensione) |

## Stato

- **Stato dell'applicazione** (Context): utente corrente (`AuthProvider`), con `is_promoter` letto dalla tabella `profiles`.
- **Stato del componente**: l'editor (`useReducer`), i filtri (nell'URL, non nello stato).
- **Stato derivato** (calcolato, non salvato): costo, avvisi, computo metrico; nelle estensioni anche le differenze tra originale e rielaborazione e la sintesi per il promotore.

## La regola lato database

`valida_proposta` è una funzione PostgreSQL (trigger sul passaggio da bozza a pubblicata). Ricalcola il
costo da elementi → composizioni → voci del prezzario (regione e anno della consultazione) e controlla
con PostGIS che ogni elemento stia nel perimetro, aree escluse comprese. Il browser fa lo stesso
calcolo per la risposta immediata; il database è l'unico che conta.

È l'unica funzione scritta da noi nel database: niente funzioni RPC. Il costo e la sintesi per il
promotore si calcolano nel front end, a partire dai dati letti con PostgREST.
