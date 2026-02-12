import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import useStore, { Delivery } from '../store/useStore';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveryDetail'>;

function statusLabel(status: Delivery['status']) {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'out_for_delivery':
      return 'Out for delivery';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
}

function statusColor(status: Delivery['status']) {
  switch (status) {
    case 'pending':
      return '#f0ad4e';
    case 'out_for_delivery':
      return '#0275d8';
    case 'completed':
      return '#5cb85c';
    default:
      return '#999';
  }
}

export default function DeliveryDetailScreen({ route, navigation }: Props) {
  const { id } = route.params || {};
  const { getDeliveryById, completeDelivery } = useStore();
  const delivery = id ? getDeliveryById(id) : null;

  if (!delivery) {
    return (
      <View style={styles.containerCentered}>
        <Text>Delivery not found</Text>
      </View>
    );
  }

  // capture stable locals to use inside closures (avoid TS nullability in callbacks)
  const deliveryId = delivery.id;
  const deliveryLat = delivery.lat;
  const deliveryLng = delivery.lng;
  const deliveryPhone = (delivery as any).phone ?? '1234567890';

  function openMaps() {
    if (deliveryLat && deliveryLng) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${deliveryLat},${deliveryLng}`;
      Linking.openURL(url).catch(() => Alert.alert('Error', 'Unable to open maps'));
    } else {
      Alert.alert('Location unavailable', 'Delivery coordinates are not available');
    }
  }

  function callRecipient() {
    Linking.openURL(`tel:${deliveryPhone}`).catch(() => Alert.alert('Error', 'Unable to start call'));
  }

  function takePhoto() {
    Alert.alert('Photo', 'Open camera to capture proof (placeholder)');
  }

  function handleComplete() {
    Alert.alert('Complete delivery', 'Mark delivery as completed?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => completeDelivery(deliveryId) },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Delivery #{delivery.id}</Text>
        <View style={[styles.statusPill, { backgroundColor: statusColor(delivery.status) }]}>
          <Text style={styles.statusText}>{statusLabel(delivery.status)}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Address</Text>
        <Text style={styles.cardText}>{delivery.address}</Text>
        <Text style={styles.coordText}>{delivery.lat && delivery.lng ? `${delivery.lat.toFixed(5)}, ${delivery.lng.toFixed(5)}` : 'Coordinates not available'}</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={openMaps} accessibilityLabel="Navigate">
          <Text style={styles.actionLabel}>Navigate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={callRecipient} accessibilityLabel="Call">
          <Text style={styles.actionLabel}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={takePhoto} accessibilityLabel="Photo">
          <Text style={styles.actionLabel}>Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Signature', { id: delivery.id })} accessibilityLabel="Signature">
          <Text style={styles.actionLabel}>Signature</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapPreview}>
        <Text style={{ color: '#666' }}>Map preview placeholder — integrate react-native-maps</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Details</Text>
        <Text style={styles.cardText}>Items: {(delivery as any).items ? (delivery as any).items.join(', ') : '1 package'}</Text>
        <Text style={styles.cardText}>Notes: {(delivery as any).notes ?? 'No special instructions'}</Text>
      </View>

      <View style={styles.footerRow}>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: '#0275d8' }]} onPress={handleComplete}>
          <Text style={styles.primaryLabel}>Mark Complete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.secondaryButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryLabel}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  containerCentered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  statusPill: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16 },
  statusText: { color: '#fff', fontWeight: '600' },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.03, elevation: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  cardText: { fontSize: 16, color: '#222' },
  coordText: { fontSize: 12, color: '#666', marginTop: 6 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  actionButton: { flex: 1, marginHorizontal: 4, paddingVertical: 10, backgroundColor: '#f6f6f6', borderRadius: 8, alignItems: 'center' },
  actionLabel: { fontSize: 13, fontWeight: '600' },
  mapPreview: { height: 150, borderRadius: 8, borderWidth: 1, borderColor: '#eee', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  primaryButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginRight: 8 },
  primaryLabel: { color: '#fff', fontWeight: '700' },
  secondaryButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', alignItems: 'center' },
  secondaryLabel: { color: '#333', fontWeight: '700' },
});
