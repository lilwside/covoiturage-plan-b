import { normalize } from './format';
import type { Trip } from './types';

export type TripFilters = {
  query: string;
  onlyAvailable: boolean;
};

export const defaultFilters: TripFilters = { query: '', onlyAvailable: false };

/**
 * Filtre côté client : recherche libre sur départ/arrivée
 * (accepte aussi la forme « Paris Lyon » ou « Paris → Lyon »), et places disponibles.
 */
export function applyFilters(trips: Trip[], filters: TripFilters): Trip[] {
  const terms = normalize(filters.query)
    .split(/[\s→>-]+/)
    .filter(Boolean);

  return trips.filter((trip) => {
    if (filters.onlyAvailable && trip.seats_available <= 0) return false;
    if (terms.length === 0) return true;

    const haystack = `${normalize(trip.origin_label)} ${normalize(trip.destination_label)}`;
    return terms.every((term) => haystack.includes(term));
  });
}
