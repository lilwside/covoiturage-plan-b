import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { EmptyState, Screen, Stack, Text, colors, spacing } from '@/design-system';
import {
  TripCard,
  TripCardSkeleton,
  TripFilters,
  applyFilters,
  dayKey,
  defaultFilters,
  formatLongDate,
  useUpcomingTrips,
  type Trip,
  type TripFiltersState,
} from '@/features/trips';

type ListItem = { type: 'header'; key: string; label: string } | { type: 'trip'; key: string; trip: Trip };

function groupByDay(trips: Trip[]): ListItem[] {
  const items: ListItem[] = [];
  let currentDay: string | null = null;
  for (const trip of trips) {
    const day = dayKey(trip.departure_at);
    if (day !== currentDay) {
      currentDay = day;
      items.push({ type: 'header', key: `day-${day}`, label: formatLongDate(trip.departure_at) });
    }
    items.push({ type: 'trip', key: trip.id, trip });
  }
  return items;
}

export default function TripsListScreen() {
  const router = useRouter();
  const { trips, loading, refreshing, error, reload, refresh } = useUpcomingTrips();
  const [filters, setFilters] = useState<TripFiltersState>(defaultFilters);

  const filtered = useMemo(() => applyFilters(trips, filters), [trips, filters]);
  const items = useMemo(() => groupByDay(filtered), [filtered]);
  const hasActiveFilters = filters.query.trim() !== '' || filters.onlyAvailable;

  const header = (
    <Stack gap="md" style={styles.header}>
      <Stack gap="xs">
        <Text variant="display">Où allez-vous ?</Text>
        <Text color="secondary">Trajets à venir proposés par la communauté.</Text>
      </Stack>
      <TripFilters filters={filters} onChange={setFilters} />
    </Stack>
  );

  if (loading) {
    return (
      <Screen padded>
        {header}
        <Stack gap="md">
          <TripCardSkeleton />
          <TripCardSkeleton />
          <TripCardSkeleton />
        </Stack>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen padded>
        {header}
        <EmptyState
          icon="cloud-offline-outline"
          tone="danger"
          title="Impossible de charger les trajets"
          description={error}
          actionLabel="Réessayer"
          onAction={reload}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={items}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={header}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          hasActiveFilters ? (
            <EmptyState
              icon="search-outline"
              title="Aucun trajet ne correspond"
              description="Essayez une autre ville ou retirez les filtres."
              actionLabel="Effacer les filtres"
              onAction={() => setFilters(defaultFilters)}
            />
          ) : (
            <EmptyState
              title="Aucun trajet pour le moment"
              description="Revenez plus tard ou tirez vers le bas pour actualiser."
            />
          )
        }
        renderItem={({ item }) =>
          item.type === 'header' ? (
            <View style={styles.dayHeader}>
              <Text variant="captionStrong" color="secondary" style={styles.dayLabel}>
                {item.label}
              </Text>
            </View>
          ) : (
            <View style={styles.cardWrapper}>
              <TripCard trip={item.trip} onPress={() => router.push({ pathname: '/trips/[id]', params: { id: item.trip.id } })} />
            </View>
          )
        }
        ListFooterComponent={
          filtered.length > 0 ? (
            <Text variant="caption" color="muted" align="center" style={styles.footer}>
              {filtered.length === 1 ? '1 trajet' : `${filtered.length} trajets`}
            </Text>
          ) : null
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.sm, paddingBottom: spacing.sm },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  dayHeader: { paddingTop: spacing.md, paddingBottom: spacing.sm },
  dayLabel: { textTransform: 'capitalize' },
  cardWrapper: { marginBottom: spacing.md },
  footer: { paddingTop: spacing.lg },
});
