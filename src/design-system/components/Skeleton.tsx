import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, type DimensionValue } from 'react-native';
import { colors, radius } from '../tokens';

type SkeletonProps = { width?: DimensionValue; height?: number; round?: boolean };

/** Placeholder de chargement animé. */
export function Skeleton({ width = '100%', height = 16, round = false }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.block, { width, height, borderRadius: round ? radius.pill : radius.sm, opacity }]}
    />
  );
}

const styles = StyleSheet.create({
  block: { backgroundColor: colors.surfaceMuted },
});
