import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Platform, PermissionsAndroid } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Geolocation from '@react-native-community/geolocation';
import useStore from '../store/useStore';

type Props = NativeStackScreenProps<RootStackParamList, 'MapTrack'>;

export default function MapTrackScreen({ route, navigation }: Props) {
  const { id } = route.params || {};
  const { getDeliveryById } = useStore();
  const delivery = id ? getDeliveryById(id) : null;
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    async function requestPermission() {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      }
    }
    requestPermission();

    const watchId = Geolocation.watchPosition(
      (pos) => setLocation(pos.coords),
      (err) => console.warn(err),
      { enableHighAccuracy: true, distanceFilter: 5, interval: 5000 }
    );

    return () => Geolocation.clearWatch(watchId as number);
  }, []);

  if (!delivery) {
    return (
      <View style={styles.container}>
        <Text>Delivery not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tracking: {delivery.address}</Text>
      <Text>Current location: {location ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}` : 'Loading...'}</Text>
      <View style={{ marginTop: 12 }}>
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.note}>
        <Text style={{ fontSize: 12, color: '#666' }}>Map view placeholder — integrate `react-native-maps` and real-time updates for production.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  note: { marginTop: 16 },
});
