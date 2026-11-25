# 05 · API REST

Le API di Placecraft sono quelle che **Supabase genera automaticamente** dalle tabelle e dalle funzioni
del database (PostgREST). Non sono API progettate e scritte da noi: le documentiamo perché altri possano
usarle, nient'altro. Con la chiave publishable, le policy mostrano solo i dati pubblici (consultazioni,
proposte pubblicate).

| Metodo e percorso | Che cosa restituisce |
|---|---|
| `GET /rest/v1/consultazioni` | le consultazioni; filtri e ordinamenti dall'URL, es. `?stato=eq.aperta&order=scadenza` |
| `GET /rest/v1/proposte?consultazione_id=eq.ID&stato=eq.pubblicata` | le proposte pubblicate di una consultazione |
| `GET /rest/v1/elementi_proposta?proposta_id=eq.ID` | gli elementi di una proposta, con posizione e tipo |
| `GET /rest/v1/tipi_elemento` | il catalogo |
| `GET /rest/v1/voci_prezzario?codice=like.ABR26_U.06*` | le voci del prezzario caricate |

I nomi delle tabelle sono provvisori.

## Niente funzioni RPC

Non scriviamo funzioni SQL da chiamare come `/rest/v1/rpc/…`. Il costo di una proposta e la sintesi
per il promotore (estensione) si calcolano nel front end, a partire dai dati letti con gli endpoint qui
sopra. L'unica funzione nel database è `valida_proposta`, eseguita dal database stesso quando una
proposta passa da bozza a pubblicata ([04](04-architettura.md)).
