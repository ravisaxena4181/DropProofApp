import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import useStore from '../store/useStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Deliveries'>;

export default function DeliveryListScreen({ navigation }: Props) {
  const { deliveries, loadMockDeliveries } = useStore();

  useEffect(() => {
    loadMockDeliveries();
  }, [loadMockDeliveries]);

  return (
    <View style={styles.container}>
      <FlatList
        data={deliveries}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('DeliveryDetail', { id: item.id })}
          >
            <Text style={styles.itemTitle}>{item.address}</Text>
            <Text>{item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  itemTitle: { fontSize: 16, fontWeight: '600' },
});
