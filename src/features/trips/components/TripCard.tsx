import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Avatar, Badge, Card, Row, Stack, Text, colors, spacing } from '@/design-system';
import { firstName, formatPrice, formatRating, formatSeats, formatTime } from '../format';
import type { Trip } from '../types';

type TripCardProps = { trip: Trip; onPress?: () => void };

export function TripCard({ trip, onPress }: TripCardProps) {
  const isFull = trip.seats_available <= 0;
  const driverName = firstName(trip.driver?.full_name);

  return (
    <Card onPress={onPress} accessibilityLabel={`Trajet ${trip.origin_label} vers ${trip.destination_label}`}>
      <Row justify="space-between" align="flex-start" gap="md">
        <Row gap="md" style={styles.flex} align="flex-start">
          <Text variant="heading" style={styles.time}>
            {formatTime(trip.departure_at)}
          </Text>
          <Stack gap="xs" style={styles.flex}>
            <Row gap="sm">
              <View style={[styles.dot, styles.dotStart]} />
              <Text variant="bodyStrong" numberOfLines={1} style={styles.flex}>
                {trip.origin_label}
              </Text>
            </Row>
            <View style={styles.connector} />
            <Row gap="sm">
              <View style={[styles.dot, styles.dotEnd]} />
              <Text variant="bodyStrong" numberOfLines={1} style={styles.flex}>
                {trip.destination_label}
              </Text>
            </Row>
          </Stack>
        </Row>
        <Text variant="heading" color="primary">
          {formatPrice(trip.price_cents)}
        </Text>
      </Row>

      <View style={styles.footer}>
        <Row gap="sm" style={styles.flex}>
          <Avatar name={trip.driver?.full_name ?? driverName} uri={trip.driver?.avatar_url} size={36} />
          <Stack gap="xs" style={styles.flex}>
            <Text variant="captionStrong" numberOfLines={1}>
              {driverName}
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
        <Badge
          label={isFull ? 'Complet' : `${formatSeats(trip.seats_available)} restante${trip.seats_available > 1 ? 's' : ''}`}
          tone={isFull ? 'danger' : 'success'}
        />
      </View>
    </Card>
  );
}

const DOT = 10;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  time: { minWidth: 52 },
  dot: { width: DOT, height: DOT, borderRadius: DOT / 2, borderWidth: 2, borderColor: colors.primary },
  dotStart: { backgroundColor: colors.surface },
  dotEnd: { backgroundColor: colors.primary },
  connector: { width: 2, height: 12, marginLeft: DOT / 2 - 1, backgroundColor: colors.border },
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
});
