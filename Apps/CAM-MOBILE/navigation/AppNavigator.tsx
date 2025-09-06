import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import AgentRegistrationScreen from "../screens/AgentRegistrationScreen";
import VolunteerScreen from "../screens/VolunteerScreen";
import AgentHomeScreen from "../screens/AgentHomeScreen";

export type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  AgentRegistrationScreen: undefined;
  VolunteerScreen: undefined;
  AgentHomeScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: "#14532d" }, // dark green
        headerTintColor: "#e0e0e0",
        headerTitleStyle: { fontWeight: "bold", letterSpacing: 1 },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: "📌 Program Details" }}
      />
      <Stack.Screen
        name="AgentRegistrationScreen"
        component={AgentRegistrationScreen}
        options={{ title: "📝 Pitch Your Program" }}
      />
      <Stack.Screen
        name="AgentHomeScreen"
        component={AgentHomeScreen}
        options={{ title: "🌍 My Impact Hub" }}
      />
      <Stack.Screen
        name="VolunteerScreen"
        component={VolunteerScreen}
        options={{ title: "🙌 Volunteer with CAM" }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
