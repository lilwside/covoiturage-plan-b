import type { PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';
import { spacing } from '../tokens';

type Gap = keyof typeof spacing;

type StackProps = PropsWithChildren<
  ViewProps & {
    direction?: 'row' | 'column';
    gap?: Gap;
    align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
    wrap?: boolean;
  }
>;

/** Empile ses enfants avec un espacement issu des tokens. */
export function Stack({
  direction = 'column',
  gap = 'sm',
  align,
  justify,
  wrap,
  style,
  children,
  ...rest
}: StackProps) {
  return (
    <View
      {...rest}
      style={[
        {
          flexDirection: direction,
          gap: spacing[gap],
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap ? 'wrap' : undefined,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Row(props: Omit<StackProps, 'direction'>) {
  return <Stack direction="row" align="center" {...props} />;
}
