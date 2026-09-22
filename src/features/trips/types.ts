/** Types alignés sur le schéma Supabase (tables trips, vehicles, vue driver_public_profiles). */

export type TripStatus = 'scheduled' | 'cancelled' | 'completed';

export type DriverPublicProfile = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  rating: number;
  trips_count: number;
};

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  color: string | null;
  seats: number;
};

export type TripRow = {
  id: string;
  driver_id: string;
  vehicle_id: string | null;
  origin_label: string;
  destination_label: string;
  departure_at: string;
  duration_minutes: number | null;
  seats_total: number;
  seats_available: number;
  price_cents: number;
  instant_booking: boolean;
  notes: string | null;
  status: TripStatus;
  vehicle: Vehicle | null;
};

/** Trajet enrichi du profil public du conducteur. */
export type Trip = TripRow & {
  driver: DriverPublicProfile | null;
};
