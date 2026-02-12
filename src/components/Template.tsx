import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';

const icons = [
  {
    source: require('../assests/logo_dropodd_1.png'),
    width: 351,
    height: 138,
    top: 184,
    left: 13,
  },
  {
    source: require('../assests/1216d97b53e4e1443bcf239279c79ebcae2b1c49.png'),
    width: 358,
    height: 205,
    top: 607,
    left: 4,
  },
];

interface AppTemplateProps {
  children: React.ReactNode;
}

const AppTemplate: React.FC<AppTemplateProps> = ({ children }) => {
  return (
    <ImageBackground
      source={require('../assests/image.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {icons.map((icon, index) => (
        <Image
          key={index}
          source={icon.source}
          style={[
            styles.icon,
            {
              top: icon.top,
              left: icon.left,
              width: icon.width,
              height: icon.height,
            },
          ]}
          resizeMode="contain"
        />
      ))}

      <View style={styles.content}>
        {children}
      </View>
    </ImageBackground>
  );
};

export default AppTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    opacity: 0.99,
  },
});
