import { Card, Row, Skeleton, Stack } from '@/design-system';

export function TripCardSkeleton() {
  return (
    <Card>
      <Row justify="space-between" align="flex-start">
        <Stack gap="sm" style={{ flex: 1 }}>
          <Skeleton width="70%" height={18} />
          <Skeleton width="40%" height={12} />
          <Skeleton width="65%" height={18} />
        </Stack>
        <Skeleton width={64} height={24} />
      </Row>
      <Row gap="sm" style={{ marginTop: 16 }}>
        <Skeleton width={36} height={36} round />
        <Skeleton width="40%" height={14} />
      </Row>
    </Card>
  );
}
