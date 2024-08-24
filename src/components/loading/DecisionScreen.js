import React, { useEffect , useRef} from 'react';
import { View, Text , Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import LottieView from 'lottie-react-native';
import approvedAnimation from './approveanim.json';
import returnedAnimation from './returnanim.json';
import rejectedAnimation from './rejectanim2.json';
import Home from "./../../screens/Home.js";
import Images from "../../utils/Images.js";

const DecisionScreen = ({ route }) => {
  const { decision ,Category, VERTICAL_NAME} = route.params;
  const navigation = useNavigation(); // Get navigation object using useNavigation hook
  const zoomAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('List_from_BoxList', route.params); // Go back to the previous screen
    }, 3000); // 5000 milliseconds = 5 seconds

    // Clear the timer when the component unmounts or when the decision changes
    return () => clearTimeout(timer);
  }, [navigation]); // Include navigation in the dependency array to avoid stale closure

  useEffect(() => {
    const zoomIn = Animated.timing(zoomAnim, {
      toValue: 1.8,
      duration: 1500,
      useNativeDriver: true,
    });

    const zoomOut = Animated.timing(zoomAnim, {
      toValue: 0.8,
      duration: 1500,
      useNativeDriver: true,
    });

    const zoomAnimation = Animated.loop(
      Animated.sequence([zoomIn, zoomOut]),
      { iterations: -1 }
    );

    zoomAnimation.start();

    // Clear animation on component unmount
    return () => {
      zoomAnimation.stop();
    };
  }, []);

  // Render the appropriate Lottie animation based on the decision
  const renderAnimation = () => {
    switch (decision) {
      case 'Approved':
        return (
          <LottieView
            source={approvedAnimation}
            autoPlay
            loop={true}
            style={{ width: '70%', height: '70%' }}
          />
        );
      case 'Returned':
      return (
      <View style={{ width: '70%', height: '70%' ,justifyContent: 'center', alignItems: 'center' }}>
        <Animated.Image
          source={Images.APPROVE_SCREEN_BTN.HISTORY}
          style={{
            width: 125, // Adjust width and height as needed
            height: 125,
            //marginBottom: 50,
            transform: [{ scale: zoomAnim }], // Apply zoom animation
          }}
        />
      </View>
      );
      case 'Rejected':
        return (
          <LottieView
            source={rejectedAnimation}
            autoPlay
            loop={true}
            style={{ width: '70%', height: '70%' }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {renderAnimation()}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20 }}>
        {decision}
      </Text>
    </View>
  );
};

export default DecisionScreen;
