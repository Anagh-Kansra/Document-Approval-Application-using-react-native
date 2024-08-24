import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  FlatList,
  BackHandler,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import apiCaller from "../api/APICaller";
import Form from "../components/approvalDetails/Form";
import Loading from "../components/loading/Loading";
import Colors from "../utils/Colors";
import Orientation from 'react-native-orientation-locker';

export default function ApprovalDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const [len, setLen] = useState(0);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

    // CHANGE HERE:
    const [currentSectionIndex, setCurrentSectionIndex] = useState(
      route.params.index
    );

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
  }, [route.params]);

  const fetchData = async () => {
    setIsLoading(true);
    await apiCaller
      .ListData(route.params.Category)
      .then((resData) => {
        if (resData) {
          if (route.params.Dept) {
            const filteredData = resData.Data.filter(
              (item) =>
                item.RequestorDept.toLowerCase() ===
                route.params.Dept.toLowerCase()
            );
            setData(filteredData);
            setLen(filteredData.length);
          } else {
            setData(resData.Data);
            setLen(resData.Data.length);
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false); // Make sure to set refreshing to false when data fetching is completed
      });
  };

  useEffect(() => {
    // Lock the screen orientation to 'PORTRAIT' mode when the component mounts
    Orientation.lockToPortrait();

  }, []);

  const flatListRef = useRef(null);

  const onNextPress = useCallback(() => {
    if (currentSectionIndex < len - 1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentSectionIndex + 1,
      });
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  }, [currentSectionIndex, len]);

  const onBackPress = useCallback(() => {
    if (currentSectionIndex > 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentSectionIndex - 1,
      });
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  }, [currentSectionIndex]);

  const onScroll = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentSectionIndex(viewableItems[0].index);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View>
        <Loading />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Form
      key={item.DocumentNo}
      DocumentNo={item.DocumentNo}
      ApprovalCategory={route.params.Category}
      Dept={route.params.Dept}
    />
  );

    const getLayout = (data, index) => ({
      length: Dimensions.get("window").width,
      offset: Dimensions.get("window").width * index,
      index,
    });


  return (
    <View>
      <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}>
      <View
        style={[
          Style.Header,
          { justifyContent: "flex-start", alignItems: "center" ,height: '91%'},
        ]}
      >

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}
          style={{ paddingLeft: 20, width: "20%", position: "absolute" }}
        >
          <Icon name="arrow-back" size={24} color={Colors.BLACK} />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            height: 80,
            alignItems: "center",
            justifyContent: "center",
            //flex:1,
          }}
        >
          <TouchableOpacity onPress={onBackPress}>
            <Icon name="arrow-back" size={24} color={Colors.GRAY} />
          </TouchableOpacity>
          <Text
            style={{ color: Colors.BLACK, fontSize: 18, marginHorizontal: 25 }}
          >
            {currentSectionIndex + 1}/{len}
          </Text>
          <TouchableOpacity onPress={onNextPress}>
            <Icon name="arrow-forward" size={24} color={Colors.GRAY} />
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>

      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        initialNumToRender={2}
        onViewableItemsChanged={onScroll}

        // CHANGED HERE:
        getItemLayout={getLayout}
        initialScrollIndex={currentSectionIndex}

        keyExtractor={(item) => item.DocumentNo}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        maxToRenderPerBatch={6}
        windowSize={5}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps={"handled"}
      />
    </View>
  );
}