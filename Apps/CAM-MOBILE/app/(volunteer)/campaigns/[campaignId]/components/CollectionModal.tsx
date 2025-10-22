import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../../src/styles/colors";
import { spacing } from "../../../../../src/styles/spacing";
import { Button } from "../../../../../src/components/ui/Button";

type CollectionModalProps = {
  visible: boolean;
  onClose: () => void;
  collectionItem: {
    resource: string;
    target: number;
    location: string;
    instructions: string;
  };
  onSubmit: (collected: number, notes: string) => void;
};

export const CollectionModal: React.FC<CollectionModalProps> = ({
  visible,
  onClose,
  collectionItem,
  onSubmit,
}) => {
  const [collectedCount, setCollectedCount] = useState("");
  const [notes, setNotes] = useState("");
  const [checkedIn, setCheckedIn] = useState(false);
  const [photosUploaded, setPhotosUploaded] = useState(0);

  const handleCheckIn = () => {
    setCheckedIn(true);
    Alert.alert("Success", "Location check-in successful!");
  };

  const handleUploadPhoto = () => {
    setPhotosUploaded(photosUploaded + 1);
    Alert.alert(
      "Photo Added",
      `Photo ${photosUploaded + 1} uploaded successfully!`
    );
  };

  const handleSubmit = () => {
    const count = parseInt(collectedCount);

    if (!collectedCount || isNaN(count) || count <= 0) {
      Alert.alert(
        "Invalid Input",
        "Please enter a valid number of items collected."
      );
      return;
    }

    if (!checkedIn) {
      Alert.alert(
        "Check-in Required",
        "Please check in at the collection location first."
      );
      return;
    }

    if (count > collectionItem.target) {
      Alert.alert(
        "Exceeded Target",
        `You collected more than the target (${collectionItem.target}). Continue anyway?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: () => {
              onSubmit(count, notes);
              resetForm();
              onClose();
            },
          },
        ]
      );
      return;
    }

    onSubmit(count, notes);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setCollectedCount("");
    setNotes("");
    setCheckedIn(false);
    setPhotosUploaded(0);
  };

  const handleClose = () => {
    if (collectedCount || notes || checkedIn || photosUploaded > 0) {
      Alert.alert(
        "Discard Changes?",
        "You have unsaved progress. Are you sure you want to close?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              resetForm();
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable
        onPress={handleClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.7)",
          justifyContent: "flex-end",
        }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: colors.card,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "90%",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: spacing.lg,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: colors.cardForeground,
                  marginBottom: 4,
                }}
              >
                Collection in Progress
              </Text>
              <Text style={{ color: colors.muted, fontSize: 13 }}>
                {collectionItem.resource}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={{ padding: 8 }}>
              <Ionicons name="close" size={24} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{
              padding: spacing.lg,
              paddingBottom: spacing.xl * 2,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Instructions Reminder */}
            <View
              style={{
                backgroundColor: colors.mutedBackground,
                borderRadius: 12,
                padding: spacing.md,
                marginBottom: spacing.lg,
                borderLeftWidth: 3,
                borderLeftColor: colors.primary,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: spacing.sm,
                }}
              >
                <Ionicons
                  name="information-circle"
                  size={18}
                  color={colors.primary}
                />
                <Text
                  style={{
                    color: colors.cardForeground,
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  Instructions
                </Text>
              </View>
              <Text
                style={{
                  color: colors.muted,
                  fontSize: 13,
                  lineHeight: 20,
                }}
              >
                {collectionItem.instructions}
              </Text>
            </View>

            {/* Location Check-in */}
            <View style={{ marginBottom: spacing.lg }}>
              <Text
                style={{
                  color: colors.cardForeground,
                  fontSize: 15,
                  fontWeight: "600",
                  marginBottom: spacing.md,
                }}
              >
                Location Check-in
              </Text>
              <TouchableOpacity
                onPress={handleCheckIn}
                disabled={checkedIn}
                style={{
                  backgroundColor: checkedIn
                    ? "#1a2b1f"
                    : colors.mutedBackground,
                  borderRadius: 12,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: checkedIn ? colors.green : colors.border,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: checkedIn
                          ? colors.green + "20"
                          : colors.card,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name={checkedIn ? "checkmark-circle" : "location"}
                        size={22}
                        color={checkedIn ? colors.green : colors.primary}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          color: colors.cardForeground,
                          fontSize: 14,
                          fontWeight: "600",
                          marginBottom: 2,
                        }}
                      >
                        {collectionItem.location}
                      </Text>
                      <Text style={{ color: colors.muted, fontSize: 12 }}>
                        {checkedIn
                          ? "Checked in successfully"
                          : "Tap to check in"}
                      </Text>
                    </View>
                  </View>
                  {checkedIn && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={colors.green}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Items Collected */}
            <View style={{ marginBottom: spacing.lg }}>
              <Text
                style={{
                  color: colors.cardForeground,
                  fontSize: 15,
                  fontWeight: "600",
                  marginBottom: spacing.sm,
                }}
              >
                Items Collected
              </Text>
              <Text
                style={{
                  color: colors.muted,
                  fontSize: 12,
                  marginBottom: spacing.sm,
                }}
              >
                Target: {collectionItem.target} items
              </Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  value={collectedCount}
                  onChangeText={setCollectedCount}
                  placeholder="Enter number of items"
                  placeholderTextColor={colors.muted}
                  keyboardType="number-pad"
                  style={{
                    backgroundColor: colors.mutedBackground,
                    borderRadius: 12,
                    padding: spacing.md,
                    paddingRight: 50,
                    fontSize: 16,
                    color: colors.cardForeground,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    right: spacing.md,
                    top: 0,
                    bottom: 0,
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="cube" size={20} color={colors.muted} />
                </View>
              </View>
              {collectedCount && parseInt(collectedCount) > 0 && (
                <View
                  style={{
                    marginTop: spacing.sm,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Ionicons
                    name={
                      parseInt(collectedCount) >= collectionItem.target
                        ? "checkmark-circle"
                        : "information-circle"
                    }
                    size={16}
                    color={
                      parseInt(collectedCount) >= collectionItem.target
                        ? colors.green
                        : colors.primary
                    }
                  />
                  <Text
                    style={{
                      color:
                        parseInt(collectedCount) >= collectionItem.target
                          ? colors.green
                          : colors.primary,
                      fontSize: 12,
                      fontWeight: "500",
                    }}
                  >
                    {parseInt(collectedCount) >= collectionItem.target
                      ? "Target achieved!"
                      : `${
                          collectionItem.target - parseInt(collectedCount)
                        } more to reach target`}
                  </Text>
                </View>
              )}
            </View>

            {/* Photo Upload */}
            <View style={{ marginBottom: spacing.lg }}>
              <Text
                style={{
                  color: colors.cardForeground,
                  fontSize: 15,
                  fontWeight: "600",
                  marginBottom: spacing.md,
                }}
              >
                Documentation (Optional)
              </Text>
              <TouchableOpacity
                onPress={handleUploadPhoto}
                style={{
                  backgroundColor: colors.mutedBackground,
                  borderRadius: 12,
                  padding: spacing.lg,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderStyle: "dashed",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: colors.card,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: spacing.sm,
                  }}
                >
                  <Ionicons name="camera" size={24} color={colors.primary} />
                </View>
                <Text
                  style={{
                    color: colors.cardForeground,
                    fontSize: 14,
                    fontWeight: "600",
                    marginBottom: 4,
                  }}
                >
                  Upload Collection Photo
                </Text>
                <Text style={{ color: colors.muted, fontSize: 12 }}>
                  {photosUploaded > 0
                    ? `${photosUploaded} photo${
                        photosUploaded > 1 ? "s" : ""
                      } uploaded`
                    : "Tap to add photos"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Notes */}
            <View style={{ marginBottom: spacing.lg }}>
              <Text
                style={{
                  color: colors.cardForeground,
                  fontSize: 15,
                  fontWeight: "600",
                  marginBottom: spacing.sm,
                }}
              >
                Additional Notes (Optional)
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Add any observations or issues..."
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: colors.mutedBackground,
                  borderRadius: 12,
                  padding: spacing.md,
                  fontSize: 14,
                  color: colors.cardForeground,
                  borderWidth: 1,
                  borderColor: colors.border,
                  minHeight: 100,
                  textAlignVertical: "top",
                }}
              />
            </View>

            {/* Submit Button */}
            <Button
              onPress={handleSubmit}
              disabled={!checkedIn || !collectedCount}
              style={{
                opacity: !checkedIn || !collectedCount ? 0.5 : 1,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text
                  style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}
                >
                  Complete Collection
                </Text>
              </View>
            </Button>

            {(!checkedIn || !collectedCount) && (
              <Text
                style={{
                  color: colors.muted,
                  fontSize: 12,
                  textAlign: "center",
                  marginTop: spacing.sm,
                }}
              >
                {!checkedIn
                  ? "Check in at location first"
                  : "Enter collected items count"}
              </Text>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
