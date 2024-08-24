import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../utils/Colors';

export default function SideBar(props) {
  const [userName, setUserName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const getUserName = async () => {
      try {
        setUserName(await AsyncStorage.getItem('employeeName'));
        setEmployeeCode(await AsyncStorage.getItem('employeeCode')); // Retrieve employee code
      } catch (error) {
        console.error('Error retrieving user name: ', error);
      }
    };

    const fetchProfileImage = async () => {
      try {
        const empCode = await AsyncStorage.getItem('employeeCode');
        const response = await fetch(
          `https://apps.sonalika.com:7007/WebServiceDev/api/SONE/GetUserProfilePic?EmpCode=${empCode}&Token=uBylwJMQexOO6Wd3YSzQMspiZOSgyX3MV38nHDXtUmxu0MGESIEO26bblqwR1GrrFb3dZZuu6f7A66inioy1snV116crhfDo5gZ9TDP4nkTV0LgphjJMhB9rqcm4WcnZ`
        );
        const data = await response.json();
        setProfileImage(data.FilePath);
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    getUserName();
    fetchProfileImage();
  }, []);

  const saveProfileImage = async (imageUri) => {
    try {
      await AsyncStorage.setItem('profileImage', imageUri);
    } catch (error) {
      console.error('Error saving profile image:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // CHANGE HERE
      await AsyncStorage.removeItem('rememberedEmployeeCode');
      await AsyncStorage.removeItem('rememberedPassword');
      await AsyncStorage.removeItem('employeeCode');
      await AsyncStorage.removeItem('profileImage'); // Clear profile image on logout
      await AsyncStorage.removeItem('UserApprovalHistory');
      props.navigation.navigate('Login');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  // Function to get initials from user name
  const getInitials = (name) => {
    const words = name.split(' ');
    let initials = '';
    for (let i = 0; i < words.length; i++) {
      initials += words[i].charAt(0).toUpperCase();
    }
    return initials;
  };

  // Function to display profile image or initials
  const displayProfileImage = () => {
    if (profileImage) {
      return <Image source={{ uri: profileImage }} style={styles.userIcon} />;
    } else {
      return (
        <View style={[styles.userIcon, { backgroundColor: 'silver' }]}>
          <Text style={styles.initials}>{getInitials(userName)}</Text>
        </View>
      );
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>

          <View style={styles.userInfo}>
            {displayProfileImage()}
          </View>
            <View style={styles.userInfoText}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.employeeCode}>{employeeCode}</Text>
            </View>
          <View style={styles.horizontalLine} />
      </View>
      <DrawerItem
        label="HomeScreen"
        onPress={() => props.navigation.navigate('Home', { screen: 'Home' })}
        icon={({ color, size }) => <Icon name="home" size={size} color={color} />}
        labelStyle={styles.drawerItemLabel}
      />
      <DrawerItem
        label="History Info"
        onPress={() => props.navigation.navigate('History', { screen: 'History' })}
        icon={({ color, size }) => <Icon name="history" size={size} color={color} />}
        labelStyle={styles.drawerItemLabel}
      />
      <DrawerItem
        label="Log Out"
        onPress={handleLogout}
        icon={({ color, size }) => <Icon name="sign-out" size={size} color={color} />}
        labelStyle={styles.drawerItemLabel}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    paddingVertical: '15%',
    paddingHorizontal: '10%',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    //marginRight: 10,
    borderWidth: 1, // Add border
    borderColor: Colors.BLACK, // Border color
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0', // Add background color
  },
  userIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1, // Add border
    borderColor: 'dimgray', // Border color
    //marginRight: 10,
  },
  userInfoText: {
    marginTop: '15%',
    flex: 1,
    flexDirection: 'column',
    //marginLeft: 10,
  },
  userName: {
    color: 'gray',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  employeeCode: {
    color: Colors.BLACK,
    fontSize: 16,
    flexWrap: 'wrap',
    textAlign: 'center',
    marginTop: '5%',
  },
  drawerItemLabel: {
    fontSize: 16,
    marginLeft: '-10%',
  },
  initials: {
    marginTop: '30%',
    //paddingVertical: '27%',
    height:100,
    width:100,
    textAlign:'center',
    position:'absolute',
    color: Colors.WHITE,
    fontSize: 30,
    fontWeight: 'bold',
    alignItems: 'center', // Center the initials text horizontally
    justifyContent: 'center',
  },
  horizontalLine: {
    borderBottomWidth: 2,
    borderBottomColor: 'darkgray', // Adjust color as needed
    marginTop: '12%', // Adjust margin as needed
    marginBottom: '-12%',
  },
});