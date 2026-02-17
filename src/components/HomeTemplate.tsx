import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

interface AppTemplateProps {
  children: React.ReactNode;
}

const HomeTemplate: React.FC<AppTemplateProps> = ({ children }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
            <Feather name="arrow-left" size={22} color="#000" />
          </TouchableOpacity>

          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={16} color="#3D73D9" />
            <Text style={styles.locationText} numberOfLines={1}>
              NSP, Pitampura, opposite the Delhi Haat
            </Text>
          </View>

          <TouchableOpacity>
            <Feather name="bell" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* PAGE CONTENT */}
        <View style={styles.content}>{children}</View>
      </View>
      {/* BOTTOM TAB */}
      <View style={styles.bottomTab}>
        <Feather name="user" size={22} color="#3D73D9" />
        <Feather name="credit-card" size={22} color="#999" />
        <TouchableOpacity
          onPress={() => navigation.navigate('DeliveriesScreen')}
        >
          <Feather name="file-text" size={22} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.homeTab}>
            <Feather name="home" size={20} color="#000" />
            <Text style={styles.homeText}>Home</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 10,
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },

  locationText: {
    fontSize: 12,
    color: '#3D73D9',
    marginLeft: 4,
  },

  content: {
    flex: 1,
  },

  bottomTab: {
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 10,
  },

  homeTab: {
    alignItems: 'center',
  },

  homeText: {
    fontSize: 10,
  },
});
