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
  index.tsx               US1 — liste des trajets
  trips/[id].tsx          US1 — détail d'un trajet
src/
  lib/supabase.ts         client Supabase
  design-system/          tokens.ts + components/ (Text, Card, Badge, Avatar, Button, Chip, …)
  features/trips/         types, api (lecture Supabase), hooks, formatage, filtres, composants
```

## User stories

| US  | Titre                  | État        |
| --- | ---------------------- | ----------- |
| US1 | Consulter les trajets  | ✅ livrée   |
| US2 | —                      | à venir     |

### US1 — Consulter les trajets

- Liste des trajets `scheduled` à venir, groupés par jour, triés par heure de départ.
- Recherche libre départ/arrivée (insensible aux accents, « Paris Lyon » fonctionne), filtre « Places disponibles ».
- Pull-to-refresh, états chargement / vide / erreur avec « Réessayer ».
- Détail : itinéraire, horaires, durée et arrivée estimée, prix, places, mode de réservation, conducteur (note, expérience), véhicule, infos du conducteur.

## Base de données (Supabase)

Migration `us1_public_read_trips` :

- policy `trips_select_anon` : lecture des trajets `scheduled` par le rôle `anon` (aucune connexion requise pour consulter) ;
- policy `vehicles_select_anon` : lecture des véhicules ;
- vue `driver_public_profiles` (id, nom, avatar, note, nb de trajets) pour exposer le conducteur **sans** téléphone ni bio.

## Scripts

```bash
npm run typecheck   # tsc --noEmit
```
