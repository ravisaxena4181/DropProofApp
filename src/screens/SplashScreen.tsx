import React, { useEffect } from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AppTemplate from '../components/Template';
import { useAuthStore } from '../store/useStore';

const SplashScreen = ({ navigation }: any) => {
  const token = useAuthStore((state) => state.token);
  useEffect(() => {
    const nextRoute = token ? "Profile" : "Home";

    const timer = setTimeout(() => {
      navigation.replace(nextRoute);
    }, 2000);

    return () => clearTimeout(timer);
  }, [token, navigation]);


  return (
    <AppTemplate>
      <Text style={styles.title}>Driver</Text>

      <ActivityIndicator
        size="large"
        color="rgba(255,255,255,0.9)"
        style={{ marginTop: 12 }}
      />

      
    </AppTemplate>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    fontSize: 46,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    marginTop: 4,
  },
  version: { marginTop: 12, color: 'rgba(255,255,255,0.9)', fontSize: 12 },
  topSpacer: { flex: 1 },
  icon: { position: 'absolute', opacity: 0.99 },
});
