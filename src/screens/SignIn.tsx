import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { loginUser } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

export default function SignIn({ navigation }: Props) {
  const [remember, setRemember] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (key: 'username' | 'password', value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleLogin = async () => {
    const { username, password } = formData;

    if (!username || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        username,
        password,
      });

      console.log('Login Success:', response);
      await AsyncStorage.setItem('token', response.data.token);
      navigation.replace('Profile');
    } catch (error: any) {
      console.log('LOGIN ERROR:', error);
      Alert.alert('Error', error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="x" size={22} color="#000" />
      </TouchableOpacity>

      <View style={styles.topContent}>
        <Text style={styles.title}>welcome back</Text>

        <View style={styles.divider} />

        <View style={styles.inputWrapper}>
          <Feather name="mail" size={18} color="#777" style={styles.icon} />
          <TextInput
            placeholder="User id or email"
            placeholderTextColor="#aaa"
            style={styles.input}
            autoCapitalize="none"
            value={formData.username}
            onChangeText={text => handleChange('username', text)}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Feather name="lock" size={18} color="#777" style={styles.icon} />
          <TextInput
            placeholder="password"
            placeholderTextColor="#aaa"
            secureTextEntry
            style={styles.input}
            value={formData.password}
            onChangeText={text => handleChange('password', text)}
          />
        </View>

        <TouchableOpacity style={styles.forgotContainer}>
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setRemember(!remember)}
        >
          <View style={[styles.checkbox, remember && styles.checkboxActive]}>
            {remember && <Feather name="check" size={14} color="#fff" />}
          </View>
          <Text style={styles.rememberText}>Remember me next time</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.loginText}>Log in</Text>
              <Feather name="arrow-right" size={18} color="#fff" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.bottomRow}>
          <Text style={{ color: '#777' }}>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Register now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 28,
  },

  closeButton: {
    position: 'absolute',
    top: 60,
    right: 28,
  },

  topContent: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 60,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 25,
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 40,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 28,
  },

  icon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },

  forgotContainer: {
    marginTop: -10,
    marginBottom: 30,
  },

  forgotText: {
    color: '#3D73D9',
    fontSize: 13,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  checkboxActive: {
    backgroundColor: '#3D73D9',
    borderColor: '#3D73D9',
  },

  rememberText: {
    fontSize: 14,
    color: '#777',
  },

  bottomSection: {
    paddingBottom: 40,
  },

  loginButton: {
    backgroundColor: '#000',
    paddingVertical: 18,
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },

  loginText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },

  linkText: {
    color: '#3D73D9',
    fontWeight: '600',
  },
});
