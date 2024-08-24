import React, { useEffect, useState } from 'react';
import { View, BackHandler, StyleSheet } from 'react-native';
import MainHeader from '../components/headers/MainHeader';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook
import Loading from '../components/loading/Loading';
import HomeBox from '../components/homecmp/BoxListBox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwipeableFlatList from 'react-native-swipeable-list';
import Orientation from 'react-native-orientation-locker';

const TOKEN = 'uBylwJMQexOO6Wd3YSzQMspiZOSgyX3MV38nHDXtUmxu0MGESIEO26bblqwR1GrrFb3dZZuu6f7A66inioy1snV116crhfDo5gZ9TDP4nkTV0LgphjJMhB9rqcm4WcnZ';

export default function BoxList() {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    fetchData();
  }, [route.params.Category]);

  const fetchData = async () => {
    try {
      const EmpCode = await AsyncStorage.getItem('employeeCode');
      const response = await fetch(
        `https://apps.sonalika.com:7007/WebServiceDev/api/SONE/GetPendingApprovalsList?EmpCode=${EmpCode}&ApprovalCategory=${route.params.Category}&Token=${TOKEN}`
      );
      const responseData = await response.json();
      if (responseData.HasPendingApprovals) {
        const countMap = {};
        const uniqueData = [];
        responseData.Data.forEach(item => {
          if (!countMap[item.RequestorDept]) {
            countMap[item.RequestorDept] = 1;
            uniqueData.push(item);
          } else {
            countMap[item.RequestorDept]++;
          }
        });
        const mappedData = uniqueData.map(item => ({
          ...item,
          count: countMap[item.RequestorDept],
        }));
        setData(mappedData);
        setFilteredData(mappedData);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Lock the screen orientation to 'PORTRAIT' mode when the component mounts
    Orientation.lockToPortrait();
  }, []);

  useEffect(() => {
    if (route.params && route.params.department) {
      const filteredData = data.filter(
        item =>
          item.RequestorDept.toLowerCase() ===
          route.params.department.toLowerCase(),
      );
      setFilteredData(filteredData);
    } else {
      const filteredData = data.filter(
        item =>
          item.RequestorDept.toLowerCase().includes(
            searchQuery.toLowerCase(),
          ) ||
          item.DocumentNo.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredData(filteredData);
    }
  }, [searchQuery, route.params.department, data]);

  const handleRequestorDeptClick = (dept) => {
    navigation.navigate('List_from_BoxList', { department: dept });
  };

  const renderItem = ({ item }) => (
    <HomeBox
      Category={item.RequestorDept}
      number={item.count}
      nt={'List_from_BoxList'}
      fs={22}
      prop={{
        Category: route.params.Category,
        VERTICAL_NAME: item.RequestorDept,
        onPress: () => handleRequestorDeptClick(item.RequestorDept),
      }}
    />
  );

  const handleReload = async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  };

  // Use useFocusEffect to refetch data whenever the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View>
      <MainHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <SwipeableFlatList
        data={filteredData}
        contentContainerStyle={styles.flatListContainer}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={handleReload}
        refreshing={refreshing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flatListContainer: {
    paddingTop: 25,
    marginBottom: 'auto',
    paddingBottom: 150,
  },
});
