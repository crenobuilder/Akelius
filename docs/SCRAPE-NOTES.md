# Notes de scraping — akelius.fr

**Date de tentative :** 2026-08-16 (~17h35 UTC)
**Objectif :** importer les annonces Paris réelles depuis https://akelius.fr/en/search/france/apartment/paris, la liste des villes depuis https://akelius.fr/en, et le logo officiel.

## Résultat : échec — accès réseau bloqué

Malgré l'autorisation annoncée du domaine `akelius.fr` dans la politique réseau de l'environnement, toutes les tentatives d'accès ont été refusées par le proxy d'egress.

### Détails des échecs

1. **curl via le proxy d'agent** (`HTTPS_PROXY=http://127.0.0.1:40499`) :
   - `https://akelius.fr/en` → `curl: (56) CONNECT tunnel failed, response 403` (code HTTP rapporté : `000`)
   - Mêmes erreurs pour `www.akelius.fr`, `akelius.com`, `www.akelius.com`.

2. **Statut du proxy** (`$HTTPS_PROXY/__agentproxy/status`) — échec relayé enregistré :

   ```json
   {
     "ts": "2026-08-16T17:33:27.813Z",
     "kind": "connect_rejected",
     "detail": "gateway answered 403 to CONNECT (policy denial or upstream failure)",
     "host": "akelius.fr:443"
   }
   ```

   Le refus vient donc du **gateway amont** (déni de politique), pas du proxy local ni d'un problème TLS.

3. **Outil WebFetch** (chemin réseau distinct du proxy shell) :

   ```json
   {
     "error_type": "EGRESS_BLOCKED",
     "domain": "akelius.fr",
     "message": "Access to akelius.fr is blocked by the network egress proxy."
   }
   ```

## Conclusion

L'autorisation du domaine `akelius.fr` n'était pas (encore) effective côté gateway au moment de la tentative — possiblement un délai de propagation de la politique réseau, ou une autorisation appliquée à un autre périmètre. Aucune donnée n'a pu être récupérée ; **aucune donnée n'a été inventée** : les fichiers `src/data/real/akelius-paris.json` et `src/data/real/akelius-cities.json` n'ont pas été créés.

## À refaire une fois l'accès effectif

1. Vérifier : `curl -sSL -o /dev/null -w "%{http_code}" https://akelius.fr/en` (attendu : `200`).
2. Récupérer la page de recherche Paris, extraire le JSON embarqué (`__NEXT_DATA__` ou équivalent) ou intercepter les réponses API via Playwright (chromium préinstallé : `executablePath: '/opt/pw-browsers/chromium'`).
3. Produire `src/data/real/akelius-paris.json`, `src/data/real/akelius-cities.json`, éventuellement `public/akelius-logo.svg`, puis mettre à jour ce fichier.
