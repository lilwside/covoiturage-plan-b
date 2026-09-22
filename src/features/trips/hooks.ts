import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchTripById, searchTrips } from './api';
import type { TripSearchParams } from './search';
import type { Trip } from './types';

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'Une erreur inattendue est survenue.';
}

export function useTripSearch(params: TripSearchParams) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  // Clé stable pour ne relancer la requête que si les paramètres changent réellement.
  const key = `${params.from}|${params.to}|${params.date ?? ''}`;

  const load = useCallback(
    async (mode: 'initial' | 'refresh') => {
      const id = ++requestId.current;
      if (mode === 'initial') setLoading(true);
      else setRefreshing(true);
      setError(null);
      try {
        const result = await searchTrips(params);
        if (id !== requestId.current) return;
        setTrips(result);
      } catch (err) {
        if (id !== requestId.current) return;
        setError(errorMessage(err));
      } finally {
        if (id === requestId.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  useEffect(() => {
    void load('initial');
  }, [load]);

  return { trips, loading, refreshing, error, reload: () => load('initial'), refresh: () => load('refresh') };
}

export function useTrip(id: string | undefined) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      setLoading(false);
      setError('Identifiant de trajet manquant.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setTrip(await fetchTripById(id));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return { trip, loading, error, reload: load };
}
