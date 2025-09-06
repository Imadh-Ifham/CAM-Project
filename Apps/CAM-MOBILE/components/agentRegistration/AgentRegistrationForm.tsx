import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AgentStatusBadge from "./AgentStatusBadge";

const AgentRegistrationForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [volunteers, setVolunteers] = useState("");
  const [startDate, setStartDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [resources, setResources] = useState("");
  const [pitch, setPitch] = useState("");
  const [pitchHeight, setPitchHeight] = useState(120);
  const [status, setStatus] = useState<string | null>(null);

  const handleRegister = () => {
    setStatus("pending");
    setTimeout(() => setStatus("approved"), 2000);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>🚀 Pitch Your Program Plan</Text>
      <Text style={styles.subtitle}>
        Share your program idea, resources, and how you’ll lead this initiative
        as an agent.
      </Text>

      {/* Section 1: About You */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>👤 About You</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          placeholderTextColor="#9e9e9e"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#9e9e9e"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Section 2: Team */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>👥 Team & Volunteers</Text>
        <TextInput
          style={styles.input}
          placeholder="Number of Volunteers"
          placeholderTextColor="#9e9e9e"
          value={volunteers}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) setVolunteers(text);
          }}
          keyboardType="number-pad"
        />
      </View>

      {/* Section 3: Timeline */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>📅 Timeline</Text>
        <TouchableOpacity
          style={[styles.input, styles.dateInput]}
          activeOpacity={0.8}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: startDate ? "#fff" : "#9e9e9e" }}>
            {startDate ? `Start Date: ${startDate}` : "Select Start Date"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={startDate ? new Date(startDate) : new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setStartDate(selectedDate.toISOString().split("T")[0]);
              }
            }}
          />
        )}
      </View>

      {/* Section 4: Resources & Idea */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>💡 Resources & Idea</Text>
        <TextInput
          style={styles.input}
          placeholder="Resources (e.g. 50kg rice, 100 clothes)"
          placeholderTextColor="#9e9e9e"
          value={resources}
          onChangeText={setResources}
        />
        <TextInput
          style={[styles.input, styles.textArea, { minHeight: pitchHeight }]}
          placeholder="Pitch Your Idea (execution plan)"
          placeholderTextColor="#9e9e9e"
          value={pitch}
          onChangeText={setPitch}
          multiline
          numberOfLines={4}
          onContentSizeChange={(e) =>
            setPitchHeight(Math.max(120, e.nativeEvent.contentSize.height))
          }
        />
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
        <Text style={styles.submitText}>Submit Pitch</Text>
      </TouchableOpacity>

      {status && (
        <View style={{ marginTop: 20 }}>
          <AgentStatusBadge status={status} />
        </View>
      )}
    </ScrollView>
  );
};

export default AgentRegistrationForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#0a0f0a",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fdd835",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#b5e3c7",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 22,
  },
  sectionCard: {
    backgroundColor: "#1c1f1c",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#2e7d32",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#43a047",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#2e7d32",
    backgroundColor: "#121212",
    color: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    fontSize: 16,
  },
  dateInput: {
    justifyContent: "center",
  },
  textArea: {
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#2e7d32",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 8,
  },
  submitText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
});
