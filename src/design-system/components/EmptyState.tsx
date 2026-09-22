import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../tokens';
import { Button } from './Button';
import { Text } from './Text';

type EmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'neutral' | 'danger';
};

export function EmptyState({ icon = 'car-outline', title, description, actionLabel, onAction, tone = 'neutral' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={40} color={tone === 'danger' ? colors.danger : colors.textMuted} />
      <Text variant="heading" align="center">
        {title}
      </Text>
      {description ? (
        <Text color="secondary" align="center">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? <Button label={actionLabel} variant="secondary" onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
});
