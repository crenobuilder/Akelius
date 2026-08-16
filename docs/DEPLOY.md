# déploiement — staging puis production (vercel)

Stratégie : la branche `claude/akelius-site-redesign-s4rajd` sert de
**staging** — chaque push y déclenche un déploiement *Preview* Vercel avec
une URL stable. Rien ne part en production tant que la branche n'est pas
fusionnée dans `main`.

## 1. connecter le repo (une fois, ~2 minutes)

1. [vercel.com/new](https://vercel.com/new) → **Import Git Repository** →
   choisir `crenobuilder/Akelius`
2. Framework détecté automatiquement (Next.js) — ne rien changer, pas de
   variable d'environnement nécessaire
3. **Deploy**

## 2. staging

- Vercel déploie automatiquement **chaque branche** en *Preview*.
- URL stable de la branche staging :
  `akelius-git-claude-akelius-site-redesign-s4rajd-<votre-team>.vercel.app`
  (visible dans l'onglet *Deployments*, badge « Preview »)
- Chaque nouveau push sur la branche met à jour cette URL — c'est là qu'on
  itère et qu'on valide.

## 3. production (plus tard, quand la démo est validée)

- Dans *Settings → Git*, la **Production Branch** est `main` (défaut).
- Promouvoir = ouvrir une PR `claude/akelius-site-redesign-s4rajd → main`
  et fusionner. Vercel déploie alors l'URL de production
  (`akelius-<team>.vercel.app` ou votre domaine).
- Tant qu'on ne fusionne pas, la production n'est jamais touchée.

## alternative cli

```bash
npm i -g vercel
vercel          # déploiement preview (staging)
vercel --prod   # production — uniquement après validation
```

> Note : le déploiement nécessite d'être connecté à votre compte Vercel
> (`vercel login`, ou un token `VERCEL_TOKEN` fourni à l'environnement).
