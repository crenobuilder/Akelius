# Notes de scraping — akelius.fr

**Dernière exécution : 2026-08-16 (~18h10 UTC) — réussie.**
(Une première tentative le même jour avait échoué : domaine bloqué par la politique réseau de l'environnement, gateway répondant 403 au CONNECT. Résolu en passant l'environnement « luxe » en accès réseau « Full ».)

## Ce qui a été récupéré

| Fichier | Contenu |
|---|---|
| `src/data/real/akelius-paris.json` | **16 annonces** réellement en ligne (12 à Paris intra-muros, 4 en proche banlieue : Asnières-sur-Seine, Boulogne-Billancourt ×2, Neuilly-sur-Seine) |
| `src/data/real/akelius-cities.json` | **9 villes / 4 pays** du sélecteur de la page d'accueil + `logoUrl` |
| `public/akelius-logo.svg` | Logo officiel (SVG, 9,2 Ko) depuis `https://akelius.fr/assets/img/akelius_logo.svg` |

## Endpoints et structures découverts

Le site est une SPA **Angular Universal** : les réponses API sont embarquées dans le HTML SSR via `<script id="akeliusWebsite-state" type="application/json">` (transfer state), ce qui a permis de tout récupérer en curl, sans navigateur.

- **Liste des annonces** : `https://akelius.fr/lettings/marketing/v2/FR/published-adverts.json` — tableau d'annonces avec `address` (lat/lng, borough, postalCode), `keyfacts` (base-rent, operational-costs, total-rent, unit-size, number-of-rooms/bedrooms, floor…), `imageUrls`, `teaserImageUrl`.
- **Détail d'une annonce** : `https://akelius.fr/lettings/marketing/v2/FR/{id}.json` (ex. `6301_A12.json`) — ~49 keyfacts : additional-rent, deposit, construction-year, DPE (`energy-certificate-class`), équipements booléens (`has-builtin-kitchen`, `has-elevator`, `has-balcony`…), station de métro (`name-of-station`), `notice-period`, frais d'agence, photos en 400/600/2400 px + plans (`isFloorplan`).
- **Page de détail canonique** (route Angular trouvée dans le bundle) : `https://akelius.fr/en/search/france/detail/{id}`.
- **Villes** : `https://akelius.fr/files/v2/cities/cities.json` — 9 villes (Paris, London, Montréal, Ottawa, Quebec City, Toronto, Boston, New York, Washington DC) avec leurs URLs de recherche (rent.akelius.com pour FR/UK/CA, akelius-properties.us pour les USA).
- **Navigation/shell** : `https://akelius.fr/files/v2/website/shell.json`.
- **Photos** : servies par `ak-let-api-gateway-production.azure-api.net/api/media/marketing/{uuid}/download/{400|600|2400}` (URLs 600 px retenues dans le JSON).

## Choix de mapping

- `price` = `total-rent` (loyer mensuel total affiché par le site) ; `baseRent` = `base-rent` ; `charges` = `operational-costs` + `additional-rent` (vérifié : base + charges = total pour les 16 annonces).
- `title` et `description` sont **composés à partir des champs factuels** du site (pièces, adresse, étage, équipements, station, DPE) — le site ne publie ni titre ni texte marketing par annonce.
- `district` = champ `borough` (arrondissement à Paris, quartier en banlieue).

## Ce qui manque (absent du site)

- **Meublé/non meublé** : aucun champ correspondant dans les keyfacts → `furnished: null`.
- **Date de disponibilité** : seul `is-available-from-now-on: true` existe (toutes les annonces) → `availableNow: true`, `availableFrom: null`.
- Textes de description rédigés par annonce : inexistants côté site.
