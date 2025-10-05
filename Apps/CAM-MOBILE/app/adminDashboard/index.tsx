import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import AdminHeader from "./components/AdminHeader";
import StatsOverview from "./components/StatsOverview";
import QuickActions from "./components/QuickActions";
import RecentActivity from "./components/RecentActivity";
import AdminMenu from "./components/AdminMenu";

export default function AdminDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <AdminHeader />

        {/* Stats Overview */}
        <StatsOverview />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Navigation Menu */}
        <AdminMenu />

        {/* Recent Activity */}
        <RecentActivity />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
