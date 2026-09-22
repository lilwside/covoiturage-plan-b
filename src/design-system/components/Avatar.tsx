import { Image, StyleSheet, View } from 'react-native';
import { colors, radius } from '../tokens';
import { Text } from './Text';

type AvatarProps = { name: string; uri?: string | null; size?: number };

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
}

export function Avatar({ name, uri, size = 44 }: AvatarProps) {
  const dim = { width: size, height: size, borderRadius: radius.pill };
  if (uri) {
    return <Image accessibilityLabel={name} source={{ uri }} style={[styles.image, dim]} />;
  }
  return (
    <View accessibilityLabel={name} style={[styles.fallback, dim]}>
      <Text variant={size >= 56 ? 'heading' : 'bodyStrong'} color="primary">
        {initials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.surfaceMuted },
  fallback: { backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
});
