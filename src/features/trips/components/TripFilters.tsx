import { StyleSheet, View } from 'react-native';
import { Chip, Row, SearchInput, spacing } from '@/design-system';
import type { TripFilters as Filters } from '../filters';

type TripFiltersProps = {
  filters: Filters;
  onChange: (next: Filters) => void;
};

export function TripFilters({ filters, onChange }: TripFiltersProps) {
  return (
    <View style={styles.container}>
      <SearchInput
        placeholder="Départ, arrivée… ex. Paris Lyon"
        value={filters.query}
        onChangeText={(query) => onChange({ ...filters, query })}
        onClear={() => onChange({ ...filters, query: '' })}
      />
      <Row gap="sm">
        <Chip
          label="Places disponibles"
          selected={filters.onlyAvailable}
          onPress={() => onChange({ ...filters, onlyAvailable: !filters.onlyAvailable })}
        />
      </Row>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md, paddingBottom: spacing.md },
});
