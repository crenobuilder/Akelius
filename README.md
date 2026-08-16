# akelius — maquette de refonte

Prototype de refonte complète du site de location d'appartements d'Akelius,
dans l'esprit des portails immobiliers modernes (SeLoger, Barnes) :
recherche par ville / surface / budget, résultats liste + carte interactive,
pages de détail riches, et un espace pro pour créer et gérer des annonces.

> Maquette de démonstration non officielle, non affiliée à
> Akelius Residential Property AB. Photos : placeholders libres de droits
> (Unsplash), à remplacer par les photothèques officielles.

## Démarrer

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Parcours

| Route | Rôle |
| --- | --- |
| `/` | Home : hero + recherche (ville, m², budget, pièces), villes, biens à la une, services, bande pro |
| `/recherche?ville=paris&surface=40&budget=2000&pieces=2` | Résultats : liste + carte Leaflet avec pins prix, filtres, tri, bascule liste/carte en mobile |
| `/bien/[slug]` | Détail : galerie, caractéristiques, DPE, prestations, mini-carte, demande de visite, biens similaires |
| `/pro` | Back-office interne (accès footer uniquement, login employé) |
| `/pro/annonces` | Dashboard : statuts, publier/dépublier, supprimer |
| `/pro/annonces/nouvelle` | Création d'annonce en 5 étapes avec aperçu en direct |
| `/api/pdf/[slug]?lang=fr\|en\|es` | Fiche PDF A4 brandée du bien (générée serveur) |

Les annonces créées dans l'espace pro sont persistées en `localStorage`
(démo sans backend) et apparaissent immédiatement dans la recherche et sur
la carte une fois publiées.

## Fonctionnalités transverses

- **Langues** : FR / EN / ES, sélecteur dans le header, persisté en
  localStorage (`src/lib/i18n.tsx`, dictionnaires + composition des
  libellés dans `src/lib/compose.ts`)
- **Fiches PDF** : chaque page de détail propose le téléchargement d'une
  fiche A4 propre (@react-pdf/renderer, photos du CDN officiel embarquées,
  3 langues)
- **Back-office protégé** : lien uniquement dans le footer ; connexion
  réservée aux employés (démo : e-mail `@akelius.fr` + code
  `akelius2026` — SSO d'entreprise prévu en production)

## Stack

- **Next.js 15** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** avec design tokens maison (`src/app/globals.css`)
- **Leaflet / react-leaflet** + fonds de carte CARTO (OpenStreetMap)
- Police **Figtree** auto-hébergée (`@fontsource`)
- Données réelles : `src/data/real/akelius-paris.json` (16 annonces importées
  de akelius.fr — voir `docs/SCRAPE-NOTES.md`), mappées par `src/data/listings.ts`

## Design system

Les tokens (couleurs, typo, rayons, ombres) vivent dans `src/app/globals.css` :
`--color-brand` (bleu signature), `--color-ink`, `--color-sand`, etc.
L'identité reprend les codes d'Akelius — minimalisme scandinave, bas-de-casse,
bleu signature — en approximation : brancher les tokens officiels suffit à
aligner tout le site.

## Déploiement (staging → prod)

Voir [`docs/DEPLOY.md`](docs/DEPLOY.md) : la branche de travail sert de
staging via les déploiements *Preview* Vercel ; la production (`main`)
n'est touchée qu'après validation.

## Audit

`node scripts/audit.mjs` (serveur lancé au préalable) crawle tout le site
et génère [`docs/AUDIT.md`](docs/AUDIT.md) : statuts HTTP, liens internes
et externes, erreurs console, h1/titres, alt manquants.

## Feuille de route

Voir [`docs/PLAN.md`](docs/PLAN.md) : plan d'action produit, lots restants
(backend, auth pro, upload photos, i18n, SEO) et pistes de démo commerciale.
