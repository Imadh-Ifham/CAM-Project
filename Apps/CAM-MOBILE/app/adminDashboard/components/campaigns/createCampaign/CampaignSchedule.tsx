import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CampaignFormData } from "@/src/types/campaign.type";

interface CampaignScheduleProps {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
}

export default function CampaignSchedule({
  formData,
  updateFormData,
}: CampaignScheduleProps) {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDuration = () => {
    const startDate =
      typeof formData.startDate === "string"
        ? new Date(formData.startDate)
        : formData.startDate;
    const endDate =
      typeof formData.endDate === "string"
        ? new Date(formData.endDate)
        : formData.endDate;

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const durationOptions = [
    { days: 1, label: "1 Day", description: "Single day campaign" },
    { days: 3, label: "3 Days", description: "Short-term campaign" },
    { days: 7, label: "1 Week", description: "Standard duration" },
    { days: 14, label: "2 Weeks", description: "Extended campaign" },
    { days: 30, label: "1 Month", description: "Long-term campaign" },
    { days: 90, label: "3 Months", description: "Major project" },
  ];

  const setDuration = (days: number) => {
    const startDate =
      typeof formData.startDate === "string"
        ? new Date(formData.startDate)
        : formData.startDate;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);
    updateFormData({ endDate: endDate.toISOString(), expectedDuration: days });
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      // Ensure end date is after start date
      const currentEndDate =
        typeof formData.endDate === "string"
          ? new Date(formData.endDate)
          : formData.endDate;

      if (selectedDate >= currentEndDate) {
        // If start date is after or equal to end date, set end date to start date + 1 day
        const newEndDate = new Date(selectedDate);
        newEndDate.setDate(newEndDate.getDate() + 1);
        updateFormData({
          startDate: selectedDate.toISOString(),
          endDate: newEndDate.toISOString(),
        });
      } else {
        updateFormData({ startDate: selectedDate.toISOString() });
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const currentStartDate =
        typeof formData.startDate === "string"
          ? new Date(formData.startDate)
          : formData.startDate;

      // Ensure end date is after start date
      if (selectedDate <= currentStartDate) {
        // If end date is before or equal to start date, don't update
        return;
      }
      updateFormData({ endDate: selectedDate.toISOString() });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Campaign Timeline */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Campaign Timeline</Text>

        {/* Start Date */}
        <View style={styles.dateContainer}>
          <Text style={styles.label}>Start Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Ionicons name="calendar" size={20} color="#00ff94" />
            <Text style={styles.dateText}>
              {formatDate(formData.startDate)}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {/* End Date */}
        <View style={styles.dateContainer}>
          <Text style={styles.label}>End Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Ionicons name="calendar" size={20} color="#00ff94" />
            <Text style={styles.dateText}>{formatDate(formData.endDate)}</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Duration Display */}
        <View style={styles.durationDisplay}>
          <View style={styles.durationIcon}>
            <Ionicons name="time" size={20} color="#60a5fa" />
          </View>
          <View>
            <Text style={styles.durationText}>Campaign Duration</Text>
            <Text style={styles.durationValue}>{calculateDuration()} days</Text>
          </View>
        </View>
      </View>

      {/* Quick Duration Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Duration Selection</Text>
        <View style={styles.durationGrid}>
          {durationOptions.map((option) => (
            <TouchableOpacity
              key={option.days}
              style={[
                styles.durationCard,
                calculateDuration() === option.days &&
                  styles.durationCardActive,
              ]}
              onPress={() => setDuration(option.days)}
            >
              <Text
                style={[
                  styles.durationLabel,
                  calculateDuration() === option.days &&
                    styles.durationLabelActive,
                ]}
              >
                {option.label}
              </Text>
              <Text style={styles.durationDescription}>
                {option.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Priority Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Priority Settings</Text>

        <View style={styles.priorityCard}>
          <View style={styles.priorityHeader}>
            <View style={styles.priorityIcon}>
              <Ionicons name="warning" size={20} color="#ff4444" />
            </View>
            <View style={styles.priorityContent}>
              <Text style={styles.priorityTitle}>Urgent Campaign</Text>
              <Text style={styles.prioritySubtitle}>
                Mark as urgent for immediate attention
              </Text>
            </View>
            <Switch
              value={formData.isUrgent}
              onValueChange={(value) => updateFormData({ isUrgent: value })}
              trackColor={{ false: "#333", true: "#00ff94" }}
              thumbColor={formData.isUrgent ? "#fff" : "#666"}
            />
          </View>

          {formData.isUrgent && (
            <View style={styles.urgentWarning}>
              <Ionicons name="alert-circle" size={16} color="#ff4444" />
              <Text style={styles.urgentWarningText}>
                This campaign will be prioritized and resources will be
                allocated immediately.
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Schedule Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Schedule Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Ionicons name="play-circle" size={18} color="#4ade80" />
            <Text style={styles.summaryLabel}>Start Date:</Text>
            <Text style={styles.summaryValue}>
              {formatDate(formData.startDate)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="stop-circle" size={18} color="#f472b6" />
            <Text style={styles.summaryLabel}>End Date:</Text>
            <Text style={styles.summaryValue}>
              {formatDate(formData.endDate)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="hourglass" size={18} color="#fbbf24" />
            <Text style={styles.summaryLabel}>Duration:</Text>
            <Text style={styles.summaryValue}>{calculateDuration()} days</Text>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons
              name={formData.isUrgent ? "flash" : "time"}
              size={18}
              color={formData.isUrgent ? "#ff4444" : "#60a5fa"}
            />
            <Text style={styles.summaryLabel}>Priority:</Text>
            <Text
              style={[
                styles.summaryValue,
                formData.isUrgent && styles.urgentText,
              ]}
            >
              {formData.isUrgent ? "URGENT" : "Standard"}
            </Text>
          </View>
        </View>
      </View>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={
            typeof formData.startDate === "string"
              ? new Date(formData.startDate)
              : formData.startDate
          }
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleStartDateChange}
          minimumDate={new Date()}
          textColor="#fff"
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={
            typeof formData.endDate === "string"
              ? new Date(formData.endDate)
              : formData.endDate
          }
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleEndDateChange}
          minimumDate={
            typeof formData.startDate === "string"
              ? new Date(formData.startDate)
              : formData.startDate
          }
          textColor="#fff"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  dateContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateText: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
  },
  durationDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  durationIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#60a5fa20",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  durationText: {
    color: "#bbb",
    fontSize: 14,
  },
  durationValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  durationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  durationCard: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 12,
    width: "48%",
    alignItems: "center",
  },
  durationCardActive: {
    borderColor: "#00ff94",
    backgroundColor: "#0a1a0f",
  },
  durationLabel: {
    color: "#bbb",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  durationLabelActive: {
    color: "#00ff94",
  },
  durationDescription: {
    color: "#666",
    fontSize: 11,
    textAlign: "center",
  },
  priorityCard: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    padding: 16,
  },
  priorityHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  priorityIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#ff444420",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  priorityContent: {
    flex: 1,
  },
  priorityTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  prioritySubtitle: {
    color: "#888",
    fontSize: 14,
  },
  urgentWarning: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
    padding: 12,
    backgroundColor: "#ff444410",
    borderRadius: 8,
    gap: 8,
  },
  urgentWarningText: {
    color: "#ff8888",
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  summaryCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryLabel: {
    color: "#bbb",
    fontSize: 14,
    flex: 1,
  },
  summaryValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  urgentText: {
    color: "#ff4444",
  },
});
