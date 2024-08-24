import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  BackHandler,
  Alert,
  RefreshControl,
  Dimensions,
  Text,
} from "react-native";
import SwipeableFlatList from "react-native-swipeable-list";
import HomeBox from "../components/homecmp/HomeBox";
import Header from "../components/headers/Header";
import apiCaller from "../api/APICaller";
import Loading from "../components/loading/Loading";
import Colors from "../utils/Colors";
import Orientation from 'react-native-orientation-locker';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook

export default function Home({ navigation }) {
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to Exit App?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    await apiCaller
      .HomeData()
      .then((resData) => {
        if (resData) {
          setData(resData.data);
          setCompleteData(resData.data);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    // Lock the screen orientation to 'PORTRAIT' mode when the component mounts
    Orientation.lockToPortrait();
  }, []);

    useEffect(() => {
      if (completeData && completeData.length > 0) {
        setData(
          completeData.filter((item) =>
            item.ApprovalCategory.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }
    }, [searchQuery, completeData]);


  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const toggleDrawer = () => {
    navigation.toggleDrawer(); // Function to toggle the navigation drawer
  };

  if (isLoading) {
    return (
      <View style={{}}>
        <Loading />
      </View>
    );
  }
  return (
    <View>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        toggleMenu={toggleDrawer}
      />
      {data ? (
      <View>
        <SwipeableFlatList
          data={data}
          contentContainerStyle={{ paddingBottom: 25 }}
          renderItem={({ item }) => (
            <HomeBox
              Category={item.ApprovalCategory}
              number={item.PendingCount}
              nt={"BoxList"}
              fs={26}
              prop={{ Category: item.ApprovalCategory,
               VERTICAL_NAME: null,
               }}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={(item, index) => index.toString()}
          style={{
            paddingTop: 25,
            marginBottom: "auto",
            height: Dimensions.get("window").height,
          }}
        />
        </View>
      ) : (
        <Text
          style={{
            color: Colors.GRAY,
            fontSize: 20,
            fontWeight: 500,
            textAlign: "center",
            marginTop: 50,
          }}
        >
          No Pending Requests
        </Text>
      )}
    </View>
  );
}
