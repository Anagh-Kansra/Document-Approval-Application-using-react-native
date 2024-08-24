import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Image, ImageBackground, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import Images from '../utils/Images';
import Colors from '../utils/Colors';
import Orientation from 'react-native-orientation-locker';

const SplashScreen = () => {
  const navigation = useNavigation(); // Navigation hook

  useEffect(() => {
    // Simulate some loading time before navigating to the login page
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 1500); // Adjust the duration as needed

    return () => clearTimeout(timer);
  }, [navigation]);

  useEffect(() => {
    // Lock the screen orientation to 'PORTRAIT' mode when the component mounts
    Orientation.lockToPortrait();
  }, []);


  return (
    <ImageBackground
      source={Images.BACKGROUND_LOGIN} // Background image source
      style={{ flex: 1, width: '100%', height: '100%' }}
      imageStyle={{ opacity: 0.4 }} // Adjust opacity for transparency
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={Images.LOGOS.SLOGO} // Add your logo image source here
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.whiteCircle} />
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={300} color={Colors.BLUE} />
        </View>
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={350} color={Colors.RED} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -100 }], // Adjust based on logo size
    zIndex: 1, // Ensure logo is on top of the spinners
  },
  logo: {
    width: 150,
    height: 200,
  },
  spinnerContainer: {
    position: 'absolute',
    flexDirection: 'row',
    zIndex: 0, // Ensure spinners are behind the logo
  },
  whiteCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -100,
    marginTop: -100,
    zIndex: 0,
  },
});

export default SplashScreen;
