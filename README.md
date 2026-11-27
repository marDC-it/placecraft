# Placecraft

Placecraft è un editor nel browser con cui i cittadini ridisegnano uno spazio pubblico reale, un
parco o una piazza, entro un budget fissato da chi promuove la consultazione. Perimetro ed elementi
esistenti arrivano da OpenStreetMap; i costi vengono dal prezzario ufficiale della Regione
Abruzzo, voce per voce. Gli altri cittadini votano le proposte e le commentano. Rielaborazione delle
proposte e sintesi per il promotore sono estensioni, dopo il nucleo.

Progetto d'esame del corso **Front-End Engineering**, Università dell'Aquila, a.a. 2026/27.

Autori: Mario Del Corvo, Gennaro Ranalli, Lorenzo Rodorigo.

## Stato del progetto

- [x] Proposta consegnata (20 novembre 2026): **accettata con condizioni** (24 novembre 2026), vedi [docs/07-decisioni.md](docs/07-decisioni.md)
- [x] Proposta definitiva, aggiornata ai rilievi (25 novembre 2026)
- [ ] Requisiti, con nucleo ed estensioni separati (15 dicembre 2026)
- [ ] Scheletro dell'app (React 19 + Vite)
- [ ] Database Supabase e policy
- [ ] Prima versione dell'editor
- [ ] Deploy su Vercel

## Documentazione

Tutta la documentazione è nella cartella [`docs/`](docs/README.md).

## Struttura del repository

```
placecraft/
├─ docs/                 documentazione del progetto (Markdown)
├─ data/                 il prezzario estratto e il catalogo degli elementi (JSON)
├─ scripts/              script di supporto, non fanno parte dell'app
├─ supabase/migrations/  lo schema del database e le policy, in SQL
└─ (src/, package.json…  l'app React, generata con Vite)
```

## Avviare il progetto in locale

> Da completare quando c'è lo scheletro dell'app.

```bash
npm install
cp .env.example .env.local   # poi inserisci URL e chiave publishable del progetto Supabase
npm run dev
```


## Tecnologie

React 19, Vite, React Router, Context + useReducer, Supabase (PostgreSQL, PostgREST, Auth, PostGIS)
fin dallo sviluppo, Vercel.

## Dati e attribuzioni

Mappe e dati geografici © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors (ODbL);
foto da Wikimedia Commons con autore e licenza indicati nell'app; prezzi dal Prezzario della Regione
Abruzzo 2026 (DGR n. 434/2026), pubblicato come dato aperto ai sensi del D.Lgs. 36/2023, All. I.14;
i costi mostrati sono stime indicative, IVA esclusa. Dettagli in [docs/06-fonti-dati.md](docs/06-fonti-dati.md).
