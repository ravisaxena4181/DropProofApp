import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DeliveryListScreen from '../screens/DeliveryListScreen';
import DeliveryDetailScreen from '../screens/DeliveryDetailScreen';
import MapTrackScreen from '../screens/MapTrackScreen';
import SignatureScreen from '../screens/SignatureScreen';
import SplashScreen from '../screens/SplashScreen';
import SignIn from '../screens/SignIn';
import Register from '../screens/Register';
import Profile from '../screens/Profile';
import DeliveriesScreen from '../screens/DeliveriesScreen';

export type RootStackParamList = {
  SplashScreen: undefined;
  Home: undefined;
  SignIn: undefined;
  Register: undefined;
  Profile: undefined;
  Deliveries: undefined;
  DeliveriesScreen: undefined;
  DeliveryDetail: { id: string } | undefined;
  MapTrack: { id: string } | undefined;
  Signature: { id: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="DeliveriesScreen" component={DeliveriesScreen} />
      <Stack.Screen name="DeliveryDetail" component={DeliveryDetailScreen} />
      <Stack.Screen name="MapTrack" component={MapTrackScreen} />
      <Stack.Screen name="Signature" component={SignatureScreen} />
    </Stack.Navigator>
  );
}
