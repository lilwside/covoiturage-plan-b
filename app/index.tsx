import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Button, Card, DateField, Screen, Stack, Text, TextField, colors, radius, spacing } from '@/design-system';
import { fromDayString, toDayString, toRouteParams, type TripSearchParams } from '@/features/trips';

export default function SearchScreen() {
  const router = useRouter();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const toRef = useRef<TextInput>(null);

  const today = fromDayString(toDayString(new Date()))!;

  const search = () => {
    const params: TripSearchParams = { from, to, date: date ? toDayString(date) : null };
    router.push({ pathname: '/results', params: toRouteParams(params) });
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Stack gap="xs" style={styles.hero}>
            <Text variant="display">Où allez-vous ?</Text>
            <Text color="secondary">Trouvez un trajet proposé par la communauté.</Text>
          </Stack>

          <Card>
            <Stack gap="md">
              <View>
                <TextField
                  label="Départ"
                  icon="radio-button-off"
                  placeholder="Ville de départ"
                  value={from}
                  onChangeText={setFrom}
                  onClear={() => setFrom('')}
                  returnKeyType="next"
                  onSubmitEditing={() => toRef.current?.focus()}
                  blurOnSubmit={false}
                />
                <Pressable
                  accessibilityLabel="Inverser départ et arrivée"
                  hitSlop={8}
                  onPress={swap}
                  style={({ pressed }) => [styles.swap, pressed && styles.swapPressed]}
                >
                  <Ionicons name="swap-vertical" size={18} color={colors.primary} />
                </Pressable>
                <View style={styles.spacer} />
                <TextField
                  ref={toRef}
                  label="Arrivée"
                  icon="location"
                  placeholder="Ville d'arrivée"
                  value={to}
                  onChangeText={setTo}
                  onClear={() => setTo('')}
                  returnKeyType="search"
                  onSubmitEditing={search}
                />
              </View>
              <DateField label="Date" value={date} onChange={setDate} minimumDate={today} />
              <Button label="Rechercher" fullWidth onPress={search} />
            </Stack>
          </Card>

          <Text variant="caption" color="muted" align="center" style={styles.hint}>
            Laissez les champs vides pour voir tous les trajets à venir.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
  hero: { paddingTop: spacing.sm },
  spacer: { height: spacing.md },
  swap: {
    position: 'absolute',
    right: spacing.md,
    top: 60,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapPressed: { opacity: 0.7 },
  hint: { paddingHorizontal: spacing.lg },
});
