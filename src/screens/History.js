import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  BackHandler,
  StyleSheet,
  RefreshControl,
  Image,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Style from "../utils/Style";
import Images from "../utils/Images";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HistoryData = () => {
  const [dataFrame, setDataFrame] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const emptyDataFrame = createEmptyDataFrame(5);
    setDataFrame(emptyDataFrame);

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBack
    );
    return () => backHandler.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchHistoryOnFocus = async () => {
        setRefreshing(true);
        await fetchHistory();
        setRefreshing(false);
      };

      fetchHistoryOnFocus();
    }, [])
  );

  const fetchHistory = async () => {
    const historyData = await AsyncStorage.getItem("UserApprovalHistory");
    if (historyData) {
      setDataFrame(JSON.parse(historyData));
      console.log(JSON.parse(historyData));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    let decisionImage;
    switch (item.Decision) {
      case "Ret":
        decisionImage = Images.APPROVE_SCREEN_BTN.HISTORY;
        break;
      case "Rej":
        decisionImage = Images.APPROVE_SCREEN_BTN.REJECT;
        break;
      case "App":
        decisionImage = Images.APPROVE_SCREEN_BTN.APPROVE;
        break;
      default:
        decisionImage = null;
    }

    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{item.DocumentNo}</Text>
        <View style={[styles.cell, styles.decisionContainer]}>
          {decisionImage && (
            <Image source={decisionImage} style={styles.decisionImage} />
          )}
          <Text style={styles.decisionText}>{item.Decision}</Text>
        </View>
        <Text style={[styles.cell, styles.lastCell]}>{item.DateTime}</Text>
      </View>
    );
  };

  const handleBack = () => {
    navigation.navigate("Home");
    return true;
  };

  const createEmptyDataFrame = (rowCount) => {
    const emptyRows = [];
    for (let i = 0; i < rowCount; i++) {
      const emptyRow = {
        docno: "",
        decision: "",
        datetime: "",
      };
      emptyRows.push(emptyRow);
    }
    return emptyRows;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Approval History Info</Text>
      </View>

      <View style={styles.columnHeaders}>
        <Text style={styles.columnHeader}>Document No</Text>
        <Text style={styles.columnHeader}>Decision</Text>
        <Text style={[styles.columnHeader, styles.lastColumnHeader]}>
          Date & Time
        </Text>
      </View>

      <FlatList
        data={dataFrame}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  columnHeaders: {
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  columnHeader: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  lastColumnHeader: {
    borderRightWidth: 0,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  decisionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  decisionImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  decisionText: {
    fontSize: 14,
  },
});

export default HistoryData;
