import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import CampaignBasicInfo from "./CampaignBasicInfo";
import CampaignLocation from "./CampaignLocation";
import CampaignResources from "./CampaignResources";
import CampaignSchedule from "./CampaignSchedule";
import CampaignTeam from "./CampaignTeam";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { updateFormData } from "@/src/store/slices/campaignSlice";
import { selectCampaignFormData } from "@/src/store/selectors";
import { CampaignFormData } from "@/src/types/campaign.type";

export default function CreateCampaign() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();

  const campaignFormData = useAppSelector(selectCampaignFormData);

  const steps = [
    { title: "Basic Info", icon: "information-circle" as const },
    { title: "Location", icon: "location" as const },
    { title: "Resources", icon: "cube" as const },
    { title: "Schedule", icon: "calendar" as const },
    { title: "Team", icon: "people" as const },
  ];

  const updateFormDataHandler = (updates: Partial<CampaignFormData>) => {
    dispatch(updateFormData(updates));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to create campaign
      console.log("Creating campaign:", campaignFormData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert("Success!", "Campaign created successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to create campaign. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <CampaignBasicInfo
            formData={campaignFormData}
            updateFormData={updateFormDataHandler}
          />
        );
      case 1:
        return (
          <CampaignLocation
            formData={campaignFormData}
            updateFormData={updateFormDataHandler}
          />
        );
      case 2:
        return (
          <CampaignResources
            formData={campaignFormData}
            updateFormData={updateFormDataHandler}
          />
        );
      case 3:
        return (
          <CampaignSchedule
            formData={campaignFormData}
            updateFormData={updateFormDataHandler}
          />
        );
      case 4:
        return (
          <CampaignTeam
            formData={campaignFormData}
            updateFormData={updateFormDataHandler}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#00ff94" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Campaign</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color="#00ff94" />
        </TouchableOpacity>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.progressStep}>
            <View
              style={[
                styles.progressCircle,
                index <= currentStep && styles.progressCircleActive,
                index === currentStep && styles.progressCircleCurrent,
              ]}
            >
              <Ionicons
                name={step.icon}
                size={16}
                color={index <= currentStep ? "#000" : "#666"}
              />
            </View>
            <Text
              style={[
                styles.progressLabel,
                index <= currentStep && styles.progressLabelActive,
              ]}
            >
              {step.title}
            </Text>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.progressLine,
                  index < currentStep && styles.progressLineActive,
                ]}
              />
            )}
          </View>
        ))}
      </View>

      {/* Step Content */}
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderStepContent()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={isFirstStep}
          style={[
            styles.navButton,
            styles.prevButton,
            isFirstStep && styles.navButtonDisabled,
          ]}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={isFirstStep ? "#666" : "#fff"}
          />
          <Text
            style={[
              styles.navButtonText,
              isFirstStep && styles.navButtonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>
            {currentStep + 1} of {steps.length}
          </Text>
        </View>

        <TouchableOpacity
          onPress={isLastStep ? handleSubmit : handleNext}
          disabled={isSubmitting}
          style={[styles.navButton, styles.nextButton]}
        >
          <Text style={styles.navButtonText}>
            {isSubmitting
              ? "Creating..."
              : isLastStep
              ? "Create Campaign"
              : "Next"}
          </Text>
          {!isLastStep && (
            <Ionicons name="chevron-forward" size={20} color="#000" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  helpButton: {
    padding: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#1a1a1a",
  },
  progressStep: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  progressCircleActive: {
    backgroundColor: "#00ff94",
  },
  progressCircleCurrent: {
    backgroundColor: "#00ff94",
    borderWidth: 2,
    borderColor: "#fff",
  },
  progressLabel: {
    color: "#666",
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
  },
  progressLabelActive: {
    color: "#00ff94",
  },
  progressLine: {
    position: "absolute",
    top: 16,
    left: "60%",
    right: "-40%",
    height: 2,
    backgroundColor: "#333",
  },
  progressLineActive: {
    backgroundColor: "#00ff94",
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#1a1a1a",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  prevButton: {
    backgroundColor: "#333",
  },
  nextButton: {
    backgroundColor: "#00ff94",
  },
  navButtonDisabled: {
    backgroundColor: "#222",
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  navButtonTextDisabled: {
    color: "#666",
  },
  stepIndicator: {
    flex: 1,
    alignItems: "center",
  },
  stepText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
  },
});
