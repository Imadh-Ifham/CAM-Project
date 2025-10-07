import React from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/store/store";

export default function RootLayout() {
  // Let Expo Router auto-register routes from the file system
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}
