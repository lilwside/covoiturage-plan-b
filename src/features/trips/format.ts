/** Helpers de formatage (locale française). */

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPrice(cents: number): string {
  return priceFormatter.format(cents / 100);
}

export function formatDuration(minutes: number | null): string | null {
  if (minutes == null || minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${String(m).padStart(2, '0')}`;
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}

/** Ex. « jeu. 25 sept. » */
export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(iso));
}

/** Ex. « jeudi 25 septembre 2026 » */
export function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(iso),
  );
}

/** Heure d'arrivée estimée si la durée est connue. */
export function estimateArrival(departureIso: string, durationMinutes: number | null): string | null {
  if (durationMinutes == null || durationMinutes <= 0) return null;
  const arrival = new Date(new Date(departureIso).getTime() + durationMinutes * 60_000);
  return formatTime(arrival.toISOString());
}

export function formatSeats(available: number): string {
  if (available <= 0) return 'Complet';
  return available === 1 ? '1 place' : `${available} places`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1).replace('.', ',');
}

/** Clé de regroupement par jour (YYYY-MM-DD en heure locale). */
export function dayKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Normalise une chaîne pour la recherche (minuscule, sans accents). */
export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/** Prénom à partir du nom complet (« Sarah Demo » → « Sarah »). */
export function firstName(fullName: string | null | undefined): string {
  const first = (fullName ?? '').trim().split(/\s+/)[0];
  return first || 'Conducteur';
}
