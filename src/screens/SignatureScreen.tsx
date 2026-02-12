import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import useStore from '../store/useStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Signature'>;

export default function SignatureScreen({ route, navigation }: Props) {
  const { id } = route.params || {};
  const { getDeliveryById, completeDelivery } = useStore();
  const delivery = id ? getDeliveryById(id) : null;

  if (!delivery) {
    return (
      <View style={styles.container}>
        <Text>Delivery not found</Text>
      </View>
    );
  }

  const deliveryId = delivery.id;

  function handleCapture() {
    // Placeholder: integrate a signature capture library (react-native-signature-capture)
    Alert.alert('Signature', 'Simulated signature captured');
    completeDelivery(deliveryId);
    navigation.navigate('Deliveries');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capture Signature for:</Text>
      <Text style={{ marginBottom: 12 }}>{delivery.address}</Text>
      <Button title="Capture Signature" onPress={handleCapture} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
});
