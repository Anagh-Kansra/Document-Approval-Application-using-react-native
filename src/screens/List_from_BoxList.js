import React, { useState, useEffect } from "react";
import { View, BackHandler, RefreshControl, Text, TouchableOpacity } from "react-native";
import SwipeableFlatList from "react-native-swipeable-list";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect hook
import apiCaller from "../api/APICaller";
import MainHeader from "../components/headers/MainHeader";
import Row from "../components/listcmp/Row";
import Heading from "../components/listcmp/Heading";
import Loading from "../components/loading/Loading";
import Orientation from 'react-native-orientation-locker';

export default function List() {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    fetchData();
  }, [refreshing, route.params.Category, route.params.VERTICAL_NAME]); // Include route.params.Category and route.params.VERTICAL_NAME in the dependency array

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await apiCaller.ListData(route.params.Category);
      if (res.HasPendingApprovals) {
        setCompleteData(res.Data);
        setData(res.Data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (completeData.length > 0) {
      if (route.params.VERTICAL_NAME) {
        const filteredData = completeData.filter(
          (item) =>
            item.RequestorDept.toLowerCase() ===
            route.params.VERTICAL_NAME.toLowerCase()
        );
        setData(filteredData);
      } else {
        setData(completeData);
      }
    } else {
      setData([]);
    }
  }, [completeData, route.params.VERTICAL_NAME]);

  const onRefresh = () => {
    setRefreshing(true);
  };

  useEffect(() => {
    setData(
      completeData.filter(
        (item) =>
          item.RequestorDept.toLowerCase().includes(
            searchQuery.toLowerCase()
          ) || item.DocumentNo.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  useEffect(() => {
    // Lock the screen orientation to 'PORTRAIT' mode when the component mounts
    Orientation.lockToPortrait();
  }, []);

  // Function to handle navigation to approval details page
  const navigateToApprovalDetail = (docNo) => {
    navigation.navigate("ApprovalDetail", { docNo });
  };

  // Use useFocusEffect to refetch data whenever the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  if (isLoading) {
    return (
      <View>
        <Loading />
      </View>
    );
  }

  return (
    <View>
      <MainHeader
        prop={"Home"}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Heading
        item={{ dep: "Dept.", number: "Doc. No.", value: "App. value" }}
      />
      <SwipeableFlatList
        data={data}
        contentContainerStyle={{}}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => navigateToApprovalDetail(item.DocNo)}>
            <Row
              item={item}
              prop={{
                Category: route.params.Category,
                Dept: route.params.VERTICAL_NAME,
                index: index,
              }}
              key={index}
            />
          </TouchableOpacity>
        )}
        style={{ marginBottom: "auto" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
