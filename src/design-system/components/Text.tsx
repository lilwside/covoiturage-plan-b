import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors, typography, type TypographyVariant } from '../tokens';

type TextColor = 'default' | 'secondary' | 'muted' | 'primary' | 'onPrimary' | 'success' | 'danger';

const colorMap: Record<TextColor, string> = {
  default: colors.text,
  secondary: colors.textSecondary,
  muted: colors.textMuted,
  primary: colors.primary,
  onPrimary: colors.textOnPrimary,
  success: colors.success,
  danger: colors.danger,
};

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: TextColor;
  align?: 'left' | 'center' | 'right';
};

export function Text({ variant = 'body', color = 'default', align, style, ...rest }: TextProps) {
  return (
    <RNText
      {...rest}
      style={[styles.base, typography[variant], { color: colorMap[color] }, align && { textAlign: align }, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: { includeFontPadding: false },
});
