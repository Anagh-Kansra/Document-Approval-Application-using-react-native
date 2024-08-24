import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./screens/Home.js";
import Login from "./screens/Login.js";
import SplashScreen from "./screens/SplashScreen.js";
import List from "./screens/List.js";
import BoxList from "./screens/BoxList.js";
import List_from_BoxList from "./screens/List_from_BoxList.js";
import ApprovalDetail from "./screens/ApprovalDetail.js";
import SideBar from "./components/headers/SidePanel.js";
import DecisionScreen from "./components/loading/DecisionScreen.js";
import Item from "./screens/Item.js";
import HistoryData from "./screens/History.js";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Custom drawer component to conditionally render drawer content
const CustomDrawerContent = (props) => {
  const { state, ...rest } = props;
  const newState = { ...state };
  newState.routes = newState.routes.filter(
    (item) => item.name !== "Login" && item.name !== "SplashScreen"
  ); // Filter out login and splash screen routes
  return <SideBar {...props} state={newState} />;
};

// Main Stack navigator for all screens
const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SplashScreen" component={SplashScreen} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="drawer" component={DrawerStack} headerShown={false} />
  </Stack.Navigator>
);

const SecondaryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="History" component={HistoryData} />
    <Stack.Screen name="BoxList" component={BoxList} />
    <Stack.Screen name="List_from_BoxList" component={List_from_BoxList} />
    <Stack.Screen name="ApprovalDetail" component={ApprovalDetail} />
    <Stack.Screen name="Item" component={Item} />
    <Stack.Screen name="DecisionScreen" component={DecisionScreen} />
  </Stack.Navigator>
);

// Drawer Stack navigator for screens that should have a drawer
const DrawerStack = () => (
  <Drawer.Navigator
    drawerType="front"
    initialRouteName="Home"
    drawerContent={CustomDrawerContent}
    drawerContentOptions={{
      activeTintColor: "#e91e63",
      gestureResponseDistance: { horizontal: 25 },
      itemStyle: {
        marginVertical: 10,
        margin: 10,
      },
    }}
    backBehavior={"none"}
    screenOptions={{ headerShown: false }}
  >
    <Drawer.Screen name="Home" component={SecondaryStack} />
    <Drawer.Screen name="History" component={SecondaryStack} />
  </Drawer.Navigator>
);

// Main App function
export default function App() {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}
