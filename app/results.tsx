import { Stack as RouterStack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { EmptyState, Screen, Stack, Text, colors, spacing } from '@/design-system';
import {
  TripCard,
  TripCardSkeleton,
  dayKey,
  describeSearch,
  formatLongDate,
  fromRouteParams,
  useTripSearch,
  type Trip,
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

export default function ResultsScreen() {
  const router = useRouter();
  const raw = useLocalSearchParams<{ from?: string; to?: string; date?: string }>();
  const params = useMemo(() => fromRouteParams(raw), [raw.from, raw.to, raw.date]);
  const { trips, loading, refreshing, error, reload, refresh } = useTripSearch(params);
  const items = useMemo(() => groupByDay(trips), [trips]);

  const summary = (
    <Stack gap="xs" style={styles.summary}>
      <Text variant="heading">{describeSearch(params)}</Text>
      {!loading && !error ? (
        <Text variant="caption" color="secondary">
          {trips.length === 0 ? 'Aucun résultat' : trips.length === 1 ? '1 trajet trouvé' : `${trips.length} trajets trouvés`}
        </Text>
      ) : null}
    </Stack>
  );

  if (loading) {
    return (
      <Screen padded>
        {summary}
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
        {summary}
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
      <RouterStack.Screen options={{ title: 'Résultats' }} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.list}
        ListHeaderComponent={summary}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="Aucun trajet ne correspond à votre recherche"
            description="Essayez une autre date, une ville voisine ou laissez un champ vide pour élargir la recherche."
            actionLabel="Modifier la recherche"
            onAction={() => router.back()}
          />
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
              <TripCard
                trip={item.trip}
                onPress={() => router.push({ pathname: '/trips/[id]', params: { id: item.trip.id } })}
              />
            </View>
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { paddingTop: spacing.sm, paddingBottom: spacing.sm },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  dayHeader: { paddingTop: spacing.md, paddingBottom: spacing.sm },
  dayLabel: { textTransform: 'capitalize' },
  cardWrapper: { marginBottom: spacing.md },
});
