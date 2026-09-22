import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid, type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../tokens';
import { Button } from './Button';
import { Text } from './Text';

type DateFieldProps = {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minimumDate?: Date;
  error?: string;
};

const formatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

export function DateField({
  label,
  value,
  onChange,
  placeholder = 'Toutes les dates',
  minimumDate,
  error,
}: DateFieldProps) {
  const [iosOpen, setIosOpen] = useState(false);
  const [iosDraft, setIosDraft] = useState<Date>(value ?? new Date());

  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: value ?? new Date(),
        mode: 'date',
        minimumDate,
        onChange: (event: DateTimePickerEvent, date?: Date) => {
          if (event.type === 'set' && date) onChange(date);
        },
      });
      return;
    }
    setIosDraft(value ?? new Date());
    setIosOpen(true);
  };

  return (
    <View style={styles.container}>
      <Text variant="captionStrong" color="secondary">
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={open}
        style={({ pressed }) => [styles.field, !!error && styles.fieldError, pressed && styles.pressed]}
      >
        <Ionicons name="calendar-outline" size={18} color={error ? colors.danger : colors.textMuted} />
        <Text style={styles.value} color={value ? 'default' : 'muted'}>
          {value ? capitalize(formatter.format(value)) : placeholder}
        </Text>
        {value ? (
          <Pressable accessibilityLabel="Effacer la date" hitSlop={8} onPress={() => onChange(null)}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : (
          <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
        )}
      </Pressable>
      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : null}

      {Platform.OS !== 'android' ? (
        <Modal visible={iosOpen} transparent animationType="fade" onRequestClose={() => setIosOpen(false)}>
          <Pressable style={styles.backdrop} onPress={() => setIosOpen(false)} />
          <View style={styles.sheet}>
            <Text variant="heading">{label}</Text>
            <DateTimePicker
              value={iosDraft}
              mode="date"
              display="inline"
              locale="fr-FR"
              minimumDate={minimumDate}
              accentColor={colors.primary}
              onChange={(_, date) => date && setIosDraft(date)}
            />
            <Button
              label="Valider"
              fullWidth
              onPress={() => {
                onChange(iosDraft);
                setIosOpen(false);
              }}
            />
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

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
  pressed: { opacity: 0.8 },
  value: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)' },
  sheet: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    gap: spacing.md,
  },
});
