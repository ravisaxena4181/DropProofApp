import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { registerUser } from '../api/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

type RegisterForm = {
  username: string;
  email: string;
  password: string;
};

export default function Register({ navigation }: Props) {
  const [checked, setChecked] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterForm>({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (key: keyof RegisterForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRegister = async () => {
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (!checked) {
      Alert.alert('Error', 'Please accept terms and conditions');
      return;
    }

    try {
      setLoading(true);

      const response = await registerUser({
        ...formData,
        companyId: 1,
        userRole: 'Driver',
        team: 'Delivery',
      });

      console.log('Success:', response);
      Alert.alert('Success', 'Registered successfully');

      navigation.replace('SignIn');
    } catch (error: any) {
      console.log(error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="x" size={22} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Let's get started!</Text>

      <View style={styles.inputWrapper}>
        <Icon name="user" size={18} color="#777" style={styles.icon} />
        <TextInput
          placeholder="Name"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={formData.username}
          onChangeText={(text) => handleChange('username', text)}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Icon name="mail" size={18} color="#777" style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Icon name="lock" size={18} color="#777" style={styles.icon} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
        />
      </View>

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setChecked(!checked)}
      >
        <View style={[styles.checkbox, checked && styles.checkboxActive]}>
          {checked && <Icon name="check" size={14} color="#fff" />}
        </View>
        <Text style={styles.termsText}>
          You agree to the following terms and conditions
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.registerButton,
          loading && { opacity: 0.7 },
        ]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.registerText}>Register now</Text>
            <Icon name="arrow-right" size={18} color="#fff" />
          </>
        )}
      </TouchableOpacity>

      <View style={styles.bottomRow}>
        <Text style={{ color: '#777' }}>
          Do you have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.linkText}>Sign in now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    backgroundColor: '#fff',
    gap: 20,
  },

  closeButton: {
    position: 'absolute',
    right: 24,
    top: 50,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 40,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 25,
  },

  icon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  checkboxActive: {
    backgroundColor: '#3D73D9',
    borderColor: '#3D73D9',
  },

  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#777',
  },

  registerButton: {
    marginTop: 40,
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  registerText: {
    color: '#fff',
    fontSize: 16,
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
