import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { colors, spacing } from '../tokens';

type ScreenProps = PropsWithChildren<
  ViewProps & {
    /** Applique un padding horizontal standard. */
    padded?: boolean;
    edges?: Edge[];
  }
>;

export function Screen({ children, padded = false, edges = ['bottom'], style, ...rest }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={styles.safe}>
      <View {...rest} style={[styles.content, padded && styles.padded, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  padded: { paddingHorizontal: spacing.lg },
});
