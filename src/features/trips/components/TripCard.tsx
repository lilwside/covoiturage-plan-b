import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Avatar, Badge, Card, Row, Stack, Text, colors, spacing } from '@/design-system';
import { estimateArrival, formatDuration, formatPrice, formatRating, formatSeats, formatTime } from '../format';
import type { Trip } from '../types';

type TripCardProps = { trip: Trip; onPress: () => void };

export function TripCard({ trip, onPress }: TripCardProps) {
  const arrival = estimateArrival(trip.departure_at, trip.duration_minutes);
  const duration = formatDuration(trip.duration_minutes);
  const isFull = trip.seats_available <= 0;

  return (
    <Card onPress={onPress} accessibilityLabel={`Trajet ${trip.origin_label} vers ${trip.destination_label}`}>
      <Row justify="space-between" align="flex-start" gap="md">
        <Stack gap="xs" style={styles.route}>
          <Row gap="sm">
            <Text variant="captionStrong" color="secondary" style={styles.time}>
              {formatTime(trip.departure_at)}
            </Text>
            <View style={[styles.dot, styles.dotStart]} />
            <Text variant="bodyStrong" numberOfLines={1} style={styles.city}>
              {trip.origin_label}
            </Text>
          </Row>
          <View style={styles.connectorRow}>
            <View style={styles.time} />
            <View style={styles.connector} />
            {duration ? (
              <Text variant="caption" color="muted">
                {duration}
              </Text>
            ) : null}
          </View>
          <Row gap="sm">
            <Text variant="captionStrong" color="secondary" style={styles.time}>
              {arrival ?? '—'}
            </Text>
            <View style={[styles.dot, styles.dotEnd]} />
            <Text variant="bodyStrong" numberOfLines={1} style={styles.city}>
              {trip.destination_label}
            </Text>
          </Row>
        </Stack>

        <Stack gap="xs" align="flex-end">
          <Text variant="heading" color="primary">
            {formatPrice(trip.price_cents)}
          </Text>
          <Text variant="caption" color="muted">
            par place
          </Text>
        </Stack>
      </Row>

      <View style={styles.footer}>
        <Row gap="sm" style={styles.driver}>
          <Avatar name={trip.driver?.full_name ?? 'Conducteur'} uri={trip.driver?.avatar_url} size={36} />
          <Stack gap="xs" style={styles.driverText}>
            <Text variant="captionStrong" numberOfLines={1}>
              {trip.driver?.full_name ?? 'Conducteur'}
            </Text>
            {trip.driver ? (
              <Row gap="xs">
                <Ionicons name="star" size={12} color={colors.accent} />
                <Text variant="caption" color="secondary">
                  {formatRating(trip.driver.rating)}
                </Text>
              </Row>
            ) : null}
          </Stack>
        </Row>
        <Row gap="xs">
          {trip.instant_booking && !isFull ? <Badge label="Instantané" tone="accent" /> : null}
          <Badge label={formatSeats(trip.seats_available)} tone={isFull ? 'danger' : 'success'} />
        </Row>
      </View>
    </Card>
  );
}

const DOT = 10;

const styles = StyleSheet.create({
  route: { flex: 1 },
  time: { width: 44 },
  city: { flex: 1 },
  dot: { width: DOT, height: DOT, borderRadius: DOT / 2, borderWidth: 2, borderColor: colors.primary },
  dotStart: { backgroundColor: colors.surface },
  dotEnd: { backgroundColor: colors.primary },
  connectorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 14 },
  connector: {
    width: 2,
    height: 14,
    marginLeft: DOT / 2 - 1,
    marginRight: DOT / 2 - 1,
    backgroundColor: colors.border,
  },
  footer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  driver: { flex: 1 },
  driverText: { flex: 1 },
});
