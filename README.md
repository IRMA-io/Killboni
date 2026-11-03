# KILLONI ✳

Observatori crític de votacions. Web estàtica, accessible i responsive, en català per defecte.

## Publicació
GitHub Pages: Settings → Pages → Build and deployment → Deploy from a branch → main → /(root). URL prevista: https://monica-io.github.io/Killboni/ (cal habilitar Pages i comprovar el desplegament).

## Dades i verificació
La primera versió comença amb **zero votacions**. No hi ha resultats inventats ni atribucions sense verificació. Afegiu registres a `data/votes.json` després de contrastar les fonts primàries.

Cada registre requereix `id` únic, `title`, `institution`, `date` (YYYY-MM-DD), `topic`, `source_document`, `source_url` (HTTPS) i `party_votes` (array). Cada vot atribuït necessita `party`, `position` (yes/no/abstain/absent/not_recorded) i `source_url` propi (HTTPS). **No deduïu el vot d'un partit a partir del resultat global.** Distingiu abstenció, absència i vot no registrat.

Portals institucionals per obtenir fonts primàries: https://www.congreso.es/ · https://www.parlament.cat/ · https://www.europarl.europa.eu/ . Aquests enllaços no verifiquen per si sols cap votació.

## Idiomes
Selector de 16 codis: ca, es, en, fr, de, it, pt, eu, gl, ar, ur, ro, nl, pl, tr, uk. Traduccions inicials parcials en es/en/ar/ur i fallback al català per als textos pendents. Direcció RTL per ar i ur. Les 16 traduccions completes són feina pendent.

## Accessibilitat
HTML semàntic, skip link, etiquetes, focus visible, anuncis de resultats, disseny adaptable i suport RTL. Cal auditar amb teclat, lector de pantalla i WCAG abans de declarar conformitat.

## Limitacions v0.1
Sense dades verificades incorporades. Perfils de partit bàsics i dinàmics, no pàgines independents. Sense backend ni dependències externes.
