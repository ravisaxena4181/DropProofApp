import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AppTemplate from '../components/Template';

const SplashScreen = ({ navigation }: any) => {
  const [appVersion, setAppVersion] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const pkg = require('../../../package.json');
        if (mounted) setAppVersion(pkg.version || null);
      } catch (e) {
        console.log(e);
      }

      let nextRoute = 'Home';
      try {
        const AsyncStorage =
        require('@react-native-async-storage/async-storage').default;
        const token = await AsyncStorage.getItem('authToken');
        const onboard = await AsyncStorage.getItem('hasOnboarded');
        if (!onboard) nextRoute = 'Home';
        else if (token) nextRoute = 'Home';
        else nextRoute = 'Home';
      } catch (err) {
        console.log(err);
      }

      setTimeout(() => {
        navigation.replace(nextRoute);
      }, 2000);
    }

    init();

    return () => {
      mounted = false;
    };
  }, [navigation]);

  return (
    <AppTemplate>
      <Text style={styles.title}>Driver</Text>

      <ActivityIndicator
        size="large"
        color="rgba(255,255,255,0.9)"
        style={{ marginTop: 12 }}
      />

      {appVersion ? (
        <Text style={styles.version}>v{appVersion}</Text>
      ) : null}
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
