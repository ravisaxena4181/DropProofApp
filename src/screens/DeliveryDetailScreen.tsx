import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getOrderById } from '../api/auth';
import { Image } from 'react-native';

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Modal, TextInput } from 'react-native';
import HomeTemplate from '../components/HomeTemplate';
import Signature from 'react-native-signature-canvas';
import React, { useRef } from 'react';
import { launchCamera } from 'react-native-image-picker';


export default function DeliveryDetailsScreen() {
  const route = useRoute<any>();
  const { orderId } = route.params;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState('');
  const [showSignature, setShowSignature] = useState(false);
  //Sign
  const [signature, setSignature] = useState<string | null>(null);
  const [showSignaturePreview, setShowSignaturePreview] = useState(false);
  const signatureRef = useRef<any>(null);
  //Photo
  const [photo, setPhoto] = useState<string | null>(null);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);

  const getDB = async () => {
    return await SQLite.openDatabase({
      name: 'delivery.db',
      location: 'default',
    });
  };

  useEffect(() => {
    const createTable = async () => {
      const db = await getDB();
      await db.executeSql(`
        CREATE TABLE IF NOT EXISTS signatures (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          orderId INTEGER,
          signature TEXT,
          isUploaded BOOLEAN
        );
      `);
      await db.executeSql(`
        CREATE TABLE IF NOT EXISTS photos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          orderId INTEGER,
          photo TEXT,
          isUploaded BOOLEAN
        );
    `);

    };

    createTable();
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
        await loadSignature();
        await loadPhoto();
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);
  const totalItems = () => {
    return (
      order?.orderItems?.reduce((a: number, b: any) => a + b.quantity, 0) ?? 0
    );
  };
  const totalPrice = () => {
    return (
      order?.orderItems?.reduce(
        (a: number, b: any) => a + b.quantity * b.price,
        0,
      ) ?? 0
    );
  };
  const loadSignature = async () => {
    try {
      const db = await getDB();

      const results = await db.executeSql(
        'SELECT signature FROM signatures WHERE orderId = ? ORDER BY id DESC LIMIT 1',
        [orderId],
      );

      if (results[0].rows.length > 0) {
        setSignature(results[0].rows.item(0).signature);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const loadPhoto = async () => {
    try {
      const db = await getDB();

      const results = await db.executeSql(
        'SELECT photo FROM photos WHERE orderId = ? ORDER BY id DESC LIMIT 1',
        [orderId],
      );

      if (results[0].rows.length > 0) {
        setPhoto(results[0].rows.item(0).photo);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const takePhoto = async () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.6,
      },
      async response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Camera Error');
          return;
        }

        const base64Image =
          'data:image/jpeg;base64,' + response.assets?.[0]?.base64;

        try {
          const db = await getDB();

          await db.executeSql(
            'INSERT INTO photos (orderId, photo) VALUES (?, ?)',
            [orderId, base64Image],
          );

          setPhoto(base64Image);
          Alert.alert('Photo saved locally');
        } catch (error) {
          console.log(error);
        }
      },
    );
  };

  useEffect(() => {
    console.log(signature);
  }, [signature]);
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3D73D9" />
      </View>
    );
  }

  if (!order) return null;
  return (
    <HomeTemplate>
      {/* SIGN */}
      <Modal
        visible={showSignature}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          {/* Header */}
          <View style={styles.signatureHeader}>
            <TouchableOpacity onPress={() => setShowSignature(false)}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.signatureTitle}>Please Sign Below</Text>

            <View style={{ width: 30 }} />
          </View>

          {/* Signature Pad */}
          <View style={{ flex: 1 }}>
            <Signature
              ref={signatureRef}
              onOK={async sig => {
                if (!sig) {
                  Alert.alert('Signature required');
                  return;
                }

                try {
                  const db = await getDB();

                  await db.executeSql(
                    'INSERT INTO signatures (orderId, signature) VALUES (?, ?)',
                    [orderId, sig],
                  );

                  setSignature(sig);
                  Alert.alert('Saved locally');
                  setShowSignature(false);
                } catch (error) {
                  console.log(error);
                }
              }}
              onEmpty={() => Alert.alert('Please provide signature')}
              descriptionText=""
              webStyle={`
    .m-signature-pad--footer {
      display: none;
    }
  `}
            />

            <View style={styles.signatureButtons}>
              <TouchableOpacity
                style={styles.clearSignatureBtn}
                onPress={() => signatureRef.current?.clearSignature()}
              >
                <Text style={styles.signatureBtnText}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => {
                  signatureRef.current?.readSignature();
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Sign Preview */}
      <Modal visible={showSignaturePreview} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text
              style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}
            >
              Saved Signature
            </Text>

            {signature && (
              <Image
                source={{ uri: signature }}
                style={{ width: '100%', height: 200, resizeMode: 'contain' }}
              />
            )}

            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowSignaturePreview(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => {
                  setShowSignaturePreview(false);
                  setShowSignature(true);
                }}
              >
                <Text style={styles.buttonText}>Re-sign</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Image Preview*/}
      <Modal visible={showPhotoPreview} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
              Saved Photo
            </Text>

            {photo && (
              <Image
                source={{ uri: photo }}
                style={{ width: '100%', height: 250, resizeMode: 'contain' }}
              />
            )}

            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowPhotoPreview(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => {
                  setShowPhotoPreview(false);
                  takePhoto();
                }}
              >
                <Text style={styles.buttonText}>Retake</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Comment Input */}
            <TextInput
              placeholder="Comment"
              value={comment}
              onChangeText={setComment}
              style={styles.input}
            />

            {/* Sign Button */}
            {/* Sign Row */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.smallGreyBtn}
                onPress={() => {
                  if (signature) {
                    setShowSignaturePreview(true);
                  } else {
                    setShowSignature(true);
                  }
                }}
              >
                <Text style={styles.smallIcon}>〰️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.signBtn}
                onPress={() => setShowSignature(true)}
              >
                <Text style={styles.signText}>Sign</Text>
              </TouchableOpacity>
            </View>

            {/* Photo Row */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.smallGreyBtn}
                onPress={() => {
                  if (photo) {
                    setShowPhotoPreview(true);
                  } else {
                    takePhoto();
                  }
                }}
              >
                <Text style={styles.smallIcon}>🖼️</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
                <Text style={styles.photoText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.smallOrangeBtn}>
                <Text style={styles.smallIconWhite}>➕</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.screen}>
        {/* Scrollable Content */}
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.header}>Delivery Details</Text>
          <Text style={styles.details}>Delivery #{order.orderNumber}</Text>

          {order.orderItems?.map((item: any, index: number) => (
            <View key={index} style={styles.itemCard}>
              <Text style={styles.itemName}>{item.itemName}</Text>
              <Text style={styles.itemSub}>{item.quantity} pcs.</Text>
              <View style={styles.price}>
                <Text style={styles.itemSub}>pcs./€{item.price}</Text>
                <Text style={styles.cost}>
                  Cost: €{(item.quantity * item.price).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.totalCard}>
            <Text style={styles.totalTitle}>Total</Text>

            {[
              ['Total items', totalItems()],
              ['Total', `€${totalPrice()}`],
              ['Weight', `${order.weight} Lb`],
              ['Volume', `${order.volume} Box`],
              ['Plt/Pkg', order.pltPkg],
              ['Shipper', order.shipper],
              ['Depot address', order.depotAddress],
              ['Client', order.clientName],
              ['Address', order.clientAddress],
            ].map(([label, value], index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.rowLabel}>{label}</Text>
                <Text style={styles.rowValue}>{value}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.notDelivered}>
            <Text style={styles.buttonText}>Not delivered</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.delivered}
            onPress={() => {
              setShowModal(true);
            }}
          >
            <Text style={styles.buttonText}>Delivered</Text>
          </TouchableOpacity>
        </View>
      </View>
    </HomeTemplate>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  screen: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  details: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  itemCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },

  itemSub: {
    color: '#777',
    fontSize: 14,
  },

  cost: {
    marginTop: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  price: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10,
  },

  totalTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FF7A00',
    fontSize: 16,
    marginBottom: 15,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },

  rowLabel: {
    color: '#555',
    fontSize: 14,
  },

  rowValue: {
    fontWeight: '500',
    fontSize: 14,
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 25,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },

  notDelivered: {
    flex: 1,
    backgroundColor: '#E53935',
    padding: 16,
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
  },

  delivered: {
    flex: 1,
    backgroundColor: '#43A047',
    padding: 16,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },

  signBtn: {
    flex: 1,
    backgroundColor: '#F57C00',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  signText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  photoBtn: {
    flex: 1,
    backgroundColor: '#6EC1E4',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  photoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cancelBtn: {
    flex: 1,
    backgroundColor: '#E53935',
    padding: 14,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },

  saveBtn: {
    flex: 1,
    backgroundColor: '#43A047',
    padding: 14,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  smallGreyBtn: {
    width: 50,
    height: 50,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  smallOrangeBtn: {
    width: 50,
    height: 50,
    backgroundColor: '#F57C00',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  smallIcon: {
    fontSize: 20,
  },

  smallIconWhite: {
    fontSize: 20,
    color: '#fff',
  },
  signatureTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signatureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  closeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  signatureButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
  },

  clearSignatureBtn: {
    flex: 1,
    backgroundColor: '#E53935',
    padding: 15,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },

  saveSignatureBtn: {
    flex: 1,
    backgroundColor: '#43A047',
    padding: 15,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },

  signatureBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
