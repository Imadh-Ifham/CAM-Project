import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CampaignFormData } from ".";

interface CampaignLocationProps {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
}

const sriLankanDistricts = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Moneragala",
  "Ratnapura",
  "Kegalle",
];

const popularCities = {
  Colombo: [
    "Colombo 01",
    "Colombo 02",
    "Colombo 03",
    "Colombo 04",
    "Colombo 05",
    "Colombo 06",
    "Colombo 07",
    "Mount Lavinia",
    "Dehiwala",
    "Maharagama",
  ],
  Kandy: ["Kandy City", "Peradeniya", "Katugastota", "Gampola", "Nawalapitiya"],
  Galle: ["Galle Fort", "Hikkaduwa", "Unawatuna", "Bentota", "Ambalangoda"],
  Jaffna: ["Jaffna City", "Point Pedro", "Chavakachcheri", "Valvettithurai"],
  Kurunegala: ["Kurunegala City", "Puttalam", "Chilaw", "Kuliyapitiya"],
};

export default function CampaignLocation({
  formData,
  updateFormData,
}: CampaignLocationProps) {
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchDistrict, setSearchDistrict] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const filteredDistricts = sriLankanDistricts.filter((district) =>
    district.toLowerCase().includes(searchDistrict.toLowerCase())
  );

  const availableCities =
    popularCities[formData.district as keyof typeof popularCities] || [];
  const filteredCities = availableCities.filter((city) =>
    city.toLowerCase().includes(searchCity.toLowerCase())
  );

  const handleGetCurrentLocation = () => {
    Alert.alert(
      "Get Current Location",
      "This would use GPS to get your current location. Feature not implemented in demo.",
      [{ text: "OK" }]
    );
  };

  const handleMapSelection = () => {
    Alert.alert(
      "Map Selection",
      "This would open a map interface for location selection. Feature not implemented in demo.",
      [{ text: "OK" }]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Campaign Location</Text>

        {/* District Selection */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>District *</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowDistrictDropdown(!showDistrictDropdown)}
          >
            <Text
              style={[
                styles.dropdownText,
                !formData.district && styles.placeholderText,
              ]}
            >
              {formData.district || "Select District"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>

          {showDistrictDropdown && (
            <View style={styles.dropdown}>
              <TextInput
                style={styles.searchInput}
                value={searchDistrict}
                onChangeText={setSearchDistrict}
                placeholder="Search districts..."
                placeholderTextColor="#666"
              />
              <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                {filteredDistricts.map((district) => (
                  <TouchableOpacity
                    key={district}
                    style={styles.dropdownItem}
                    onPress={() => {
                      updateFormData({ district, city: "" }); // Reset city when district changes
                      setShowDistrictDropdown(false);
                      setSearchDistrict("");
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{district}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* City Selection */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>City/Area *</Text>
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              !formData.district && styles.disabledButton,
            ]}
            onPress={() =>
              formData.district && setShowCityDropdown(!showCityDropdown)
            }
            disabled={!formData.district}
          >
            <Text
              style={[
                styles.dropdownText,
                !formData.city && styles.placeholderText,
              ]}
            >
              {formData.city ||
                (formData.district
                  ? "Select City/Area"
                  : "Select District First")}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>

          {showCityDropdown && availableCities.length > 0 && (
            <View style={styles.dropdown}>
              <TextInput
                style={styles.searchInput}
                value={searchCity}
                onChangeText={setSearchCity}
                placeholder="Search cities..."
                placeholderTextColor="#666"
              />
              <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                {filteredCities.map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={styles.dropdownItem}
                    onPress={() => {
                      updateFormData({ city });
                      setShowCityDropdown(false);
                      setSearchCity("");
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{city}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {showCityDropdown && availableCities.length === 0 && (
            <View style={styles.dropdown}>
              <Text style={styles.noDataText}>
                No cities available for this district
              </Text>
            </View>
          )}
        </View>

        {/* Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Detailed Address</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={formData.address}
            onChangeText={(text) => updateFormData({ address: text })}
            placeholder="Enter detailed address (street, landmarks, etc.)"
            placeholderTextColor="#666"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Location Tools */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location Tools</Text>

        <View style={styles.toolsContainer}>
          <TouchableOpacity
            style={styles.toolButton}
            onPress={handleGetCurrentLocation}
          >
            <View style={styles.toolIcon}>
              <Ionicons name="location" size={24} color="#00ff94" />
            </View>
            <View style={styles.toolContent}>
              <Text style={styles.toolTitle}>Use Current Location</Text>
              <Text style={styles.toolDescription}>
                Get your current GPS location
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={handleMapSelection}
          >
            <View style={styles.toolIcon}>
              <Ionicons name="map" size={24} color="#60a5fa" />
            </View>
            <View style={styles.toolContent}>
              <Text style={styles.toolTitle}>Select on Map</Text>
              <Text style={styles.toolDescription}>
                Choose location from map interface
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Summary */}
      {(formData.district || formData.city || formData.address) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="location-outline" size={20} color="#00ff94" />
              <Text style={styles.summaryTitle}>Campaign Location</Text>
            </View>

            {formData.district && (
              <Text style={styles.summaryText}>
                District: {formData.district}
              </Text>
            )}
            {formData.city && (
              <Text style={styles.summaryText}>City/Area: {formData.city}</Text>
            )}
            {formData.address && (
              <Text style={styles.summaryText}>
                Address: {formData.address}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Location Tips */}
      <View style={styles.tipsContainer}>
        <View style={styles.tipHeader}>
          <Ionicons name="information-circle" size={16} color="#60a5fa" />
          <Text style={styles.tipTitle}>Location Guidelines</Text>
        </View>
        <Text style={styles.tipText}>
          • Provide accurate location details for better resource planning{"\n"}
          • Include nearby landmarks in the address for easier navigation{"\n"}•
          Consider accessibility when selecting campaign locations{"\n"}• Verify
          location details before finalizing the campaign
        </Text>
      </View>
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
  inputContainer: {
    marginBottom: 20,
    position: "relative",
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  dropdownButton: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#111",
    borderColor: "#222",
  },
  dropdownText: {
    color: "#fff",
    fontSize: 16,
  },
  placeholderText: {
    color: "#666",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
  },
  searchInput: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#fff",
    fontSize: 14,
    margin: 8,
  },
  dropdownList: {
    maxHeight: 140,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  dropdownItemText: {
    color: "#fff",
    fontSize: 16,
  },
  noDataText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    padding: 16,
  },
  toolsContainer: {
    gap: 12,
  },
  toolButton: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  toolIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#333",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  toolContent: {
    flex: 1,
  },
  toolTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  toolDescription: {
    color: "#888",
    fontSize: 14,
  },
  summaryCard: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    padding: 16,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  summaryText: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 4,
  },
  tipsContainer: {
    margin: 20,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipTitle: {
    color: "#60a5fa",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  tipText: {
    color: "#bbb",
    fontSize: 13,
    lineHeight: 18,
  },
});
