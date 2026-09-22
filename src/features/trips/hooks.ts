import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchTripById, fetchUpcomingTrips } from './api';
import type { Trip } from './types';

type AsyncState<T> = {
  data: T;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
};

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'Une erreur inattendue est survenue.';
}

export function useUpcomingTrips() {
  const [state, setState] = useState<AsyncState<Trip[]>>({
    data: [],
    loading: true,
    refreshing: false,
    error: null,
  });
  const requestId = useRef(0);

  const load = useCallback(async (mode: 'initial' | 'refresh') => {
    const id = ++requestId.current;
    setState((s) => ({ ...s, loading: mode === 'initial', refreshing: mode === 'refresh', error: null }));
    try {
      const trips = await fetchUpcomingTrips();
      if (id !== requestId.current) return;
      setState({ data: trips, loading: false, refreshing: false, error: null });
    } catch (err) {
      if (id !== requestId.current) return;
      setState((s) => ({ ...s, loading: false, refreshing: false, error: errorMessage(err) }));
    }
  }, []);

  useEffect(() => {
    void load('initial');
  }, [load]);

  return {
    trips: state.data,
    loading: state.loading,
    refreshing: state.refreshing,
    error: state.error,
    reload: () => load('initial'),
    refresh: () => load('refresh'),
  };
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
