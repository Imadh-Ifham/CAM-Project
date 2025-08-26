import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/common/Header";
import Button from "../components/common/Button";
import FeatureXCard from "../components/featureX/FeatureXCard";

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Header title="Home" />
      <FeatureXCard label="Welcome to Feature X!" />
      <Button title="Go to Details" onPress={() => {}} />
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

export default HomeScreen;
