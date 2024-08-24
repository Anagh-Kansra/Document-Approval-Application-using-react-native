import React, { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  BackHandler,
  Alert,
} from "react-native";
import { ScrollView as GestureScrollView } from "react-native-gesture-handler";
import apiCaller from "../../api/APICaller";
import Icon from "react-native-vector-icons/MaterialIcons";
import Images from "../../utils/Images.js";
import Colors from "../../utils/Colors.js";
import Loading from "../../components/loading/Loading";
import DecisionScreen from "../../components/loading/DecisionScreen";
import LottieView from "lottie-react-native";
import LoadingComponent from "../../components/loading/FileLoading";
import { LinearGradient } from "react-native-linear-gradient";
import { KeyboardAvoidingView } from "react-native";
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Form({ DocumentNo, ApprovalCategory, Dept }) {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [files, setFiles] = useState([]);
  const [compData, setCompData] = useState([]);
  const [history, setHistory] = useState([]);
  const [returnTo, setReturnTo] = useState([]);
  const [remarkData, setRemarkData] = useState({
    ApprovalMapID: "",
    Decision: "",
    Remarks: "",
    ReturnToEmpcode: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [showAllRows, setShowAllRows] = useState(false);
  const [toggleReturn, setToogleReturn] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [returnit, setReturnit] = useState(false);
  // Define an object mapping content types to image sources
  const contentTypeImages = {
    "application/pdf": Images.ICONS.PDF,
    "application/msword": Images.ICONS.WORD,
    "image/png": Images.ICONS.IMAGE,
    "image/jpeg": Images.ICONS.IMAGE,
    "application/vnd.ms-excel": Images.ICONS.SHEETS,
    "message/rfc822": Images.ICONS.EML,
  };

  // Define a default image source for unknown content types
  const defaultImage = Images.ICONS.UNKNOWN;

  const RemarkRef = useRef(null);

  const handleDecision = (decision) => {
    // Navigate to the DecisionScreen and pass the decision as a parameter
    navigation.navigate("DecisionScreen", {
      decision,
      Category,
      VERTICAL_NAME,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const resData = await apiCaller.TableData(DocumentNo, ApprovalCategory);
      if (resData) {
        setData(resData.Data.Data_Header[0].FieldsList);
        setCompData(resData);
        setRemarkData({ ...remarkData, ApprovalMapID: resData.ApprovalMapID });
      }

      const historyData = await apiCaller.approvalHistory(
        DocumentNo,
        ApprovalCategory
      );
      if (historyData) {
        setHistory(historyData.Data);
      }

      const filesData = await apiCaller.GetAttachedFiles(
        DocumentNo,
        ApprovalCategory
      );
      if (resData) {
        setFiles(filesData.Data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // ADDED THESE FUNCTIONS
  const handleApprove = () => {
    // Update state
    setRemarkData({ ...remarkData, ReturnToEmpcode: "", Decision: "App" });
  };

  useEffect(() => {
    // Check if the Decision state is "App"
    if (remarkData.Decision === "App") {
      // Call the API if the Decision state is "App"
      postReturnAPI().then(() => {
        // Navigate to the animation screen after successful API call
        navigation.navigate("DecisionScreen", {
          decision: "Approved",
          Category: ApprovalCategory,
          VERTICAL_NAME: Dept,
        });
      });
    }
  }, [remarkData.Decision]); // Run this effect when the Decision state changes

  const handleReject = () => {
    // Update state
    setRemarkData({ ...remarkData, ReturnToEmpcode: "", Decision: "Rej" });
  };

  useEffect(() => {
    // Check if the Decision state is "Rej"
    if (remarkData.Decision === "Rej") {
      // Call the API if the Decision state is "Rej"
      postReturnAPI().then(() => {
        // Navigate to the animation screen after successful API call
        navigation.navigate("DecisionScreen", {
          decision: "Rejected",
          Category: ApprovalCategory,
          VERTICAL_NAME: Dept,
        });
      });
    }
  }, [remarkData.Decision]); // Run this effect when the Decision state changes

  useEffect(() => {
    // Check if the Decision state is "Ret"
    if (returnit) {
      // Call the API if the Decision state is "Ret"
      postReturnAPI().then(() => {
        // Navigate to the animation screen after successful API call
        navigation.navigate("DecisionScreen", {
          decision: "Returned",
          Category: ApprovalCategory,
          VERTICAL_NAME: Dept,
        });
      });
    }
  }, [returnit]); // Run this effect when the Decision state changes

  const getData = async () => {
    setToogleReturn(!toggleReturn);
    const resData = await apiCaller.returnToList(DocumentNo, ApprovalCategory);
    if (resData) {
      setReturnTo(resData.Data);
      // Call postReturnAPI and show Alert after it completes
    }
  };

  const handlereturnbtn = async (approverName) => {
    Alert.alert(
      "Are you sure you want to RETURN to " + approverName + " ?",
      null,
      [
        {
          text: "Yes",
          onPress: () => {
            // Update the state to trigger the API call and navigation
            setReturnit(true);
          },
        },
        {
          text: "No",
          onPress: () => {
            RemarkRef.current.focus();
          },
        },
      ]
    );
  };

  // TILL HERE

  const postReturnAPI = async () => {
    const resData = await apiCaller.postRemark({ data: remarkData });
    const myArray = await AsyncStorage.getItem("UserApprovalHistory");
    if (myArray) {
      var datetime = new Date().toLocaleString();
      var newArray = [];
      if (JSON.parse(myArray).length >= 5) {
        newArray = [
          {
            DocumentNo: DocumentNo,
            Decision: remarkData.Decision,
            DateTime: datetime,
          },
          ...JSON.parse(myArray).slice(0, 4),
        ];
      } else {
        newArray = [
          {
            DocumentNo: DocumentNo,
            Decision: remarkData.Decision,
            DateTime: datetime,
          },
          ...JSON.parse(myArray),
        ];
      }
      await AsyncStorage.setItem(
        "UserApprovalHistory",
        JSON.stringify(newArray)
      );
      // console.log(newArray);
    }
    if (resData) {
      console.log("Posted Successfully");
    } else {
      console.log("Error");
    }
  };

  const handleShowMore = () => {
    setShowAllRows(true);
  };

  const handleShowLess = () => {
    setShowAllRows(false);
  };

  const handleShowFullHistory = () => {
    setShowFullHistory(true);
  };

  const handleShowFirstIndex = () => {
    setShowFullHistory(false);
  };

  if (isLoading) {
    return (
      <View style={{ width: Dimensions.get("window").width }}>
        <Loading />
      </View>
    );
  }

  if (isFileLoading) {
    return (
      <View style={{ width: Dimensions.get("window").width }}>
        <LoadingComponent />
      </View>
    );
  }

  const fileprev = async (url) => {
    setIsFileLoading(true); // Set isLoading to true when file preview starts

    try {
      const f2 = url.split("/");
      const fileName = f2[f2.length - 1];
      const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const options = {
        fromUrl: url,
        toFile: localFile,
      };

      await RNFS.downloadFile(options).promise;
      await FileViewer.open(localFile);
    } catch (error) {
      // Handle error
      console.error("Error during file preview:", error);
    } finally {
      setIsFileLoading(false); // Set isLoading to false after file preview is done or if there's an error
    }
  };

  const isRemarksFilled = remarkData.Remarks.trim() !== "";

  const remarksContainerStyle = {
    borderColor: buttonPressed && !isRemarksFilled ? "red" : Colors.BLACK,
  };

  const remarksTextStyle =remarkData.Remarks.trim() === ""? { color: "red" }: { color: Colors.BLACK };

  return (
    <View
      style={{
        flex: 1,
        width: Dimensions.get("window").width,
        height: "100%",
        paddingBottom: 100,
      }}
    >
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        //onPress={Keyboard.dismiss}
        //accessible={false}
      >
        <View>
          <GestureScrollView
            nestedScrollEnabled={true}
            automaticallyAdjustKeyboardInsets={true}
            style={{}}
            showsVerticalScrollIndicator={false}
          >
            <View>
              <View style={styles.container}>
                <View style={styles.row}>
                  {data.slice(0, showAllRows ? data.length : 6).map((item) => (
                    <View style={styles.cell} key={item.ColumnName.toString()}>
                      <Text
                        style={{
                          color: Colors.BLACK,
                          borderRightWidth: 1,
                          width: "30%",
                          textAlign: "center",
                          padding: 5,
                          fontSize: 14,
                          backgroundColor: Colors.LiGHTGRAY,
                        }}
                      >
                        {item.ColumnName}
                      </Text>
                      <Text
                        style={{
                          color: Colors.BLACK,
                          width: "70%",
                          textAlign: "center",
                          fontSize: 15,
                          padding: 5,
                        }}
                      >
                        {item.ColumnValue}
                      </Text>
                    </View>
                  ))}
                </View>
                {data.length >= 7 &&
                  (!showAllRows ? (
                    <TouchableOpacity
                      onPress={handleShowMore}
                      style={styles.moreButton}
                    >
                      <Text style={styles.moreText}>...more</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={handleShowLess}
                      style={styles.moreButton}
                    >
                      <Text style={styles.moreText}>...less</Text>
                    </TouchableOpacity>
                  ))}

                <TouchableOpacity
                  onPress={() => {
                    const params = {
                      DocumentNo: DocumentNo,
                      Category: ApprovalCategory,
                      Item: "Item", // Default value
                    };

                    if (
                      compData.Data.Data_Detail &&
                      compData.Data.Data_SubDetail
                    ) {
                      // If Data_Detail exists, add parameters for "Item"
                      params.DocumentNo1 = DocumentNo;
                      params.Category1 = ApprovalCategory;
                      params.Item1 = "Item";
                      params.NoOfItems = compData.Data.Data_Detail.length;
                      params.DocumentNo2 = DocumentNo;
                      params.Category2 = ApprovalCategory;
                      params.Item2 = "SubItem";
                      params.NoOfSubitems = compData.Data.Data_SubDetail.length;
                    } else if (
                      compData.Data.Data_Detail &&
                      !compData.Data.Data_SubDetail
                    ) {
                      // If Data_Detail doesn't exist, add parameters for "SubItem"
                      params.DocumentNo1 = DocumentNo;
                      params.Category1 = ApprovalCategory;
                      params.Item1 = "Item";
                      params.NoOfItems = compData.Data.Data_Detail.length;
                    }

                    navigation.navigate("Item", params);
                  }}
                  style={styles.item2}
                >
                  <Text style={{ color: Colors.BLACK, fontSize: 15 }}>
                    No. of Items - {compData.Data.Data_Detail.length}
                    {compData.Data.Data_SubDetail &&
                      compData.Data.Data_SubDetail.length > 0 && (
                        <>
                          <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                            {" "}
                            |{" "}
                          </Text>
                          <Text>
                            No. of Subitems -{" "}
                            {compData.Data.Data_SubDetail.length}
                          </Text>
                        </>
                      )}
                  </Text>
                </TouchableOpacity>

                <View>
                  {history.length === 0 && (
                    <Text
                      style={{
                        color: Colors.BLACK,
                        fontSize: 17,
                        paddingTop: 15,
                        fontWeight: "bold",
                        color: "gray",
                      }}
                    >
                      * No Approval History *
                    </Text>
                  )}

                  {history.length === 1 && (
                    <View>
                      <View style={styles.de}>
                        <Text
                          style={{
                            color: Colors.BLACK,
                            width: "100%",
                            fontSize: 15,
                            fontWeight: "bold",
                          }}
                        >
                          Approval Flow Details-
                        </Text>
                      </View>
                      <LinearGradient
                        colors={getGradientColors(
                          history[0].ApproverDecisionStatus
                        )}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                          styles.approval,
                          getApprovalTileStyle(
                            history[0].ApproverDecisionStatus
                          ),
                        ]}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={[
                                styles.add,
                                { width: "35.2%", borderLeftWidth: 0 },
                              ]}
                            >
                              Date & Time
                            </Text>
                            <Text style={[styles.add, { width: "50%" }]}>
                              {history[0].ApproverActionDate}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            {history[0].ApproverDecisionStatus ===
                              "APPROVED" && (
                              <Image
                                source={Images.APPROVE_SCREEN_BTN.APPROVE}
                                style={{
                                  width: 30,
                                  height: 30,
                                  marginRight: 5,
                                  marginTop: 5,
                                }}
                              />
                            )}
                            {history[0].ApproverDecisionStatus === "RETURN" && (
                              <Image
                                source={Images.APPROVE_SCREEN_BTN.HISTORY}
                                style={{
                                  width: 30,
                                  height: 30,
                                  marginRight: 5,
                                  marginTop: 5,
                                }}
                              />
                            )}
                            {history[0].ApproverDecisionStatus !== "APPROVED" &&
                              history[0].ApproverDecisionStatus !==
                                "RETURN" && (
                                <Image
                                  source={Images.BUTTONS.SKIP}
                                  style={{
                                    width: 30,
                                    height: 30,
                                    marginRight: 5,
                                    marginTop: 5,
                                  }}
                                />
                              )}
                          </View>
                        </View>
                        <View style={{ width: "100%", flexDirection: "row" }}>
                          <Text
                            style={[
                              styles.add,
                              { width: "30%", borderLeftWidth: 0 },
                            ]}
                          >
                            By
                          </Text>
                          <Text style={[styles.add, { width: "50%" }]}>
                            {history[0].ApproverName}
                          </Text>
                        </View>
                        <View style={{ width: "100%", flexDirection: "row" }}>
                          <Text
                            style={[
                              styles.add,
                              { width: "30%", borderLeftWidth: 0 },
                            ]}
                          >
                            Remarks
                          </Text>
                          <Text style={[styles.add, { width: "70%" }]}>
                            {history[0].ApproverRemarks}
                          </Text>
                        </View>
                      </LinearGradient>
                    </View>
                  )}

                  {history.length > 1 && (
                    <View>
                      <View style={styles.de}>
                        <Text
                          style={{
                            color: Colors.BLACK,
                            width: "100%",
                            fontSize: 15,
                            fontWeight: "bold",
                          }}
                        >
                          Approval Flow Details-
                        </Text>
                      </View>
                      {history
                        .slice(
                          showFullHistory ? 0 : history.length - 1,
                          history.length
                        )
                        .map((approval, index) => (
                          <View key={index}>
                            <LinearGradient
                              colors={getGradientColors(
                                approval.ApproverDecisionStatus
                              )}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={[
                                styles.approval,
                                getApprovalTileStyle(
                                  approval.ApproverDecisionStatus
                                ),
                              ]}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={[
                                      styles.add,
                                      { width: "35.2%", borderLeftWidth: 0 },
                                    ]}
                                  >
                                    Date & Time
                                  </Text>
                                  <Text style={[styles.add, { width: "50%" }]}>
                                    {approval.ApproverActionDate}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  {approval.ApproverDecisionStatus ===
                                    "APPROVED" && (
                                    <Image
                                      source={Images.APPROVE_SCREEN_BTN.APPROVE}
                                      style={{
                                        width: 30,
                                        height: 30,
                                        marginRight: 5,
                                        marginTop: 5,
                                      }}
                                    />
                                  )}
                                  {approval.ApproverDecisionStatus ===
                                    "RETURN" && (
                                    <Image
                                      source={Images.APPROVE_SCREEN_BTN.HISTORY}
                                      style={{
                                        width: 30,
                                        height: 30,
                                        marginRight: 5,
                                        marginTop: 5,
                                      }}
                                    />
                                  )}
                                  {approval.ApproverDecisionStatus !==
                                    "APPROVED" &&
                                    approval.ApproverDecisionStatus !==
                                      "RETURN" && (
                                      <Image
                                        source={Images.BUTTONS.SKIP}
                                        style={{
                                          width: 30,
                                          height: 30,
                                          marginRight: 5,
                                          marginTop: 5,
                                        }}
                                      />
                                    )}
                                </View>
                              </View>
                              <View
                                style={{
                                  alignItems: "center",
                                  flexDirection: "row",
                                }}
                              >
                                <Text
                                  style={[
                                    styles.add,
                                    { width: "30%", borderLeftWidth: 0 },
                                  ]}
                                >
                                  By
                                </Text>
                                <Text style={[styles.add, { width: "50%" }]}>
                                  {approval.ApproverName}
                                </Text>
                              </View>
                              <View
                                style={{ width: "100%", flexDirection: "row" }}
                              >
                                <Text
                                  style={[
                                    styles.add,
                                    { width: "30%", borderLeftWidth: 0 },
                                  ]}
                                >
                                  Remarks
                                </Text>
                                <Text style={[styles.add, { width: "70%" }]}>
                                  {approval.ApproverRemarks}
                                </Text>
                              </View>
                            </LinearGradient>
                            <View style={{ marginBottom: 10 }} />
                          </View>
                        ))}
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          marginRight: 10,
                        }}
                      >
                        {!showFullHistory && (
                          <TouchableOpacity onPress={handleShowFullHistory}>
                            <Text
                              style={{
                                textDecorationLine: "underline",
                                fontWeight: "bold",
                                color: Colors.BLUE,
                              }}
                            >
                              ...Show Full Approval History
                            </Text>
                          </TouchableOpacity>
                        )}
                        {showFullHistory && (
                          <TouchableOpacity onPress={handleShowFirstIndex}>
                            <Text
                              style={{
                                textDecorationLine: "underline",
                                fontWeight: "bold",
                                color: Colors.BLUE,
                              }}
                            >
                              ...Show Less
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )}
                </View>

                {!files || files.length === 0 ? (
                  <View style={{ alignItems: "flex-start" }}>
                    <Text
                      style={{
                        color: "gray",
                        fontWeight: "bold",
                        fontSize: 17,
                        marginTop: 10,
                      }}
                    >
                      * No files Attached *
                    </Text>
                  </View>
                ) : (
                  <View style={{ width: "100%" }}>
                    <View style={styles.de}>
                      <Text
                        style={{
                          color: Colors.BLACK,
                          width: "100%",
                          fontSize: 15,
                          fontWeight: "bold",
                          marginBottom: 5,
                        }}
                      >
                        Files Attached ({files.length})-
                      </Text>
                    </View>
                    <View style={styles.files}>
                      {files.map((item) => (
                        <View key={item.FileName} style={styles.infiles}>
                          <TouchableOpacity
                            onPress={() => fileprev(item.FilePath)}
                          >
                            <View style={styles.fileContent}>
                              <Image
                                source={
                                  contentTypeImages[item.ContentType] ||
                                  defaultImage
                                }
                                style={styles.fileIcon}
                              />
                              <Text numberOfLines={1} style={styles.fileName}>
                                {item.FileName}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.re}>
                  <Text
                    style={[
                      { color: Colors.BLACK, fontSize: 15, fontWeight: "bold" },
                      buttonPressed && !isRemarksFilled && { color: "red" },
                    ]}
                  >
                    *Remarks{" "}
                    <Text
                      style={[
                        { fontSize: 15, fontStyle: "italic", color: "red" },
                      ]}
                    >
                      (mandatory){" "}
                    </Text>
                    <Text>-</Text>
                  </Text>
                </View>

                <View style={[styles.rema, remarksContainerStyle]}>
                  <LinearGradient
                    colors={["#D3D3D3", "#EEEEEE"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ flex: 1, borderRadius: 5 }}
                  >
                    <KeyboardAvoidingView
                      style={{ flex: 1 }}
                      behavior={Platform.OS === "ios" ? "padding" : "height"}
                    >
                      <TextInput
                        ref={RemarkRef}
                        style={{
                          color: Colors.BLACK,
                          height: "100%",
                          fontSize: 15,
                          padding: 5,
                          textAlignVertical: "top",
                        }}
                        returnKeyType="done"
                        blurOnSubmit={true}
                        multiline={true}
                        value={remarkData.Remarks}
                        onChangeText={(val) => {
                          setRemarkData({ ...remarkData, Remarks: val });
                        }}
                      />
                    </KeyboardAvoidingView>
                  </LinearGradient>
                </View>
              </View>
            </View>
          </GestureScrollView>
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              //paddingBottom: 0,
              paddingRight: 20,
            }}
          >
            {returnTo.length > 0 ? (
              <View
                style={[
                  {
                    width: 200,
                    alignItems: "center",
                    height: "auto",
                    backgroundColor: Colors.WHITE,
                    borderWidth: 0.5,
                    borderCurve: 5,
                    borderColor: Colors.BLACK,
                  },
                  toggleReturn ? { display: "flex" } : { display: "none" },
                ]}
              >
                {returnTo.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{ width: "100%" }}
                    onPress={() => (
                      setRemarkData({
                        ...remarkData,
                        ReturnToEmpcode: item.ApproverEmpcode,
                        Decision: "Ret",
                      }),
                      handlereturnbtn(item.ApproverName)
                    )}
                  >
                    <Text
                      style={{
                        color: Colors.BLACK,
                        fontSize: 15,
                        width: "100%",
                        textAlign: "center",
                        paddingVertical: 10,
                        borderBottomWidth: 0.5,
                      }}
                    >
                      {item.ApproverName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View
                style={[
                  {
                    width: 200,
                    alignItems: "center",
                    height: "auto",
                    backgroundColor: Colors.WHITE,
                    borderWidth: 0.5,
                    borderCurve: 5,
                    borderColor: Colors.BLACK,
                  },
                  toggleReturn ? { display: "flex" } : { display: "none" },
                ]}
              >
                <Text
                  style={{
                    color: Colors.BLACK,
                    fontSize: 15,
                    width: "100%",
                    textAlign: "center",
                    paddingVertical: 10,
                    borderBottomWidth: 0.5,
                  }}
                >
                  No Data to Show
                </Text>
              </View>
            )}

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                activeOpacity={isRemarksFilled ? 1 : 0.6}
                onPress={() => {
                  if (isRemarksFilled) {
                    Alert.alert("Sure you want to APPROVE ?", null, [
                      {
                        text: "Yes",
                        onPress: handleApprove,
                      },
                      {
                        text: "No",
                        onPress: () => {
                          RemarkRef.current.focus();
                        },
                      },
                    ]);
                  } else {
                    RemarkRef.current.focus();
                  }
                  setButtonPressed(true);
                }}
              >
                <Image
                  source={Images.APPROVE_SCREEN_BTN.APPROVE}
                  style={{
                    width: 50,
                    height: 50,
                    opacity: isRemarksFilled ? 1 : 0.2,
                  }}
                />
                <Text
                  style={{ textAlign: "center", fontSize: 12, color: "green" }}
                >
                  Approve
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={isRemarksFilled ? 1 : 0.5}
                onPress={() => {
                  if (isRemarksFilled) {
                    getData(); // Call getData first
                  } else {
                    RemarkRef.current.focus();
                  }
                  setButtonPressed(true);
                  setToogleReturn(!toggleReturn);
                }}
                style={{ marginLeft: 10 }}
              >
                <Image
                  source={Images.APPROVE_SCREEN_BTN.HISTORY}
                  style={{
                    width: 50,
                    height: 50,
                    opacity: isRemarksFilled ? 1 : 0.2,
                  }}
                />
                <Text
                  style={{ textAlign: "center", fontSize: 12, color: "orange" }}
                >
                  Return
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={isRemarksFilled ? 1 : 0.5}
                onPress={() => {
                  if (isRemarksFilled) {
                    Alert.alert("Are you sure you want to REJECT?", null, [
                      {
                        text: "Yes",
                        onPress: handleReject,
                      },
                      {
                        text: "No",
                        onPress: () => {
                          RemarkRef.current.focus();
                        },
                      },
                    ]);
                  } else {
                    RemarkRef.current.focus();
                  }
                  setButtonPressed(true);
                }}
                style={{ marginLeft: 10 }}
              >
                <Image
                  source={Images.APPROVE_SCREEN_BTN.REJECT}
                  style={{
                    width: 50,
                    height: 50,
                    opacity: isRemarksFilled ? 1 : 0.2,
                  }}
                />
                <Text
                  style={{ textAlign: "center", fontSize: 12, color: "red" }}
                >
                  Reject
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
    color: Colors.BLACK,
    width: "100%",
    alignItems: "center",
  },
  row: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 10,
    color: Colors.BLACK,
    width: "100%",
    borderWidth: 0.5,
    borderColor: Colors.BLACK,
  },
  cell: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: Colors.BLACK,
    width: "100%",
  },
  moreButton: {
    marginTop: 10,
    alignSelf: "flex-end",
    marginRight: 10,
  },
  moreText: {
    color: Colors.BLUE,
    fontSize: 16,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  item2: {
    backgroundColor: Colors.LiGHTGRAY,
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: Colors.BLACK,
    marginTop: 14,
    paddingTop: 9,
    alignItems: "center",
    color: Colors.BLACK,
  },
  add: {
    fontSize: 15,
    paddingLeft: 5,
    marginBottom: 5,
    borderLeftWidth: 1,
    color: Colors.BLACK,
  },
  de: {
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 2,
    width: "100%",
  },
  approval: {
    width: "100%",
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: Colors.BLACK,
    marginTop: 4,
    flexDirection: "column",
    borderRadius: 5,
    marginBottom: 10,
  },
  files: {
    marginRight: 0,
    width: "100%",
    marginTop: 5,
    borderColor: Colors.BLACK,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  infiles: {
    width: "auto",
    alignItems: "center",
    margin: 5,
  },
  fileContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileIcon: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
  fileName: {
    color: Colors.BLACK,
    paddingRight: 25,
    flexShrink: 1,
  },
  re: {
    marginTop: 20,
    width: "100%",
    marginBottom: 5,
  },
  rema: {
    borderWidth: 1,
    borderColor: Colors.BLACK,
    width: "100%",
    height: 150,
    marginBottom: 120,
    color: Colors.BLACK,
  },
});

// Function to dynamically generate styles for approval tiles based on decision status
function getApprovalTileStyle(decisionStatus) {
  switch (decisionStatus) {
    case "APPROVED":
      return {
        backgroundColor: "rgba(0,255,0,0.3)",
        // Adjust the rgba values to change the color and transparency
      };
    case "RETURN":
      return {
        backgroundColor: "rgba(255,255,0,0.5)",
        // Adjust the rgba values to change the color and transparency
      };
    default:
      return {};
  }
}

// Function to get gradient colors based on decision status
function getGradientColors(decisionStatus) {
  switch (decisionStatus) {
    case "APPROVED":
      return ["#D0F0C0", "#FFFFFF"]; // Green to White gradient
    case "RETURN":
      return ["#FFFAA0", "#FFFFFF"]; // Yellow to White gradient
    default:
      return ["#C0C0C0", "#FFFFFF"]; // Default gradient
  }
}