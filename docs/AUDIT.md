# audit du site — 2026-08-16

Généré par `scripts/audit.mjs` (crawler Playwright sur http://localhost:3000).

## synthèse

- pages internes crawlées : **33**
- pages en erreur (≠ 200) : **0**
- pages avec erreurs JS console : **0**
- liens externes détectés : **7** (non vérifiables depuis la
  sandbox — voir section dédiée)

## pages internes

| page | statut | titre | h1 | img sans alt | champs sans label | erreurs js |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 200 | akelius — a better way to live | a better way to live | 0 | 0 | 0 |
| `/recherche?ville=paris` | 200 | recherche — akelius | 16 logements à louer à paris | 0 | 0 | 0 |
| `/recherche?ville=londres` | 200 | recherche — akelius | 4 logements à louer à londres | 0 | 0 | 0 |
| `/recherche?ville=montreal` | 200 | recherche — akelius | 4 logements à louer à montréal | 0 | 0 | 0 |
| `/bien/paris-15-rue-de-vaugirard-3p` | 200 | 3 pièces lumineux face au square Adolphe-Chérioux — akelius | 3 pièces lumineux face au square Adolphe-Chérioux | 0 | 0 | 0 |
| `/pro` | 200 | espace pro — akelius | publiez vos biens, gérez vos locations | 0 | 0 | 0 |
| `/pro/annonces` | 200 | mes annonces — akelius pro | mes annonces | 0 | 0 | 0 |
| `/pro/annonces/nouvelle` | 200 | nouvelle annonce — akelius pro | nouvelle annonce | 0 | 0 | 0 |
| `/bien/paris-16-rue-de-passy-2p` | 200 | 2 pièces rénové au cœur de Passy — akelius | 2 pièces rénové au cœur de Passy | 0 | 0 | 0 |
| `/bien/paris-17-batignolles-4p` | 200 | 4 pièces familial aux Batignolles — akelius | 4 pièces familial aux Batignolles | 0 | 0 | 0 |
| `/bien/paris-10-quai-de-valmy-3p` | 200 | 3 pièces face au canal Saint-Martin — akelius | 3 pièces face au canal Saint-Martin | 0 | 0 | 0 |
| `/recherche` | 200 | recherche — akelius | 24 logements à louer | 0 | 0 | 0 |
| `/bien/paris-3-bretagne-3p` | 200 | 3 pièces contemporain rue de Bretagne — akelius | 3 pièces contemporain rue de Bretagne | 0 | 0 | 0 |
| `/bien/paris-18-caulaincourt-studio` | 200 | studio de charme sur les hauteurs de Montmartre — akelius | studio de charme sur les hauteurs de Montmartre | 0 | 0 | 0 |
| `/bien/paris-4-archives-2p` | 200 | 2 pièces de caractère au cœur du Marais — akelius | 2 pièces de caractère au cœur du Marais | 0 | 0 | 0 |
| `/bien/paris-11-oberkampf-2p` | 200 | 2 pièces esprit loft rue Oberkampf — akelius | 2 pièces esprit loft rue Oberkampf | 0 | 0 | 0 |
| `/bien/paris-9-martyrs-2p` | 200 | 2 pièces au pied des commerces des Martyrs — akelius | 2 pièces au pied des commerces des Martyrs | 0 | 0 | 0 |
| `/bien/paris-6-rennes-3p` | 200 | 3 pièces élégant entre Rennes et Saint-Germain — akelius | 3 pièces élégant entre Rennes et Saint-Germain | 0 | 0 | 0 |
| `/bien/paris-5-mouffetard-studio` | 200 | studio rénové quartier Mouffetard — akelius | studio rénové quartier Mouffetard | 0 | 0 | 0 |
| `/bien/paris-20-gambetta-2p` | 200 | 2 pièces au calme près de Gambetta — akelius | 2 pièces au calme près de Gambetta | 0 | 0 | 0 |
| `/bien/paris-14-daguerre-3p` | 200 | 3 pièces familial rue Daguerre — akelius | 3 pièces familial rue Daguerre | 0 | 0 | 0 |
| `/bien/paris-13-butte-aux-cailles-2p` | 200 | 2 pièces esprit village à la Butte-aux-Cailles — akelius | 2 pièces esprit village à la Butte-aux-Cailles | 0 | 0 | 0 |
| `/bien/paris-12-faubourg-saint-antoine-4p` | 200 | 4 pièces en duplex, cour d’artisans — akelius | 4 pièces en duplex, cour d’artisans | 0 | 0 | 0 |
| `/bien/paris-7-cler-3p` | 200 | 3 pièces de prestige rue Cler — akelius | 3 pièces de prestige rue Cler | 0 | 0 | 0 |
| `/bien/londres-notting-hill-2p` | 200 | 2 pièces victorien à Notting Hill — akelius | 2 pièces victorien à Notting Hill | 0 | 0 | 0 |
| `/bien/londres-camden-studio` | 200 | studio contemporain à Camden — akelius | studio contemporain à Camden | 0 | 0 | 0 |
| `/bien/londres-kensington-3p` | 200 | 3 pièces classique à South Kensington — akelius | 3 pièces classique à South Kensington | 0 | 0 | 0 |
| `/bien/londres-islington-2p` | 200 | 2 pièces au vert à Islington — akelius | 2 pièces au vert à Islington | 0 | 0 | 0 |
| `/bien/montreal-plateau-4-et-demi` | 200 | 4 ½ ensoleillé sur le Plateau — akelius | 4 ½ ensoleillé sur le Plateau | 0 | 0 | 0 |
| `/bien/montreal-griffintown-3-et-demi` | 200 | 3 ½ neuf à Griffintown — akelius | 3 ½ neuf à Griffintown | 0 | 0 | 0 |
| `/bien/montreal-ville-marie-3-et-demi` | 200 | 3 ½ avec vue au centre-ville — akelius | 3 ½ avec vue au centre-ville | 0 | 0 | 0 |
| `/bien/montreal-mile-end-5-et-demi` | 200 | 5 ½ créatif dans le Mile End — akelius | 5 ½ créatif dans le Mile End | 0 | 0 | 0 |
| `/bien/paris-quartier-annonce` | 200 | annonce — akelius | bien introuvable | 0 | 0 | 0 |

## liens externes (footer « sites officiels », etc.)

Le proxy réseau de l'environnement de développement bloque les domaines
externes : ces liens sont donc **à vérifier depuis un navigateur normal**
(ouvrir chaque lien une fois la démo déployée sur vercel).

| lien | présent sur |
| --- | --- |
| https://akelius.fr/en | footer — toutes les pages (33) |
| https://akelius.fr/en/search/france/apartment/paris | footer — toutes les pages (33) |
| https://www.akelius.com/en/akelius | footer — toutes les pages (33) |
| https://www.akelius.fr/en/akelius/about | footer — toutes les pages (33) |
| https://akelius.fr/en/contact/paris | footer — toutes les pages (33) |
| https://www.residential-akelius.co.uk/ | footer — toutes les pages (33) |
| https://www.akelius.fr/mentions-legales | footer — toutes les pages (33) |

## limites connues / dette

- photos et fonds de carte servis par des cdn externes (unsplash, carto) :
  placeholders en attendant la photothèque officielle akelius
- les biens sont des données de démonstration — l'import du stock réel
  nécessite l'accès au site akelius.fr (bloqué depuis la sandbox de dev)
- liens externes non testables automatiquement depuis la sandbox (voir
  ci-dessus)
