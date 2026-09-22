import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radius, spacing, typography } from '../tokens';

type SearchInputProps = Omit<TextInputProps, 'style'> & {
  onClear?: () => void;
};

export function SearchInput({ value, onClear, ...rest }: SearchInputProps) {
  return (
    <View style={styles.wrapper}>
      <Ionicons name="search" size={18} color={colors.textMuted} />
      <TextInput
        value={value}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
        {...rest}
        style={styles.input}
      />
      {!!value && onClear && (
        <Pressable accessibilityLabel="Effacer la recherche" hitSlop={8} onPress={onClear}>
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 46,
  },
  input: { flex: 1, ...typography.body, color: colors.text, paddingVertical: spacing.sm },
});
