# audit du site — 2026-08-16

Généré par `scripts/audit.mjs` (crawler Playwright sur http://localhost:3000).

## synthèse

- pages internes crawlées : **30**
- pages en erreur (≠ 200) : **0**
- pages avec erreurs JS console : **0**
- liens externes détectés : **31** (non vérifiables depuis la
  sandbox — voir section dédiée)

## pages internes

| page | statut | titre | h1 | img sans alt | champs sans label | erreurs js |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 200 | akelius — a better way to live | a better way to live | 0 | 0 | 0 |
| `/recherche?ville=paris` | 200 | recherche — akelius | 16 logements à louer à paris | 0 | 0 | 0 |
| `/recherche?ville=londres` | 200 | recherche — akelius | 0 logement à louer à londres | 0 | 0 | 0 |
| `/recherche?ville=new-york` | 200 | recherche — akelius | 0 logement à louer à new york | 0 | 0 | 0 |
| `/pro` | 200 | back-office — akelius | accès réservé aux équipes akelius | 0 | 0 | 0 |
| `/pro/annonces` | 200 | mes annonces — back-office akelius | accès réservé aux équipes akelius | 0 | 0 | 0 |
| `/pro/annonces/nouvelle` | 200 | nouvelle annonce — back-office akelius | accès réservé aux équipes akelius | 0 | 0 | 0 |
| `/bien/175-rue-championnet-75018-paris-6301-a12` | 200 | 2 pièces – 175 rue Championnet, 75018 Paris — akelius | 2 pièces – 175 rue Championnet, 75018 Paris | 0 | 0 | 0 |
| `/bien/28-rue-hermel-75018-paris-6302-112` | 200 | Studio/1 pièce – 28 rue Hermel, 75018 Paris — akelius | studio – 28 rue Hermel, 75018 Paris | 0 | 0 | 0 |
| `/bien/28-rue-hermel-75018-paris-6302-432` | 200 | Studio/1 pièce – 28 rue Hermel, 75018 Paris — akelius | studio – 28 rue Hermel, 75018 Paris | 0 | 0 | 0 |
| `/bien/28-rue-hermel-75018-paris-6302-512` | 200 | Studio/1 pièce – 28 rue Hermel, 75018 Paris — akelius | studio – 28 rue Hermel, 75018 Paris | 0 | 0 | 0 |
| `/recherche?ville=toronto` | 200 | recherche — akelius | 0 logement à louer à toronto | 0 | 0 | 0 |
| `/recherche?ville=montreal` | 200 | recherche — akelius | 0 logement à louer à montréal | 0 | 0 | 0 |
| `/recherche?ville=ottawa` | 200 | recherche — akelius | 0 logement à louer à ottawa | 0 | 0 | 0 |
| `/recherche?ville=quebec` | 200 | recherche — akelius | 0 logement à louer à québec | 0 | 0 | 0 |
| `/recherche?ville=boston` | 200 | recherche — akelius | 0 logement à louer à boston | 0 | 0 | 0 |
| `/recherche?ville=washington` | 200 | recherche — akelius | 0 logement à louer à washington d.c. | 0 | 0 | 0 |
| `/recherche` | 200 | recherche — akelius | 16 logements à louer | 0 | 0 | 0 |
| `/bien/101-rue-la-fayette-75010-paris-6304-b31` | 200 | Studio/1 pièce – 101 rue La Fayette, 75010 Paris — akelius | studio – 101 rue La Fayette, 75010 Paris | 0 | 0 | 0 |
| `/bien/6-place-felix-eboue-75012-paris-6305-722` | 200 | 2 pièces – 6 place Félix Eboué, 75012 Paris — akelius | 2 pièces – 6 place Félix Eboué, 75012 Paris | 0 | 0 | 0 |
| `/bien/11-bis-rue-de-l-amiral-mouchez-75013-paris-6314-313` | 200 | 2 pièces – 11 bis rue de l'Amiral Mouchez, 75013 Paris — akelius | 2 pièces – 11 bis rue de l'Amiral Mouchez, 75013 Paris | 0 | 0 | 0 |
| `/bien/61-rue-didot-75014-paris-6320-a34` | 200 | Studio/1 pièce – 61 Rue Didot, 75014 Paris — akelius | studio – 61 Rue Didot, 75014 Paris | 0 | 0 | 0 |
| `/bien/3-rue-victor-hugo-92600-asnieres-sur-seine-6354-053` | 200 | Studio/1 pièce – 3 rue Victor Hugo, 92600 Asnières-sur-Seine — akelius | studio – 3 rue Victor Hugo, 92600 Asnières-sur-Seine | 0 | 0 | 0 |
| `/bien/17-rue-jessaint-75018-paris-6356-a41` | 200 | 2 pièces – 17 rue Jessaint, 75018 Paris — akelius | 2 pièces – 17 rue Jessaint, 75018 Paris | 0 | 0 | 0 |
| `/bien/52-rue-eugene-carriere-75018-paris-6359-a23` | 200 | 2 pièces – 52 rue Eugène Carrière, 75018 Paris — akelius | 2 pièces – 52 rue Eugène Carrière, 75018 Paris | 0 | 0 | 0 |
| `/bien/7-rue-de-la-montagne-sainte-genevieve-75005-paris-6368-a61` | 200 | Studio/1 pièce – 7 rue de la Montagne Sainte Genevieve, 75005 Paris — akelius | studio – 7 rue de la Montagne Sainte Genevieve, 75005 Paris | 0 | 0 | 0 |
| `/bien/18-rue-de-l-eglise-92200-neuilly-sur-seine-6369-a42` | 200 | 3 pièces – 18 rue de l'Eglise, 92200 Neuilly-sur-Seine — akelius | 3 pièces – 18 rue de l'Eglise, 92200 Neuilly-sur-Seine | 0 | 0 | 0 |
| `/bien/30-rue-des-champs-92600-asnieres-sur-seine-6374-a22` | 200 | 3 pièces – 30 rue des Champs, 92600 Asnières-sur-Seine — akelius | 3 pièces – 30 rue des Champs, 92600 Asnières-sur-Seine | 0 | 0 | 0 |
| `/bien/27-rue-jean-baptiste-clement-92100-boulogne-billancourt-6378-a32` | 200 | 2 pièces – 27 rue Jean-Baptiste Clement, 92100 Boulogne-Billancourt — akelius | 2 pièces – 27 rue Jean-Baptiste Clement, 92100 Boulogne-Billancourt | 0 | 0 | 0 |
| `/bien/33-rue-lamarck-75018-paris-6380-a61` | 200 | 3 pièces – 33 rue Lamarck, 75018 Paris — akelius | 3 pièces – 33 rue Lamarck, 75018 Paris | 0 | 0 | 0 |

## endpoints api (fiches pdf…)

| endpoint | statut |
| --- | --- |
| `/api/pdf/175-rue-championnet-75018-paris-6301-a12?lang=fr` | 200 application/pdf |
| `/api/pdf/28-rue-hermel-75018-paris-6302-112?lang=fr` | 200 application/pdf |
| `/api/pdf/28-rue-hermel-75018-paris-6302-432?lang=fr` | 200 application/pdf |
| `/api/pdf/28-rue-hermel-75018-paris-6302-512?lang=fr` | 200 application/pdf |
| `/api/pdf/101-rue-la-fayette-75010-paris-6304-b31?lang=fr` | 200 application/pdf |
| `/api/pdf/6-place-felix-eboue-75012-paris-6305-722?lang=fr` | 200 application/pdf |
| `/api/pdf/11-bis-rue-de-l-amiral-mouchez-75013-paris-6314-313?lang=fr` | 200 application/pdf |
| `/api/pdf/61-rue-didot-75014-paris-6320-a34?lang=fr` | 200 application/pdf |
| `/api/pdf/3-rue-victor-hugo-92600-asnieres-sur-seine-6354-053?lang=fr` | 200 application/pdf |
| `/api/pdf/17-rue-jessaint-75018-paris-6356-a41?lang=fr` | 200 application/pdf |
| `/api/pdf/52-rue-eugene-carriere-75018-paris-6359-a23?lang=fr` | 200 application/pdf |
| `/api/pdf/7-rue-de-la-montagne-sainte-genevieve-75005-paris-6368-a61?lang=fr` | 200 application/pdf |
| `/api/pdf/18-rue-de-l-eglise-92200-neuilly-sur-seine-6369-a42?lang=fr` | 200 application/pdf |
| `/api/pdf/30-rue-des-champs-92600-asnieres-sur-seine-6374-a22?lang=fr` | 200 application/pdf |
| `/api/pdf/27-rue-jean-baptiste-clement-92100-boulogne-billancourt-6378-a32?lang=fr` | 200 application/pdf |
| `/api/pdf/33-rue-lamarck-75018-paris-6380-a61?lang=fr` | 200 application/pdf |

## liens externes (footer « sites officiels », etc.)

Le proxy réseau de l'environnement de développement bloque les domaines
externes : ces liens sont donc **à vérifier depuis un navigateur normal**
(ouvrir chaque lien une fois la démo déployée sur vercel).

| lien | présent sur |
| --- | --- |
| https://akelius.fr/en | footer — toutes les pages (30) |
| https://akelius.fr/en/search/france/apartment/paris | footer — toutes les pages (30) |
| https://www.akelius.com/en/akelius | footer — toutes les pages (30) |
| https://www.akelius.fr/en/akelius/about | footer — toutes les pages (30) |
| https://akelius.fr/en/contact/paris | footer — toutes les pages (30) |
| https://www.residential-akelius.co.uk/ | footer — toutes les pages (30) |
| https://www.akelius.fr/mentions-legales | footer — toutes les pages (30) |
| https://rent.akelius.com/en/search/united-kingdom/apartment/london | `/recherche?ville=londres` |
| https://www.akelius-properties.us/searchlisting?citystate=NY | `/recherche?ville=new-york` |
| https://akelius.fr/en/search/france/detail/6301_A12 | `/bien/175-rue-championnet-75018-paris-6301-a12` |
| https://akelius.fr/en/search/france/detail/6302_112 | `/bien/28-rue-hermel-75018-paris-6302-112` |
| https://akelius.fr/en/search/france/detail/6302_432 | `/bien/28-rue-hermel-75018-paris-6302-432` |
| https://akelius.fr/en/search/france/detail/6302_512 | `/bien/28-rue-hermel-75018-paris-6302-512` |
| https://rent.akelius.com/en/search/canada/apartment/toronto | `/recherche?ville=toronto` |
| https://rent.akelius.com/en/search/canada/apartment/montreal | `/recherche?ville=montreal` |
| https://rent.akelius.com/en/search/canada/apartment/ottawa | `/recherche?ville=ottawa` |
| https://rent.akelius.com/en/search/canada/apartment/quebec%20city | `/recherche?ville=quebec` |
| https://www.akelius-properties.us/searchlisting?citystate=MA | `/recherche?ville=boston` |
| https://www.akelius-properties.us/ | `/recherche?ville=washington` |
| https://akelius.fr/en/search/france/detail/6304_B31 | `/bien/101-rue-la-fayette-75010-paris-6304-b31` |
| https://akelius.fr/en/search/france/detail/6305_722 | `/bien/6-place-felix-eboue-75012-paris-6305-722` |
| https://akelius.fr/en/search/france/detail/6314_313 | `/bien/11-bis-rue-de-l-amiral-mouchez-75013-paris-6314-313` |
| https://akelius.fr/en/search/france/detail/6320_A34 | `/bien/61-rue-didot-75014-paris-6320-a34` |
| https://akelius.fr/en/search/france/detail/6354_053 | `/bien/3-rue-victor-hugo-92600-asnieres-sur-seine-6354-053` |
| https://akelius.fr/en/search/france/detail/6356_A41 | `/bien/17-rue-jessaint-75018-paris-6356-a41` |
| https://akelius.fr/en/search/france/detail/6359_A23 | `/bien/52-rue-eugene-carriere-75018-paris-6359-a23` |
| https://akelius.fr/en/search/france/detail/6368_A61 | `/bien/7-rue-de-la-montagne-sainte-genevieve-75005-paris-6368-a61` |
| https://akelius.fr/en/search/france/detail/6369_A42 | `/bien/18-rue-de-l-eglise-92200-neuilly-sur-seine-6369-a42` |
| https://akelius.fr/en/search/france/detail/6374_A22 | `/bien/30-rue-des-champs-92600-asnieres-sur-seine-6374-a22` |
| https://akelius.fr/en/search/france/detail/6378_A32 | `/bien/27-rue-jean-baptiste-clement-92100-boulogne-billancourt-6378-a32` |
| https://akelius.fr/en/search/france/detail/6380_A61 | `/bien/33-rue-lamarck-75018-paris-6380-a61` |

## limites connues / dette

- photos et fonds de carte servis par des cdn externes (unsplash, carto) :
  placeholders en attendant la photothèque officielle akelius
- les biens sont des données de démonstration — l'import du stock réel
  nécessite l'accès au site akelius.fr (bloqué depuis la sandbox de dev)
- liens externes non testables automatiquement depuis la sandbox (voir
  ci-dessus)
