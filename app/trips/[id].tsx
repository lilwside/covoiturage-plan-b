import { Ionicons } from '@expo/vector-icons';
import { Stack as RouterStack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Badge, Card, Divider, EmptyState, Row, Screen, Skeleton, Stack, Text, colors, spacing } from '@/design-system';
import {
  estimateArrival,
  formatDuration,
  formatLongDate,
  formatPrice,
  formatRating,
  formatSeats,
  formatTime,
  useTrip,
  type Trip,
} from '@/features/trips';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trip, loading, error, reload } = useTrip(id);
  const router = useRouter();

  if (loading) {
    return (
      <Screen padded>
        <Stack gap="md" style={styles.content}>
          <Skeleton width="60%" height={26} />
          <Skeleton width="40%" height={16} />
          <Skeleton height={140} />
          <Skeleton height={90} />
        </Stack>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen padded>
        <EmptyState
          icon="cloud-offline-outline"
          tone="danger"
          title="Impossible de charger ce trajet"
          description={error}
          actionLabel="Réessayer"
          onAction={reload}
        />
      </Screen>
    );
  }

  if (!trip) {
    return (
      <Screen padded>
        <EmptyState
          icon="help-circle-outline"
          title="Trajet introuvable"
          description="Il a peut-être été annulé ou n'est plus proposé."
          actionLabel="Retour aux trajets"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <RouterStack.Screen options={{ title: `${trip.origin_label} → ${trip.destination_label}` }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Stack gap="lg">
          <Stack gap="xs">
            <Text variant="caption" color="secondary" style={styles.capitalize}>
              {formatLongDate(trip.departure_at)}
            </Text>
            <Text variant="title">
              {trip.origin_label} → {trip.destination_label}
            </Text>
          </Stack>

          <RouteCard trip={trip} />
          <PriceCard trip={trip} />
          <DriverCard trip={trip} />
          {trip.vehicle ? <VehicleCard trip={trip} /> : null}
          {trip.notes ? <NotesCard notes={trip.notes} /> : null}
        </Stack>
      </ScrollView>
    </Screen>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text variant="captionStrong" color="muted" style={styles.sectionTitle}>
      {children}
    </Text>
  );
}

function RouteCard({ trip }: { trip: Trip }) {
  const arrival = estimateArrival(trip.departure_at, trip.duration_minutes);
  const duration = formatDuration(trip.duration_minutes);
  return (
    <Card>
      <SectionTitle>ITINÉRAIRE</SectionTitle>
      <Row gap="md" align="flex-start">
        <View style={styles.timeline}>
          <View style={[styles.dot, styles.dotStart]} />
          <View style={styles.line} />
          <View style={[styles.dot, styles.dotEnd]} />
        </View>
        <Stack gap="lg" style={styles.flex}>
          <Stack gap="xs">
            <Text variant="captionStrong" color="secondary">
              Départ · {formatTime(trip.departure_at)}
            </Text>
            <Text variant="heading">{trip.origin_label}</Text>
          </Stack>
          <Stack gap="xs">
            <Text variant="captionStrong" color="secondary">
              Arrivée{arrival ? ` · ${arrival} (estimée)` : ''}
            </Text>
            <Text variant="heading">{trip.destination_label}</Text>
          </Stack>
        </Stack>
      </Row>
      {duration ? (
        <>
          <Divider />
          <Row gap="sm">
            <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
            <Text color="secondary">Durée estimée : {duration}</Text>
          </Row>
        </>
      ) : null}
    </Card>
  );
}

function PriceCard({ trip }: { trip: Trip }) {
  const isFull = trip.seats_available <= 0;
  return (
    <Card>
      <Row justify="space-between" align="flex-start">
        <Stack gap="xs">
          <SectionTitle>PRIX PAR PLACE</SectionTitle>
          <Text variant="display" color="primary">
            {formatPrice(trip.price_cents)}
          </Text>
        </Stack>
        <Stack gap="xs" align="flex-end">
          <Badge label={formatSeats(trip.seats_available)} tone={isFull ? 'danger' : 'success'} />
          <Text variant="caption" color="muted">
            sur {trip.seats_total} au total
          </Text>
        </Stack>
      </Row>
      <Divider />
      <Row gap="sm">
        <Ionicons
          name={trip.instant_booking ? 'flash-outline' : 'chatbubble-ellipses-outline'}
          size={18}
          color={colors.textSecondary}
        />
        <Text color="secondary" style={styles.flex}>
          {trip.instant_booking
            ? 'Réservation instantanée : confirmation immédiate.'
            : 'Réservation sur demande : le conducteur valide chaque passager.'}
        </Text>
      </Row>
    </Card>
  );
}

function DriverCard({ trip }: { trip: Trip }) {
  const driver = trip.driver;
  return (
    <Card>
      <SectionTitle>CONDUCTEUR</SectionTitle>
      <Row gap="md">
        <Avatar name={driver?.full_name ?? 'Conducteur'} uri={driver?.avatar_url} size={56} />
        <Stack gap="xs" style={styles.flex}>
          <Text variant="heading">{driver?.full_name ?? 'Conducteur'}</Text>
          {driver ? (
            <Row gap="md" wrap>
              <Row gap="xs">
                <Ionicons name="star" size={14} color={colors.accent} />
                <Text variant="caption" color="secondary">
                  {formatRating(driver.rating)} / 5
                </Text>
              </Row>
              <Text variant="caption" color="secondary">
                {driver.trips_count === 0
                  ? 'Nouveau conducteur'
                  : `${driver.trips_count} trajet${driver.trips_count > 1 ? 's' : ''} effectué${driver.trips_count > 1 ? 's' : ''}`}
              </Text>
            </Row>
          ) : (
            <Text variant="caption" color="muted">
              Profil indisponible
            </Text>
          )}
        </Stack>
      </Row>
    </Card>
  );
}

function VehicleCard({ trip }: { trip: Trip }) {
  const v = trip.vehicle!;
  return (
    <Card>
      <SectionTitle>VÉHICULE</SectionTitle>
      <Row gap="md">
        <View style={styles.vehicleIcon}>
          <Ionicons name="car-sport-outline" size={24} color={colors.primary} />
        </View>
        <Stack gap="xs">
          <Text variant="bodyStrong">
            {v.brand} {v.model}
          </Text>
          <Text variant="caption" color="secondary">
            {[v.color, `${v.seats} places`].filter(Boolean).join(' · ')}
          </Text>
        </Stack>
      </Row>
    </Card>
  );
}

function NotesCard({ notes }: { notes: string }) {
  return (
    <Card>
      <SectionTitle>INFOS DU CONDUCTEUR</SectionTitle>
      <Text color="secondary">{notes}</Text>
    </Card>
  );
}

const DOT = 12;

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  flex: { flex: 1 },
  capitalize: { textTransform: 'capitalize' },
  sectionTitle: { letterSpacing: 0.6, marginBottom: spacing.sm },
  timeline: { alignItems: 'center', paddingTop: 22 },
  dot: { width: DOT, height: DOT, borderRadius: DOT / 2, borderWidth: 2, borderColor: colors.primary },
  dotStart: { backgroundColor: colors.surface },
  dotEnd: { backgroundColor: colors.primary },
  line: { width: 2, height: 48, backgroundColor: colors.border },
  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
