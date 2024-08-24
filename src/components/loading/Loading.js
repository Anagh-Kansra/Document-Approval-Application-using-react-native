import { View, StyleSheet,Image, ActivityIndicator, Dimensions, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../utils/Colors';
import NetInfo from "@react-native-community/netinfo";
import LottieView from 'lottie-react-native'; // Import LottieView

// Make sure you have your Lottie animation JSON file imported
import NoInternetAnimation from './animation2.json';

export default function Loading() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', height: Dimensions.get('window').height, width: '100%' }}>
      {isConnected ? (
        <View style={styles.container}>
                <View style={styles.whiteCircle} />
                <View style={styles.spinnerContainer}>
                  <ActivityIndicator size={100} color={Colors.BLUE} />
                </View>
                <View style={styles.logoContainer}>
                  <Image
                    source={Images.LOGOS.SLOGO} // Add your logo image source here
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>

              </View>
      ) : (
        <View style={{ justifyContent: 'center', alignItems: 'center', height: Dimensions.get('window').height, width: '100%' }}>

          <LottieView
            source={NoInternetAnimation}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
            speed={0.5} // Adjust the speed as needed
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    zIndex: 1, // Ensure logo is on top of the spinners
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 55,
    height: 75,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    position: 'absolute',
    flexDirection: 'row',
    zIndex: 0, // Ensure spinners are behind the logo
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});