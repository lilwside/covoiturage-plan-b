import { supabase } from '@/lib/supabase';
import type { DriverPublicProfile, Trip, TripRow } from './types';

const TRIP_COLUMNS = `
  id, driver_id, vehicle_id,
  origin_label, destination_label, departure_at, duration_minutes,
  seats_total, seats_available, price_cents, instant_booking, notes, status,
  vehicle:vehicles ( id, brand, model, color, seats )
`;

export class TripsApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TripsApiError';
  }
}

async function fetchDriverProfiles(driverIds: string[]): Promise<Map<string, DriverPublicProfile>> {
  const unique = Array.from(new Set(driverIds));
  if (unique.length === 0) return new Map();

  const { data, error } = await supabase
    .from('driver_public_profiles')
    .select('id, full_name, avatar_url, rating, trips_count')
    .in('id', unique);

  if (error) throw new TripsApiError(error.message);

  const map = new Map<string, DriverPublicProfile>();
  for (const row of data ?? []) {
    map.set(row.id, { ...row, rating: Number(row.rating) });
  }
  return map;
}

async function attachDrivers(rows: TripRow[]): Promise<Trip[]> {
  const drivers = await fetchDriverProfiles(rows.map((r) => r.driver_id));
  return rows.map((row) => ({ ...row, driver: drivers.get(row.driver_id) ?? null }));
}

/**
 * Liste des trajets planifiés à venir, triés par date de départ.
 * La lecture anonyme est autorisée par la policy RLS `trips_select_anon`.
 */
export async function fetchUpcomingTrips(): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select(TRIP_COLUMNS)
    .eq('status', 'scheduled')
    .gte('departure_at', new Date().toISOString())
    .order('departure_at', { ascending: true });

  if (error) throw new TripsApiError(error.message);
  return attachDrivers((data ?? []) as unknown as TripRow[]);
}

/** Détail d'un trajet. Renvoie `null` s'il est introuvable (ou non visible). */
export async function fetchTripById(id: string): Promise<Trip | null> {
  const { data, error } = await supabase.from('trips').select(TRIP_COLUMNS).eq('id', id).maybeSingle();

  if (error) throw new TripsApiError(error.message);
  if (!data) return null;

  const [trip] = await attachDrivers([data as unknown as TripRow]);
  return trip ?? null;
}
