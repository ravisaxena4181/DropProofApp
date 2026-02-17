import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getOrders } from '../api/auth';
import HomeTemplate from '../components/HomeTemplate';
import { useNavigation } from '@react-navigation/native';

export default function DeliveriesScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Pending' | 'InRoute' | 'Delivered'>('Pending');
  const navigation  = useNavigation<any>();
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders(); 
      setOrders(data.data);
    } catch (error: any) {
      console.log(error);
      Alert.alert('Error', 'Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  // Keep hook order stable: useMemo must be called on every render
  const filteredOrders = useMemo(() => {
    return orders.filter(order => order.status === activeTab);
  }, [orders, activeTab]);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.deliveryTitle}>
          <Text style={{ color: '#FF7A00' }}>Delivery</Text> #{item.orderNumber}
        </Text>

        <TouchableOpacity style={styles.loadBtn}>
          <Text style={styles.loadText}>Load Check</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.company}>{item.clientName}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Order Date: {item.orderDate}</Text>
      </View>
      {/* Items Divider */}
<View style={styles.itemsDivider}>
  <View style={styles.line} />
  <Text style={styles.itemsCount}>3 items</Text>
  <View style={styles.line} />
</View>

{/* Stats Row */}
<View style={styles.statsRow}>
  <View style={styles.statBox}>
    <Text style={styles.statLabel}>Weight, Lb</Text>
    <Text style={styles.statValue}>7</Text>
  </View>

  <View style={styles.statBox}>
    <Text style={styles.statLabel}>Volume, Box</Text>
    <Text style={styles.statValue}>3</Text>
  </View>

  <View style={styles.statBox}>
    <Text style={styles.statLabel}>Plt/Pkg</Text>
    <Text style={styles.statValue}>1.2</Text>
  </View>

  <View style={styles.statBox}>
    <Text style={styles.statLabel}>Quantity</Text>
    <Text style={styles.statValue}>6</Text>
  </View>
</View>

      <TouchableOpacity 
      style={styles.actionBtn}
      onPress={() => navigation.navigate('DeliveryDetail', { orderId: item.orderId })}
      >
        <Text style={styles.actionText}>ACTIONS</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3D73D9" />
      </View>
    );
  }

  return (
    <HomeTemplate>
      <View style={styles.container}>
        <View style={styles.tabs}>
          {['Pending', 'InRoute', 'Delivered'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.orderId.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </HomeTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingTop: 20,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabs: {
    flexDirection: 'row',
    backgroundColor: '#EAEAEA',
    marginHorizontal: 16,
    borderRadius: 30,
    padding: 5,
    marginBottom: 20,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 25,
  },

  activeTab: {
    backgroundColor: '#3D73D9',
  },

  tabText: {
    color: '#000',
    fontWeight: '500',
  },

  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  deliveryTitle: {
    fontWeight: '600',
    fontSize: 16,
  },

  loadBtn: {
    backgroundColor: '#EEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  loadText: {
    fontSize: 12,
    color: '#444',
  },

  company: {
    marginTop: 10,
    color: '#666',
  },

  itemsRow: {
    marginVertical: 15,
    alignItems: 'center',
  },

  itemsText: {
    fontWeight: '600',
    color: '#FF7A00',
  },

  actionBtn: {
    borderWidth: 1,
    borderColor: '#FF7A00',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },

  actionText: {
    color: '#FF7A00',
    fontWeight: '600',
  },
  metaRow: {
  marginTop: 10,
},

metaText: {
  fontSize: 13,
  color: '#777',
},
itemsDivider: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 12,
},

line: {
  flex: 1,
  height: 1,
  backgroundColor: '#E5C8A8',
},

itemsCount: {
  marginHorizontal: 10,
  color: '#FF7A00',
  fontWeight: '600',
},

statsRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 15,
},

statBox: {
  alignItems: 'center',
  flex: 1,
},

statLabel: {
  fontSize: 12,
  color: '#777',
},

statValue: {
  fontSize: 16,
  fontWeight: '600',
  marginTop: 4,
},

});
