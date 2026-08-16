# plan d'action — refonte akelius

Objectif : démontrer une refonte du parcours de location Akelius au niveau
des meilleurs portails (SeLoger, Barnes), pour la présenter et la vendre.

## Lot 1 — socle & design system ✅

- Next.js 15 + TypeScript + Tailwind v4, Turbopack
- Tokens de marque centralisés (`globals.css`) : bleu signature, encre,
  sable, hairlines, bas-de-casse systématique
- Composants de base : header, footer, boutons, champs, chips, cartes

## Lot 2 — parcours locataire (seeker) ✅

- **Home** : hero plein écran + module de recherche (ville, surface min,
  budget max, pièces), chiffres clés, villes, biens à la une, services,
  bande espace pro
- **Résultats** : liste + carte Leaflet synchronisées (survol carte ⇄ carte
  ⇄ pin), pins prix, popups aperçu, filtres en barre + chips retirables,
  tri (pertinence, prix, surface, nouveautés), bascule liste/carte mobile
- **Détail** : galerie avec vignettes, grille de caractéristiques, DPE,
  prestations, mini-carte, panneau sticky « planifier une visite »,
  biens similaires

## Lot 3 — espace pro ✅ (démo)

- Landing pro (pitch + fonctionnement en 4 étapes)
- Dashboard « mes annonces » : compteurs, statuts, publier/dépublier,
  supprimer
- Création d'annonce en 5 étapes (localisation → caractéristiques →
  photos → loyer → aperçu) avec **aperçu en direct** de la carte annonce
- Persistance `localStorage` ; les annonces publiées remontent dans la
  recherche et sur la carte

## Lot 4 — à faire pour la vente / production

### démo commerciale
- [ ] Brancher les assets officiels : police propriétaire, couleurs exactes,
      photothèque des immeubles (un seul fichier de tokens à modifier)
- [ ] Importer le stock réel (scraping du flux public ou export interne)
- [ ] Déploiement Vercel + domaine de démo

### produit
- [ ] Backend : API REST/tRPC + PostgreSQL (annonces, médias, leads)
- [ ] Authentification espace pro (SSO d'entreprise)
- [ ] Upload direct des photos (S3 + redimensionnement)
- [ ] Géocodage automatique de l'adresse (pas de saisie lat/lng)
- [ ] Alertes e-mail « nouveaux biens » pour les seekers
- [ ] Dossier locataire en ligne (pièces justificatives, signature)
- [ ] i18n fr/en/de/sv, SEO (pages ville statiques, données structurées
      schema.org/Apartment), analytics
- [ ] Accessibilité AA et budget performance (LCP < 2 s)

## architecture cible (esquisse)

```
next.js (front + SSR/ISR)
   │
   ├── api gateway (tRPC/REST)
   │      ├── service annonces (PostgreSQL + PostGIS)
   │      ├── service médias (S3 + CDN)
   │      └── service leads/visites (CRM)
   └── auth (SSO entreprise, rôles seeker/pro/admin)
```
