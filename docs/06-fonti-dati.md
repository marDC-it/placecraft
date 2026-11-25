# 06 · Fonti dei dati

| Fonte | Che cosa dà | Quando si chiama | Note verificate |
|---|---|---|---|
| **Overpass** (OpenStreetMap) | perimetro dello spazio (con le aree escluse) ed elementi esistenti | solo all'apertura di una consultazione; il risultato è copiato nel database | i parchi dell'Aquila sono mappati con perimetro ed elementi; le relazioni multipoligono hanno tratti esterni non in ordine e aree interne: serve `osmtogeojson` |
| **Nominatim** | trovare lo spazio per nome | all'apertura | usare `addressdetails=1` e tenere solo i poligoni; mostrare una lista: lo stesso nome compare in comuni diversi |
| **Wikidata** (estensione) | descrizione e foto (proprietà P18) | alla visualizzazione o all'apertura | — |
| **Wikimedia Commons** (estensione) | autore e licenza della foto | idem | l'autore arriva come HTML: ridurlo a testo (DOMParser), mai inserirlo come HTML |
| **Tile della mappa** | OpenFreeMap | sempre | — |
| **Prezzario Regione Abruzzo 2026** | codici e prezzi ufficiali | importato una volta nel database | DGR n. 434 del 22/07/2026, BURAT Ordinario n. 31 del 05/08/2026; solo PDF. Capitoli U.06 (arredo urbano), U.07 (opere a verde), EL.65 (illuminazione pubblica): 490 voci. Nei file JSON i codici hanno il prefisso della regione e dell'anno, come nel PDF: `ABR26_U.06.10.170.10` |

Tutte le API sono state provate dal browser, senza problemi di CORS.

## Licenze e attribuzioni da mostrare nell'app

- **OpenStreetMap**: dati sotto licenza ODbL. Sulla mappa va la scritta «© OpenStreetMap contributors»
  con il link a `openstreetmap.org/copyright`. Vale anche per perimetri ed elementi copiati nel nostro
  database.
- **Wikimedia Commons**: ogni foto va mostrata con autore e licenza (es. «Foto: Pietro, CC BY-SA 4.0,
  via Wikimedia Commons»).
- **Tile della mappa**: l'attribuzione richiesta da OpenFreeMap (insieme a quella di OpenStreetMap).
- **Prezzario**: citare la fonte (Regione Abruzzo, DGR n. 434/2026) nel computo metrico.

### Condizioni di riuso del prezzario (rilievo del professore: verificare e citare)

Verifica fatta il 25/11/2026.

**Che cosa abbiamo controllato**

| Documento | Che cosa dice sul riuso |
|---|---|
| PDF del prezzario (opere edili; impianti elettrici) | nessuna licenza né nota di copyright |
| All. A – Avvertenze generali 2026 | nessuna licenza; i prezzi sono «informativi», medie di riferimento per il territorio regionale |
| DGR n. 434 del 22/07/2026 | pubblicazione sul sito della Regione «per la libera consultazione ed acquisizione», ai fini della «diffusione» del prontuario |
| Note legali di `regione.abruzzo.it` (aggiornate al 09/10/2025) | clausola generica per tutto il sito: contenuti protetti dal diritto d'autore, riproduzione senza autorizzazione vietata, uso non commerciale |
| D.Lgs. 36/2023, Allegato I.14, art. 1, comma 2 | i prezzari regionali sono messi a disposizione gratuitamente e **in formato open data** |

**Conclusione: usiamo il prezzario come dato aperto, citando la fonte.** I motivi:

1. L'Allegato I.14 del Codice dei contratti pubblici (D.Lgs. 36/2023), a cui la stessa DGR 434/2026 fa
   riferimento (art. 41, comma 13), dispone che i prezzari regionali siano disponibili come open data.
2. «Dati di tipo aperto» ha una definizione di legge (CAD, D.Lgs. 82/2005, art. 1, comma 1, lettera
   l-ter): dati con una licenza che ne permette l'utilizzo da parte di chiunque, anche per finalità
   commerciali, in formato disaggregato, leggibili da un calcolatore e gratuiti.
3. La DGR prevede la libera consultazione, l'acquisizione e la diffusione.
4. Il prezzario è un allegato di una delibera pubblicata sul Bollettino ufficiale. L'art. 5 della
   legge 633/1941 esclude dal diritto d'autore i testi degli atti ufficiali delle pubbliche
   amministrazioni.
5. Le note legali del sito sono una clausola generica e non possono escludere un obbligo di
   pubblicazione aperta fissato da una legge specifica. In ogni caso il nostro uso è didattico e non
   commerciale.

Resta un margine interpretativo, perché l'Allegato parla di «formato» open data. Se il professore
vuole una conferma ufficiale, scriviamo alla Regione (URP, `urp@regione.abruzzo.it`, o il servizio che
cura il prezzario).

Testi di riferimento: per le norme fa fede il testo su [Normattiva](https://www.normattiva.it); la DGR e
gli allegati sono sul BURAT Ordinario n. 31 del 05/08/2026.

**Che cosa ne segue per l'app**

- Fonte sempre indicata dove compare un costo: «Prezzi: Prezzario Regione Abruzzo 2026 (DGR 434/2026)».
- Il costo è una **stima indicativa, IVA esclusa**, non un preventivo. Secondo le Avvertenze i prezzi
  comprendono già spese generali (15%) e utile d'impresa (10%), l'IVA è a parte, e il progettista può
  scostarsene fino al 30% motivandolo.
- Il prezzario cambia ogni anno: ogni voce porta regione e anno, e una consultazione resta legata
  all'edizione con cui è stata aperta.
- Nell'app la fonte si cita senza link diretto al sito della Regione: le note legali chiedono
  un'autorizzazione preventiva anche per i link.

## Il prezzario nel repository

- `scripts/estrai-prezzario.mjs`: estrae le voci dal PDF ufficiale (Node + `pdfjs-dist`). Non fa parte
  dell'app: si lancia a mano quando esce un prezzario nuovo. Uso nell'intestazione dello script.
  Richiede `npm install --save-dev pdfjs-dist`; i PDF vanno in `data/prezzari-pdf/`, esclusa dal repository.
- `data/prezzario_abruzzo_2026_arredo_verde_illuminazione.json`: le 490 voci estratte.
- `data/catalogo.json`: i tipi di elemento del catalogo e le loro composizioni (voci e quantità).

## Estendere ad altre regioni

Il modello prevede regione e anno del prezzario. Per una regione nuova: importare il suo prezzario e
associarne le voci ai tipi del catalogo (righe di Composizione). Alcune regioni pubblicano già dati
strutturati (Puglia via CKAN; Toscana, Lombardia, Veneto in CSV/XML); l'Abruzzo solo PDF.
