import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/common/Header";

const DetailsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Header title="Details" />
      <Text>This is the details screen.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default DetailsScreen;
