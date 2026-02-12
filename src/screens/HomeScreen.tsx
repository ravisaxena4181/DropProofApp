import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AppTemplate from '../components/Template';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <AppTemplate>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.signInButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>Registration</Text>
        </TouchableOpacity>

      </View>
    </AppTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  signInButton: {
    width: 198,
    backgroundColor: '#3D73D9',
    paddingVertical: 16,
    borderRadius: 26, 
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3, 
  },

  signInText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },

  registerButton: {
    width: 198,
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3D73D9',
  },

  registerText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
});
