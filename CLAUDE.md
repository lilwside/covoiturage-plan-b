# Covoiturage Plan B — guide pour Claude

## Stack et conventions

- Expo SDK 57, expo-router (routes dans `app/`), TypeScript strict, alias `@/` → `src/`.
- Supabase (`@supabase/supabase-js`), projet « Blablacar Maroi » (`yqpqabeftvdnavfesmyr`).
  Variables dans `.env` : `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Design system maison dans `src/design-system/` : tokens (`tokens.ts`) + composants.
  Toujours passer par les tokens (couleurs, espacements, typo), jamais de valeurs en dur dans les écrans.
- Code métier par feature dans `src/features/<feature>/` (types, api, hooks, format, components).
- Langue de l'interface : français. Formatage dates/prix en `fr-FR` via `Intl`.
- Charte : primaire `#0071EB` (`colors.primary`), erreur `#C11417` (`colors.danger`).
  Boutons d'action principaux en forme pill (`Button` par défaut).
- Vérifications avant push : `npm run typecheck` et `npx expo export --platform android`.
- Testable sur Expo Go : ne pas ajouter de module natif hors SDK Expo.

## Base Supabase (schéma existant)

Tables : `profiles`, `vehicles`, `trips`, `bookings`, `plan_b_suggestions`, `notifications`, `avis`, `messages`.
Vue `driver_public_profiles` (id, full_name, avatar_url, rating, trips_count) : profil conducteur sans données privées.
Lecture anonyme autorisée sur `trips` (status = scheduled) et `vehicles` (migration `us1_public_read_trips`).

## User stories (à développer une par une, dans l'ordre)

Règle : une seule story à la fois, développée entièrement (écrans, navigation,
données Supabase si besoin), testable sur Expo Go. Ne jamais commencer la story
suivante sans instruction explicite.

### US1 — Consulter les trajets ✅
En tant que Thomas (passager), je veux rechercher un trajet par ville de départ,
ville d'arrivée et date, afin de voir les trajets disponibles.
Critères d'acceptation :
- Écran Rechercher avec 3 champs (départ, arrivée, date) et un bouton pill « Rechercher »
- La liste affiche pour chaque trajet : heure de départ, villes, prix, avatar + prénom du conducteur, places restantes
- Message clair si aucun trajet ne correspond
- Données lues depuis Supabase (table trips)

### US2 — Réserver une place
En tant que Thomas, je veux ouvrir un trajet et réserver une place, afin de
voyager à petit prix.
Critères d'acceptation :
- Écran détail : itinéraire, horaires, prix, conducteur, places restantes
- Bouton « Réserver » (bleu #0071EB) → confirmation avec message rassurant
- La réservation est enregistrée dans Supabase (table bookings) liée à l'utilisateur connecté
- Le nombre de places restantes diminue

### US3 — Retrouver mes réservations
En tant que Thomas, je veux voir mes réservations dans « Mes trajets », afin de
retrouver mes prochains voyages.
Critères d'acceptation :
- Onglet Mes trajets : liste des réservations à venir, triées par date
- Chaque carte affiche statut (confirmé / annulé), villes, date, heure, prix
- État vide avec message chaleureux si aucune réservation

### US4 — Publier un trajet
En tant que Sarah (conductrice), je veux publier un trajet Nantes–Paris, afin de
partager mes frais.
Critères d'acceptation :
- Onglet Publier : formulaire départ, arrivée, date, heure, prix, nombre de places
- Validation des champs obligatoires avec messages d'erreur en #C11417
- Le trajet apparaît immédiatement dans la recherche (US1) et dans Mes trajets côté conducteur
- Sarah peut annuler un trajet qu'elle a publié

### US5 — Plan B (fonctionnalité supplémentaire)
En tant que Thomas, quand mon conducteur annule, je veux recevoir automatiquement
des alternatives, afin de ne pas rester bloqué.
Critères d'acceptation :
- Quand Sarah annule (US4), la réservation de Thomas passe en statut « annulé »
- Un écran Plan B s'ouvre depuis Mes trajets : message empathique + liste de 1 à 3 trajets alternatifs (même départ/arrivée, même jour ou lendemain, triés par heure la plus proche)
- Bouton « Réserver ce trajet » en un tap → nouvelle réservation confirmée
- Si aucune alternative : message rassurant + bouton vers la recherche
- Le parcours complet doit être démontrable : recherche → réservation → annulation → Plan B → nouvelle réservation
