import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import HomeTemplate from '../components/HomeTemplate';

export default function Profile() {
  return (
    <HomeTemplate>

      {/* STATUS ROW */}
      <View style={styles.statusRow}>
        <View style={styles.avatarWrapper}>
            {/* Profile Image */}
          <Image
            source={{ uri: 'https://i.pravatar.cc/100' }}
            style={styles.avatar}
          />
        </View>

        <TouchableOpacity style={styles.offlineButton}>
          <Text style={styles.offlineText}>Offline</Text>
        </TouchableOpacity>
      </View>

      {/* VEHICLE CARD */}
      <View style={styles.vehicleCard}>
        <Feather name="refresh-cw" size={20} color="#777" />
        <View>
          <Text style={styles.vehicleTitle}>Suzuki Belang 150</Text>
          <Text style={styles.vehicleNumber}>432</Text>
        </View>
      </View>

      {/* MAP PLACEHOLDER */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Map Area</Text>
      </View>

    </HomeTemplate>
  );
}
const styles = StyleSheet.create({
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 15,
  },

  avatarWrapper: {
    borderWidth: 2,
    borderColor: '#3D73D9',
    borderRadius: 50,
    padding: 3,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  offlineButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 20,
  },

  offlineText: {
    color: '#fff',
    fontWeight: '600',
  },

  vehicleCard: {
    backgroundColor: '#eee',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  vehicleTitle: {
    fontWeight: '600',
    fontSize: 16,
  },

  vehicleNumber: {
    color: '#777',
  },

  mapPlaceholder: {
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#e6e6e6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  mapText: {
    color: '#999',
    fontSize: 16,
  },
});
