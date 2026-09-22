/** Paramètres de recherche (US1) et leur sérialisation dans l'URL de la route résultats. */

export type TripSearchParams = {
  from: string;
  to: string;
  /** Jour au format YYYY-MM-DD (heure locale), ou null pour toutes les dates. */
  date: string | null;
};

export const emptySearch: TripSearchParams = { from: '', to: '', date: null };

export function toDayString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromDayString(day: string | null | undefined): Date | null {
  if (!day) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Bornes [début, fin) du jour local, en ISO UTC pour Supabase. */
export function dayBounds(day: string): { start: string; end: string } | null {
  const start = fromDayString(day);
  if (!start) return null;
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

export function toRouteParams(params: TripSearchParams): Record<string, string> {
  const out: Record<string, string> = {};
  if (params.from.trim()) out.from = params.from.trim();
  if (params.to.trim()) out.to = params.to.trim();
  if (params.date) out.date = params.date;
  return out;
}

export function fromRouteParams(raw: Record<string, string | string[] | undefined>): TripSearchParams {
  const pick = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] ?? '' : v ?? '');
  const date = pick(raw.date);
  return { from: pick(raw.from), to: pick(raw.to), date: fromDayString(date) ? date : null };
}

/** Résumé lisible d'une recherche, ex. « Paris → Lyon · jeudi 25 septembre ». */
export function describeSearch(params: TripSearchParams): string {
  const route =
    params.from.trim() || params.to.trim()
      ? `${params.from.trim() || 'Partout'} → ${params.to.trim() || 'Partout'}`
      : 'Tous les trajets';
  const date = fromDayString(params.date);
  if (!date) return route;
  const label = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
  return `${route} · ${label}`;
}
