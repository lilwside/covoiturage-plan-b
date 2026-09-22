# Covoiturage Plan B

Application mobile de covoiturage (Expo / React Native / TypeScript) adossée à Supabase.

## Stack

- **Expo SDK 57** + **expo-router** (navigation par fichiers dans `app/`)
- **TypeScript** strict, alias `@/` → `src/`
- **Supabase** (`@supabase/supabase-js`) — projet « Blablacar Maroi »
- Design system maison dans `src/design-system/` (tokens + composants)

## Démarrer (Expo Go)

```bash
npm install
npm start
```

Scanner le QR code avec Expo Go (Android) ou l'appareil photo (iOS).
Si le téléphone n'est pas sur le même réseau : `npx expo start --tunnel`.

Le fichier `.env` fournit `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_ANON_KEY`
(clé *publishable*, prévue pour être embarquée côté client et protégée par RLS).

## Structure

```
app/                      routes expo-router
  _layout.tsx             stack de navigation
  index.tsx               US1 — écran Rechercher (départ, arrivée, date)
  results.tsx             US1 — résultats de recherche
  trips/[id].tsx          détail d'un trajet (lecture seule, base de l'US2)
src/
  lib/supabase.ts         client Supabase
  design-system/          tokens.ts + components/ (Text, Card, Badge, Avatar, Button, TextField, DateField, …)
  features/trips/         types, api (recherche Supabase), hooks, formatage, paramètres de recherche, composants
```

## User stories

| US  | Titre                  | État        |
| --- | ---------------------- | ----------- |
| US1 | Consulter les trajets  | ✅ livrée   |
| US2 | Réserver une place     | à venir     |
| US3 | Retrouver mes réservations | à venir |
| US4 | Publier un trajet      | à venir     |
| US5 | Plan B                 | à venir     |

### US1 — Consulter les trajets

- Écran Rechercher : champs Départ, Arrivée (texte) et Date (sélecteur natif, optionnel), bouton pill « Rechercher », inversion départ/arrivée.
- Résultats lus dans la table `trips` avec filtres côté Supabase (`ilike` sur les villes, bornes du jour choisi), groupés par jour et triés par heure.
- Chaque carte : heure de départ, villes, prix, avatar + prénom du conducteur (et note), places restantes.
- Message clair si aucun trajet ne correspond, avec retour à la recherche. Pull-to-refresh, états chargement / erreur avec « Réessayer ».

## Base de données (Supabase)

Migration `us1_public_read_trips` :

- policy `trips_select_anon` : lecture des trajets `scheduled` par le rôle `anon` (aucune connexion requise pour consulter) ;
- policy `vehicles_select_anon` : lecture des véhicules ;
- vue `driver_public_profiles` (id, nom, avatar, note, nb de trajets) pour exposer le conducteur **sans** téléphone ni bio.

## Scripts

```bash
npm run typecheck   # tsc --noEmit
```
