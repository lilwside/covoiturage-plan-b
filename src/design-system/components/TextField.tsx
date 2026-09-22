import { Ionicons } from '@expo/vector-icons';
import { forwardRef } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radius, spacing, typography } from '../tokens';
import { Text } from './Text';

export type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Message d'erreur (affiché en rouge #C11417). */
  error?: string;
  onClear?: () => void;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, icon, error, value, onClear, ...rest },
  ref,
) {
  return (
    <View style={styles.container}>
      <Text variant="captionStrong" color="secondary">
        {label}
      </Text>
      <View style={[styles.field, !!error && styles.fieldError]}>
        {icon ? <Ionicons name={icon} size={18} color={error ? colors.danger : colors.textMuted} /> : null}
        <TextInput
          ref={ref}
          value={value}
          placeholderTextColor={colors.textMuted}
          autoCapitalize="words"
          autoCorrect={false}
          accessibilityLabel={label}
          {...rest}
          style={styles.input}
        />
        {!!value && onClear ? (
          <Pressable accessibilityLabel={`Effacer ${label.toLowerCase()}`} hitSlop={8} onPress={onClear}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  fieldError: { borderColor: colors.danger },
  input: { flex: 1, ...typography.body, color: colors.text, paddingVertical: spacing.sm },
});
