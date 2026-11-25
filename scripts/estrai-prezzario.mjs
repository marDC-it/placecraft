// Estrae voci dal Prezzario della Regione Abruzzo (PDF ufficiale) e le stampa in JSON.
//
// Uso:
//   node scripts/estrai-prezzario.mjs PREZZARIO.pdf INIZIO FINE [INIZIO FINE ...] [--fonte="..."] > voci.json
// Esempi:
//   node scripts/estrai-prezzario.mjs opere-edili-2026.pdf ABR26_U.06 ABR26_U.08 ABR26_E.01.180.60 ABR26_E.01.190 > edili.json
//   node scripts/estrai-prezzario.mjs impianti-elettrici-2026.pdf ABR26_EL.65 ABR26_EL.70 > illuminazione.json
//
// Dipendenza (solo per lo sviluppo):  npm install --save-dev pdfjs-dist
// Lo script non fa parte dell'app: si lancia a mano quando esce un nuovo prezzario.

import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const CODICE = /^(ABR\d\d_[A-Z]+[._][0-9A-Za-z._]+)\s*(.*)$/;
const PREZZO = /^(\S+(?:\s\S+)?)\s+([\d.]+,\d+)\s+([\d.]+,\d+)\s?%\s+([\d.]+,\d{2})$/;
const numero = s => Number(s.replaceAll('.', '').replace(',', '.'));

// 1. Dal PDF a righe di testo: pdf.js restituisce frammenti con coordinate,
//    li raggruppiamo per altezza (y) e li ordiniamo da sinistra a destra (x).
async function righeDelPdf(percorso) {
  const pdf = await getDocument({ url: percorso, useSystemFonts: true, verbosity: 0 }).promise;
  const righe = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const { items } = await (await pdf.getPage(n)).getTextContent();
    const perY = new Map();
    for (const it of items) {
      if (!it.str.trim()) continue;
      const y = Math.round(it.transform[5]);
      const chiave = [...perY.keys()].find(k => Math.abs(k - y) <= 2) ?? y;
      if (!perY.has(chiave)) perY.set(chiave, []);
      perY.get(chiave).push({ x: it.transform[4], w: it.width, s: it.str });
    }
    [...perY.entries()]
      .sort((a, b) => b[0] - a[0])                       // dall'alto in basso
      .forEach(([, pezzi]) => {
        pezzi.sort((a, b) => a.x - b.x);
        // spazio solo se tra due frammenti c'è davvero distanza (pdf.js spezza anche "pic-nic")
        const testo = pezzi.reduce((acc, p, i) =>
          i === 0 ? p.s : acc + (p.x - (pezzi[i - 1].x + pezzi[i - 1].w) > 1 ? ' ' : '') + p.s, '');
        righe.push(testo.replace(/\s+/g, ' ').trim());
      });
  }
  return righe;
}

const rumore = t =>
  !t || /^- \d+ -$/.test(t) || t.includes('PREZZARIO') || t.startsWith('CODICE') ||
  /^[A-Z]+ - /.test(t) || t === t.toUpperCase();

// 2. Dalle righe alle voci: una riga che inizia con un codice apre una voce,
//    le righe successive ne continuano la descrizione, la riga con il prezzo la chiude.
function estrai(righe, inizio, fine) {
  const voci = [], nodi = new Map();
  let corrente = null, attivo = false;
  for (const t of righe) {
    const c = t.match(CODICE);
    if (c) {
      const codice = c[1];
      if (codice.startsWith(inizio)) attivo = true;
      else if (attivo && codice.startsWith(fine)) break;
      if (!attivo) continue;
      // il prezzo può stare sulla stessa riga del codice (voci con descrizione breve)
      const resto = c[2], p = resto.match(/(\S+(?:\s\S+)?)\s+([\d.]+,\d+)\s+([\d.]+,\d+)\s?%\s+([\d.]+,\d{2})$/);
      corrente = { codice, testo: p ? resto.slice(0, p.index).trim() : resto };
      nodi.set(codice, corrente);
      if (p) { chiudi(corrente, p); voci.push(corrente); corrente = null; }
      continue;
    }
    if (!attivo || !corrente) continue;
    const p = t.match(PREZZO);
    if (p) { chiudi(corrente, p); voci.push(corrente); corrente = null; continue; }
    if (!rumore(t)) corrente.testo += ' ' + t;
  }
  return voci.map(v => {
    const padre = nodi.get(v.codice.slice(0, v.codice.lastIndexOf('.')));
    const pt = padre && padre !== v ? padre.testo.replace(/[:\s]+$/, '') : '';
    const vt = v.testo.replace(/^-\s*/, '').trim();
    const { testo, ...resto } = v;
    return {
      ...resto,
      descrizione: !pt || vt.startsWith(pt.slice(0, 40)) ? vt : `${pt}: ${vt}`,
      capitolo: v.codice.split('.').slice(0, 2).join('.'),
    };
  });
}

function chiudi(voce, p) {
  Object.assign(voce, {
    um: p[1].toLowerCase(),
    sicurezza_eur: numero(p[2]),
    incidenza_manodopera_pct: numero(p[3]),
    prezzo_eur: numero(p[4]),
  });
}

const argomenti = process.argv.slice(2);
const fonte = argomenti.find(a => a.startsWith('--fonte='))?.slice('--fonte='.length);
const [pdf, ...intervalli] = argomenti.filter(a => !a.startsWith('--'));
if (!pdf || intervalli.length % 2) {
  console.error('Uso: node estrai-prezzario.mjs PREZZARIO.pdf INIZIO FINE [INIZIO FINE ...]');
  process.exit(1);
}
const righe = await righeDelPdf(pdf);
const voci = [];
for (let i = 0; i < intervalli.length; i += 2) voci.push(...estrai(righe, intervalli[i], intervalli[i + 1]));
process.stdout.write(JSON.stringify(fonte ? voci.map(v => ({ ...v, fonte })) : voci, null, 1));
