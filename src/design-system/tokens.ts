/**
 * Tokens du design system Covoiturage Plan B.
 * Source unique pour les couleurs, espacements, rayons, typographie et ombres.
 */

export const colors = {
  // Marque
  primary: '#0071EB',
  primarySoft: '#E5F1FD',
  primaryDark: '#0058B8',
  accent: '#F59E0B',
  accentSoft: '#FEF3C7',

  // Surfaces
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceMuted: '#F0F2F5',
  border: '#E3E7ED',

  // Texte
  text: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textOnPrimary: '#FFFFFF',

  // Sémantique
  success: '#15803D',
  successSoft: '#DCFCE7',
  warning: '#B45309',
  warningSoft: '#FEF3C7',
  danger: '#C11417',
  dangerSoft: '#FDE7E7',
  info: '#1D4ED8',
  infoSoft: '#DBEAFE',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' as const },
  bodyStrong: { fontSize: 16, lineHeight: 22, fontWeight: '600' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  captionStrong: { fontSize: 13, lineHeight: 18, fontWeight: '600' as const },
} as const;

export type TypographyVariant = keyof typeof typography;

export const shadows = {
  card: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
} as const;
