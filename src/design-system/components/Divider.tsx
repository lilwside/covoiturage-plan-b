import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../tokens';

export function Divider({ spaced = true }: { spaced?: boolean }) {
  return <View style={[styles.line, spaced && styles.spaced]} />;
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, alignSelf: 'stretch' },
  spaced: { marginVertical: spacing.md },
});
